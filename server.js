import dotenv from "dotenv"
dotenv.config()
import express from "express";
import cors from "cors";
import projectRoute from "./Routes/projectRoute.js";
import authRoute from './Routes/authRoute.js';
import connection from "./config/db.js";
//import { connect } from "mongoose";

const PORT = process.env.PORT || 8080
const server = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://task-manager-nine-sepia.vercel.app'
];

server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

server.use(express.json())

server.use("/", projectRoute)
server.use("/", authRoute)


server.get("/", (_, res) => {
    console.log("This is Home Page")
    res.status(200).json({message: `This is Home Page`})
})

server.listen(PORT, async (req, res) => {
    try {
        await connection();
        console.log(`✅ Server is running on port ${PORT}`)
    } catch (error) {
        console.log(`❌ Server failed to running: ${error.message}`)
    }
})