var express=require('express')
var app=express.Router()
app.use(express.urlencoded({extended: true}));
app.use(express.json())
const path = require('path');
const fs = require('fs');
const { SSL_OP_NO_QUERY_MTU } = require('constants');
const directoryPath = path.join(__dirname, 'uploads');
var db=require('./Datbase_connect.js');
var sql=db.connect()
app.post('/getFiles',(req,res)=>{

var query="select * from files where status='true';"
   sql.query(query,(err,result)=>{
       if(err) throw err;
       else
       {
           res.send(result)
       }
   })
})
module.exports=app;