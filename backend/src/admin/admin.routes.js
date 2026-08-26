const express = require("express");

const {
    getDashboard,
} = require("./admin.controller");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("admin"),
    getDashboard
);

module.exports = router;