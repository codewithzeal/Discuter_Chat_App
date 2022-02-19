const session = require('express-session') 
var express = require('express')
var app=express.Router()
app.use(express.urlencoded({extended: true}));
app.use(express.json())
var sql=require('./getSql')
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false}))
app.post('/getTempKeys',(req,res)=>{
    uid=req.body.uid
    f_id=req.body.f_id
    if((!uid||!f_id)&&uid==req.session.login)
    res.send("empty")
    else{
    val=[]
    val.push(uid)
    val.push(f_id)
    val.push(f_id)
    val.push(uid)
    var query="select sno,temp_key from contacts where (c_id=? and f_id=?) or (c_id=? and f_id=?);"
    sql.query(query,val,(err,result)=>{
        if(err) throw err
        else
        {
            res.send(result[0].temp_key)
            var query="update contacts set temp_key=NULL where sno='"+result[0].sno+"';"
            sql.query(query,(err,result)=>{
                if(err) throw err
            })
        }
    })
}
})
module.exports=app