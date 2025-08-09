import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TourList from './pages/TourList';
import TourDetails from './pages/TourDetails';
import BookTour from './pages/BookTour';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

import AdminToursManage from './pages/AdminToursManage';
import AdminBookings from './pages/AdminBookings';
import BookingEdit from './pages/BookingEdit';

import NotFound from './pages/NotFound';

import ProtectedRoute from './pages/ProtectedRoute';

import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';

import './index.css';

const AppContent = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tours" element={<TourList />} />
        <Route path="/tours/:id" element={<TourDetails />} />
        <Route path="/book/:id" element={<BookTour />} />

        {/* Protected User Routes */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute isAdmin={false}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAdmin={false}>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* User booking edit route */}
        <Route
          path="/bookings/:id/edit"
          element={
            <ProtectedRoute isAdmin={false}>
              <BookingEdit />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (Protected and Admin-only) */}
        <Route
          path="/admin/tours"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminToursManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        {/* Admin booking edit route */}
        <Route
          path="/admin/bookings/edit/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <BookingEdit />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <DarkModeProvider>
    <AppContent />
  </DarkModeProvider>
);

export default App;
