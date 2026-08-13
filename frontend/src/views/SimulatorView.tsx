import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Sparkles, TrendingUp, AlertTriangle, Check, RefreshCw, Clock, ArrowRight, Play, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const SimulatorView: React.FC = () => {
  const { runSimulation, whatIfResults } = useStore();
  const [scenarioText, setScenarioText] = useState('Prof. Amit Mehta is unavailable for 3 days starting tomorrow');
  const [isRunning, setIsRunning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      runSimulation(scenarioText);
    }, 1500);
  };

  const handleApply = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="space-y-6 font-sans select-none relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white flex items-center gap-2">
            🔮 What-If Simulator
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Test custom schedule adjustments and model capacity changes on sandbox data.
          </p>
        </div>
      </div>

      {/* Scenario Builder Form */}
      <Card header={{ title: 'Simulation Query Builder', subtitle: 'Select or write custom scheduling sandbox parameters' }}>
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-2">What happens if...</label>
            <select
              value={scenarioText}
              onChange={(e) => setScenarioText(e.target.value)}
              className="w-full h-12 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary focus:border-accent-ai focus:ring-accent-ai mb-4"
            >
              <option value="Prof. Amit Mehta is unavailable for 3 days starting tomorrow">Prof. Amit Mehta is unavailable for 3 days starting tomorrow</option>
              <option value="Room B-204 is closed for construction maintenance">Room B-204 is closed for construction maintenance</option>
              <option value="Wednesday becomes an official university holiday">Wednesday becomes an official university holiday</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ai"
              onClick={handleRun}
              isLoading={isRunning}
              leftIcon={<Play className="w-4 h-4 fill-current" />}
            >
              Run AI Simulation
            </Button>
          </div>
        </div>
      </Card>

      {/* Simulation Results (if run is completed) */}
      <AnimatePresence>
        {whatIfResults && !isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Impact Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <Card className="text-center p-4 border-l-4 border-l-danger">
                <span className="text-2xl font-extrabold text-danger font-mono">8</span>
                <span className="text-[10px] font-bold text-text-secondary block mt-1 uppercase">Affected Classes</span>
              </Card>
              <Card className="text-center p-4 border-l-4 border-l-warning">
                <span className="text-2xl font-extrabold text-warning font-mono">4</span>
                <span className="text-[10px] font-bold text-text-secondary block mt-1 uppercase">Divisions Impacted</span>
              </Card>
              <Card className="text-center p-4 border-l-4 border-l-danger">
                <span className="text-2xl font-extrabold text-danger font-mono">180</span>
                <span className="text-[10px] font-bold text-text-secondary block mt-1 uppercase">Students Disrupted</span>
              </Card>
              <Card className="text-center p-4 border-l-4 border-l-danger">
                <span className="text-2xl font-extrabold text-danger font-mono">6</span>
                <span className="text-[10px] font-bold text-text-secondary block mt-1 uppercase">Clashes Generated</span>
              </Card>
            </div>

            {/* Impact Gauges & Recommendation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gauges comparison */}
              <Card header={{ title: 'Impact Comparison Metrics', subtitle: 'Calculated schedule disruption index' }} className="lg:col-span-2 flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="text-center">
                  <span className="text-xs font-bold text-text-secondary uppercase">Sandbox Disruption</span>
                  <p className="text-3xl font-extrabold text-danger mt-2 font-mono">38%</p>
                  <p className="text-[9px] text-text-muted mt-1 uppercase font-bold">Red Alert Zone</p>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-accent-ai dark:bg-purple-950/20 font-extrabold">→</div>

                <div className="text-center">
                  <span className="text-xs font-bold text-text-secondary uppercase">Optimized Disruption</span>
                  <p className="text-3xl font-extrabold text-success mt-2 font-mono">8%</p>
                  <p className="text-[9px] text-text-muted mt-1 uppercase font-bold">Emerald Green Zone</p>
                </div>
              </Card>

              {/* Recommendation summary card */}
              <Card 
                className="border-l-4 border-l-accent-ai ring-2 ring-accent-ai" 
                header={{ 
                  title: (
                    <div className="flex items-center gap-1 text-accent-ai">
                      <Sparkles className="w-4 h-4" /> AI Suggestion
                    </div>
                  ) 
                }}
              >
                <p className="text-xs font-bold text-text-primary">"Reassign 6 lectures and reschedule 2."</p>
                <p className="text-[10px] text-text-secondary leading-relaxed mt-2">Relocate affected morning classes to Prof. Shah and Prof. Patel. Move remaining 2 blocks to vacant slots on Tuesday afternoon.</p>
                
                <div className="mt-6 flex justify-end gap-2 border-t border-border-light pt-3">
                  <Button variant="outline" size="sm">Save Scenario</Button>
                  <Button variant="ai" size="sm" onClick={handleApply}>Apply to Live</Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation History list table */}
      <Card header={{ title: 'Simulation Sandbox Logs', subtitle: 'Chronological list of modeled test adjustments' }}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-bg-elevated/40 border-b border-border text-xs font-bold text-text-secondary uppercase">
              <th className="p-3">Scenario Detail</th>
              <th className="p-3">Calculation Date</th>
              <th className="p-3 text-center">Disruption Index</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-secondary">
            <tr className="hover:bg-bg-elevated/10">
              <td className="p-3 font-semibold text-text-primary">Prof. Amit Mehta absent for 3 days starting tomorrow</td>
              <td className="p-3 font-mono">Aug 13, 2026</td>
              <td className="p-3 text-center text-success font-bold font-mono">8% (Optimized)</td>
              <td className="p-3 text-right"><button className="text-accent-ai font-bold hover:underline">View logs</button></td>
            </tr>
            <tr className="hover:bg-bg-elevated/10 opacity-75">
              <td className="p-3">Friday classes converted to online self-study</td>
              <td className="p-3 font-mono">Aug 12, 2026</td>
              <td className="p-3 text-center text-success font-bold font-mono">2% (Optimized)</td>
              <td className="p-3 text-right"><button className="text-accent-ai font-bold hover:underline">View logs</button></td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Live Timetable Update"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            ⚠️ <strong>Warning:</strong> You are about to apply this optimized sandbox simulation to the **LIVE** university timetable database.
          </p>
          <p className="text-xs text-text-muted">
            This will automatically send notification alerts to 4 affected instructors, 4 divisions, and update live student timetables.
          </p>
          
          <div className="pt-6 border-t border-border flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              onClick={() => {
                setShowConfirmation(false);
                addToast('success', 'Changes Applied', 'The simulation model has been successfully published to the live portal.');
              }}
            >
              Confirm and Publish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Mock toast helper inside views
const addToast = (type: string, title: string, desc: string) => {
  // Mock alert
  alert(`${title}: ${desc}`);
};
