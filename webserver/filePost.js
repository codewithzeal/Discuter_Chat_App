var express=require('express')
const { v4: uuidv4 } = require('uuid');
const session = require('express-session') 
window=require('buffer')
var app=express.Router()
var sql=require('./getSql')
fs = require('fs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
var formidable = require('formidable');
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false}))
app.post('/filePost',(req,res)=>{
    //console.log("Ye toh theek hai")
    const form = new formidable.IncomingForm();
    form.maxFileSize = 300 * 1024 * 1024;
    form.parse(req, function(err, fields, files){
        baseImage=fields['file']
        send=fields['sender']
        recv=fields['recv']
        size=0
        fname=JSON.parse(fields['fname'])
        files=JSON.parse(fields['files'])
        extensions=JSON.parse(fields['extensions'])
        if((!send||!recv||!fname||!files||!extensions)&&send==req.session.login)
        {
            res.send("empty")
        }
        else
        makefile(baseImage,send,recv,fname,files,extensions)
        //console.log(fname)
       /*  query="insert into messages('sender_id','receiver_id','attachment')values('"+fields.sender+"','"+fields.recv+"','"+val+"');"
      sql.query(query,(err,result)=>{
          if(err)throw err
          else
          {
              res.send("ok")
          }
      }) */
        
  })



async function b642ab(base64string){
    return Buffer.from(base64string,'base64')
  }

function checkLimit()
{
    return new Promise((s,r)=>{
        query="select size_used from users where uid='"+send+"';"
        sql.query(query,(err,result)=>{
        if(err)throw err
        if((parseInt(result[0].size_used)+parseInt(size))>1024*1024*10){
        s("not ok")
    console.log("not ok")
    }
        else{
        s("ok")
        //updateSize(req.body.sz,req.body.user)
        }
    })
    })
}

function updateLimit()
{
    query="update users set size_used=size_used+'"+size+"' where uid='"+send+"'"
    sql.query(query,(err,result)=>{
        if(err) throw err
    })
}
async function makefile(baseImage,send,recv,fname,files,extensions)
{

        returnIds=[]
        for(i=0;i<files.length;i++)
        {
            flag=0
            size+=files[i].length*(3/4)
            await checkLimit().then((status)=>{
                if(status!="ok"){
                res.send("lr")
                    flag=1
            }
            })
            if(flag==1)
            return
            vals=[]
            val=[]
            var a
/*             ext=files[i].indexOf(',')
            ext=files[i].substr(0,ext+1) */
            
                await b642ab(files[i]).then((ab)=>{
                    val.push(send)
                    val.push(recv)
                    val.push(fname[i])
                    val.push(extensions[i])
                    val.push(ab)
                    a=uuidv4()
                    val.push(a)
                    returnIds.push(a)
                    ext=fname[i].split('.')
                    ext=ext[ext.length-1]
                    if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
                    query="insert into messages(sender_id,receiver_id,attachment,extension,ImageBlob,uuid) values(?,?,?,?,?,?);"
                    else{
                        query="insert into messages(sender_id,receiver_id,attachment,extension,Fileblob,uuid) values (?,?,?,?,?,?);"
                    }
                    sql.execute(query,val,(err,result)=>{
                        if(err)throw err
                        else
                        {
                            //console.log("here")
                           
                            
                        }
                    })
                })
               
           
            
           
        }
        res.send({status:"ok",Ids:returnIds})
        updateLimit()
        
}
})
module.exports=app