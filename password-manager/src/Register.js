import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSupaClient, signUp } from './Authentication/Authenticate';
import { testFunctionTOTP } from './totp/testFunction';
import './global-styles.css';
import './LoginRegister.css';

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
        setErrorMessage('Invalid email or password. Please try again.');
    } else if (response.data) {
        console.log('Sign up successful. User data:', response.data);
        navigate('/verify');
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