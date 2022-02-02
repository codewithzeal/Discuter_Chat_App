var express=require('express')
var app=express.Router()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
var sql=require('./getSql.js')
app.post('/getPublicKey',(req,res)=>{
    id=req.body.id
    query="select publicKey from users where uid='"+id+"';"
    sql.query(query,(err,result)=>{
        if(err)
        {
            res.send({status:"nok"})
        }
        else
        {
            //console.log(result[0].publicKey,id)
            val={
                    status:"ok",
                    pubKey:result[0].publicKey
            }
            res.send(val)
        }
    })

})
module.exports=app