// client/src/pages/Home.js
import React, { useState } from 'react';
import api from '../services/api';
import CouponCard from '../components/CouponCard';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [coupon, setCoupon] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const claimCoupon = async () => {
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });
    
    try {
      const response = await api.post('/api/coupons/claim');
      setCoupon(response.data.coupon);
      setAlert({ 
        show: true, 
        type: 'success', 
        message: 'Coupon claimed successfully!' 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to claim coupon';
      setAlert({ show: true, type: 'danger', message: errorMessage });
      
      // If cooldown error, show countdown
      if (error.response?.data?.cooldownRemaining) {
        setCountdown(error.response.data.cooldownRemaining);
        
        // Start countdown timer
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return null;
            }
            return prev - 1;
          });
        }, 60000); // Update every minute
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Get Your Free Coupon</h1>
        <p>Click the button below to claim a special offer!</p>
        
        {alert.show && <Alert type={alert.type} message={alert.message} />}
        
        {loading ? (
          <Spinner />
        ) : coupon ? (
          <div className="claimed-coupon">
            <CouponCard coupon={coupon} />
            <p className="success-message">
              Congratulations! Make sure to save your coupon code.
            </p>
          </div>
        ) : (
          <button 
            className="btn btn-lg btn-primary" 
            onClick={claimCoupon}
            disabled={countdown !== null}
          >
            {countdown !== null 
              ? `Try again in ${countdown} minutes` 
              : 'Get My Coupon'}
          </button>
        )}
      </div>
      
      <div className="info-section">
        <h2>How It Works</h2>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">1</div>
            <h3>Claim a Coupon</h3>
            <p>Click the button to get your special offer</p>
          </div>
          <div className="info-card">
            <div className="info-icon">2</div>
            <h3>Save Your Code</h3>
            <p>Make note of your unique coupon code</p>
          </div>
          <div className="info-card">
            <div className="info-icon">3</div>
            <h3>Enjoy the Savings</h3>
            <p>Use your coupon for awesome discounts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;