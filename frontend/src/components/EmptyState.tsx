import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  className?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className = '',
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      {/* Animated Floating Illustration container */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="text-text-muted mb-4 w-24 h-24 flex items-center justify-center bg-bg-elevated rounded-full text-accent-ai"
      >
        {icon ? (
          icon
        ) : (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </motion.div>

      <h3 className="text-text-primary font-bold text-base mb-1">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-primary-light transition-all active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
