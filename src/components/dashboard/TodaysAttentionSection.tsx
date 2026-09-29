import React from 'react';
import { 
  Sparkles, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';

interface TodaysAttentionSectionProps {
  students: StudentRecord[];
  onReviewStudent: (student: StudentRecord) => void;
  onViewAllAlerts: () => void;
}

export default function TodaysAttentionSection({
  students,
  onReviewStudent,
  onViewAllAlerts,
}: TodaysAttentionSectionProps) {
  // Show 4-5 high priority students needing review
  const attentionStudents = students.filter((s) => s.needsReview).slice(0, 4);

  return (
    <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 overflow-hidden shadow-xl text-left">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Today’s Attention
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {attentionStudents.length} Priority Alerts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Students currently showing noticeable momentum shifts requiring faculty review.
          </p>
        </div>

        <button
          onClick={onViewAllAlerts}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors self-start sm:self-auto group"
        >
          <span>View All Alert Queue</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-800/60">
        {attentionStudents.map((student) => {
          const isHigh = student.riskLevel === 'High Risk';

          return (
            <div
              key={student.regNo}
              onClick={() => onReviewStudent(student)}
              className="p-4 sm:px-5 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3.5 group cursor-pointer"
            >
              {/* Left ID & Risk */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <div className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-white text-xs shadow-sm group-hover:border-cyan-500/40 transition-colors">
                  {student.regNo}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">
                      {student.regNo}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider ${
                        isHigh
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isHigh ? 'bg-rose-400' : 'bg-amber-400'
                        }`}
                      />
                      {student.riskLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{student.timeDetected}</span>
                  </div>
                </div>
              </div>

              {/* Center Main Change Description */}
              <div className="flex-1 md:px-4">
                <p className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                  {student.mainChange}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {student.aiDiagnosticContext}
                </p>
              </div>

              {/* Right Action Button: [Review] */}
              <div className="shrink-0 self-end md:self-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onReviewStudent(student)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center gap-1.5 group/btn"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
