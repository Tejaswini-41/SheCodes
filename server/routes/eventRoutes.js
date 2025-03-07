import express from 'express';
import { getEvents, createEvent } from '../controllers/eventController.js';

const router = express.Router();

// Event routes
router.get('/', getEvents);
router.post('/', createEvent);

export default router;