const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    process.env.DB_CONNECT_SECRET
  );
};

module.exports = { connectDB };
