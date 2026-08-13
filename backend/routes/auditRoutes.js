import express from 'express';
import { getAuditLogs, getComplianceReport, verifyAuditHashChain } from '../controllers/auditController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', authorize('admin', 'hod'), getAuditLogs);
router.get('/compliance-report', authorize('admin', 'hod'), getComplianceReport);
router.get('/verify/:id', authorize('admin', 'hod'), verifyAuditHashChain);

export default router;
