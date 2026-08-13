import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  className = '',
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ai focus-visible:ring-offset-2
        ${checked ? 'bg-accent-ai' : 'bg-border dark:bg-slate-700'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <motion.div
        animate={{ x: checked ? '20px' : '0px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full shadow-sm"
      />
    </button>
  );
};
