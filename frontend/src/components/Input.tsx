import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, value, onChange, disabled, type = 'text', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClear = () => {
      onChange('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const hasValue = value.length > 0;
    const isFloating = isFocused || hasValue;

    // Shake animation on error
    const shakeVariants = {
      shake: {
        x: [0, -10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.4 }
      }
    };

    return (
      <div className={`relative w-full ${className}`}>
        <motion.div
          animate={error ? 'shake' : ''}
          variants={shakeVariants}
          className="relative"
        >
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center justify-center pointer-events-none w-5 h-5">
              {leftIcon}
            </div>
          )}

          {/* Floating Label */}
          <motion.label
            animate={{
              top: isFloating ? '6px' : '50%',
              scale: isFloating ? 0.75 : 1,
              x: leftIcon && !isFloating ? '32px' : '0px',
              y: '-50%',
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute left-3 origin-top-left pointer-events-none transition-colors duration-normal
              ${isFloating ? 'text-accent-ai text-xs font-semibold' : 'text-text-muted text-sm'}
              ${error ? 'text-danger' : ''}
            `}
          >
            {label}
          </motion.label>

          {/* Input field */}
          <input
            {...props}
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            type={type}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full h-12 bg-bg-card border rounded-md font-sans text-sm text-text-primary px-3 transition-all duration-normal
              ${leftIcon ? 'pl-10' : ''}
              ${isFloating ? 'pt-5 pb-1' : ''}
              ${isFocused ? 'border-accent-ai shadow-[0_0_0_2px_rgba(124,58,237,0.15)] outline-none' : 'border-border'}
              ${error ? 'border-danger focus:border-danger focus:shadow-[0_0_0_2px_rgba(239,68,68,0.15)]' : ''}
              ${disabled ? 'bg-bg-elevated/50 text-text-muted cursor-not-allowed' : ''}
            `}
          />

          {/* Clear Button */}
          {hasValue && isFocused && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary w-5 h-5 flex items-center justify-center rounded-full hover:bg-bg-elevated"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-danger text-xs font-semibold mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
