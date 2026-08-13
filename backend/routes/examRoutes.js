import express from 'express';
import {
  getExams,
  scheduleExam,
  getExamById,
  updateExam,
  autoAssignInvigilators,
} from '../controllers/examController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getExams);
router.get('/:id', getExamById);
router.post('/schedule', authorize('admin', 'hod'), auditMiddleware('Exam'), scheduleExam);
router.put('/:id', authorize('admin', 'hod'), auditMiddleware('Exam'), updateExam);
router.post('/auto-assign-invigilators', authorize('admin', 'hod'), auditMiddleware('Exam'), autoAssignInvigilators);

export default router;
