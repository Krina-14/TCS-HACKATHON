import React from 'react';
import { UserX, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export type NotificationType = 'absence' | 'substitute' | 'conflict' | 'info' | 'ai';

interface NotificationItemProps {
  className?: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type: NotificationType;
  onClick?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  className = '',
  title,
  message,
  timestamp,
  unread,
  type,
  onClick,
}) => {
  const bgStyles = unread 
    ? 'bg-blue-50/40 dark:bg-blue-950/10 border-l-2 border-l-info shadow-sm' 
    : 'bg-bg-card hover:bg-bg-elevated/20';

  const icons = {
    absence: (
      <div className="w-8 h-8 rounded-full bg-danger-light text-danger flex items-center justify-center dark:bg-red-950/60 dark:text-red-400">
        <UserX className="w-4 h-4" />
      </div>
    ),
    substitute: (
      <div className="w-8 h-8 rounded-full bg-success-light text-success flex items-center justify-center dark:bg-emerald-950/60 dark:text-emerald-400">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    ),
    conflict: (
      <div className="w-8 h-8 rounded-full bg-warning-light text-warning flex items-center justify-center dark:bg-amber-950/60 dark:text-amber-400">
        <AlertCircle className="w-4 h-4" />
      </div>
    ),
    info: (
      <div className="w-8 h-8 rounded-full bg-blue-100 text-info flex items-center justify-center dark:bg-blue-950/60 dark:text-blue-400">
        <RefreshCw className="w-4 h-4" />
      </div>
    ),
    ai: (
      <div className="w-8 h-8 rounded-full bg-purple-100 text-accent-ai flex items-center justify-center dark:bg-purple-950/60 dark:text-accent-ai-glow">
        <Sparkles className="w-4 h-4" />
      </div>
    ),
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-border flex gap-3 transition-colors select-none ${onClick ? 'cursor-pointer' : ''} ${bgStyles} ${className}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">{icons[type]}</div>

      {/* Details */}
      <div className="flex-grow pt-0.5">
        <div className="flex justify-between items-baseline gap-2">
          <p className={`text-xs text-text-primary dark:text-white ${unread ? 'font-bold' : 'font-semibold'}`}>
            {title}
          </p>
          <span className="text-[9px] font-mono text-text-muted whitespace-nowrap">{timestamp}</span>
        </div>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{message}</p>
      </div>

      {/* Unread indicator dot */}
      {unread && (
        <span className="w-2 h-2 rounded-full bg-info self-center flex-shrink-0" />
      )}
    </div>
  );
};
