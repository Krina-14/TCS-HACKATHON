import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ShieldCheck, Zap, RefreshCw, Layers } from 'lucide-react';
import { useStore, UserRole } from '../store/useStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const LoginView: React.FC = () => {
  const { setRole, setView, setDemoStep } = useStore();
  
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('admin@smartsched.ai');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const rolesList: { id: UserRole; label: string; color: string }[] = [
    { id: 'admin', label: 'Admin', color: 'accent-ai' },
    { id: 'hod', label: 'HOD', color: 'info' },
    { id: 'faculty', label: 'Faculty', color: 'success' },
    { id: 'student', label: 'Student', color: 'warning' },
  ];

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setError('');
    // Prefill default email based on role
    if (role === 'admin') setEmail('admin@smartsched.ai');
    if (role === 'hod') setEmail('hod.it@smartsched.ai');
    if (role === 'faculty') setEmail('ananya.shah@smartsched.ai');
    if (role === 'student') setEmail('student.sem5@smartsched.ai');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      setIsSubmitting(false);
      setRole(activeRole);
      setDemoStep(2); // Move demo to admin dashboard step
    }, 1000);
  };

  const currentRoleColor = 
    activeRole === 'admin' ? 'border-accent-ai text-accent-ai' :
    activeRole === 'hod' ? 'border-blue-500 text-blue-500' :
    activeRole === 'faculty' ? 'border-success text-success' : 'border-warning text-warning';

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-10 bg-primary-dark select-none relative overflow-hidden font-sans">
      {/* Background Animated Grid Pattern */}
      <div className="absolute inset-0 grid-glow opacity-30" />

      {/* Left Column (60% Desktop) - Visual Panel */}
      <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-12 text-white relative z-10">
        {/* Header Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-accent-ai-glow">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
            SmartSched AI
          </span>
        </div>

        {/* Hero Section */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
              SmartSched AI
            </h1>
            <p className="text-xl text-slate-300 mt-4 leading-relaxed font-semibold">
              Don't cancel the lecture. Adapt the schedule intelligently.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-accent-ai-glow" /> AI-Powered
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Conflict-Free
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
              <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" /> Real-time Sync
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Zero-Waste Lectures
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div>
          <p className="text-slate-400 text-xs font-mono">
            GENERATE → MONITOR → DETECT → PREDICT → MATCH → SUBSTITUTE → UPDATE → NOTIFY
          </p>
          <p className="text-slate-500 text-xs mt-2">
            © 2026 SmartSched AI. Powered by Advanced Scheduling Optimization Engine.
          </p>
        </div>
      </div>

      {/* Right Column (40% Desktop) - Login Card Panel */}
      <div className="lg:col-span-4 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="w-full max-w-[450px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Glow Circle in panel */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent-ai/20 blur-2xl" />

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent-ai to-primary-light flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">Welcome back</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in to manage college scheduling workflows</p>
          </div>

          {/* Role selector tabs */}
          <div className="flex bg-white/5 border border-white/5 rounded-lg p-1 gap-1 mb-6 relative z-10">
            {rolesList.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleChange(role.id)}
                className={`flex-grow py-2 text-xs font-semibold rounded transition-colors text-center justify-center flex relative
                  ${activeRole === role.id ? 'text-white' : 'text-slate-400 hover:text-white'}
                `}
              >
                {role.label}
                {activeRole === role.id && (
                  <motion.div
                    layoutId="loginActiveRoleBorder"
                    className={`absolute bottom-0 left-2 right-2 h-0.5 ${
                      activeRole === 'admin' ? 'bg-accent-ai' :
                      activeRole === 'hod' ? 'bg-blue-400' :
                      activeRole === 'faculty' ? 'bg-success' : 'bg-warning'
                    }`}
                  />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            {/* Email Input */}
            <Input
              label="Academic Email Address"
              value={email}
              onChange={setEmail}
              error={error && !email ? 'Email is required' : ''}
              leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
              type="email"
              disabled={isSubmitting}
            />

            {/* Password Input */}
            <Input
              label="Password"
              value={password}
              onChange={setPassword}
              error={error && !password ? 'Password is required font-semibold' : ''}
              leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
              type="password"
              disabled={isSubmitting}
            />

            {/* Remember Me and Forgot pass */}
            <div className="flex justify-between items-center text-xs text-slate-300">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-white/5 border-white/10 text-accent-ai focus:ring-accent-ai w-3.5 h-3.5"
                />
                Remember me
              </label>
              <span className="hover:text-white cursor-pointer hover:underline">Forgot password?</span>
            </div>

            {/* Error Message */}
            {error && !(!email || !password) && (
              <p className="text-xs text-red-400 font-bold bg-red-950/20 p-2.5 rounded border border-red-900/30 flex items-center gap-1.5">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant={activeRole === 'admin' ? 'ai' : 'primary'}
              size="lg"
              className="w-full mt-2 font-bold"
              isLoading={isSubmitting}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setRole(activeRole);
                setDemoStep(2);
              }}
              className="flex justify-center items-center gap-2 bg-white/5 border border-white/5 hover:bg-white/10 p-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.12 1 1.16 5.96 1.16 12s4.96 11 11.08 11c6.39 0 10.64-4.5 10.64-10.84 0-.73-.08-1.285-.18-1.875H12.24z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => {
                setRole(activeRole);
                setDemoStep(2);
              }}
              className="flex justify-center items-center gap-2 bg-white/5 border border-white/5 hover:bg-white/10 p-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 23 23" fill="currentColor">
                <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
              </svg>
              SSO Portal
            </button>
          </div>

          <div className="text-center mt-6 text-xs text-slate-400">
            Don't have an account?{' '}
            <span className="text-white hover:underline cursor-pointer font-bold">Request Access</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
