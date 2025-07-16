import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
      } catch (error) {
        console.error("Invalid token");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout failed on server:", err);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-2 text-indigo-400">
          Welcome, {username}!
        </h2>
        <h3 className="text-lg mb-8 text-gray-300">
          Let’s visualize your Excel data 🎯
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/upload">
            <button className="w-48 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium">
              Upload Excel
            </button>
          </Link>
          <Link to="/history">
            <button className="w-48 py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition font-medium">
              View History
            </button>
          </Link>
          <Link to="/admin">
            <button className="w-48 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition font-medium">
              Admin Panel
            </button>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 py-3 px-6 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
