import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './global-styles.css';
import './NewPassword.css';

const NewPassword = () => {
  const [formData, setFormData] = useState({
    website: '',
    name: '',
    email: '',
    category: '',
    password: '',
  });

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

    // Ensure at least one character from each category
    newPassword +=
      getRandomChar(uppercaseLetters) +
      getRandomChar(lowercaseLetters) +
      getRandomChar(numbers) +
      getRandomChar(specialChars);

    // Generate the remaining characters
    for (let i = 0; i < remainingLength; i++) {
      const randomCategoryIndex = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
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

    console.log('Password from state:', formData.password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="NewPassword">
      <div className="sidebar">
        <h2>Secure Password Manager</h2>
        <ul>
          <li><Link to="/dashboard">All Passwords</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <div className="title-container">
            <h3>All Passwords</h3>
            <Link to="/newpassword" className="button">+ Add New</Link>
          </div>
        </div>
        <h2>New Password</h2>
        <div className="form">
          <div className="form-container">
          <form onSubmit={handleSubmit}>
            <input 
              type="text"
              placeholder="Website" 
              value={formData.website} 
              onChange={handleInputChange} 
            />
            <br />
            <input 
              type="text" 
              placeholder="Name"
              value={formData.name} 
              onChange={handleInputChange} 
            />
            <br />
            <input 
              type="text" 
              placeholder="Email or Username"
              value={formData.email} 
              onChange={handleInputChange} 
            />
            <br />
            <select 
              name="category"
              placeholder="Category"
              value={formData.category} 
              onChange={handleInputChange}>
              <option value="social">Social</option>
              <option value="work">Work</option>
            </select>
            <br />
            <input 
              type="password" 
              placeholder="Password"
              value={formData.password} 
              onChange={handleInputChange} 
            />
            <button type="button" onClick={generateRandomPassword}className="button">
              Generate Random Password
            </button>
            <br />
          </form>
          </div>
          <button type="submit" className="button">
              Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;