import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  
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