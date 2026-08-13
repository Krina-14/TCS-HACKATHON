import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    facultyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      index: true,
    },
    designation: {
      type: String,
      default: 'Assistant Professor',
    },
    subjects: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        expertiseLevel: { type: Number, min: 1, max: 100, default: 80 },
      },
    ],
    expertiseDomains: [
      {
        domain: { type: String },
        level: { type: Number, min: 1, max: 100, default: 80 },
      },
    ],
    maxWorkload: {
      type: Number,
      default: 20,
    },
    currentWorkload: {
      type: Number,
      default: 0,
    },
    preferredDays: [{ type: String }],
    preferredPeriods: [{ type: String }],
    contactPhone: { type: String, default: '' },
    assignedDivisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }],
    joinDate: { type: Date, default: Date.now },
    isAvailableForSubstitution: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Faculty', facultySchema);
