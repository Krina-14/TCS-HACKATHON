import express from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.post('/', authorize('admin', 'hod'), auditMiddleware('Event'), createEvent);
router.put('/:id', authorize('admin', 'hod'), auditMiddleware('Event'), updateEvent);
router.delete('/:id', authorize('admin'), auditMiddleware('Event'), deleteEvent);

export default router;
