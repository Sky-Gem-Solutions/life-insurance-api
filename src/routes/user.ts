import express from 'express';
import { sendResponse } from '../utils/sendResponse';
import { RecommendationRequest } from '../types/api';
import { supabase } from '../supabase/index';

const router = express.Router();

router.get('/logs', async (req, res) => {

    const { data, error } = await supabase.rpc('get_all_user_requests', {});

    if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    return sendResponse(res, 200, {
        success: true,
        message: 'All user requests',
        data
    });
});

export default router;
