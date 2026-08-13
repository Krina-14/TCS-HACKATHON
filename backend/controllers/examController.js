import Exam from '../models/Exam.js';
import Faculty from '../models/Faculty.js';
import { successResponse, AppError } from '../utils/helpers.js';

export const getExams = async (req, res, next) => {
  try {
    const exams = await Exam.find().populate('subjectId divisionId roomId invigilatorId');
    return successResponse(res, 200, 'Exams retrieved', exams);
  } catch (err) {
    next(err);
  }
};

export const scheduleExam = async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);
    return successResponse(res, 201, 'Exam scheduled successfully', exam);
  } catch (err) {
    next(err);
  }
};

export const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('subjectId divisionId roomId invigilatorId');
    if (!exam) return next(new AppError('Exam not found', 404));
    return successResponse(res, 200, 'Exam details', exam);
  } catch (err) {
    next(err);
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return next(new AppError('Exam not found', 404));
    return successResponse(res, 200, 'Exam updated', exam);
  } catch (err) {
    next(err);
  }
};

export const autoAssignInvigilators = async (req, res, next) => {
  try {
    const exams = await Exam.find({ invigilatorId: null });
    const faculty = await Faculty.find();
    let assignedCount = 0;

    for (let i = 0; i < exams.length; i++) {
      const invigilator = faculty[i % faculty.length];
      if (invigilator) {
        exams[i].invigilatorId = invigilator._id;
        await exams[i].save();
        assignedCount++;
      }
    }

    return successResponse(res, 200, `Invigilators auto-assigned to ${assignedCount} exams`, {
      assignedCount,
    });
  } catch (err) {
    next(err);
  }
};
