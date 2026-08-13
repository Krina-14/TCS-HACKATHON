import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import { useStore, AcademicEvent } from '../store/useStore';
import { Badge } from './Badge';

interface CalendarProps {
  className?: string;
  onAddEventClick?: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  className = '',
  onAddEventClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // Nov 2025 (Diwali break mock date)
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDayEvents, setSelectedDayEvents] = useState<AcademicEvent[]>([]);
  const { eventsList } = useStore();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Nov 2025 calculations
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Find events for a specific day string (format: YYYY-MM-DD)
  const getDayEvents = (dayNum: number, isCurrentMonth = true) => {
    if (!isCurrentMonth) return [];
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return eventsList.filter((event) => {
      // Event dates are in format YYYY-MM-DD
      return dateStr >= event.startDate && dateStr <= event.endDate;
    });
  };

  const handleDayClick = (dayNum: number) => {
    const evs = getDayEvents(dayNum);
    setSelectedDayEvents(evs);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Colors mapping for events
  const eventColorClasses: { [key: string]: string } = {
    Holiday: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-850',
    Hackathon: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-850',
    Exam: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-850',
    Workshop: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-850',
    Seminar: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-850',
    Maintenance: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-750',
  };

  // Render Calendar Grid Cells
  const renderCells = () => {
    const cells: React.ReactNode[] = [];

    // Prev month overflow cells
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayVal = prevMonthDays - i;
      cells.push(
        <div
          key={`prev-${dayVal}`}
          className="min-h-[90px] border border-border/40 p-2 bg-bg-elevated/20 text-text-muted text-xs select-none opacity-40"
        >
          {dayVal}
        </div>
      );
    }

    // Current month cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getDayEvents(day);
      cells.push(
        <div
          key={`curr-${day}`}
          onClick={() => handleDayClick(day)}
          className="min-h-[90px] border border-border p-2 hover:bg-bg-elevated/40 transition-colors cursor-pointer flex flex-col justify-between group relative"
        >
          <span className="text-xs font-bold text-text-secondary group-hover:text-primary dark:group-hover:text-white">
            {day}
          </span>

          <div className="flex flex-col gap-1 mt-1 flex-grow overflow-y-auto">
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border truncate ${
                  eventColorClasses[ev.type] || 'bg-slate-100 text-slate-700'
                }`}
                title={`${ev.title} (${ev.type})`}
              >
                {ev.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Next month overflow cells
    const totalSlots = cells.length;
    const nextMonthSlots = totalSlots % 7 === 0 ? 0 : 7 - (totalSlots % 7);
    for (let i = 1; i <= nextMonthSlots; i++) {
      cells.push(
        <div
          key={`next-${i}`}
          className="min-h-[90px] border border-border/40 p-2 bg-bg-elevated/20 text-text-muted text-xs select-none opacity-40"
        >
          {i}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Calendar Month Selector & Grid Area */}
      <div className="lg:col-span-3 bg-bg-card border border-border rounded-xl p-5 shadow-sm">
        {/* Calendar Header Control Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-light/10 text-primary-light dark:bg-blue-950/40 dark:text-blue-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary dark:text-white">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Tabs */}
            <div className="flex bg-bg-elevated p-1 rounded-lg mr-2">
              <button
                onClick={() => setViewMode('month')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'month' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'week' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Week Grid
              </button>
            </div>

            {/* Prev/Next chevrons */}
            <button
              onClick={handlePrevMonth}
              className="p-2 border border-border hover:bg-bg-elevated rounded-lg transition-colors text-text-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 border border-border hover:bg-bg-elevated rounded-lg transition-colors text-text-secondary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {onAddEventClick && (
              <button
                onClick={onAddEventClick}
                className="bg-primary text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary-light transition-colors ml-2"
              >
                + Add Event
              </button>
            )}
          </div>
        </div>

        {viewMode === 'month' ? (
          <div>
            {/* Day labels header */}
            <div className="grid grid-cols-7 text-center font-bold text-xs text-text-secondary bg-bg-elevated/40 py-2 border-b border-border mb-1">
              {daysOfWeek.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-1 bg-border/20 rounded-b-xl overflow-hidden">
              {renderCells()}
            </div>
          </div>
        ) : (
          /* Simplified Week View grid */
          <div className="border border-border rounded-xl p-4 bg-bg-elevated/10">
            <p className="text-xs font-semibold text-text-secondary mb-4 text-center">
              Weekly view display grid showing scheduled events across divisions.
            </p>
            <div className="grid grid-cols-5 gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                const dayEvents = eventsList.filter((e) => e.startDate.includes('2025')); // filter mock events
                return (
                  <div key={day} className="border border-border rounded-lg bg-bg-card p-3 min-h-[200px]">
                    <span className="text-xs font-bold text-text-primary block border-b border-border pb-1 mb-2">{day}</span>
                    <div className="space-y-2">
                      {dayEvents.map((ev) => (
                        <div key={ev.id} className={`p-2 rounded text-xs border ${eventColorClasses[ev.type]}`}>
                          <p className="font-bold truncate">{ev.title}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">{ev.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Side Detail panel: Day events */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
        <h4 className="font-bold text-sm text-text-primary dark:text-white border-b border-border pb-3 mb-4">
          Day Event Schedule
        </h4>
        
        {selectedDayEvents.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center text-text-muted py-12">
            <CalendarIcon className="w-8 h-8 opacity-40 mb-2" />
            <p className="text-xs font-medium">Click on a calendar date containing events to see scheduled details.</p>
          </div>
        ) : (
          <div className="flex-grow space-y-4 overflow-y-auto max-h-[350px]">
            {selectedDayEvents.map((ev) => (
              <div
                key={ev.id}
                className="border border-border rounded-xl p-4 bg-bg-elevated/20 flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-start gap-2">
                  <Badge variant={ev.type === 'Holiday' ? 'warning' : 'ai'} size="sm">
                    {ev.type}
                  </Badge>
                </div>
                <h5 className="font-bold text-xs text-text-primary leading-snug">{ev.title}</h5>
                <p className="text-[11px] text-text-secondary leading-relaxed">{ev.description}</p>
                <div className="space-y-1.5 pt-2 border-t border-border-light text-[10px] text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {ev.startDate} to {ev.endDate}
                    </span>
                  </div>
                  {ev.affectedDivisions.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Divisions: {ev.affectedDivisions.join(', ')}</span>
                    </div>
                  )}
                  {ev.affectedRooms.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Rooms: {ev.affectedRooms.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
