import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './global-styles.css';
import './AccessPassword.css';

const AccessPassword = () => {
  const [formData, setFormData] = useState({
    name: 'Example Account',
    username: 'user.name@gmail.com',
    password: 'password1234',
    category: 'Social',
    lastUpdate: '2 weeks ago',
  });

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = (field) => {
    if (field === 'username') {
      setIsEditingUsername(true);
    } else if (field === 'category') {
      setIsEditingCategory(true);
    }
  };

  const handleSubmitEdit = () => {
    setIsEditingUsername(false);
    setIsEditingCategory(false);
    // Add logic to save changes
  };

  return (
    <div className="AccessPassword">
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
            <Link to="/dashboard" className="button">All Passwords</Link>
          </div>
        </div>
        <div className="password-details">
          <h2 className="password-name">{formData.name}</h2>
          <p className="warning-message"></p>
          <div className="divider"></div>
          <div className="info-section">
            <div className="info-title">USERNAME</div>
            {isEditingUsername ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            ) : (
              <div className="info-data">
                {formData.username}
                <button onClick={() => handleEditClick('username')} className="edit-button">Edit</button>
              </div>
            )}
          </div>
          <div className="divider"></div>
          <div className="info-section">
            <div className="info-title">PASSWORD</div>
            <div className="info-data">{formData.password}</div>
          </div>
          <div className="divider"></div>
          <div className="info-section">
            <div className="info-title">CATEGORY</div>
            {isEditingCategory ? (
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="custom-dropdown"
              >
                <option value="social">Social</option>
                <option value="work">Work</option>
              </select>
            ) : (
              <div className="info-data">
                {formData.category}
                <button onClick={() => handleEditClick('category')} className="edit-button">Edit</button>
              </div>
            )}
          </div>
          <div className="divider"></div>
          <div className="info-section">
            <div className="info-title">LAST UPDATE</div>
            <div className="info-data">{formData.lastUpdate}</div>
          </div>
          <div className="divider"></div>
          <div className="button-container">
            <button className="button2">Change password on website</button>
            <button className="button2">Copy password</button>
            <button className="button2">Delete password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessPassword;
