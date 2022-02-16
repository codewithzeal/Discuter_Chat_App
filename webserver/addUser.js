var express=require('express')
var app=express.Router();
var db=require('./Datbase_connect.js');
var sql=db.connect();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.post('/addUser',(req,res)=>{
    var fid=req.body.f_id;
    var uid=req.body.uid;
    if(!fid||!uid)
    {
        res.send("empty error")
    }
    if(fid==uid)
    {
        res.send("invalid");
        return;
    }
    val1=[]
    val2=[]
    val3=[]
    val1.push(fid)
    val2.push(fid)
    val2.push(uid)
    val2.push(uid)
    val2.push(fid)
    val3.push(uid)
    val3.push(fid)
    val3.push(req.body.temp_key)
    var querry1="select uid from users where `uid`=?";
    var queery2="select sno from contacts where c_id=? and f_id=? or c_id=? and f_id=?"
    var querry3="insert into contacts(c_id,f_id,temp_key)values (?,?,?)";
    var flag=0
    sql.execute(querry1,val1,(err,result)=>{
        console.log("here is the result",0)
        if(err) 
        {
            throw err;
        }
        if(result.length==0)
        {
            console.log("hmm")
            res.send("N");
        }
        else
        {
            sql.execute(queery2,val2,(err,result)=>{
                if(!result.length)
                {
                    sql.execute(querry3,val3,(err,result)=>{
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