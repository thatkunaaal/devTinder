const express = require("express");
require('dotenv').config()

const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require("http");
const initialiseSocket = require('./utils/socket')

require("./utils/cron");

const app = express();
const port = process.env.PORT;

// *******************Parsing Middleware*********************
app.use(cors({
  origin: ["http://localhost:5173","https://dev-tinder-henna.vercel.app"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");


// ------------------------All Routes------------------------
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter)
app.use("/",paymentRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initialiseSocket(server);

{
  //middleware
  // app.use('/admin',adminAuth);
  // app.get('/admin/getAllData',(req,res)=>{
  //     res.send("Fetched all the data");
  // })
  // app.get('/admin/deleteUser',(req,res)=>{
  //     res.send("User deleted succesfully!!");
  // })
  // app.get('/user/login',(req,res)=>{
  //     res.send("Login page");
  // })
  // app.get('/user/request',userAuth,(req,res)=>{
  //     res.send("All the request");
  // })
  // app.get('/user/connection',userAuth,(req,res)=>{
  //     res.send("All the connections");
  // })
  // error handling
  // app.use('/',(err,req,res,next)=>{
  //     res.status(501).send("Somethign went rwong");
  // })
  // app.get("/getUserData", (req, res) => {
  //   throw new Error("new errur");
  //   res.send("Data...");
  // });
  // app.use('/',(err,req,res,next)=>{
  //     res.status(501).send("Somethign went rwong");
  // })
}

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(port, () => {
      console.log(`Server is started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(
      "Something went wrong while establishing a connection to DB."
    );
  });
