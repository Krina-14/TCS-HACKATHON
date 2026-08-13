import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['holiday', 'workshop', 'seminar', 'hackathon', 'exam', 'sports', 'maintenance'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isRecurring: { type: Boolean, default: false },
    affectedDivisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }],
    affectedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    description: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
