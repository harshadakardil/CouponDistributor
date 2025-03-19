// client/src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Coupon Distribution System</p>
      </div>
    </footer>
  );
};

export default Footer;