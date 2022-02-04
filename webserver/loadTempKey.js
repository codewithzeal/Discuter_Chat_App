const session = require('express-session') 
var express = require('express')
var app=express.Router()
app.use(express.urlencoded({extended: true}));
app.use(express.json())
var sql=require('./getSql')
app.post('/getTempKeys',(req,res)=>{
    uid=req.body.uid
    f_id=req.body.f_id
    var query="select sno,temp_key from contacts where (c_id='"+uid+"' and f_id='"+f_id+"') or (c_id='"+f_id+"' and f_id='"+uid+"');"
    sql.query(query,(err,result)=>{
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
})
module.exports=app