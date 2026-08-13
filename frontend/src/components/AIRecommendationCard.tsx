import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from './Badge';

interface AIRecommendationCardProps {
  className?: string;
  name: string;
  avatar: string;
  matchPercentage: number;
  reasons: string[];
  whyExplanation: string;
  isSelected?: boolean;
  onSelect: () => void;
  workload: string;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  className = '',
  name,
  avatar,
  matchPercentage,
  reasons,
  whyExplanation,
  isSelected = false,
  onSelect,
  workload,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-bg-card border-l-4 border-l-accent-ai shadow-md rounded-r-xl p-5 border border-border transition-all
        ${isSelected ? 'shadow-ai border-accent-ai/40 bg-purple-50/10 dark:bg-purple-950/5' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Profile and Details */}
        <div className="flex gap-4">
          <div className="relative">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border border-border" />
            <div className="absolute -bottom-1 -right-1 bg-accent-ai text-white rounded-full p-0.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-text-primary dark:text-white">{name}</h4>
            <p className="text-xs text-text-secondary mt-0.5">Workload: {workload}</p>
          </div>
        </div>

        {/* Match Percentage */}
        <Badge variant="success" size="md" showDot>
          {matchPercentage}% Match
        </Badge>
      </div>

      {/* Checklist reasons */}
      <div className="mt-4 space-y-2">
        {reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
            <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      {/* Expandable explanations */}
      <div className="mt-4 pt-3 border-t border-border">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-accent-ai flex items-center gap-1 hover:underline focus:outline-none"
        >
          {isExpanded ? (
            <>
              Hide detail analysis <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Why this recommendation? <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-text-muted mt-2 leading-relaxed bg-bg-primary/50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-border-light">
                {whyExplanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Select button */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onSelect}
          className={`text-xs font-bold px-4 py-2 rounded-md transition-all active:scale-95
            ${isSelected 
              ? 'bg-success text-white' 
              : 'bg-primary text-white hover:bg-primary-light'
            }
          `}
        >
          {isSelected ? '✓ Selected' : 'Select Candidate'}
        </button>
      </div>
    </motion.div>
  );
};
