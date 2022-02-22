var express=require('express')
const session = require('express-session')
var app=express.Router()
var sql=require('./getSql')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false}))
app.post('/download',(req,res)=>{
    uid=req.body.uid
    if(req.session.login==uid)
    {
        query="select extension Fileblob from messages where message_id=?"
        sql.execute(query,[sno],(err,result)=>{
            if(err)
            throw err
            if(result[0].extension&&result[0].Fileblob)
            {
                res.send({ext:result[0].extension,ab:result[0].Fileblob})
            }
            else
            {
                result.send("empty")
            }
        })
    }
    else
    {
        res.send("empty")
    }
})