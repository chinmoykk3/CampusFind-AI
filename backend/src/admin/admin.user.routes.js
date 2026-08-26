const express = require("express");

const {
    getUsers,
    getUser,
    changeUserStatus,
    removeUser,
} = require("./admin.user.controller");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.use(
    authenticate,
    authorize("admin")
);

router.get("/", getUsers);

router.get("/:id", getUser);

router.patch(
    "/:id/status",
    changeUserStatus
);

router.delete(
    "/:id",
    removeUser
);

module.exports = router;