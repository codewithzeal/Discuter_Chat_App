const express=require('express')
const app=express.Router();
const upload=require("./uploadConfig.js")
app.use(express.urlencoded({extended: true}));
app.use(express.json())
sql=db.connect();
var list=[]
app.post('/upload',(req,res)=>{
upload(req,res,(err)=>{
    list=[]
    if(err)
    console.log(err)
    else
    {
        console.log("uploaded",req.files[0].filename);
        res.send("ok")
    }
})
})
module.exports=app;