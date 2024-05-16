
import { generateTOTP, verifyTOTP, encryptSecret, generateTOTPSecret } from './TOTPGenerator.js';

// Generate a new TOTP secret and encrypt it
const plainSecret = generateTOTPSecret();
const encryptedSecret = encryptSecret(plainSecret);

console.log('Plain Secret:', plainSecret);
console.log('Encrypted Secret:', encryptedSecret);

// Generate a TOTP token
const token = generateTOTP(encryptedSecret);
console.log('Generated TOTP Token:', token);

// Verify the TOTP token
const isValid = verifyTOTP(token, encryptedSecret);
console.log('Is TOTP Token Valid:', isValid);
