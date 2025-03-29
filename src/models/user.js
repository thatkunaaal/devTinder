const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: [
        50,
        "You are trying to enter a dummy name, max length value allowed is 50",
      ],
      minLength: [2, "Name should contain atleast 2 character"],
      validate(val){
        if(!validator.isAlpha(val))
            throw new Error("Name should not contain any numbers or special characters.");
      }
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: [
        50,
        "You are trying to enter a dummy name, max length value allowed is 50",
      ],
      minLength: [2, "Name should contain atleast 2 character"],
      validate(val){
        if(!validator.isAlpha(val))
            throw new Error("Name should not contain any numbers or special characters.");
      }
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(val){
        if(!validator.isEmail(val))
                throw new Error("Email should be in valid email format.");
      }
    },
    password: {
      type: String,
      required: true,
      validate(val){
        if(!validator.isStrongPassword(val)){
            throw new Error("Password should be contain :  minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1");
        }
      }
    },
    age: {
      type: Number,
      min: [18, "Your age should be atleast 18 to register."],
      max: [100, "Your age is not correct, {value}"],
    },
    gender: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value)=>{
            return ["male","female","others"].includes(value);               
        },
        message: `Please specify correct gender: ["male","female","others"]`,
      }
    },
    photoUrl: {
      type: String,
      maxLength: 200,
      default: function(){
        if(this.gender === "male")
            return "https://cdn.pixabay.com/photo/2024/04/09/03/04/ai-generated-8684869_1280.jpg";
        else if(this.gender === "female")
            return "https://img.freepik.com/premium-photo/cute-hacker-operating-laptop-cartoon-vector-icon-illustration-people-technology-icon-isolated-flat_839035-1000961.jpg?w=826"
        else
            return "https://img.freepik.com/premium-photo/png-3d-blue-user-profile-icon-transparent-background_53876-1035305.jpg?w=826"
      },
      validate(val){
        if(!validator.isURL(val))
            throw new Error("Please enter a valid Image URL.");
      }
    },
    about: {
      type: String,
      default: "Nerd developer, but interesting person!!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({"_id" : user._id},"dev@Tinder231",{expiresIn: "1d"});
  return token;
}

userSchema.methods.isPasswordCorrect = async function(password){
  const hashedPassword = this.password;
   return await bcrypt.compare(password,hashedPassword)
}

const User = mongoose.model("User", userSchema);

module.exports = { User };
