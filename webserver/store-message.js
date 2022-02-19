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
    if(!sender||!receiver||!text)
    {
        res.send("empty")
    }
    else
    { 
    query=""
    val=[]
    val.push(sender)
    val.push(receiver)
    val.push(text)
    if(!check)
    {
        query="insert into messages(sender_id,receiver_id,text) VALUES(?,?,?);"
    }
    sql.execute(query,val,(err,result)=>{
        if(err) throw err;
        else
        {
            res.send("ok");
        }
    })
}
})
module.exports=app