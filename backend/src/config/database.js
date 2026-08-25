const mongoose = require("mongoose");

const env = require("./env");

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongodbUri);

    console.log("✅ MongoDB connected");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error.message);

    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error disconnecting MongoDB:", error.message);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
