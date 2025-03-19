// client/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    claimedCoupons: 0,
    totalClaims: 0,
    todayClaims: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get coupons
        const couponsRes = await api.get('/api/admin/coupons');
        const coupons = couponsRes.data.coupons;
        
        // Get claims
        const claimsRes = await api.get('/api/admin/claims');
        const claims = claimsRes.data.claims;
        
        // Calculate stats
        const activeCoupons = coupons.filter(coupon => coupon.isActive && !coupon.claimedBy).length;
        const claimedCoupons = coupons.filter(coupon => coupon.claimedBy).length;
        
        // Calculate today's claims
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayClaims = claims.filter(claim => 
          new Date(claim.claimedAt) >= today
        ).length;
        
        setStats({
          totalCoupons: coupons.length,
          activeCoupons,
          claimedCoupons,
          totalClaims: claims.length,
          todayClaims
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Coupons</h3>
          <div className="stat-value">{stats.totalCoupons}</div>
        </div>
        <div className="stat-card">
          <h3>Active Coupons</h3>
          <div className="stat-value">{stats.activeCoupons}</div>
        </div>
        <div className="stat-card">
          <h3>Claimed Coupons</h3>
          <div className="stat-value">{stats.claimedCoupons}</div>
        </div>
        <div className="stat-card">
          <h3>Total Claims</h3>
          <div className="stat-value">{stats.totalClaims}</div>
        </div>
        <div className="stat-card">
          <h3>Today's Claims</h3>
          <div className="stat-value">{stats.todayClaims}</div>
        </div>
      </div>
      
      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <a href="/admin/coupons" className="btn btn-primary">Manage Coupons</a>
          <a href="/admin/claims" className="btn btn-secondary">View Claim History</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;