const socket = require("socket.io");
const crypto = require("crypto");

const getHashSecretKey = (fromUserId,toUserId) => {
    const data = [fromUserId,toUserId].sort().join("_");
    return crypto.createHash("SHA256").update(data).digest("hex");
}

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
        origin: "http://localhost:5173",
      }
  });

  io.on("connection", (socket) => {
    socket.on("joinChat",({fromUserId ,toUserId,fromUserName})=>{
        const roomId = getHashSecretKey(fromUserId,toUserId);
        socket.join(roomId);
        console.log(fromUserName + " has joined the room: "+roomId);
    });
    socket.on("sendMessage",({fromUserId,fromUserName,photoUrl,toUserId,newMessage})=>{
        // console.log(fromUserName + " " +newMessage);
        const roomId = getHashSecretKey(fromUserId,toUserId);
        // console.log(roomId);
        io.to(roomId).emit("receiveMessage",{fromUserName,photoUrl,newMessage});
    })
  });

};

module.exports = initialiseSocket;
