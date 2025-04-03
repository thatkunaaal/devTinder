const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { status } = require("express/lib/response");
const { Connection, connection } = require("mongoose");
const { User } = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender skills about photoUrl";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //check all the pending connection request
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "about",
      "photoUrl"
    ]);

    res.status(200).json({
      message: "These are the all request sended to you",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedIn = req.user;


    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedIn._id }, { toUserId: loggedIn._id }],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((record) => {
      if (record.fromUserId._id.toString() === loggedIn._id.toString()) {
        return record.toUserId;
      } else return record.fromUserId;
    });

    if (data.length != 0) res.status(200).json({ data: data });
    else res.status(200).json({ message: "Nothing to show here" });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10;
    limit = (limit>50)?50:limit;
    const skip = (page-1)*limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((connection) => {
      hideUserFromFeed.add(connection.fromUserId.toString());
      hideUserFromFeed.add(connection.toUserId.toString());
    });
    const feedData = await User.find({
     $and : [
       { _id : { $nin : Array.from(hideUserFromFeed) } },
       { _id : { $ne : loggedInUser._id } }
     ]
    })

   
    res.status(200).json({ data: feedData });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
