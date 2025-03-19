
// client/src/pages/CouponManagement.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CouponForm from '../components/CouponForm';
import BulkUploadModal from '../components/BulkUploadModal';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [editCoupon, setEditCoupon] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/coupons');
      setCoupons(response.data.coupons);
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Failed to fetch coupons'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/api/admin/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Failed to update coupon status'
      });
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }
    
    try {
      await api.delete(`/api/admin/coupons/${id}`);
      fetchCoupons();
      setAlert({
        show: true,
        type: 'success',
        message: 'Coupon deleted successfully'
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: error.response?.data?.message || 'Failed to delete coupon'
      });
    }
  };

  return (
    <div className="coupon-management">
      <h1>Coupon Management</h1>
      
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      
      <div className="action-bar">
        <button 
          className="btn btn-secondary"
          onClick={() => setShowBulkUpload(true)}
        >
          Bulk Upload
        </button>
      </div>
      
      <div className="coupon-grid">
        <div className="add-coupon-card">
          <h2>{editCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h2>
          <CouponForm 
            onCouponAdded={() => {
              fetchCoupons();
              setEditCoupon(null);
            }}
            editCoupon={editCoupon}
          />
          {editCoupon && (
            <button 
              className="btn btn-link"
              onClick={() => setEditCoupon(null)}
            >
              Cancel Editing
            </button>
          )}
        </div>
        
        {loading ? (
          <Spinner />
        ) : (
          <div className="coupon-list">
            <h2>Current Coupons</h2>
            {coupons.length === 0 ? (
              <p>No coupons available. Add your first coupon!</p>
            ) : (
              <table className="coupon-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(coupon => (
                    <tr key={coupon._id} className={coupon.claimedBy ? 'claimed' : ''}>
                      <td>{coupon.code}</td>
                      <td>{coupon.description}</td>
                      <td>{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${coupon.isActive ? 'active' : 'inactive'}`}>
                          {coupon.claimedBy ? 'Claimed' : (coupon.isActive ? 'Active' : 'Inactive')}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {!coupon.claimedBy && (
                            <>
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => setEditCoupon(coupon)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleToggleStatus(coupon._id)}
                              >
                                {coupon.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteCoupon(coupon._id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      
      {showBulkUpload && (
        <BulkUploadModal 
          isOpen={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
          onSuccess={() => {
            fetchCoupons();
            setShowBulkUpload(false);
          }}
        />
      )}
    </div>
  );
};

export default CouponManagement;