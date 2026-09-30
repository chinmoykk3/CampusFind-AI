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
        rejectedMatches,
        reportsByCategory,
        reportsByLocation,
        reportsByTime
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Report.countDocuments({ type: "lost" }),
        Report.countDocuments({ type: "found" }),
        Report.countDocuments({ status: "active" }),
        Report.countDocuments({ status: "resolved" }),
        Match.countDocuments({ status: "potential" }),
        Match.countDocuments({ status: "confirmed" }),
        Match.countDocuments({ status: "rejected" }),
        Report.aggregate([
            { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
            { $unwind: '$category' },
            { $group: { _id: '$category.name', count: { $sum: 1 } } },
            { $project: { name: '$_id', count: 1, _id: 0 } }
        ]),
        Report.aggregate([
            { $lookup: { from: 'locations', localField: 'locationId', foreignField: '_id', as: 'location' } },
            { $unwind: '$location' },
            { $group: { _id: '$location.name', count: { $sum: 1 } } },
            { $project: { name: '$_id', count: 1, _id: 0 } }
        ]),
        Report.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 14 },
            { $project: { date: '$_id', count: 1, _id: 0 } }
        ])
    ]);

    const totalMatches = potentialMatches + confirmedMatches + rejectedMatches;
    const matchSuccessRate = totalMatches > 0 ? ((confirmedMatches / totalMatches) * 100).toFixed(1) : 0;
    const recoveryRate = totalLostReports > 0 ? ((resolvedReports / totalLostReports) * 100).toFixed(1) : 0;

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
            recoveryRate: parseFloat(recoveryRate),
            byCategory: reportsByCategory,
            byLocation: reportsByLocation,
            byTime: reportsByTime
        },
        matches: {
            potential: potentialMatches,
            confirmed: confirmedMatches,
            rejected: rejectedMatches,
            successRate: parseFloat(matchSuccessRate)
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

const AuditLog = require("../models/AuditLog");

const exportAuditLogs = async () => {
    // Fetch last 1000 logs for forensic export
    const logs = await AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(1000)
        .populate("actorUserId", "email name role")
        .lean();

    // CSV Headers
    const headers = ["Timestamp", "Admin Email", "Admin Name", "Action Type", "Entity Type", "Entity ID", "IP Address"];

    // Convert to CSV
    const csvRows = logs.map(log => [
        `"${new Date(log.createdAt).toISOString()}"`,
        `"${log.actorUserId?.email || 'System'}"`,
        `"${log.actorUserId?.name || 'System'}"`,
        `"${log.action}"`,
        `"${log.entityType}"`,
        `"${log.entityId}"`,
        `"${log.ipAddress || 'Internal'}"`
    ].join(","));

    return [headers.join(","), ...csvRows].join("\n");
};

module.exports = {
    getDashboardStats,
    getRecentReports,
    getRecentMatches,
    getDashboardData,
    exportAuditLogs,
};