import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No authentication token provided", 401);
        }

        const token = authHeader.split(" ")[1];
        
        // Using a hardcoded secret for MVP, in production this must be in .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SUPER_SECRET_KEY_123");
        
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
