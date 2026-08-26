const jwt = require("jsonwebtoken");

const env = require("../config/env");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
    try {
        let token = req.cookies?.campusfind_token;

        // Support mobile apps and API clients using:
        // Authorization: Bearer <token>
        if (!token) {
            const authorization =
                req.headers.authorization;

            if (
                authorization &&
                authorization.startsWith("Bearer ")
            ) {
                token = authorization.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(
                token,
                env.jwtSecret
            );
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token.",
            });
        }

        const user = await User.findById(
            decoded.userId
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists.",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated.",
            });
        }

        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        };

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;