import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Save
} from 'lucide-react';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export default function AlertSettingsModal({ isOpen, onClose, onSave }: AlertSettingsModalProps) {
  const [attThreshold, setAttThreshold] = useState(15);
  const [assignThreshold, setAssignThreshold] = useState(20);
  const [assessThreshold, setAssessThreshold] = useState(15);
  const [detectionMode, setDetectionMode] = useState<'proactive' | 'balanced' | 'conservative'>('proactive');
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    if (onSave) onSave();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-[#091122] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Configuration & Detection Baseline
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Faculty Alert Settings
            </h3>
          </div>
        </div>

        {savedSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Threshold Parameters Updated</h4>
            <p className="text-xs text-slate-300 font-mono">
              EngageAI alert synthesis active with new sensitivity baseline.
            </p>
          </div>
        ) : (
          <div className="space-y-6 pt-4 text-xs">
            {/* Detection Mode */}
            <div className="space-y-2">
              <label className="font-mono text-slate-300 font-semibold uppercase text-[11px] block">
                Detection Sensitivity Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'proactive', label: 'Proactive', desc: 'Flags subtle early shifts early' },
                  { id: 'balanced', label: 'Balanced', desc: 'Standard campus baseline' },
                  { id: 'conservative', label: 'Conservative', desc: 'Flags confirmed multi-week drop' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDetectionMode(mode.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      detectionMode === mode.id
                        ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold block text-xs">{mode.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Threshold Sliders */}
            <div className="space-y-3">
              <label className="font-mono text-slate-300 font-semibold uppercase text-[11px] block">
                Metric Variance Trigger Thresholds
              </label>

              <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Attendance Drop Trigger:</span>
                    <span className="text-cyan-400 font-bold">≥ {attThreshold}% drop</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="1"
                    value={attThreshold}
                    onChange={(e) => setAttThreshold(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Assignment Drop Trigger:</span>
                    <span className="text-cyan-400 font-bold">≥ {assignThreshold}% drop</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="1"
                    value={assignThreshold}
                    onChange={(e) => setAssignThreshold(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Assessment Slope Drop Trigger:</span>
                    <span className="text-cyan-400 font-bold">≥ {assessThreshold}% drop</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="1"
                    value={assessThreshold}
                    onChange={(e) => setAssessThreshold(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Notification Options */}
            <div className="space-y-2">
              <label className="font-mono text-slate-300 font-semibold uppercase text-[11px] block">
                Notification Cadence
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inAppAlerts}
                    onChange={(e) => setInAppAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="text-slate-200 font-medium block">Real-time In-App Notification Bell</span>
                    <span className="text-[10px] text-slate-400">Receive counter increments when new indicators trigger</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="text-slate-200 font-medium block">Monday Faculty Cohort Digest</span>
                    <span className="text-[10px] text-slate-400">Synthesized 4-week drift summary before weekly lecture</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All alert triggers process non-sensitive registration number metrics locally.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Alert Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
