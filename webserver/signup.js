var express = require('express')
var app=express.Router()
app.use(express.static(__dirname + '/public/signup/js'));
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
var sql=require('./getSql.js')
app.get('/home',(req,res)=>{
    res.render('signup.ejs')
})
app.post('/signup',(req,res)=>{
    uname=req.body.un,
    password=req.body.pwd,
    query="insert into users(uid,password)VALUES('"+uname+"','"+password+"');"
    query1="select * from users where uid='"+uname+"';"
    sql.query(query1,(err,result)=>{
        if(err) throw result
        if(!result.length)
        {
            sql.query(query,(err,result)=>{
                if(err) throw err
                else
                {
                    res.send("ok")
                }
            })
        }
        else
        {
            res.send("ae")
        }
    })
    
})
module.exports=app