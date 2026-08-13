import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomUtilization,
  getRoomSchedule,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', authorize('admin', 'hod'), auditMiddleware('Room'), createRoom);
router.put('/:id', authorize('admin', 'hod'), auditMiddleware('Room'), updateRoom);
router.delete('/:id', authorize('admin'), auditMiddleware('Room'), deleteRoom);
router.get('/:id/utilization', getRoomUtilization);
router.get('/:id/schedule', getRoomSchedule);

export default router;
