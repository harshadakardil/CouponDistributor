const mongoose = require('mongoose');
const Coupon = require('./models/coupon'); // make sure the path is correct

mongoose.connect('mongodb://localhost:27017/coupon-distributor')
  .then(async () => {
    await Coupon.create({
      code: 'WELCOME100',
      description: 'Get ₹100 off',
      isActive: true,
      claimedBy: null,
      expiresAt: new Date('2025-12-31')
    });
    console.log('Test coupon inserted');
    process.exit();
  })
  .catch(err => console.error('Error inserting test coupon:', err));
