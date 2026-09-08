const {
    generateMatches,
} = require("./matching.service");
const Match = require("../models/Match");
const Report = require("../models/Report");

const generate = async (req, res, next) => {
    try {
        const matches =
            await generateMatches(
                req.params.reportId
            );

        res.status(200).json({
            success: true,
            message:
                "Potential matches generated successfully.",
            data: {
                matches,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getUserMatches = async (req, res, next) => {
    try {
        const userReports = await Report.find({ userId: req.user.id }).select("_id").lean();
        const reportIds = userReports.map(r => r._id);

        const matches = await Match.find({
            $or: [
                { lostReportId: { $in: reportIds } },
                { foundReportId: { $in: reportIds } }
            ]
        })
            .populate("lostReportId")
            .populate("foundReportId")
            .sort({ "scores.overall": -1 })
            .lean();

        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        next(error);
    }
};

const getAllMatches = async (req, res, next) => {
    try {
        const matches = await Match.find()
            .populate("lostReportId")
            .populate("foundReportId")
            .sort({ "scores.overall": -1 })
            .lean();
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        next(error);
    }
};

const reviewMatch = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!["confirmed", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Status must be confirmed or rejected" });
        }

        const match = await Match.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("lostReportId foundReportId");

        if (!match) return res.status(404).json({ success: false, message: "Match not found" });

        res.status(200).json({ success: true, data: match });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generate,
    getUserMatches,
    getAllMatches,
    reviewMatch,
};