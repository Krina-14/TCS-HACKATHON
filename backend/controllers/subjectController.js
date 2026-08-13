import Subject from '../models/Subject.js';
import Faculty from '../models/Faculty.js';
import { successResponse, AppError } from '../utils/helpers.js';
import { subjectSchema } from '../utils/validators.js';

export const getSubjects = async (req, res, next) => {
  try {
    const { department, type, semester } = req.query;
    const query = {};
    if (department) query.department = department;
    if (type) query.type = type;

    const subjects = await Subject.find(query).populate('requiredLab');
    return successResponse(res, 200, 'Subjects list retrieved', subjects);
  } catch (err) {
    next(err);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('prerequisites requiredLab');
    if (!subject) return next(new AppError('Subject not found', 404));
    return successResponse(res, 200, 'Subject retrieved', subject);
  } catch (err) {
    next(err);
  }
};

export const createSubject = async (req, res, next) => {
  try {
    const validated = subjectSchema.parse(req.body);
    const subject = await Subject.create(validated);
    return successResponse(res, 201, 'Subject created successfully', subject);
  } catch (err) {
    next(err);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return next(new AppError('Subject not found', 404));
    return successResponse(res, 200, 'Subject updated successfully', subject);
  } catch (err) {
    next(err);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return next(new AppError('Subject not found', 404));
    return successResponse(res, 200, 'Subject deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const getEligibleFaculty = async (req, res, next) => {
  try {
    const facultyList = await Faculty.find({
      'subjects.subjectId': req.params.id,
    }).populate('userId', 'firstName lastName email department');

    return successResponse(res, 200, 'Eligible faculty members fetched', facultyList);
  } catch (err) {
    next(err);
  }
};
