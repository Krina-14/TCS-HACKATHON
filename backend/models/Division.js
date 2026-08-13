import mongoose from 'mongoose';

const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    semester: {
      type: Number,
      required: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      index: true,
    },
    studentCount: {
      type: Number,
      required: true,
      default: 60,
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    classAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    roomPreference: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  },
  { timestamps: true }
);

export default mongoose.model('Division', divisionSchema);
