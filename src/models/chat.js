const mongoose = require("mongoose");
const { User } = require("./user");

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: User,
    },
    message: { type: String },
  },
  { timestamps: true }
);

const chatSchema = mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, require: true }],
  messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
