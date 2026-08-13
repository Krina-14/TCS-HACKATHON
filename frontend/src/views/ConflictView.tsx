import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ConflictCard } from '../components/ConflictCard';
import { Drawer } from '../components/Drawer';
import { RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react';
import { Toast, ToastContainer } from '../components/Toast';

export const ConflictView: React.FC = () => {
  const { conflictsList, resolveConflict, resolveAllConflicts } = useStore();
  const [activeConflictId, setActiveConflictId] = useState<string | null>(null);
  
  // Custom toast list
  const [toasts, setToasts] = useState<any[]>([]);
  const [fixingId, setFixingId] = useState<string | null>(null);

  const addToast = (type: 'success' | 'danger', title: string, message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts([...toasts, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  const handleAutoFix = (id: string) => {
    setFixingId(id);
    setTimeout(() => {
      resolveConflict(id);
      setFixingId(null);
      addToast('success', 'Conflict resolved automatically', 'Timetable slot adjusted to a vacant room.');
    }, 1500); // Simulated delay
  };

  const handleAutoFixAll = () => {
    setFixingId('all');
    setTimeout(() => {
      resolveAllConflicts();
      setFixingId(null);
      addToast('success', 'All conflicts resolved', 'AI optimization relocated classes and cleared all critical clashes.');
    }, 2000);
  };

  const activeConflict = conflictsList.find(c => c.id === activeConflictId);

  return (
    <div className="space-y-6 font-sans select-none relative">
      {/* Toast Manager */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Conflict Detection Center
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Identify double-bookings, workload limits, and capacity overrides.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={handleAutoFixAll}
          isLoading={fixingId === 'all'}
          leftIcon={<RefreshCw className={`w-4 h-4 ${fixingId === 'all' ? 'animate-spin' : ''}`} />}
        >
          Auto Fix All Conflicts
        </Button>
      </div>

      {/* KPI stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="text-center p-5 border-l-4 border-l-danger">
          <p className="text-2xl font-extrabold text-danger font-mono">
            {conflictsList.filter(c => c.severity === 'critical').length}
          </p>
          <p className="text-xs font-bold text-text-secondary mt-1 uppercase">Critical Clashes</p>
        </Card>
        <Card className="text-center p-5 border-l-4 border-l-warning">
          <p className="text-2xl font-extrabold text-warning font-mono">
            {conflictsList.filter(c => c.severity === 'warning').length}
          </p>
          <p className="text-xs font-bold text-text-secondary mt-1 uppercase">Warnings</p>
        </Card>
        <Card className="text-center p-5 border-l-4 border-l-success">
          <p className="text-2xl font-extrabold text-success font-mono">
            {conflictsList.filter(c => c.severity === 'resolved').length + 12}
          </p>
          <p className="text-xs font-bold text-text-secondary mt-1 uppercase">Resolved Automatically</p>
        </Card>
      </div>

      {/* Conflicts List */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-text-primary dark:text-white">Active Clashes Feed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conflictsList.map((c) => (
            <ConflictCard
              key={c.id}
              type={c.type}
              description={c.description}
              affectedEntities={c.affectedEntities}
              severity={c.severity}
              onAutoFix={fixingId ? undefined : () => handleAutoFix(c.id)}
              onView={() => setActiveConflictId(c.id)}
              onIgnore={() => resolveConflict(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Conflict Details Drawer */}
      <Drawer
        isOpen={!!activeConflictId}
        onClose={() => setActiveConflictId(null)}
        title={activeConflict ? activeConflict.type : 'Conflict Detail'}
      >
        {activeConflict && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border pb-4">
              <Badge variant={activeConflict.severity === 'critical' ? 'danger' : 'warning'} size="sm">
                {activeConflict.severity}
              </Badge>
              <h4 className="font-extrabold text-sm text-text-primary leading-snug">{activeConflict.description}</h4>
            </div>

            <div className="space-y-3.5 text-xs text-text-secondary">
              <div className="p-3.5 bg-bg-elevated/20 rounded-xl border border-border-light leading-relaxed">
                <p className="font-bold text-text-primary dark:text-white">AI Optimization Fix Suggestion:</p>
                <p className="mt-1">Relocate the secondary class to Room B-205 (which is 100% free and vacant at that hour). This will affect 0 students schedules.</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span>Impacted Headcount</span>
                <span className="font-bold text-text-primary font-mono">{activeConflict.studentsAffected} students</span>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col gap-2">
              <Button
                variant="ai"
                className="w-full"
                onClick={() => {
                  handleAutoFix(activeConflict.id);
                  setActiveConflictId(null);
                }}
              >
                ⚡ Apply Suggested Fix
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setActiveConflictId(null)}>Dismiss</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
