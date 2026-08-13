import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Sparkles, Calendar, BookOpen, User, RefreshCw, Layers } from 'lucide-react';

export const ExamView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'wizard'>('schedule');
  const [isGenerating, setIsGenerating] = useState(false);
  const [exams, setExams] = useState([
    { id: 'ex-1', name: 'AI midterm exam', subject: 'Artificial Intelligence', date: '2026-10-12', time: '10:00 - 12:00 PM', room: 'B-204', invigilator: 'Prof. Ananya Shah', status: 'Assigned' },
    { id: 'ex-2', name: 'DBMS mid-sem', subject: 'Database Management', date: '2026-10-13', time: '10:00 - 12:00 PM', room: 'B-202', invigilator: 'Prof. Amit Mehta', status: 'Assigned' },
  ]);

  const handleAutoSchedule = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setExams([
        ...exams,
        { id: 'ex-3', name: 'Python Practical Viva', subject: 'Python Programming', date: '2026-10-14', time: '2:00 - 4:00 PM', room: 'Lab-1', invigilator: 'Dr. Vikram Sharma', status: 'Assigned' }
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-accent-ai" /> Exam Scheduling
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Auto-generate examination timetables and invigilation schedules.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 text-sm font-semibold select-none">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 px-1 transition-colors relative focus:outline-none
            ${activeTab === 'schedule' ? 'text-accent-ai font-bold' : 'text-text-secondary hover:text-text-primary'}
          `}
        >
          Active Exam Schedules
        </button>
        <button
          onClick={() => setActiveTab('wizard')}
          className={`pb-3 px-1 transition-colors relative focus:outline-none
            ${activeTab === 'wizard' ? 'text-accent-ai font-bold' : 'text-text-secondary hover:text-text-primary'}
          `}
        >
          Create Exam Wizard
        </button>
      </div>

      {activeTab === 'schedule' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Schedule table list */}
          <div className="lg:col-span-2 space-y-4">
            <Card header={{ title: 'Invigilator & Location Duty Log', subtitle: 'List of scheduled examinations' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-bg-elevated/40 border-b border-border text-xs font-bold text-text-secondary uppercase">
                      <th className="p-3">Exam Description</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Room</th>
                      <th className="p-3">Assigned Invigilator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-text-secondary">
                    {exams.map((ex) => (
                      <tr key={ex.id} className="hover:bg-bg-elevated/10">
                        <td className="p-3 font-bold text-text-primary">{ex.name}</td>
                        <td className="p-3 font-mono">{ex.date} ({ex.time})</td>
                        <td className="p-3 font-semibold">{ex.room}</td>
                        <td className="p-3">{ex.invigilator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right column: Auto schedule actions */}
          <div className="space-y-6">
            <Card header={{ title: 'AI Exam Auto-Scheduler', subtitle: 'Generate exam slots automatically' }} className="border-l-4 border-l-accent-ai ring-2 ring-accent-ai">
              <p className="text-xs text-text-secondary leading-relaxed mb-4">Click below to parse syllabus structures, verify room availability limits, and assign invigilation duties without clashes.</p>
              
              <Button
                variant="ai"
                className="w-full"
                onClick={handleAutoSchedule}
                isLoading={isGenerating}
                leftIcon={<Sparkles className="w-4 h-4 animate-pulse" />}
              >
                Auto-Schedule Exams
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        /* Wizard Mockup */
        <Card header={{ title: 'Exam Scheduler Parameters', subtitle: 'Define dates and departments' }}>
          <div className="space-y-4 max-w-xl text-xs text-text-secondary">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Start Date</label>
                <input type="date" className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-2">End Date</label>
                <input type="date" className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary" />
              </div>
            </div>
            <div className="pt-4 border-t border-border flex justify-end">
              <Button variant="primary">Proceed to Invigilation Assignment</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
