/**
 * Generates a mock Time-based One-Time Password (TOTP)
 * NOTE: This is a placeholder function and should be replaced with real TOTP generation logic in production.
 *
 * @returns {number} A mock six-digit TOTP
 */

const generateMockTOTP = () => {
    let totp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Generated Mock TOTP: ${totp}`);
    return totp;
};

export default generateMockTOTP;
