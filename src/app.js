const express = require('express');

const app = express();
const port = 3000;


app.use('/',(req,res)=>{
    res.send("Hello from the home server");
})
app.use('/test',(req,res)=>{
    res.send("Hello from the test server");
})
app.use('/about',(req,res)=>{
    res.send("Hello from the about server");
})
app.use('/profile',(req,res)=>{
    res.send("Hello from the profile server");
})


app.listen(port,()=>{
    console.log(`Server is started on port ${port}`);
})
