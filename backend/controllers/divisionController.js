import Division from '../models/Division.js';
import Timetable from '../models/Timetable.js';
import { successResponse, AppError } from '../utils/helpers.js';
import { divisionSchema } from '../utils/validators.js';

export const getDivisions = async (req, res, next) => {
  try {
    const { department, semester } = req.query;
    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester, 10);

    const divisions = await Division.find(query)
      .populate('subjects')
      .populate({ path: 'classAdvisor', populate: { path: 'userId' } })
      .populate('roomPreference');

    return successResponse(res, 200, 'Divisions retrieved', divisions);
  } catch (err) {
    next(err);
  }
};

export const getDivisionById = async (req, res, next) => {
  try {
    const division = await Division.findById(req.params.id)
      .populate('subjects')
      .populate('classAdvisor')
      .populate('roomPreference');

    if (!division) return next(new AppError('Division not found', 404));
    return successResponse(res, 200, 'Division retrieved', division);
  } catch (err) {
    next(err);
  }
};

export const createDivision = async (req, res, next) => {
  try {
    const validated = divisionSchema.parse(req.body);
    const division = await Division.create(validated);
    return successResponse(res, 201, 'Division created successfully', division);
  } catch (err) {
    next(err);
  }
};

export const updateDivision = async (req, res, next) => {
  try {
    const division = await Division.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!division) return next(new AppError('Division not found', 404));
    return successResponse(res, 200, 'Division updated successfully', division);
  } catch (err) {
    next(err);
  }
};

export const deleteDivision = async (req, res, next) => {
  try {
    const division = await Division.findByIdAndDelete(req.params.id);
    if (!division) return next(new AppError('Division not found', 404));
    return successResponse(res, 200, 'Division deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const getDivisionTimetable = async (req, res, next) => {
  try {
    const activeTimetable = await Timetable.findOne({ isActive: true })
      .populate('slots.subjectId')
      .populate('slots.facultyId')
      .populate('slots.roomId');

    const slots = activeTimetable
      ? activeTimetable.slots.filter((s) => s.divisionId?.toString() === req.params.id)
      : [];

    return successResponse(res, 200, 'Division timetable retrieved', { slots });
  } catch (err) {
    next(err);
  }
};
