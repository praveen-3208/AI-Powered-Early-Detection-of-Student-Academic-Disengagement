import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  AlertCircle,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import ForgotPasswordModal from './ForgotPasswordModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import StudentPortalModal from './StudentPortalModal';
import DemoModeModal from './DemoModeModal';
import { ALL_STUDENT_REG_NOS } from '../data/demoAcademicData';

export interface AuthUser {
  name: string;
  email: string;
  role: 'FACULTY' | 'STUDENT';
  studentRegNo?: string;
}

interface FacultyLoginCardProps {
  onLoginSuccess?: (user: AuthUser) => void;
}

export default function FacultyLoginCard({ onLoginSuccess }: FacultyLoginCardProps) {
  // Role Mode: Faculty vs Student
  const [roleMode, setRoleMode] = useState<'faculty' | 'student'>('faculty');
  const [studentRegNo, setStudentRegNo] = useState('922525106003');
  const [studentPin, setStudentPin] = useState('1234');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Modals
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Email format validation regex
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError) {
      if (!val) {
        setEmailError('Official campus email is required');
      } else if (!isValidEmail(val)) {
        setEmailError('Please enter a valid academic email (e.g. dr.patel@university.edu)');
      } else {
        setEmailError('');
      }
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordError) {
      if (!val) {
        setPasswordError('Password is required');
      } else if (val.length < 6) {
        setPasswordError('Password must be at least 6 characters');
      } else {
        setPasswordError('');
      }
    }
  };

  const validateForm = () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError('Official campus email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid academic email (e.g. dr.patel@university.edu)');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate faculty authentication verification
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({
            name: email.includes('chen') ? 'Dr. Sarah Chen' : 'Dr. Faculty Member',
            email: email,
            role: 'FACULTY',
          });
        }
      }, 700);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      setEmail('dr.chen@polytechnic.edu');
      setPassword('FacultyDemo2026!');
      setLoginSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({
            name: 'Dr. Sarah Chen',
            email: 'dr.chen@polytechnic.edu',
            role: 'FACULTY',
          });
        }
      }, 700);
    }, 900);
  };

  const handleAutofillDemo = () => {
    setEmail('dr.chen@polytechnic.edu');
    setPassword('FacultyDemo2026!');
    setEmailError('');
    setPasswordError('');
  };

  const handleEnterDemoDirect = () => {
    setIsDemoModalOpen(true);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Subtle outer glow backdrop */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-indigo-500/20 blur-xl opacity-75 pointer-events-none" />

      {/* Floating Glassmorphism Login Card */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 text-left transition-all duration-300">
        {/* Top Hairline accent */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        {/* Portal Distinction Pill & Student Access Switcher */}
        <div className="flex items-center justify-between gap-2 mb-6">
          {/* Role Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setRoleMode('faculty')}
              className={`px-3 py-1 rounded-lg transition-all ${
                roleMode === 'faculty'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Faculty Portal
            </button>
            <button
              type="button"
              onClick={() => setRoleMode('student')}
              className={`px-3 py-1 rounded-lg transition-all ${
                roleMode === 'student'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Student Portal
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
            {roleMode === 'faculty' ? 'Full Cohort Access' : 'Personal Record Only'}
          </div>
        </div>

        {/* Card Header */}
        <div className="space-y-1.5 mb-6 text-left">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30 text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
              {roleMode === 'faculty' ? 'Academic Advising Suite' : 'Student Academic Self-Portal'}
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            {roleMode === 'faculty' ? 'Faculty Sign In' : 'Student Access'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {roleMode === 'faculty'
              ? 'Sign in to review academic engagement insights across all cohorts.'
              : 'Enter your Registration Number to view your personal academic scores.'}
          </p>
        </div>

        {/* Student Mode Form */}
        {roleMode === 'student' ? (
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono text-slate-200 mb-1.5 font-semibold">
                STUDENT REGISTRATION NUMBER:
              </label>
              <select
                value={studentRegNo}
                onChange={(e) => setStudentRegNo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {ALL_STUDENT_REG_NOS.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white font-mono">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-200 mb-1.5 font-semibold">
                STUDENT PIN / PASSCODE:
              </label>
              <input
                type="password"
                value={studentPin}
                onChange={(e) => setStudentPin(e.target.value)}
                placeholder="1234"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Default prototype PIN: 1234
              </span>
            </div>

            {/* Quick selection chips for hackathon testing */}
            <div className="pt-1 text-[11px] font-mono">
              <span className="text-slate-400 block mb-1">Quick Select Demo Records:</span>
              <div className="flex flex-wrap gap-1.5">
                {['922525106003', '922525106007', '922525106019', '922525106021'].map((demoReg) => (
                  <button
                    key={demoReg}
                    type="button"
                    onClick={() => setStudentRegNo(demoReg)}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                      studentRegNo === demoReg
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {demoReg}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy note */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Role-Based Access Control:</strong> Students can view only their own individual metrics. Class cohort data is strictly hidden.
              </span>
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={() => {
                if (onLoginSuccess) {
                  onLoginSuccess({
                    name: `Reg No ${studentRegNo}`,
                    email: `${studentRegNo}@student.polytechnic.edu`,
                    role: 'STUDENT',
                    studentRegNo,
                  });
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 group mt-2"
            >
              <span>Access Student Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <>
            {/* Success Banner if authenticated */}
            {loginSuccess && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Faculty credentials verified. Launching cohort telemetry environment...
                </span>
              </div>
            )}

        {/* Main Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Official Email Input */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5">
              Official Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="dr.patel@university.edu"
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none ${
                  emailError
                    ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/20'
                    : ''
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            {emailError && (
              <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {emailError}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-200">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className={`w-full pl-10 pr-11 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none ${
                  passwordError
                    ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/20'
                    : ''
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember me Checkbox */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900/80 text-cyan-500 focus:ring-cyan-500/30 focus:ring-offset-0 focus:ring-1 transition-colors cursor-pointer accent-cyan-500"
              />
              <span className="text-xs text-slate-300 group-hover:text-slate-200 transition-colors">
                Remember me on this institutional device
              </span>
            </label>
          </div>

          {/* Primary Button: Sign In to Dashboard */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full relative group overflow-hidden py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Faculty Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Below button: Secure faculty access */}
            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-slate-400">
              <LockKeyhole className="w-3.5 h-3.5 text-cyan-400/80" />
              <span>Secure faculty access</span>
            </div>
          </div>
        </form>

        {/* Divider: or */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#0a1224] text-slate-400 uppercase tracking-widest font-mono text-[10px]">
              or
            </span>
          </div>
        </div>

        {/* Secondary button: Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          {isGoogleLoading ? (
            <span className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Hackathon Demo Access Section */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="rounded-2xl bg-gradient-to-b from-cyan-950/30 to-indigo-950/20 border border-cyan-500/25 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wide">
                  Hackathon Demo
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
              >
                Autofill Credentials
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/40 hover:border-cyan-300 text-xs sm:text-sm font-semibold text-white transition-all shadow-md shadow-cyan-950/40 flex items-center justify-center gap-2 group"
            >
              <span className="text-cyan-300 font-medium">Enter Demo Mode</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-normal">
              Explore the faculty dashboard using sample academic data.
            </p>
          </div>
        </div>
        </>
        )}

        {/* Trust / Privacy Message */}
        <div className="mt-5 pt-4 border-t border-slate-800/60 text-center">
          <button
            type="button"
            onClick={() => setIsPrivacyOpen(true)}
            className="group inline-flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400/90 group-hover:scale-110 transition-transform" />
            <span className="leading-tight">
              Privacy-first by design • Non-sensitive academic data • Human-reviewed intervention
            </span>
          </button>
        </div>
      </div>

      {/* Sub-modals */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        defaultEmail={email}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <StudentPortalModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      />
      <DemoModeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onConfirmDemo={() => {
          if (onLoginSuccess) {
            onLoginSuccess({
              name: 'Dr. Sarah Chen',
              email: 'dr.chen@polytechnic.edu',
              role: 'FACULTY',
            });
          }
        }}
      />
    </div>
  );
}
