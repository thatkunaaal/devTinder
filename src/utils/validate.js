const validator = require("validator");
const ConnectionRequest = require("../models/connectionRequest");

const validateSignUpData = (req) => {
  if (!req.body.firstName || !req.body.lastName) {
    throw new Error("First and last name is mandatory!");
  }
  if (!validator.isEmail(req.body.emailId)) {
    throw new Error("Email should be in valid email format.");
  }
  if (!validator.isAlpha(req.body.firstName) || !validator.isAlpha(req.body.lastName)) {
    throw new Error(
      "Name should not contain any numbers or special characters."
    );
  }
  if(!validator.isStrongPassword(req.body.password)){
    throw new Error("Kindly enter a strong password which contain a special character , a number and whose length should be greater than 6");
  }
  if (req.body.about?.length > 100) {
    throw new Error(
      "Cannot set the about section with length greater than 100."
    );
  }
  if (req.body.skills?.length > 10) {
    throw new Error("Cannot set skills above length 10.");
  }
};

const validateUpdateRequestData = (req)=>{
  const allowedUpdates = ["firstName","lastName","age","gender","photoUrl","about","skills"];
  const user = req.body;

  const isUpdateAllowed = Object.keys(user).every(fields => allowedUpdates.includes(fields));

  if(!isUpdateAllowed){
    throw new Error("User cannot update email-id, once the account is created.");
  }

  if(user.firstName  && !validator.isAlpha(user.firstName) || user.lastName  && !validator.isAlpha(user.lastName)){
    throw new Error("FirstName and LastName should only contain alphabet.");
  }
}



module.exports = { validateSignUpData, validateUpdateRequestData };
