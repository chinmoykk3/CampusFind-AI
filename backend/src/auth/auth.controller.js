const {
    registerStudent,
    loginUser,
} = require("./auth.service");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } =
            req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required.",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters.",
            });
        }

        const result = await registerStudent({
            name,
            email,
            password,
        });

        res
            .cookie(
                "campusfind_token",
                result.token,
                cookieOptions
            )
            .status(201)
            .json({
                success: true,
                message:
                    "Student account created successfully.",
                data: {
                    user: result.user,
                },
            });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } =
            req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required.",
            });
        }

        const result = await loginUser({
            email,
            password,
        });

        res
            .cookie(
                "campusfind_token",
                result.token,
                cookieOptions
            )
            .status(200)
            .json({
                success: true,
                message: "Login successful.",
                data: {
                    user: result.user,
                },
            });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        res
            .clearCookie("campusfind_token", {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite:
                    process.env.NODE_ENV ===
                        "production"
                        ? "none"
                        : "lax",
            })
            .status(200)
            .json({
                success: true,
                message: "Logout successful.",
            });
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            user: req.user,
        },
    });
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
};