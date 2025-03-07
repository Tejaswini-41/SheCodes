import express from 'express';
import { getMentors, getAllMentors, createMentor, approveMentor, deleteMentor } from '../controllers/mentorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes - available to all users
router.get('/', getMentors); // Get approved mentors
router.post('/', createMentor); // Submit mentor application

// Admin routes - require authentication
router.get('/all', protect, getAllMentors); // Get all mentors (admin only)
router.patch('/:id/approve', protect, approveMentor); // Approve mentor request
router.delete('/:id', protect, deleteMentor); // Reject mentor request

export default router;