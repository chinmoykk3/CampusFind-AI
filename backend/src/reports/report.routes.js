const express = require("express");

const {
    create,
    getReports,
    getReport,
    update,
    remove,
} = require("./report.controller");

const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");

const router = express.Router();

const Report = require("../models/Report"); // Required for manual mongoose query

router.get("/public", async (req, res, next) => {
    try {
        const publicReports = await Report.find({ status: "active" })
            .select("type itemName date time createdAt")
            .populate("categoryId", "name icon")
            .populate("locationId", "name area")
            .sort({ createdAt: -1 })
            .limit(30)
            .lean();
        res.status(200).json({ success: true, data: publicReports });
    } catch (error) { next(error); }
});

router.use(authenticate);

// Parse 'image' field for single file uploads
router.post("/", upload.single("image"), create);

router.get("/", getReports);

router.get("/:id", getReport);

router.patch("/:id", update);

router.delete("/:id", remove);

module.exports = router;