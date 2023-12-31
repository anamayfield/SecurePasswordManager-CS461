import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Implement the registration logic here
  };

  return (
    <div className="Register">
      <div className="register-left">
        <div className="register-content">
          <h1 className="register-title">Secure Password Manager</h1>
          <p>Password Security Made Simple.</p>
          <p>Encrypted password management to protect your most sensitive credentials.</p>
        </div>
      </div>
      <div className="register-right">
        <div className="register-form">
          <h2 className="register-form-title">Sign up to get started</h2>
          <form>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <br />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <button type="button" onClick={handleRegister} className="register-button">
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
