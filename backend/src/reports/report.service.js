const mongoose = require("mongoose");

const Report = require("../models/Report");
const Category = require("../models/Category");
const Location = require("../models/Location");
const AuditLog = require("../models/AuditLog");

const validateObjectId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(
            `Invalid ${fieldName}.`
        );

        error.statusCode = 400;
        throw error;
    }
};

const createReport = async ({
    userId,
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
    images = [],   // ← accept uploaded image metadata from the controller
}) => {
    if (!["lost", "found"].includes(type)) {
        const error = new Error(
            'Report type must be either "lost" or "found".'
        );

        error.statusCode = 400;
        throw error;
    }

    validateObjectId(categoryId, "category ID");
    validateObjectId(locationId, "location ID");

    const category = await Category.findOne({
        _id: categoryId,
        isActive: true,
    });

    if (!category) {
        const error = new Error(
            "Category not found or inactive."
        );

        error.statusCode = 400;
        throw error;
    }

    const location = await Location.findOne({
        _id: locationId,
        isActive: true,
    });

    if (!location) {
        const error = new Error(
            "Location not found or inactive."
        );

        error.statusCode = 400;
        throw error;
    }

    const reportData = {
        userId,
        type,
        itemName: itemName.trim(),
        categoryId,
        description: description.trim(),
        identifyingCharacteristics:
            Array.isArray(identifyingCharacteristics)
                ? identifyingCharacteristics
                    .map((item) => String(item).trim())
                    .filter(Boolean)
                : [],
        locationId,
        date,
        time: time || null,
        images: Array.isArray(images) ? images : [],
        status: "active",
    };

    if (latitude !== undefined && longitude !== undefined) {
        reportData.geoCoordinates = {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };
    }

    const report = await Report.create(reportData);

    return Report.findById(report._id)
        .populate("categoryId", "name slug")
        .populate(
            "locationId",
            "name building area"
        )
        .populate("userId", "name email")
        .lean();
};

const listReports = async ({
    userId,
    role,
    type,
    categoryId,
    locationId,
    status,
    search,
    page = 1,
    limit = 20,
}) => {
    const currentPage = Math.max(
        Number(page) || 1,
        1
    );

    const currentLimit = Math.min(
        Math.max(Number(limit) || 20, 1),
        100
    );

    const filter = {};

    /*
     * Clients (students) are strictly isolated to their own records.
     * Admins can fetch across all user spaces and filter by status.
     */
    if (role !== "admin") {
        filter.userId = userId;
    } else if (status) {
        filter.status = status;
    }

    if (
        type &&
        ["lost", "found"].includes(type)
    ) {
        filter.type = type;
    }

    if (categoryId) {
        validateObjectId(
            categoryId,
            "category ID"
        );

        filter.categoryId = categoryId;
    }

    if (locationId) {
        validateObjectId(
            locationId,
            "location ID"
        );

        filter.locationId = locationId;
    }

    if (search?.trim()) {
        filter.$or = [
            {
                itemName: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
        ];
    }

    const skip =
        (currentPage - 1) * currentLimit;

    const [reports, total] =
        await Promise.all([
            Report.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(currentLimit)
                .populate(
                    "categoryId",
                    "name slug"
                )
                .populate(
                    "locationId",
                    "name building area"
                )
                .populate(
                    "userId",
                    "name email"
                )
                .lean(),

            Report.countDocuments(filter),
        ]);

    return {
        reports,
        pagination: {
            page: currentPage,
            limit: currentLimit,
            total,
            totalPages: Math.ceil(
                total / currentLimit
            ),
        },
    };
};

const getReportById = async ({
    reportId,
    userId,
    role,
}) => {
    validateObjectId(reportId, "report ID");

    const report = await Report.findById(
        reportId
    )
        .populate(
            "categoryId",
            "name slug description"
        )
        .populate(
            "locationId",
            "name building area description"
        )
        .populate(
            "userId",
            "name email profileImage"
        )
        .lean();

    if (!report) {
        const error = new Error(
            "Report not found."
        );

        error.statusCode = 404;
        throw error;
    }

    /*
     * Students cannot access removed reports
     * or reports that belong to no longer-visible
     * administrative states.
     */
    if (
        role !== "admin" &&
        report.status !== "active"
    ) {
        const error = new Error(
            "Report not found."
        );

        error.statusCode = 404;
        throw error;
    }

    return report;
};

const updateReport = async ({
    reportId,
    userId,
    role,
    updates,
}) => {
    validateObjectId(reportId, "report ID");

    const report = await Report.findById(
        reportId
    );

    if (!report) {
        const error = new Error(
            "Report not found."
        );

        error.statusCode = 404;
        throw error;
    }

    const isOwner =
        report.userId.toString() ===
        userId.toString();

    if (role !== "admin" && !isOwner) {
        const error = new Error(
            "You can only update your own reports."
        );

        error.statusCode = 403;
        throw error;
    }

    if (
        role !== "admin" &&
        report.status !== "active"
    ) {
        const error = new Error(
            "This report can no longer be modified."
        );

        error.statusCode = 400;
        throw error;
    }

    const allowedFields = [
        "itemName",
        "description",
        "identifyingCharacteristics",
        "date",
        "time",
    ];

    for (const field of allowedFields) {
        if (
            updates[field] !== undefined
        ) {
            report[field] = updates[field];
        }
    }

    if (updates.categoryId !== undefined) {
        validateObjectId(
            updates.categoryId,
            "category ID"
        );

        const category =
            await Category.findOne({
                _id: updates.categoryId,
                isActive: true,
            });

        if (!category) {
            const error = new Error(
                "Category not found or inactive."
            );

            error.statusCode = 400;
            throw error;
        }

        report.categoryId =
            updates.categoryId;
    }

    if (updates.locationId !== undefined) {
        validateObjectId(
            updates.locationId,
            "location ID"
        );

        const location =
            await Location.findOne({
                _id: updates.locationId,
                isActive: true,
            });

        if (!location) {
            const error = new Error(
                "Location not found or inactive."
            );

            error.statusCode = 400;
            throw error;
        }

        report.locationId =
            updates.locationId;
    }

    /*
     * Only admins can change report status.
     */
    if (
        role === "admin" &&
        updates.status !== undefined
    ) {
        const validStatuses = [
            "active",
            "resolved",
            "closed",
            "removed",
        ];

        if (
            !validStatuses.includes(
                updates.status
            )
        ) {
            const error = new Error(
                "Invalid report status."
            );

            error.statusCode = 400;
            throw error;
        }

        report.status = updates.status;

        // Stamp resolvedAt when case is first resolved so the
        // 24-hour photo cleanup job knows when to purge images.
        if (updates.status === "resolved" && !report.resolvedAt) {
            report.resolvedAt = new Date();
        }
        // If admin reopens the case, clear the resolvedAt stamp
        if (updates.status === "active") {
            report.resolvedAt = null;
        }
    }

    await report.save();

    return Report.findById(report._id)
        .populate(
            "categoryId",
            "name slug"
        )
        .populate(
            "locationId",
            "name building area"
        )
        .populate(
            "userId",
            "name email"
        )
        .lean();
};

const deleteReport = async ({
    reportId,
    userId,
    role,
    ipAddress,
    userAgent,
}) => {
    validateObjectId(reportId, "report ID");

    const report = await Report.findById(
        reportId
    );

    if (!report) {
        const error = new Error(
            "Report not found."
        );

        error.statusCode = 404;
        throw error;
    }

    const isOwner =
        report.userId.toString() ===
        userId.toString();

    if (role !== "admin" && !isOwner) {
        const error = new Error(
            "You can only delete your own reports."
        );

        error.statusCode = 403;
        throw error;
    }

    /*
     * We soft-delete reports instead of
     * immediately destroying the document.
     */
    report.status = "removed";

    await report.save();

    await AuditLog.create({
        actorUserId: userId,
        action:
            role === "admin"
                ? "ADMIN_REMOVED_REPORT"
                : "USER_REMOVED_REPORT",
        entityType: "report",
        entityId: report._id,
        details: {
            itemName: report.itemName,
            reportType: report.type,
        },
        ipAddress,
        userAgent,
    });

    return {
        id: report._id,
        status: report.status,
    };
};

module.exports = {
    createReport,
    listReports,
    getReportById,
    updateReport,
    deleteReport,
};