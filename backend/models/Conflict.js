import mongoose from 'mongoose';

const conflictSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'faculty_clash',
        'room_clash',
        'division_clash',
        'workload_exceeded',
        'availability_violation',
        'capacity_exceeded',
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'warning'],
      default: 'critical',
    },
    description: { type: String, required: true },
    affectedFaculty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }],
    affectedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    affectedDivisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }],
    affectedSlots: [{ type: String }],
    detectedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    resolution: { type: String, default: '' },
    autoFixed: { type: Boolean, default: false },
    timetableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable' },
  },
  { timestamps: true }
);

export default mongoose.model('Conflict', conflictSchema);
