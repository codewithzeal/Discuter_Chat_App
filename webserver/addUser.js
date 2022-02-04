var express=require('express')
var app=express.Router();
var db=require('./Datbase_connect.js');
var sql=db.connect();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.post('/addUser',(req,res)=>{
    var fid=req.body.f_id;
    var uid=req.body.uid;
    if(fid==uid)
    {
        res.send("invalid");
        return;
    }
    var querry1="select uid from users where uid='"+fid+"'";
    var queery2="select sno from contacts where c_id='"+fid+"' and f_id='"+uid+"' or c_id='"+uid+"' and f_id='"+fid+"'"
    var querry3="insert into contacts(c_id,f_id,temp_key)values('"+uid+"','"+fid+"','"+req.body.temp_key+"')";
    var flag=0
    sql.query(querry1,(err,result)=>{
        if(err) 
        {
            throw err;
        }
        if(result.length==0)
        {
            console.log(result)
            res.send("N");
        }
        else
        {
            sql.query(queery2,(err,result)=>{
                if(!result.length)
                {
                    sql.query(querry3,(err,result)=>{
                        if(err)throw err;
                        else
                        res.send("OK")
                    })
                }
                else
                {
                    res.send("already")
                }
            })
        }
    })

    
})


app.post('/getUser',(req,res)=>{

    uid=req.body.uid;
    query="select f_id as id1 from contacts where c_id='"+uid+"' union select c_id as id2 from contacts where f_id='"+uid+"'";
    sql.query(query,(err,result)=>{
        //console.log(result[0].f_id)
        if(err) throw err;
        else
        {
            //console.log(result)
            res.send(Array.from(result));
        }
    })
})


module.exports=app;