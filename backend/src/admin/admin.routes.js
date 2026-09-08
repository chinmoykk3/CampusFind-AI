const express = require("express");

const {
    getDashboard,
    getAuditLogs
} = require("./admin.controller");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get("/dashboard", authenticate, authorize("admin"), getDashboard);
router.get("/audit", authenticate, authorize("admin"), getAuditLogs);

module.exports = router;