const session = require('express-session') 
var express = require('express')
var db=require('./Datbase_connect.js');
var app=express.Router()
app.use(express.static(__dirname + '/public/chat'));
app.use(express.static(__dirname + '/uploads'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false})) 
app.get('/chat/:uid',(req,res)=>{
    if(req.session.login==req.params['uid'])
    {
    res.render('chat.ejs',{uid:req.params['uid']});
    }
    else
    res.redirect('/login')
})
module.exports=app; 