import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
      index: true,
    },
    weekStartDate: {
      type: Date,
      default: Date.now,
    },
    slots: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          required: true,
        },
        period: { type: Number, min: 1, max: 8, required: true },
        status: {
          type: String,
          enum: ['available', 'unavailable', 'preferred', 'optional'],
          default: 'available',
        },
      },
    ],
    isRecurring: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Availability', availabilitySchema);
