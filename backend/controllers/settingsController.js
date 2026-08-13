import Settings from '../models/Settings.js';
import { successResponse, AppError } from '../utils/helpers.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        academicYear: '2025-26',
        maxFacultyWorkload: 20,
        maxConsecutiveLectures: 3,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      });
    }
    return successResponse(res, 200, 'System settings retrieved', settings);
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    return successResponse(res, 200, 'Settings updated successfully', settings);
  } catch (err) {
    next(err);
  }
};

export const updateOptimizationWeights = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.optimizationWeights = req.body;
    await settings.save();

    return successResponse(res, 200, 'AI Timetable Optimization weights updated', settings.optimizationWeights);
  } catch (err) {
    next(err);
  }
};

export const updateSubstituteWeights = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.substituteWeights = req.body;
    await settings.save();

    return successResponse(res, 200, 'AI Substitute Matching weights updated', settings.substituteWeights);
  } catch (err) {
    next(err);
  }
};
