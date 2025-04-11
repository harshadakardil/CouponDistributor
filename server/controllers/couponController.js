// server/controllers/couponController.js
const Coupon = require('../models/coupon');
const Claim = require('../models/Claim');
const { v4: uuidv4 } = require('uuid');

// Get a coupon for a user (round-robin distribution)
exports.claimCoupon = async (req, res) => {
  try {
    // Generate or get session ID
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: false, // 👈 MUST be false for localhost
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
    }
    
    const ipAddress = req.ip;
    
    // Check if user has claimed a coupon within the cooldown period (1 hour)
    const recentClaim = await Claim.findOne({
      $or: [
        { ipAddress, claimedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } },
        { sessionId, claimedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } }
      ]
    });
    
    if (recentClaim) {
      return res.status(429).json({ 
        message: 'You have already claimed a coupon recently. Please try again later.',
        cooldownRemaining: Math.ceil((recentClaim.claimedAt.getTime() + 60 * 60 * 1000 - Date.now()) / 1000 / 60) // in minutes
      });
    }
    
    // Find an active, unclaimed coupon
    const coupon = await Coupon.findOne({ 
      isActive: true, 
      claimedBy: null,
      expiresAt: { $gt: new Date() }
    });
    
    if (!coupon) {
      return res.status(404).json({ message: 'No coupons available at the moment' });
    }
    
    // Create a claim
    const claim = new Claim({
      couponId: coupon._id,
      ipAddress,
      sessionId
    });
    await claim.save();
    
    // Update coupon with claim
    coupon.claimedBy = claim._id;
    await coupon.save();
    
    res.status(200).json({ 
      message: 'Coupon claimed successfully',
      coupon: {
        code: coupon.code,
        description: coupon.description,
        expiresAt: coupon.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

