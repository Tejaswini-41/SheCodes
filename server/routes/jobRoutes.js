import express from 'express';
import { 
  getJobs, 
  createJob, 
  updateJob, 
  deleteJob, 
  fetchJobsFromAPI,
  seedTestJobs
} from '../controllers/jobController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getJobs);

// Admin routes
router.post('/', protect, admin, createJob);
router.put('/:id', protect, admin, updateJob);
router.delete('/:id', protect, admin, deleteJob);
router.post('/fetch-external', protect, admin, fetchJobsFromAPI);
router.get('/seed-test', protect, admin, seedTestJobs); //test route

export default router;