import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useStore, TimetableCell } from '../store/useStore';
import { Tooltip } from './Tooltip';
import { Badge } from './Badge';

interface TimetableGridProps {
  className?: string;
  divisionFilter?: string; // 'IT-A', 'IT-B', 'IT-C', 'CSE-A', etc.
  facultyFilter?: string; // FAC-XXXX
  roomFilter?: string;
  onCellClick?: (cell: TimetableCell) => void;
  showDemoGuides?: boolean;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  className = '',
  divisionFilter = 'IT-A',
  facultyFilter = '',
  roomFilter = '',
  onCellClick,
  showDemoGuides = true,
}) => {
  const { timetableCells, demoStep } = useStore();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '9:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-1:00', // LUNCH row
    '2:00-3:00',
    '3:00-4:00',
    '4:00-5:00',
  ];

  // Colors dictionary mapping Tailwind classes
  const colorMap: { [key: string]: { border: string; bg: string; text: string; bgHover: string } } = {
    purple: {
      border: 'border-l-purple-500 border-purple-200 dark:border-purple-800',
      bg: 'bg-purple-50/70 dark:bg-purple-950/20',
      text: 'text-purple-700 dark:text-purple-300',
      bgHover: 'hover:bg-purple-100/80 dark:hover:bg-purple-900/20',
    },
    indigo: {
      border: 'border-l-indigo-500 border-indigo-200 dark:border-indigo-800',
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/20',
      text: 'text-indigo-700 dark:text-indigo-300',
      bgHover: 'hover:bg-indigo-100/80 dark:hover:bg-indigo-900/20',
    },
    emerald: {
      border: 'border-l-emerald-500 border-emerald-200 dark:border-emerald-800',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      bgHover: 'hover:bg-emerald-100/80 dark:hover:bg-emerald-900/20',
    },
    blue: {
      border: 'border-l-blue-500 border-blue-200 dark:border-blue-800',
      bg: 'bg-blue-50/70 dark:bg-blue-950/20',
      text: 'text-blue-700 dark:text-blue-300',
      bgHover: 'hover:bg-blue-100/80 dark:hover:bg-blue-900/20',
    },
  };

  const getCellClasses = (color: string) => {
    return colorMap[color] || colorMap.purple;
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse min-w-[800px] border border-border">
        {/* Table Head: Day Headers */}
        <thead>
          <tr className="bg-bg-elevated/60 text-xs font-bold text-text-secondary border-b border-border">
            <th className="p-3 w-28 text-center border-r border-border flex-shrink-0">
              <span className="flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-text-muted" /> Time Slot
              </span>
            </th>
            {days.map((day) => (
              <th key={day} className="p-3 text-center border-r border-border w-1/5 select-none font-bold text-sm">
                {day}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body: Time rows */}
        <tbody>
          {timeSlots.map((slot) => {
            const isLunch = slot === '12:00-1:00';

            return (
              <tr key={slot} className="border-b border-border min-h-[96px]">
                {/* Time slot indicator */}
                <td className="p-3 bg-bg-elevated/30 border-r border-border text-center text-xs font-mono font-bold text-text-secondary select-none">
                  {slot}
                </td>

                {/* Lunch Row - Spanned horizontally */}
                {isLunch ? (
                  <td colSpan={5} className="p-3 bg-bg-elevated/30 border-r border-border text-center select-none font-bold text-xs tracking-wider text-text-muted">
                    🥪 LUNCH BREAK (12:00 - 1:00 PM)
                  </td>
                ) : (
                  days.map((day) => {
                    // Match cells based on active criteria
                    const cell = timetableCells.find((c) => {
                      const matchesDay = c.day === day && c.timeSlot === slot;
                      if (!matchesDay) return false;
                      
                      // Filters
                      if (divisionFilter && c.divisionId !== divisionFilter) return false;
                      if (facultyFilter && c.facultyId !== facultyFilter) return false;
                      if (roomFilter && c.roomId !== roomFilter) return false;
                      
                      return true;
                    });

                    if (!cell) {
                      return (
                        <td key={day} className="p-2 border-r border-border bg-bg-primary/10 select-none text-center text-[10px] text-text-muted hover:bg-bg-elevated/20 transition-colors font-mono">
                          FREE
                        </td>
                      );
                    }

                    const theme = getCellClasses(cell.color);
                    
                    // Demo indicator check for Step 5
                    const isDemoHighlight = showDemoGuides && demoStep === 5 && day === 'Monday' && slot === '11:00-12:00';

                    return (
                      <td
                        key={day}
                        onClick={() => onCellClick && onCellClick(cell)}
                        className={`p-2 border-r border-border cursor-pointer align-top relative transition-all group select-none min-h-[100px]
                          ${theme.bg} ${theme.bgHover}
                          ${isDemoHighlight ? 'ring-4 ring-accent-ai shadow-ai animate-pulse-glow z-10' : ''}
                        `}
                      >
                        {/* Demo Highlight Pointer */}
                        {isDemoHighlight && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-ai text-white text-[10px] font-bold py-0.5 px-2 rounded-full shadow-lg z-20 flex items-center gap-1">
                            <span>👉</span> Click here to simulate absence
                          </span>
                        )}

                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className={`h-full flex flex-col justify-between border-l-4 ${theme.border} pl-2 py-0.5`}
                        >
                          <div>
                            {/* Subject Title */}
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-xs font-bold text-text-primary dark:text-white leading-tight">
                                {cell.subject}
                              </span>
                              <Badge variant="neutral" size="sm" className="scale-[0.8] origin-top-right uppercase">
                                {cell.divisionId}
                              </Badge>
                            </div>
                            
                            {/* Subject Code */}
                            <span className="text-[10px] font-bold text-text-muted mt-0.5 block font-mono">
                              {cell.subjectCode}
                            </span>
                          </div>

                          {/* Details Row: Faculty & Room */}
                          <div className="mt-3 space-y-1 text-[11px] text-text-secondary">
                            {/* Faculty name */}
                            <div className={`flex items-center gap-1.5 ${cell.isAbsentSimulated ? 'text-danger font-bold' : ''}`}>
                              <User className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                              <span className="truncate">{cell.facultyName}</span>
                            </div>

                            {/* Room */}
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                              <span>Room {cell.roomId}</span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Status overlays for Evaluator Demo */}
                        {cell.isAbsentSimulated && (
                          <div className="absolute inset-0 bg-red-50/90 dark:bg-red-950/90 border border-danger p-2 flex flex-col justify-center items-center text-center rounded">
                            <AlertCircle className="w-6 h-6 text-danger animate-pulse" />
                            <span className="text-[10px] font-bold text-danger uppercase mt-1">Absent</span>
                            <span className="text-[8px] text-danger-light mt-0.5 font-semibold">AI resolving...</span>
                          </div>
                        )}

                        {cell.isSubstituteApplied && (
                          <div className="absolute top-1.5 right-1.5 flex items-center bg-success-light text-success text-[10px] font-bold px-1.5 py-0.5 rounded border border-success-light dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 shadow-sm animate-float">
                            <CheckCircle className="w-3 h-3 mr-1" /> Verified
                          </div>
                        )}
                      </td>
                    );
                  })
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
