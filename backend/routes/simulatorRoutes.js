import express from 'express';
import {
  runSimulation,
  getScenarios,
  getScenarioById,
  applyScenarioToLive,
  deleteScenario,
} from '../controllers/simulatorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/run', runSimulation);
router.get('/scenarios', getScenarios);
router.get('/:id', getScenarioById);
router.post('/:id/apply', authorize('admin', 'hod'), auditMiddleware('Simulator'), applyScenarioToLive);
router.delete('/:id', authorize('admin', 'hod'), deleteScenario);

export default router;
