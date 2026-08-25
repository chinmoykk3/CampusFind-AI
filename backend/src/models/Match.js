const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
    {
        lostReportId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
            required: true,
            index: true,
        },

        foundReportId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
            required: true,
            index: true,
        },

        scores: {
            text: {
                type: Number,
                min: 0,
                max: 1,
                default: 0,
            },

            image: {
                type: Number,
                min: 0,
                max: 1,
                default: 0,
            },

            category: {
                type: Number,
                min: 0,
                max: 1,
                default: 0,
            },

            location: {
                type: Number,
                min: 0,
                max: 1,
                default: 0,
            },

            time: {
                type: Number,
                min: 0,
                max: 1,
                default: 0,
            },

            overall: {
                type: Number,
                min: 0,
                max: 1,
                required: true,
            },
        },

        reasons: {
            type: [String],
            default: [],
        },

        status: {
            type: String,
            enum: [
                "potential",
                "reviewed",
                "confirmed",
                "rejected",
            ],
            default: "potential",
            index: true,
        },

        modelVersion: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: "matches",
    }
);

matchSchema.index(
    {
        lostReportId: 1,
        foundReportId: 1,
    },
    {
        unique: true,
    }
);

matchSchema.index({ createdAt: -1 });

module.exports = mongoose.model(
    "Match",
    matchSchema
);