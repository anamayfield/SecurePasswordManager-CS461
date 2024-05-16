import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleSignOut } from './HandleSignOut';
import { useApiKey } from './apiKeyManager';
import './global-styles.css';
import './NewPassword.css';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

const NewPassword = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); 
  const parentId = cookies.get('parentId');
  const apiKey = useApiKey();
  const [formData, setFormData] = useState({
    websiteUrl: '',
    emailOrUsername: '',
    password: '',
    notes: ''
  });

  if (!parentId) {
    navigate('/login');
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateRandomPassword = () => {
    const uppercaseLetters = 'ABCDEFGHIKLMNOPQRSTUVWXYX';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*_-';

    const minUpper = 1;
    const minLower = 1;
    const minNumber = 1;
    const minSpecial = 1;

    const passwordLength = 12;
    const remainingLength =
      passwordLength - (minUpper + minLower + minNumber + minSpecial);

    let newPassword = '';

    const getRandomChar = (category) => {
      const randomIndex = Math.floor(Math.random() * category.length);
      return category.charAt(randomIndex);
    };

    newPassword +=
      getRandomChar(uppercaseLetters) +
      getRandomChar(lowercaseLetters) +
      getRandomChar(numbers) +
      getRandomChar(specialChars);

    for (let i = 0; i < remainingLength; i++) {
      const randomCategoryIndex = Math.floor(Math.random() * 4);
      switch (randomCategoryIndex) {
        case 0:
          newPassword += getRandomChar(uppercaseLetters);
          break;
        case 1:
          newPassword += getRandomChar(lowercaseLetters);
          break;
        case 2:
          newPassword += getRandomChar(numbers);
          break;
        case 3:
          newPassword += getRandomChar(specialChars);
          break;
        default:
          break;
      }
    }

    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    setFormData({
      ...formData,
      password: newPassword,
    });

    console.log('Generated password:', formData.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://cs463.dimedash.xyz/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "apiKey": "{apiKey}",
          "parentAccountId": parentId,
          ...formData,
        }),
      });

      if (!response.ok) {
        let errorMessage = '';
        switch (response.status) {
          case 400:
            errorMessage = 'Bad request. Please check your input data.';
            break;
          case 404:
            errorMessage = 'Not found. The requested resource does not exist.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage = `HTTP error! Status: ${response.status}`;
            break;
        }
        console.log(errorMessage);
        throw new Error(errorMessage);
      }

      const newPasswordData = await response.json();
      console.log('New Password Data:', newPasswordData);
      navigate('/dashboard');

    } catch (error) {
      if (error instanceof TypeError && error.message === 'Load failed') {
        setErrorMessage('Request timed out. Please try again later.');
      } else {
        console.error('Error submitting data:', error);
        setErrorMessage('Error adding password. Please try again.');
      }
    }

  };

  const signOut = async () => {
    await handleSignOut(navigate, cookies);
  };

  return (
    <div className="NewPassword">
      <div className="sidebar">
        <h2>Secure Password Manager</h2>
        <ul>
          <li><Link to="/dashboard">All Passwords</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
        <button onClick={signOut} className="button">
          <LogoutRoundedIcon style={{ verticalAlign: 'middle' }} /> 
          <span style={{ verticalAlign: 'middle' }}>Sign Out</span>
        </button>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <div className="title-container">
            <h3>All Passwords</h3>
            <Link to="/newpassword" className="button">+ Add New</Link>
          </div>
        </div>
        <div className="title">
          <h2>New Password</h2>
        </div>
        <div className="form2">
          <div className="form-container">
          <form onSubmit={handleSubmit}>
            <input 
              type="text"
              placeholder="Website URL"
              name="websiteUrl"
              value={formData.websiteUrl} 
              onChange={handleInputChange} 
            />
            <br />
            <input 
              type="text" 
              placeholder="Email or Username"
              name="emailOrUsername"
              value={formData.emailOrUsername} 
              onChange={handleInputChange} 
            />
            <br />
            <input 
              type="text" 
              placeholder="Notes"
              name="notes"
              value={formData.notes} 
              onChange={handleInputChange} 
            />
            <br />
            <input 
              type="password" 
              placeholder="Password"
              name="password"
              value={formData.password} 
              onChange={handleInputChange} 
            />
            <button type="button" onClick={generateRandomPassword} className="button3">
              Generate Random Password
            </button>
          </form>
          </div>
          <button type="submit" onClick={handleSubmit} className="button3">
              Save
          </button>
          <br />
          <span className={`error-message ${errorMessage ? 'visible' : ''}`}>
              {errorMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;