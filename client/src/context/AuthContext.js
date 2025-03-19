// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/check');
        setIsAuthenticated(true);
        setAdmin(response.data.admin);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      setIsAuthenticated(true);
      setAdmin(response.data.admin);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setIsAuthenticated(false);
      setAdmin(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Logout failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      admin, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};