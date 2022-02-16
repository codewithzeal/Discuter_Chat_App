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
    uname=req.body.un
    password=req.body.pwd
    if(!uname||!password)
    {
        res.send("empty")
    }
    else{
        val0=[]
        val1=[]
        val0.push(uname)
        val0.push(password)
        val1.push(uname)

    query="insert into users(uid,password) values (?,?);"
    query1="select * from `users` where `uid`=?;"
    sql.execute(query1,val1,(err,result)=>{
        if(err) throw result
        if(!result.length)
        {
            sql.execute(query,val0,(err,result)=>{
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
}
})
module.exports=app