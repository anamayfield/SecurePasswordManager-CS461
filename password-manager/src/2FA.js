import React, { useState, useRef, useEffect } from 'react';
import './global-styles.css';
import './2FA.css';

const TwoFactorAuthentication = () => {
  const [TOTP, setTOTP] = useState(['', '', '', '', '' ,'']);
  const inputsRef = useRef([]);

  // The following code is adapted from code from GeeksforGeeks tutorial "Create OTP Input Field using HTML, CSS, and JavaScript"
  // URL: https://www.geeksforgeeks.org/create-otp-input-field-using-html-css-and-javascript/

  useEffect(() => {
    const handleInput = (e) => {
      const target = e.target;
      const val = target.value;

      if (isNaN(val)) {
        target.value = '';
        return;
      }

      if (val !== '') {
        const next = target.nextElementSibling;
        if (next) {
          next.focus();
        }
      }
    };

    const handleKeyup = (e) => {
      const target = e.target;
      const key = e.key.toLowerCase();

      if (key === 'backspace' || key === 'delete') {
        target.value = '';
        const prev = target.previousElementSibling;
        if (prev) {
          prev.focus();
        }
        return;
      }
    };

    const inputs = inputsRef.current;
    inputs.forEach((input) => {
      input.addEventListener('input', handleInput);
      input.addEventListener('keyup', handleKeyup);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('keyup', handleKeyup);
      });
    };
  }, []);

  const handleCodeChange = (index, e) => {
    const value = e.target.value;
    const newTOTP = [...TOTP];
    newTOTP[index] = value;
    setTOTP(newTOTP);

    if (value !== '' && index < TOTP.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleVerificationSubmit = () => {
    // Add 2FA verification logic here

    const fullCode = TOTP.join('');
    console.log('Verifying code:', fullCode);
  };

  return (
    <div className="Verify">
      <h1>Authenticate Your Account</h1>
      <h2>A verification code has been sent to your email, please enter the code below.</h2>
      <div className="inputs">
        {TOTP.map((value, index) => (
          <input
          className='verify-input'
            key={index}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={value}
            onChange={(e) => handleCodeChange(index, e)}
            ref={(inputRef) => (inputsRef.current[index] = inputRef)}
          />
        ))}
      </div>
      <button className="button" onClick={handleVerificationSubmit}>SUBMIT</button>
    </div>
  );
};

export default TwoFactorAuthentication;
