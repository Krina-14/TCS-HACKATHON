import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Settings, ShieldCheck, Download, Trash2, Key, Sliders } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'constraints' | 'audit'>('general');

  // Sliders states
  const [studentComfort, setStudentComfort] = useState(90);
  const [facultyPref, setFacultyPref] = useState(80);
  const [workloadBal, setWorkloadBal] = useState(85);

  const auditLogs = [
    { time: '2026-08-13, 11:02:14 AM', user: 'AI Matcher', action: 'Relocated Class', entity: 'IT501 (AI)', reason: 'Faculty Mehta Absent', hash: 'sha256-4ea19b...', ip: '192.168.1.45' },
    { time: '2026-08-13, 10:15:32 AM', user: 'Admin', action: 'Deployed Timetable', entity: 'Semester 5 Grid', reason: 'Version v3.0 Published', hash: 'sha256-82bc19...', ip: '192.168.1.12' },
    { time: '2026-08-12, 04:30:11 PM', user: 'Admin', action: 'Resolved Conflict', entity: 'Room B-204 clash', reason: 'Shifted IT-C to B-202', hash: 'sha256-9a2c4e...', ip: '192.168.1.12' },
  ];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-text-muted" /> Settings & Audit Trail
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Configure optimization sliders weights and inspect blockchain-lite compliance logs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 text-sm font-semibold select-none">
        {['general', 'constraints', 'audit'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 px-1 transition-colors relative focus:outline-none capitalize
              ${activeTab === tab ? 'text-accent-ai font-bold' : 'text-text-secondary hover:text-text-primary'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <Card header={{ title: 'General Parameters', subtitle: 'Academic year and timing constraints' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl text-xs text-text-secondary">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Timezone</label>
              <select className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary">
                <option>UTC +05:30 (India Standard Time)</option>
                <option>UTC +00:00 (GMT)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Language</label>
              <select className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary">
                <option>English (United States)</option>
                <option>Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'constraints' && (
        <Card header={{ title: 'Soft Constraint Slider Weights', subtitle: 'Tune weight coefficients for AI optimization' }}>
          <div className="space-y-6 max-w-xl text-xs">
            <div>
              <div className="flex justify-between text-xs font-bold text-text-primary mb-2">
                <span>Student Schedule Comfort</span>
                <span className="font-mono text-accent-ai">{studentComfort}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={studentComfort}
                onChange={(e) => setStudentComfort(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent-ai"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-text-primary mb-2">
                <span>Faculty Preferred Periods</span>
                <span className="font-mono text-accent-ai">{facultyPref}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={facultyPref}
                onChange={(e) => setFacultyPref(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent-ai"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-text-primary mb-2">
                <span>Workload Balance Factor</span>
                <span className="font-mono text-accent-ai">{workloadBal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={workloadBal}
                onChange={(e) => setWorkloadBal(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent-ai"
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Header options */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-text-primary dark:text-white">Compliance Log (For NAAC/UGC Accreditation)</h3>
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Generate Accreditation Report
            </Button>
          </div>

          <Card header={{ title: 'Blockchain-Lite Audit Registry', subtitle: 'Indicates verified, hash-locked timetable changes' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg-elevated/40 border-b border-border text-xs font-bold text-text-secondary uppercase">
                    <th className="p-3">Audit Date & Time</th>
                    <th className="p-3">Authorized User</th>
                    <th className="p-3">Action Committed</th>
                    <th className="p-3">Entity scope</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Hash Lock Code</th>
                    <th className="p-3 text-right">Accreditation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text-secondary">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-bg-elevated/10">
                      <td className="p-3 font-mono">{log.time}</td>
                      <td className="p-3 font-semibold text-text-primary">{log.user}</td>
                      <td className="p-3">{log.action}</td>
                      <td className="p-3 font-mono">{log.entity}</td>
                      <td className="p-3 font-mono text-text-muted">{log.ip}</td>
                      <td className="p-3 font-mono text-text-muted" title={log.hash}>{log.hash}</td>
                      <td className="p-3 text-right">
                        <Badge variant="success" size="sm" className="inline-flex gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
