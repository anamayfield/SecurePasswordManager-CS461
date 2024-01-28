import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import './global-styles.css';
import './LoginRegister.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // New state for error
  const navigate = useNavigate();

  const supabase_url = 'https://dtwmtlfnskzbtsgndetr.supabase.co';
  const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d210bGZuc2t6YnRzZ25kZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4ODQxMTMsImV4cCI6MjAxNzQ2MDExM30.qoYr-kxeXb4I3rRe-dzqaC__SWiAUt4g1YSsES01mxk';

  const supabase = createClient(supabase_url, anon_key);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error signing in:', error.message);
      setError('Invalid email or password. Please try again.');
    } else {
      console.log('Sign in successful. User data:', data);
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
            {error && <p className="error-message">{error}</p>}
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
