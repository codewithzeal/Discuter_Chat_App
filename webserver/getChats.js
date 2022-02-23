var sql=require('./getSql');
var express=require('express')
var app=express.Router()
app.use(express.urlencoded({extended: true}));
app.use(express.json())
const session = require('express-session') 
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false}))
app.post('/getChats',(req,res)=>{
    send=req.body.send;
    recv=req.body.recv;
    if((!send||!recv)&&send==req.session.login)
    res.send("empty")
    else{
        val=[]
        val.push(send)
        val.push(recv)
        val.push(recv)
        val.push(send)
    querry="select message_id,sender_id,receiver_id,text,attachment,extension,ImageBlob,uuid,dateCreated from messages where (sender_id=? and receiver_id=?) or (sender_id=? and receiver_id=?)"
    sql.execute(querry,val,(err,result)=>{
        if(err) throw err
        else
        {
            res.send(result)
        }
    })
}
})

module.exports=app;