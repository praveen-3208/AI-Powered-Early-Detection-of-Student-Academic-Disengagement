import React from 'react';
import { 
  X, 
  CalendarCheck2, 
  FileText, 
  Award, 
  Activity, 
  Users, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  HeartHandshake
} from 'lucide-react';
import { Student } from '../types';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onOpenCheckIn: (student: Student) => void;
}

export default function StudentDetailModal({
  isOpen,
  onClose,
  student,
  onOpenCheckIn,
}: StudentDetailModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#0b1426] border border-cyan-500/25 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Student Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">REG NO:</span>
                <h3 className="text-xl font-bold font-mono text-white tracking-tight">
                  {student.regNo}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {student.course} · Detected shift: {student.shiftDays} days ago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                student.riskLevel === 'critical'
                  ? 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
                  : student.riskLevel === 'moderate'
                  ? 'bg-amber-950/70 border border-amber-500/40 text-amber-300'
                  : 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
              }`}
            >
              {student.riskLevel === 'critical'
                ? 'High Urgency Drift'
                : student.riskLevel === 'moderate'
                ? 'Moderate Shift'
                : 'Mild Deviation'}
            </span>
          </div>
        </div>

        {/* AI Synthetic Early Warning Diagnosis */}
        <div className="mt-5 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Pattern Recognition Assessment</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {student.aiInsight}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="text-slate-500">Recommended Action:</span>
            <span className="text-cyan-300 font-medium">{student.suggestedAction}</span>
          </div>
        </div>

        {/* The 5 Non-Sensitive Indicators Breakdown */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            5 Non-Sensitive Engagement Dimensions
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Attendance */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <CalendarCheck2 className="w-4 h-4 text-sky-400" />
                  Attendance Rhythm
                </span>
                <span className="font-mono text-rose-400 flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {student.indicators.attendanceDelta}%
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Current 3-Week Rate</span>
                <span className="text-sm font-bold text-white font-mono">{student.indicators.attendance}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                <div 
                  className="bg-sky-400 h-1.5 rounded-full"
                  style={{ width: `${student.indicators.attendance}%` }}
                />
              </div>
            </div>

            {/* 2. Assignments */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Submission Velocity
                </span>
                <span className="font-mono text-amber-400 text-[11px]">
                  Delayed Latency
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Submission Timing</span>
                <span className="text-xs font-semibold text-slate-200 font-mono">
                  {student.indicators.assignmentLatency}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 pt-0.5">
                Baseline was 2 days prior to cutoff
              </p>
            </div>

            {/* 3. Assessments */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Formative Quiz Slope
                </span>
                <span className="font-mono text-cyan-300 text-[11px]">
                  {student.indicators.formativeSlope}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Low-Stakes Checks</span>
                <span className="text-xs font-semibold text-slate-200 font-mono">2 of 3 Missed</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-0.5">
                Ungraded concept check engagement
              </p>
            </div>

            {/* 4. Learning Activity */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Activity className="w-4 h-4 text-teal-400" />
                  LMS Activity Dwell
                </span>
                <span className="font-mono text-rose-400 text-[11px]">
                  {student.indicators.lmsActivityDelta}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Resource Access</span>
                <span className="text-xs font-semibold text-slate-200 font-mono">Last seen 5 days ago</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-0.5">
                Module lecture slides untouched
              </p>
            </div>
          </div>

          {/* 5. Participation */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Users className="w-4 h-4 text-purple-400" />
                Seminar & Forum Collaborative Participation
              </span>
              <span className="font-mono text-slate-300 text-xs font-semibold">
                {student.indicators.participationScore}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              No discussion forum posts or lab partner pull requests logged over past 2 modules.
            </p>
          </div>
        </div>

        {/* Human Faculty Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FERPA Protected · Confidential Advisor Note</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenCheckIn(student);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Initiate Empathetic Check-in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
