// client/src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to Excel Analytics Platform</h1>
      <p>Get insights from your Excel files effortlessly!</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button style={{ marginLeft: '10px' }}>Register</button></Link>
      </div>
    </div>
  );
};

export default Home;
