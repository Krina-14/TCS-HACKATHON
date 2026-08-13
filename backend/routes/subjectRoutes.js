import express from 'express';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getEligibleFaculty,
} from '../controllers/subjectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getSubjects);
router.get('/:id', getSubjectById);
router.post('/', authorize('admin', 'hod'), auditMiddleware('Subject'), createSubject);
router.put('/:id', authorize('admin', 'hod'), auditMiddleware('Subject'), updateSubject);
router.delete('/:id', authorize('admin', 'hod'), auditMiddleware('Subject'), deleteSubject);
router.get('/:id/faculty', getEligibleFaculty);

export default router;
