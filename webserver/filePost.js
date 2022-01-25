var express=require('express')
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
function makefile(baseImage,send,recv,fname,files)
{
   vals=[]
    const localPath = `F:/BakBak/webserver/uploads/`;
        for(i=0;i<files.length;i++)
        {
            baseImage=files[i];
             const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
            const fileType = baseImage.substring("data:".length,baseImage.indexOf("/"));
            const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
            const base64Data = baseImage.replace(regex, "");
            const filename = fname[i];
            fs.writeFileSync(localPath+filename, base64Data, 'base64'); 
            val=[]
            val.push(send)
            val.push(recv)
            val.push(fname[i])
            vals.push(val)
        }
        query="insert into messages(sender_id,receiver_id,attachment) values ?;"
      sql.query(query,[vals],(err,result)=>{
          if(err)throw err
          else
          {
              res.end("ok")
          }
      })
}
})
module.exports=app