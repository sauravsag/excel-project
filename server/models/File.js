// File: server/models/File.js
const mongoose = require('mongoose');
const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  path: String,
  chartType: String,
  xAxis: String,
  yAxis: String,
  uploadedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('File', FileSchema);