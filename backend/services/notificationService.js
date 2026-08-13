import Notification from '../models/Notification.js';
import { emitToRoom } from '../config/socket.js';
import { sendEmail } from '../config/email.js';

export const createAndSendNotification = async ({
  userId,
  userEmail,
  type,
  title,
  message,
  data = {},
  priority = 'medium',
  targetRoom = null,
}) => {
  try {
    // 1. Store in DB
    const notif = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
      priority,
    });

    // 2. Emit Real-time WebSockets
    if (userId) {
      emitToRoom(`user-${userId}`, 'notification:new', notif);
    }
    if (targetRoom) {
      emitToRoom(targetRoom, 'notification:new', notif);
    }

    // 3. Email Notification Fallback if high priority
    if (userEmail && ['high', 'urgent'].includes(priority)) {
      await sendEmail({
        to: userEmail,
        subject: `[SmartSched Alert] ${title}`,
        text: message,
      });
    }

    return notif;
  } catch (err) {
    console.error('Notification Service Error:', err.message);
    return null;
  }
};
