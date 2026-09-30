const app = require("./app");
const http = require("http");

const env = require("./config/env");
const { initializeSocket } = require("./config/socket");

const { connectDatabase, disconnectDatabase } = require("./config/database");

const {
  initializeDatabase,
} = require("./database/initializeDatabase");

const {
  seedDatabase,
} = require("./database/seedDatabase");

const {
  startImageCleanupScheduler,
} = require("./utils/imageCleanup");

const startServer = async () => {
  try {
    await connectDatabase();

    await initializeDatabase();

    await seedDatabase();

    // Create underlying HTTP server and attach Socket.io
    const httpServer = http.createServer(app);
    initializeSocket(httpServer);

    const server = httpServer.listen(env.port, () => {
      console.log("======================================");
      console.log("       CAMPUSFIND AI BACKEND");
      console.log("======================================");
      console.log(`🚀 Server: http://localhost:${env.port}`);
      console.log(`❤️  Health: http://localhost:${env.port}/api/health`);
      console.log(`🔌 WebSockets Enabled`);
      console.log("======================================");

      // Start the 24-hour resolved-case photo cleanup job
      startImageCleanupScheduler(60 * 60 * 1000); // every 1 hour
    });


    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down...`);

      server.close(async () => {
        await disconnectDatabase();

        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start CampusFind AI backend");

    console.error(error);

    process.exit(1);
  }
};

startServer();
