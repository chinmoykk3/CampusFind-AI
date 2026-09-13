const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const env = require("../config/env");

const SALT_ROUNDS = 12;

const { sendOTP, sendPasswordResetOTP } = require("../utils/mailer");

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn,
        }
    );
};

const registerStudent = async ({
    name,
    email,
    password,
}) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        if (existingUser.isVerified) {
            const error = new Error("An account with this email already exists.");
            error.statusCode = 409;
            throw error;
        } else {
            // Already initialized but not verified. We will fall through and update their OTP
        }
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate a secure 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user;
    if (existingUser && !existingUser.isVerified) {
        existingUser.passwordHash = passwordHash;
        existingUser.name = name.trim();
        existingUser.verificationOtp = otp;
        existingUser.otpExpiresAt = otpExpiresAt;
        await existingUser.save();
        user = existingUser;
    } else {
        user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: "student",
            isVerified: false,
            verificationOtp: otp,
            otpExpiresAt
        });
    }

    // Fire off async email
    sendOTP(normalizedEmail, otp).catch(console.error);

    return {
        email: user.email,
        message: "OTP sent. Verification required."
    };
};

const verifyEmailOtp = async ({ email, otp }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+verificationOtp +otpExpiresAt");

    if (!user) {
        const error = new Error("User record not found.");
        error.statusCode = 404;
        throw error;
    }

    if (user.isVerified) {
        const error = new Error("Account is already verified.");
        error.statusCode = 400;
        throw error;
    }

    if (!user.verificationOtp || user.verificationOtp !== otp) {
        const error = new Error("Invalid verification code.");
        error.statusCode = 401;
        throw error;
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
        const error = new Error("Verification code has expired. Please register again.");
        error.statusCode = 401;
        throw error;
    }

    // Clear OTP fields and verify
    user.isVerified = true;
    user.verificationOtp = null;
    user.otpExpiresAt = null;

    // Generate a unique username from their name
    const baseName = user.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomTag = Math.floor(1000 + Math.random() * 9000);
    user.username = `${baseName}${randomTag}`;

    await user.save();

    const token = generateToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        },
        token,
    };
};

const loginUser = async ({
    email,
    password,
}) => {
    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail,
    }).select("+passwordHash");

    if (!user) {
        const error = new Error(
            "Invalid email or password."
        );

        error.statusCode = 401;

        throw error;
    }

    if (!user.isActive) {
        const error = new Error("Your account has been deactivated.");
        error.statusCode = 403;
        throw error;
    }

    if (!user.isVerified && user.role !== "admin") {
        const error = new Error("Your email has not been verified. Please register again to receive a new OTP.");
        error.statusCode = 403;
        throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        const error = new Error(
            "Invalid email or password."
        );

        error.statusCode = 401;

        throw error;
    }

    const token = generateToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        },
        token,
    };
};

const forgotPassword = async ({ email }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return a success-like message to avoid user enumeration
    if (!user || !user.isVerified) {
        return { message: "If that email is registered, an OTP has been sent." };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.verificationOtp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    sendPasswordResetOTP(normalizedEmail, otp).catch(console.error);

    return { message: "If that email is registered, an OTP has been sent." };
};

const verifyResetOtp = async ({ email, otp }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+verificationOtp +otpExpiresAt");

    if (!user) {
        const error = new Error("Invalid or expired OTP.");
        error.statusCode = 400;
        throw error;
    }

    if (!user.verificationOtp || user.verificationOtp !== otp) {
        const error = new Error("Invalid OTP. Please check the code and try again.");
        error.statusCode = 401;
        throw error;
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
        const error = new Error("OTP has expired. Please request a new one.");
        error.statusCode = 401;
        throw error;
    }

    // Generate a short-lived reset token to authorise the password change step
    const resetToken = jwt.sign(
        { userId: user._id.toString(), purpose: "password_reset" },
        env.jwtSecret,
        { expiresIn: "15m" }
    );

    // Clear the OTP now that it's been verified
    user.verificationOtp = null;
    user.otpExpiresAt = null;
    await user.save();

    return { resetToken };
};

const resetPassword = async ({ resetToken, newPassword }) => {
    let payload;
    try {
        payload = jwt.verify(resetToken, env.jwtSecret);
    } catch (err) {
        const error = new Error("Reset session has expired. Please start over.");
        error.statusCode = 401;
        throw error;
    }

    if (payload.purpose !== "password_reset") {
        const error = new Error("Invalid reset token.");
        error.statusCode = 401;
        throw error;
    }

    if (!newPassword || newPassword.length < 8) {
        const error = new Error("Password must be at least 8 characters.");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(payload.userId);
    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    return { message: "Password has been reset successfully. You can now log in." };
};

module.exports = {
    registerStudent,
    verifyEmailOtp,
    loginUser,
    generateToken,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
};