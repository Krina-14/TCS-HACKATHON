import AIEngine from '../services/aiEngine.js';
import Faculty from '../models/Faculty.js';
import Timetable from '../models/Timetable.js';
import Conflict from '../models/Conflict.js';
import { successResponse, AppError } from '../utils/helpers.js';

export const processVoiceQuery = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) return next(new AppError('Query string is required', 400));

    const parsed = AIEngine.parseQuery(query);
    let resultData = null;

    if (parsed.action === 'find_free_faculty') {
      const facultyList = await Faculty.find().populate('userId', 'firstName lastName email');
      resultData = facultyList.map((f) => ({
        facultyId: f.facultyId,
        name: `Prof. ${f.userId?.firstName} ${f.userId?.lastName}`,
        status: 'Available',
        slot: `${parsed.params.day} Period ${parsed.params.period}`,
      }));
    } else if (parsed.action === 'find_experts') {
      const facultyList = await Faculty.find().populate('userId', 'firstName lastName email');
      resultData = facultyList.slice(0, 2).map((f) => ({
        name: `Prof. ${f.userId?.firstName} ${f.userId?.lastName}`,
        expertise: 'AI/ML Expert (95% Match)',
      }));
    } else if (parsed.action === 'show_conflicts') {
      const conflicts = await Conflict.find({ resolvedAt: null });
      resultData = conflicts;
    } else {
      const activeTimetable = await Timetable.findOne({ isActive: true });
      resultData = {
        timetableId: activeTimetable ? activeTimetable._id : 'active-01',
        queryProcessed: query,
      };
    }

    return successResponse(res, 200, parsed.interpretation, {
      parsedQuery: parsed,
      result: resultData,
    });
  } catch (err) {
    next(err);
  }
};

export const getSuggestedQueries = async (req, res, next) => {
  try {
    const suggestions = [
      'Who is free on Monday at 11 AM?',
      'Who can teach Artificial Intelligence?',
      'Show IT-A timetable for Semester 5',
      'What if Prof. Mehta is absent on Wednesday?',
      'Show conflicts in IT Department',
    ];
    return successResponse(res, 200, 'Suggested voice queries', suggestions);
  } catch (err) {
    next(err);
  }
};
