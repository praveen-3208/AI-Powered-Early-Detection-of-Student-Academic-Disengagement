import React from 'react';
import { 
  PlusCircle, 
  Users, 
  BellRing, 
  BarChart3, 
  HeartHandshake,
  GraduationCap
} from 'lucide-react';

interface TeacherQuickActionsProps {
  onAddData: () => void;
  onViewStudents: () => void;
  onReviewAlerts: () => void;
  onClassAnalytics: () => void;
  onSupportPlans: () => void;
  onAcademicPerformance?: () => void;
}

export default function TeacherQuickActions({
  onAddData,
  onViewStudents,
  onReviewAlerts,
  onClassAnalytics,
  onSupportPlans,
  onAcademicPerformance,
}: TeacherQuickActionsProps) {
  return (
    <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-left">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 pl-1">
          Teacher Quick Actions
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* + Add Academic Data */}
        <button
          onClick={onAddData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>+ Add Academic Data</span>
        </button>

        {/* View Students */}
        <button
          onClick={onViewStudents}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition-colors"
        >
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>View Students</span>
        </button>

        {/* Review Alerts */}
        <button
          onClick={onReviewAlerts}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition-colors"
        >
          <BellRing className="w-3.5 h-3.5 text-amber-400" />
          <span>Review Alerts</span>
        </button>

        {/* Class Analytics */}
        <button
          onClick={onClassAnalytics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Class Analytics</span>
        </button>

        {/* Academic Performance */}
        {onAcademicPerformance && (
          <button
            onClick={onAcademicPerformance}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Academic Performance</span>
          </button>
        )}

        {/* Support Plans */}
        <button
          onClick={onSupportPlans}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition-colors"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
          <span>Support Plans</span>
        </button>
      </div>
    </div>
  );
}
