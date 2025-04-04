const  jwt  = require("jsonwebtoken");
const {User} = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //validate the token
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login.");
    }

    //decode the data
    const decodedObj =  jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    //find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found.");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};


module.exports = {
    userAuth
};