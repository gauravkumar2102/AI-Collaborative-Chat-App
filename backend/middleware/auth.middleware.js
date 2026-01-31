import jwt from "jsonwebtoken";
import redisClient from "../service/redis.service.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    let token = null;

    if (cookieToken) {
      token = cookieToken;
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const isBlackListed = await redisClient.get(token);

    if (isBlackListed) {
      res.cookie("token", "");
      return res.status(401).json({ message: "Unauthorized: Token blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
