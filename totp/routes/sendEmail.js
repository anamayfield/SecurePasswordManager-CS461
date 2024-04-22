import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

import express from 'express';
import speakeasy from 'speakeasy';
import { sendTOTPByEmail } from '../EmailService.js'; 
import { encryptSecret } from '../TOTPGenerator.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseUrl = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

router.post('/send-totp', async (req, res) => {
  const { email, userId } = req.body;

  try {
    const totpSecret = speakeasy.generateSecret({ length: 20 }).base32;
    const encryptedSecret = encryptSecret(totpSecret);

    const { error } = await supabase
      .from('totp')
      .insert([
        { user_id_string: userId, totp_code: encryptedSecret }
      ]);

    if (error) {
      throw error;
    }

    const totpCode = speakeasy.totp({
      secret: totpSecret,
      encoding: 'base32'
    });

    await sendTOTPByEmail(email, totpCode); // Send the TOTP code, not the secret or encrypted secret

    res.json({ success: true, message: 'TOTP email sent successfully.' });

  } catch (error) {
    console.error('Error in TOTP process:', error);
    res.status(500).json({ success: false, message: 'Failed in TOTP process.', error: error.message });
  }
});

export default router;
