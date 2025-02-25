const mongoose = require("mongoose");
const config = require("./config.json");

const connectDB = async () => {
  try {
    await mongoose.connect(config.connectionString);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("🛑 MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
