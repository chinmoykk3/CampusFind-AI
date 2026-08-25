const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        building: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        area: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "General",
        },

        description: {
            type: String,
            trim: true,
            maxlength: 300,
            default: "",
        },

        latitude: {
            type: Number,
            default: null,
        },

        longitude: {
            type: Number,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        collection: "locations",
    }
);

module.exports = mongoose.model("Location", locationSchema);