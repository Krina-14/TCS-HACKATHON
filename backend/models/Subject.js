import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    credits: {
      type: Number,
      default: 4,
    },
    type: {
      type: String,
      enum: ['theory', 'lab'],
      required: true,
    },
    lecturesPerWeek: {
      type: Number,
      required: true,
      default: 3,
    },
    preferredPeriods: {
      type: String,
      enum: ['morning', 'afternoon', 'no_preference'],
      default: 'no_preference',
    },
    requiredRoomType: {
      type: String,
      enum: ['classroom', 'computer_lab', 'ai_lab', 'seminar_hall'],
      required: true,
      default: 'classroom',
    },
    requiredLab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    department: {
      type: String,
      required: true,
      index: true,
    },
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    topics: [{ type: String }],
    color: {
      type: String,
      default: '#3b82f6',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Subject', subjectSchema);
