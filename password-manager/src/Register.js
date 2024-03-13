import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { createSupaClient, signUp, getUserParentID, storeTOTPAndUser } from './Authentication/Authenticate';
import { generateTOTPSecret } from './totp/TOTPGenerator'; 
import './global-styles.css';
import './LoginRegister.css';

const cookies = new Cookies();

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleRegister = async () => {
    const supabase = createSupaClient();
    const response = await signUp(supabase, email, password);

    if (response.error) {
        console.error('Error signing up:', response.error.message);
        setErrorMessage('Error signing up. Please try again.');
    } else if (response.data) {
      const totpSecret = generateTOTPSecret(); // Generate TOTP secret
      await storeTOTPAndUser(supabase, totpSecret); // Use the generated TOTP secret
      const userIdResponse = await getUserParentID(supabase);

      if (userIdResponse.error) {
        console.error('Error getting user ID:', userIdResponse.error.message);
        setErrorMessage('Error getting user ID. Please try again.');
        return;
      }

      try {
        // Trigger TOTP Email sending after successful registration
        const totpResponse = await fetch('https://obscure-lake-93009-52cae5311953.herokuapp.com/api/totp/send-totp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });

        if (!totpResponse.ok) {
          throw new Error(`HTTP error! Status: ${totpResponse.status}`);
        }

        const totpData = await totpResponse.json();
        console.log('Email sent successfully', totpData);

        cookies.set('userId', response.data.user.id, { path: '/' });
        console.log('User ID set in cookies:', response.data.user.id);
        
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
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <div className="error-message">
              {validationErrors.email && <p>{validationErrors.email}</p>}
              {validationErrors.password && <p>{validationErrors.password}</p>}
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