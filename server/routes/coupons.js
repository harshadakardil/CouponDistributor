// server/routes/coupons.js
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Public routes
router.post('/claim', couponController.claimCoupon);

// Test endpoint to create a coupon
router.post('/create-test', async (req, res) => {
    try {
        const Coupon = require('../models/coupon');
        const testCoupon = new Coupon({
            code: 'WELCOME' + Math.floor(Math.random() * 1000),
            description: 'Get discount off',
            isActive: true,
            claimedBy: null,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // expires in 1 year
        });
        await testCoupon.save();
        res.json({ message: 'Test coupon created', coupon: testCoupon });
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ message: 'Error creating test coupon', error: error.message });
    }
});

router.get('/', (req, res) => {
    res.json({ message: 'Coupons route is working 🎉' });
});
  
module.exports = router;