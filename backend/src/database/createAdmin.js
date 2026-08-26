const bcrypt = require("bcryptjs");

const env = require("../config/env");
const User = require("../models/User");
const {
    connectDatabase,
    disconnectDatabase,
} = require("../config/database");

const createAdmin = async () => {
    try {
        await connectDatabase();

        const adminEmail = process.env.ADMIN_EMAIL
            ?.trim()
            .toLowerCase();

        const adminName = process.env.ADMIN_NAME
            ?.trim();

        const adminPassword =
            process.env.ADMIN_PASSWORD;

        if (
            !adminEmail ||
            !adminName ||
            !adminPassword
        ) {
            throw new Error(
                "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required."
            );
        }

        if (adminPassword.length < 12) {
            throw new Error(
                "ADMIN_PASSWORD must contain at least 12 characters."
            );
        }

        const existingUser = await User.findOne({
            email: adminEmail,
        });

        if (existingUser) {
            if (existingUser.role === "admin") {
                console.log(
                    "⚠️ An admin account with this email already exists."
                );
            } else {
                console.log(
                    "⚠️ A student account already uses this email."
                );
                console.log(
                    "Admin creation aborted. No account was modified."
                );
            }

            return;
        }

        const passwordHash = await bcrypt.hash(
            adminPassword,
            12
        );

        await User.create({
            name: adminName,
            email: adminEmail,
            passwordHash,
            role: "admin",
            isActive: true,
        });

        console.log(
            "======================================"
        );
        console.log(
            "✅ ADMIN ACCOUNT CREATED"
        );
        console.log(
            "======================================"
        );
        console.log(`Email: ${adminEmail}`);
        console.log(
            "Role: admin"
        );
        console.log(
            "Password: stored as secure hash"
        );
        console.log(
            "======================================"
        );
    } catch (error) {
        console.error(
            "❌ Failed to create admin:"
        );
        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await disconnectDatabase();
    }
};

createAdmin();