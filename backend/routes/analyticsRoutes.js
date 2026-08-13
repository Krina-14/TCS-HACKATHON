import express from 'express';
import {
  getDashboardKPIs,
  getFacultyWorkloadAnalytics,
  getRoomUtilizationAnalytics,
  getSubstitutionFrequency,
  getConflictTrends,
  getStudentComfortMetrics,
  getLecturesSavedStats,
  getQualityHistory,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/dashboard', getDashboardKPIs);
router.get('/faculty-workload', getFacultyWorkloadAnalytics);
router.get('/room-utilization', getRoomUtilizationAnalytics);
router.get('/substitution-freq', getSubstitutionFrequency);
router.get('/conflicts', getConflictTrends);
router.get('/student-comfort', getStudentComfortMetrics);
router.get('/lectures-saved', getLecturesSavedStats);
router.get('/quality-history', getQualityHistory);

export default router;
