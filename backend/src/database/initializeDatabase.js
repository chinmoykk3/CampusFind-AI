const User = require("../models/User");
const Category = require("../models/Category");
const Location = require("../models/Location");
const Report = require("../models/Report");
const Match = require("../models/Match");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

const initializeDatabase = async () => {
    console.log("🔧 Initializing CampusFind AI database...");

    await Promise.all([
        User.createIndexes(),
        Category.createIndexes(),
        Location.createIndexes(),
        Report.createIndexes(),
        Match.createIndexes(),
        Notification.createIndexes(),
        AuditLog.createIndexes(),
    ]);

    console.log("✅ Database indexes initialized");
};

module.exports = {
    initializeDatabase,
};