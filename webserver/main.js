var express=require('express');
var app=express();
var session=require('express-session')
app.use(session({secret: 'Your_Secret_Key',resave:false,saveUninitialized:false})) 
var login=require("./login.js");
var chat=require('./chat.js');
var addUser=require('./addUser.js');
var getSql=require('./getSql.js');
var getChats=require('./getChats.js');
var StoreMessage=require('./store-message.js')
var filePost=require('./filePost.js')
var signup=require('./signup.js')
var storePublicKey=require('./storePublicKey.js')
var getPublicKey=require('./getPublicKey.js')
var loadTempKeys=require('./loadTempKey.js')
var downloadFile=require('./downloadFile.js')
app.use(addUser);
app.use(chat)
app.use(login)
app.use(getChats)
app.use(StoreMessage) 
app.use(filePost)
app.use(signup)
app.use(storePublicKey)
app.use(getPublicKey)
app.use(loadTempKeys)
app.use(downloadFile)
app.listen(3000);