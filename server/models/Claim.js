// server/models/Claim.js
const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);