import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  state: 'active' | 'completed' | 'pending';
  icon?: React.ReactNode;
}

interface TimelineProps {
  className?: string;
  items: TimelineItem[];
  onItemClick?: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  className = '',
  items,
  onItemClick,
}) => {
  const dotColor = {
    completed: 'bg-success text-white border-success',
    active: 'bg-accent-ai text-white border-accent-ai shadow-ai animate-pulse-glow',
    pending: 'bg-bg-elevated border-border text-text-muted dark:bg-slate-800',
  };

  const lineColors = {
    completed: 'bg-success',
    active: 'bg-accent-ai',
    pending: 'bg-border dark:bg-slate-700',
  };

  return (
    <div className={`relative ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const isClickable = !!onItemClick;

        return (
          <div
            key={item.id}
            onClick={() => isClickable && onItemClick(item.id)}
            className={`flex items-start gap-4 pb-6 group relative ${
              isClickable ? 'cursor-pointer' : ''
            }`}
          >
            {/* Timeline Line connector */}
            {!isLast && (
              <span
                className={`absolute left-[15px] top-6 w-[2px] h-[calc(100%-12px)] transition-colors duration-normal
                  ${lineColors[item.state]}
                `}
              />
            )}

            {/* Icon/Dot node */}
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold z-10 flex-shrink-0 transition-all duration-normal
                ${dotColor[item.state]}
                ${isClickable ? 'group-hover:scale-110' : ''}
              `}
            >
              {item.icon ? (
                item.icon
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-current" />
              )}
            </div>

            {/* Content Details */}
            <div className="flex-grow pt-0.5">
              <div className="flex justify-between items-baseline gap-2">
                <h4 className="text-sm font-bold text-text-primary dark:text-white leading-tight">
                  {item.title}
                </h4>
                <span className="text-[10px] font-mono text-text-muted whitespace-nowrap">
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{item.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
