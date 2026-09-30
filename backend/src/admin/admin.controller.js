const { getDashboardData, exportAuditLogs } = require("./admin.service");
const AuditLog = require("../models/AuditLog");

const getDashboard = async (req, res, next) => {
    try {
        const dashboard = await getDashboardData();
        res.status(200).json({ success: true, data: dashboard });
    } catch (error) {
        next(error);
    }
};

const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .populate("actorUserId", "name email")
            .lean();

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        next(error);
    }
};

const downloadAuditLogs = async (req, res, next) => {
    try {
        const csvString = await exportAuditLogs();
        res.header('Content-Type', 'text/csv');
        res.attachment('campusfind_ai_telemetry_audit.csv');
        return res.send(csvString);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
    getAuditLogs,
    downloadAuditLogs
};