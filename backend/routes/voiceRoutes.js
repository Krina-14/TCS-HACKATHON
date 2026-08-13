import express from 'express';
import { processVoiceQuery, getSuggestedQueries } from '../controllers/voiceQueryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/query', processVoiceQuery);
router.get('/suggestions', getSuggestedQueries);

export default router;
