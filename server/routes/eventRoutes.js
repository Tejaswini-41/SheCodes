import express from 'express';
import { getEvents, createEvent, deleteEvent, updateEvent } from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Event routes
router.get('/', getEvents);
router.post('/', createEvent);
router.delete('/:id', protect, admin, deleteEvent);
router.put('/:id', protect, admin, updateEvent);

export default router;