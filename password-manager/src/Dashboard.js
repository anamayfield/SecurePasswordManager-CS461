import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './global-styles.css';
import './Dashboard.css';

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://cs462.judahparker.com/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: 'x7hLkybNxzshSUKG',
            parentAccountId: 100,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
    
        if (Array.isArray(responseData.accounts)) {
          setPasswords(responseData.accounts);
          setLoading(false);
        } else {
          console.error('Invalid data format. Expected "accounts" array.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);

  const handleRowClick = (password) => {
    navigate(`/access-password/${password.id}`, { state: { password } });
  };

  return (
    <div className="Dashboard">
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
            <Link to="/new-password" className="button">+ Add New</Link>
          </div>
        </div>
        <input type="text" placeholder="Search Passwords" className="search-bar"/>
          <table className="passwords-table">
          <thead>
            <tr>
              <th>Website URL</th>
              <th>Username or Email</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">Loading...</td>
              </tr>
            ) : (
              passwords.map((password) => (
                <tr key={password.id} onClick={() => handleRowClick(password)}>
                  <td>{password.websiteUrl}</td>
                  <td>{password.emailOrUsername}</td>
                  <td>{password.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
