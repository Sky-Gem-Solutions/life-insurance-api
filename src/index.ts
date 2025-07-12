import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import recommendationRoutes from './routes/recommendation';
import users from './routes/user';
import { apiKeyAuth } from './middleware/apiKeyAuth';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_REQUEST_PER_15_MINUTES = (process.env.MAX_REQUEST_PER_15_MINUTES || 10).toString();
const APPLICATION_URL = process.env.APPLICATION_URL || 'http://localhost:3000';

app.use(cors({ origin: APPLICATION_URL }));

app.use(express.json());

// Apply API key middleware & rate limiter to all /api routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: parseInt(MAX_REQUEST_PER_15_MINUTES),
    keyGenerator: req => (req as any).apiKey || req.ip,
    handler: (req, res) => {
        res.status(429).json({ success: false, message: 'Too many requests', data: null });
    }
});

app.use('/recommendation', apiKeyAuth, limiter, recommendationRoutes);
app.use('/user', apiKeyAuth, limiter, users);

// Default error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
