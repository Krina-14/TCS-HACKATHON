import express from 'express';
import {
  findSubstitutes,
  assignSubstitute,
  acceptSubstitution,
  rejectSubstitution,
  getActiveSubstitutions,
  getZeroWasteStats,
  getSubstitutionImpact,
} from '../controllers/substitutionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/find', findSubstitutes);
router.post('/assign', authorize('admin', 'hod', 'faculty'), auditMiddleware('Substitution'), assignSubstitute);
router.put('/:id/accept', auditMiddleware('Substitution'), acceptSubstitution);
router.put('/:id/reject', auditMiddleware('Substitution'), rejectSubstitution);

router.get('/active', getActiveSubstitutions);
router.get('/zero-waste-stats', getZeroWasteStats);
router.get('/:id/impact', getSubstitutionImpact);

export default router;
