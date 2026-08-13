import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', authorize('admin', 'hod'), getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorize('admin'), auditMiddleware('User'), updateUser);
router.delete('/:id', authorize('admin'), auditMiddleware('User'), deleteUser);

export default router;
