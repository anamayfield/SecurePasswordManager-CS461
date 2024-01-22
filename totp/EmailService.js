const nodemailer = require('nodemailer');
const { generateTOTP } = require('./TOTPGenerator'); // Adjust the path as needed

// Set up nodemailer transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'totptest01@gmail.com', 
    pass: 'Thisisapassword01' 
  }
});

const sendTOTPByEmail = async (email, secret) => {
  const totp = generateTOTP(secret);

  let mailOptions = {
    from: 'totptest@gmail.com', 
    to: email,
    subject: 'Your TOTP Code',
    text: `Your TOTP code is: ${totp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendTOTPByEmail };
