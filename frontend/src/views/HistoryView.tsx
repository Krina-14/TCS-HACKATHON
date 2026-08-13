import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { History, Eye, ArrowRight, RefreshCcw } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { versionsList } = useStore();
  const [selectedVer, setSelectedVer] = useState<string | null>(null);

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white flex items-center gap-2">
            <History className="w-7 h-7 text-text-muted" /> Timetable Version History
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Audit historical timetable generations and compare adjustments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline revisions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-text-primary dark:text-white">Revisions Timeline</h3>
          <div className="space-y-4">
            {versionsList.map((ver) => (
              <Card
                key={ver.id}
                padding="compact"
                className={`border-l-4 hover:shadow-md transition-shadow
                  ${ver.status === 'Current' ? 'border-l-success bg-emerald-50/5' : 'border-l-border bg-bg-card'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-text-primary">{ver.version}</span>
                      <Badge variant={ver.status === 'Current' ? 'success' : 'neutral'} size="sm">
                        {ver.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-text-muted font-mono mt-1">{ver.timestamp} • By {ver.author}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedVer(ver.version)}
                    className="text-xs font-bold text-accent-ai hover:underline"
                  >
                    Compare version
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-border-light flex justify-between items-center text-xs text-text-secondary">
                  <span>Changes reason: {ver.reason}</span>
                  <span className="font-semibold text-text-primary font-mono">{ver.changesCount} slots modified</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected revision comparison view */}
        <div className="space-y-6">
          <Card header={{ title: 'Comparison Highlights', subtitle: 'Select a version to inspect audits' }}>
            {selectedVer ? (
              <div className="space-y-4 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Selected Version</span>
                  <span className="font-bold text-text-primary">{selectedVer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Version</span>
                  <span className="font-bold text-text-primary">v3.0.0</span>
                </div>
                <div className="p-3 bg-bg-elevated/20 rounded-lg border border-border-light leading-relaxed">
                  <p className="font-bold text-text-primary">Change Summary Log:</p>
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[11px] text-text-muted font-bold">
                    <li>3 lectures shifted to vacant slots</li>
                    <li>Room occupancy conflict resolved (IT-C moved to B-202)</li>
                    <li>Prof. Shah substituted for Amit Mehta</li>
                  </ul>
                </div>
                
                <Button variant="primary" className="w-full flex items-center justify-center gap-1.5" size="sm">
                  <RefreshCcw className="w-4 h-4" /> Restore Selected Version
                </Button>
              </div>
            ) : (
              <div className="py-12 text-center text-text-muted text-xs">
                Click "Compare version" on any revision card to view change highlights.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
