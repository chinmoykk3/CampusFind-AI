const app = require("./app");

const env = require("./config/env");

const { connectDatabase, disconnectDatabase } = require("./config/database");

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(env.port, () => {
      console.log("======================================");

      console.log("       CAMPUSFIND AI BACKEND");

      console.log("======================================");

      console.log(`🚀 Server: http://localhost:${env.port}`);

      console.log(`❤️  Health: http://localhost:${env.port}/api/health`);

      console.log("======================================");
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
