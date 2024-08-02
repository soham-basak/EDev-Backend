import mongoose from "mongoose";
import { env } from "../validation/env";

// MongoDB configuration
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(env.MONGODB_URL);
        console.log(`
      MongoDB connected: ${connect.connection.host}`
        );
    } catch (error) {
        console.log(`Mongoose connection error`);
    }
};

export default connectDB;