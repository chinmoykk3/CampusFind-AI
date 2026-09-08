const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const env = require("../config/env");

const seedClient = async () => {
    try {
        await mongoose.connect(env.mongodbUri);
        console.log("Connected to MongoDB for Client Seed...");

        const clientExists = await User.findOne({ email: "student@campus.edu" });

        if (clientExists) {
            console.log("Client user already exists.");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("password123", salt);

        const newClient = await User.create({
            name: "John Student",
            email: "student@campus.edu",
            passwordHash,
            role: "student",
            isActive: true,
        });

        console.log("Successfully created Client Account:");
        console.log(`Email: ${newClient.email}`);
        console.log(`Password: password123`);
        console.log(`Role: ${newClient.role}`);

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed client account:", error);
        process.exit(1);
    }
};

seedClient();
