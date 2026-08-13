import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Check, X, ShieldAlert, Sparkles, PieChart, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';

export const FacultyDashboard: React.FC = () => {
  const { facultyList } = useStore();
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  
  // Timer for request countdown (4:59)
  const [timeLeft, setTimeLeft] = useState(299); // 5 minutes in seconds
  const [requestStatus, setRequestStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');

  useEffect(() => {
    if (requestStatus !== 'pending') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRequestStatus('declined');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [requestStatus]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAccept = () => {
    setRequestStatus('accepted');
  };

  const handleDecline = () => {
    setRequestStatus('declined');
  };

  // Find Shah's profile (current logged faculty in this dashboard view)
  const facProfile = facultyList.find(f => f.id === 'FAC-2023-014') || facultyList[0];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Good morning, {facProfile.name} 👋
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Manage your teaching schedule and availability status today.
          </p>
        </div>

        {/* Quick status toggle */}
        <div className="flex items-center gap-3 bg-bg-card border border-border px-4 py-2 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-text-secondary uppercase">Available for substitutions today:</span>
          <button
            onClick={() => setIsAvailableToday(!isAvailableToday)}
            className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none
              ${isAvailableToday ? 'bg-success' : 'bg-border dark:bg-slate-700'}
            `}
          >
            <motion.div
              animate={{ x: isAvailableToday ? '16px' : '0px' }}
              className="w-5 h-5 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's lectures and workload */}
        <div className="lg:col-span-2 space-y-6">
          <Card header={{ title: "Your Schedule Today", subtitle: "Semester 5 Odd Curriculum" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Lecture 1 */}
              <Card padding="compact" className="border-l-4 border-l-purple-500 bg-purple-50/5">
                <div className="flex justify-between items-center text-xs">
                  <Badge variant="neutral" size="sm">IT-A</Badge>
                  <span className="font-mono text-text-muted">9:00 - 10:00 AM</span>
                </div>
                <h4 className="font-bold text-xs text-text-primary mt-2">Python Programming</h4>
                <p className="text-[10px] text-text-secondary mt-1">Room B-204 • Completed</p>
              </Card>

              {/* Lecture 2 */}
              <Card padding="compact" className="border-l-4 border-l-indigo-500">
                <div className="flex justify-between items-center text-xs">
                  <Badge variant="neutral" size="sm">IT-A</Badge>
                  <span className="font-mono text-text-muted">2:00 - 3:00 PM</span>
                </div>
                <h4 className="font-bold text-xs text-text-primary mt-2">Machine Learning Lab</h4>
                <p className="text-[10px] text-text-secondary mt-1">Lab-1 • Upcoming</p>
              </Card>
            </div>
          </Card>

          {/* Workload breakdown widget */}
          <Card header={{ title: 'Weekly Workload Mappings', subtitle: 'Target: 20 hours maximum' }} className="flex flex-col sm:flex-row items-center justify-around gap-6 py-8">
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-sm text-text-primary">16 / 20 hours assigned</h4>
              <p className="text-xs text-text-secondary mt-1">Syllabus delivery is running on track. 4 free hours remaining.</p>
            </div>
            <ProgressBar value={16} max={20} variant="circular" size={90} strokeWidth={8} showLabel color="success" />
          </Card>
        </div>

        {/* Right side widgets: substitution requests */}
        <div className="space-y-6">
          {/* Priority substitute request */}
          {requestStatus !== 'declined' ? (
            <Card 
              className="border-l-4 border-l-accent-ai shadow-lg ring-2 ring-accent-ai" 
              header={{ 
                title: (
                  <div className="flex items-center gap-1.5 text-accent-ai">
                    <Sparkles className="w-4 h-4" /> Substitution Request
                  </div>
                ) 
              }}
            >
              {requestStatus === 'pending' ? (
                <div className="space-y-4">
                  <div className="text-xs text-text-secondary leading-relaxed">
                    <p className="font-bold text-text-primary">DBMS, IT-B (Semester 5)</p>
                    <p className="mt-1">Hour: 2:00 - 3:00 PM • Room B-202</p>
                    <p className="text-[10px] text-text-muted mt-2">Requested by: HOD IT Department</p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/40 p-3 rounded-lg flex items-center justify-between text-xs text-danger font-bold">
                    <span className="flex items-center gap-1.5">🕒 Auto-decline:</span>
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 border-t border-border-light pt-3">
                    <button
                      onClick={handleDecline}
                      className="text-xs font-bold text-danger bg-danger-light px-3 py-1.5 rounded transition-all"
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleAccept}
                      className="text-xs font-bold text-white bg-primary px-3 py-1.5 rounded shadow-sm transition-all"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ) : (
                /* Accepted view */
                <div className="text-center py-4 space-y-2">
                  <Check className="w-8 h-8 text-success mx-auto bg-success-light rounded-full p-1 animate-scale" />
                  <p className="text-xs font-bold text-text-primary">Request Accepted Successfully</p>
                  <p className="text-[10px] text-text-secondary">Class added to your personal timetable schedule.</p>
                </div>
              )}
            </Card>
          ) : (
            /* Declined / Cancelled slot state */
            <Card className="opacity-75">
              <div className="text-center py-4 space-y-1.5 text-text-muted">
                <ShieldAlert className="w-8 h-8 mx-auto" />
                <p className="text-xs font-bold">Substitution Request Expired</p>
                <p className="text-[10px]">AI has automatically reassigned the request to the next best match (Prof. Patel).</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
