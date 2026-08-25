const dotenv = require("dotenv");

dotenv.config();

const requiredVariables = ["MONGODB_URI", "JWT_SECRET"];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongodbUri: process.env.MONGODB_URI,

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  jwtSecret: process.env.JWT_SECRET,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

module.exports = env;
