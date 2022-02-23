var express=require('express')
const session = require('express-session')
var app=express.Router()
var sql=require('./getSql')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false}))
app.post('/download',(req,res)=>{
    if(req.session.login==req.body.uid)
    {
        query="select attachment,extension,Fileblob from messages where uuid=?"
        val=[]
        val.push(req.body.uuid)
        sql.execute(query,val,(err,result)=>{
            if(err)
            throw err
            //console.log(result)
            if(result[0].extension&&result[0].Fileblob)
            {
                res.send({status:"ok",ext:result[0].extension,ab:result[0].Fileblob,attachment:result[0].attachment})
            }
            else
            {
                res.send({status:"empty"})
            }
        })
    }
    else
    {
        res.send("empty")
    }
})
module.exports=app