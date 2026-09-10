import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/bozor";
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB ulandi:", uri);
  } catch (err) {
    console.error("❌ MongoDB ulanish xatosi:", err.message);
    process.exit(1);
  }
}
