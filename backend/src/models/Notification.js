const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: [
                "potential_match",
                "report_update",
                "account_update",
                "system",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        relatedReportId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
            default: null,
        },

        relatedMatchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
            default: null,
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        collection: "notifications",
    }
);

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);