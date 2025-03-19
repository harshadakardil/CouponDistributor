// client/src/pages/ClaimHistory.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const ClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/claims');
      setClaims(response.data.claims);
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Failed to fetch claim history'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="claim-history">
      <h1>Claim History</h1>
      
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      
      {loading ? (
        <Spinner />
      ) : (
        <div className="claims-container">
          {claims.length === 0 ? (
            <p>No coupon claims yet.</p>
          ) : (
            <table className="claims-table">
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>IP Address</th>
                  <th>Session ID</th>
                  <th>Claimed At</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(claim => (
                  <tr key={claim._id}>
                    <td>{claim.couponId?.code || 'Unknown'}</td>
                    <td>{claim.ipAddress}</td>
                    <td>{claim.sessionId.substring(0, 8) + '...'}</td>
                    <td>{new Date(claim.claimedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimHistory;