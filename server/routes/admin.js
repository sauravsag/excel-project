// File: server/routes/admin.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const File = require('../models/File');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied: No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(403).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
};

// GET all users (Admin only)
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE a user (Admin only)
router.delete('/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET admin stats (Admin only)
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const fileCount = await File.countDocuments();
    const chartTypes = await File.aggregate([
      { $group: { _id: '$chartType', count: { $sum: 1 } } }
    ]);
    res.json({ userCount, fileCount, chartTypes });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;