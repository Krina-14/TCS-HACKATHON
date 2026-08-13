import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from './Badge';

interface ConflictCardProps {
  className?: string;
  type: string;
  description: string;
  affectedEntities: string;
  severity: 'critical' | 'warning' | 'resolved';
  onAutoFix?: () => void;
  onView?: () => void;
  onIgnore?: () => void;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({
  className = '',
  type,
  description,
  affectedEntities,
  severity,
  onAutoFix,
  onView,
  onIgnore,
}) => {
  const isResolved = severity === 'resolved';

  const borderColors = {
    critical: 'border-l-danger',
    warning: 'border-l-warning',
    resolved: 'border-l-success',
  };

  const icons = {
    critical: <AlertTriangle className="w-5 h-5 text-danger" />,
    warning: <AlertCircle className="w-5 h-5 text-warning" />,
    resolved: <CheckCircle className="w-5 h-5 text-success" />,
  };

  const severityBadges = {
    critical: <Badge variant="danger" size="sm" showDot>Critical</Badge>,
    warning: <Badge variant="warning" size="sm" showDot>Warning</Badge>,
    resolved: <Badge variant="success" size="sm" showDot>Resolved</Badge>,
  };

  return (
    <motion.div
      layout
      whileHover={{ y: isResolved ? 0 : -2 }}
      className={`bg-bg-card border-l-4 ${borderColors[severity]} border border-border rounded-r-xl p-5 shadow-sm transition-all
        ${isResolved ? 'opacity-65' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Type & Icon */}
        <div className="flex gap-3">
          <div className="mt-0.5 flex-shrink-0">{icons[severity]}</div>
          <div>
            <h4 className={`font-bold text-sm text-text-primary dark:text-white ${isResolved ? 'line-through' : ''}`}>
              {type}
            </h4>
            <p className="text-xs text-text-secondary mt-1">{description}</p>
          </div>
        </div>

        {/* Severity Badge */}
        <div className="flex-shrink-0">{severityBadges[severity]}</div>
      </div>

      {/* Affected Entities */}
      <div className="mt-4 bg-bg-primary/50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-border-light flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase block">Affected Entities</span>
          <span className="text-xs font-semibold text-text-secondary mt-0.5 block">{affectedEntities}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {!isResolved && (onAutoFix || onView || onIgnore) && (
        <div className="mt-5 flex items-center justify-between border-t border-border-light pt-4">
          <div className="flex gap-2">
            {onView && (
              <button
                type="button"
                onClick={onView}
                className="text-xs font-bold text-text-secondary bg-bg-elevated hover:bg-border px-3 py-1.5 rounded transition-all active:scale-95"
              >
                View Details
              </button>
            )}
            {onIgnore && (
              <button
                type="button"
                onClick={onIgnore}
                className="text-xs font-bold text-text-muted hover:text-text-primary px-3 py-1.5 rounded transition-all"
              >
                Ignore
              </button>
            )}
          </div>
          {onAutoFix && (
            <button
              type="button"
              onClick={onAutoFix}
              className="text-xs font-bold text-white bg-primary hover:bg-primary-light px-4 py-1.5 rounded shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              ⚡ Auto Fix
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
