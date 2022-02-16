var db=require('./Datbase_connect.js')
sql=db.connect()
query="SET GLOBAL max_allowed_packet=1073741824;"
sql.query(query,(err,result)=>{
    if(err)
    {

    }
})
module.exports=sql;