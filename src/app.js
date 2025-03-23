const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { userAuth } = require("./middleware/auth");
const { send } = require("express/lib/response");
const { validate } = require("./utils/validate");
const validator = require('validator');
const cookieParser = require('cookie-parser');



const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());  



app.post("/signup", async (req, res) => {

  try {
    //Step 1) Validate the data
    validate(req);

    //Step 2) Encrypt the password
    const { firstName,lastName,emailId,password } = req.body;

    const hashPassword = await bcrypt.hash(password,10);

    //Create a new instance of the User Model.
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword
    });

    await user.save();
    res.send("User added successfully!!!");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

app.post("/login", async (req,res)=>{
  try{
    const {emailId,password} = req.body;

    // step 1) validate emailId
    const isValidEmailId = validator.isEmail(emailId);
    if(!isValidEmailId){
      throw new Error("Email Id is not valid!!");
    }

    //step 2) check whether email Id is present in the DB.
    const user = await User.findOne({emailId : emailId});

    if(!user){
      throw new Error("Invalid Credentials!");
    }

    //step 3) check password in the db
    const isCorrect = await user.isPasswordCorrect(password);

    if(!isCorrect){
      throw new Error("Invalid Credentials!");
    }
    
    //JWT authentication

    //Step 1) JWT token will generate.
    const token = await user.getJWT();


    //Step 2) This token is wrapped up inside the cookie ans send back to the browser.
    res.cookie("token",token , {expires : new Date(Date.now() + 604800000)});
    res.status(200).send("Login succesfull!!!");

  }
  catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
})

app.get('/profile',userAuth,async (req,res)=>{
  try{
      const user = req.user;
      res.send("User : " + user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
  
})

app.post('/sendConnectionRequest',userAuth, (req,res)=>{

  const user = req.user;
  res.send(user.firstName + " has send a connection Request.");
})


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
