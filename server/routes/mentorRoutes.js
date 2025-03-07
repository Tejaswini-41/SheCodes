import express from 'express';
import { getMentors, createMentor } from '../controllers/mentorController.js';

const router = express.Router();

// Mentor routes
router.get('/', getMentors);
router.post('/', createMentor);

export default router;