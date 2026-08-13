import express from 'express';
import {
  getConflicts,
  getConflictStats,
  detectConflicts,
  autoFixConflicts,
  fixConflict,
  ignoreConflict,
} from '../controllers/conflictController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getConflicts);
router.get('/stats', getConflictStats);
router.post('/detect', detectConflicts);
router.post('/auto-fix', authorize('admin', 'hod'), auditMiddleware('Conflict'), autoFixConflicts);
router.put('/:id/fix', authorize('admin', 'hod'), auditMiddleware('Conflict'), fixConflict);
router.put('/:id/ignore', authorize('admin', 'hod'), auditMiddleware('Conflict'), ignoreConflict);

export default router;
