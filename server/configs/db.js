import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("✅ Database successfully connected");
    });
    await mongoose.connect(process.env.MONGODB_URI);

    
  } catch (error) {
    console.error("❌ Connection error:", error.message);
  }
};
