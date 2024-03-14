import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import speakeasy from 'speakeasy';
import crypto from 'crypto';

console.log("TOTP_ENCRYPTION_KEY:", process.env.TOTP_ENCRYPTION_KEY);

const algorithm = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16
const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY;

const encryptSecret = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

const decryptSecret = (encryptedText) => {
    if (!encryptedText || !encryptedText.includes(':')) {
        console.error('Encrypted text is undefined, empty, or in an incorrect format:', encryptedText);
        return '';
    }
    console.log("Encrypted text received:", encryptedText);
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts[0], 'hex');
    const encrypted = textParts[1];

    console.log("IV length:", iv.length);
    console.log("Encrypted part length:", encrypted.length);

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Simplified for clarity
const generateTOTP = (encryptedSecret) => {
  const secret = decryptSecret(encryptedSecret); // Ensure decryption is successful
  return speakeasy.totp({ secret, encoding: 'base32' }); // Generate TOTP
};

const verifyTOTP = (token, encryptedSecret) => {
    const secret = decryptSecret(encryptedSecret);
    return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
};

const generateTOTPSecret = () => {
    const secret = speakeasy.generateSecret({length: 20});
    return secret.base32; // Use the base32 encoded secret
};

export { generateTOTP, verifyTOTP, encryptSecret, decryptSecret, generateTOTPSecret };
