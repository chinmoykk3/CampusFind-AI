const User = require("../models/User");
const Report = require("../models/Report");
const Match = require("../models/Match");

const getDashboardStats = async () => {
    const [
        totalUsers,
        activeUsers,
        totalLostReports,
        totalFoundReports,
        activeReports,
        resolvedReports,
        potentialMatches,
        confirmedMatches,
    ] = await Promise.all([
        User.countDocuments(),

        User.countDocuments({
            isActive: true,
        }),

        Report.countDocuments({
            type: "lost",
        }),

        Report.countDocuments({
            type: "found",
        }),

        Report.countDocuments({
            status: "active",
        }),

        Report.countDocuments({
            status: "resolved",
        }),

        Match.countDocuments({
            status: "potential",
        }),

        Match.countDocuments({
            status: "confirmed",
        }),
    ]);

    return {
        users: {
            total: totalUsers,
            active: activeUsers,
            inactive: totalUsers - activeUsers,
        },

        reports: {
            total: totalLostReports + totalFoundReports,
            lost: totalLostReports,
            found: totalFoundReports,
            active: activeReports,
            resolved: resolvedReports,
        },

        matches: {
            potential: potentialMatches,
            confirmed: confirmedMatches,
        },
    };
};

const getRecentReports = async (limit = 10) => {
    return Report.find()
        .sort({
            createdAt: -1,
        })
        .limit(limit)
        .populate("userId", "name email")
        .populate("categoryId", "name")
        .populate("locationId", "name building")
        .lean();
};

const getRecentMatches = async (limit = 10) => {
    return Match.find()
        .sort({
            createdAt: -1,
        })
        .limit(limit)
        .populate(
            "lostReportId",
            "itemName type status"
        )
        .populate(
            "foundReportId",
            "itemName type status"
        )
        .lean();
};

const getDashboardData = async () => {
    const [
        stats,
        recentReports,
        recentMatches,
    ] = await Promise.all([
        getDashboardStats(),
        getRecentReports(),
        getRecentMatches(),
    ]);

    return {
        stats,
        recentReports,
        recentMatches,
    };
};

module.exports = {
    getDashboardStats,
    getRecentReports,
    getRecentMatches,
    getDashboardData,
};