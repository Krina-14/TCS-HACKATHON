import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    academicYear: { type: String, default: '2025-26' },
    semester: { type: Number, required: true, index: true },
    department: { type: String, required: true, index: true },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true, index: true },
    generatedAt: { type: Date, default: Date.now },
    qualityScore: {
      overall: { type: Number, default: 90 },
      facultyUtilization: { type: Number, default: 88 },
      studentComfort: { type: Number, default: 92 },
      roomUtilization: { type: Number, default: 85 },
      workloadBalance: { type: Number, default: 90 },
      conflictFree: { type: Number, default: 100 },
    },
    slots: [
      {
        day: { type: String, required: true },
        period: { type: Number, required: true },
        timeStart: { type: String, default: '09:00' },
        timeEnd: { type: String, default: '10:00' },
        divisionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true, index: true },
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
        isLab: { type: Boolean, default: false },
        isSubstituted: { type: Boolean, default: false },
        originalFacultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
        substitutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Substitution' },
        status: {
          type: String,
          enum: ['scheduled', 'substituted', 'cancelled', 'exam'],
          default: 'scheduled',
        },
      },
    ],
    constraints: {
      hardConstraints: [{ type: String }],
      softConstraints: { type: Object, default: {} },
    },
  },
  { timestamps: true }
);

timetableSchema.index({ day: 1, period: 1 });

export default mongoose.model('Timetable', timetableSchema);
