const express = require('express');
const {adminAuth,userAuth} = require('./middleware/auth');
const app = express();
const port = 3000;


//middleware
app.use('/admin',adminAuth);

app.get('/admin/getAllData',(req,res)=>{
    res.send("Fetched all the data");
})

app.get('/admin/deleteUser',(req,res)=>{
    res.send("User deleted succesfully!!");
})

app.get('/user/login',(req,res)=>{
    res.send("Login page");
})
app.get('/user/request',userAuth,(req,res)=>{
    res.send("All the request");
})
app.get('/user/connection',userAuth,(req,res)=>{
    res.send("All the connections");
})

app.listen(port,()=>{
    console.log(`Server is started on port ${port}`);
})
