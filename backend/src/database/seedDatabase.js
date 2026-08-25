const Category = require("../models/Category");
const Location = require("../models/Location");

const categories = [
    {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and accessories",
    },
    {
        name: "Documents",
        slug: "documents",
        description: "Identity cards, certificates and documents",
    },
    {
        name: "Wallets",
        slug: "wallets",
        description: "Wallets and card holders",
    },
    {
        name: "Keys",
        slug: "keys",
        description: "Keys and keychains",
    },
    {
        name: "Bags",
        slug: "bags",
        description: "Backpacks, handbags and other bags",
    },
    {
        name: "Clothing",
        slug: "clothing",
        description: "Clothing and wearable items",
    },
    {
        name: "Books",
        slug: "books",
        description: "Books and study materials",
    },
    {
        name: "Jewelry",
        slug: "jewelry",
        description: "Jewelry and ornaments",
    },
    {
        name: "Accessories",
        slug: "accessories",
        description: "Personal accessories",
    },
    {
        name: "Other",
        slug: "other",
        description: "Other lost and found items",
    },
];

const locations = [
    {
        name: "Main Library",
        building: "Main Library",
        area: "General",
        description: "Main campus library",
    },
    {
        name: "Administrative Block",
        building: "Administrative Block",
        area: "General",
        description: "Main administrative offices",
    },
    {
        name: "Cafeteria",
        building: "Cafeteria",
        area: "General",
        description: "Main campus cafeteria",
    },
    {
        name: "Computer Science Block",
        building: "Computer Science Block",
        area: "General",
        description: "Computer science academic block",
    },
    {
        name: "Main Auditorium",
        building: "Main Auditorium",
        area: "General",
        description: "Main campus auditorium",
    },
    {
        name: "Sports Complex",
        building: "Sports Complex",
        area: "General",
        description: "Campus sports facilities",
    },
    {
        name: "Main Gate",
        building: "Main Gate",
        area: "Entrance",
        description: "Primary campus entrance",
    },
    {
        name: "Student Activity Center",
        building: "Student Activity Center",
        area: "General",
        description: "Student activity and community area",
    },
];

const seedCategories = async () => {
    for (const category of categories) {
        await Category.updateOne(
            { slug: category.slug },
            {
                $setOnInsert: {
                    ...category,
                    isActive: true,
                },
            },
            { upsert: true }
        );
    }

    console.log(`✅ ${categories.length} categories ready`);
};

const seedLocations = async () => {
    for (const location of locations) {
        await Location.updateOne(
            { name: location.name },
            {
                $setOnInsert: {
                    ...location,
                    isActive: true,
                },
            },
            { upsert: true }
        );
    }

    console.log(`✅ ${locations.length} locations ready`);
};

const seedDatabase = async () => {
    console.log("🌱 Seeding CampusFind AI database...");

    await seedCategories();
    await seedLocations();

    console.log("✅ Database seed completed");
};

module.exports = {
    seedDatabase,
};