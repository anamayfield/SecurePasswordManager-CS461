import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import './global-styles.css';
import './AccessPassword.css';

const cookies = new Cookies();

const AccessPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userParentId = cookies.get('userParentId');
  const [password, setPassword] = useState();
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (location.state && location.state.password) {
      setPassword(location.state.password);
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    website: '',
    username: '',
    password: '',
    notes: '',
  });

  useEffect(() => {
    setFormData({
      website: password ? password.websiteUrl : '',
      username: password ? password.emailOrUsername : '',
      password: password ? password.password : '',
      notes: password ? password.notes : '',
    });
  }, [password]);

  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = (field) => {
    if (field === 'website') {
      setIsEditingWebsite(true);
    } else if (field === 'username') {
      setIsEditingUsername(true);
    } else if (field === 'notes') {
      setIsEditingNotes(true);
    }
  };

  const handleSubmitWebsiteEdit = async () => {
    setIsEditingWebsite(false);
    await updatePasswordInfo();
  };

  const handleSubmitUsernameEdit = async () => {
    setIsEditingUsername(false);
    await updatePasswordInfo();
  };

  const handleSubmitNotesEdit = async () => {
    setIsEditingNotes(false);
    await updatePasswordInfo();
  };

  const updatePasswordInfo = async () => {
    const newData = {
      apiKey: 'x7hLkybNxzshSUKG',
      idToUpdate: password.id,
      parentAccountId: userParentId,
      websiteUrl: formData.website,
      emailOrUsername: formData.username,
      password: formData.password,
      notes: formData.notes,
    };

    try {
      const response = await fetch('https://cs462.judahparker.com/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        console.log('Password information updated successfully');
      } else {
        console.error('Failed to update password information');
      }
    } catch (error) {
      console.error('Error occurred during the update API call', error);
    }
  };

  const handleDeletePassword = async () => {
    try {
      const response = await fetch('https://cs462.judahparker.com/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: 'x7hLkybNxzshSUKG',
          idToDelete: password.id,
        }),
      });

      if (response.ok) {
        console.log('Password deleted successfully');
        navigate('/dashboard');
      } else {
        console.error('Failed to delete password');
      }
    } catch (error) {
      console.error('Error occurred during the delete API call', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.password)
      .then(() => setCopySuccess(true))
      .catch((error) => console.error('Error copying to clipboard:', error));

    setTimeout(() => setCopySuccess(false), 5000);
  };

  const openWebsite = () => {
    window.open(formData.website, '_blank');
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
        <p className="warning-message"></p>
        <div className="divider"></div>
        <div className="info-section">
          <div className="info-title">WEBSITE</div>
          {isEditingWebsite ? (
            <>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="input"
              />
              <button onClick={handleSubmitWebsiteEdit} className="edit-save-button">Save</button>
            </>
          ) : (
            <div className="info-data">
              {formData.website}
              <button onClick={() => handleEditClick('website')} className="edit-save-button">Edit</button>
            </div>
          )}
        </div>
        <div className="divider"></div>
        <div className="info-section">
          <div className="info-title">USERNAME</div>
          {isEditingUsername ? (
            <>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <button onClick={handleSubmitUsernameEdit} className="edit-save-button">Save</button>
            </>
          ) : (
            <div className="info-data">
              {formData.username}
              <button onClick={() => handleEditClick('username')} className="edit-save-button">Edit</button>
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
          <div className="info-title">NOTES</div>
          {isEditingNotes ? (
            <>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
              <button onClick={handleSubmitNotesEdit} className="edit-save-button">Save</button>
            </>
          ) : (
            <div className="info-data">
              {formData.notes}
              <button onClick={() => handleEditClick('notes')} className="edit-save-button">Edit</button>
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
            <button className="button2" onClick={openWebsite}>Visit website</button>
            <button className="button2" onClick={copyToClipboard}>Copy password</button>
            <button onClick={handleDeletePassword} className="button2">Delete password</button>
            {copySuccess && <p className="copyMessage">Password successfully copied to clipboard.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessPassword;
