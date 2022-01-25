var sql=require('./getSql');
var express=require('express')
var app=express.Router()
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.post('/getChats',(req,res)=>{
    send=req.body.send;
    recv=req.body.recv;
    querry="select * from messages where (sender_id='"+send+"' and receiver_id='"+recv+"') or (sender_id='"+recv+"' and receiver_id='"+send+"')"
    sql.query(querry,(err,result)=>{
        if(err) throw err
        else
        {
            res.send(result)
        }
    })
})

module.exports=app;