const express = require("express");
const { userAuth } = require("../middleware/auth");
const Chat = require("../models/chat");
const chatRouter = express.Router();

chatRouter.post("/chat",userAuth,async (req,res)=>{
    const fromUser = req.user;
    const {toUserId} = req.body;
    try {
        let chat = await Chat.findOne({participants : {$all : [fromUser._id ,toUserId]}}).populate(
          {  path : "messages.senderId",
            select:"_id firstName lastName photoUrl"}
        );
        if(!chat){
            chat = new Chat({
                participants : [fromUser._id,toUserId],
                messages: [],
            })
        }
        res.status(200).json({data:chat});
    } catch (err) {
        res.status(400).json({message : err.message});
    }
})



module.exports = chatRouter;