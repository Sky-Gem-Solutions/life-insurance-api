import express from 'express';
import { sendResponse } from '../utils/sendResponse';
import { RecommendationRequest } from '../types/api';
import { supabase } from '../supabase/index';

const router = express.Router();

router.post('/insurance_plans', async (req, res) => {

    const { age, income, dependents, risk } = req.body as RecommendationRequest;

    if (!age || !income || !risk) {
        return sendResponse(res, 400, {
            success: false,
            message: 'Missing required fields',
            data: null
        });
    }

    // Get client IP from headers
    const ip =
        req.headers['x-forwarded-for'] ??
        req.headers['x-real-ip'] ??
        req.socket?.remoteAddress ??
        'unknown';

    const { data, error } = await supabase.rpc('get_life_insurance_recommendation', {
        input_age: age,
        input_income: income,
        input_dependents: dependents,
        input_risk_tolerance: risk.toLowerCase()
    });

    if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Step 2: Store user input + IP + recommendations
    const { error: insertError } = await supabase
        .from('user_inputs')
        .insert({
            age,
            income,
            dependents,
            risk_tolerance: risk,
            ip_address: ip,
            recommendations: data
        })

    if (insertError) {
      console.log(insertError);
    }

    return sendResponse(res, 200, {
        success: true,
        message: 'Recommendation generated successfully',
        data
    });
});

export default router;
