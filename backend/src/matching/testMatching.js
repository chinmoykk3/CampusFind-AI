const {
    connectDatabase,
    disconnectDatabase,
} = require("../config/database");

const Report = require("../models/Report");

const {
    calculateMatch,
} = require("./matching.service");

const runTest = async () => {
    try {
        await connectDatabase();

        const lostReport =
            await Report.findOne({
                type: "lost",
                itemName:
                    "Black Lenovo Laptop",
            }).lean();

        const foundReport =
            await Report.findOne({
                type: "found",
                itemName:
                    "Black Lenovo Laptop",
            }).lean();

        if (!lostReport) {
            throw new Error(
                "Lost laptop report not found."
            );
        }

        if (!foundReport) {
            throw new Error(
                "Found laptop report not found."
            );
        }

        const result =
            await calculateMatch(
                lostReport,
                foundReport
            );

        console.log(
            "\n================================"
        );

        console.log(
            "CAMPUSFIND AI MATCH TEST"
        );

        console.log(
            "================================"
        );

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

        console.log(
            "================================\n"
        );
    } catch (error) {
        console.error(
            "❌ Matching test failed:"
        );

        console.error(
            error.message
        );

        process.exitCode = 1;
    } finally {
        await disconnectDatabase();
    }
};

runTest();