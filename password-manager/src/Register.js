import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import './global-styles.css';
import './LoginRegister.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const supabase_url = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
  const anon_key =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';

  const supabase = createClient(supabase_url, anon_key);

  const validateInput = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordMinLength = 8;

    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = password.length >= passwordMinLength;

    const errors = {
      email: isEmailValid ? null : 'Invalid email format',
      password: isPasswordValid ? null : 'Password must be at least 8 characters',
    };

    setValidationErrors(errors);

    return isEmailValid && isPasswordValid;
  };

  const handleRegister = async () => {
    if (validateInput()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error signing up:', error.message);
      } else {
        console.log('Sign up successful. User data:', data);

        navigate('/confirm-email');
      }
    } else {
      console.error('Validation errors:', validationErrors);
    }
  };

  return (
    <div className="LoginRegister">
      <div className="split-left">
        <div className="login-register-content">
          <h1 className="login-register-title">Secure Password Manager</h1>
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
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
            <div className="validation-error">
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
