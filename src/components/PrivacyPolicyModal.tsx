import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck, X, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#0b1426] border border-cyan-500/20 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Ethical AI & Privacy Charter
            </h3>
            <p className="text-xs text-cyan-300 font-mono">
              FERPA Compliant · Non-Intrusive Learning Analytics
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. Non-Sensitive Academic Indicators Only</span>
            </div>
            <p className="text-xs text-slate-400 pl-6">
              EngageAI strictly limits telemetry to objective course milestones: lecture attendance timestamps, LMS assignment upload latency, and LMS content access timestamps.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <EyeOff className="w-4 h-4 shrink-0" />
              <span>2. Absolute Zero Surveillance Policy</span>
            </div>
            <p className="text-xs text-slate-400 pl-6">
              We never access webcams, audio feeds, keystroke logs, browser histories, private emails, or personal student devices.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>3. Human-in-the-Loop Interventions</span>
            </div>
            <p className="text-xs text-slate-400 pl-6">
              The AI never automates punitive actions, grading deductions, or official warnings. It only flags subtle behavioral changes to empower empathetic faculty advising.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Lock className="w-4 h-4 shrink-0" />
              <span>4. Role-Based Access Isolation</span>
            </div>
            <p className="text-xs text-slate-400 pl-6">
              Faculty members only view engagement trajectories for cohorts they actively instruct. Institutional data is end-to-end encrypted at rest and in transit.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
        >
          Understood & Verified
        </button>
      </div>
    </div>
  );
}
