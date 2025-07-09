import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

// App setup
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());

// Socket.io setup
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
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

// Routes
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

app.get('/', (req, res) => {
  res.send("Hello There");
});

// ✅ Start server *only after* DB is connected
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // ⏳ Wait for DB connection
    server.listen(PORT, () => {
      console.log(`🚀 Server successfully running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect DB or start server:", err.message);
    process.exit(1); // 🔴 Exit if DB fails
  }
};

startServer();

export default server;
