const express = require("express");

const {
    generate,
    getUserMatches,
    getAllMatches,
    reviewMatch,
} = require("./matching.controller");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post(
    "/generate/:reportId",
    authenticate,
    authorize("admin"),
    generate
);

router.get(
    "/",
    authenticate,
    getUserMatches
);

router.get(
    "/all",
    authenticate,
    authorize("admin"),
    getAllMatches
);

router.put(
    "/:id/review",
    authenticate,
    authorize("admin"),
    reviewMatch
);

module.exports = router;