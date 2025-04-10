const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const RazorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const membershipPrice = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { User } = require("../models/user");

paymentRouter.post("/payment", userAuth, (req, res) => {
  try {
    const user = req.user;
    const type = req.body.membershipType;
    const keyId = process.env.RAZORPAY_KEY_ID;

    var options = {
      amount: membershipPrice[req.body.membershipType] * 100,
      currency: "INR",
      receipt: "receipt-1",
      notes: {
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        membershipType: req.body.membershipType,
      },
    };

    RazorpayInstance.orders.create(options, async (err, order) => {
      const payment = new Payment({
        userId: user._id,
        orderId: order.id,
        status: order.status,
        amount: order.amount,
        currency: "INR",
        notes: {
          firstName: order.notes.firstName,
          LastName: order.notes.lastName,
          emailId: user.emailId,
          membershipType: order.notes.membershipType,
        },
        receipt: order.receipt,
      });

      const savedPayment = await payment.save();
      res.status(200).json({ order, keyId });
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookBody = req.body;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isValidWebhook = validateWebhookSignature(
      JSON.stringify(webhookBody),
      webhookSignature,
      webhookSecret
    );

    // handles, webhook is not valid
    if (!isValidWebhook) {
        console.log("Invalid payment");
        throw new Error("unsuccessful payment");
    } 
    const payload = req.body.payload;
    //Save payment
    const payment = await Payment.findOne({orderId : payload.payment.entity.order_id})
    payment.status = payload.payment.entity.status;
    await payment.save();

    //Update user after payment
    const user = await User.findById({_id : payment.userId});
    user.isPremium = true;
    user.membershipType = payload.payment.entity.notes.membershipType;
    await user.save();

    res.status(200).json({message : "Succesful"});

  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

paymentRouter.get("/premium/verify",userAuth,async (req,res) => {
    try {
        const user = req.user;
        console.log(user);
        const isPremium = user.isPremium;
        if(isPremium)
            res.status(200).json({"isPremium": isPremium});
        else
            res.status(200).json({"isPremium" : isPremium});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

module.exports = paymentRouter;
