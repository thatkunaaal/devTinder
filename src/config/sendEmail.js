const nodemailer = require("nodemailer");

const sendMail = async (toUserId, subject, content) => {
  // Step 1) cration of transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.FROM_EMAIL_ID,
      pass: process.env.GMAIL_PASS,
    },
  });

  // step 2) mail content
  const mailContent = {
    from: process.env.FROM_EMAIL_ID,
    to: toUserId,
    subject: subject,
    html: content,
  };

  // step 3) send mail through transporter
  console.log("sending  email");
  const res = await transporter.sendMail(mailContent);
  console.log(res);
};

module.exports = sendMail;
