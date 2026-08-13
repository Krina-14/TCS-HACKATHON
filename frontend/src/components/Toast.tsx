import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'danger' | 'info' | 'ai';
export type ToastPosition = 'top-right' | 'top-center' | 'bottom-right';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // ms
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    // Animation interval for the countdown line
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = steps;

    const progressTimer = setInterval(() => {
      currentStep -= 1;
      setProgress((currentStep / steps) * 100);
      if (currentStep <= 0) {
        clearInterval(progressTimer);
      }
    }, intervalTime);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [id, duration, onClose]);

  const iconColors = {
    success: 'text-success bg-success-light dark:bg-emerald-950/60 dark:text-emerald-400',
    warning: 'text-warning bg-warning-light dark:bg-amber-950/60 dark:text-amber-400',
    danger: 'text-danger bg-danger-light dark:bg-red-950/60 dark:text-red-400',
    info: 'text-info bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400',
    ai: 'text-accent-ai bg-purple-100 dark:bg-purple-950/60 dark:text-accent-ai-glow border-purple-200 dark:border-purple-800',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    danger: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    ai: <Sparkles className="w-5 h-5" />,
  };

  const progressColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    ai: 'bg-accent-ai',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className="w-full max-w-sm bg-bg-card border border-border shadow-xl rounded-lg overflow-hidden flex flex-col pointer-events-auto"
    >
      <div className="p-4 flex items-start gap-3">
        {/* Status Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[type]}`}>
          {icons[type]}
        </div>

        {/* Text Details */}
        <div className="flex-grow pt-0.5">
          <p className="text-sm font-bold text-text-primary dark:text-white leading-tight">{title}</p>
          <p className="text-xs text-text-secondary mt-1">{message}</p>
          
          {/* Action button */}
          {action && (
            <button
              onClick={() => {
                action.onClick();
                onClose(id);
              }}
              className="text-xs font-bold text-accent-ai hover:underline mt-2 flex items-center gap-1.5 focus:outline-none"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onClose(id)}
          className="text-text-muted hover:text-text-primary p-0.5 rounded-full hover:bg-bg-elevated transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dismiss Progress bar */}
      <div className="w-full h-1 bg-border dark:bg-slate-800">
        <div
          className={`h-full ${progressColors[type]}`}
          style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
        />
      </div>
    </motion.div>
  );
};

// Global Toast Container helper component
interface ToastContainerProps {
  toasts: { id: string; type: ToastType; title: string; message: string; action?: { label: string; onClick: () => void } }[];
  onClose: (id: string) => void;
  position?: ToastPosition;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right',
}) => {
  const positionStyles = {
    'top-right': 'top-6 right-6 flex-col-reverse',
    'top-center': 'top-6 left-1/2 -translate-x-1/2 flex-col-reverse',
    'bottom-right': 'bottom-6 right-6 flex-col',
  };

  return (
    <div className={`fixed z-[99999] flex gap-3 pointer-events-none ${positionStyles[position]}`}>
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            type={t.type}
            title={t.title}
            message={t.message}
            action={t.action}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
