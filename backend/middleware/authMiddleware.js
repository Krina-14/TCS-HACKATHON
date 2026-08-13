import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/helpers.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route. Token missing.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartsched_secret_key');
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return next(new AppError('The user belonging to this token no longer exists or is inactive.', 401));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Not authorized to access this route. Invalid token.', 401));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`User role '${req.user?.role}' is not authorized to perform this action.`, 403));
    }
    next();
  };
};
