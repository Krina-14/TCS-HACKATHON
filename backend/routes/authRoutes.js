import express from 'express';
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.post('/register', auditMiddleware('User'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
