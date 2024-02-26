import dotenv from 'dotenv';
dotenv.config();

import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';
import { generateTOTP, encryptSecret } from './TOTPGenerator.js';

const EMAIL_USER = process.env.EMAIL_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: APP_PASSWORD },
});

let emailSendTimestamps = {};

const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_EMAILS_PER_HOUR = 5;

async function canSendEmail(email) {
  const currentTime = Date.now();
  const timestamps = emailSendTimestamps[email] || [];
  const filteredTimestamps = timestamps.filter(timestamp => currentTime - timestamp < RATE_LIMIT_WINDOW);

  console.log(`Filtered Timestamps for ${email}:`, filteredTimestamps); // Logging for troubleshooting

  emailSendTimestamps[email] = filteredTimestamps;
  return filteredTimestamps.length < MAX_EMAILS_PER_HOUR;
}

const sendTOTPByEmail = async (email, secret) => {
  console.log(`Attempting to send email to ${email}. Current timestamps:`, emailSendTimestamps[email]); // Initial logging

  if (!await canSendEmail(email)) {
    console.error('Rate limit exceeded for', email);
    return;
  }

  const totp = generateTOTP(secret);
  let mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Your TOTP Code',
    text: `Your TOTP code is: ${totp}`,
    html: `<p>Your TOTP code is: <b>${totp}</b></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    emailSendTimestamps[email] = emailSendTimestamps[email] || [];
    emailSendTimestamps[email].push(Date.now());
    console.log(`Email sent successfully to ${email}. Updated timestamps:`, emailSendTimestamps[email]); // Logging on successful send
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Testing the rate limit
const testEmail = 'totptest01@gmail.com';
const plainTestSecret = speakeasy.generateSecret({ length: 20 }).base32;
const encryptedTestSecret = encryptSecret(plainTestSecret);

// Send multiple emails for testing
async function testRateLimit() {
  for (let i = 0; i < 10; i++) {
    await sendTOTPByEmail(testEmail, encryptedTestSecret);
  }
}

testRateLimit()
  .then(() => console.log('Rate limit test completed'))
  .catch(err => console.error('Error during rate limit test:', err));
