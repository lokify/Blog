import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second server selection timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      connectTimeoutMS: 10000, // 10 second connection timeout
      ssl: true,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error("Detailed Error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDb;
