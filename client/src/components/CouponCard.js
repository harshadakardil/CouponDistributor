
// client/src/components/CouponCard.js
import React from 'react';

const CouponCard = ({ coupon }) => {
  return (
    <div className="coupon-card">
      <h3 className="coupon-code">{coupon.code}</h3>
      <p className="coupon-description">{coupon.description}</p>
      <p className="coupon-expiry">
        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default CouponCard;