import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface SessionRequest extends Request { 
    userId?: number;
    io?: any; // Socket.IO instance
}

const verifySession = (req: SessionRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default verifySession;