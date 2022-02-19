var express=require('express')
var app=express.Router()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
var sql=require('./getSql.js')
const session = require('express-session') 
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false}))
app.post('/getPublicKey',(req,res)=>{
    id=req.body.id
    if(!id&&req.body.uid==req.session.login)
    res.send("empty")
    else
    {
        
    valt=[]
    valt.push(id)
    query="select publicKey from users where `uid`=?;"
    sql.execute(query,valt,(err,result)=>{
        
        if(err)
        {
            res.send({status:"nok"})
        }
        else
        {
            //console.log(result[0].publicKey,id)
            if(result.length!=0){
                        val={
                            status:"ok",
                            pubKey:result[0].publicKey
                    }
                    res.send(val)
                }
            else
            {
                console.log(result)
                res.send({status:"ne"})
            }
        }
    })
    }
})
module.exports=app