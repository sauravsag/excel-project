// File: src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let isAdmin = false;
  let username = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === 'admin';
      username = decoded.username || decoded.email || '';
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const handleLogout = async () => {
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
      navigate('/');
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      {token && (
        <div>
          <button
            className="p-4 text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {/* Hamburger Icon */}
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-black"></div>
              <div className="w-6 h-0.5 bg-black"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </div>
          </button>

          {sidebarOpen && (
            <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-50 p-5">
              <div className="flex flex-col items-center mb-6">
                {/* Circular Avatar */}
                <div className="w-16 h-16 bg-blue-600 text-white text-2xl rounded-full flex items-center justify-center">
                  {username.charAt(0).toUpperCase()}
                </div>
                <p className="mt-2 text-lg font-semibold">Welcome, {username}</p>
                <button className="text-sm text-blue-500 underline">Edit</button>
              </div>

              <nav className="flex flex-col space-y-3 text-left px-4">
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <Link to="/upload" className="hover:underline">Upload</Link>
                <Link to="/history" className="hover:underline">History</Link>
                {isAdmin && <Link to="/admin" className="hover:underline">Admin</Link>}
                <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Main Title in Center */}
      <div className="flex-1 flex justify-center items-center p-4 text-2xl font-bold text-gray-800">
        Excel Analytics Platform
      </div>
    </div>
  );
}

export default Navbar;
