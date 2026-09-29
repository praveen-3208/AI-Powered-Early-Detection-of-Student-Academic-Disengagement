import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  ArrowRight, 
  FileText, 
  Cpu, 
  Layers,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { FacultyAlert } from '../../data/demoAlerts';

interface AlertDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alert: FacultyAlert | null;
  onMarkAsReviewed: (alertId: string, note?: string) => void;
  onOpenStudentAnalysis: (regNo: string) => void;
}

export default function AlertDetailsDrawer({
  isOpen,
  onClose,
  alert,
  onMarkAsReviewed,
  onOpenStudentAnalysis,
}: AlertDetailsDrawerProps) {
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !alert) return null;

  const isHigh = alert.severity === 'High Priority';
  const isEarlyAlert = alert.category === 'EARLY ALERT';
  const isChanging = alert.category === 'CHANGING PATTERN';

  const severityBadgeClass = isHigh
    ? 'bg-rose-950/70 text-rose-300 border-rose-500/40'
    : 'bg-amber-950/70 text-amber-300 border-amber-500/40';

  const categoryBadgeClass = isEarlyAlert
    ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
    : isChanging
    ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
    : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30';

  const handleReviewClick = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onMarkAsReviewed(alert.id, reviewNote);
      setIsSubmitting(false);
      setReviewNote('');
    }, 350);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#070e1e] border-l border-cyan-500/30 shadow-2xl shadow-cyan-950/50 flex flex-col justify-between text-left animate-in slide-in-from-right duration-300 overflow-y-auto">
        {/* Drawer Header */}
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
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  REG NO
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${categoryBadgeClass}`}
                >
                  {alert.category}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {alert.regNo}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3.5 mt-2 border-t border-slate-800/70 text-xs font-mono">
            <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${severityBadgeClass}`}>
              {alert.severity}
            </span>

            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Detected: {alert.detectedTime} ({alert.detectedDate})</span>
            </span>

            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                alert.status === 'NEW'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {alert.status === 'NEW' ? '● NEW ALERT' : '✓ REVIEWED'}
            </span>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Risk Score & Category Context */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Calculated Risk Score
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-white">{alert.riskScore}</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Threshold triggered</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Alert Classification
              </span>
              <span className="text-xs font-bold text-cyan-300 block mt-1 font-mono">
                {alert.category}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block line-clamp-2">
                {alert.categoryExplanation}
              </span>
            </div>
          </div>

          {/* Observed Changes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-cyan-400" />
                <span>Observed Changes (Previous → Current)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {alert.affectedIndicators.length} Indicator{alert.affectedIndicators.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-2">
              {alert.affectedIndicators.map((ind) => (
                <div
                  key={ind.name}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{ind.name}</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-400">{ind.previous}%</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-white font-bold">{ind.current}%</span>
                      <span className="text-rose-400 font-bold ml-1">
                        ↓ {Math.abs(ind.delta)}%
                      </span>
                    </div>
                  </div>

                  {/* Relative delta bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden flex">
                    <div
                      className="bg-slate-700 h-1.5 rounded-l-full"
                      style={{ width: `${ind.current}%` }}
                    />
                    <div
                      className="bg-rose-500/70 h-1.5 rounded-r-full"
                      style={{ width: `${Math.abs(ind.delta)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Explanation */}
          <div className="p-4 rounded-xl bg-cyan-950/25 border border-cyan-500/35 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Why this alert was generated</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              “{alert.evidenceExplanation}”
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-cyan-500/20 font-mono">
              Ground truth: Verified objective shift across monitored institutional metrics.
            </p>
          </div>

          {/* Review Details or Form */}
          {alert.status === 'REVIEWED' ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Reviewed by Faculty</span>
              </div>
              <p className="text-slate-300">
                Action recorded on {alert.reviewDate} at {alert.reviewTime}.
              </p>
              {alert.notes && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 mt-1">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Faculty Note:</span>
                  <p className="text-xs font-sans mt-0.5">{alert.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Optional Faculty Observation / Outreach Note:
              </label>
              <textarea
                rows={3}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Log note (e.g., Scheduled Wednesday office hour sync; notified department advisor)..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          {/* Ethical Principles Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>EngageAI alerts provide evidence-based academic signals. Final intervention decisions remain with faculty.</span>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-800/90 bg-[#060b16] space-y-2.5">
          <div className="flex items-center gap-3">
            {alert.status === 'NEW' && (
              <button
                onClick={handleReviewClick}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Recording...' : 'Mark as Reviewed'}</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenStudentAnalysis(alert.regNo);
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Full Student Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
