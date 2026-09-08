const express = require("express");

const {
    register,
    verifyOtp,
    login,
    logout,
    getCurrentUser,
} = require("./auth.controller");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.post("/logout", logout);

router.get(
    "/me",
    authenticate,
    getCurrentUser
);

module.exports = router;