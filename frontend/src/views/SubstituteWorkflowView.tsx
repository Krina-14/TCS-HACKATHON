import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, User, ShieldCheck, Check, AlertTriangle, RefreshCw, 
  ArrowRight, Users, Clock, Award, Activity, HeartHandshake, Eye 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { AIRecommendationCard } from '../components/AIRecommendationCard';
import { ProgressBar } from '../components/ProgressBar';

export const SubstituteWorkflowView: React.FC = () => {
  const { 
    selectedTimetableCell, 
    selectedSubstituteId,
    substitutionStatus,
    findSubstitutes, 
    applySubstitution, 
    setView,
    setDemoStep,
    demoStep,
    facultyList
  } = useStore();

  const [searchStepIndex, setSearchStepIndex] = useState(0);

  const searchSteps = [
    'Searching faculty database...',
    'Checking subject expertise...',
    'Verifying availability...',
    'Analyzing workload...',
    'Checking division familiarity...',
    'Ranking candidates...',
  ];

  // Run the matching search sequence when landing in idle
  useEffect(() => {
    if (substitutionStatus === 'idle') {
      findSubstitutes();
    }
  }, [substitutionStatus]);

  // Handle step increments inside the loader
  useEffect(() => {
    if (substitutionStatus !== 'searching') return;
    setSearchStepIndex(0);

    const interval = setInterval(() => {
      setSearchStepIndex((prev) => {
        if (prev >= searchSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [substitutionStatus]);

  const handleSelectSubstitute = (id: string) => {
    // Save selection
    applySubstitution(id);
  };

  const handleDeployChanges = () => {
    setView('timetable-view');
    setDemoStep(11); // Advance demo to notifications/bell check
  };

  // Find targeted candidate info
  const selectedSub = facultyList.find(f => f.id === 'FAC-2023-014'); // Ananya Shah

  return (
    <div className="space-y-6 select-none font-sans">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-text-primary dark:text-white">
            <RefreshCw className="w-7 h-7 text-accent-ai animate-spin-slow" />
            Emergency Substitution Center
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Resolve classroom absences instantly with intelligent, conflict-free recommendations.
          </p>
        </div>

        {/* Demo Helper bubble */}
        {demoStep === 7 && (
          <div className="bg-purple-100 border border-purple-200 rounded-xl p-3 text-xs text-accent-ai dark:bg-purple-950/40 dark:border-purple-900 shadow-sm flex items-center gap-2 animate-float">
            <span>💡</span>
            <p className="font-bold">Wait for the AI search analysis to conclude, then review matches.</p>
          </div>
        )}

        {demoStep === 8 && (
          <div className="bg-purple-100 border border-purple-200 rounded-xl p-3.5 text-xs text-accent-ai dark:bg-purple-950/40 dark:border-purple-900 shadow-sm flex items-center gap-3 animate-float max-w-sm">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-bold">Evaluator Guide - Step 8</p>
              <p className="text-text-secondary dark:text-slate-400 mt-0.5">Select **Prof. Ananya Shah (94% Match)** to preview the comparison and apply replacement.</p>
            </div>
          </div>
        )}

        {demoStep === 10 && (
          <div className="bg-purple-100 border border-purple-200 rounded-xl p-3.5 text-xs text-accent-ai dark:bg-purple-950/40 dark:border-purple-900 shadow-sm flex items-center gap-3 animate-float max-w-sm">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-bold">Evaluator Guide - Step 10</p>
              <p className="text-text-secondary dark:text-slate-400 mt-0.5">Substitution successfully prepared! Click **"Apply and Publish"** to commit live changes.</p>
            </div>
          </div>
        )}
      </div>

      {/* STAGE 1: Searching Animation */}
      {substitutionStatus === 'searching' && (
        <div className="py-16 flex flex-col items-center justify-center bg-bg-card border border-border rounded-2xl shadow-sm min-h-[400px]">
          {/* Soundwave/orb animation */}
          <div className="flex items-end justify-center gap-1.5 h-12 mb-8 text-accent-ai">
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.1s' }} />
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.3s' }} />
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.5s' }} />
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 bg-current rounded-full soundwave-bar" style={{ animationDelay: '0.4s' }} />
          </div>

          <h3 className="font-bold text-base text-text-primary dark:text-white mb-2">Analyzing Candidate Workload & Expertise</h3>
          <p className="text-xs text-text-secondary mb-8">Matching database metrics to avoid conflict overrides...</p>

          {/* Staggered Checklist steps */}
          <div className="text-left space-y-2.5 max-w-xs w-full">
            {searchSteps.map((step, idx) => {
              const isDone = searchStepIndex > idx;
              const isCurrent = searchStepIndex === idx;

              return (
                <div key={idx} className="flex items-center gap-2 text-xs text-text-secondary">
                  {isDone ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 text-accent-ai animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border" />
                  )}
                  <span className={isDone ? 'text-text-muted' : isCurrent ? 'text-text-primary font-bold dark:text-white' : 'text-text-muted'}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 2: Matching Results Option Lists */}
      {substitutionStatus === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Recommendation featured (Ananya Shah) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-base text-text-primary dark:text-white">Top Candidate Recommendations</h3>
            
            <AIRecommendationCard
              name="Prof. Ananya Shah"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
              matchPercentage={94}
              workload="14/20 hours (Low)"
              reasons={[
                'Holds expert rating in Artificial Intelligence (95% syllabus match)',
                'Completely free during Monday 11:00 AM - 12:00 PM slot',
                'Zero conflicts detected with active room bookings',
                'Previously taught division IT-A (High familiarity index)',
              ]}
              whyExplanation="Prof. Shah matches the requirements perfectly because she is fully free, carries a light weekly workload, and holds direct expertise in neural networks and search algorithms covered in Semester 5 syllabus."
              onSelect={() => handleSelectSubstitute('FAC-2023-014')}
            />

            {/* Collapsed backups */}
            <div className="border border-border rounded-xl p-4 bg-bg-card flex justify-between items-center opacity-75">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-text-secondary">RP</div>
                <div>
                  <p className="text-xs font-bold text-text-primary">Prof. Rahul Patel</p>
                  <p className="text-[10px] text-text-muted">83% Match • IT Department • Workload 16/20</p>
                </div>
              </div>
              <button 
                onClick={() => handleSelectSubstitute('FAC-2022-045')}
                className="text-xs font-bold text-accent-ai hover:underline"
              >
                Select RP
              </button>
            </div>

            <div className="border border-border rounded-xl p-4 bg-bg-card flex justify-between items-center opacity-75">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-text-secondary">NJ</div>
                <div>
                  <p className="text-xs font-bold text-text-primary">Prof. Neha Joshi</p>
                  <p className="text-[10px] text-text-muted">76% Match • Computer Science • Workload 12/20</p>
                </div>
              </div>
              <button 
                onClick={() => handleSelectSubstitute('FAC-2023-089')}
                className="text-xs font-bold text-accent-ai hover:underline"
              >
                Select NJ
              </button>
            </div>
          </div>

          {/* Impact Stats Info Side column */}
          <div className="space-y-6">
            <Card header={{ title: 'Impact Summary', subtitle: 'Disruption limits of absence' }}>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Target Division</span>
                  <span className="font-bold text-text-primary">IT-A (Sem 5)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Affected Students</span>
                  <span className="font-bold text-text-primary">62 students</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Lecture Time</span>
                  <span className="font-bold text-text-primary">11:00 - 12:00</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">AI Optimization Confidence</span>
                  <span className="font-bold text-success">98.2%</span>
                </div>
              </div>
            </Card>

            <Card header={{ title: 'Zero-Waste Lecture Metrics', subtitle: 'Academic continuity tracker' }}>
              <div className="text-center py-2">
                <p className="text-3xl font-extrabold text-success font-mono">42</p>
                <p className="text-xs font-bold text-text-secondary mt-1">Teaching hours saved this month</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center mt-4 border-t border-border-light pt-3 text-[10px] text-text-muted font-bold">
                <div>
                  <p className="text-text-secondary font-mono">2,340</p>
                  <p className="mt-0.5">Students Benefitted</p>
                </div>
                <div>
                  <p className="text-text-secondary font-mono">18s</p>
                  <p className="mt-0.5">Avg Match Time</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* STAGE 3: Before/After Comparison Preview */}
      {substitutionStatus === 'applied' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-base text-text-primary dark:text-white">Substitution Conflict-Free Preview</h3>

            {/* Split Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch relative">
              {/* BEFORE */}
              <Card padding="compact" className="border-l-4 border-l-danger bg-red-50/5">
                <span className="text-[10px] font-bold text-danger uppercase">Before substitution</span>
                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Syllabus Subject</span>
                    <span className="font-bold text-text-primary">Artificial Intelligence</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Assigned Faculty</span>
                    <span className="font-bold text-danger flex items-center gap-1">Prof. Amit Mehta ❌ (Absent)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Room Location</span>
                    <span className="font-bold text-text-primary">Room B-204</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Lecture Status</span>
                    <span className="font-bold text-danger">Cancelled</span>
                  </div>
                </div>
              </Card>

              {/* AFTER */}
              <Card padding="compact" className="border-l-4 border-l-success bg-emerald-50/5">
                <span className="text-[10px] font-bold text-success uppercase">After substitution (AI Match)</span>
                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Syllabus Subject</span>
                    <span className="font-bold text-text-primary">Artificial Intelligence</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Assigned Faculty</span>
                    <span className="font-bold text-success bg-yellow-100 dark:bg-yellow-950/40 px-1 rounded flex items-center gap-1">
                      Prof. Ananya Shah ✅ (Substitute)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Room Location</span>
                    <span className="font-bold text-text-primary">Room B-204</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Lecture Status</span>
                    <span className="font-bold text-success">Confirmed</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Impact analytics gauge bar */}
            <Card header={{ title: 'Disruption Metrics Analysis', subtitle: 'Calculated impact across Semester 5 divisions' }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-3 bg-bg-elevated/20 rounded-xl border border-border-light">
                  <p className="text-xs text-text-muted font-bold uppercase">Student Disruption</p>
                  <p className="text-2xl font-extrabold text-success mt-1 font-mono">0%</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Schedules preserved</p>
                </div>
                <div className="p-3 bg-bg-elevated/20 rounded-xl border border-border-light">
                  <p className="text-xs text-text-muted font-bold uppercase">Faculty Commute Shift</p>
                  <p className="text-2xl font-extrabold text-success mt-1 font-mono">None</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">All blocks localized</p>
                </div>
                <div className="p-3 bg-bg-elevated/20 rounded-xl border border-border-light">
                  <p className="text-xs text-text-muted font-bold uppercase">Syllabus Continuity</p>
                  <p className="text-2xl font-extrabold text-success mt-1 font-mono">100%</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Direct subject match</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action deployment columns */}
          <div className="space-y-6">
            <Card header={{ title: 'Deploy Actions', subtitle: 'Publish changes to academic portals' }}>
              <div className="space-y-4">
                <div className="text-xs text-text-secondary bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 p-3 rounded-lg leading-relaxed">
                  <p className="font-bold text-accent-ai">Publish Logs:</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Push substitution alerts to IT-A student portals</li>
                    <li>Notify Prof. Shah via email & SMS logs</li>
                    <li>Update live room occupancy boards</li>
                  </ul>
                </div>

                <Button
                  variant="ai"
                  size="lg"
                  className="w-full font-bold"
                  onClick={handleDeployChanges}
                  leftIcon={<ShieldCheck className="w-5 h-5" />}
                >
                  Apply and Publish
                </Button>

                <button
                  onClick={() => setView('timetable-view')}
                  className="w-full text-center text-xs font-semibold text-text-muted hover:text-text-primary transition-colors py-2 border border-dashed border-border rounded-lg"
                >
                  Discard Changes
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
