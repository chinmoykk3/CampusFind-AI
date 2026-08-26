const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const authRoutes = require("./auth/auth.routes");
const adminRoutes = require("./admin/admin.routes");
const adminUserRoutes = require("./admin/admin.user.routes");


const app = express();

// ========================================
// SECURITY
// ========================================

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// ========================================
// BODY PARSING
// ========================================

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

app.use(cookieParser());

// ========================================
// RATE LIMITING
// ========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// ========================================
// HEALTH
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusFind AI API",
    version: "1.0.0",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "campusfind-ai-backend",
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// AUTH ROUTES
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", adminUserRoutes);

// ========================================
// 404
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  res.status(error.statusCode || 500).json({
    success: false,
    message:
      env.nodeEnv === "production"
        ? "Internal server error"
        : error.message,
  });
});

module.exports = app;