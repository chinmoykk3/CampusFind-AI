const AuditLog = require("../models/AuditLog");

/**
 * Creates an audit log entry for administrative actions
 */
const logAdminAction = async ({ req, action, entityType, entityId, details = {} }) => {
    try {
        if (!req.user || req.user.role !== "admin") return;

        await AuditLog.create({
            actorUserId: req.user.id,
            action,
            entityType,
            entityId,
            details,
            ipAddress: req.ip || req.connection?.remoteAddress,
            userAgent: req.headers["user-agent"]
        });
    } catch (error) {
        console.error("Failed to write audit log:", error);
    }
};

module.exports = { logAdminAction };
