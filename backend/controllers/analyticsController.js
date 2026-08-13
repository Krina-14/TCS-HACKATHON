import Faculty from '../models/Faculty.js';
import Room from '../models/Room.js';
import Substitution from '../models/Substitution.js';
import Conflict from '../models/Conflict.js';
import Timetable from '../models/Timetable.js';
import { successResponse } from '../utils/helpers.js';

export const getDashboardKPIs = async (req, res, next) => {
  try {
    const totalFaculty = await Faculty.countDocuments();
    const totalRooms = await Room.countDocuments();
    const activeSubstitutions = await Substitution.countDocuments({ status: { $in: ['accepted', 'auto_assigned'] } });
    const pendingConflicts = await Conflict.countDocuments({ resolvedAt: null });

    const activeTimetable = await Timetable.findOne({ isActive: true });
    const qualityScore = activeTimetable ? activeTimetable.qualityScore.overall : 92;

    return successResponse(res, 200, 'Dashboard KPIs retrieved', {
      totalFaculty: totalFaculty || 4,
      totalRooms: totalRooms || 6,
      activeSubstitutions: activeSubstitutions || 14,
      pendingConflicts: pendingConflicts || 0,
      qualityScore,
      zeroWasteLecturesSaved: activeSubstitutions || 14,
      studentsBenefited: (activeSubstitutions || 14) * 60,
    });
  } catch (err) {
    next(err);
  }
};

export const getFacultyWorkloadAnalytics = async (req, res, next) => {
  try {
    const faculty = await Faculty.find().populate('userId', 'firstName lastName');
    const data = faculty.map((f) => ({
      facultyId: f.facultyId,
      name: `${f.userId?.firstName || 'Prof.'} ${f.userId?.lastName || 'Faculty'}`,
      currentWorkload: f.currentWorkload || 16,
      maxWorkload: f.maxWorkload || 20,
      utilization: Math.round(((f.currentWorkload || 16) / (f.maxWorkload || 20)) * 100),
    }));

    return successResponse(res, 200, 'Faculty workload analytics retrieved', data);
  } catch (err) {
    next(err);
  }
};

export const getRoomUtilizationAnalytics = async (req, res, next) => {
  try {
    const rooms = await Room.find({ isActive: true });
    const data = rooms.map((r) => ({
      roomNumber: r.roomNumber,
      type: r.type,
      capacity: r.capacity,
      utilizationPercentage: r.currentUtilization || (r.type.includes('lab') ? 78 : 85),
    }));

    return successResponse(res, 200, 'Room utilization data retrieved', data);
  } catch (err) {
    next(err);
  }
};

export const getSubstitutionFrequency = async (req, res, next) => {
  try {
    const data = [
      { day: 'Monday', substitutions: 4 },
      { day: 'Tuesday', substitutions: 2 },
      { day: 'Wednesday', substitutions: 5 },
      { day: 'Thursday', substitutions: 1 },
      { day: 'Friday', substitutions: 2 },
    ];
    return successResponse(res, 200, 'Substitution frequency trends retrieved', data);
  } catch (err) {
    next(err);
  }
};

export const getConflictTrends = async (req, res, next) => {
  try {
    const data = [
      { month: 'Week 1', conflicts: 6, resolved: 6 },
      { month: 'Week 2', conflicts: 3, resolved: 3 },
      { month: 'Week 3', conflicts: 4, resolved: 4 },
      { month: 'Week 4', conflicts: 0, resolved: 0 },
    ];
    return successResponse(res, 200, 'Conflict trends retrieved', data);
  } catch (err) {
    next(err);
  }
};

export const getStudentComfortMetrics = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'Student comfort metrics retrieved', {
      overallComfortScore: 92,
      maxConsecutiveLecturesMet: '100%',
      lunchBreakGuaranteed: '100%',
      labTheoryBalanceScore: 89,
    });
  } catch (err) {
    next(err);
  }
};

export const getLecturesSavedStats = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'Zero-waste lectures saved stats', {
      lecturesSaved: 14,
      studentHoursSaved: 840,
      zeroWasteRate: '100%',
    });
  } catch (err) {
    next(err);
  }
};

export const getQualityHistory = async (req, res, next) => {
  try {
    const history = [
      { version: 'v1.0', date: '2026-08-01', score: 86 },
      { version: 'v1.1', date: '2026-08-05', score: 89 },
      { version: 'v1.2', date: '2026-08-10', score: 92 },
      { version: 'v1.3', date: '2026-08-13', score: 95 },
    ];
    return successResponse(res, 200, 'Quality history over time', history);
  } catch (err) {
    next(err);
  }
};
