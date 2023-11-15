function generateMockTOTP() {
    let totp = Math.floor(100000 + Math.random() * 900000); // Generate a random six-digit number
    console.log(`Generated Mock TOTP: ${totp}`);
    return totp;
}

// Example call to the function
generateMockTOTP();


