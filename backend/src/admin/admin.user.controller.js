const {
    listUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
} = require("./admin.user.service");

const getUsers = async (
    req,
    res,
    next
) => {
    try {
        const result = await listUsers({
            search: req.query.search,
            role: req.query.role,
            status: req.query.status,
            page: req.query.page,
            limit: req.query.limit,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getUser = async (
    req,
    res,
    next
) => {
    try {
        const user = await getUserById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const changeUserStatus = async (
    req,
    res,
    next
) => {
    try {
        const { isActive } = req.body;

        if (
            typeof isActive !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "isActive must be a boolean.",
            });
        }

        const user =
            await updateUserStatus({
                targetUserId: req.params.id,
                actorUserId: req.user.id,
                isActive,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
            });

        res.status(200).json({
            success: true,
            message: isActive
                ? "User activated successfully."
                : "User deactivated successfully.",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const removeUser = async (
    req,
    res,
    next
) => {
    try {
        const user = await deleteUser({
            targetUserId: req.params.id,
            actorUserId: req.user.id,
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
        });

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUser,
    changeUserStatus,
    removeUser,
};