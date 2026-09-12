import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/green_charge_ai";

export const connectDB = async () => {
    const uri = process.env.DATABASE_URL || process.env.MONGO_URI || MONGO_URI;
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message || error);
    }
};