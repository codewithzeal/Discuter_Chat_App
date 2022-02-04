const socket=io('http://localhost:8000',{});
var contacts
users_online=new Set();
uid=""
attachment=false
file=""
current_person=""
file_arr=new Array()
imgs=[]
c=0
size=0
fetched={}
var span = document.getElementsByClassName("close")[c];
span.onclick = function() {
  modal.style.display = "none";
}


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

Intitialize();
function Intitialize()
{
uid=getMyInfo()
getMyContacts()
socket.emit("new-user",uid)
}

function getMyContacts()
{
  $.ajax({
    url:'/getUser',
    method:'POST',
    data:JSON.stringify(
      {uid:uid}
    ),
    contentType:'application/json',
    success: (response)=>{
      contacts=response
      attachLists(contacts);
      getUsersOnline();
    }
  });
}

function getUsersOnline()
{
  socket.emit("request-name")
}


function addUser()
{
  fid=document.getElementById("f_id").value.toString();
  getKeys(uid,fid).then((data)=>{
    if(fid)
  {
    $.ajax({
      url: '/addUser',
      method: 'POST',
      contentType: 'application/json',
      data:JSON.stringify({
          f_id: fid,
          uid:uid,
          temp_key:data
      }),
      success: function(response) {
        if(response=="OK"){
        appendContact(fid);
      }
        else if(response=="N")
        alert("InvalidId such a user does not exists");
        else if(response=="already")
        alert("You are already freinds with him");
        else if(response=="invalid")
        alert("You cannot add yourself")
      }
  });
  }

  })
  
}

function attachLists(list)
{
  current_person=list[0].id1;
  setCurrentName(current_person,true)
  getChats()
  for(i=0;i<list.length;i++)
  appendContact(list[i].id1)
}
function appendContact(f_id,status)
{
  if(localStorage.getItem(uid+f_id)){
  var div=document.createElement("div");
  div.setAttribute("class","row m-1 justify-content-center contactDivision");
  div.setAttribute("id",f_id);
  div.setAttribute("onclick","setCurrentName('"+f_id+"','"+false+"')")
  p=document.createElement("p");
  p.setAttribute("id","status"+f_id);
  p.innerHTML=f_id;
  document.getElementById("contactListContainer").appendChild(div)
  document.getElementById(f_id).appendChild(p);
  }
  else
  {
    loadKeys(uid,f_id).then((key)=>{
      localStorage.setItem(uid+f_id,key)
      appendContact(f_id,status)
    })
  }
}
function setStatus()
{

  for(i=0;i<contacts.length;i++)
  {
    if(users_online.has(contacts[i].id1)){
    appendStatus(contacts[i].id1);
    }
  }
}
function appendStatus(id)
{
  document.getElementById("status"+id).innerHTML=id+"(Online)";
}
socket.on("get-name",(u_online)=>{

  users_online=new Set(u_online)
  setStatus();

})
socket.on("add-me",(uname)=>{
  users_online.add(uname)
  appendStatus(uname)
})

socket.on("remove-me",(data)=>{
  document.getElementById("status"+data).innerHTML=data
})
function setCurrentName(fid,val)
{
  if(current_person==fid&&!val)
  return
  else{
  current_person=fid;
  document.getElementById("chatee").innerHTML=fid
  getChats()
  }
}



function sendContent()
{
  var files = document.getElementById('file-attachment').files;
  if(!files.length)
  attachment=false
  else
  {
    attachment=true
  }
  if(!attachment)
  {
      var contentValue=document.getElementById("content").value.toString();
      contentValue=contentValue.replaceAll("<","&lt");
      contentValue=contentValue.replaceAll(">","&gt");
      message={
        content:contentValue,
        toid:current_person
      }
      AppendTextLeft(contentValue)
      encryptMessage(contentValue,current_person).then((mssg)=>{
        
        socket.emit("send-text",{toid:current_person,content:mssg})
        StoreMessage(mssg,uid,current_person,false,"")
      })
      
      
  }
}

socket.on("recieve-text",(message)=>{
AppendTextRight(message)
})
socket.on("receive-files",(data)=>{
  appendFileRight(data)
})
function AppendTextRight(message)
{
  div=document.createElement("div");
  div.setAttribute("class","chatMaterial-right")
  decryptMessage(message,uid,current_person,0).then((data)=>{
    div.innerHTML=data.data
  });
  document.getElementById("append-text").appendChild(div)
}

function AppendTextLeft(message)
{
  div=document.createElement("div");
  div.setAttribute("class","chatMaterial-left")
  div.innerHTML=message
  document.getElementById("append-text").appendChild(div)
}
function StoreMessage(texts,senders,receivers,checks,attachments)
{
  
  $.ajax(
    {
      url:'/store-message',
      method:"POST",
      contentType:'application/json',
      data:JSON.stringify({
        text:texts,
        sender:senders,
        receiver:receivers,
        check:checks,
        attachment:attachments
      }),
      success:function(response)
      {
        if(response!="ok")
        {
          alert("server error occured")
        }
      }
    }
  )
}

function decryptChats(response,uid,fid)
{
 t=response.length-1
  return new Promise((s,r)=>{
    a=[]
    c=0
    var i
    for(i=0;i<response.length;i++)
    if(response[i].text)
    decryptMessage(response[i].text,uid,fid,i).then((data)=>{

     response[data.index].text=data.data
     if(data.index==t)
     s("done")
    })
  })
  
}

function getChats()
{
  if(fetched[current_person])
  return
  result=""
  $.ajax({
    url:'/getChats',
    method:"POST",
    contentType:'application/json',
    data:JSON.stringify({
      send:uid,
      recv:current_person
    }),
    success:function(response)
    {
      
      decryptChats(response,uid,current_person).then((data)=>{
          appendChats(response)
      })
    }
  })
}


function appendChats(result)
{
  dir=""
  document.getElementById("append-text").innerHTML=""
  if(result.length==0)
  {
    document.getElementById("append-text").innerHTML="";
  }
  for(i=0;i<result.length;i++)
  {
    if(result[i].sender_id==uid)
    dir="left"
    else
    dir="right"
    div=document.createElement("div")
    document.getElementById("append-text").appendChild(div); 
    div.setAttribute("class","chatMaterial-"+dir)
    div.setAttribute("id","parrent-div"+i)
    if(result[i].text)
    {
         
          p=document.createElement("p")
          p.setAttribute("class","content-text")
          p.setAttribute("id","text"+i)
          p.innerHTML=result[i].text
          div.appendChild(p)
    }
        else if(result[i].attachment)
        {
          div.setAttribute("class","file-"+dir)
          document.getElementById("append-text").appendChild(div)
          ext=result[i].attachment.split(".")
          ext=ext[ext.length-1]
          if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
          {
            img=document.createElement("img")
            img.setAttribute("src",'/'+result[i].attachment)
            img.setAttribute("style","width:250px;height:250px;margin:0px")
            div.appendChild(img)
          }
          else
          {
            button=document.createElement("button")
            icon=document.createElement("i")
            icon.setAttribute("class","fa fa-download")
            button.innerHTML='<i class="fa fa-download" aria-hidden="true"></i>'
            button.setAttribute("style","width:40px;height:40px;float:right")
            button.setAttribute("onclick","download('"+result[i].attachment+"')")
            p=document.createElement("p")
            p.innerHTML=result[i].attachment
            p.setAttribute("style","float:left;margin:auto;")
            div.appendChild(p)
            div.appendChild(button)
          }
        }
      
        div.style.width="max-content"
        div2=document.getElementById("parrent-div"+i)
        if(div2.offsetWidth<100){
          //alert("Yaha")
            div2.style.width="100px"
          }
          else if(div2.offsetWidth>250)
          div2.style.width="250px"
        div3=document.createElement("div")
        div3.setAttribute("class","status-box")
        div.appendChild(div3)
        p2=document.createElement("p")
        val=result[i].dateCreated
        val=val.replace('T',' ')
        val=val.replace('.000Z','')
        d=new Date(val)
        p2.innerHTML=d.toLocaleTimeString()
        p2.setAttribute("class","status-text")
        div3.appendChild(p2)
  }
}
function doUpload()
{
  dict={}
  c=0
  names=[]
  cnt=0

  var files=document.getElementById("file-attachment").files;
  objects=[]
  for(i=0;i<files.length;i++){
    objects.push(new FileReader())
    size+=files[i].size
}
  
$.ajax(
  { 
    url:"/checkLimit",
    method:"POST",
    contentType:"application/json",
    data:JSON.stringify({
      sz:size,
      user:uid
    }),
    success:function(response)
    {
      if(response=="ok")
      {
        for(i=0;i<files.length;)
        {
          objects[i].readAsDataURL(files[i]);
          objects[i].onload=e=>
          {
            c=objects.indexOf(e.target)
            cnt++;
            file_arr[c]=e.target.result.toString()
            names[c]=files[c].name
            if(cnt==files.length)
            {
              previewIt(file_arr,names)
              document.getElementById("file-attachment").value=''
            }
          }
          i++;
        }
      }
      else
      {
        alert("sorry limit reached")
      }
    }
  }
)

function previewIt(file_urls,file_heads)
{
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  c=0
  imgs=file_heads
  
    val=imgs[c].split(".")
    ext=val[val.length-1]
    if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
    document.getElementById("img").src=file_urls[c]
    else
    document.getElementById("img").src="/abcd.jpg"
}

}
function filePost()
{
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  dict=file_arr
  filec=imgs
  document.getElementById("file-attachment").files=null
  dict=JSON.stringify(dict)
  filecc=JSON.stringify(filec)
  var fd=new FormData()
  fd.append('sender',uid)
  fd.append('recv',current_person)
  fd.append('files',dict)
  fd.append('fname',filecc)
  $.ajax({

    xhr: function() {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              //do your thing or what not
          }
     }, false);

     xhr.addEventListener("progress", function(evt) {
         if (evt.lengthComputable) {
             var percentComplete = evt.loaded / evt.total;
             //Do something with download progress
         }
     }, false);

     return xhr;
  },

    url:'/filePost',
    method:"POST",
    contentType:false,
    processData:false,
    data:fd,
  }).done(response=>{
    if(response=="ok"){
      updateLimit()
      
      appendFileLeft(filec)
      
      file_data={
        files:filec,
        send:uid,
        recv:current_person
      }
      socket.emit("send-files",file_data)
  }
    else
    alert("error")

    imgs=[]
    file_arr=[]
  })
}

function updateLimit()
{
  $.ajax({
    url:'/updateLimit',
    method:'POST',
    contentType:'application/json',
    data:JSON.stringify({
      sz:size,
      user:uid
    }),
    success:function(response)
    {
        size=0;
    },
    error:function(response)
    {
      alert("error in updating limit")
    }
  })
}

function cancelUpload()
{
  imgs=[]
  file_arr=[]
  size=0
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function openup()
{
  document.getElementById("file-attachment").click()
}

function appendFileLeft(file_names)
{
  
  for(i=0;i<file_names.length;i++)
  {
    
    div=document.createElement("div")
    div.setAttribute("class","file-left")
    document.getElementById("append-text").appendChild(div)
    ext=file_names[i].split(".")
    ext=ext[ext.length-1]
    if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
    {
      img=document.createElement("img")
      img.setAttribute("src",'/'+file_names[i])
      img.setAttribute("style","width:250px;height:250px;margin:0px")
      div.appendChild(img)
    }
    else
    {
      button=document.createElement("button")
      icon=document.createElement("i")
      icon.setAttribute("class","fa fa-download")
      button.innerHTML='<i class="fa fa-download" aria-hidden="true"></i>'
      button.setAttribute("style","width:40px;height:40px;float:right")
      button.setAttribute("onclick","download('"+file_names[i]+"')")
      p=document.createElement("p")
      p.innerHTML=file_names[i]
      p.setAttribute("style","float:left")
      div.appendChild(p)
      div.appendChild(button)
    }
  }
}

function appendFileRight(file_names)
{
  
  for(i=0;i<file_names.length;i++)
  {
    
    div=document.createElement("div")
    div.setAttribute("class","file-right")
    document.getElementById("append-text").appendChild(div)
    ext=file_names[i].split(".")
    ext=ext[ext.length-1]
    if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
    {
      img=document.createElement("img")
      img.setAttribute("src",'/'+file_names[i])
      img.setAttribute("style","width:250px;height:250px;margin:0px")
      div.appendChild(img)
    }
    else
    {
      button=document.createElement("button")
      icon=document.createElement("i")
      icon.setAttribute("class","fa fa-download")
      button.innerHTML='<i class="fa fa-download" aria-hidden="true"></i>'
      button.setAttribute("style","width:40px;height:40px;float:right")
      button.setAttribute("onclick","download('"+file_names[i]+"')")
      p=document.createElement("p")
      p.innerHTML=file_names[i]
      p.setAttribute("style","float:left")
      div.appendChild(p)
      div.appendChild(button)
    }
  }
}

window.onbeforeunload = closingCode;
function closingCode(){
  imgs=[]
  
}