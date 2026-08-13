import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    building: {
      type: String,
      default: 'Main Building',
    },
    capacity: {
      type: Number,
      required: true,
      default: 60,
    },
    type: {
      type: String,
      enum: ['classroom', 'computer_lab', 'ai_lab', 'seminar_hall'],
      required: true,
      default: 'classroom',
    },
    equipment: [{ type: String }],
    floor: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    currentUtilization: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Room', roomSchema);
