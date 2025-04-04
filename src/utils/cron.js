const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, endOfDay, startOfDay } = require("date-fns");
const sendMail = require("./sendEmail");

const yesterday = subDays(new Date(), 1);
// console.log(yesterday);
const yesterdayDayStart = startOfDay(yesterday);
// console.log(yesterdayDayStart);
const yesterdayDayEnd = endOfDay(yesterday);
// console.log(yesterdayDayEnd);

// Start the job at every 8: 01 AM in the morning.
cron.schedule(" 1 8 * * *", async () => {
  try {
    const yesterdayConnection = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayDayStart,
        $lte: yesterdayDayEnd,
      },
    })
      .populate("toUserId", "firstName lastName emailId")
      .select("toUserId");

    const uniqueEmail = Array.from(
      new Set(
        yesterdayConnection.map((connection) => {
          return connection.toUserId.emailId;
        })
      )
    );

    // console.log(uniqueEmail);

    const subject = "So many requests are waiting for you...";

    const startTime = Date.now();
    for (const email of uniqueEmail) {
      const content = `<h1>Hi ${email},</h1><br/><h2>There is a new request waiting for you on devTinder.com.</h2> <br/> <h3>Kindly do login to view it!!</h3>`;
      const res = await sendMail(email, subject, content);
    }
    const endTime = Date.now();
    console.log(`Time taken:  ${endTime - startTime}`);
    console.log("All email has been sended");
  } catch (err) {
    console.log(err);
  }
});
