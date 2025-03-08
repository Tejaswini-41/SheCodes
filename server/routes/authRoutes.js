import express from 'express';
import { 
  login, 
  register, 
  getUserProfile as getProfile,  // Use the actual function name but alias it as getProfile 
  updateProfile, 
  getStats 
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/stats', protect, getStats);

export default router;
