const mongoose = require("mongoose");

const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

const listUsers = async ({
    search,
    role,
    status,
    page = 1,
    limit = 20,
}) => {
    const currentPage = Math.max(
        Number(page) || 1,
        1
    );

    const currentLimit = Math.min(
        Math.max(Number(limit) || 20, 1),
        100
    );

    const filter = {};

    // Search by name or email
    if (search?.trim()) {
        const searchRegex = new RegExp(
            search.trim(),
            "i"
        );

        filter.$or = [
            { name: searchRegex },
            { email: searchRegex },
        ];
    }

    // Filter by role
    if (
        role &&
        ["student", "admin"].includes(role)
    ) {
        filter.role = role;
    }

    // Filter by account status
    if (status === "active") {
        filter.isActive = true;
    }

    if (status === "inactive") {
        filter.isActive = false;
    }

    const skip =
        (currentPage - 1) * currentLimit;

    const [users, total] =
        await Promise.all([
            User.find(filter)
                .select(
                    "_id name email role profileImage isActive createdAt updatedAt"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(currentLimit)
                .lean(),

            User.countDocuments(filter),
        ]);

    return {
        users,
        pagination: {
            page: currentPage,
            limit: currentLimit,
            total,
            totalPages: Math.ceil(
                total / currentLimit
            ),
        },
    };
};

const getUserById = async (userId) => {
    if (
        !mongoose.Types.ObjectId.isValid(userId)
    ) {
        const error = new Error(
            "Invalid user ID."
        );

        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(userId)
        .select(
            "_id name email role profileImage isActive createdAt updatedAt"
        )
        .lean();

    if (!user) {
        const error = new Error(
            "User not found."
        );

        error.statusCode = 404;
        throw error;
    }

    return user;
};

const updateUserStatus = async ({
    targetUserId,
    actorUserId,
    isActive,
    ipAddress,
    userAgent,
}) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            targetUserId
        )
    ) {
        const error = new Error(
            "Invalid user ID."
        );

        error.statusCode = 400;
        throw error;
    }

    // Prevent an administrator from disabling themselves.
    if (
        targetUserId.toString() ===
        actorUserId.toString()
    ) {
        const error = new Error(
            "You cannot change your own account status."
        );

        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(
        targetUserId
    );

    if (!user) {
        const error = new Error(
            "User not found."
        );

        error.statusCode = 404;
        throw error;
    }

    const previousStatus = user.isActive;

    user.isActive = Boolean(isActive);

    await user.save();

    await AuditLog.create({
        actorUserId,
        action: user.isActive
            ? "USER_ACTIVATED"
            : "USER_DEACTIVATED",
        entityType: "user",
        entityId: user._id,
        details: {
            previousStatus,
            newStatus: user.isActive,
            targetEmail: user.email,
        },
        ipAddress,
        userAgent,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    };
};

const deleteUser = async ({
    targetUserId,
    actorUserId,
    ipAddress,
    userAgent,
}) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            targetUserId
        )
    ) {
        const error = new Error(
            "Invalid user ID."
        );

        error.statusCode = 400;
        throw error;
    }

    // Prevent self-deletion.
    if (
        targetUserId.toString() ===
        actorUserId.toString()
    ) {
        const error = new Error(
            "You cannot delete your own account."
        );

        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(
        targetUserId
    );

    if (!user) {
        const error = new Error(
            "User not found."
        );

        error.statusCode = 404;
        throw error;
    }

    // We don't permanently delete administrators
    // through this endpoint.
    if (user.role === "admin") {
        const error = new Error(
            "Administrator accounts cannot be permanently deleted from this endpoint."
        );

        error.statusCode = 403;
        throw error;
    }

    await User.deleteOne({
        _id: user._id,
    });

    await AuditLog.create({
        actorUserId,
        action: "USER_DELETED",
        entityType: "user",
        entityId: user._id,
        details: {
            deletedName: user.name,
            deletedEmail: user.email,
            deletedRole: user.role,
        },
        ipAddress,
        userAgent,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

module.exports = {
    listUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
};