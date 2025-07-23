import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        alert("Access Denied: Admins only.");
        navigate("/dashboard");
        return;
      }
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats", {
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-400">
        Admin Dashboard
      </h2>

      {stats && (
        <div className="mb-8">
          <p>
            <strong>Total Users:</strong> {stats.userCount}
          </p>
          <p>
            <strong>Total Files:</strong> {stats.fileCount}
          </p>
          <h4 className="mt-4 font-semibold">Chart Types Used:</h4>
          <ul className="list-disc list-inside">
            {Array.isArray(stats.chartTypes) && stats.chartTypes.length > 0 ? (
              stats.chartTypes.map((c) => (
                <li key={c._id}>
                  {c._id || "N/A"}: {c.count}
                </li>
              ))
            ) : (
              <li>No chart data available</li>
            )}
          </ul>
        </div>
      )}

      <h3 className="text-2xl mb-4">User Management</h3>
      {Array.isArray(users) && users.length > 0 ? (
        <div className="overflow-auto max-w-full">
          <table className="min-w-full table-auto border-collapse border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "Email",
                  "Username",
                  "Role",
                  "Registered",
                  "Last Login",
                  "Status",
                  "Last 5 Activities",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-600 px-3 py-2 text-left text-sm text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="even:bg-gray-800 odd:bg-gray-700">
                  <td className="border border-gray-600 px-3 py-2 break-words max-w-xs">
                    {user.email}
                  </td>
                  <td className="border border-gray-600 px-3 py-2">
                    {user.username}
                  </td>
                  <td className="border border-gray-600 px-3 py-2 capitalize">
                    {user.role}
                  </td>
                  <td className="border border-gray-600 px-3 py-2">
                    {new Date(user.registeredAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-600 px-3 py-2">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "Never"}
                  </td>
                  <td
                    className={`border border-gray-600 px-3 py-2 font-semibold ${
                      user.isLoggedIn ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {user.isLoggedIn ? "Online" : "Offline"}
                  </td>
                  <td className="border border-gray-600 px-3 py-2 max-w-xs">
                    <ul className="list-disc list-inside text-xs max-h-24 overflow-y-auto">
                      {user.activityLogs?.slice(0, 5).map((log, idx) => (
                        <li key={idx}>{log}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-600 px-3 py-2">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found or failed to load users.</p>
      )}
    </div>
  );
}

export default AdminPanel;
