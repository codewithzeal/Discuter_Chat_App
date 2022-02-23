const socket=io('http://localhost:8000',{});
var contacts
users_online=new Set();
uid=""
attachment=false
file=""
current_person=""
file_arr=new Array()
file_arr_preview=new Array()
imgs=[]
c=0
fetched={}
var resultV
var current_post
data_to_send=[]
extension=[]
index=0
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
async function Intitialize()
{
uid=getMyInfo()
await getMyContacts()
socket.emit("new-user",{con:contacts,uname:uid})
}

function getMyContacts()
{
  return new Promise((s,r)=>{

  
  $.ajax({
    url:'/getUser',
    method:'POST',
    data:JSON.stringify(
      {uid:uid}
    ),
    contentType:'application/json',
    success: (response)=>{
      contacts=response
      s()
      attachLists(contacts);
      getUsersOnline();
    }
  });
})

}

function getUsersOnline()
{
  socket.emit("request-name",contacts)
}


function addUser()
{
  fid=document.getElementById("f_id").value.toString();
  if(localStorage.getItem(uid+fid))
  {
    alert("you already have him as your friend")
    return
  }
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
        else if(response=="empty")
        alert("Sorry some error 1 occured please send in details to: namangns1@gmail.com")
      }
  });
  }

  }).catch((data)=>{
    localStorage.removeItem(uid+fid)
  })
  
}

function attachLists(list)
{
  if(!list.length){
    document.getElementById("loadingModal").style.display="none"
  return
}
  current_person=list[0].id1;
  setCurrentName(current_person,'true')
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
  div.setAttribute("onclick","setCurrentName('"+f_id+"','false')")
  p=document.createElement("p");
  p.setAttribute("id","status"+f_id);
  p.innerHTML=f_id;
  document.getElementById("contactListContainer").appendChild(div)
  document.getElementById(f_id).appendChild(p);
  }
  else
  {
    loadKeys(uid,f_id).then((key)=>{
      if(key){
      localStorage.setItem(uid+f_id,key)
      appendContact(f_id,status)
      }
      else
      {
        alert("key not found for contact "+f_id)
      }
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
  if(current_person==fid&&val!='true')
  return
  else{
  current_person=fid;
  document.getElementById("chatee").innerHTML=fid
  if(document.getElementById(fid))
  {
    a=document.getElementById(fid).style.backgroundColor;
    if(a=="red")
    document.getElementById(fid).style.backgroundColor="lightgreen";
  }
  if(val!="true")
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
      if(contentValue=='')
      {
        return
      }
      contentValue=contentValue.replaceAll("<","&lt");
      contentValue=contentValue.replaceAll(">","&gt");
      message={
        content:contentValue,
        toid:current_person
      }
      AppendText(contentValue,"left")
      var element = document.getElementById("append-text");
      element.scrollTop = element.scrollHeight - element.clientHeight;
      document.getElementById("content").value=""
      encryptMessage(contentValue,current_person).then((mssg)=>{
        
        socket.emit("send-text",{toid:current_person,content:mssg,myId:uid})
        StoreMessage(mssg,uid,current_person,false,"")
      })
      
      
  }
}

socket.on("recieve-text",(message)=>{
if(current_person==message.giverId)
  AppendText(message.content,"right")
else
{
  document.getElementById(message.giverId).style.backgroundColor="red";
}
})
socket.on("receive-files",(data)=>{
  if(current_person==data.giverId){
  appendFileRight(data.data,data.Ids)
a=document.getElementById('append-text')
a.scrollTop=a.scrollHeight-a.clientHeight  
}
else
{
  document.getElementById(data.giverId).style.backgroundColor="red";
}
})

function createBox(data,div)
{
  p=document.createElement("p")
  p.setAttribute("class","content-text")
  p.setAttribute("id","text"+index)
  p.innerHTML=data
  div.appendChild(p)
  div.style.width="max-content"
  div2=document.getElementById("parrent-div"+index)
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
  d=new Date()
  d=d.toLocaleTimeString()
  p2.innerHTML=d
  p2.setAttribute("class","status-text")
  div3.appendChild(p2)
  index++;
}

function AppendText(message,dir)
{
  div=document.createElement("div");
  div.setAttribute("class","chatMaterial-"+dir)
  document.getElementById("append-text").appendChild(div)
  div.setAttribute("id","parrent-div"+index)
  if(dir=="right")
  decryptMessage(message,uid,current_person,0).then((data)=>{
         createBox(data.data,div)
  });
  else
  createBox(message,div)
 
}

/* function AppendTextLeft(message)
{
  div=document.createElement("div");
  div.setAttribute("class","chatMaterial-left")
  div.innerHTML=message
  document.getElementById("append-text").appendChild(div)
} */
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
          alert("server error occured 3 please contact namangns1@gmail.com")
        }
      }
    }
  )
}

async function decryptChats(response,uid,fid)
{
  t=response.length-1
    a=[]
    c=0
    var i
    for(i=0;i<response.length;i++){
    if(response[i].text)
    await decryptMessage(response[i].text,uid,fid,i).then((data)=>{
     response[data.index].text=data.data
    })
  }
  return response 
}

function getChats()
{
  
  if(fetched[current_person])
  return
  result=""
  $.ajax({
    xhr: function() {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              //Do something with upload progress here
          }
     }, false);

     xhr.addEventListener("progress", function(evt) {
         if (evt.lengthComputable) {
             
         }
     }, false);

     return xhr;
  },
    url:'/getChats',
    method:"POST",
    contentType:'application/json',
    data:JSON.stringify({
      send:uid,
      recv:current_person
    }),
    success:function(response)
    {
      if(response=="empty")
      {
        alert("error 4 occurred please send in details to namangns1@gmail.com")
      }
      else{
      document.getElementById("loadingModal").style.display="none"
       decryptChats(response,uid,current_person).then((data)=>{
          appendChats(response)
      })
    }
    }
  })
}

function showWaitingMessage(id)
{
  document.getElementById("p"+id).innerHTML="Fetching..."
}
async function download(id)
{
  if(!id)
  alert("error occured")
  else
  {
    actualText=document.getElementById("p"+id).innerHTML;
    showWaitingMessage(id)
    $.ajax({
      url:'/download',
      method:'POST',
      contentType:"application/json",
      data:JSON.stringify(
        {
          uid:uid,
          uuid:id
        }
      ),
      success:async function(res)
      {
        if(res.status=="ok")
        {
          b64=await _arrayBufferToBase64(res.ab.data).then(async (data1)=>{
            await decryptMessage(data1,uid,current_person,0).then(async (data2)=>{
              console.log(res.ext+data2.data)
              type=res.ext
              type=type.substr(type.indexOf(':')+1,type.indexOf(';'))
              b=await _base64ToArrayBuffer(data2.data).then((data3)=>{
                document.getElementById("p"+id).innerHTML=actualText
                blob=new Blob([data3],{type:type})
                console.log(blob)
                url = window.URL.createObjectURL(blob);
                var a = document.createElement('A');
                a.href = url
                a.download = res.attachment
                a.setAttribute("style","display:none;")
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              })
              
            })
            
          })
        }
        else
        {
          alert("error w2 occurred please refresh or contact namangns1@gmail.com")
          console.log(res)
        }
      },
      error:function(res)
      {
        console.log("error w1 occured please refresh or contact namangns1@gmail.com")
      }
    })
  }
}

async function _arrayBufferToBase64( buffer ) {
  v=new Uint8Array(buffer)
  var binary=''
  for (var i = 0; i < v.length; i++) {
    binary += String.fromCharCode( v[ i ] );
}
  return new Promise((s,r)=>{
    s(window.btoa(binary))
  })
}

async function appendChats(result)
{
  resultV=result

  dir=""
  var i
  document.getElementById("append-text").innerHTML=""
  if(result.length==0)
  {
    document.getElementById("append-text").innerHTML="";
  }
 
  for(i=0;i<result.length;i++)
  {
    check=true
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
            img.setAttribute("style","width:250px;height:250px;margin:0px")
             await _arrayBufferToBase64(result[i].ImageBlob.data).then(async(data1)=>{
               await decryptMessage(data1,uid,current_person,0).then(async(data)=>{
                  div.appendChild(img)
                  
                  img.src=result[i].extension+data.data
                  return true;
                })
                return true;
              })
          }
          else
          {
            check=false
            divWrap=document.createElement("div")
            div.appendChild(divWrap)
            icon=document.createElement("i")
            icon.setAttribute("class","fa fa-download fa-sm")
            icon.setAttribute("id",result[i].uuid)
            icon.setAttribute("onclick","download('"+result[i].uuid+"')")
            icon.setAttribute("style","float:right;position:relative;margin-top:4px;cursor:pointer;")
            p=document.createElement("p")
            p.innerHTML=result[i].attachment
            p.setAttribute("style","float:left;margin:auto;font-size:15px;color:white")
            p.setAttribute("id","p"+result[i].uuid)
            divWrap.appendChild(p)
            divWrap.appendChild(icon)
            div.style.backgroundColor="rgb(236,105,162)"
            clearDiv=document.createElement("div")
            clearDiv.setAttribute("style","clear:both;")
            div.appendChild(clearDiv)
          }
        }
      
        div.style.width="max-content"
        div2=document.getElementById("parrent-div"+i)
        if(div2.offsetWidth<100&&check){
          //alert("Yaha")
            div2.style.width="100px"
          }
          else if(div2.offsetWidth>250&&check){
          div2.style.width="250px"}
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
  a=document.getElementById('append-text')
  a.scrollTop=a.scrollHeight-a.clientHeight
  index=i
}

function readFile(file){
return new Promise((s,r)=>{
  fr=new FileReader()
  fr.readAsDataURL(file);
  fr.onload=async (e)=>
  {
      s(e.target.result.toString())
  }
})
}

async function doUpload()
{
  dict={}
  c=0
  names=[]
  cnt=0

  var files=document.getElementById("file-attachment").files;
  objects=[]

for(i=0;i<files.length;i++)
{
  
  await readFile(files[i]).then(async (fasb64)=>
  {
    a=fasb64
    ac=fasb64
    file_arr_preview.push(a)
    a=a.substring(a.indexOf(',')+1)
    
    await encryptMessage(a,current_person).then((data)=>{
      file_arr.push(data)
      names.push(files[i].name)
      ext=names[i].split(".")
      ext=ext[ext.length-1]
      bext=ac
      bext=bext.substr(0,bext.indexOf(',')+1)
      extension.push(bext)
      if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
      {
        temp={
          append:"no",
          src:data,
          ext:bext
        }
        data_to_send.push(temp)
      }
      else
      {
        temp={
          append:"yes",
          data:names[i]
        }
        data_to_send.push(temp)
      }
    })
   
  })
  
}
imgs=names
previewIt(file_arr_preview,names)
document.getElementById("file-attachment").value=''
}

function previewIt(file_urls,file_heads)
{
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  c=0
  if(file_heads[c]) {
    document.getElementById("fileHead").innerHTML=file_heads[c]
  val=file_heads[c].split(".")
    ext=val[val.length-1]
    if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
    document.getElementById("img").src=file_urls[c]
    else
    document.getElementById("img").src="/abcd.jpg"
  }
}

async function loadBar()
{
  var modal = document.createElement("div")
  modal.setAttribute("id","serverUploadProgress")
  document.getElementById("body").appendChild(modal)
  div=document.createElement("div")
  pdiv=document.createElement("div")
  pdiv.setAttribute("style","width:50vw;margin: auto;position: absolute;top:50%;left: 25%;")
  pdiv.setAttribute("class","progress")
  pdiv.setAttribute("id","parrent-bar")
  modal.appendChild(pdiv)
  div.setAttribute("class","progress-bar bg-warning")
  div.setAttribute("role","progressbar")
  div.setAttribute("aria-valuenow","0")
  div.setAttribute("aria-valuemin","0")
  div.setAttribute("aria-valuemax","100")
  div.setAttribute("style","width:0%")
  div.setAttribute("id","theprogressbar")
  pdiv.append(div)
  button=document.createElement("button")
  button.setAttribute("class","btn btn-danger")
  button.innerHTML="Cancel"
  button.setAttribute("onclick","cancelCurrentPost()")
  button.setAttribute("style","margin: auto;position: absolute;top:53%;left: 25%;")
  modal.appendChild(button)
  return "done"
}

function cancelCurrentPost()
{
  current_post.abort()
  modal=document.getElementById("myModal")
  modal.style.display="none"
}

async function filePost()
{
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  loadBar()
  var modal=document.getElementById("serverUploadProgress")
  div=document.getElementById("theprogressbar")
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
  fd.append('extensions',JSON.stringify(extension))
  var xhr1=$.ajax({

    xhr: function() {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
              
              var percentComplete = evt.loaded / evt.total;
              newprogress=percentComplete*100
              div.style.width=newprogress+"%"
              div.setAttribute("aria-valuenow",newprogress)
              if(newprogress>=100){
              modal.remove()
            }

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
    if(response=="empty")
    {
      alert("error 5 occured send in your complaint to namangns1@gmail.com")
    }
    else if(response.status=="ok"){
      
    appendFileLeft(file_arr_preview,filec,response.Ids).then((data)=>{
       
      socket.emit("send-files",{recv:current_person,data: data_to_send,giverId:uid,Ids:response.Ids})
      file_arr=[]
      imgs=[]
      data_to_send=[]
      file_arr_preview=[]
    })
     
  }
  else if(response=="lr")
  alert("space limit reached sorry")
    else
    alert("error")

    imgs=[]
    file_arr=[]
  })
  current_post=xhr1
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

async function appendFileLeft(file_value,file_names,Ids)
{
  
  for(i=0;i<file_names.length;i++)
  {
    
    div=document.createElement("div")
    div.setAttribute("class","file-left")
    document.getElementById("append-text").appendChild(div)
    div.setAttribute("id","parrent-div"+index)
    
    ext=file_names[i].split(".")
    ext=ext[ext.length-1]
    if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
    {
      img=document.createElement("img")
      img.setAttribute("id",'img'+index)
      div.appendChild(img)
      document.getElementById("img"+index).src=file_value[i]
      img.setAttribute("style","width:250px;height:250px;margin:0px")
      
    }
    else
    {
      check=false
      divWrap=document.createElement("div")
      div.appendChild(divWrap)
      icon=document.createElement("i")
      icon.setAttribute("class","fa fa-download fa-sm")
      icon.setAttribute("style","float:right;position:relative;margin-top:4px;cursor:pointer;")
      icon.setAttribute("onclick","download('"+Ids[i]+"')")
      p=document.createElement("p")
      p.innerHTML=file_names[i]
      p.setAttribute("style","float:left;margin:auto;font-size:15px;color:white")
      divWrap.appendChild(p)
      divWrap.appendChild(icon)
      div.style.backgroundColor="rgb(236,105,162)"
      clearDiv=document.createElement("div")
      clearDiv.setAttribute("style","clear:both;")
      div.appendChild(clearDiv)
    }
    div3=document.createElement("div")
    div3.setAttribute("class","status-box")
    div.appendChild(div3)
    p2=document.createElement("p")
    d=new Date()
    d=d.toLocaleTimeString()
    p2.innerHTML=d
    p2.setAttribute("class","status-text")
    div3.appendChild(p2)
    index++;
  }
  var element = document.getElementById("append-text");
  element.scrollTop = element.scrollHeight - element.clientHeight;
  return true
}

async function appendFileRight(file_names,Ids)
{
  
  for(i=0;i<file_names.length;i++)
  {
    
    div=document.createElement("div")
    div.setAttribute("class","file-right")
    document.getElementById("append-text").appendChild(div)
    if(file_names[i].append=="no")
    {
      img=document.createElement("img")
      img.setAttribute("style","width:250px;height:250px;margin:0px")
      await decryptMessage(file_names[i].src,uid,current_person,0).then((data)=>{
        div.append(img)
        img.src=file_names[i].ext+data.data
      })
    }
    else
    {
      divWrap=document.createElement("div")
      div.appendChild(divWrap)
      icon=document.createElement("i")
      icon.setAttribute("class","fa fa-download fa-sm")
      icon.setAttribute("onclick","download('"+Ids[i]+"')")
      icon.setAttribute("style","float:right;position:relative;margin-top:4px;cursor:pointer;")
      p=document.createElement("p")
      p.innerHTML=file_names[i].data
      p.setAttribute("style","float:left;margin:auto;font-size:15px;color:white")
      divWrap.appendChild(p)
      divWrap.appendChild(icon)
      div.style.backgroundColor="rgb(236,105,162)"
      clearDiv=document.createElement("div")
      clearDiv.setAttribute("style","clear:both;")
      div.appendChild(clearDiv)
    }
    div3=document.createElement("div")
    div3.setAttribute("class","status-box")
    div.appendChild(div3)
    p2=document.createElement("p")
    d=new Date()
    d=d.toLocaleTimeString()
    p2.innerHTML=d
    p2.setAttribute("class","status-text")
    div3.appendChild(p2)
    index++;
  }
}

window.onbeforeunload = closingCode;
function closingCode(){
  imgs=[]
  
}