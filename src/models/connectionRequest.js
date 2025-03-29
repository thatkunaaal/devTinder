const mongoose = require("mongoose");
const { User } = require("./user");

const connectionReequestScehma = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      require: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        require: true
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignored" , "accepted" , "rejected"],
            message: `{VALUE} is a incorrect status value`
        }
    },
  },
  {
    timestamps: true,
  }
);


connectionReequestScehma.indexes({fromUserId : 1 ,toUserId : 1});

connectionReequestScehma.pre("save",function(next){
  const connectionRequest = this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("You cannot sent request to yourself.");
  }
  next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionReequestScehma);

module.exports = ConnectionRequest;
