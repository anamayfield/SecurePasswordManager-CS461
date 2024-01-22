import React from 'react';
import { Link } from 'react-router-dom';
import './global-styles.css';
import './Dashboard.css';

const Dashboard = () => {
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
            <Link to="/newpassword" className="button">+ Add New</Link>
          </div>
        </div>
        <input type="text" placeholder="Search Passwords" class="search-bar"/>
        <table className="passwords-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google</td>
              <td>Email</td>
              <td>2 years ago</td>
            </tr>
            <tr>
              <td>Netflix</td>
              <td>Streaming Service</td>
              <td>4 months ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
