import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, LayoutGrid, List, Plus, Award, GraduationCap, ZoomIn, ZoomOut, BrainCircuit, RefreshCw, Trash2, Edit } from 'lucide-react';
import { useStore, Subject } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

export const SubjectView: React.FC = () => {
  const { subjectsList, addSubject } = useStore();
  const [activeLayout, setActiveLayout] = useState<'grid' | 'list' | 'network'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [networkZoom, setNetworkZoom] = useState(1);

  // Add form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(4);
  const [type, setType] = useState<'Theory' | 'Lab'>('Theory');
  const [lectures, setLectures] = useState(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [dept, setDept] = useState('Information Technology');

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    
    addSubject({
      code,
      name,
      credits,
      type,
      lecturesPerWeek: lectures,
      preferredPeriod: 'Morning',
      requiredRoom: type === 'Lab' ? 'Lab' : 'Classroom',
      difficulty,
      department: dept,
      prerequisites: [],
      topics: ['Introduction', 'Fundamentals', 'Overview'],
    });

    setAddModalOpen(false);
    setName('');
    setCode('');
  };

  const filteredSubjects = subjectsList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500'];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Subjects & Expertise Mapping
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Manage course curriculum codes, credits, and knowledge networks.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Subject
        </Button>
      </div>

      {/* Grid filters toolbar */}
      <div className="bg-bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or curriculum codes..."
            className="w-full h-10 pl-10 pr-4 border border-border bg-transparent rounded-lg text-sm text-text-primary placeholder-text-muted focus:border-accent-ai focus:ring-accent-ai"
          />
        </div>

        {/* View toggles */}
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

      {/* Main Panels */}
      {activeLayout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub, idx) => (
            <Card
              key={sub.code}
              variant="interactive"
              padding="compact"
              className="flex flex-col justify-between min-h-[220px] overflow-hidden group border-t-4 border-t-primary"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase font-mono">{sub.code}</span>
                    <h4 className="font-extrabold text-sm text-text-primary dark:text-white mt-1 leading-snug">{sub.name}</h4>
                  </div>
                  <Badge variant={sub.type === 'Theory' ? 'info' : 'ai'} size="sm">{sub.type}</Badge>
                </div>
                
                {/* Statistics line */}
                <div className="flex gap-3 text-[10px] text-text-muted mt-3 font-bold uppercase">
                  <span>{sub.credits} Credits</span>
                  <span>•</span>
                  <span>{sub.lecturesPerWeek} Lectures/Wk</span>
                </div>
              </div>

              {/* Difficulty indicators */}
              <div className="mt-6 pt-3 border-t border-border-light space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-text-secondary uppercase">
                  <span>Difficulty Rank</span>
                  <span>{sub.difficulty}</span>
                </div>
                <ProgressBar
                  value={sub.difficulty === 'Hard' ? 90 : sub.difficulty === 'Medium' ? 60 : 30}
                  color={sub.difficulty === 'Hard' ? 'danger' : sub.difficulty === 'Medium' ? 'warning' : 'success'}
                />
              </div>

              {/* Actions row */}
              <div className="absolute inset-0 bg-primary-dark/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"><Edit className="w-4 h-4" /></button>
                <button className="p-2 bg-red-600/80 text-white rounded hover:bg-red-700/90 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeLayout === 'list' && (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-bg-elevated/40 border-b border-border text-xs font-bold text-text-secondary uppercase">
                <th className="p-4">Subject</th>
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Required Room</th>
                <th className="p-4">Lectures/Week</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-bg-elevated/20 transition-colors">
                  <td className="p-4 font-bold text-text-primary text-xs">{sub.name}</td>
                  <td className="p-4 text-xs font-mono text-text-muted">{sub.code}</td>
                  <td className="p-4"><Badge variant={sub.type === 'Theory' ? 'info' : 'ai'} size="sm">{sub.type}</Badge></td>
                  <td className="p-4 text-xs font-semibold text-text-secondary font-mono">{sub.credits} Credits</td>
                  <td className="p-4 text-xs text-text-secondary">{sub.requiredRoom}</td>
                  <td className="p-4 text-xs font-semibold text-text-secondary font-mono">{sub.lecturesPerWeek} hours</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Network Knowledge graph tab */}
      {activeLayout === 'network' && (
        <Card header={{ title: 'Expertise Network Knowledge Graph', subtitle: 'Curriculum requirements hierarchy maps' }}>
          <div className="relative border border-border rounded-lg h-[400px] overflow-hidden bg-bg-primary/30">
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

            <div 
              className="w-full h-full flex items-center justify-center transform transition-transform"
              style={{ transform: `scale(${networkZoom})` }}
            >
              <svg className="w-[600px] h-[350px] overflow-visible">
                {/* Connecting Lines */}
                <line x1="300" y1="175" x2="150" y2="100" stroke="var(--border)" strokeWidth="2" />
                <line x1="300" y1="175" x2="150" y2="250" stroke="var(--border)" strokeWidth="2" />
                <line x1="300" y1="175" x2="450" y2="175" stroke="var(--border)" strokeWidth="2" />

                {/* Nodes */}
                <circle cx="300" cy="175" r="32" fill="var(--primary)" className="stroke-white stroke-2" />
                <text x="300" y="179" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">IT Curriculum</text>

                <circle cx="150" cy="100" r="24" fill="var(--primary-light)" className="stroke-white stroke-2" />
                <text x="150" y="103" fill="white" fontSize="8" textAnchor="middle">IT501 (AI)</text>

                <circle cx="150" cy="250" r="24" fill="var(--primary-light)" className="stroke-white stroke-2" />
                <text x="150" y="253" fill="white" fontSize="8" textAnchor="middle">IT502 (DBMS)</text>

                <circle cx="450" cy="175" r="24" fill="var(--accent-ai)" className="stroke-white stroke-2" />
                <text x="450" y="178" fill="white" fontSize="8" textAnchor="middle">IT301 (Python)</text>
              </svg>
            </div>
          </div>
        </Card>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Syllabus Subject"
      >
        <form onSubmit={handleAddSubjectSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Subject Name" value={name} onChange={setName} />
            <Input label="Subject Code" value={code} onChange={setCode} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Subject Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full h-12 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary"
              >
                <option value="Theory">Theory</option>
                <option value="Lab">Practical / Lab</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Academic Credits</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full h-12 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Subject</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
