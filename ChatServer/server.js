const io = require('socket.io')(8000, {
    cors: {
      origin: 'http://localhost:3000',
    }
  });
console.log("server is running")
users_online=new Set();
users_map={}
io.on("connection",(socket)=>{
    socket.on("request-name",()=>{
    socket.emit("get-name",Array.from(users_online));
  })

  
  socket.on("new-user",(uname)=>{
      //console.log(name)
      users_map[uname]=socket.id;
      users_online.add(uname);
      socket.broadcast.emit("add-me",uname);
    })

    socket.on("send-text",(data)=>{
      io.to(users_map[data.toid]).emit("recieve-text",{content:data.content,giverId:data.myId})
      //console.log(data.content)
    })

    socket.on("send-files",data=>{
      io.to(users_map[data.recv]).emit("receive-files",data.files)
    })    

    socket.on("disconnect",()=>{
      for (var key in users_map) {
        var value = users_map[key];
        if(value==socket.id){
        delete(users_map[key])
        users_online.delete(key)
        socket.broadcast.emit("remove-me",key);
        break
        }
        
    }
    })

})



 