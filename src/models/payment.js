
const { default: mongoose } = require("mongoose");
const mangoose = require("mongoose");
const { User } = require("./user");


const paymentSchema = new mangoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        require : true,
        ref : User
    },
    paymentId:{
        type: String
    },
    orderId : {
       type: String,
       require:true 
    },
    status : {
        type: String,
        require: true
    },
    amount : {
        type: Number,
        required :true
    },
    currency: {
        type: String,
        required : true
    },
    notes: {
        firstName : {
            type: String
        },
        LastName : {
            type: String
        },
        membershipType : {
            type: String
        }
    },
    receipt: {
        type: String,
        require:true
    }
},{timestamps:true})

module.exports = mangoose.model("Payment",paymentSchema);