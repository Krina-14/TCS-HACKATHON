import express from 'express';
import {
  importData,
  getImportTemplate,
  exportData,
  getExportFormats,
} from '../controllers/importExportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/import/:type', authorize('admin', 'hod'), upload.single('file'), auditMiddleware('Import'), importData);
router.get('/template/:type', getImportTemplate);
router.post('/export/:type', exportData);
router.get('/export/formats', getExportFormats);

export default router;
