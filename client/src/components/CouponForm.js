// client/src/components/CouponForm.js
import React, { useState } from 'react';
import api from '../services/api';
import Alert from './Alert';

const CouponForm = ({ onCouponAdded, editCoupon = null }) => {
  const [formData, setFormData] = useState({
    code: editCoupon?.code || '',
    description: editCoupon?.description || '',
    expiresAt: editCoupon?.expiresAt ? new Date(editCoupon.expiresAt).toISOString().split('T')[0] : ''
  });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { code, description, expiresAt } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editCoupon) {
        await api.put(`/api/admin/coupons/${editCoupon._id}`, formData);
        setAlert({ show: true, type: 'success', message: 'Coupon updated successfully' });
      } else {
        await api.post('/api/admin/coupons', formData);
        setFormData({ code: '', description: '', expiresAt: '' });
        setAlert({ show: true, type: 'success', message: 'Coupon added successfully' });
      }
      
      if (onCouponAdded) onCouponAdded();
    } catch (error) {
      setAlert({ 
        show: true, 
        type: 'danger', 
        message: error.response?.data?.message || 'Failed to save coupon' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-form">
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Coupon Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiresAt">Expiry Date</label>
          <input
            type="date"
            id="expiresAt"
            name="expiresAt"
            value={expiresAt}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (editCoupon ? 'Update Coupon' : 'Add Coupon')}
        </button>
      </form>
    </div>
  );
};

export default CouponForm;