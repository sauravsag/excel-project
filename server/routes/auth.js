const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashed,
      role,
      registeredAt: new Date(), // ✅ save registration time
      isLoggedIn: true,
      lastLogin: new Date(),
      activityLogs: ['Registered at ' + new Date().toLocaleString()]
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username: email }]
    });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    // Update login details
    user.lastLogin = new Date();
    user.isLoggedIn = true;
    user.activityLogs = [
      ...(user.activityLogs || []),
      'Logged in at ' + new Date().toLocaleString()
    ].slice(-5); // Keep only last 5 logs

    await user.save();

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_jwt_secret', {
      expiresIn: '1h'
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ LOGOUT
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');

    await User.findByIdAndUpdate(decoded.id, {
      isLoggedIn: false,
      $push: {
        activityLogs: {
          $each: ['Logged out at ' + new Date().toLocaleString()],
          $slice: -5
        }
      }
    });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed' });
  }
});

module.exports = router;
