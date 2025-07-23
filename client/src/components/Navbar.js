import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Navbar({ darkMode, setDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let isAdmin = false;
  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === "admin";
      username = decoded.username || decoded.email || "";
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="flex bg-gray-900 text-gray-200 shadow-md relative z-50">
      {/* Sidebar Toggle */}
      {token && (
        <div>
          <button
            className="p-4 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {/* Hamburger Icon */}
            <div className="space-y-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-0.5 bg-gray-200 transition-colors"
                />
              ))}
            </div>
          </button>

          {/* Sidebar */}
          {sidebarOpen && (
            <div
              ref={sidebarRef}
              className="fixed top-0 left-0 w-64 h-full bg-gray-800 dark:bg-gray-900 shadow-lg z-50 p-5 text-gray-200"
            >
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-indigo-600 text-white text-2xl rounded-full flex items-center justify-center">
                  {username.charAt(0).toUpperCase()}
                </div>
                <p className="mt-2 text-lg font-semibold">
                  Welcome, {username}
                </p>
                <button className="text-sm text-indigo-400 hover:underline">
                  Edit
                </button>
              </div>

              <nav className="flex flex-col space-y-3 text-left px-4">
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <Link to="/upload" className="hover:underline">
                  Upload
                </Link>
                <Link to="/history" className="hover:underline">
                  History
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline text-left"
                >
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Main Title Center */}
      <div className="flex-1 flex justify-center items-center p-4 text-2xl font-bold select-none">
        Graphique
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center px-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition"
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
