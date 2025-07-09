import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketmap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketmap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketmap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // ⏳ Wait for DB connection BEFORE loading anything else

    // ✅ Only load middleware & routes AFTER DB is connected
    app.use(cors());
    app.use(express.json({ limit: "30mb" }));
    app.use(express.urlencoded({ extended: true, limit: "30mb" }));

    app.use('/api/auth', userRouter);
    app.use('/api/messages', messageRouter);

    app.get('/', (req, res) => {
      res.send("Hello There");
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server successfully running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default server;
