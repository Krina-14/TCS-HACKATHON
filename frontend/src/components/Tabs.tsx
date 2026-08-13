import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

interface TabsProps {
  className?: string;
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pill';
}

export const Tabs: React.FC<TabsProps> = ({
  className = '',
  items,
  activeId,
  onChange,
  variant = 'underline',
}) => {
  const isUnderline = variant === 'underline';

  return (
    <div className={`flex border-b border-border w-full relative ${isUnderline ? 'gap-8' : 'p-1 bg-bg-elevated rounded-lg border-none'} ${className}`}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative py-3 px-2 text-sm font-semibold transition-colors duration-normal flex items-center gap-1.5 focus:outline-none select-none
              ${isUnderline ? '' : 'rounded-md py-1.5 px-3 flex-grow text-center justify-center'}
              ${isActive ? 'text-accent-ai' : 'text-text-secondary hover:text-text-primary'}
            `}
          >
            {/* Tab Label */}
            <span>{tab.label}</span>

            {/* Optional Badge */}
            {tab.badge !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center
                ${isActive 
                  ? 'bg-purple-100 text-accent-ai dark:bg-purple-950/60 dark:text-accent-ai-glow' 
                  : 'bg-bg-elevated text-text-secondary border border-border dark:bg-slate-800'
                }
              `}>
                {tab.badge}
              </span>
            )}

            {/* Sliding Active Overlay */}
            {isActive && (
              isUnderline ? (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-ai"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              ) : (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-bg-card rounded-md shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )
            )}
          </button>
        );
      })}
    </div>
  );
};
