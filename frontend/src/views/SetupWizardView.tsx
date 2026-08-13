import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Save, Sparkles, Plus, Trash2, CalendarDays, Sliders, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { Badge } from '../components/Badge';

export const SetupWizardView: React.FC = () => {
  const { setView, setDemoStep } = useStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-12-15');
  const [semesterCode, setSemesterCode] = useState('Odd Semester');
  
  // Working days
  const [workingDays, setWorkingDays] = useState({
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false
  });

  const stepsList = [
    { num: 1, label: 'Academic Year' },
    { num: 2, label: 'Semester' },
    { num: 3, label: 'Departments' },
    { num: 4, label: 'Divisions' },
    { num: 5, label: 'Subjects' },
    { num: 6, label: 'Faculty' },
    { num: 7, label: 'Rooms/Labs' },
    { num: 8, label: 'Working Days' },
    { num: 9, label: 'Constraints' },
    { num: 10, label: 'Review & Generate' },
  ];

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setView('generator');
    setDemoStep(3); // Advance evaluator demo
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Academic Setup Wizard
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Initialize college data records step-by-step.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Save className="w-4 h-4" />}>
          Save Draft
        </Button>
      </div>

      {/* 10-Step horizontal connector timeline */}
      <div className="bg-bg-card border border-border rounded-xl p-4 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[900px] px-6 py-2 relative">
          {/* Connector line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-10 right-10 h-0.5 bg-border -z-10" />
          
          {/* Completed connector fill */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-10 h-0.5 bg-primary transition-all duration-normal -z-10"
            style={{ width: `${((currentStep - 1) / 9) * 100}%` }}
          />

          {stepsList.map((step) => {
            const isCompleted = step.num < currentStep;
            const isActive = step.num === currentStep;

            return (
              <div 
                key={step.num} 
                onClick={() => isCompleted && setCurrentStep(step.num)}
                className={`flex flex-col items-center gap-1.5 cursor-pointer z-10`}
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${isCompleted ? 'bg-primary text-white border-primary' : 
                      isActive ? 'bg-accent-ai text-white border-accent-ai shadow-ai animate-pulse-glow' : 'bg-bg-elevated border border-border text-text-muted dark:bg-slate-800'}
                  `}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-tight
                  ${isActive ? 'text-accent-ai font-bold' : isCompleted ? 'text-primary' : 'text-text-muted'}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Academic Year */}
            {currentStep === 1 && (
              <Card header={{ title: 'Step 1: Academic Year Scope', subtitle: 'Define year boundaries for scheduling' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
                  <Input label="Academic Year Name" value={academicYear} onChange={setAcademicYear} />
                  <Input label="Start Date" type="date" value={startDate} onChange={setStartDate} />
                  <Input label="End Date" type="date" value={endDate} onChange={setEndDate} />
                </div>
              </Card>
            )}

            {/* Step 2: Semester */}
            {currentStep === 2 && (
              <Card header={{ title: 'Step 2: Semester Settings', subtitle: 'Define semester details' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                  <Input label="Semester Description" value={semesterCode} onChange={setSemesterCode} />
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Scope Semesters</label>
                    <select className="w-full h-12 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary">
                      <option>Odd Semesters (1, 3, 5, 7)</option>
                      <option>Even Semesters (2, 4, 6, 8)</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: Departments */}
            {currentStep === 3 && (
              <Card header={{ title: 'Step 3: Target Departments', subtitle: 'Manage department scopes' }}>
                <div className="space-y-4 max-w-md">
                  {['Information Technology', 'Computer Science', 'Electronics & Comm.', 'Mechanical Eng.'].map((dept, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-border rounded-lg bg-bg-elevated/10">
                      <span className="text-xs font-bold text-text-primary">{dept}</span>
                      <button className="text-text-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button className="text-xs font-bold text-accent-ai flex items-center gap-1 hover:underline">
                    <Plus className="w-4 h-4" /> Add Department
                  </button>
                </div>
              </Card>
            )}

            {/* Step 4-8 placeholder summaries for layout */}
            {currentStep >= 4 && currentStep <= 8 && (
              <Card header={{ title: `Step ${currentStep}: ${stepsList[currentStep-1].label}`, subtitle: 'Configure parameters' }}>
                <div className="py-8 text-center text-text-secondary">
                  <Settings className="w-10 h-10 mx-auto opacity-30 animate-spin-slow mb-3" />
                  <p className="text-sm font-semibold">Standard configuration metrics for academic data fields.</p>
                  <p className="text-xs text-text-muted mt-1">Click "Next" to continue wizard completion.</p>
                </div>
              </Card>
            )}

            {/* Step 9: Constraints */}
            {currentStep === 9 && (
              <Card header={{ title: 'Step 9: Tuning Optimizer Weights', subtitle: 'Optimize schedules for student confort and instructor preference' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase mb-4">Hard constraints (Unviolable)</h4>
                    <ul className="space-y-3 text-xs text-text-secondary">
                      <li className="flex items-center gap-2">✓ No double-booked instructors</li>
                      <li className="flex items-center gap-2">✓ No double-booked rooms</li>
                      <li className="flex items-center gap-2">✓ Adhere to faculty leave slots</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase mb-4">Soft constraints priorities</h4>
                    <div className="space-y-3 text-xs">
                      <p>Faculty preferences: 80%</p>
                      <p>Workload balance: 85%</p>
                      <p>Student comfort: 90%</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 10: Review */}
            {currentStep === 10 && (
              <Card header={{ title: 'Step 10: Review Parameters & Deploy', subtitle: 'Verify configuration before generating live schedules' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border border-border rounded-xl bg-bg-elevated/20">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Scope Details</span>
                    <p className="font-bold text-xs text-text-primary mt-2">Odd Semesters (2025-26)</p>
                    <p className="text-[10px] text-text-secondary mt-1">Duration: Aug 2025 - Dec 2025</p>
                  </div>
                  <div className="p-4 border border-border rounded-xl bg-bg-elevated/20">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Total Elements</span>
                    <p className="font-bold text-xs text-text-primary mt-2">48 Faculty • 72 Subjects</p>
                    <p className="text-[10px] text-text-secondary mt-1">35 Classrooms & Labs registered</p>
                  </div>
                  <div className="p-4 border border-border rounded-xl bg-bg-elevated/20 flex flex-col justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Optimization priority</span>
                      <p className="font-bold text-xs text-success mt-2">Comfort-first Score: 90%</p>
                    </div>
                    <Badge variant="success" size="sm" className="mt-2">Ready</Badge>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center border-t border-border pt-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {currentStep === 10 ? (
          <Button
            variant="ai"
            onClick={handleFinish}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Launch AI Generator
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next Step
          </Button>
        )}
      </div>
    </div>
  );
};
