const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        actorUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        action: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        entityType: {
            type: String,
            enum: [
                "user",
                "report",
                "category",
                "location",
                "match",
            ],
            required: true,
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        ipAddress: {
            type: String,
            default: null,
        },

        userAgent: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: "auditLogs",
    }
);

auditLogSchema.index({
    entityType: 1,
    entityId: 1,
});

auditLogSchema.index({
    createdAt: -1,
});

module.exports = mongoose.model(
    "AuditLog",
    auditLogSchema
);