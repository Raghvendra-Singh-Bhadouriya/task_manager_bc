import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import express from "express";
import authModel from "../Models/authSchema.js"
import jwt from "jsonwebtoken";
import blacklistModel from "../Models/blackListSchema.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { username, email, mob, password } = req.body;

        const existUser = await authModel.findOne({ email })

        if(existUser){
            return res.status(409).json({message: "User already registered"})
        }

        let saltRounds = Number(process.env.SALT_ROUNDS)

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = new authModel({
            username,
            email,
            mob,
            password: hashedPassword
        })

        await newUser.save();

        res.status(201).json({
            message: `${username} You registered Successfully`,
            data: newUser,
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: `Error in Registered user: ${error.message}`,
            success: false
        })
    }
})

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email){
            return res.status(400).message({message: `Email is required`, success: false})
        }

        if(!password){
            return res.status(400).message({message: `Password is required`, success: false})
        }

        const existUser = await authModel.findOne({email})

        if(!existUser){
            return res.status(404).json({message: `User not found, Please registered first`})
        }

        const compare = await bcrypt.compare(password, existUser.password)
        if(!compare){
            return res.status(401).json({message: `passwoed incorrect`})
        }

        const accessToken = jwt.sign(
            { id: existUser._id, username: existUser.username, email: existUser.email },
            process.env.JWT_SECRET_KEY,
            {expiresIn: "24h"}
        )

        res.status(200).json({
            success: true,
            message:"User LoggedIn Successfully",
            access_token: accessToken
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message:`Error in LoginIn: ${error.message}`
        })
    }
})


router.post("/logout", async (req, res) => {
    try {
        const header = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        await blacklistModel.create({ token });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
})

export default router;