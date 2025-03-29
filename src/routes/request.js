const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUser = req.user;
      const fromUserId = fromUser._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      //check ToUser exist or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found.");
      }

      //check if the status is valid
      const statusAllowed = ["interested", "ignored" , "accepted" , "rejected"];
      const isStatusValid = statusAllowed.includes(status);
      if(!isStatusValid){
        throw new Error("Status is not valid.");
      }

      //same connectionRequest should not exist.
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnection) {
        throw new Error("Already sent the connection request before.");
      }

      const connectionObj = new ConnectionRequest({
        fromUserId: fromUser._id,
        toUserId,
        status,
      });

      await connectionObj.save();

      res.send(
        fromUser.firstName +
          " has " + (status === "interested"? "liked " : "ignored ") + 
          toUser.firstName
      );
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth , async (req,res)=>{

  try {
    const loggedIn = req.user;
    // status validation
    const requestedStatus = req.params.status;
    const allowedStatus = ['accepted','rejected'];
    const isAllowed  = allowedStatus.includes(requestedStatus);
    if(!isAllowed){
      throw new Error("Status is not valid.");
    }

    //requestId validation
    const requestId = req.params.requestId;
    const RequestId = await ConnectionRequest.findOne({"_id": requestId, "toUserId" : loggedIn._id , "status" : "interested"}); 
    // console.log(RequestId);
    if(!RequestId){
      throw new Error("Connection reuest not found");
    }

    //saving the request
    RequestId.status = requestedStatus;
    const data = await RequestId.save();
    res.status(200).json({
      message: `Connection ${requestedStatus} successfuly!!`,
      data : data
    })

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }


})

module.exports = requestRouter;
