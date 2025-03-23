const express = require("express");
const authRouter = express.Router();
const { validate } = require("../utils/validate");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    //Step 1) Validate the data
    validate(req);

    //Step 2) Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    //Create a new instance of the User Model.
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("User added successfully!!!");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // step 1) validate emailId
    const isValidEmailId = validator.isEmail(emailId);
    if (!isValidEmailId) {
      throw new Error("Email Id is not valid!!");
    }

    //step 2) check whether email Id is present in the DB.
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials!");
    }

    //step 3) check password in the db
    const isCorrect = await user.isPasswordCorrect(password);

    if (!isCorrect) {
      throw new Error("Invalid Credentials!");
    }

    //JWT authentication

    //Step 1) JWT token will generate.
    const token = await user.getJWT();

    //Step 2) This token is wrapped up inside the cookie ans send back to the browser.
    res.cookie("token", token, { expires: new Date(Date.now() + 604800000) });
    res.status(200).send("Login succesfull!!!");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

authRouter.post("/logout",(req,res)=>{
  res.clearCookie("token");
  res.status(200).send("User logged out successfully.");
});

module.exports = authRouter;
