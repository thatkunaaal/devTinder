const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://admin:Kishan231@nodejscluster.ahjdt.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
