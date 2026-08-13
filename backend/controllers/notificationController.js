import Notification from '../models/Notification.js';
import { successResponse, AppError } from '../utils/helpers.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      $or: [{ userId }, { userId: null }],
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, 'Notifications retrieved', notifications);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notif) return next(new AppError('Notification not found', 404));
    return successResponse(res, 200, 'Notification marked as read', notif);
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    return successResponse(res, 200, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notif = await Notification.findByIdAndDelete(req.params.id);
    if (!notif) return next(new AppError('Notification not found', 404));
    return successResponse(res, 200, 'Notification deleted');
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    return successResponse(res, 200, 'Unread notification count', { unreadCount: count });
  } catch (err) {
    next(err);
  }
};
