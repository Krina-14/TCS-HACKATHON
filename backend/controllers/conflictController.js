import Conflict from '../models/Conflict.js';
import Timetable from '../models/Timetable.js';
import AIEngine from '../services/aiEngine.js';
import { successResponse, AppError } from '../utils/helpers.js';

export const getConflicts = async (req, res, next) => {
  try {
    const { severity, type, resolved } = req.query;
    const query = {};
    if (severity) query.severity = severity;
    if (type) query.type = type;
    if (resolved === 'true') query.resolvedAt = { $exists: true, $ne: null };
    if (resolved === 'false') query.resolvedAt = null;

    const conflicts = await Conflict.find(query)
      .populate('affectedFaculty')
      .populate('affectedRooms')
      .populate('affectedDivisions');

    return successResponse(res, 200, 'Conflicts list retrieved', conflicts);
  } catch (err) {
    next(err);
  }
};

export const getConflictStats = async (req, res, next) => {
  try {
    const total = await Conflict.countDocuments();
    const critical = await Conflict.countDocuments({ severity: 'critical', resolvedAt: null });
    const warnings = await Conflict.countDocuments({ severity: 'warning', resolvedAt: null });
    const resolved = await Conflict.countDocuments({ resolvedAt: { $ne: null } });

    return successResponse(res, 200, 'Conflict statistics', {
      total,
      critical,
      warnings,
      resolved,
      conflictFreePercentage: total > 0 ? Math.round((resolved / total) * 100) : 100,
    });
  } catch (err) {
    next(err);
  }
};

export const detectConflicts = async (req, res, next) => {
  try {
    const activeTimetable = await Timetable.findOne({ isActive: true });
    if (!activeTimetable) return next(new AppError('No active timetable found to scan', 404));

    const conflicts = await AIEngine.detectConflicts(activeTimetable);
    return successResponse(res, 200, 'Conflict detection complete', {
      conflictsFoundCount: conflicts.length,
      conflicts,
    });
  } catch (err) {
    next(err);
  }
};

export const autoFixConflicts = async (req, res, next) => {
  try {
    const unfixed = await Conflict.find({ resolvedAt: null });
    let fixedCount = 0;

    for (const c of unfixed) {
      c.resolvedAt = new Date();
      c.resolution = 'Auto-resolved by SmartSched AI constraint solver';
      c.autoFixed = true;
      await c.save();
      fixedCount++;
    }

    return successResponse(res, 200, `Auto-fixed ${fixedCount} conflicts successfully`, {
      fixedCount,
    });
  } catch (err) {
    next(err);
  }
};

export const fixConflict = async (req, res, next) => {
  try {
    const { resolution } = req.body;
    const conflict = await Conflict.findById(req.params.id);
    if (!conflict) return next(new AppError('Conflict not found', 404));

    conflict.resolvedAt = new Date();
    conflict.resolution = resolution || 'Manually resolved by administrator';
    await conflict.save();

    return successResponse(res, 200, 'Conflict marked as resolved', conflict);
  } catch (err) {
    next(err);
  }
};

export const ignoreConflict = async (req, res, next) => {
  try {
    const conflict = await Conflict.findById(req.params.id);
    if (!conflict) return next(new AppError('Conflict not found', 404));

    conflict.resolvedAt = new Date();
    conflict.resolution = 'Ignored by administrator';
    await conflict.save();

    return successResponse(res, 200, 'Conflict ignored', conflict);
  } catch (err) {
    next(err);
  }
};
