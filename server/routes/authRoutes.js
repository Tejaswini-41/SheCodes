import express from 'express';
import { register, login, getUserProfile, getUserStats } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getUserProfile);

// Admin routes
router.get('/stats', protect, admin, getUserStats);

export default router;
