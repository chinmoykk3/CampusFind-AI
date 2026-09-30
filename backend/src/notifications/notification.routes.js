const express = require("express");
const Notification = require("../models/Notification");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Get user notifications
router.get("/", authenticate, async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        // Also fetch unread count
        const unreadCount = await Notification.countDocuments({ userId: req.user.id, isRead: false });

        res.status(200).json({ success: true, data: { notifications, unreadCount } });
    } catch (error) {
        next(error);
    }
});

// Mark notification as read
router.put("/:id/read", authenticate, async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
});

// Mark ALL of this user's unread notifications as read
router.put("/mark-all-read", authenticate, async (req, res, next) => {
    try {
        const result = await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ success: true, updated: result.modifiedCount });
    } catch (error) {
        next(error);
    }
});

const authorize = require("../middleware/authorize");
const User = require("../models/User");
const { logAdminAction } = require("../utils/audit");

router.get("/admin", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100).populate("userId", "name email").lean();
        res.status(200).json({ success: true, data: notifications });
    } catch (error) { next(error); }
});

// Lightweight unread count for the sidebar badge
router.get("/admin/unread-count", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({ userId: req.user.id, isRead: false });
        res.status(200).json({ success: true, count });
    } catch (error) { next(error); }
});

// Mark ALL of this admin's unread notifications as read in one shot
router.put("/admin/mark-all-read", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const result = await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ success: true, updated: result.modifiedCount });
    } catch (error) { next(error); }
});

router.post("/broadcast", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const { title, message } = req.body;
        const targetUsers = await User.find({ isActive: true, role: "student" }).select("_id").lean();

        const payload = targetUsers.map(u => ({
            userId: u._id,
            type: "system",
            title,
            message
        }));

        await Notification.insertMany(payload);
        await logAdminAction({ req, action: "BROADCAST_ANNOUNCEMENT", entityType: "user", entityId: req.user.id, details: { title, count: payload.length } });

        res.status(201).json({ success: true, message: `Broadcasted to ${payload.length} active users.` });
    } catch (error) { next(error); }
});

module.exports = router;
