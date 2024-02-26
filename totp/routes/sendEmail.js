import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

import express from 'express';
const router = express.Router();

import { sendTOTPByEmail } from '../EmailService.js'; 


router.post('/send-totp', async (req, res) => {
  const { email, secret } = req.body;
  try {
    await sendTOTPByEmail(email, secret);
    res.json({ success: true, message: 'TOTP email sent successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send TOTP email.', error: error.message });
  }
});

export default router;
