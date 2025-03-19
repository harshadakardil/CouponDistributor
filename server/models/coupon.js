// server/models/Coupon.js
const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);