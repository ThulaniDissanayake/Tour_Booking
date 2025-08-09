import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Props:
// isAdmin (boolean): if true, restrict to admin users only
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && user.role !== 'admin') {
    // Logged in but not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
