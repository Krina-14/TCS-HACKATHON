import Event from '../models/Event.js';
import { successResponse, AppError } from '../utils/helpers.js';

export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate('affectedDivisions affectedRooms createdBy');
    return successResponse(res, 200, 'Events retrieved', events);
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });
    return successResponse(res, 201, 'Academic event created', event);
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return next(new AppError('Event not found', 404));
    return successResponse(res, 200, 'Event updated', event);
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return next(new AppError('Event not found', 404));
    return successResponse(res, 200, 'Event deleted');
  } catch (err) {
    next(err);
  }
};

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const today = new Date();
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const events = await Event.find({
      startDate: { $gte: today, $lte: next7Days },
    });
    return successResponse(res, 200, 'Upcoming 7-day events retrieved', events);
  } catch (err) {
    next(err);
  }
};
