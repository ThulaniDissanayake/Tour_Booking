import express from 'express';
import { getAllTours, getTourById, createTour, deleteTour, updateTour } from '../controllers/tourController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.post('/', authMiddleware, adminMiddleware, createTour);
router.put('/:id', authMiddleware, adminMiddleware, updateTour);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTour);

export default router;
