const mysql=require('mysql2');
var log={
    connect:function()
    {
    
    var config=
    {
        host: '',
        port:"3306",
        user: '',
        password: '',
        database: 'chat'
    }
    const db=mysql.createConnection(config);
    db.connect((err)=>{
        if(err)
        {
            console.log('There was an error');
        }
       console.log("connected sucessfully")
       
    })

return db;
}
}
module.exports=log;