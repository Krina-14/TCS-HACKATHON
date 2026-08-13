import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Star, Minus, BookOpen, Layers, CheckCircle2, ChevronRight, Sliders } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Drawer } from '../components/Drawer';

export const AvailabilityView: React.FC = () => {
  const { facultyList } = useStore();
  const [selectedFacId, setSelectedFacId] = useState('FAC-2023-014');
  const [bulkDrawerOpen, setBulkDrawerOpen] = useState(false);

  // Requests state
  const [requests, setRequests] = useState([
    { id: 'req-1', name: 'Dr. Vikram Sharma', desc: 'Requests Wednesday off next week for a research conference.', date: 'Next Wednesday', status: 'pending' },
    { id: 'req-2', name: 'Prof. Neha Joshi', desc: 'Requests morning slots on Fridays to attend Ph.D. review board.', date: 'Fridays', status: 'pending' },
  ]);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleDecline = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'declined' } : r));
  };

  const selectedFac = facultyList.find(f => f.id === selectedFacId) || facultyList[0];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = Array.from({ length: 8 });

  // Grid Cell state styling
  const stateClasses = {
    available: 'bg-emerald-50 border-emerald-200 text-success dark:bg-emerald-950/20 dark:border-emerald-800',
    unavailable: 'bg-red-50 border-red-200 text-danger pattern-stripes dark:bg-red-950/20 dark:border-red-800',
    preferred: 'bg-purple-50 border-purple-200 text-accent-ai pattern-dots dark:bg-purple-950/20 dark:border-purple-800',
    optional: 'bg-slate-50 border-border text-text-muted dark:bg-slate-800/40 dark:border-slate-700',
    booked: 'bg-primary/10 border-primary text-primary font-bold dark:bg-blue-950/30 dark:border-blue-800',
  };

  const stateIcons = {
    available: <Check className="w-4 h-4 mx-auto" />,
    unavailable: <X className="w-4 h-4 mx-auto" />,
    preferred: <Star className="w-4 h-4 mx-auto fill-current" />,
    optional: <Minus className="w-4 h-4 mx-auto" />,
    booked: <BookOpen className="w-4 h-4 mx-auto" />,
  };

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Faculty Availability Grid
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Configure calendar preferences and approve override requests.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setBulkDrawerOpen(true)}>
          Bulk Update Status
        </Button>
      </div>

      {/* Grid Display Card */}
      <Card 
        header={{ 
          title: 'Weekly Preferences Scheduler', 
          subtitle: 'Select faculty member to review specific schedule mappings',
          action: (
            <select
              value={selectedFacId}
              onChange={(e) => setSelectedFacId(e.target.value)}
              className="h-9 border border-border bg-bg-card rounded-lg text-xs text-text-primary focus:border-accent-ai focus:ring-accent-ai pl-2 pr-8"
            >
              {facultyList.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          )
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-center border border-border border-collapse text-xs">
            <thead>
              <tr className="bg-bg-elevated/40 border-b border-border text-xs font-bold text-text-secondary uppercase">
                <th className="p-3 border-r border-border text-left w-24">Day</th>
                {periods.map((_, idx) => (
                  <th key={idx} className="p-3 border-r border-border font-mono w-24">
                    Period {idx + 1}<br/>
                    <span className="text-[9px] text-text-muted font-normal">
                      {idx + 9 === 12 ? '12:00-1:00' : idx + 9 === 13 ? '1:00-2:00' : `${idx+9}:00-${idx+10}:00`}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const slots = selectedFac.availability[day] || Array.from({ length: 8 }).map(() => 'available');
                return (
                  <tr key={day} className="border-b border-border">
                    <td className="p-3 bg-bg-elevated/20 font-bold border-r border-border text-text-primary text-left">{day}</td>
                    {slots.map((st: any, idx) => {
                      const computedState = idx === 3 ? 'optional' : idx === 1 ? 'booked' : st;
                      return (
                        <td key={idx} className={`p-4 border-r border-border border-dashed transition-colors ${stateClasses[computedState as keyof typeof stateClasses]}`}>
                          {stateIcons[computedState as keyof typeof stateIcons]}
                          <span className="text-[9px] block mt-1.5 font-semibold capitalize tracking-wider">{computedState}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 items-center border-t border-border pt-4 text-[10px] uppercase font-bold text-text-secondary">
          <span className="text-text-muted">Legend:</span>
          <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded bg-red-50 border border-red-200 pattern-stripes" /> Unavailable</span>
          <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded bg-purple-50 border border-purple-200 pattern-dots" /> Preferred</span>
          <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded bg-slate-50 border border-border" /> Optional</span>
          <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded bg-primary/10 border border-primary" /> Booked Class</span>
        </div>
      </Card>

      {/* Requests approval section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={{ title: 'Pending Leave Override Requests', subtitle: 'Requires HOD / Administrator approval' }}>
          <div className="space-y-4">
            {requests.filter(r => r.status === 'pending').map((req) => (
              <div key={req.id} className="p-4 border border-border rounded-xl bg-bg-card flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-text-primary">{req.name}</h4>
                    <span className="text-[10px] text-text-muted font-bold font-mono">{req.date}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{req.desc}</p>
                </div>
                <div className="flex justify-end gap-2 border-t border-border-light pt-3">
                  <button 
                    onClick={() => handleDecline(req.id)}
                    className="text-xs font-bold text-danger bg-danger-light px-3 py-1.5 rounded transition-all active:scale-95"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => handleApprove(req.id)}
                    className="text-xs font-bold text-white bg-primary px-3 py-1.5 rounded transition-all active:scale-95"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}

            {requests.filter(r => r.status === 'pending').length === 0 && (
              <div className="py-8 text-center text-text-muted text-xs">
                All requests reviewed. No pending overrides.
              </div>
            )}
          </div>
        </Card>

        {/* Aggregate Availability Heatmap preview */}
        <Card header={{ title: 'Aggregate Department Staff Heatmap', subtitle: 'Indicates total count of free professors per slot' }}>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
            {days.map((day) => (
              <div key={day} className="space-y-1.5">
                <span className="text-text-muted uppercase text-[9px]">{day.substring(0,3)}</span>
                {Array.from({ length: 4 }).map((_, idx) => {
                  const count = 12 - (idx * 2) - (day.length % 3);
                  return (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded text-white border border-white/5 font-mono
                        ${count > 10 ? 'bg-emerald-600' : count > 6 ? 'bg-emerald-500' : 'bg-emerald-400'}
                      `}
                    >
                      {count}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] text-text-muted font-bold pt-3 border-t border-border-light">
            <span>Low Staff (Fewer Free)</span>
            <span className="flex bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 w-32 h-2 rounded ml-2 mr-2" />
            <span>High Staff (Many Free)</span>
          </div>
        </Card>
      </div>

      {/* Bulk Update Drawer */}
      <Drawer
        isOpen={bulkDrawerOpen}
        onClose={() => setBulkDrawerOpen(false)}
        title="Bulk Availability Update"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">Modify weekly slot preferences for multiple faculty members at once.</p>
          
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Target Status</label>
            <select className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary">
              <option>Available (Solid Green)</option>
              <option>Unavailable (Diagonal Stripes)</option>
              <option>Preferred (Dotted Purple)</option>
              <option>Optional (Light Gray)</option>
            </select>
          </div>

          <div className="pt-6 border-t border-border flex flex-col gap-2">
            <Button variant="primary" className="w-full" onClick={() => setBulkDrawerOpen(false)}>Apply to Selected</Button>
            <Button variant="outline" className="w-full" onClick={() => setBulkDrawerOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
