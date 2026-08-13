import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, LayoutGrid, List, FileSpreadsheet, UserPlus, 
  Mail, Phone, CalendarDays, Award, Clock, ArrowLeft, BookOpen, Check, 
  PieChart, BrainCircuit, RefreshCw, ZoomIn, ZoomOut 
} from 'lucide-react';
import { useStore, Faculty } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';

export const FacultyView: React.FC = () => {
  const { facultyList, setView } = useStore();
  
  const [activeLayout, setActiveLayout] = useState<'grid' | 'list' | 'network'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  
  // Profile drilldown
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'subjects' | 'availability' | 'workload'>('overview');

  const filteredFaculty = facultyList.filter((fac) => {
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fac.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', 'Information Technology', 'Computer Science', 'Electronics & Comm.', 'Mechanical Eng.'];

  // Network graph states
  const [networkZoom, setNetworkZoom] = useState(1);

  if (selectedFaculty) {
    return (
      <div className="space-y-6 font-sans">
        {/* Back header */}
        <button
          onClick={() => setSelectedFaculty(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Faculty List
        </button>

        {/* Profile Card Header */}
        <Card padding="default" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-accent-ai/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <img
                src={selectedFaculty.avatar}
                alt={selectedFaculty.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-border shadow-md"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-xl font-bold text-text-primary dark:text-white">{selectedFaculty.name}</h3>
                  <Badge variant="success" size="sm" showDot>{selectedFaculty.status}</Badge>
                </div>
                <p className="text-xs text-text-secondary">{selectedFaculty.designation} • {selectedFaculty.department}</p>
                <p className="text-[10px] text-text-muted font-mono">Faculty ID: {selectedFaculty.id}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary justify-center sm:justify-start pt-2">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-text-muted" />{selectedFaculty.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-text-muted" />{selectedFaculty.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Message</Button>
              <Button variant="secondary" size="sm">Edit Profile</Button>
            </div>
          </div>
        </Card>

        {/* Profile Subtabs */}
        <div className="flex border-b border-border gap-6 text-sm font-semibold select-none">
          {['overview', 'subjects', 'availability', 'workload'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveProfileTab(tab as any)}
              className={`pb-3 px-1 transition-colors relative focus:outline-none capitalize
                ${activeProfileTab === tab ? 'text-accent-ai font-bold' : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              {tab}
              {activeProfileTab === tab && (
                <motion.div
                  layoutId="profileActiveTabBorder"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-ai"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content displays */}
        <div className="space-y-6">
          {activeProfileTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Detailed metrics */}
              <Card header={{ title: 'Employment Details' }} className="md:col-span-2">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-text-secondary block">Designation</span>
                    <span className="font-bold text-text-primary mt-0.5 block">{selectedFaculty.designation}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Department</span>
                    <span className="font-bold text-text-primary mt-0.5 block">{selectedFaculty.department}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Join Date</span>
                    <span className="font-bold text-text-primary mt-0.5 block">{selectedFaculty.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Designated Classes</span>
                    <span className="font-bold text-text-primary mt-0.5 block">IT-A, IT-B</span>
                  </div>
                </div>
              </Card>

              {/* Workload widget */}
              <Card className="flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-text-secondary uppercase mb-3">Current Workload</span>
                <ProgressBar
                  value={selectedFaculty.workloadCurrent}
                  max={selectedFaculty.workloadMax}
                  variant="circular"
                  size={100}
                  strokeWidth={8}
                  showLabel
                  color={selectedFaculty.workloadCurrent > 18 ? 'danger' : 'success'}
                />
                <span className="text-[10px] text-text-muted mt-3 font-semibold">
                  {selectedFaculty.workloadCurrent} of {selectedFaculty.workloadMax} max lectures assigned
                </span>
              </Card>
            </div>
          )}

          {activeProfileTab === 'subjects' && (
            <Card header={{ title: 'Expertise & Prerequisites Mapping', subtitle: 'Topics of certified expertise mapping' }}>
              <div className="space-y-4">
                {Object.entries(selectedFaculty.expertise).map(([subj, pct]) => (
                  <div key={subj}>
                    <div className="flex justify-between text-xs font-bold text-text-secondary mb-1">
                      <span>{subj}</span>
                      <span className="font-mono text-accent-ai">{pct}% Expertise</span>
                    </div>
                    <ProgressBar value={pct} color={pct > 90 ? 'success' : 'primary'} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeProfileTab === 'availability' && (
            <Card header={{ title: 'Weekly Availability Calendar Grid', subtitle: 'Indicates preferred slots for substitution requests' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-center border border-border border-collapse text-xs">
                  <thead>
                    <tr className="bg-bg-elevated/40 text-xs font-bold text-text-secondary border-b border-border">
                      <th className="p-3 border-r border-border">Day</th>
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <th key={idx} className="p-3 border-r border-border font-mono">Period {idx + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedFaculty.availability).map(([day, slots]) => (
                      <tr key={day} className="border-b border-border">
                        <td className="p-3 bg-bg-elevated/20 font-bold border-r border-border text-text-primary text-left">{day}</td>
                        {slots.map((st, idx) => (
                          <td 
                            key={idx} 
                            className={`p-3 border-r border-border text-[10px] font-bold uppercase
                              ${st === 'available' ? 'bg-success-light text-success dark:bg-emerald-950/20' : 
                                st === 'preferred' ? 'bg-purple-100 text-accent-ai dark:bg-purple-950/20' : 'bg-red-50 text-danger dark:bg-red-950/20'}
                            `}
                          >
                            {st === 'available' ? '✓' : st === 'preferred' ? '★' : '✕'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeProfileTab === 'workload' && (
            <Card header={{ title: 'Workload Breakdown Analytics', subtitle: 'Syllabus hour mappings' }}>
              <div className="py-6 text-center text-text-secondary flex flex-col justify-center items-center">
                <PieChart className="w-10 h-10 opacity-30 mb-2" />
                <p className="text-sm font-medium">Dynamic workload analytics charts are rendered under the primary Analytics view.</p>
                <button
                  onClick={() => setView('analytics')}
                  className="text-xs font-bold text-accent-ai mt-3 bg-purple-50 dark:bg-purple-950/20 px-3 py-1.5 rounded-lg"
                >
                  View Global Analytics
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Faculty Directory
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Manage academic instructors, workloads, and mapping expertise.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
            Import CSV
          </Button>
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
            Add Faculty
          </Button>
        </div>
      </div>

      {/* Grid filters bar */}
      <div className="bg-bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Dept dropdown */}
        <div className="flex flex-wrap items-center gap-4 flex-grow">
          <div className="relative max-w-sm flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty name or ID..."
              className="w-full h-10 pl-10 pr-4 border border-border bg-transparent rounded-lg text-sm text-text-primary placeholder-text-muted focus:border-accent-ai focus:ring-accent-ai"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-secondary uppercase">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-10 border border-border bg-transparent rounded-lg text-xs text-text-primary focus:border-accent-ai focus:ring-accent-ai pl-2 pr-8"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode controls */}
        <div className="flex bg-bg-elevated p-1 rounded-lg border border-border-light text-xs font-semibold">
          <button
            onClick={() => setActiveLayout('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              activeLayout === 'grid' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveLayout('list')}
            className={`p-1.5 rounded-md transition-colors ${
              activeLayout === 'list' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveLayout('network')}
            className={`p-1.5 rounded-md transition-colors ${
              activeLayout === 'network' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panel views layout */}
      {activeLayout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFaculty.map((fac) => (
            <Card
              key={fac.id}
              variant="interactive"
              padding="compact"
              onClick={() => setSelectedFaculty(fac)}
              className="flex flex-col justify-between items-center text-center p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-accent-ai/5 blur-xl pointer-events-none" />

              <img
                src={fac.avatar}
                alt={fac.name}
                className="w-16 h-16 rounded-full object-cover border border-border shadow-sm mb-3"
              />
              <h4 className="font-bold text-sm text-text-primary leading-tight">{fac.name}</h4>
              <span className="text-[10px] text-text-muted mt-0.5">{fac.designation}</span>
              <Badge variant="neutral" size="sm" className="mt-2.5">{fac.department}</Badge>

              {/* Workload tracker */}
              <div className="w-full mt-5 space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-text-secondary uppercase">
                  <span>Weekly Workload</span>
                  <span>{fac.workloadCurrent}/{fac.workloadMax}h</span>
                </div>
                <ProgressBar
                  value={fac.workloadCurrent}
                  max={fac.workloadMax}
                  color={fac.workloadCurrent > 17 ? 'danger' : 'primary'}
                />
              </div>

              <button
                type="button"
                className="text-xs font-bold text-accent-ai hover:underline mt-4 focus:outline-none"
              >
                View Full Profile
              </button>
            </Card>
          ))}
        </div>
      )}

      {activeLayout === 'list' && (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-bg-elevated/40 border-b border-border text-xs font-bold text-text-secondary uppercase">
                <th className="p-4">Faculty</th>
                <th className="p-4">ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Current Workload</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredFaculty.map((fac) => (
                <tr key={fac.id} className="hover:bg-bg-elevated/20 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={fac.avatar} alt={fac.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-text-primary text-xs">{fac.name}</p>
                      <p className="text-[10px] text-text-muted">{fac.designation}</p>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono font-bold text-text-muted">{fac.id}</td>
                  <td className="p-4"><Badge variant="neutral" size="sm">{fac.department}</Badge></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary font-mono">{fac.workloadCurrent}/{fac.workloadMax}h</span>
                      <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${fac.workloadCurrent > 17 ? 'bg-danger' : 'bg-primary'}`}
                          style={{ width: `${(fac.workloadCurrent / fac.workloadMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={fac.status === 'online' ? 'success' : 'warning'} size="sm" showDot>
                      {fac.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedFaculty(fac)}
                      className="text-xs font-bold text-accent-ai hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expertise Network canvas */}
      {activeLayout === 'network' && (
        <Card header={{ title: 'Expertise Network Knowledge Graph', subtitle: 'Interactive layout showing connections between subjects, topics, and teaching skills' }}>
          <div className="relative border border-border rounded-lg h-[400px] overflow-hidden bg-bg-primary/30">
            {/* Control HUD buttons */}
            <div className="absolute top-4 left-4 z-20 flex bg-bg-card border border-border p-1 rounded shadow-sm gap-1">
              <button 
                onClick={() => setNetworkZoom(z => Math.min(2, z + 0.1))}
                className="p-1 hover:bg-bg-elevated rounded text-text-secondary"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setNetworkZoom(z => Math.max(0.5, z - 0.1))}
                className="p-1 hover:bg-bg-elevated rounded text-text-secondary"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setNetworkZoom(1)}
                className="p-1 hover:bg-bg-elevated rounded text-[10px] font-bold text-text-secondary"
              >
                100%
              </button>
            </div>

            {/* Network SVG Graph representation */}
            <div 
              className="w-full h-full flex items-center justify-center transform transition-transform"
              style={{ transform: `scale(${networkZoom})` }}
            >
              <svg className="w-[600px] h-[350px] overflow-visible">
                {/* Connecting Lines */}
                <line x1="100" y1="175" x2="250" y2="100" stroke="var(--border)" strokeWidth="2" />
                <line x1="100" y1="175" x2="250" y2="250" stroke="var(--border)" strokeWidth="2" />
                <line x1="250" y1="100" x2="450" y2="60" stroke="var(--border)" strokeWidth="1.5" />
                <line x1="250" y1="100" x2="450" y2="140" stroke="var(--border)" strokeWidth="1.5" />
                <line x1="250" y1="250" x2="450" y2="210" stroke="var(--border)" strokeWidth="1.5" />
                <line x1="250" y1="250" x2="450" y2="290" stroke="var(--border)" strokeWidth="1.5" />

                {/* Nodes */}
                {/* Subject Node */}
                <circle cx="100" cy="175" r="36" fill="var(--primary)" className="stroke-white stroke-2" />
                <text x="100" y="180" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">AI (IT501)</text>

                {/* Topic Nodes */}
                <circle cx="250" cy="100" r="28" fill="var(--primary-light)" className="stroke-white stroke-2" />
                <text x="250" y="104" fill="white" fontSize="9" textAnchor="middle" fontWeight="semibold">ML Algorithms</text>

                <circle cx="250" cy="250" r="28" fill="var(--primary-light)" className="stroke-white stroke-2" />
                <text x="250" y="254" fill="white" fontSize="9" textAnchor="middle" fontWeight="semibold">Neural Networks</text>

                {/* Skill Nodes */}
                <circle cx="450" cy="60" r="22" fill="var(--accent-ai)" className="stroke-white stroke-2 shadow-ai" />
                <text x="450" y="63" fill="white" fontSize="8" textAnchor="middle">Python</text>

                <circle cx="450" cy="140" r="22" fill="var(--accent-ai)" className="stroke-white stroke-2 shadow-ai" />
                <text x="450" y="143" fill="white" fontSize="8" textAnchor="middle">TensorFlow</text>

                <circle cx="450" cy="210" r="22" fill="var(--accent-ai)" className="stroke-white stroke-2 shadow-ai" />
                <text x="450" y="213" fill="white" fontSize="8" textAnchor="middle">NLP</text>

                <circle cx="450" cy="290" r="22" fill="var(--accent-ai)" className="stroke-white stroke-2 shadow-ai" />
                <text x="450" y="293" fill="white" fontSize="8" textAnchor="middle">Deep Learning</text>
              </svg>
            </div>
            
            {/* Details overlay */}
            <div className="absolute bottom-4 right-4 bg-bg-card/95 border border-border p-3.5 rounded shadow-lg text-[10px] text-text-secondary leading-relaxed max-w-xs">
              <p className="font-bold text-text-primary uppercase mb-1">Knowledge Mapping Legend</p>
              <ul className="space-y-1">
                <li>🔵 <strong>Subject Nodes:</strong> Broad curriculum blocks (e.g. IT501)</li>
                <li>🔷 <strong>Topic Nodes:</strong> Specialized syllabus headings</li>
                <li>🟣 <strong>Skill Nodes:</strong> Practical developer libraries</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
