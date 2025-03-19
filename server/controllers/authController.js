// server/controllers/authController.js
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Register new admin (this would be disabled in production)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    // Create new admin
    const admin = new Admin({ username, email, password });
    await admin.save();
    
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login admin
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create and sign JWT
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    // Send token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    res.status(200).json({
      message: 'Login successful',
      admin: { id: admin._id, username: admin.username, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout admin
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

// Check if admin is authenticated
exports.checkAuth = (req, res) => {
  res.status(200).json({ 
    isAuthenticated: true, 
    admin: { id: req.admin.id, username: req.admin.username } 
  });
};