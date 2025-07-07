// File: client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || 'User');
      } catch (error) {
        console.error('Invalid token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Logout failed on server:', err);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h2 className="text-xl font-semibold mb-2">Welcome, {username}!</h2>
      <h3 className="text-lg font-medium mb-4">Excel Analytics Platform</h3>
      <div className="space-x-4 mb-4">
        <Link to="/upload">
          <button className="px-4 py-2 border rounded hover:bg-gray-100">Upload Excel</button>
        </Link>
        <Link to="/history">
          <button className="px-4 py-2 border rounded hover:bg-gray-100">View File History</button>
        </Link>
        <Link to="/admin">
          <button className="px-4 py-2 border rounded hover:bg-gray-100">Admin Panel</button>
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 border rounded text-red-600 hover:bg-red-100"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
