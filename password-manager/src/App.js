// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './HomePage';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import Settings from './Settings';
import NewPassword from './NewPassword';
import TwoFactorAuthentication from './2FA';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<TwoFactorAuthentication/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/newpassword" element={<NewPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

