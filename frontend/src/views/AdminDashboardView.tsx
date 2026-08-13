import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Layers, BookOpen, DoorOpen, Calendar, Clock, AlertTriangle, RefreshCw, 
  Sparkles, ShieldCheck, ArrowRight, Play, UserPlus, Sliders, CalendarDays, CheckCircle 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Timeline } from '../components/Timeline';

export const AdminDashboardView: React.FC = () => {
  const { 
    setView, 
    setDemoStep, 
    demoStep, 
    isAbsenceSimulated, 
    timetableCells, 
    simulateAbsence,
    setView: changeView
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'running' | 'pending' | 'absent'>('all');

  const handleGenerateClick = () => {
    setView('generator');
    setDemoStep(3); // Advance to Generator View
  };

  const handleSimulateAbsence = () => {
    // Locate the cells for Amit Mehta IT-A AI (m3) and trigger
    simulateAbsence('m3');
  };

  const handleFindSubstitute = () => {
    setView('substitute-matching');
    setDemoStep(7); // Trigger Find Substitute
  };

  // Mock timeline events
  const timelineItems = [
    {
      id: 't-1',
      title: isAbsenceSimulated ? 'Prof. Amit Mehta marked absent' : 'Room conflict resolved automatically',
      subtitle: isAbsenceSimulated ? 'AI optimization recommended Prof. Shah' : 'IT-C class shifted from Room B-204 to Room B-202',
      time: '2 mins ago',
      state: 'active' as const,
      icon: isAbsenceSimulated ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />,
    },
    {
      id: 't-2',
      title: 'Timetable Version 3 generated',
      subtitle: 'Published by AI Optimizer Engine',
      time: '1 hour ago',
      state: 'completed' as const,
    },
    {
      id: 't-3',
      title: 'Lab 2 maintenance scheduled',
      subtitle: 'Shifted Wednesday practicals to Lab 1',
      time: '3 hours ago',
      state: 'completed' as const,
    },
  ];

  return (
    <div className="space-y-8 select-none font-sans">
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary-light to-accent-ai bg-clip-text text-transparent">
            Good morning, Admin 👋
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            Here's what's happening with your academic schedule today.
          </p>
        </div>

        {/* Demo Helper Tip for evaluators */}
        {demoStep === 2 && (
          <div className="bg-purple-100 border border-purple-200 rounded-xl p-3.5 text-xs text-accent-ai dark:bg-purple-950/40 dark:border-purple-900 shadow-sm flex items-center gap-3 animate-float max-w-sm">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-bold">Evaluator Guide - Step 2</p>
              <p className="text-text-secondary dark:text-slate-400 mt-0.5">Click "Generate Timetable" in the quick actions to test the AI generator.</p>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Faculty" value={48} icon={<Users className="w-5 h-5" />} trend={{ value: '↑ 3 new', type: 'up' }} sparklineData={[42, 45, 45, 48, 48]} />
        <StatCard label="Total Divisions" value={18} icon={<Layers className="w-5 h-5" />} trend={{ value: 'Stable', type: 'neutral' }} />
        <StatCard label="Total Subjects" value={72} icon={<BookOpen className="w-5 h-5" />} />
        <StatCard label="Rooms & Labs" value={35} icon={<DoorOpen className="w-5 h-5" />} />
        <StatCard label="Today's Lectures" value={126} icon={<Clock className="w-5 h-5" />} />
        <StatCard label="Faculty Available" value="41/48" icon={<CheckCircle className="w-5 h-5" />} trend={{ value: '85.4%', type: 'up' }} />
        <StatCard label="Active Substitutions" value={isAbsenceSimulated ? 1 : 0} icon={<RefreshCw className="w-5 h-5" />} trend={isAbsenceSimulated ? { value: 'Active', type: 'down' } : undefined} />
        <StatCard label="Scheduling Conflicts" value={2} icon={<AlertTriangle className="w-5 h-5" />} trend={{ value: '2 unresolved', type: 'down' }} />
      </div>

      {/* Timetable Health Score and Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Circular gauge */}
        <Card variant="elevated" className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-8 justify-around">
          <div className="text-center sm:text-left">
            <Badge variant="ai" className="mb-3 animate-pulse-glow" showDot>AI Insights</Badge>
            <h3 className="text-xl font-bold text-text-primary dark:text-white">Timetable Health Score</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-xs">Your current scheduling parameters are performing excellently. Utilization is highly optimized.</p>
            
            {/* Breakdown bars */}
            <div className="mt-5 space-y-2.5 w-60">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                  <span>Faculty Utilization</span>
                  <span>91%</span>
                </div>
                <ProgressBar value={91} color="success" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                  <span>Room Utilization</span>
                  <span>95%</span>
                </div>
                <ProgressBar value={95} color="success" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                  <span>Student Comfort</span>
                  <span>89%</span>
                </div>
                <ProgressBar value={89} color="warning" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <ProgressBar value={94} variant="circular" size={130} strokeWidth={10} showLabel color="success" />
            <span className="text-xs font-bold text-text-muted mt-3">Health Status: Stable</span>
          </div>
        </Card>

        {/* Quick Actions Panel */}
        <Card header={{ title: 'Quick Actions', subtitle: 'Academic administrator short links' }}>
          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={handleGenerateClick}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-accent-ai hover:bg-purple-50/20 dark:hover:bg-purple-950/10 transition-colors text-center"
            >
              <Sparkles className="w-6 h-6 text-accent-ai mb-2" />
              <span className="text-xs font-bold text-text-primary">Generate Timetable</span>
            </button>
            <button
              onClick={() => changeView('faculty-list')}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-primary-light hover:bg-blue-50/20 dark:hover:bg-slate-800 transition-colors text-center"
            >
              <UserPlus className="w-6 h-6 text-primary-light mb-2" />
              <span className="text-xs font-bold text-text-primary">Add Faculty</span>
            </button>
            <button
              onClick={() => changeView('events')}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-warning hover:bg-amber-50/20 dark:hover:bg-slate-800 transition-colors text-center"
            >
              <CalendarDays className="w-6 h-6 text-warning mb-2" />
              <span className="text-xs font-bold text-text-primary">Mark Holiday</span>
            </button>
            <button
              onClick={() => changeView('what-if')}
              className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-info hover:bg-blue-50/20 dark:hover:bg-slate-800 transition-colors text-center"
            >
              <Sliders className="w-6 h-6 text-info mb-2" />
              <span className="text-xs font-bold text-text-primary">Run Simulation</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Live status listing & recent logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live lecture grid status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
              <h3 className="font-bold text-base text-text-primary dark:text-white">Live Scheduling Status</h3>
            </div>
            
            {/* Filter buttons */}
            <div className="flex bg-bg-elevated p-0.5 rounded text-[11px] font-semibold text-text-secondary">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${activeFilter === 'all' ? 'bg-bg-card text-text-primary' : ''}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter('running')}
                className={`px-2.5 py-1 rounded transition-colors ${activeFilter === 'running' ? 'bg-bg-card text-text-primary' : ''}`}
              >
                Running
              </button>
              <button 
                onClick={() => setActiveFilter('absent')}
                className={`px-2.5 py-1 rounded transition-colors ${activeFilter === 'absent' ? 'bg-bg-card text-text-primary' : ''}`}
              >
                Absent
              </button>
            </div>
          </div>

          {/* Cards for live lectures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cell card 1 */}
            {(!isAbsenceSimulated && activeFilter !== 'absent') && (
              <Card 
                padding="compact" 
                className="relative border-l-4 border-l-purple-500 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="neutral" size="sm">IT-A</Badge>
                    <span className="text-[10px] text-text-muted font-mono ml-2">9:00 - 10:00</span>
                  </div>
                  <Badge variant="success" size="sm">Running</Badge>
                </div>
                <div className="mt-3">
                  <p className="font-bold text-xs text-text-primary">Python Programming</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Prof. Ananya Shah • Room B-204</p>
                </div>
              </Card>
            )}

            {/* Simulated Absent Cell Card (Prof Mehta) */}
            {(activeFilter !== 'running') && (
              <Card 
                padding="compact" 
                className={`relative flex flex-col justify-between min-h-[140px] border transition-all duration-normal
                  ${isAbsenceSimulated 
                    ? 'border-danger border-l-4 border-l-danger bg-red-50/10' 
                    : 'border-l-4 border-l-indigo-500 hover:shadow-md'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="neutral" size="sm">IT-A</Badge>
                    <span className="text-[10px] text-text-muted font-mono ml-2">11:00 - 12:00</span>
                  </div>
                  {isAbsenceSimulated ? (
                    <Badge variant="danger" size="sm" showDot className="animate-pulse">Faculty Absent</Badge>
                  ) : (
                    <Badge variant="info" size="sm">Pending</Badge>
                  )}
                </div>
                
                <div className="mt-3">
                  <p className="font-bold text-xs text-text-primary">Artificial Intelligence</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Prof. Amit Mehta • Room B-204</p>
                  {isAbsenceSimulated && (
                    <p className="text-[9px] text-danger font-bold mt-1 animate-pulse">
                      ⚠️ AI searching for best replacement...
                    </p>
                  )}
                </div>

                {/* Simulated Absence triggers */}
                {!isAbsenceSimulated ? (
                  <button
                    onClick={handleSimulateAbsence}
                    className="absolute inset-0 bg-primary-dark/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold text-white rounded transition-opacity"
                  >
                    Simulate Absence
                  </button>
                ) : (
                  <button
                    onClick={handleFindSubstitute}
                    className="absolute inset-0 bg-accent-ai/90 flex items-center justify-center text-xs font-bold text-white rounded animate-pulse-glow"
                  >
                    ⚡ Find Substitute
                  </button>
                )}
              </Card>
            )}

            {/* Cell card 3 */}
            {(activeFilter !== 'absent') && (
              <Card 
                padding="compact" 
                className="relative border-l-4 border-l-emerald-500 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="neutral" size="sm">CSE-A</Badge>
                    <span className="text-[10px] text-text-muted font-mono ml-2">9:00 - 10:00</span>
                  </div>
                  <Badge variant="success" size="sm">Running</Badge>
                </div>
                <div className="mt-3">
                  <p className="font-bold text-xs text-text-primary">Computer Networks</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Prof. Neha Joshi • Room C-101</p>
                </div>
              </Card>
            )}

            {/* Cell card 4 */}
            {(activeFilter !== 'absent') && (
              <Card 
                padding="compact" 
                className="relative border-l-4 border-l-blue-500 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="neutral" size="sm">IT-B</Badge>
                    <span className="text-[10px] text-text-muted font-mono ml-2">10:00 - 11:00</span>
                  </div>
                  <Badge variant="success" size="sm">Running</Badge>
                </div>
                <div className="mt-3">
                  <p className="font-bold text-xs text-text-primary">Database Management</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Dr. Vikram Sharma • Room B-202</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Recent timeline events */}
        <Card header={{ title: 'Recent Activities', subtitle: 'Live updates from optimization logs' }}>
          <Timeline items={timelineItems} />
        </Card>
      </div>
    </div>
  );
};
