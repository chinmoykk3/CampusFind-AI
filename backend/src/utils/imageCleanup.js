/**
 * imageCleanup.js
 * ───────────────────────────────────────────────────────────────────────────
 * Scheduled job that purges uploaded photos from disk and from the DB for
 * any report that:
 *   1. Has status === "resolved"
 *   2. Was resolved more than 24 hours ago  (resolvedAt <= now - 24h)
 *   3. Still has at least one image attached
 *
 * Run via setInterval from server.js — no external cron library needed.
 * ───────────────────────────────────────────────────────────────────────────
 */

const fs = require("fs");
const path = require("path");
const Report = require("../models/Report");

// Matches the same base directory used by upload.js middleware
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const runImageCleanup = async () => {
    const cutoff = new Date(Date.now() - TWENTY_FOUR_HOURS_MS);

    console.log(`\n🧹 [ImageCleanup] Running at ${new Date().toISOString()}`);
    console.log(`   Purging photos from cases resolved before ${cutoff.toISOString()}`);

    try {
        // Find all resolved reports resolved > 24h ago that still have images
        const staleCases = await Report.find({
            status: "resolved",
            resolvedAt: { $lte: cutoff },
            "images.0": { $exists: true }, // at least 1 image
        }).select("_id itemName images resolvedAt").lean();

        if (staleCases.length === 0) {
            console.log("   ✅ No stale photos to purge.");
            return;
        }

        console.log(`   Found ${staleCases.length} case(s) with stale photos.`);

        let totalDeleted = 0;
        let totalFailed = 0;

        for (const report of staleCases) {
            let filesDeleted = 0;

            for (const img of report.images) {
                // img.url is like "/uploads/image-1234567890-123456789.jpg"
                const filename = path.basename(img.url);
                const filePath = path.join(UPLOADS_DIR, filename);

                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        filesDeleted++;
                        console.log(`   🗑  Deleted: ${filename}  (case: ${report.itemName})`);
                    } else {
                        // File already gone — still need to clear the DB record
                        filesDeleted++;
                        console.log(`   ⚠️  Already missing: ${filename}`);
                    }
                } catch (fileErr) {
                    totalFailed++;
                    console.error(`   ❌ Failed to delete ${filename}:`, fileErr.message);
                }
            }

            // Clear images array in DB regardless of file-deletion outcome
            // so we don't retry on next run
            await Report.updateOne(
                { _id: report._id },
                { $set: { images: [] } }
            );

            totalDeleted += filesDeleted;
            console.log(`   ✔  Case "${report.itemName}" — cleared ${filesDeleted} file(s) from DB.`);
        }

        console.log(`\n   Summary: ${totalDeleted} file(s) deleted, ${totalFailed} failure(s).`);

    } catch (err) {
        console.error("   ❌ ImageCleanup job encountered an error:", err.message);
    }
};

/**
 * Start the cleanup scheduler.
 * @param {number} intervalMs  How often to run (default: every hour)
 */
const startImageCleanupScheduler = (intervalMs = 60 * 60 * 1000) => {
    console.log(`\n🕐 [ImageCleanup] Scheduler started — running every ${intervalMs / 60000} min(s).`);

    // Run once immediately on startup (catches any backlog from downtime)
    runImageCleanup();

    // Then run on the given interval
    const timer = setInterval(runImageCleanup, intervalMs);

    // Don't keep the process alive solely for this timer
    timer.unref();

    return timer;
};

module.exports = { startImageCleanupScheduler, runImageCleanup };
