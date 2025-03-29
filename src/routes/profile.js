const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateUpdateRequestData } = require("../utils/validate");
const bcrypt = require('bcrypt');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateUpdateRequestData(req);

    const loggedInUser = req.user;
    const updateReqUserData = req.body;

    Object.keys(updateReqUserData).forEach((field) => {
      loggedInUser[field] = updateReqUserData[field];
    });
    
    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your data has been updated succesfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
try {

  const {currentPassword , newPassword} = req.body;
  const loggedInUser = req.user;

  const isPasswordValid = await loggedInUser.isPasswordCorrect(currentPassword);
 
  if(!isPasswordValid){
    throw new Error("Please enter correct password.");
  }

  const newHashedPassword  = await bcrypt.hash(newPassword,10);
  loggedInUser.password = newHashedPassword;

  await loggedInUser.save();

  res.status(200).json({
    "message" : `${loggedInUser.firstName}, your password has been updated successfully.`,
    "data" : newPassword
  })


} catch (err) {
  res.status(400).send("Error: " + err.message);
}

})

module.exports = profileRouter;
