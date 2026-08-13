import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  className?: string;
  value: number; // 0 to 100
  max?: number;
  variant?: 'linear' | 'circular';
  showLabel?: boolean;
  useGradient?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'ai';
  size?: number; // only for circular: width/height in px
  strokeWidth?: number; // only for circular
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className = '',
  value,
  max = 100,
  variant = 'linear',
  showLabel = false,
  useGradient = false,
  color = 'primary',
  size = 64,
  strokeWidth = 6,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: 'bg-primary dark:bg-primary-light',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    ai: 'bg-gradient-to-r from-accent-ai to-primary-light',
  };

  const svgStrokeColors = {
    primary: 'stroke-primary dark:stroke-primary-light',
    success: 'stroke-success',
    warning: 'stroke-warning',
    danger: 'stroke-danger',
    ai: 'stroke-accent-ai',
  };

  if (variant === 'circular') {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            className="stroke-border dark:stroke-slate-700"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <motion.circle
            className={svgStrokeColors[color]}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {showLabel && (
          <span className="absolute text-xs font-bold text-text-primary dark:text-white font-mono">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }

  // Linear view
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-1">
        {showLabel && (
          <span className="text-xs font-bold text-text-secondary font-mono">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full h-2.5 bg-border dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${useGradient ? colors.ai : colors[color]}`}
        />
      </div>
    </div>
  );
};
