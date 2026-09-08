const Report = require("../models/Report");
const Match = require("../models/Match");

const MODEL_VERSION = "baseline-v1";

/*
 * Convert text into a set of normalized words.
 */
const tokenize = (text = "") => {
    return new Set(
        String(text)
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .split(/\s+/)
            .filter((word) => word.length > 1)
    );
};

/*
 * Jaccard similarity.
 *
 * Example:
 *
 * A = ["black", "lenovo", "laptop"]
 * B = ["black", "lenovo", "computer"]
 *
 * Common words = 2
 * Unique words = 4
 *
 * Similarity = 2 / 4 = 0.5
 */
const textSimilarityAsync = async (textA = "", textB = "") => {
    if (!textA || !textB) return 0;
    try {
        const response = await fetch("http://localhost:8000/api/v1/similarity/text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text1: String(textA), text2: String(textB) })
        });
        if (!response.ok) return fallbackTextSimilarity(textA, textB);
        const data = await response.json();
        return data.similarity_score;
    } catch (err) {
        console.error("AI Service Error:", err.message);
        return fallbackTextSimilarity(textA, textB);
    }
};

const fallbackTextSimilarity = (
    textA = "",
    textB = ""
) => {
    const setA = tokenize(textA);
    const setB = tokenize(textB);

    if (!setA.size || !setB.size) {
        return 0;
    }

    let intersection = 0;

    for (const word of setA) {
        if (setB.has(word)) {
            intersection++;
        }
    }

    const union = new Set([
        ...setA,
        ...setB,
    ]).size;

    return union
        ? intersection / union
        : 0;
};

/*
 * Compare identifying characteristics.
 */
const characteristicsSimilarity = (
    characteristicsA = [],
    characteristicsB = []
) => {
    if (
        !Array.isArray(characteristicsA) ||
        !Array.isArray(characteristicsB) ||
        !characteristicsA.length ||
        !characteristicsB.length
    ) {
        return 0;
    }

    const a = characteristicsA.map((item) =>
        String(item).toLowerCase().trim()
    );

    const b = characteristicsB.map((item) =>
        String(item).toLowerCase().trim()
    );

    let matches = 0;

    for (const itemA of a) {
        const matched = b.some(
            (itemB) =>
                itemA === itemB ||
                itemA.includes(itemB) ||
                itemB.includes(itemA)
        );

        if (matched) {
            matches++;
        }
    }

    return (
        matches /
        Math.max(a.length, b.length)
    );
};

/*
 * Compare date and time.
 *
 * For now this produces a single
 * time-related score.
 */
const timeSimilarity = (
    dateA,
    dateB,
    timeA,
    timeB
) => {
    if (!dateA || !dateB) {
        return 0;
    }

    const firstDate = new Date(dateA);
    const secondDate = new Date(dateB);

    if (
        Number.isNaN(firstDate.getTime()) ||
        Number.isNaN(secondDate.getTime())
    ) {
        return 0;
    }

    const dateDifference =
        Math.abs(
            firstDate.getTime() -
            secondDate.getTime()
        ) /
        (1000 * 60 * 60 * 24);

    let dateScore = 0;

    if (dateDifference === 0) {
        dateScore = 1;
    } else if (dateDifference <= 1) {
        dateScore = 0.7;
    } else if (dateDifference <= 2) {
        dateScore = 0.4;
    }

    let timeScore = 0;

    if (timeA && timeB) {
        const parseTime = (value) => {
            const match =
                String(value).match(
                    /^(\d{1,2}):(\d{2})$/
                );

            if (!match) {
                return null;
            }

            return (
                Number(match[1]) * 60 +
                Number(match[2])
            );
        };

        const firstTime = parseTime(timeA);
        const secondTime = parseTime(timeB);

        if (
            firstTime !== null &&
            secondTime !== null
        ) {
            const difference = Math.abs(
                firstTime - secondTime
            );

            if (difference <= 30) {
                timeScore = 1;
            } else if (difference <= 60) {
                timeScore = 0.7;
            } else if (difference <= 180) {
                timeScore = 0.4;
            }
        }
    }

    /*
     * Date has slightly more importance
     * than exact time.
     */
    return (
        dateScore * 0.7 +
        timeScore * 0.3
    );
};

/*
 * Calculate a complete match.
 *
 * Current baseline:
 *
 * Text          35%
 * Category      20%
 * Location      15%
 * Characteristics 20%
 * Time          10%
 *
 * Image is currently 0 because image
 * matching will be added later.
 */
const calculateMatch = async (
    lostReport,
    foundReport
) => {
    const itemNameScore =
        await textSimilarityAsync(
            lostReport.itemName,
            foundReport.itemName
        );

    const descriptionScore =
        await textSimilarityAsync(
            lostReport.description,
            foundReport.description
        );

    const characteristicScore =
        characteristicsSimilarity(
            lostReport.identifyingCharacteristics,
            foundReport.identifyingCharacteristics
        );

    /*
     * Combine item name + description +
     * identifying characteristics into
     * the current text score.
     */
    const textScore =
        itemNameScore * 0.45 +
        descriptionScore * 0.35 +
        characteristicScore * 0.20;

    const categoryScore =
        lostReport.categoryId?.toString() ===
            foundReport.categoryId?.toString()
            ? 1
            : 0;

    const locationScore =
        lostReport.locationId?.toString() ===
            foundReport.locationId?.toString()
            ? 1
            : 0;

    const timeScore = timeSimilarity(
        lostReport.date,
        foundReport.date,
        lostReport.time,
        foundReport.time
    );

    /*
     * Image score is intentionally 0
     * until image processing is implemented.
     */
    const imageScore = 0;

    /*
     * Baseline overall score.
     *
     * Image is excluded from the current
     * baseline because no image AI exists yet.
     */
    const overall =
        textScore * 0.45 +
        categoryScore * 0.25 +
        locationScore * 0.15 +
        timeScore * 0.15;

    const reasons = [];

    if (categoryScore === 1) {
        reasons.push(
            "Both reports belong to the same category."
        );
    }

    if (locationScore === 1) {
        reasons.push(
            "Both reports reference the same location."
        );
    }

    if (itemNameScore >= 0.5) {
        reasons.push(
            "Item names have strong textual similarity."
        );
    }

    if (descriptionScore >= 0.4) {
        reasons.push(
            "Descriptions contain similar information."
        );
    }

    if (characteristicScore >= 0.5) {
        reasons.push(
            "Identifying characteristics are similar."
        );
    }

    if (timeScore >= 0.7) {
        reasons.push(
            "The reported dates and times are close."
        );
    }

    return {
        scores: {
            text: Number(
                textScore.toFixed(4)
            ),

            image: imageScore,

            category: Number(
                categoryScore.toFixed(4)
            ),

            location: Number(
                locationScore.toFixed(4)
            ),

            time: Number(
                timeScore.toFixed(4)
            ),

            overall: Number(
                overall.toFixed(4)
            ),
        },

        reasons,
    };
};

/*
 * Find active FOUND reports that could
 * match an active LOST report.
 */
const findMatchesForLostReport = async (
    reportId
) => {
    const lostReport =
        await Report.findOne({
            _id: reportId,
            type: "lost",
            status: "active",
        }).lean();

    if (!lostReport) {
        const error = new Error(
            "Active lost report not found."
        );

        error.statusCode = 404;

        throw error;
    }

    /*
     * Start with same-category reports.
     */
    const foundReports =
        await Report.find({
            type: "found",
            status: "active",
            categoryId:
                lostReport.categoryId,
        }).lean();

    const candidates = [];

    for (const foundReport of foundReports) {
        const result =
            await calculateMatch(
                lostReport,
                foundReport
            );

        /*
         * 0.40 = minimum candidate threshold.
         */
        if (
            result.scores.overall >= 0.40
        ) {
            candidates.push({
                lostReportId:
                    lostReport._id,

                foundReportId:
                    foundReport._id,

                ...result,
            });
        }
    }

    candidates.sort(
        (a, b) =>
            b.scores.overall -
            a.scores.overall
    );

    return candidates;
};

/*
 * Generate/update Match documents.
 */
const generateMatches = async (
    reportId
) => {
    const candidates =
        await findMatchesForLostReport(
            reportId
        );

    const savedMatches = [];

    for (const candidate of candidates) {
        const status =
            candidate.scores.overall >= 0.70
                ? "potential"
                : "reviewed";

        const match =
            await Match.findOneAndUpdate(
                {
                    lostReportId:
                        candidate.lostReportId,

                    foundReportId:
                        candidate.foundReportId,
                },
                {
                    $set: {
                        scores:
                            candidate.scores,

                        reasons:
                            candidate.reasons,

                        status,

                        modelVersion:
                            MODEL_VERSION,
                    },
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

        savedMatches.push(match);
    }

    return savedMatches;
};

const generateMatchesForNewReport = async (
    reportId
) => {
    const report = await Report.findById(
        reportId
    ).lean();

    if (!report) {
        return [];
    }

    /*
     * LOST → search FOUND
     * FOUND → search LOST
     */
    if (report.type === "lost") {
        return generateMatches(reportId);
    }

    if (report.type === "found") {
        const lostReports =
            await Report.find({
                type: "lost",
                status: "active",
                categoryId:
                    report.categoryId,
            })
                .select("_id")
                .lean();

        const allMatches = [];

        /*
         * Our current generateMatches function
         * searches from LOST → FOUND.
         *
         * Therefore each relevant LOST report
         * is processed when a FOUND report arrives.
         */
        for (const lostReport of lostReports) {
            const matches =
                await generateMatches(
                    lostReport._id
                );

            allMatches.push(
                ...matches
            );
        }

        return allMatches;
    }

    return [];
};
module.exports = {
    textSimilarityAsync,
    characteristicsSimilarity,
    timeSimilarity,
    calculateMatch,
    findMatchesForLostReport,
    generateMatches,
    generateMatchesForNewReport,
};