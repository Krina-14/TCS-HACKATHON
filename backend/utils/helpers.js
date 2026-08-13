export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const PERIOD_SLOTS = [
  { period: 1, timeStart: '09:00', timeEnd: '10:00' },
  { period: 2, timeStart: '10:00', timeEnd: '11:00' },
  { period: 3, timeStart: '11:00', timeEnd: '12:00' },
  { period: 4, timeStart: '12:00', timeEnd: '13:00' },
  { period: 5, timeStart: '13:00', timeEnd: '14:00', isLunch: true },
  { period: 6, timeStart: '14:00', timeEnd: '15:00' },
  { period: 7, timeStart: '15:00', timeEnd: '16:00' },
  { period: 8, timeStart: '16:00', timeEnd: '17:00' },
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const successResponse = (res, statusCode = 200, message = 'Success', data = {}, meta = undefined) => {
  const payload = {
    success: true,
    message,
    data,
  };
  if (meta !== undefined) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};
