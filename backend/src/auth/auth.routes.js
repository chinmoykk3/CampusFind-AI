const express = require("express");

const {
    register,
    verifyOtp,
    login,
    logout,
    getCurrentUser,
    forgotPasswordCtrl,
    verifyResetOtpCtrl,
    resetPasswordCtrl,
} = require("./auth.controller");

const authenticate = require("../middleware/authenticate");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login/register requests per windowMs
    message: { success: false, message: "Too many authentication attempts from this IP, please try again after 15 minutes." }
});

router.post("/register", authLimiter, register);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/login", authLimiter, login);

// Password Reset Flow
router.post("/forgot-password", authLimiter, forgotPasswordCtrl);
router.post("/verify-reset-otp", authLimiter, verifyResetOtpCtrl);
router.post("/reset-password", authLimiter, resetPasswordCtrl);

router.post("/logout", logout);

router.get(
    "/me",
    authenticate,
    getCurrentUser
);

module.exports = router;