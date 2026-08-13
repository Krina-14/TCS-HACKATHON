import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    divisionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true },
    examDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    invigilatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    batch: { type: String, default: 'All' },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  },
  { timestamps: true }
);

export default mongoose.model('Exam', examSchema);
