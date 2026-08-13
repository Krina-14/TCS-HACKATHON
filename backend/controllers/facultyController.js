import Faculty from '../models/Faculty.js';
import User from '../models/User.js';
import Timetable from '../models/Timetable.js';
import Availability from '../models/Availability.js';
import Substitution from '../models/Substitution.js';
import { successResponse, AppError } from '../utils/helpers.js';
import { facultySchema } from '../utils/validators.js';

export const getFacultyList = async (req, res, next) => {
  try {
    const { department, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (department) query.department = department;

    let facultyList = await Faculty.find(query)
      .populate('userId', 'firstName lastName email role avatar department')
      .populate('subjects.subjectId', 'name code type')
      .populate('assignedDivisions', 'name semester department');

    if (search) {
      facultyList = facultyList.filter(
        (f) =>
          f.userId?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          f.userId?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          f.facultyId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return successResponse(res, 200, 'Faculty list retrieved', facultyList);
  } catch (err) {
    next(err);
  }
};

export const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('userId', 'firstName lastName email role avatar department')
      .populate('subjects.subjectId')
      .populate('assignedDivisions');

    if (!faculty) return next(new AppError('Faculty profile not found', 404));
    return successResponse(res, 200, 'Faculty profile retrieved', faculty);
  } catch (err) {
    next(err);
  }
};

export const createFaculty = async (req, res, next) => {
  try {
    const validated = facultySchema.parse(req.body);
    const faculty = await Faculty.create(validated);
    return successResponse(res, 201, 'Faculty created successfully', faculty);
  } catch (err) {
    next(err);
  }
};

export const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faculty) return next(new AppError('Faculty not found', 404));
    return successResponse(res, 200, 'Faculty updated successfully', faculty);
  } catch (err) {
    next(err);
  }
};

export const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return next(new AppError('Faculty not found', 404));
    await User.findByIdAndUpdate(faculty.userId, { isActive: false });
    return successResponse(res, 200, 'Faculty soft deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const getFacultyWorkload = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return next(new AppError('Faculty not found', 404));

    const activeTimetable = await Timetable.findOne({ isActive: true });
    let slotsAssigned = [];
    if (activeTimetable) {
      slotsAssigned = activeTimetable.slots.filter((s) => s.facultyId?.toString() === faculty._id.toString());
    }

    return successResponse(res, 200, 'Workload retrieved', {
      facultyId: faculty._id,
      currentWorkload: slotsAssigned.length || faculty.currentWorkload,
      maxWorkload: faculty.maxWorkload,
      utilizationPercentage: Math.round(((slotsAssigned.length || faculty.currentWorkload) / faculty.maxWorkload) * 100),
      assignedLectures: slotsAssigned,
    });
  } catch (err) {
    next(err);
  }
};

export const getFacultyTimetable = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return next(new AppError('Faculty not found', 404));

    const activeTimetable = await Timetable.findOne({ isActive: true })
      .populate('slots.subjectId')
      .populate('slots.divisionId')
      .populate('slots.roomId');

    const slots = activeTimetable
      ? activeTimetable.slots.filter((s) => s.facultyId?.toString() === faculty._id.toString())
      : [];

    return successResponse(res, 200, 'Faculty personal timetable retrieved', {
      faculty,
      slots,
    });
  } catch (err) {
    next(err);
  }
};

export const getExpertiseMap = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id).populate('subjects.subjectId');
    if (!faculty) return next(new AppError('Faculty not found', 404));

    const nodes = [{ id: faculty._id.toString(), label: faculty.facultyId, group: 'faculty' }];
    const edges = [];

    faculty.subjects.forEach((sub) => {
      if (sub.subjectId) {
        nodes.push({ id: sub.subjectId._id.toString(), label: sub.subjectId.name, group: 'subject' });
        edges.push({
          from: faculty._id.toString(),
          to: sub.subjectId._id.toString(),
          weight: sub.expertiseLevel,
        });
      }
    });

    return successResponse(res, 200, 'Expertise graph visualization data', { nodes, edges });
  } catch (err) {
    next(err);
  }
};

export const getFacultyAvailability = async (req, res, next) => {
  try {
    let avail = await Availability.findOne({ facultyId: req.params.id });
    if (!avail) {
      avail = { facultyId: req.params.id, slots: [], isRecurring: true };
    }
    return successResponse(res, 200, 'Availability slots retrieved', avail);
  } catch (err) {
    next(err);
  }
};

export const updateFacultyAvailability = async (req, res, next) => {
  try {
    const { slots } = req.body;
    let avail = await Availability.findOneAndUpdate(
      { facultyId: req.params.id },
      { slots, weekStartDate: new Date() },
      { new: true, upsert: true }
    );
    return successResponse(res, 200, 'Availability updated successfully', avail);
  } catch (err) {
    next(err);
  }
};

export const handleSubstituteRequest = async (req, res, next) => {
  try {
    const { substitutionId, action } = req.body; // action: 'accept' or 'reject'
    const sub = await Substitution.findById(substitutionId);
    if (!sub) return next(new AppError('Substitution request not found', 404));

    sub.status = action === 'accept' ? 'accepted' : 'rejected';
    sub.respondedAt = new Date();
    await sub.save();

    return successResponse(res, 200, `Substitution request ${action}ed successfully`, sub);
  } catch (err) {
    next(err);
  }
};
