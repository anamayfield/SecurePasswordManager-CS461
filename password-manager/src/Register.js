import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { createSupaClient, signUp, storeTOTPAndUser } from './Authentication/Authenticate';
import './global-styles.css';
import './LoginRegister.css';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

const cookies = new Cookies();

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleRegister = async () => {
    const supabase = createSupaClient();
    const response = await signUp(supabase, email, password);

    if (response.error) {
        console.error('Error signing up:', response.error.message);
        setErrorMessage(response.error.message + ' Please try again.');
    } else if (response.data) {
      const userId = response.data.user.id; // Assuming this is how you get the userId from the response

      try {
        // Trigger TOTP Email sending after successful registration
        const totpResponse = await fetch('https://obscure-lake-93009-52cae5311953.herokuapp.com/api/totp/send-totp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, userId: userId }) // Include userId in the request body
        });

        if (!totpResponse.ok) {
          throw new Error(`HTTP error! Status: ${totpResponse.status}`);
        }

        const totpData = await totpResponse.json();
        console.log('Email sent successfully', totpData);

        // Assuming storeTOTPAndUser is modified to accept totpCode as an argument
        if (totpData.success && totpData.totpCode) {
          await storeTOTPAndUser(supabase, totpData.totpCode, userId);
        }

        cookies.set('userId', userId, { path: '/' });
        console.log('User ID set in cookies:', userId);
        
        navigate('/verify');

      } catch (error) {
        console.error('Error sending TOTP email:', error);
        setErrorMessage('Error sending TOTP email. Please try again.');
      }
    } 
  };
  
  return (  
    <div className="LoginRegister">
      <div className="split-left">
        <div className="login-register-content">
          <div className="title-box">
            <h1 className="login-register-title">Secure Password Manager</h1>
          </div>
          <p>Password Security Made Simple.</p>
          <p>Encrypted password management to protect your most sensitive credentials.</p>
        </div>
      </div>
      <div className="split-right">
        <div className="form">
          <h2 className="login-register-form-title">Sign up to get started</h2>
          <form onSubmit={handleRegister}>
            <div className="input-container">
              <PersonRoundedIcon className="input-icon" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <br />
            <div className="input-container">
              <EmailRoundedIcon className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <br />
            <div className="input-container">
              <LockRoundedIcon className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <br />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="button" onClick={handleRegister} className="button">
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;