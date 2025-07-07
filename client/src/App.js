// File: src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import ChartViewer from './components/ChartViewer';
import FileHistory from './components/FileHistory';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? element : <Navigate to='/login' />;
};

const AppWrapper = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      window.location.replace('/dashboard');
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path='/upload' element={<ProtectedRoute element={<Upload setChartData={setChartData} />} />} />
        <Route path='/chart' element={<ProtectedRoute element={<ChartViewer {...chartData} />} />} />
        <Route path='/history' element={<ProtectedRoute element={<FileHistory />} />} />
        <Route path='/admin' element={<ProtectedRoute element={<AdminPanel />} />} />
      </Routes>
    </>
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