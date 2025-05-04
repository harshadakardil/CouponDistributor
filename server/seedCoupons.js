require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/coupon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coupon-distributor';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    
    try {
      // Clear existing coupons
      await Coupon.deleteMany({});
      console.log('Cleared existing coupons');
      
      // Insert sample coupons
      const coupons = [
        {
          code: 'WELCOME100',
          description: 'Get ₹100 off',
          isActive: true,
          claimedBy: null,
          expiresAt: new Date('2025-12-31')
        },
        {
          code: 'SUMMER2025',
          description: 'Get 20% off on summer collection',
          isActive: true,
          claimedBy: null,
          expiresAt: new Date('2025-08-31')
        },
        {
          code: 'FREESHIP',
          description: 'Free shipping on orders above ₹500',
          isActive: true,
          claimedBy: null,
          expiresAt: new Date('2025-10-31')
        }
      ];
      
      await Coupon.insertMany(coupons);
      console.log(`Successfully inserted ${coupons.length} sample coupons`);
      
      process.exit(0);
    } catch (error) {
      console.error('Error seeding coupons:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });