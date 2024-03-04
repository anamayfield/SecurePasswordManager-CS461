import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSupaClient, signIn } from './Authentication/Authenticate';
import './global-styles.css';
import './LoginRegister.css';

const Login = ({ supabase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    const supabase = createSupaClient();
    const response = await signIn(supabase, email, password);

    if (response.error) {
        console.error('Error signing in:', response.error.message);
        setErrorMessage('Invalid email or password. Please try again.');
    } else if (response.data) {
        console.log('Sign in successful. User data:', response.data);

        // Trigger TOTP Email sending after successful login
        fetch('http://localhost:3001/api/totp/send-totp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }) // Assuming email is the user's email
        })
        .then(response => response.json())
        .then(data => {
          console.log('Email sent successfully', data);
          navigate('/verify');
        })
        .catch(error => console.error('Error sending email:', error));
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
          <h2 className="login-register-form-title">Welcome back</h2>
          <form>
            <input
              type="text"
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
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="button" onClick={handleLogin} className="button">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
