import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.user || typeof (req.user as any).id !== "number") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}



