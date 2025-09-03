import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        mongoose.connect(MONGODB_URI)
        console.log(`✅ MongoDB connected`)
    } catch (error) {
        console.log(`❌ MongoDB not connected`)
    }
}

export default connectDB;