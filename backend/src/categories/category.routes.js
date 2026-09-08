const express = require("express");
const Category = require("../models/Category");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const authorize = require("../middleware/authorize");

router.get("/", authenticate, async (req, res, next) => {
    try {
        const query = req.user?.role === 'admin' ? {} : { isActive: true };
        const categories = await Category.find(query).select("name slug icon description isActive").lean();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
});

router.post("/", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (err) { next(err); }
});

router.patch("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: category });
    } catch (err) { next(err); }
});

module.exports = router;
