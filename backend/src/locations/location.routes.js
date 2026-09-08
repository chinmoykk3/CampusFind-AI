const express = require("express");
const Location = require("../models/Location");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const authorize = require("../middleware/authorize");

router.get("/", authenticate, async (req, res, next) => {
    try {
        const query = req.user?.role === 'admin' ? {} : { isActive: true };
        const locations = await Location.find(query).select("name building area coordinates isActive").lean();
        res.status(200).json({ success: true, data: locations });
    } catch (error) {
        next(error);
    }
});

router.post("/", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json({ success: true, data: location });
    } catch (err) { next(err); }
});

router.patch("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: location });
    } catch (err) { next(err); }
});

module.exports = router;
