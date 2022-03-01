const session = require('express-session') 
var crypto = require('crypto');
var express = require('express')
var app=express.Router()
app.use(express.static(__dirname + '/public/login'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false}))


var db=require('./Datbase_connect.js').connect()
function test()
{
    return new Promise((s,r)=>{
        db.ping((err)=>{
            if(err)
            {
                db.connect()
                s()
            }
            else
            {
                s()
            }
        })
    })
}
var sql=require('./getSql.js')
app.get('/login',async(req,res)=>{
    await test()
    res.render('login.ejs');
})
app.post('/login',(req,res)=>{
uid=req.body.uid;
password=req.body.password;
val=[]
val.push(uid)
val.push(crypto.createHash('sha256').update(password).digest('base64'))
var flag=0;
var query="select * from `users` where `uid`=? and `password`=?";
sql.execute(query,val,(err,result)=>{
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
