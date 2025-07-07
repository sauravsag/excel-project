const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  registeredAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isLoggedIn: { type: Boolean, default: false },
  activityLogs: [{ type: String }] // e.g., "Uploaded file", "Downloaded chart"
});

module.exports = mongoose.model('User', UserSchema);
