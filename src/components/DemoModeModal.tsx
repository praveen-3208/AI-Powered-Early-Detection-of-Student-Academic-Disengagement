import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight, 
  Users, 
  AlertTriangle, 
  TrendingDown, 
  Layers,
  Database
} from 'lucide-react';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDemo?: () => void;
}

export default function DemoModeModal({ isOpen, onClose, onConfirmDemo }: DemoModeModalProps) {
  const [step, setStep] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    if (isOpen) {
      setStep('loading');
      const timer = setTimeout(() => {
        setStep('ready');
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#0b1426] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'loading' ? (
          <div className="py-8 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-indigo-400 animate-spin animate-reverse" />
              <div className="flex items-center justify-center h-full">
                <Database className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Mounting Hackathon Demo Cohort...
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Synthesizing 142 anonymized student indicator streams
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Demo Mode Active
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  Cohort Environment Ready
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You are accessing EngageAI under the simulated credentials of{' '}
              <span className="text-cyan-300 font-semibold">Dr. Sarah Chen</span>, Associate Professor of Computer Science.
            </p>

            {/* Demo data preview card */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-medium text-slate-200">Loaded Sample Course:</span>
                <span className="font-mono text-cyan-300">CS 204: Algorithms & Systems</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Monitored Students
                  </span>
                  <span className="text-sm font-bold text-white font-mono">142 Enrolled</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Early Flags (14-Day)
                  </span>
                  <span className="text-sm font-bold text-amber-400 font-mono">7 Pre-Crisis</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-cyan-950/30 border border-cyan-500/20 p-2.5 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Demo state primed for Dashboard navigation. In the next milestone, this seamlessly routes to the cohort analytics overview.
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onConfirmDemo) onConfirmDemo();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
