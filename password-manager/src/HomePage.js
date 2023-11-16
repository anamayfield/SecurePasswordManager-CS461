import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const Homepage = () => {
  return (
    <div className="Homepage">
      <div className="homepage-left">
        <div className="homepage-content">
          <h1 className="homepage-title">Secure Password Manager</h1>
          <p>Password Security Made Simple.</p>
          <p>Encrypted password management to protect your most sensitive credentials.</p>
        </div>
      </div>
      <div className="homepage-right">
        <div className="homepage-buttons">
          <Link to="/register" className="homepage-button">
            CREATE AN ACCOUNT
          </Link>
          <Link to="/login" className="homepage-button">
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
