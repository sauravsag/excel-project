// File: client/src/components/AdminPanel.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        alert("Access Denied: Admins only.");
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      console.error('Invalid token:', err);
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.warn("Expected array, got:", data);
          setUsers([]); // fallback to empty array
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchUsers();
    fetchStats();
  }, [navigate, token]);

  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter(user => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>

      {stats && (
        <div>
          <p><strong>Total Users:</strong> {stats.userCount}</p>
          <p><strong>Total Files:</strong> {stats.fileCount}</p>
          <h4>Chart Types Used:</h4>
          <ul>
            {Array.isArray(stats.chartTypes) ? (
              stats.chartTypes.map(c => (
                <li key={c._id}>{c._id || 'N/A'}: {c.count}</li>
              ))
            ) : (
              <li>No chart data available</li>
            )}
          </ul>
        </div>
      )}

      <h3>User Management</h3>
      {Array.isArray(users) && users.length > 0 ? (
        <table border="1" cellPadding="6" cellSpacing="0">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Registered</th>
            <th>Last Login</th>
            <th>Status</th>
            <th>Last 5 Activities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{new Date(user.registeredAt).toLocaleString()}</td>
              <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
              <td className={user.isLoggedIn ? 'text-green-600' : 'text-red-600'}>
                {user.isLoggedIn ? 'Online' : 'Offline'}
              </td>
              <td>
                <ul>
                  {user.activityLogs?.map((log, idx) => (
                    <li key={idx}>{log}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      ) : (
        <p>No users found or failed to load users.</p>
      )}
    </div>
  );
}

export default AdminPanel;
