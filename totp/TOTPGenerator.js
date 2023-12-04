const speakeasy = require('speakeasy');

const generateTOTP = (secret) => {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
};

// Generate a test secret key
const secret = speakeasy.generateSecret({length: 20}).base32;

// Test the generateTOTP function
const testTOTP = generateTOTP(secret);
console.log(`Generated TOTP: ${testTOTP}`);
