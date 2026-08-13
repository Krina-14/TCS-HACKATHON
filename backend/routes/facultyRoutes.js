import express from 'express';
import {
  getFacultyList,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyWorkload,
  getFacultyTimetable,
  getExpertiseMap,
  getFacultyAvailability,
  updateFacultyAvailability,
  handleSubstituteRequest,
} from '../controllers/facultyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getFacultyList);
router.get('/:id', getFacultyById);
router.post('/', authorize('admin', 'hod'), auditMiddleware('Faculty'), createFaculty);
router.put('/:id', authorize('admin', 'hod', 'faculty'), auditMiddleware('Faculty'), updateFaculty);
router.delete('/:id', authorize('admin'), auditMiddleware('Faculty'), deleteFaculty);

router.get('/:id/workload', getFacultyWorkload);
router.get('/:id/timetable', getFacultyTimetable);
router.get('/:id/expertise-map', getExpertiseMap);
router.get('/:id/availability', getFacultyAvailability);
router.put('/:id/availability', auditMiddleware('Availability'), updateFacultyAvailability);
router.post('/:id/substitute-request', auditMiddleware('Substitution'), handleSubstituteRequest);

export default router;
