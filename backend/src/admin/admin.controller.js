const {
    getDashboardData,
} = require("./admin.service");

const getDashboard = async (
    req,
    res,
    next
) => {
    try {
        const dashboard =
            await getDashboardData();

        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
};