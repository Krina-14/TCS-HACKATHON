import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Download, Printer, Filter, X, Clock, MapPin, 
  User, RefreshCw, AlertTriangle, AlertCircle, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { useStore, TimetableCell } from '../store/useStore';
import { TimetableGrid } from '../components/TimetableGrid';
import { Drawer } from '../components/Drawer';
import { Badge } from '../components/Badge';

export const TimetableView: React.FC = () => {
  const { 
    selectedTimetableCell, 
    setSelectedCell, 
    demoStep, 
    setDemoStep, 
    simulateAbsence, 
    isAbsenceSimulated, 
    setView,
    facultyList
  } = useStore();

  const [divisionFilter, setDivisionFilter] = useState('IT-A');
  const [activeTab, setActiveTab] = useState<'week' | 'day' | 'faculty' | 'room'>('week');
  const [selectedDept, setSelectedDept] = useState('IT');

  const handleCellClick = (cell: TimetableCell) => {
    setSelectedCell(cell);
  };

  const handleDrawerClose = () => {
    setSelectedCell(null);
  };

  const handleAbsenceClick = () => {
    if (selectedTimetableCell) {
      simulateAbsence(selectedTimetableCell.id);
      setDemoStep(6); // Set demo step to absence simulated
    }
  };

  const handleTriggerSubstituteWorkflow = () => {
    setSelectedCell(null);
    setView('substitute-matching');
    setDemoStep(7); // Trigger search
  };

  // Find faculty status
  const currentCellFaculty = selectedTimetableCell 
    ? facultyList.find(f => f.id === selectedTimetableCell.facultyId)
    : null;

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Weekly Timetable
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Monitor class distribution and adjust scheduling blocks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-bold text-text-secondary hover:bg-bg-elevated transition-colors bg-bg-card">
            <Download className="w-4 h-4" /> Export ICS
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-bold text-text-secondary hover:bg-bg-elevated transition-colors bg-bg-card">
            <Printer className="w-4 h-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* Guide Banner for step 5 & 6 */}
      {showDemoBanner(demoStep, isAbsenceSimulated) && (
        <div className="bg-purple-100 border border-purple-200 rounded-xl p-4 text-xs text-accent-ai dark:bg-purple-950/40 dark:border-purple-900 shadow-sm flex items-center gap-3 animate-float">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-bold">Evaluator Guide - {demoStep === 5 ? 'Step 5' : 'Step 6'}</p>
            <p className="text-text-secondary dark:text-slate-400 mt-0.5">
              {demoStep === 5 
                ? 'Click on the Monday 11:00 - 12:00 Artificial Intelligence cell (conducted by Prof. Mehta) to review its scheduling parameters.'
                : 'Prof. Mehta is now marked absent! In the cell details drawer, click "Find Best Substitute" to test our matching algorithm.'}
            </p>
          </div>
        </div>
      )}

      {/* Grid Filters Bar */}
      <div className="bg-bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Department Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-secondary uppercase">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-8 border border-border bg-transparent rounded-lg text-xs text-text-primary focus:border-accent-ai focus:ring-accent-ai py-0 pl-2 pr-8"
            >
              <option value="IT">IT</option>
              <option value="CS">CSE</option>
            </select>
          </div>

          {/* Division Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-secondary uppercase">Class:</span>
            <div className="flex bg-bg-elevated p-0.5 rounded-lg border border-border-light text-[11px] font-bold">
              {['IT-A', 'IT-B', 'IT-C', 'CSE-A'].map((div) => (
                <button
                  key={div}
                  onClick={() => setDivisionFilter(div)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    divisionFilter === div ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode Selection Tabs */}
        <div className="flex bg-bg-elevated p-1 rounded-lg border border-border-light text-xs font-semibold">
          <button
            onClick={() => setActiveTab('week')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'week' ? 'bg-bg-card text-text-primary shadow-sm font-bold' : 'text-text-secondary'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setActiveTab('day')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'day' ? 'bg-bg-card text-text-primary shadow-sm font-bold' : 'text-text-secondary'
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'faculty' ? 'bg-bg-card text-text-primary shadow-sm font-bold' : 'text-text-secondary'
            }`}
          >
            Faculty View
          </button>
          <button
            onClick={() => setActiveTab('room')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'room' ? 'bg-bg-card text-text-primary shadow-sm font-bold' : 'text-text-secondary'
            }`}
          >
            Room View
          </button>
        </div>
      </div>

      {/* Main Grid display area */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-md">
        {activeTab === 'week' ? (
          <TimetableGrid
            divisionFilter={divisionFilter}
            onCellClick={handleCellClick}
          />
        ) : (
          <div className="py-12 text-center text-text-secondary flex flex-col justify-center items-center">
            <CalendarIcon className="w-10 h-10 opacity-30 mb-2" />
            <p className="text-sm font-medium">Alternative view layouts display configured schedules dynamically.</p>
            <button
              onClick={() => setActiveTab('week')}
              className="text-xs font-bold text-accent-ai mt-3 bg-purple-50 dark:bg-purple-950/20 px-3 py-1.5 rounded-lg"
            >
              Switch back to Weekly Grid
            </button>
          </div>
        )}
      </div>

      {/* Detail Slide-out Drawer */}
      <Drawer
        isOpen={!!selectedTimetableCell}
        onClose={handleDrawerClose}
        title={selectedTimetableCell ? `${selectedTimetableCell.subject}` : 'Class Details'}
      >
        {selectedTimetableCell && (
          <div className="space-y-6">
            {/* Header Subject Info */}
            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-text-muted">{selectedTimetableCell.subjectCode}</span>
                <Badge variant="neutral" size="sm">IT-A (Semester 5)</Badge>
              </div>
              <h4 className="font-extrabold text-lg text-text-primary dark:text-white leading-snug">
                {selectedTimetableCell.subject}
              </h4>
            </div>

            {/* Time and location details */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-text-muted flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-text-primary dark:text-white">Day & Time slot</p>
                  <p className="text-[10px] mt-0.5">{selectedTimetableCell.day} • {selectedTimetableCell.timeSlot}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-text-muted flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-text-primary dark:text-white">Assigned Location</p>
                  <p className="text-[10px] mt-0.5">Room {selectedTimetableCell.roomId} (Building B, Floor 2)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-text-muted flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-text-primary dark:text-white">Assigned Faculty</p>
                  <p className="text-[10px] mt-0.5">{selectedTimetableCell.facultyName} (Designation: HOD)</p>
                </div>
              </div>
            </div>

            {/* Status alerts */}
            {selectedTimetableCell.isAbsentSimulated ? (
              <div className="bg-red-50 border border-danger p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-danger">🚨 FACULTY MARKED ABSENT</p>
                  <p className="text-text-secondary mt-1">This class will be cancelled unless a substitute is selected. Click the button below to solve this.</p>
                </div>
              </div>
            ) : selectedTimetableCell.isSubstituteApplied ? (
              <div className="bg-success-light border border-success-light p-4 rounded-xl flex items-start gap-3 dark:bg-emerald-950/20 dark:border-emerald-800">
                <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-success">🟢 SUBSTITUTION ACTIVE</p>
                  <p className="text-text-secondary mt-1">Prof. Ananya Shah is successfully assigned. Schedule preserved.</p>
                </div>
              </div>
            ) : null}

            {/* Actions for Demo flow */}
            <div className="pt-6 border-t border-border flex flex-col gap-3">
              {/* If no absence has been simulated on this cell */}
              {!selectedTimetableCell.isAbsentSimulated && !selectedTimetableCell.isSubstituteApplied && (
                <button
                  onClick={handleAbsenceClick}
                  className="w-full bg-danger text-white text-xs font-bold py-3 rounded-lg hover:bg-opacity-95 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  ⚠️ Simulate Faculty Absence
                </button>
              )}

              {/* If absence is simulated */}
              {selectedTimetableCell.isAbsentSimulated && (
                <button
                  onClick={handleTriggerSubstituteWorkflow}
                  className="w-full bg-gradient-to-r from-accent-ai to-primary-light text-white text-xs font-bold py-3 rounded-lg shadow-ai animate-pulse-glow active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  ⚡ Find Best Substitute
                </button>
              )}

              <button
                onClick={handleDrawerClose}
                className="w-full border border-border text-text-secondary text-xs font-bold py-2.5 rounded-lg hover:bg-bg-elevated"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

// Helper for conditional guide banner rendering
const showDemoBanner = (step: number, absent: boolean) => {
  if (step === 5 && !absent) return true;
  if (step === 6 && absent) return true;
  return false;
};
