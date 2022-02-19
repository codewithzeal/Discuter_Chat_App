const io = require('socket.io')(8000, {
    cors: {
      origin: 'http://localhost:3000',
    }
  });
console.log("server is running")
users_online=new Set();
users_map={}
contactsToClose={}
io.on("connection",(socket)=>{
    socket.on("request-name",(contacts)=>{
    temp=[]
    for(i=0;i<contacts.length;i++)
    {
      if(users_online.has(contacts[i].id1))
      temp.push(contacts[i].id1)
    }
    socket.emit("get-name",Array.from(temp));
  })

  
  socket.on("new-user",(data)=>{
      contactsToClose[data.uname]=data.con
      users_map[data.uname]=socket.id;
      users_online.add(data.uname);
      for(i=0;i<data.con.length;i++)
      if(users_online.has(data.con[i].id1))
      io.to(users_map[data.con[i].id1]).emit("add-me",data.uname)
    })

    socket.on("send-text",(data)=>{
      io.to(users_map[data.toid]).emit("recieve-text",{content:data.content,giverId:data.myId})
    })

    socket.on("send-files",data=>{
     
      io.to(users_map[data.recv]).emit("receive-files",{data:data.data,giverId:data.giverId})
    })    

    socket.on("disconnect",()=>{
      for (var key in users_map) {
        var value = users_map[key];
        if(value==socket.id){

        for(i=0;i<contactsToClose[key].length;i++)
        io.to(users_map[contactsToClose[key][i].id1]).emit("remove-me",key)
        delete(users_map[key])
        users_online.delete(key)
        break
        }
        
    }
    })

})



 