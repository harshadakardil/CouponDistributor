// client/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CouponManagement from './pages/CouponManagement';
import ClaimHistory from './pages/ClaimHistory';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/coupons" element={
            <PrivateRoute>
              <CouponManagement />
            </PrivateRoute>
          } />
          <Route path="/admin/claims" element={
            <PrivateRoute>
              <ClaimHistory />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;