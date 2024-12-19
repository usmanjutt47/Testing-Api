import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connect(String(process.env.MONGODb));
    console.log("MongoDB Connected...");
  } catch (error) {
    console.log(error);
  }
}
