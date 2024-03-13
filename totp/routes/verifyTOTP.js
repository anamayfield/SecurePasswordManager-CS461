import { Router } from 'express';
const router = Router();
import { createClient } from '@supabase/supabase-js';
import { verifyTOTP, decryptSecret } from '../TOTPGenerator.js';

// Initialize Supabase client
const supabaseUrl = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

router.post('/', async (req, res) => {
    const { totpCode, userId } = req.body;
    console.log("Received userId for verification:", userId); 

    try {
        // Fetch the TOTP code for the user fromdatabase
        const { data, error } = await supabase
            .from('totp')
            .select('totp_code') // Now fetching the encrypted secret key
            .eq('user_id_string', userId)
            .single();

        if (error) throw error;

        if (data) {
            const secretKey = decryptSecret(data.totp_code); // Decrypt the secret key
            const isValid = verifyTOTP(totpCode, secretKey); // Verify using the decrypted secret key
            
            if (isValid) {
                res.json({ verified: true, message: 'TOTP verification successful.' });
            } else {
                res.status(401).json({ verified: false, message: 'Invalid TOTP code.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error verifying TOTP:', error);
        res.status(500).json({ message: 'An error occurred during TOTP verification.' });
    }
});

export default router;