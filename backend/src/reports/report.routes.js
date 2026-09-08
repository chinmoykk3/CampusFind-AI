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

router.use(authenticate);

// Parse 'image' field for single file uploads
router.post("/", upload.single("image"), create);

router.get("/", getReports);

router.get("/:id", getReport);

router.patch("/:id", update);

router.delete("/:id", remove);

module.exports = router;