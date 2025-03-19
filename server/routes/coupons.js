// server/routes/coupons.js
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Public routes
router.post('/claim', couponController.claimCoupon);

module.exports = router;