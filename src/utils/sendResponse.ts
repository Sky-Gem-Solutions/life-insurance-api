import { Response } from 'express';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}

export function sendResponse<T>(res: Response, statusCode: number, payload: ApiResponse<T>) {
    return res.status(statusCode).json(payload);
}
