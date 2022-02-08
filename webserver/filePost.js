var express=require('express')
window=require('buffer')
var app=express.Router()
var sql=require('./getSql')
fs = require('fs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
var formidable = require('formidable');
app.post('/filePost',(req,res)=>{
    //console.log("Ye toh theek hai")
    const form = new formidable.IncomingForm();
    form.maxFileSize = 300 * 1024 * 1024;
    form.parse(req, function(err, fields, files){
        baseImage=fields['file']
        send=fields['sender']
        recv=fields['recv']
        size=fields['size']
        fname=JSON.parse(fields['fname'])
        files=JSON.parse(fields['files'])

        makefile(baseImage,send,recv,fname,files)
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

async function removeDirt(val)
{
    index=val.indexOf(',')
    val=val.substring(index+1)
    return val
}

async function b642ab(base64string){
    return Buffer.from(base64string,'base64')
  }

function checkLimit()
{
    return new Promise((s,r)=>{
        query="select size_used from users where uid='"+send+"';"
        sql.query(query,(err,result)=>{
        if(err)throw err
        if((parseInt(result[0].size_used)+parseInt(size))>1024*1024*50){
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
async function makefile(baseImage,send,recv,fname,files)
{

    await checkLimit().then((status)=>{
        if(status!="ok")
        res.send("lr")
    })
        for(i=0;i<files.length;i++)
        {
            vals=[]
            val=[]
            ext=files[i].indexOf(',')
            ext=files[i].substr(0,ext+1)
            await removeDirt(files[i]).then((data)=>{
                binData= b642ab(data).then((ab)=>{
                    val.push(send)
                    val.push(recv)
                    val.push(fname[i])
                    val.push(ext)
                    val.push(ab)
                    vals.push(val)
                    ext=fname[i].split('.')
                    ext=ext[ext.length-1]
                    if(ext=='jpg'||ext=='jpeg'||ext=='png'||ext=='tiff')
                    query="insert into messages(sender_id,receiver_id,attachment,extension,ImageBlob) values ?;"
                    else
                    query="insert into messages(sender_id,receiver_id,attachment,extension,Fileblob) values ?;"
                    sql.query(query,[vals],(err,result)=>{
                        if(err)throw err
                        else
                        {
                            console.log("here")
                            res.end("ok")
                            
                        }
                    })
                })
               
            })
            
           
        }
        updateLimit()
        
}
})
module.exports=app