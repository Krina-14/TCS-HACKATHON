import express from 'express';
import {
  generateTimetable,
  getOptions,
  selectOption,
  getActiveTimetable,
  getTimetableById,
  updateTimetable,
  getWeeklyView,
  simulateFacultyAbsence,
  applySubstituteToSlot,
  getQualityScore,
} from '../controllers/timetableController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/generate', authorize('admin', 'hod'), auditMiddleware('Timetable'), generateTimetable);
router.get('/options', getOptions);
router.post('/select', authorize('admin', 'hod'), auditMiddleware('Timetable'), selectOption);

router.get('/', getActiveTimetable);
router.get('/weekly', getWeeklyView);
router.get('/quality-score', getQualityScore);
router.post('/simulate-absence', simulateFacultyAbsence);
router.post('/apply-substitute', auditMiddleware('Timetable'), applySubstituteToSlot);

router.get('/:id', getTimetableById);
router.put('/:id', authorize('admin', 'hod'), auditMiddleware('Timetable'), updateTimetable);

export default router;
