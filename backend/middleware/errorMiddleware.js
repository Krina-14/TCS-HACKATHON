import { ZodError } from 'zod';
import { AppError } from '../utils/helpers.js';

export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Zod Schema Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database Validation Error';
    errors = Object.values(err.errors).map((el) => el.message);
  }

  // Mongoose CastError (Invalid ID)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format for field: ${err.path}`;
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}: ${err.keyValue ? err.keyValue[field] : ''}. Already exists.`;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('💥 Error Stack:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
