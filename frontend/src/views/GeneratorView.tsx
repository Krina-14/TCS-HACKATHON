import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sliders, CheckCircle, RefreshCw, Layers, LayoutGrid, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';

export const GeneratorView: React.FC = () => {
  const { setView, setDemoStep, demoStep, regenerateTimetable } = useStore();

  const [department, setDepartment] = useState('IT');
  const [semester, setSemester] = useState('5');
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(['IT-A', 'IT-B']);
  
  // Hard constraints (all toggled ON by default, disabled)
  const [hardConstraints] = useState({
    noFacultyClash: true,
    noRoomClash: true,
    respectAvailability: true,
    capacityLimit: true,
  });

  // Soft constraints sliders
  const [studentComfort, setStudentComfort] = useState(90);
  const [facultyPref, setFacultyPref] = useState(80);
  const [balancedWorkload, setBalancedWorkload] = useState(85);

  // States for flow
  const [stage, setStage] = useState<'input' | 'animating' | 'results'>('input');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [progressVal, setProgressVal] = useState(0);
  const [compareMode, setCompareMode] = useState(false);

  const stepsList = [
    'Analyzing 1,284 possible schedules...',
    'Checking faculty availability...',
    'Resolving room conflicts...',
    'Balancing workload...',
    'Optimizing student schedule...',
    'Finalizing best timetable...',
  ];

  // AI Animation Sequence
  useEffect(() => {
    if (stage !== 'animating') return;

    setActiveStepIndex(0);
    setProgressVal(0);

    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= stepsList.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setStage('results');
            setDemoStep(4); // Advance demo to Option selection
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgressVal((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (stepsList.length * 20));
      });
    }, 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [stage]);

  const handleGenerate = () => {
    setStage('animating');
  };

  const handleSelectOptionB = () => {
    regenerateTimetable();
    setView('timetable-view');
    setDemoStep(5); // Advance to Weekly Timetable view
  };

  return (
    <div className="space-y-8 select-none font-sans">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-text-primary dark:text-white">
            <Sparkles className="w-7 h-7 text-accent-ai animate-pulse" />
            Generate AI Timetable
          </h2>
          <p className="text-text-secondary text-sm">
            Run the AI Optimization Engine to schedule classes automatically.
          </p>
        </div>

        {/* Demo Helper banner */}
        {demoStep === 3 && stage === 'input' && (
          <div className="bg-purple-100 border border-purple-200 rounded-xl p-3.5 text-xs text-accent-ai dark:bg-purple-950/40 dark:border-purple-900 shadow-sm flex items-center gap-3 animate-float max-w-sm">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-bold">Evaluator Guide - Step 3</p>
              <p className="text-text-secondary dark:text-slate-400 mt-0.5">Toggle divisions (IT-A, IT-B, IT-C) and click the gradient "Generate Timetable" button at the bottom.</p>
            </div>
          </div>
        )}
      </div>

      {stage === 'input' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Parameters */}
          <div className="lg:col-span-2 space-y-6">
            <Card header={{ title: 'Schedule Parameters', subtitle: 'Select scope for timetable generation' }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary focus:border-accent-ai focus:ring-accent-ai"
                  >
                    <option value="IT">Information Technology</option>
                    <option value="CS">Computer Science</option>
                    <option value="EC">Electronics & Comm.</option>
                  </select>
                </div>

                {/* Semester Selection */}
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary focus:border-accent-ai focus:ring-accent-ai"
                  >
                    <option value="1">Semester 1</option>
                    <option value="3">Semester 3</option>
                    <option value="5">Semester 5 (Current)</option>
                    <option value="7">Semester 7</option>
                  </select>
                </div>

                {/* Scope selector placeholder */}
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Academic Year</label>
                  <div className="h-10 border border-border bg-bg-elevated/40 rounded-md px-3 text-sm text-text-secondary flex items-center font-mono">
                    2025-26 (Odd Sem)
                  </div>
                </div>
              </div>

              {/* Divisions Multi-select Chips */}
              <div className="mt-6">
                <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Target Divisions</label>
                <div className="flex flex-wrap gap-2">
                  {['IT-A', 'IT-B', 'IT-C', 'CSE-A', 'ECE-A'].map((div) => {
                    const isSelected = selectedDivisions.includes(div);
                    return (
                      <button
                        key={div}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedDivisions(selectedDivisions.filter((d) => d !== div));
                          } else {
                            setSelectedDivisions([...selectedDivisions, div]);
                          }
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1
                          ${isSelected 
                            ? 'bg-purple-100 text-accent-ai border-accent-ai dark:bg-purple-950 dark:text-accent-ai-glow' 
                            : 'bg-bg-card text-text-secondary border-border hover:bg-bg-elevated'
                          }
                        `}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {div}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Hard Constraints - Toggles */}
            <Card header={{ title: 'Hard Constraints', subtitle: 'Strict limits that the AI optimizer cannot violate' }} className="border-l-4 border-l-danger">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-bg-elevated/20 rounded-lg border border-border-light">
                  <div>
                    <p className="text-xs font-bold text-text-primary">No Faculty Clashes</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Professors cannot teach 2 classes at once</p>
                  </div>
                  <ToggleSwitch checked={hardConstraints.noFacultyClash} onChange={() => {}} disabled />
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-elevated/20 rounded-lg border border-border-light">
                  <div>
                    <p className="text-xs font-bold text-text-primary">No Room Double-Bookings</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Rooms cannot hold multiple lectures at once</p>
                  </div>
                  <ToggleSwitch checked={hardConstraints.noRoomClash} onChange={() => {}} disabled />
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-elevated/20 rounded-lg border border-border-light">
                  <div>
                    <p className="text-xs font-bold text-text-primary">Respect Leaves & Availability</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Adhere to faculty unavailable slots</p>
                  </div>
                  <ToggleSwitch checked={hardConstraints.respectAvailability} onChange={() => {}} disabled />
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-elevated/20 rounded-lg border border-border-light">
                  <div>
                    <p className="text-xs font-bold text-text-primary">Room Capacity Limits</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Room capacity must exceed student count</p>
                  </div>
                  <ToggleSwitch checked={hardConstraints.capacityLimit} onChange={() => {}} disabled />
                </div>
              </div>
            </Card>
          </div>

          {/* Right panel: Soft constraints sliders */}
          <div className="space-y-6">
            <Card header={{ title: 'Soft Constraints Optimization', subtitle: 'Tune weight priorities for the AI engine' }} className="border-l-4 border-l-warning">
              <div className="space-y-6">
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
                  <p className="text-[10px] text-text-muted mt-1">Minimizes free gaps between classes and spreads lectures evenly.</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-text-primary mb-2">
                    <span>Faculty Preferences Weight</span>
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
                  <p className="text-[10px] text-text-muted mt-1">Prioritizes faculty preferred periods (mornings/afternoons).</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-text-primary mb-2">
                    <span>Workload Balancing</span>
                    <span className="font-mono text-accent-ai">{balancedWorkload}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={balancedWorkload}
                    onChange={(e) => setBalancedWorkload(Number(e.target.value))}
                    className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent-ai"
                  />
                  <p className="text-[10px] text-text-muted mt-1">Spreads workload evenly, preventing consecutive teaching limits.</p>
                </div>
              </div>
            </Card>

            {/* Run button */}
            <Button
              variant="ai"
              size="lg"
              className="w-full font-bold shadow-lg"
              onClick={handleGenerate}
              leftIcon={<Sparkles className="w-5 h-5 animate-pulse" />}
            >
              Generate Optimized Timetable
            </Button>
          </div>
        </div>
      )}

      {/* AI Processing overlay */}
      {stage === 'animating' && (
        <div className="fixed inset-0 z-50 bg-primary-dark/65 backdrop-blur-md flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-bg-card border border-border shadow-2xl rounded-2xl p-6 text-center"
          >
            {/* Pulsing AI Brain / logo */}
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto shadow-ai animate-pulse-glow dark:bg-purple-950/60 mb-5 text-accent-ai dark:text-accent-ai-glow">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="font-bold text-lg text-text-primary dark:text-white mb-2">SmartSched AI Optimizing</h3>
            <p className="text-xs text-text-secondary max-w-xs mx-auto mb-6">Evaluating potential timetable combinations based on parameters...</p>

            {/* Loading checklist */}
            <div className="text-left space-y-3 max-w-xs mx-auto mb-6">
              {stepsList.map((step, idx) => {
                const isPassed = activeStepIndex > idx;
                const isCurrent = activeStepIndex === idx;

                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-text-secondary transition-colors duration-normal">
                    {isPassed ? (
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 animate-scale" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-accent-ai flex-shrink-0 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border flex-shrink-0" />
                    )}
                    <span className={isPassed ? 'text-text-muted font-medium' : isCurrent ? 'text-text-primary font-bold dark:text-white' : 'text-text-muted'}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <ProgressBar value={progressVal} color="ai" showLabel useGradient />

            <button
              onClick={() => setStage('input')}
              className="text-xs font-bold text-text-muted hover:text-text-primary mt-6 transition-colors"
            >
              Cancel Optimization
            </button>
          </motion.div>
        </div>
      )}

      {/* Results Page */}
      {stage === 'results' && (
        <div className="space-y-6">
          {/* Confetti celebration alert */}
          <div className="bg-success-light text-success border border-success-light dark:bg-emerald-950/40 dark:border-emerald-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 bg-success text-white rounded-full p-0.5" />
              <div>
                <p className="font-bold text-sm">Timetables generated successfully!</p>
                <p className="text-xs text-text-secondary mt-0.5">3 optimized conflict-free options are ready for review.</p>
              </div>
            </div>

            {/* Guide bubble */}
            {demoStep === 4 && (
              <div className="hidden md:flex bg-purple-100 border border-purple-200 rounded-lg p-2 text-[10px] text-accent-ai max-w-[260px] dark:bg-purple-950 dark:border-purple-900 animate-float">
                👉 Select **Option B (Recommended)** to advance.
              </div>
            )}
          </div>

          {/* Table vs card mode toggle */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-text-primary dark:text-white">Generated Schedules</h3>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className="text-xs font-bold text-accent-ai bg-purple-50 dark:bg-purple-950/30 px-3 py-1.5 rounded-lg hover:underline"
            >
              {compareMode ? 'Show Option Cards' : 'Compare Side-by-Side'}
            </button>
          </div>

          {!compareMode ? (
            /* Cards layout option list */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Option A */}
              <Card footer={<Button variant="outline" className="w-full">Preview Option A</Button>}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono font-bold text-text-muted">Option A</span>
                  <span className="text-2xl font-bold text-warning font-mono">89%</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Faculty Util</span>
                      <span>88%</span>
                    </div>
                    <ProgressBar value={88} color="warning" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Student Comfort</span>
                      <span>82%</span>
                    </div>
                    <ProgressBar value={82} color="warning" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Room Util</span>
                      <span>91%</span>
                    </div>
                    <ProgressBar value={91} color="success" />
                  </div>
                </div>
              </Card>

              {/* Option B - RECOMMENDED */}
              <Card
                className="ring-2 ring-accent-ai shadow-xl"
                header={{
                  title: (
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-mono font-bold text-accent-ai">Option B</span>
                      <Badge variant="ai" size="sm" className="animate-pulse-glow">AI Recommended</Badge>
                    </div>
                  ),
                }}
                footer={
                  <Button
                    variant="ai"
                    className="w-full font-bold"
                    onClick={handleSelectOptionB}
                  >
                    Select and Deploy Option B
                  </Button>
                }
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-text-secondary">Overall Quality Score</span>
                  <span className="text-3xl font-extrabold text-success font-mono">94%</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Faculty Util</span>
                      <span>92%</span>
                    </div>
                    <ProgressBar value={92} color="success" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Student Comfort</span>
                      <span>91%</span>
                    </div>
                    <ProgressBar value={91} color="success" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Room Util</span>
                      <span>95%</span>
                    </div>
                    <ProgressBar value={95} color="success" />
                  </div>
                </div>
              </Card>

              {/* Option C */}
              <Card footer={<Button variant="outline" className="w-full">Preview Option C</Button>}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono font-bold text-text-muted">Option C</span>
                  <span className="text-2xl font-bold text-warning font-mono">87%</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Faculty Util</span>
                      <span>85%</span>
                    </div>
                    <ProgressBar value={85} color="warning" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Student Comfort</span>
                      <span>84%</span>
                    </div>
                    <ProgressBar value={84} color="warning" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                      <span>Room Util</span>
                      <span>88%</span>
                    </div>
                    <ProgressBar value={88} color="warning" />
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* Side by side comparison table */
            <div className="bg-bg-card border border-border rounded-xl p-5 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-elevated/40 text-xs font-bold text-text-secondary uppercase">
                    <th className="p-4">Metric</th>
                    <th className="p-4">Option A</th>
                    <th className="p-4 text-accent-ai bg-purple-50/20 dark:bg-purple-950/20">Option B (AI Rec)</th>
                    <th className="p-4">Option C</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Overall Score</td>
                    <td className="p-4 text-warning">89%</td>
                    <td className="p-4 text-success font-extrabold bg-purple-50/10 dark:bg-purple-950/10">94% (Best)</td>
                    <td className="p-4 text-warning">87%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Faculty Utilization</td>
                    <td className="p-4">88%</td>
                    <td className="p-4 text-success bg-purple-50/10 dark:bg-purple-950/10">92% (Best)</td>
                    <td className="p-4">85%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Student Comfort</td>
                    <td className="p-4">82%</td>
                    <td className="p-4 text-success bg-purple-50/10 dark:bg-purple-950/10">91% (Best)</td>
                    <td className="p-4">84%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Room Utilization</td>
                    <td className="p-4">91%</td>
                    <td className="p-4 text-success bg-purple-50/10 dark:bg-purple-950/10">95% (Best)</td>
                    <td className="p-4">88%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Unresolved Conflicts</td>
                    <td className="p-4 text-success">0</td>
                    <td className="p-4 text-success bg-purple-50/10 dark:bg-purple-950/10">0</td>
                    <td className="p-4 text-success">0</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-5 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setCompareMode(false)}>Back to Cards</Button>
                <Button variant="ai" onClick={handleSelectOptionB}>Select Option B</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
