const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const env = require("../config/env");

const SALT_ROUNDS = 12;

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
    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        const error = new Error(
            "An account with this email already exists."
        );

        error.statusCode = 409;

        throw error;
    }

    const passwordHash = await bcrypt.hash(
        password,
        SALT_ROUNDS
    );

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "student",
    });

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
        const error = new Error(
            "Your account has been deactivated."
        );

        error.statusCode = 403;

        throw error;
    }

    const passwordMatches =
        await bcrypt.compare(
            password,
            user.passwordHash
        );

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

module.exports = {
    registerStudent,
    loginUser,
    generateToken,
};