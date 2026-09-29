import React, { useState, useEffect } from 'react';
import { 
  X, 
  HeartHandshake, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Layers,
  ArrowRightCircle,
  TrendingUp,
  Save
} from 'lucide-react';
import { SupportPlanItem, SupportPlanStatus, ProgressStatus } from '../../data/demoInterventions';

interface SupportPlanDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SupportPlanItem | null;
  onUpdateStatus: (planId: string, newStatus: SupportPlanStatus) => void;
  onSaveOutcomeNotes?: (
    planId: string,
    progressStatus: ProgressStatus,
    outcomeNotes: string,
    reviewOutcomeDate: string
  ) => void;
  onOpenStudentAnalysis: (regNo: string) => void;
}

export default function SupportPlanDetailsDrawer({
  isOpen,
  onClose,
  plan,
  onUpdateStatus,
  onSaveOutcomeNotes,
  onOpenStudentAnalysis,
}: SupportPlanDetailsDrawerProps) {
  const [selectedProgress, setSelectedProgress] = useState<ProgressStatus>('In Progress');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (plan) {
      setSelectedProgress(plan.progressStatus || 'In Progress');
      setOutcomeNotes(plan.outcomeNotes || plan.facultyNotes || '');
      setIsSaved(false);
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

  const progressionSteps: { status: SupportPlanStatus; label: string; desc: string }[] = [
    { status: 'Draft', label: 'Draft', desc: 'Plan formulated by instructor' },
    { status: 'Active', label: 'Active', desc: 'Support initiated with student' },
    { status: 'Follow-up Due', label: 'Follow-up Due', desc: 'Progress review checkpoint' },
    { status: 'Completed', label: 'Completed', desc: 'Support outcome verified' },
  ];

  const getStepIndex = (st: SupportPlanStatus) => {
    switch (st) {
      case 'Draft':
        return 0;
      case 'Active':
      case 'Support Required':
        return 1;
      case 'Follow-up Due':
        return 2;
      case 'Completed':
        return 3;
      default:
        return 1;
    }
  };

  const currentStepIdx = getStepIndex(plan.status);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#070e1e] border-l border-cyan-500/30 shadow-2xl shadow-cyan-950/50 flex flex-col justify-between text-left animate-in slide-in-from-right duration-300 overflow-y-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/90 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/50 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                REG NO: {plan.regNo}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {plan.planType}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3.5 mt-2 border-t border-slate-800/70 text-xs font-mono">
            <span
              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${
                plan.priority === 'High'
                  ? 'bg-rose-950/70 text-rose-300 border-rose-500/40'
                  : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {plan.priority} Priority
            </span>

            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Created: {plan.createdDate}</span>
            </span>

            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                plan.status === 'Completed'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : plan.status === 'Follow-up Due'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              Status: {plan.status}
            </span>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Status Progression Tracker */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Support Status Progression
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Step {currentStepIdx + 1} of 4
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 relative">
              {progressionSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="text-center space-y-1">
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        isCurrent
                          ? 'bg-cyan-400 shadow-sm shadow-cyan-400'
                          : isPassed
                          ? 'bg-cyan-700'
                          : 'bg-slate-800'
                      }`}
                    />
                    <span
                      className={`block text-[10px] font-mono font-semibold ${
                        isCurrent ? 'text-white font-bold' : isPassed ? 'text-cyan-300' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observed Indicators & Suggested Support */}
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Observed Engagement Trigger
              </span>
              <p className="text-white font-semibold font-mono text-xs">
                {plan.mainObservedIndicator}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                Configured Support Strategy
              </span>
              <p className="text-white font-semibold text-xs">
                {plan.suggestedSupport}
              </p>
            </div>
          </div>

          {/* Selected Actions List */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Active Intervention Checkpoints
            </span>
            <div className="space-y-1.5">
              {plan.selectedActions.map((act, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dates & Timeline */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Start Date</span>
              <span className="text-white font-bold block mt-0.5">{plan.startDate}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Next Review Date</span>
              <span className="text-cyan-300 font-bold block mt-0.5">{plan.followUpDate}</span>
            </div>
          </div>

          {/* Faculty Observations & Intervention Outcome Tracking */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
                Intervention Follow-up & Progress Status
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Outcome Tracking
              </span>
            </div>

            {/* Progress Status Buttons: In Progress, Improved, No Change, Declined */}
            <div>
              <label className="block text-[10px] font-mono text-slate-300 uppercase mb-1.5">
                Current Progress Trajectory:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-xs">
                {(['In Progress', 'Improved', 'No Change', 'Declined'] as ProgressStatus[]).map((status) => {
                  const isSelected = selectedProgress === status;
                  const colorClass =
                    status === 'Improved'
                      ? isSelected
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold shadow-md shadow-emerald-950/40'
                        : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-emerald-300'
                      : status === 'In Progress'
                      ? isSelected
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-md shadow-cyan-950/40'
                        : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-cyan-300'
                      : status === 'No Change'
                      ? isSelected
                        ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold shadow-md shadow-amber-950/40'
                        : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-amber-300'
                      : isSelected
                      ? 'bg-rose-950 text-rose-300 border-rose-500 font-bold shadow-md shadow-rose-950/40'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-rose-300';

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setSelectedProgress(status);
                        setIsSaved(false);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all ${colorClass}`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date-Stamped Outcome Timestamp */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Last Review Date:</span>
              <span className="text-white font-semibold">
                {plan.reviewOutcomeDate || 'Recorded Today, 11:30 AM'}
              </span>
            </div>

            {/* Faculty Notes Textarea */}
            <div>
              <label className="block text-[10px] font-mono text-slate-300 uppercase mb-1">
                Faculty Intervention Notes & Review Observations:
              </label>
              <textarea
                rows={3}
                value={outcomeNotes}
                onChange={(e) => {
                  setOutcomeNotes(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Record qualitative observations (e.g. Student attended office hour, clarified recursion concepts, requested extension on milestone 2)..."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                if (onSaveOutcomeNotes) {
                  onSaveOutcomeNotes(plan.id, selectedProgress, outcomeNotes, nowStr);
                }
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2500);
              }}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Outcome Recorded & Date-Stamped ✓' : 'Save Progress & Date-Stamp Review'}</span>
            </button>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>EngageAI tracks intervention progression without penalizing students.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-800/90 bg-[#060b16] space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            {plan.status !== 'Completed' && (
              <button
                onClick={() => onUpdateStatus(plan.id, 'Completed')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Plan Completed</span>
              </button>
            )}

            {plan.status === 'Active' && (
              <button
                onClick={() => onUpdateStatus(plan.id, 'Follow-up Due')}
                className="py-2.5 px-3 rounded-xl bg-amber-950/80 border border-amber-500/50 hover:bg-amber-900 text-amber-300 text-xs font-semibold transition-colors"
              >
                Advance to Follow-up Due
              </button>
            )}

            {plan.status === 'Draft' && (
              <button
                onClick={() => onUpdateStatus(plan.id, 'Active')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-1.5"
              >
                <span>Activate Support Plan</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenStudentAnalysis(plan.regNo);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Student Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
