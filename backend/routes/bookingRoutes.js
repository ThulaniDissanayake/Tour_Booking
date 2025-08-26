import express from 'express';
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  deleteBooking,
  getBookingById,
  updateBooking
} from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// User routes
router.post('/', authMiddleware, createBooking);
router.get('/my', authMiddleware, getUserBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id', authMiddleware, updateBooking);
router.delete('/:id', authMiddleware, deleteBooking);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllBookings);

export default router;
