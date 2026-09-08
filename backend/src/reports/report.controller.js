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