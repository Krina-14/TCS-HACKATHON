import React from 'react';
import { Calendar } from '../components/Calendar';
import { Card } from '../components/Card';
import { Sparkles, CalendarDays } from 'lucide-react';
import { Badge } from '../components/Badge';

export const EventView: React.FC = () => {
  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-warning" /> Events & Holidays Management
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Configure academic breaks, holidays, and campus events.
          </p>
        </div>
      </div>

      {/* Embedded custom calendar */}
      <Calendar />

      {/* Holiday Compression Card */}
      <Card 
        className="border-l-4 border-l-warning bg-amber-50/5" 
        header={{ 
          title: (
            <div className="flex items-center gap-1.5 text-warning">
              <Sparkles className="w-4 h-4" /> Academic Break Suggestions
            </div>
          ) 
        }}
      >
        <div className="text-xs text-text-secondary leading-relaxed space-y-2 max-w-3xl">
          <p>
            ⚠️ <strong>Calendar Collision Detected:</strong> You have 14 teaching weeks but only 12 available weeks for syllabus delivery due to scheduled Diwali festival break.
          </p>
          <p className="font-bold text-text-primary mt-3">AI Suggestions Options:</p>
          <ul className="list-disc pl-4 space-y-1 text-text-muted font-bold">
            <li>Option 1: Compress syllabus delivery parameters by 10% (relocate 3 review lectures to online assignments)</li>
            <li>Option 2: Add Saturday classes for IT-A and IT-B divisions during week 8 and week 10</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
