// client/src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Coupon Distributor</Link>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="navbar-item">Dashboard</Link>
              <Link to="/admin/coupons" className="navbar-item">Coupons</Link>
              <Link to="/admin/claims" className="navbar-item">Claims</Link>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;