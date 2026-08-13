import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'faculty_absence',
        'substitute_assigned',
        'substitute_request',
        'conflict',
        'timetable_change',
        'room_change',
        'timetable_generated',
        'availability_update',
        'ai_suggestion',
        'system',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object, default: {} },
    isRead: { type: Boolean, default: false, index: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
