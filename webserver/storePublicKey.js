var express=require('express')
var app=express.Router()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
var sql=require('./getSql.js')
app.post('/storePublicKey',(req,res)=>{
    
    pubKey=req.body.pubKey
    user=req.body.uname
    if(!pubKey||!user)
    {
        res.send("empty")
    }
    else{
        val=[]
        val.push(pubKey)
        val.push(user)
    query="update users set publicKey=? where uid=?;"
    sql.query(query,val,(err,result)=>{
        if(err)throw err
        res.send("ok")
    })
    }
})
module.exports=app