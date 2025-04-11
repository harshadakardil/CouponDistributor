// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coupon-distributor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Import routes
const authRoutes = require('./routes/auth')
const couponRoutes = require('./routes/coupons')
const adminRoutes = require('./routes/admin')

const app = express()
// Fix: Change from unlimited trust to specific trust level
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  // Add custom key generator for better security
  keyGenerator: (req) => {
    // Use a combination of IP and session if available
    return req.ip + (req.cookies.sessionId || '');
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ MongoDB Connected Successfully`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});
