import React from 'react';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  className?: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  sparklineData?: number[]; // list of numbers for a mini-trend chart
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  className = '',
  label,
  value,
  icon,
  trend,
  sparklineData,
  onClick,
}) => {
  const trendColors = {
    up: 'text-success bg-success-light dark:bg-emerald-950/60 dark:text-emerald-400',
    down: 'text-danger bg-danger-light dark:bg-red-950/60 dark:text-red-400',
    neutral: 'text-text-secondary bg-bg-elevated dark:bg-slate-800 dark:text-slate-300',
  };

  const trendIcons = {
    up: <ArrowUpRight className="w-3.5 h-3.5" />,
    down: <ArrowDownRight className="w-3.5 h-3.5" />,
    neutral: <Minus className="w-3.5 h-3.5" />,
  };

  // Sparkline computation
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const width = 100;
    const height = 30;
    const padding = 2;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min === 0 ? 1 : max - min;

    const points = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - min) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor =
      trend?.type === 'up'
        ? 'var(--success)'
        : trend?.type === 'down'
        ? 'var(--danger)'
        : 'var(--text-muted)';

    return (
      <svg width={width} height={height} className="overflow-visible flex-shrink-0">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <Card
      variant={onClick ? 'interactive' : 'default'}
      padding="compact"
      onClick={onClick}
      className={`relative flex items-center justify-between overflow-hidden min-h-[110px] ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Metric Icon */}
        <div className="w-10 h-10 rounded-lg bg-primary-light/10 text-primary-light flex items-center justify-center flex-shrink-0 dark:bg-blue-950/40 dark:text-blue-400">
          {icon}
        </div>

        {/* Labels and values */}
        <div>
          <span className="text-xs font-bold text-text-secondary dark:text-slate-400 block tracking-tight">
            {label}
          </span>
          <span className="text-2xl font-bold font-mono text-text-primary dark:text-white mt-1 block">
            {value}
          </span>

          {/* Trend Indicator */}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${trendColors[trend.type]}`}>
                {trendIcons[trend.type]}
                {trend.value}
              </span>
              <span className="text-[10px] text-text-muted">this month</span>
            </div>
          )}
        </div>
      </div>

      {/* Sparkline mini-graph */}
      {sparklineData && (
        <div className="hidden sm:block ml-4">
          {renderSparkline()}
        </div>
      )}
    </Card>
  );
};
