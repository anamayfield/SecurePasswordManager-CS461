import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
console.log("TOTP_ENCRYPTION_KEY:", process.env.TOTP_ENCRYPTION_KEY);


import speakeasy from 'speakeasy';
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16
const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY; 

// Encryption Function
const encryptSecret = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decryptSecret = (encryptedText) => {
  const textParts = encryptedText.split(':');
  
  const iv = Buffer.from(textParts[0], 'hex');
  const encrypted = textParts[1];
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};


const generateTOTP = (encryptedSecret) => {
    const secret = decryptSecret(encryptedSecret);
    return speakeasy.totp({ secret, encoding: 'base32' });
};

const verifyTOTP = (token, encryptedSecret) => {
    const secret = decryptSecret(encryptedSecret);
    return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
};



// module.exports = { testTOTP, generateTOTP, verifyTOTP, encryptSecret, decryptSecret };


// For testing purposes only
const testSecret = speakeasy.generateSecret({ length: 20 }).base32;
const encryptedSecret = encryptSecret(testSecret);
const testTOTP = generateTOTP(encryptedSecret);
console.log(`Generated TOTP: ${testTOTP}`);
const isVerified = verifyTOTP(testTOTP, encryptedSecret);
console.log(`Is TOTP Verified: ${isVerified}`);




export { generateTOTP, verifyTOTP, encryptSecret, decryptSecret };

