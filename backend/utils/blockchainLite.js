import crypto from 'crypto';

export const calculateHash = ({ timestamp, userId, action, newValue, previousHash }) => {
  const dataString = `${timestamp}_${userId || 'system'}_${action}_${JSON.stringify(newValue || {})}_${previousHash || '0'}`;
  return crypto.createHash('sha256').update(dataString).digest('hex');
};

export const verifyChainIntegrity = (logs) => {
  if (!logs || logs.length === 0) return { isValid: true, brokenAtIndex: -1 };

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const expectedPreviousHash = i === 0 ? '0' : logs[i - 1].currentHash;

    if (log.previousHash !== expectedPreviousHash) {
      return { isValid: false, brokenAtIndex: i, reason: `Previous hash mismatch at index ${i}` };
    }

    const computedHash = calculateHash({
      timestamp: log.timestamp,
      userId: log.userId ? log.userId.toString() : 'system',
      action: log.action,
      newValue: log.newValue,
      previousHash: log.previousHash,
    });

    if (log.currentHash !== computedHash) {
      return { isValid: false, brokenAtIndex: i, reason: `Hash corruption detected at index ${i}` };
    }
  }

  return { isValid: true, brokenAtIndex: -1 };
};
