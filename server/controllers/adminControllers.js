
// server/controllers/adminController.js
const Coupon = require('../models/coupon');
const Claim = require('../models/Claim');

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ coupons });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new coupon
exports.addCoupon = async (req, res) => {
  try {
    const { code, description, expiresAt } = req.body;
    
    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon with this code already exists' });
    }
    
    // Create new coupon
    const coupon = new Coupon({
      code,
      description,
      expiresAt: new Date(expiresAt)
    });
    await coupon.save();
    
    res.status(201).json({ message: 'Coupon added successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a coupon
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, expiresAt, isActive } = req.body;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    // Update coupon fields
    coupon.code = code || coupon.code;
    coupon.description = description || coupon.description;
    coupon.expiresAt = expiresAt ? new Date(expiresAt) : coupon.expiresAt;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
    
    await coupon.save();
    
    res.status(200).json({ message: 'Coupon updated successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    // Only delete if not claimed
    if (coupon.claimedBy) {
      return res.status(400).json({ message: 'Cannot delete a claimed coupon' });
    }
    
    await Coupon.deleteOne({ _id: id });
    
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle coupon availability
exports.toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    
    res.status(200).json({ 
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      coupon
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get claims history
exports.getClaimsHistory = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('couponId', 'code description')
      .sort({ claimedAt: -1 });
    
    res.status(200).json({ claims });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk upload coupons
exports.bulkUploadCoupons = async (req, res) => {
  try {
    const { coupons } = req.body;
    
    if (!Array.isArray(coupons) || coupons.length === 0) {
      return res.status(400).json({ message: 'Invalid coupon data' });
    }
    
    const results = {
      success: 0,
      duplicates: 0,
      errors: 0
    };
    
    for (const couponData of coupons) {
      try {
        const { code, description, expiresAt } = couponData;
        
        // Check if coupon already exists
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
          results.duplicates++;
          continue;
        }
        
        // Create new coupon
        const coupon = new Coupon({
          code,
          description,
          expiresAt: new Date(expiresAt)
        });
        await coupon.save();
        
        results.success++;
      } catch (error) {
        results.errors++;
      }
    }
    
    res.status(201).json({ 
      message: 'Bulk upload completed',
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};