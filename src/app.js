const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { adminAuth, userAuth } = require("./middleware/auth");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  //Create a new instance of the User Model.
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully!!!");
  } catch (error) {
    res
      .status(400)
      .send("Something went wrong while adding user: " + error.message);
  }
});

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
    app.listen(port, () => {
      console.log(`Server is started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(
      "Something went wrong while establishing a connection to DB."
    );
  });
