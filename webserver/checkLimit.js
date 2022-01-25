var express=require('express')
var app=express.Router()
var sql=require('./getSql.js')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.post('/checkLimit',(req,res)=>{
    query="select size_used from users where uid='"+req.body.user+"';"
    sql.query(query,(err,result)=>{
        if(err)throw err
        if((parseInt(result[0].size_used)+parseInt(req.body.sz))>1024*1024*50)
        res.send("not ok")
        else{
        res.send("ok")
        //updateSize(req.body.sz,req.body.user)
        }
    })
})
module.exports=app