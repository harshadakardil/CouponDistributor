
// server/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All admin routes are protected
router.use(authMiddleware);

// Coupon management
router.get('/coupons', adminController.getAllCoupons);
router.post('/coupons', adminController.addCoupon);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);
router.patch('/coupons/:id/toggle', adminController.toggleCouponStatus);
router.post('/coupons/bulk', adminController.bulkUploadCoupons);

// Claims history
router.get('/claims', adminController.getClaimsHistory);

module.exports = router;