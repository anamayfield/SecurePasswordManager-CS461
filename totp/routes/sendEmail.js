import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

import express from 'express';
const router = express.Router();

import speakeasy from 'speakeasy';
import { sendTOTPByEmail } from '../EmailService.js'; 
import { encryptSecret } from '../TOTPGenerator.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


router.post('/send-totp', async (req, res) => {
  const { email, userId } = req.body; // Ensure you're receiving the userId from the client
  try {
    const totpSecret = speakeasy.generateSecret({ length: 20 }).base32;
    const encryptedSecret = encryptSecret(totpSecret); // from TOTPGenerator.js

    // Store the encrypted TOTP secret in the database with the user's ID
    const { data, error } = await supabase
      .from('totp') 
      .insert([
        { totp_code: encryptedSecret, user_id_string: userId }
      ]);

    if (error) {
      throw error;
    }

    await sendTOTPByEmail(email, encryptedSecret); // Use the encrypted secret to generate the TOTP code for the email

    res.json({ success: true, message: 'TOTP email sent successfully.' });
  } catch (error) {
    console.error('Error in TOTP process:', error);
    res.status(500).json({ success: false, message: 'Failed in TOTP process.', error: error.message });
  }
});

export default router;
