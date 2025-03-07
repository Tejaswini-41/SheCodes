import express from 'express';
import { 
  getMentors, 
  createMentor, 
  getPendingMentorRequests, 
  approveMentor, 
  deleteMentor,
  seedTestMentors 
} from '../controllers/mentorController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getMentors);
router.post('/', createMentor);

// Admin routes
router.get('/pending', protect, getPendingMentorRequests);
router.patch('/:id/approve', protect, approveMentor);
router.delete('/:id', protect, deleteMentor);

// Test data route - add test mentor requests for debugging
router.get('/seed-test', seedTestMentors);

export default router;