import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import blacklistModel from "../Models/blackListSchema.js";


const authentication = async ( req, res, next ) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                message: "Authorization header missing or malformed",
                success: false,
            })
        }

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const blacklisted = await Blacklist.findOne({ token });
        if (blacklisted) {
          return res.status(401).json({ message: "Token is invalid (logged out)" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    message: `Invalid token please login again`,
                    success: false
                });
            }

            req.user = decoded;

            next();
        })
    } catch (error) {
        res.status(500).json({
            message: `Internal server error: ${error.message}`,
            success: false,
        });
    }
}

export default authentication;