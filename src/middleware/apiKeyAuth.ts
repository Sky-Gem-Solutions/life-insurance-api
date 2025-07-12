import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const validApiKeys = process.env.API_KEYS?.split(',') || [];

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('x-api-key');

    if (!apiKey || !validApiKeys.includes(apiKey)) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Invalid API key',
            data: null
        });
    }

    (req as any).apiKey = apiKey;
    next();
}
