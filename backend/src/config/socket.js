const { Server } = require("socket.io");
const env = require("./env");

let io;

const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: env.clientUrl || "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 Socket.io client connected: ${socket.id}`);

        socket.on("join", (userId) => {
            if (userId) {
                socket.join(userId.toString());
                console.log(`🔌 User ${userId} joined their personal socket room`);
            }
        });

        socket.on("disconnect", () => {
            console.log(`🔌 Socket.io client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
};
