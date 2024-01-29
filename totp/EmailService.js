require('dotenv').config();

const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const { generateTOTP, encryptSecret } = require('./TOTPGenerator');

// Environment Variables
const EMAIL_USER = process.env.EMAIL_USER;
const APP_PASSWORD = process.env.APP_PASSWORD; // App-specific password

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: APP_PASSWORD,
  },
});

// Function to Send TOTP by Email
const sendTOTPByEmail = async (email, secret) => {
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
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Temporary Testing Section
const testEmail = 'ana.alyse13@gmail.com'; 
const plainTestSecret = speakeasy.generateSecret({ length: 20 }).base32;
const encryptedTestSecret = encryptSecret(plainTestSecret);

sendTOTPByEmail(testEmail, encryptedTestSecret)
  .then(() => console.log('Test email sent successfully'))
  .catch(err => console.error('Error sending test email:', err));

module.exports = { sendTOTPByEmail };
