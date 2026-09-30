const express = require("express");

const {
    getDashboard,
    getAuditLogs,
    downloadAuditLogs
} = require("./admin.controller");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get("/dashboard", authenticate, authorize("admin"), getDashboard);
router.get("/audit", authenticate, authorize("admin"), getAuditLogs);
router.get("/audit/export", authenticate, authorize("admin"), downloadAuditLogs);

module.exports = router;