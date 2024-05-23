import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { verifyTOTP, decryptSecret } from '../TOTPGenerator.js';

// Initialize router
const router = express.Router();

// Initialize Supabase client
const supabaseUrl = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

router.post('/', async (req, res) => {
    const { totpCode, userId } = req.body;
    console.log("Received userId for verification:", userId); 

    // Fetch user details to show interaction with the database
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', userId)
        .single();

    if (userError) {
        console.error('Error fetching user details:', userError);
        return res.status(500).json({ message: 'Failed to fetch user details.', details: userError.message });
    }

    console.log("User details retrieved for verification:", userData);

    try {
        // 'created_at' in totp table (double check this)
        const { data, error } = await supabase
            .from('totp')
            .select('totp_code')
            .eq('user_id_string', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            throw error;
        }

        if (data) {
            const secretKey = data.totp_code;
            const decryptedSecretKey = decryptSecret(secretKey);
            const isValid = verifyTOTP(totpCode, decryptedSecretKey);

            if (isValid) {
                res.json({ verified: true, message: 'TOTP verification successful.' });
            } else {
                res.status(401).json({ verified: false, message: 'Invalid TOTP code.' });
            }
        } else {
            res.status(404).json({ message: 'No TOTP record found for user.' });
        }
    } catch (error) {
        console.error('Error verifying TOTP:', error);
        res.status(500).json({ message: 'An error occurred during TOTP verification.', details: error.message });
    }
});

// Export router
export default router;
