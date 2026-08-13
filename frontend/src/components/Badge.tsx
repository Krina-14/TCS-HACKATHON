import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'ai' | 'neutral';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  className?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  showDot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'neutral',
  size = 'md',
  showDot = false,
  children,
}) => {
  const baseStyles = 'inline-flex items-center font-sans font-semibold rounded-full tracking-wide';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    success: 'bg-success-light text-success dark:bg-emerald-950/60 dark:text-emerald-400',
    warning: 'bg-warning-light text-warning dark:bg-amber-950/60 dark:text-amber-400',
    danger: 'bg-danger-light text-danger dark:bg-red-950/60 dark:text-red-400',
    info: 'bg-blue-100 text-info dark:bg-blue-950/60 dark:text-blue-400',
    ai: 'bg-purple-100 text-accent-ai dark:bg-purple-950/60 dark:text-accent-ai-glow border border-purple-200 dark:border-purple-800 shadow-sm shadow-purple-500/10',
    neutral: 'bg-bg-elevated text-text-secondary dark:bg-slate-800 dark:text-slate-300',
  };

  const dotColorStyles = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    ai: 'bg-accent-ai',
    neutral: 'bg-text-secondary',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColorStyles[variant]}`} />
      )}
      {children}
    </span>
  );
};
