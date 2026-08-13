import express from 'express';
import {
  getSettings,
  updateSettings,
  updateOptimizationWeights,
  updateSubstituteWeights,
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getSettings);
router.put('/', authorize('admin'), auditMiddleware('Settings'), updateSettings);
router.put('/optimization-weights', authorize('admin'), auditMiddleware('Settings'), updateOptimizationWeights);
router.put('/substitute-weights', authorize('admin'), auditMiddleware('Settings'), updateSubstituteWeights);

export default router;
