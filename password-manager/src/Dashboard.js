import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleSignOut } from './HandleSignOut';
import { useApiKey } from './apiKeyManager';
import './global-styles.css';
import './Dashboard.css';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

function findDuplicatePasswords(accounts) {
  const passwordMap = new Map();
  const duplicates = new Set();

  accounts.forEach(account => {
      if (passwordMap.has(account.password)) {
          passwordMap.get(account.password).push(account.id);
          duplicates.add(account.password);
      } else {
          passwordMap.set(account.password, [account.id]);
      }
  });

  const duplicateAccounts = [];
  duplicates.forEach(password => {
      const ids = passwordMap.get(password);
      if (ids.length > 1) {
          duplicateAccounts.push({password, ids});
      }
  });

  return duplicateAccounts;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const apiKey = useApiKey();
  console.log(apiKey);
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [duplicatePasswords, setDuplicatePasswords] = useState([]);

  const parentId = cookies.get('parentId');
  console.log(parentId)

  useEffect(() => {
    if (!parentId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('https://cs463.dimedash.xyz/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: apiKey,
            parentAccountId: parentId,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
    
        if (Array.isArray(responseData.accounts)) {
          setPasswords(responseData.accounts);
          setDuplicatePasswords(findDuplicatePasswords(responseData.accounts));
          setLoading(false);
        } else {
          console.error('Invalid data format. Expected "accounts" array.');
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof TypeError && error.message === 'Load failed') {
          setErrorMessage('Request timed out. Please try again later.');
          setLoading(false);
        } else {
          console.error('Error fetching user data:', error);
          setErrorMessage('Error fetching user data. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [navigate, parentId, apiKey]);

  useEffect(() => {
    const filtered = passwords.filter((password) =>
      password.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      password.emailOrUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      password.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPasswords(filtered);
  }, [searchQuery, passwords]);

  const handleRowClick = (password) => {
    const isDuplicate = duplicatePasswords.some(d => d.ids.includes(password.id));
    navigate(`/access-password/${password.id}`, { state: { password: password, isDuplicate: isDuplicate } });
  };

  const signOut = async () => {
    await handleSignOut(navigate, cookies);
  };
  
  return (
    <div className="Dashboard">
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
            <Link to="/new-password" className="button">+ Add New</Link>
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Passwords"
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchRoundedIcon className="search-icon"/>
        </div>
        <table className="passwords-table">
          <thead>
            <tr>
              <th>Website URL</th>
              <th>Username or Email</th>
              <th>Notes</th>
              <th>Warnings</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading...</td>
              </tr>
            ) : (
              filteredPasswords.map((password) => (
                <tr key={password.id} onClick={() => handleRowClick(password)}>
                  <td>{password.websiteUrl}</td>
                  <td>{password.emailOrUsername}</td>
                  <td>{password.notes}</td>
                  {duplicatePasswords.some(d => d.ids.includes(password.id)) ? (
                    <td><WarningRoundedIcon style={{ color: 'var(--errorRed)' }} /></td>
                  ) : (
                    <td></td>  // Empty cell if no warning
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <span className={`error-message ${errorMessage ? 'visible' : ''}`}>
              {errorMessage}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
