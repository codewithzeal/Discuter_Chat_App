const session = require('express-session') 
var express = require('express')
var app=express.Router()
app.use(express.static(__dirname + '/public/login'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false}))
var sql=require('./getSql')
app.get('/login',(req,res)=>{
    res.render('login.ejs');
})
app.post('/login',(req,res)=>{
uid=req.body.uid;
password=req.body.password;
var flag=0;
var query="select * from users where uid='"+uid+"' and password='"+password+"'";
sql.query(query,(err,result)=>{
    if(err)
    {
        console.log(err.message);
        res.send("Failed");
    }
    else
    {
        if(result.length)
        {
            req.session.login=result[0].uid;
            res.send(result[0].uid)
        }
        else
        res.send("N");
    }
})
})
module.exports=app;