const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            default: null,
        },

        originalName: {
            type: String,
            default: null,
        },

        mimeType: {
            type: String,
            default: null,
        },

        size: {
            type: Number,
            default: null,
        },
    },
    {
        _id: false,
    }
);

const reportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ["lost", "found"],
            required: true,
            index: true,
        },

        itemName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150,
        },

        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 2000,
        },

        identifyingCharacteristics: {
            type: [String],
            default: [],
        },

        locationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
            required: true,
            index: true,
        },

        date: {
            type: Date,
            required: true,
        },

        time: {
            type: String,
            default: null,
        },

        images: {
            type: [imageSchema],
            default: [],
        },

        status: {
            type: String,
            enum: [
                "active",
                "resolved",
                "closed",
                "removed",
            ],
            default: "active",
            index: true,
        },
    },
    {
        timestamps: true,
        collection: "reports",
    }
);

reportSchema.index({ createdAt: -1 });
reportSchema.index({ date: -1 });

module.exports = mongoose.model("Report", reportSchema);