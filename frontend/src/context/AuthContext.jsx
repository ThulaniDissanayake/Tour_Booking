import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api'; // adjust path if your structure differs

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // Keep axios default header in sync with token (page refresh / logout)
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  // Login persists user+token and sets axios default immediately
  const login = (userData, authToken) => {
    if (!authToken) {
      console.error('login() called without a valid token');
      return;
    }
    setUser(userData);
    setToken(authToken);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);

    api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  };

  // Logout clears everything
  const logout = () => {
    setUser(null);
    setToken('');

    localStorage.removeItem('user');
    localStorage.removeItem('token');

    delete api.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);