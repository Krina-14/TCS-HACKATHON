import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, User, Bell, AlertCircle, RefreshCw, Calendar, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export const StudentDashboard: React.FC = () => {
  const { isAbsenceSimulated, selectedSubstituteId } = useStore();
  const [countdown, setCountdown] = useState(35); // simulated minutes remaining

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 45));
    }, 60000); // decrement every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
          Good morning, Student 👋
        </h2>
        <p className="text-text-secondary text-sm mt-0.5">
          Here's your academic schedule for today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's lectures list */}
        <div className="lg:col-span-2 space-y-4">
          <Card header={{ title: "Today's Schedule", subtitle: "Semester 5 (Division IT-A)" }}>
            <div className="space-y-4 relative">
              {/* Vertical timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border -z-10" />

              {/* Lecture 1 (Completed) */}
              <div className="flex gap-4 items-start relative opacity-60">
                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center font-mono text-xs text-text-muted z-10 bg-bg-elevated">
                  1
                </div>
                <div className="flex-grow p-3 bg-bg-elevated/40 border border-border-light rounded-lg">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Python Programming</span>
                    <span className="font-mono text-text-muted">9:00 - 10:00 AM</span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1">Prof. Ananya Shah • Room B-204</p>
                </div>
              </div>

              {/* Lecture 2 (Current) */}
              <div className="flex gap-4 items-start relative">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-mono text-xs z-10">
                  2
                </div>
                <div className="flex-grow p-3 border-2 border-primary bg-bg-card rounded-lg shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-primary">Database Management</span>
                    <span className="font-mono text-text-secondary">10:00 - 11:00 AM</span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1">Dr. Vikram Sharma • Room B-204</p>
                  <Badge variant="success" size="sm" className="mt-2" showDot>Happening Now</Badge>
                </div>
              </div>

              {/* Lecture 3 (Upcoming - Demo substitution target) */}
              <div className="flex gap-4 items-start relative">
                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center font-mono text-xs text-text-secondary z-10 bg-bg-elevated">
                  3
                </div>
                <div className={`flex-grow p-3 border rounded-lg transition-all
                  ${selectedSubstituteId 
                    ? 'border-success bg-emerald-50/5' 
                    : isAbsenceSimulated 
                    ? 'border-danger bg-red-50/5' 
                    : 'border-border bg-bg-card'
                  }
                `}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Artificial Intelligence</span>
                    <span className="font-mono text-text-secondary">11:00 - 12:00 PM</span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1">
                    {selectedSubstituteId ? 'Prof. Ananya Shah (Substitute)' : 'Prof. Amit Mehta'} • Room B-204
                  </p>
                  
                  {selectedSubstituteId ? (
                    <Badge variant="success" size="sm" className="mt-2" showDot>Substitute Assigned</Badge>
                  ) : isAbsenceSimulated ? (
                    <Badge variant="danger" size="sm" className="mt-2 animate-pulse" showDot>Faculty Absent</Badge>
                  ) : (
                    <Badge variant="neutral" size="sm" className="mt-2">Upcoming</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-6">
          {/* Current status countdown */}
          <Card header={{ title: 'Current Session Status' }} className="text-center p-6 border-l-4 border-l-info">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Time Remaining</span>
            <span className="text-3xl font-extrabold text-info font-mono mt-2 block">{countdown}m</span>
            <p className="text-[10px] text-text-secondary mt-2">Currently attending Database Management in Room B-204.</p>
          </Card>

          {/* Announcements & alerts */}
          <Card header={{ title: 'Notifications & Alerts' }}>
            <div className="space-y-3">
              {/* Substitution alert */}
              {selectedSubstituteId && (
                <div className="p-3 border-l-4 border-l-accent-ai border border-border bg-purple-50/5 rounded-r-lg text-xs leading-relaxed">
                  <p className="font-bold text-accent-ai">Substitution Alert</p>
                  <p className="text-text-secondary mt-1">Your 11:00 AM AI lecture will be conducted by **Prof. Ananya Shah** today. Schedule remains unchanged.</p>
                </div>
              )}

              <div className="p-3 border-l-4 border-l-info border border-border bg-blue-50/5 rounded-r-lg text-xs">
                <p className="font-bold text-info">Exam Registration</p>
                <p className="text-text-secondary mt-1">Odd Semester examinations registrations are open on settings page.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
