import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, disabled, leftIcon, rightIcon, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ai focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-4 py-2 text-sm h-10',
      lg: 'px-6 py-3 text-base h-12 rounded-lg',
    };

    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary-light active:bg-primary-dark',
      secondary: 'bg-bg-elevated text-text-primary hover:bg-border active:bg-border-light',
      ghost: 'bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
      danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-800',
      outline: 'bg-transparent border border-border text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
      ai: 'bg-gradient-to-r from-accent-ai to-primary-light text-white shadow-ai animate-pulse-glow hover:opacity-90',
    };

    const isAIVariant = variant === 'ai';

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
        <span className="flex items-center">{children}</span>
        {!isLoading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
