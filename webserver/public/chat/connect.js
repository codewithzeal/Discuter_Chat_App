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

// When the user clicks anywhere outside of the modal, close it
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
  if(fid)
  {
    $.ajax({
      url: '/addUser',
      method: 'POST',
      contentType: 'application/json',
      data:JSON.stringify({
          f_id: fid,
          uid:uid
      }),
      success: function(response) {
        if(response=="OK")
        appendContact(fid);
        else if(response=="N")
        alert("InvalidId such a user does not exists");
        else if(response=="already")
        alert("You are already freinds with him");
        else if(response=="invalid")
        alert("You cannot add yourself")
      }
  });
  }
}

function attachLists(list)
{
  current_person=list[0].id1;
  setCurrentName(current_person)
  getChats()
  for(i=0;i<list.length;i++)
  appendContact(list[i].id1)
}
function appendContact(f_id,status)
{
  var div=document.createElement("div");
  div.setAttribute("class","row m-1 justify-content-center contactDivision");
  div.setAttribute("id",f_id);
  div.setAttribute("onclick","setCurrentName('"+f_id+"')")
  p=document.createElement("p");
  p.setAttribute("id","status"+f_id);
  p.innerHTML=f_id;
  document.getElementById("contactListContainer").appendChild(div)
  document.getElementById(f_id).appendChild(p);
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
function setCurrentName(fid)
{
  if(current_person==fid)
  return
  else{
  current_person=fid;
  document.getElementById("chatee").innerHTML=fid
  getChats()
  }
}


function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2b64(arrayBuffer) {
  return window.btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
}

function encryptMessage(content,toid)
{
  $.ajax(
    {
      url:'/getPublicKey',
      method:'POST',
      contentType:'application/json',
      data:JSON.stringify(
        {
          id:toid
        }
      ),
      success:function(res)
      {
        if(res.status=="ok")
        {
          const pem =res.pubKey
          const pemHeader = "-----BEGIN PUBLIC KEY-----";
          const pemFooter = "-----END PUBLIC KEY-----";
          const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
          // base64 decode the string to get the binary data
          const binaryDerString = window.atob(pemContents);
          const binaryDer = str2ab(binaryDerString);

          return window.crypto.subtle.importKey(
            "spki",
            binaryDer,
            {
              name: "RSA-OAEP",
              hash: "SHA-256"
            },
            true,
            ["encrypt"]
          ).then((key)=>{
              
              let message = content
              let enc = new TextEncoder();
              enc= enc.encode(message);
              return window.crypto.subtle.encrypt(
                  {
                    name: "RSA-OAEP"
                  },
                  key,
                  enc
                ).then((data)=>{
                  
                  localStorage.setItem("mssg",ab2b64(data))
                  StoreMessage(ab2b64(data),uid,toid,false,"")
                });
          });
        }
        else
        {
          alert("error in encryption")
        }
      },
      error:function(res)
      {
        alert("yaha wala")
        console.log(JSON.stringify(res))
      }
    }
  )
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
      encryptMessage(contentValue,current_person)
      
      socket.emit("send-text",message)
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
  div.innerHTML=message
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
      
      appendChats(response);
    }
  })
}

function appendChats(result)
{
  document.getElementById("append-text").innerHTML=""
  if(result.length==0)
  {
    document.getElementById("append-text").innerHTML="";
  }
  for(i=0;i<result.length;i++)
  {
    div=document.createElement("div")
    if(result[i].sender_id==uid)
      {
        div.setAttribute("class","chatMaterial-left")
        if(result[i].text)
        {
          div.innerHTML=result[i].text;
          //div.setAttribute("style","background-color:rgb(50,143,168);padding:20px;border-radius:10%;")
          document.getElementById("append-text").appendChild(div); 
        }
        else if(result[i].attachment)
        {
          div.setAttribute("class","file-left")
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
            p.setAttribute("style","float:left")
            div.appendChild(p)
            div.appendChild(button)
          }
        }
      }
      else //(result[i].sender_id==current_person)
      {
        div.setAttribute("class","chatMaterial-right")
        if(result[i].text)
        {
          div.innerHTML=result[i].text;
          //div.setAttribute("style","background-color:rgb(50,143,168);padding:20px:border-radius:10%;")
          document.getElementById("append-text").appendChild(div); 
        }
        else if(result[i].attachment)
        {
          div.setAttribute("class","file-right")
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
            p.setAttribute("style","float:left")
            div.appendChild(p)
            div.appendChild(button)
          }
        }
      }
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
        for(i=0;i<files.length;console.log('me'))
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
  console.log(filecc)
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