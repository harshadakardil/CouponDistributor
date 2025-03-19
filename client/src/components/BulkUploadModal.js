// client/src/components/BulkUploadModal.js
import React, { useState } from 'react';
import api from '../services/api';
import Alert from './Alert';

const BulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [fileContent, setFileContent] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        setFileContent(content);
      } catch (error) {
        setAlert({
          show: true,
          type: 'danger',
          message: 'Invalid file format. Please upload a JSON file.'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse the JSON content
      let coupons;
      try {
        coupons = JSON.parse(fileContent);
        if (!Array.isArray(coupons)) {
          coupons = [coupons]; // If single object, convert to array
        }
      } catch (error) {
        throw new Error('Invalid JSON format');
      }

      // Validate coupons
      for (const coupon of coupons) {
        if (!coupon.code || !coupon.description || !coupon.expiresAt) {
          throw new Error('Each coupon must have code, description, and expiresAt');
        }
      }

      // Submit to API
      const response = await api.post('/api/admin/coupons/bulk', { coupons });
      
      setAlert({
        show: true,
        type: 'success',
        message: `Bulk upload completed: ${response.data.results.success} added, ${response.data.results.duplicates} duplicates, ${response.data.results.errors} errors`
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: error.message || 'Failed to process file'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Bulk Upload Coupons</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {alert.show && <Alert type={alert.type} message={alert.message} />}
          <p>Upload a JSON file containing coupon data. Each coupon should have:</p>
          <ul>
            <li>code: Unique coupon code</li>
            <li>description: Coupon description</li>
            <li>expiresAt: Expiry date (YYYY-MM-DD format)</li>
          </ul>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="file">Select JSON File</label>
              <input
                type="file"
                id="file"
                accept=".json"
                onChange={handleFileUpload}
                required
              />
            </div>
            <div className="form-group">
              <label>File Preview</label>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={10}
                placeholder="Or paste JSON data here..."
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || !fileContent}>
                {loading ? 'Uploading...' : 'Upload Coupons'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;