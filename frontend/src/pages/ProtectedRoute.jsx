import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user } = useAuth();

  if (!user) {
    
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && user.role !== 'admin') {
    
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
