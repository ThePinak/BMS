import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No authentication token provided", 401);
        }

        const token = authHeader.split(" ")[1];
        
        // In production, we strictly rely on the .env secret. No insecure fallbacks!
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; // { id, email }
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            next(new AppError("Invalid or expired token", 401));
        } else {
            next(error);
        }
    }
};
