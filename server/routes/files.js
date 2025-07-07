// File: server/routes/files.js
const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const File = require('../models/File');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { originalname, filename, path: filepath } = req.file;
    const workbook = xlsx.readFile(filepath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const file = new File({
      userId: req.user.userId,
      name: originalname,
      path: filename
    });
    await file.save();
    res.json({ message: 'File uploaded', data: jsonData });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.userId });
    res.json(files);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;