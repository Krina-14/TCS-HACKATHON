import User from '../models/User.js';
import { successResponse, AppError } from '../utils/helpers.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, department, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (role) query.role = role;
    if (department) query.department = department;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const users = await User.find(query).select('-password').skip(skip).limit(parseInt(limit, 10));
    const total = await User.countDocuments(query);

    return successResponse(res, 200, 'Users retrieved successfully', users, { page: parseInt(page, 10), limit: parseInt(limit, 10), total });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('division');
    if (!user) return next(new AppError('User not found', 404));
    return successResponse(res, 200, 'User retrieved', user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    return successResponse(res, 200, 'User updated successfully', user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return next(new AppError('User not found', 404));
    return successResponse(res, 200, 'User soft-deleted successfully');
  } catch (err) {
    next(err);
  }
};
