import jwt from 'jsonwebtoken';
import redisClient from "../service/redis.service.js";
export const authMiddleware = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization.split(' ')[1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    
    const isBlackListed =await redisClient.get(token);

    if(isBlackListed) {
         res.cookie('token', '');
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}
