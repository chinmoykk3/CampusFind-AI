const {
    createReport,
    listReports,
    getReportById,
    updateReport,
    deleteReport,
} = require("./report.service");

const {
    generateMatchesForNewReport,
} = require("../matching/matching.service");

const Notification = require("../models/Notification");
const User = require("../models/User");

const create = async (
    req,
    res,
    next
) => {
    try {
        const {
            type,
            itemName,
            categoryId,
            description,
            identifyingCharacteristics,
            locationId,
            latitude,
            longitude,
            date,
            time,
        } = req.body;

        if (!type || !itemName || !categoryId || !description || !locationId || !date) {
            return res.status(400).json({
                success: false,
                message: "type, itemName, categoryId, description, locationId and date are required.",
            });
        }

        let images = [];
        if (req.file) {
            // Provide a static path relative to the eventual public directory mounting
            images.push({
                url: `/uploads/${req.file.filename}`,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size
            });
        }

        const report =
            await createReport({
                userId: req.user.id,
                type,
                itemName,
                categoryId,
                description,
                identifyingCharacteristics,
                locationId,
                latitude,
                longitude,
                date,
                time,
                images,
            });

        let matches = [];

        try {
            matches =
                await generateMatchesForNewReport(
                    report._id
                );
        } catch (error) {
            console.error(
                "Matching engine error:",
                error.message
            );
        }

        // ── Notify all admins about the new case ──────────────────
        try {
            const admins = await User.find({ role: "admin", isActive: true }).select("_id").lean();
            if (admins.length > 0) {
                const notifications = admins.map((admin) => ({
                    userId: admin._id,
                    type: "report_update",
                    title: `New ${report.type.toUpperCase()} Report Filed`,
                    message: `"${report.itemName}" reported by ${report.userId?.name || "a user"} in ${report.locationId?.name || "unknown location"}.`,
                    relatedReportId: report._id,
                    isRead: false,
                }));
                await Notification.insertMany(notifications);
            }
        } catch (notifyErr) {
            console.error("Admin notification dispatch failed:", notifyErr.message);
        }

        res.status(201).json({
            success: true,
            message:
                "Report created successfully.",
            data: {
                report,
                matching: {
                    matchesGenerated:
                        matches.length,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const getReports = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await listReports({
                userId: req.user.id,
                role: req.user.role,
                type: req.query.type,
                categoryId:
                    req.query.categoryId,
                locationId:
                    req.query.locationId,
                status: req.query.status,
                search: req.query.search,
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

const getReport = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await getReportById({
                reportId: req.params.id,
                userId: req.user.id,
                role: req.user.role,
            });

        res.status(200).json({
            success: true,
            data: {
                report,
            },
        });
    } catch (error) {
        next(error);
    }
};



const { sendResolutionReport } = require("../utils/mailer");

const update = async (
    req,
    res,
    next
) => {
    try {
        const report =
            await updateReport({
                reportId: req.params.id,
                userId: req.user.id,
                role: req.user.role,
                updates: req.body,
            });

        // Trigger email if status was updated to definitively solved (resolved) or dismissed (closed)
        if (req.body.status && (req.body.status === "resolved" || req.body.status === "closed")) {
            if (report.userId && report.userId.email) {
                // Background async task so we don't block response
                sendResolutionReport(
                    report.userId.email,
                    report.itemName,
                    report.type,
                    req.body.status
                ).catch(console.error);
            }
        }

        res.status(200).json({
            success: true,
            message:
                "Report updated successfully.",
            data: {
                report,
            },
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await deleteReport({
                reportId: req.params.id,
                userId: req.user.id,
                role: req.user.role,
                ipAddress: req.ip,
                userAgent: req.get(
                    "user-agent"
                ),
            });

        res.status(200).json({
            success: true,
            message:
                "Report removed successfully.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getReports,
    getReport,
    update,
    remove,
};