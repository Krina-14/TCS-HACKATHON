import mongoose from 'mongoose';

const timetableVersionSchema = new mongoose.Schema(
  {
    timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Timetable',
      required: true,
      index: true,
    },
    version: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, default: 'Manual edit or substitution' },
    diff: { type: Object, default: {} },
    backupSlots: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('TimetableVersion', timetableVersionSchema);
