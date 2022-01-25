var express=require('express')
var app=express.Router()
var sql=require('./getSql.js')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.post('/updateLimit',(req,res)=>{
    query="update users set size_used=size_used+'"+req.body.sz+"' where uid='"+req.body.user+"'"
    sql.query(query,(err,result)=>{
        if(err) throw err
        else
        res.end()
    })
})
module.exports=app