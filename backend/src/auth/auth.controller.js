const { registerStudent, loginUser, verifyEmailOtp, forgotPassword, verifyResetOtp, resetPassword } = require("./auth.service");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required." });
        if (password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters." });

        const result = await registerStudent({ name, email, password });
        res.status(200).json({ success: true, message: result.message, email: result.email });
    } catch (error) { next(error); }
};

const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });

        const result = await verifyEmailOtp({ email, otp });
        res.cookie("campusfind_token", result.token, cookieOptions).status(200).json({
            success: true,
            message: "Email verified successfully.",
            data: {
                user: result.user,
                token: result.token
            }
        });
    } catch (error) { next(error); }
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
            .cookie("campusfind_token", result.token, cookieOptions)
            .status(200)
            .json({
                success: true,
                message: "Login successful.",
                data: {
                    user: result.user,
                    token: result.token,
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

const forgotPasswordCtrl = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required." });
        const result = await forgotPassword({ email });
        res.status(200).json({ success: true, message: result.message });
    } catch (error) { next(error); }
};

const verifyResetOtpCtrl = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });
        const result = await verifyResetOtp({ email, otp });
        res.status(200).json({ success: true, resetToken: result.resetToken });
    } catch (error) { next(error); }
};

const resetPasswordCtrl = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) return res.status(400).json({ success: false, message: "Reset token and new password are required." });
        const result = await resetPassword({ resetToken, newPassword });
        res.status(200).json({ success: true, message: result.message });
    } catch (error) { next(error); }
};

module.exports = {
    register,
    verifyOtp,
    login,
    logout,
    getCurrentUser,
    forgotPasswordCtrl,
    verifyResetOtpCtrl,
    resetPasswordCtrl,
};