import blacklistModel from "../Models/blackListSchema.js";

const logout = async () => {
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
}