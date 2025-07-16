import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";
import ChartViewer from "./components/ChartViewer";
import FileHistory from "./components/FileHistory";
import AdminPanel from "./components/AdminPanel";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AppWrapper = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");
  const [chartData, setChartData] = useState(null);

  // DARK MODE STATE (init from localStorage or default false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Redirect authenticated user from "/" to "/dashboard"
  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      window.location.replace("/dashboard");
    }
  }, [isAuthenticated, location.pathname]);

  // Add or remove 'dark' class on <html> element based on darkMode
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div
      className="min-h-screen transition-colors duration-300
        bg-white text-gray-900
        dark:bg-gray-900 dark:text-gray-200"
    >
      {isAuthenticated && (
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute element={<Upload setChartData={setChartData} />} />
          }
        />
        <Route
          path="/chart"
          element={<ProtectedRoute element={<ChartViewer {...chartData} />} />}
        />
        <Route
          path="/history"
          element={<ProtectedRoute element={<FileHistory />} />}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminPanel />} />}
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
