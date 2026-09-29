import React from 'react';
import { 
  X, 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  FileText 
} from 'lucide-react';
import { SubjectMarks } from '../../data/demoAcademicData';

interface SubjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SubjectMarks | null;
  regNo: string;
}

export default function SubjectDetailModal({
  isOpen,
  onClose,
  subject,
  regNo,
}: SubjectDetailModalProps) {
  if (!isOpen || !subject) return null;

  const isGood = subject.performanceCategory === 'GOOD';
  const isAverage = subject.performanceCategory === 'AVERAGE';

  const badgeClass = isGood
    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
    : isAverage
    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
    : 'bg-amber-950/80 text-amber-300 border-amber-500/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#091122] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                Subject Deep Dive · Reg No {regNo}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border ${badgeClass}`}>
                {subject.performanceCategory}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {subject.subjectName} ({subject.code})
            </h3>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 pt-4 text-xs font-mono">
          {/* Main Score Big Tile */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                COMBINED EXAMINATION TOTAL
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white font-mono">{subject.total}</span>
                <span className="text-sm text-slate-400 font-mono">/ 100 marks</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-cyan-300 font-mono">
                {subject.percentage}%
              </span>
              <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                Evaluation Score
              </span>
            </div>
          </div>

          {/* Internal Exam 1 vs 2 */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Internal Exam 1</span>
              <div className="text-lg font-bold text-white mt-1">
                {subject.internal1} <span className="text-xs text-slate-400 font-normal">/ 50 marks</span>
              </div>
              <span className="text-[11px] text-cyan-300 font-bold block mt-0.5">
                {((subject.internal1 / 50) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Internal Exam 2</span>
              <div className="text-lg font-bold text-white mt-1">
                {subject.internal2} <span className="text-xs text-slate-400 font-normal">/ 50 marks</span>
              </div>
              <span className="text-[11px] text-cyan-300 font-bold block mt-0.5">
                {((subject.internal2 / 50) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Trend & Observations */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 font-sans">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-semibold">Semester Momentum:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  subject.trend === 'improving'
                    ? 'text-emerald-400'
                    : subject.trend === 'declining'
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }`}
              >
                {subject.trend === 'improving' && <TrendingUp className="w-3.5 h-3.5" />}
                {subject.trend === 'declining' && <TrendingDown className="w-3.5 h-3.5" />}
                {subject.trend === 'stable' && <Minus className="w-3.5 h-3.5" />}
                <span className="capitalize">{subject.trend} Trajectory</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 pt-1 leading-relaxed">
              {subject.percentage >= 75
                ? 'Strong understanding of core theoretical derivations and lab implementations.'
                : subject.percentage >= 50
                ? 'Consistent foundational grasp with occasional latency on complex analytical problem solving.'
                : 'May benefit from additional practice with conceptual review sessions.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
