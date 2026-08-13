import mongoose from 'mongoose';

const substitutionSchema = new mongoose.Schema(
  {
    originalFacultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
      index: true,
    },
    substituteFacultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
      index: true,
    },
    timetableSlotId: {
      type: String,
      required: true,
    },
    timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Timetable',
      required: true,
    },
    reason: { type: String, default: 'Faculty absent' },
    matchScore: { type: Number, default: 90 },
    matchReasons: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'auto_assigned', 'backup_used'],
      default: 'pending',
    },
    backupFacultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
    studentImpact: {
      studentsAffected: { type: Number, default: 60 },
      disruption: { type: Number, default: 0 },
    },
    isZeroWaste: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Substitution', substitutionSchema);
