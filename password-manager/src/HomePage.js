import React from 'react';
import { Link } from 'react-router-dom';
import './global-styles.css';
import './HomePage.css';

const Homepage = () => {
  return (
    <div className="Homepage">
      <div className="split-left">
        <div className="homepage-content">
          <h1 className="homepage-title">Secure Password Manager</h1>
          <p>Password Security Made Simple.</p>
          <p>Encrypted password management to protect your most sensitive credentials.</p>
        </div>
      </div>
      <div className="split-right">
        <div className="homepage-buttons">
          <h2 className='button-title'>New around here?</h2>
          <Link to="/register" className="button">
            CREATE AN ACCOUNT
          </Link>
          <h2 className="button-title"> OR </h2>
          <Link to="/login" className="button">
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
