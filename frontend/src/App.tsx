import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Bell, User, Search, Sun, Moon, Eye, Layers, BookOpen, 
  DoorOpen, Calendar, Clock, AlertTriangle, RefreshCw, Sliders, 
  History, Settings, Menu, ChevronLeft, ChevronRight, LogOut, ShieldCheck, 
  ListTodo, Info, HelpCircle, CheckSquare, Zap, BookMarked, UserCheck, 
  MapPin, CheckSquare as CheckIcon, Milestone, TrendingUp
} from 'lucide-react';
import { useStore, UserRole } from './store/useStore';
import { SearchBar } from './components/SearchBar';
import { Avatar } from './components/Avatar';
import { Badge } from './components/Badge';
import { ToastContainer } from './components/Toast';

// Import views
import { LoginView } from './views/LoginView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { SetupWizardView } from './views/SetupWizardView';
import { FacultyView } from './views/FacultyView';
import { AvailabilityView } from './views/AvailabilityView';
import { SubjectView } from './views/SubjectView';
import { DivisionView } from './views/DivisionView';
import { RoomView } from './views/RoomView';
import { GeneratorView } from './views/GeneratorView';
import { TimetableView } from './views/TimetableView';
import { ConflictView } from './views/ConflictView';
import { SubstituteWorkflowView } from './views/SubstituteWorkflowView';
import { SimulatorView } from './views/SimulatorView';
import { StudentDashboard } from './views/StudentDashboard';
import { FacultyDashboard } from './views/FacultyDashboard';
import { AIAssistant } from './views/AIAssistant';
import { NotificationsCenterView } from './views/NotificationsCenterView';
import { AnalyticsView } from './views/AnalyticsView';
import { HistoryView } from './views/HistoryView';
import { ImportExportView } from './views/ImportExportView';
import { EventView } from './views/EventView';
import { ExamView } from './views/ExamView';
import { SettingsView } from './views/SettingsView';

export const App: React.FC = () => {
  const { 
    currentView, 
    setView, 
    currentUserRole, 
    setRole, 
    isSidebarCollapsed, 
    toggleSidebar, 
    isDarkMode, 
    toggleDarkMode,
    colorBlindMode,
    toggleColorBlindMode,
    demoStep,
    setDemoStep,
    isAbsenceSimulated,
    substitutionStatus,
    notificationsList,
    timetableCells,
    simulateAbsence,
    applySubstitution
  } = useStore();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Setup evaluation demo steps configs
  const demoStepsInfo = [
    { step: 1, title: 'Auth Portal', desc: 'Sign in to access schedule dashboards.', view: 'login' },
    { step: 2, title: 'KPI Dashboard', desc: 'Click "Generate Timetable" to enter the wizard config.', view: 'dashboard' },
    { step: 3, title: 'AI Generator', desc: 'Tun priorities, select class IT-A, and click "Generate".', view: 'generator' },
    { step: 4, title: 'Results Matrix', desc: 'Verify score breakdown, select Option B (Recommended).', view: 'generator' },
    { step: 5, title: 'Weekly Grid', desc: 'Click on the Monday 11:00 AM block (AI - Mehta) to review.', view: 'timetable-view' },
    { step: 6, title: 'Absence Card', desc: 'Click the red "Simulate Absence" button in details drawer.', view: 'timetable-view' },
    { step: 7, title: 'AI Candidate Search', desc: 'Click the pulsing "Find Best Substitute" button.', view: 'substitute-matching' },
    { step: 8, title: 'Match Ranking', desc: 'Review options analysis, select Prof. Shah (94%).', view: 'substitute-matching' },
    { step: 9, title: 'Before/After Compare', desc: 'Inspect scheduling clash audits, click "Apply & Publish".', view: 'substitute-matching' },
    { step: 10, title: 'Timetable Updated', desc: 'Confirm the slot is successfully verified in the grid.', view: 'timetable-view' },
    { step: 11, title: 'Audit Alert', desc: 'Click the topbell notification icon to verify the logs.', view: 'timetable-view' },
    { step: 12, title: 'Analytics Sync', desc: 'Check Analytics to verify "Lectures Saved" incremented.', view: 'analytics' },
  ];

  const activeDemoInfo = demoStepsInfo.find(d => d.step === demoStep) || demoStepsInfo[0];

  const handleDemoStepChange = (dir: 'next' | 'prev') => {
    let nextStep = demoStep;
    if (dir === 'next' && demoStep < 12) nextStep = demoStep + 1;
    if (dir === 'prev' && demoStep > 1) nextStep = demoStep - 1;

    const info = demoStepsInfo.find(d => d.step === nextStep);
    if (info) {
      setDemoStep(nextStep);
      // Auto pre-populate simulator states if skipping around
      if (nextStep === 6) {
        simulateAbsence('m3'); // Mehta absent
      }
      if (nextStep === 10) {
        applySubstitution('FAC-2023-014'); // Shah substitute
      }
      
      // Auto route
      if (info.view === 'dashboard') {
        if (currentUserRole === 'student') setView('student-dashboard');
        else if (currentUserRole === 'faculty') setView('faculty-dashboard');
        else setView('dashboard');
      } else {
        setView(info.view);
      }
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layers className="w-5 h-5" />, roles: ['admin', 'hod'] },
    { id: 'student-dashboard', label: 'My Schedule', icon: <Layers className="w-5 h-5" />, roles: ['student'] },
    { id: 'faculty-dashboard', label: 'My Lectures', icon: <Layers className="w-5 h-5" />, roles: ['faculty'] },
    { id: 'timetable-view', label: 'Timetable Grid', icon: <Calendar className="w-5 h-5" />, roles: ['admin', 'hod', 'faculty', 'student'] },
    { id: 'generator', label: 'Generate AI', icon: <Sparkles className="w-5 h-5 text-accent-ai animate-pulse" />, roles: ['admin', 'hod'] },
    { id: 'faculty-list', label: 'Faculty Directory', icon: <User className="w-5 h-5" />, roles: ['admin', 'hod'] },
    { id: 'availability', label: 'Availability Matrix', icon: <CheckSquare className="w-5 h-5" />, roles: ['admin', 'hod', 'faculty'] },
    { id: 'subjects', label: 'Subjects & Skills', icon: <BookOpen className="w-5 h-5" />, roles: ['admin', 'hod'] },
    { id: 'divisions', label: 'Class Divisions', icon: <BookMarked className="w-5 h-5" />, roles: ['admin', 'hod'] },
    { id: 'rooms', label: 'Rooms & Labs', icon: <DoorOpen className="w-5 h-5" />, roles: ['admin', 'hod'] },
    { id: 'substitute-matching', label: 'Substitution Center', icon: <RefreshCw className="w-5 h-5" />, roles: ['admin', 'hod'] },
    { id: 'conflicts', label: 'Conflict Center', icon: <AlertTriangle className="w-5 h-5 text-warning" />, roles: ['admin', 'hod'] },
    { id: 'what-if', label: 'What-If Simulator', icon: <Sliders className="w-5 h-5" />, roles: ['admin', 'hod'] },
    { id: 'analytics', label: 'Analytics Insights', icon: <TrendingUp className="w-5 h-5" />, roles: ['admin', 'hod', 'faculty'] },
    { id: 'history', label: 'Version Revisions', icon: <History className="w-5 h-5" />, roles: ['admin'] },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-5 h-5" />, roles: ['admin'] },
  ];

  // Render view router helper
  const renderMainView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboardView />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'faculty-dashboard':
        return <FacultyDashboard />;
      case 'timetable-view':
        return <TimetableView />;
      case 'generator':
        return <GeneratorView />;
      case 'faculty-list':
        return <FacultyView />;
      case 'availability':
        return <AvailabilityView />;
      case 'subjects':
        return <SubjectView />;
      case 'divisions':
        return <DivisionView />;
      case 'rooms':
        return <RoomView />;
      case 'substitute-matching':
        return <SubstituteWorkflowView />;
      case 'conflicts':
        return <ConflictView />;
      case 'what-if':
        return <SimulatorView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      case 'notifications':
        return <NotificationsCenterView />;
      default:
        return <AdminDashboardView />;
    }
  };

  // If view is Login View, render full screen login
  if (currentView === 'login') {
    return (
      <>
        <LoginView />
        {/* Step Banner helper displayed at bottom-right for evaluators during login */}
        <div className="fixed bottom-6 left-6 z-50 bg-bg-card border border-border p-4 shadow-2xl rounded-2xl max-w-sm font-sans flex items-start gap-3 animate-float select-none text-text-primary dark:text-white">
          <span className="text-xl">✨</span>
          <div className="text-xs">
            <p className="font-extrabold text-accent-ai uppercase">Evaluator Demo Launcher</p>
            <p className="text-text-secondary mt-1">This prototype matches the exact click-through testing path. Click **Sign In** (admin pre-filled) to begin.</p>
            <button 
              onClick={() => handleDemoStepChange('next')}
              className="text-xs font-bold text-accent-ai hover:underline mt-2.5 flex items-center gap-1 focus:outline-none"
            >
              Skip Login Step <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </>
    );
  }

  const unreadNotifsCount = notificationsList.filter(n => n.unread).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none relative ${colorBlindMode ? 'color-blind-active' : ''}`}>
      {/* 1. Evaluator Demo Guide Banner */}
      <div className="bg-gradient-to-r from-primary to-accent-ai text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border-b border-white/10 z-30">
        <div className="flex items-center gap-2">
          <Milestone className="w-5 h-5 text-accent-ai-glow animate-pulse" />
          <div className="text-xs">
            <span className="font-extrabold tracking-wide text-accent-ai-glow">DEMO FLOW STEP {demoStep}/12:</span>
            <span className="font-bold ml-1.5">{activeDemoInfo.title}</span>
            <span className="text-slate-300 ml-2">— {activeDemoInfo.desc}</span>
          </div>
        </div>

        {/* Navigation keys */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => handleDemoStepChange('prev')}
            disabled={demoStep === 1}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Demo Step"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleDemoStepChange('next')}
            disabled={demoStep === 12}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Demo Step"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          {/* Quick status lock */}
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold ml-2">
            STABLE
          </span>
        </div>
      </div>

      {/* Main app grid shell */}
      <div className="flex-grow flex relative">
        
        {/* 2. Sidebar Navigation */}
        <aside 
          className={`hidden md:flex flex-col justify-between bg-bg-card border-r border-border h-[calc(100vh-52px)] sticky top-[52px] z-20 transition-all duration-normal
            ${isSidebarCollapsed ? 'w-20' : 'w-[260px]'}
          `}
        >
          {/* Menu items */}
          <div className="py-4 space-y-1 overflow-y-auto flex-grow scrollbar-none">
            {navItems
              .filter(item => item.roles.includes(currentUserRole))
              .map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center py-3 px-4 text-sm font-semibold transition-all relative border-l-3 focus:outline-none select-none
                      ${isActive 
                        ? 'text-accent-ai bg-purple-50/10 border-l-accent-ai dark:bg-purple-950/5' 
                        : 'text-text-secondary border-l-transparent hover:bg-bg-elevated hover:text-text-primary'
                      }
                      ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3'}
                    `}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isSidebarCollapsed && <span>{item.label}</span>}

                    {/* Active highlight */}
                    {isActive && !isSidebarCollapsed && (
                      <motion.div
                        layoutId="sidebarActiveHighlight"
                        className="absolute right-0 top-0 bottom-0 w-1 bg-accent-ai"
                      />
                    )}
                  </button>
                );
              })}
          </div>

          {/* Collapse switch footer */}
          <div className="p-4 border-t border-border flex items-center justify-between gap-2">
            {!isSidebarCollapsed && (
              <button
                onClick={toggleColorBlindMode}
                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors focus:outline-none
                  ${colorBlindMode ? 'bg-warning text-white border-warning' : 'bg-transparent text-text-secondary border-border hover:bg-bg-elevated'}
                `}
              >
                ♿ Color-Blind Mode
              </button>
            )}

            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded bg-bg-elevated text-text-secondary hover:text-text-primary self-center mx-auto focus:outline-none"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Main display panel */}
        <div className="flex-grow flex flex-col min-w-0">
          
          {/* 3. Topbar Header */}
          <header className="h-16 bg-bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-20">
            {/* Left Brand info */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1 rounded hover:bg-bg-elevated text-text-secondary"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary to-accent-ai text-white shadow-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-primary to-accent-ai bg-clip-text text-transparent">
                  SmartSched AI
                </span>
              </div>
            </div>

            {/* Middle Search options */}
            <SearchBar className="hidden md:block" />

            {/* Right toolbar metrics controls */}
            <div className="flex items-center gap-4">
              {/* Semester quick selector */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-secondary font-bold">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span>Sem 5 (2025-26)</span>
              </div>

              {/* Theme toggle switch */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-text-secondary hover:bg-bg-elevated transition-colors focus:outline-none"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Topbell notification badge dropdown selector */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2 rounded-full text-text-secondary hover:bg-bg-elevated transition-colors relative focus:outline-none
                    ${demoStep === 11 ? 'ring-4 ring-accent-ai shadow-ai animate-pulse-glow bg-purple-50/20' : ''}
                  `}
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
                  )}
                </button>

                {/* Notifications overlay panel dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-80 bg-bg-card border border-border shadow-2xl rounded-xl z-50 overflow-hidden py-1"
                      >
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-bg-primary/20">
                          <span className="text-xs font-bold text-text-primary">Alert Updates</span>
                          <button
                            onClick={() => {
                              setView('notifications');
                              setNotificationsOpen(false);
                              if (demoStep === 11) setDemoStep(12); // Advance demo
                            }}
                            className="text-[10px] uppercase font-bold text-accent-ai hover:underline"
                          >
                            View All Center
                          </button>
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto divide-y divide-border">
                          {notificationsList.slice(0, 3).map((notif) => (
                            <div 
                              key={notif.id} 
                              onClick={() => {
                                setView('notifications');
                                setNotificationsOpen(false);
                                if (demoStep === 11) setDemoStep(12); // Advance demo
                              }}
                              className={`p-3 text-xs cursor-pointer hover:bg-bg-elevated/20 transition-colors
                                ${notif.unread ? 'bg-blue-50/20 dark:bg-blue-950/10 font-bold' : ''}
                              `}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-text-primary">{notif.title}</span>
                                <span className="text-[9px] text-text-muted font-mono">{notif.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-text-secondary mt-1 truncate">{notif.message}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile selector dropdown menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-1.5 focus:outline-none"
                >
                  <Avatar name="Admin User" size="sm" status="online" />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-bg-card border border-border shadow-xl rounded-xl z-50 py-1"
                      >
                        {/* Role switches */}
                        <div className="px-4 py-2 border-b border-border">
                          <span className="text-[9px] font-bold text-text-muted uppercase block">Select User Role</span>
                          <select
                            value={currentUserRole}
                            onChange={(e) => {
                              setRole(e.target.value as UserRole);
                              setProfileMenuOpen(false);
                            }}
                            className="w-full mt-1 bg-transparent border-none text-xs font-semibold text-text-primary p-0 focus:ring-0 cursor-pointer"
                          >
                            <option value="admin">Administrator</option>
                            <option value="hod">IT HOD</option>
                            <option value="faculty">Faculty Ananya</option>
                            <option value="student">IT Student</option>
                          </select>
                        </div>

                        <button
                          onClick={() => {
                            setView('login');
                            setProfileMenuOpen(false);
                            setDemoStep(1);
                          }}
                          className="w-full px-4 py-2.5 text-xs text-danger font-bold hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* 4. Main Scrollable Dashboard Content */}
          <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-[1440px] w-full mx-auto">
            {renderMainView()}
          </main>

          {/* Footer */}
          <footer className="py-4 px-8 border-t border-border bg-bg-card text-center text-xs text-text-muted font-bold font-mono">
            © 2026 SmartSched AI. Powered by Advanced Optimization Engine. v3.0.0
          </footer>
        </div>
      </div>

      {/* Global Slide AI Assistant panels and microphone recording triggers */}
      <AIAssistant />

      {/* Mobile sidebar nav drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-primary-dark/30 backdrop-blur-[2px]" onClick={() => setMobileMenuOpen(false)} />
            
            {/* Sidebar Body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="relative w-64 bg-bg-card border-r border-border h-full flex flex-col p-4 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="font-extrabold text-sm text-primary">SmartSched AI Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-text-muted hover:text-text-primary p-1"><ChevronLeft className="w-5 h-5" /></button>
              </div>
              <div className="flex-grow overflow-y-auto space-y-1">
                {navItems
                  .filter(item => item.roles.includes(currentUserRole))
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 py-2 px-3 text-xs font-bold text-text-secondary hover:bg-bg-elevated hover:text-text-primary rounded-lg text-left"
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
