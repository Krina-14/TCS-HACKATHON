import express from 'express';
import {
  getDivisions,
  getDivisionById,
  createDivision,
  updateDivision,
  deleteDivision,
  getDivisionTimetable,
} from '../controllers/divisionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getDivisions);
router.get('/:id', getDivisionById);
router.post('/', authorize('admin', 'hod'), auditMiddleware('Division'), createDivision);
router.put('/:id', authorize('admin', 'hod'), auditMiddleware('Division'), updateDivision);
router.delete('/:id', authorize('admin'), auditMiddleware('Division'), deleteDivision);
router.get('/:id/timetable', getDivisionTimetable);

export default router;
