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

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, adminMiddleware, getAllBookings);
router.get('/my', authMiddleware, getUserBookings);
router.delete('/:id', authMiddleware, deleteBooking);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id', authMiddleware, updateBooking);


export default router;
