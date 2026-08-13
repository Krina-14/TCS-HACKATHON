import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'avatar' | 'card' | 'row';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const baseStyles = 'bg-slate-200 dark:bg-slate-700 animate-shimmer relative overflow-hidden bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]';

  const variantStyles = {
    text: 'h-4 w-full rounded',
    avatar: 'rounded-full h-12 w-12 flex-shrink-0',
    card: 'rounded-xl h-48 w-full',
    row: 'h-12 w-full rounded',
  };

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} />;
};
