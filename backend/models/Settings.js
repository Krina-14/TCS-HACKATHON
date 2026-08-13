import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    academicYear: { type: String, default: '2025-26' },
    departments: [
      {
        name: { type: String },
        code: { type: String },
        hod: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    breakDuration: { type: Number, default: 60 },
    maxFacultyWorkload: { type: Number, default: 20 },
    maxConsecutiveLectures: { type: Number, default: 3 },
    workingDays: [{ type: String, default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }],
    optimizationWeights: {
      studentComfort: { type: Number, default: 25 },
      facultyPreference: { type: Number, default: 20 },
      workloadBalance: { type: Number, default: 20 },
      roomUtilization: { type: Number, default: 15 },
      subjectDistribution: { type: Number, default: 20 },
    },
    substituteWeights: {
      subjectExpertise: { type: Number, default: 35 },
      availability: { type: Number, default: 25 },
      workload: { type: Number, default: 15 },
      divisionFamiliarity: { type: Number, default: 15 },
      facultyPreference: { type: Number, default: 10 },
    },
    autoSubstitute: { type: Boolean, default: true },
    autoSubstituteThreshold: { type: Number, default: 85 },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
