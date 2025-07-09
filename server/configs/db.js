import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("✅ Database successfully connected");
    });

    mongoose.set('bufferCommands', false); // 🧠 disable command buffering (optional but good)
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // ⏱ Increase timeout from default (10s) to 30s
      socketTimeoutMS: 45000,          // ⏱ Socket inactivity timeout
    });

  } catch (error) {
    console.error("❌ Connection error:", error.message);
  }
};
