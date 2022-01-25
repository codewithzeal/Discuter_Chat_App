var sql=require('./getSql');
var express=require('express')
var app=express.Router()
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.post('/store-message',(req,res)=>{
    check=req.body.check;
    text=req.body.text;
    sender=req.body.sender;
    receiver=req.body.receiver;
    attachment=req.body.attachment;
    query=""
    if(!check)
    {
        query="insert into messages(sender_id,receiver_id,text) VALUES('"+sender+"','"+receiver+"','"+text+"');"
    }
    sql.query(query,(err,result)=>{
        if(err) throw err;
        else
        {
            res.send("ok");
        }
    })
})
module.exports=app