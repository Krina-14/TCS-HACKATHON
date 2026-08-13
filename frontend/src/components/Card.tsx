import React from 'react';
import { motion } from 'framer-motion';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive';
export type CardPadding = 'default' | 'compact' | 'loose';

interface CardProps {
  className?: string;
  variant?: CardVariant;
  padding?: CardPadding;
  header?: {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
  };
  footer?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  className = '',
  variant = 'default',
  padding = 'default',
  header,
  footer,
  children,
  onClick,
}) => {
  const paddingStyles = {
    compact: 'p-4',
    default: 'p-6',
    loose: 'p-8',
  };

  const variantStyles = {
    default: 'bg-bg-card border border-border shadow-sm rounded-lg',
    elevated: 'bg-bg-card shadow-lg rounded-xl border border-border-light',
    bordered: 'bg-bg-card border-2 border-border rounded-lg',
    interactive: 'bg-bg-card border border-border shadow-sm rounded-lg cursor-pointer transition-all hover:border-primary-light hover:-translate-y-1 hover:shadow-md',
  };

  // Standard entry animation
  const entryVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring' as const, duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={entryVariants}
      onClick={onClick}
      className={`${variantStyles[variant]} ${className}`}
    >
      {header && (
        <div className={`border-b border-border flex items-start justify-between ${padding === 'compact' ? 'px-4 py-3' : 'px-6 py-4'}`}>
          <div>
            <h3 className="text-text-primary font-bold text-lg leading-tight tracking-tight">{header.title}</h3>
            {header.subtitle && <p className="text-text-secondary text-sm mt-1">{header.subtitle}</p>}
          </div>
          {header.action && <div className="ml-4 flex-shrink-0">{header.action}</div>}
        </div>
      )}

      <div className={paddingStyles[padding]}>
        {children}
      </div>

      {footer && (
        <div className={`border-t border-border bg-bg-elevated/40 rounded-b-lg ${padding === 'compact' ? 'px-4 py-3' : 'px-6 py-4'}`}>
          {footer}
        </div>
      )}
    </motion.div>
  );
};
