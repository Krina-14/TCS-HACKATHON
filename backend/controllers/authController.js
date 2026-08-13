import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';
import { successResponse, errorResponse, AppError } from '../utils/helpers.js';
import { registerSchema, loginSchema } from '../utils/validators.js';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'smartsched_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      return next(new AppError('Email is already registered.', 400));
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10));
    const hashedPassword = await bcrypt.hash(validated.password, salt);

    const user = await User.create({
      email: validated.email,
      password: hashedPassword,
      role: validated.role,
      firstName: validated.firstName,
      lastName: validated.lastName,
      department: validated.department || 'IT',
      division: validated.division || null,
    });

    if (validated.role === 'faculty') {
      await Faculty.create({
        userId: user._id,
        facultyId: `FAC-${Date.now().toString().slice(-4)}`,
        department: validated.department || 'IT',
        designation: 'Assistant Professor',
      });
    }

    const token = generateToken(user._id, user.role);

    return successResponse(res, 201, 'User registered successfully', {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const user = await User.findOne({ email: validated.email });

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (validated.role && user.role !== validated.role) {
      return next(new AppError(`Role mismatch. Your account role is '${user.role}'`, 403));
    }

    const isMatch = await bcrypt.compare(validated.password, user.password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    return successResponse(res, 200, 'Login successful', {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    let facultyProfile = null;
    if (req.user.role === 'faculty') {
      facultyProfile = await Faculty.findOne({ userId: req.user._id }).populate('subjects.subjectId');
    }

    return successResponse(res, 200, 'User profile fetched', {
      user: req.user,
      facultyProfile,
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User with given email does not exist.', 404));
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log(`🔑 [DEMO] Password Reset Token for ${email}: ${resetToken}`);

    return successResponse(res, 200, 'Password reset token generated (Logged in demo mode)', {
      resetToken,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Invalid or expired reset token.', 400));
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return successResponse(res, 200, 'Password reset successful. You can now login.');
  } catch (err) {
    next(err);
  }
};
