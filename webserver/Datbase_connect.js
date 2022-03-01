const mysql=require('mysql2');
var log={
    connect:function()
    {
    
    var config=
    {
        host: 'chat-database.c0tmgbl6t2tm.ap-south-1.rds.amazonaws.com',
        port:"3306",
        user: 'naman',
        password: 'inaman123',
        database: 'chat'
    }
    const db=mysql.createConnection(config);
return db;
}
}
module.exports=log;
