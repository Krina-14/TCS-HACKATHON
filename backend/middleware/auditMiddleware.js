import AuditLog from '../models/AuditLog.js';
import { calculateHash } from '../utils/blockchainLite.js';

export const auditMiddleware = (entityName) => {
  return async (req, res, next) => {
    // Only auto-audit mutations
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const originalJson = res.json;

    res.json = function (data) {
      res.json = originalJson;

      if (data && data.success) {
        // Fire and forget audit creation
        setImmediate(async () => {
          try {
            const lastLog = await AuditLog.findOne().sort({ timestamp: -1 });
            const previousHash = lastLog ? lastLog.currentHash : '0';
            const timestamp = new Date();
            const action = `${req.method} ${req.originalUrl}`;
            const newValue = data.data || req.body;

            const currentHash = calculateHash({
              timestamp,
              userId: req.user?._id ? req.user._id.toString() : 'system',
              action,
              newValue,
              previousHash,
            });

            await AuditLog.create({
              timestamp,
              userId: req.user?._id || null,
              userEmail: req.user?.email || 'system',
              action,
              entity: entityName || 'System',
              entityId: data.data?._id || null,
              newValue,
              ipAddress: req.ip || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'] || 'Unknown',
              previousHash,
              currentHash,
            });
          } catch (err) {
            console.error('Audit Log Auto-creation Warning:', err.message);
          }
        });
      }

      return originalJson.call(this, data);
    };

    next();
  };
};
