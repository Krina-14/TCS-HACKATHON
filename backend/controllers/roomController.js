import Room from '../models/Room.js';
import Timetable from '../models/Timetable.js';
import { successResponse, AppError } from '../utils/helpers.js';
import { roomSchema } from '../utils/validators.js';

export const getRooms = async (req, res, next) => {
  try {
    const { type, building } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    if (building) query.building = building;

    const rooms = await Room.find(query);
    return successResponse(res, 200, 'Rooms retrieved', rooms);
  } catch (err) {
    next(err);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return next(new AppError('Room not found', 404));
    return successResponse(res, 200, 'Room retrieved', room);
  } catch (err) {
    next(err);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const validated = roomSchema.parse(req.body);
    const room = await Room.create(validated);
    return successResponse(res, 201, 'Room created successfully', room);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return next(new AppError('Room not found', 404));
    return successResponse(res, 200, 'Room updated successfully', room);
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!room) return next(new AppError('Room not found', 404));
    return successResponse(res, 200, 'Room deactivated successfully');
  } catch (err) {
    next(err);
  }
};

export const getRoomUtilization = async (req, res, next) => {
  try {
    const rooms = await Room.find({ isActive: true });
    const activeTimetable = await Timetable.findOne({ isActive: true });
    const totalPossibleSlotsPerWeek = 35; // 5 days * 7 lecture periods

    const stats = rooms.map((r) => {
      const usedSlots = activeTimetable
        ? activeTimetable.slots.filter((s) => s.roomId?.toString() === r._id.toString()).length
        : 0;
      const utilization = Math.round((usedSlots / totalPossibleSlotsPerWeek) * 100);
      return {
        _id: r._id,
        roomNumber: r.roomNumber,
        type: r.type,
        capacity: r.capacity,
        usedSlots,
        utilizationPercentage: Math.min(100, utilization),
      };
    });

    return successResponse(res, 200, 'Room utilization statistics retrieved', stats);
  } catch (err) {
    next(err);
  }
};

export const getRoomSchedule = async (req, res, next) => {
  try {
    const activeTimetable = await Timetable.findOne({ isActive: true })
      .populate('slots.subjectId')
      .populate('slots.facultyId')
      .populate('slots.divisionId');

    const slots = activeTimetable
      ? activeTimetable.slots.filter((s) => s.roomId?.toString() === req.params.id)
      : [];

    return successResponse(res, 200, 'Room weekly schedule retrieved', { slots });
  } catch (err) {
    next(err);
  }
};
