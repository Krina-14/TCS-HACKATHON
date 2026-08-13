import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    userEmail: { type: String, default: 'system' },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    oldValue: { type: Object, default: null },
    newValue: { type: Object, default: null },
    reason: { type: String, default: '' },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String, default: 'SmartSched System' },
    previousHash: { type: String, required: true },
    currentHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('AuditLog', auditLogSchema);
