import React from 'react';
import { 
  ClipboardList, 
  RotateCcw, 
  HeartHandshake, 
  FileText, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  BarChart3,
  Users
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';

interface FacultyActionCenterProps {
  onReviewAlerts: () => void;
  onViewStudents: () => void;
  onOpenClassAnalytics: () => void;
  onFilterRepeatedAlerts: () => void;
  onFilterMentorCheckins: () => void;
  onFilterAssignmentDecline: () => void;
  students?: StudentRecord[];
}

export default function FacultyActionCenter({
  onReviewAlerts,
  onViewStudents,
  onOpenClassAnalytics,
  onFilterRepeatedAlerts,
  onFilterMentorCheckins,
  onFilterAssignmentDecline,
  students,
}: FacultyActionCenterProps) {
  const studentsNeedReview = students ? students.filter((s) => s.needsReview).length : 24;
  const repeatedAlerts = students ? students.filter((s) => s.repeatedAlert).length : 12;
  const mentorCheckins = students ? students.filter((s) => s.mentorCheckInRecommended || s.riskScore >= 60).length : 28;
  const assignmentDeclines = students ? students.filter((s) => s.assignmentRelatedDecline || (s.previousAssignmentCompletion - s.assignmentCompletion >= 8)).length : 38;

  return (
    <section className="rounded-2xl bg-gradient-to-b from-[#0b162c] to-[#070e1e] border border-cyan-500/25 p-5 sm:p-6 shadow-2xl shadow-cyan-950/40 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shadow-md">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Faculty Action Center
              </h2>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide block">
                Today’s Prioritized Intervention Queue
              </span>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onReviewAlerts}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Review Alerts</span>
          </button>

          <button
            onClick={onViewStudents}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Students</span>
          </button>

          <button
            onClick={onOpenClassAnalytics}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Class Analytics</span>
          </button>
        </div>
      </div>

      {/* 4 Action Queue Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
        {/* 1. students need review */}
        <div 
          onClick={onReviewAlerts}
          className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                <ClipboardList className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                Active Queue
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {studentsNeedReview}
            </div>
            <p className="text-xs font-medium text-slate-200 mt-1">
              Students need review
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Unacknowledged early warnings from this week
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-medium text-cyan-400 group-hover:text-cyan-300 flex items-center justify-between">
            <span>Process Queue</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 2. students have repeated alerts */}
        <div 
          onClick={onFilterRepeatedAlerts}
          className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/30">
                <RotateCcw className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">
                Persistent Trend
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {repeatedAlerts}
            </div>
            <p className="text-xs font-medium text-slate-200 mt-1">
              Students have repeated alerts
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Multi-week downward indicators detected
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-medium text-amber-400 group-hover:text-amber-300 flex items-center justify-between">
            <span>View Persistent Flags</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 3. students may benefit from a mentor check-in */}
        <div 
          onClick={onFilterMentorCheckins}
          className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30">
                <HeartHandshake className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold uppercase">
                Mentorship
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">
              {mentorCheckins}
            </div>
            <p className="text-xs font-medium text-slate-200 mt-1">
              Students may benefit from check-in
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Empathetic outreach recommended prior to midterms
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-medium text-indigo-400 group-hover:text-indigo-300 flex items-center justify-between">
            <span>Open Check-in Plan</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 4. students show assignment-related decline */}
        <div 
          onClick={onFilterAssignmentDecline}
          className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="p-1.5 rounded-lg bg-teal-950 text-teal-400 border border-teal-500/30">
                <FileText className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-teal-400 font-semibold uppercase">
                Velocity Shift
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-teal-300 tabular-nums">
              {assignmentDeclines}
            </div>
            <p className="text-xs font-medium text-slate-200 mt-1">
              Assignment-related decline
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Recent submission delay or missed deadlines
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-medium text-teal-400 group-hover:text-teal-300 flex items-center justify-between">
            <span>Review Assignment Latency</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}

