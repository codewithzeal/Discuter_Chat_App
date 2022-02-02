var express=require('express')
var app=express.Router()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
var sql=require('./getSql.js')
app.post('/storePublicKey',(req,res)=>{
    
    pubKey=req.body.pubKey
    user=req.body.uname
    query="update users set publicKey='"+pubKey+"' where uid='"+user+"';"
    sql.query(query,(err,result)=>{
        if(err)throw err
        res.send("ok")
    })

})
module.exports=app