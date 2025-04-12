const socket = require("socket.io");
const crypto = require("crypto");
const mongoose =require("mongoose")
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getHashSecretKey = (fromUserId, toUserId) => {
  const data = [fromUserId, toUserId].sort().join("_");
  return crypto.createHash("SHA256").update(data).digest("hex");
};

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ fromUserId, toUserId, fromUserName }) => {
      const roomId = getHashSecretKey(fromUserId, toUserId);
      socket.join(roomId);
      console.log(fromUserName + " has joined the room: " + roomId);
    });
    socket.on(
      "sendMessage",
      async ({ fromUserId, fromUserName, photoUrl, toUserId, newMessage }) => {
        try {
        

          // console.log(fromUserName + " " +newMessage);
          const roomId = getHashSecretKey(fromUserId, toUserId);
          let chat = await Chat.findOne({
            participants: { $all: [fromUserId, toUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [fromUserId, toUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: fromUserId, message: newMessage });
          await chat.save();
          // console.log(roomId);
          io.to(roomId).emit("receiveMessage", {
            fromUserId,
            fromUserName,
            photoUrl,
            newMessage,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
  });
};

module.exports = initialiseSocket;
