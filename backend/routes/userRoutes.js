import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Public route - user registration
router.post('/register', registerUser);

// Public route - user login
router.post('/login', loginUser);

export default router;
