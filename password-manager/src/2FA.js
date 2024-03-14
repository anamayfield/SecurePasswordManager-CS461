import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './global-styles.css';
import './2FA.css';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const TwoFactorAuthentication = () => {
  const navigate = useNavigate();
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
    if (inputs && inputs.length > 0) {
      inputs.forEach((input) => {
        input.addEventListener('input', handleInput);
        input.addEventListener('keyup', handleKeyup);
      });
    }
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

  const handleVerificationSubmit = async () => {
    const userId = cookies.get('userId'); // Replaced localStorage retrieval cookies
    if (!userId) {
        console.error('User ID is undefined or not found.');
        return;
    }
    const fullCode = TOTP.join('');
    console.log('Verifying code:', fullCode);

    // POST request to backend endpoint for TOTP verification
    try {
      const response = await fetch('https://obscure-lake-93009-52cae5311953.herokuapp.com/api/verify-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totpCode: fullCode, userId: userId }),
      });      
        const data = await response.json();
        if (data.success) {
            console.log('TOTP verification successful');
            navigate('/dashboard')
        } else {
            console.error('TOTP verification failed');
            // Handle verification failure
        }
    } catch (error) {
        console.error('Error verifying TOTP code:', error);
    }
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
