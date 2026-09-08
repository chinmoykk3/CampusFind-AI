const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true, // sparse allows nulls but guarantees uniqueness if it exists
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    verificationOtp: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);