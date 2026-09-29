import React from 'react';
import { 
  BellRing, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  TrendingDown,
  Sparkles,
  Layers
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';

interface FacultyAttentionQueuePanelProps {
  students: StudentRecord[];
  onReviewStudent: (student: StudentRecord) => void;
  onOpenAllAlerts: () => void;
}

export default function FacultyAttentionQueuePanel({
  students,
  onReviewStudent,
  onOpenAllAlerts,
}: FacultyAttentionQueuePanelProps) {
  // Only students needing review
  const attentionList = students.filter((s) => s.needsReview).slice(0, 6);

  return (
    <div className="rounded-2xl bg-[#091122]/95 border border-cyan-500/25 p-4 sm:p-5 shadow-2xl shadow-cyan-950/40 text-left flex flex-col justify-between relative overflow-hidden">
      {/* Subtle animated continuous scanning line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      <div>
        {/* Header with live monitoring pulse */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-75"></span>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Faculty Attention Queue
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                Continuous Early Signals
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
            {attentionList.length} Active
          </span>
        </div>

        {/* Student Cards in Queue */}
        <div className="space-y-2.5 mt-3.5">
          {attentionList.map((stu) => {
            const isEarlyAlert = stu.riskLevel === 'High Risk';
            const attDelta = stu.attendance - stu.previousAttendance;
            const assignDelta = stu.assignmentCompletion - stu.previousAssignmentCompletion;

            return (
              <div
                key={stu.studentId}
                onClick={() => onReviewStudent(stu)}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                      {stu.studentId}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.2 rounded-full uppercase tracking-wider ${
                        isEarlyAlert
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isEarlyAlert ? 'Early Alert' : 'Changing Pattern'}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {stu.timeDetected}
                  </span>
                </div>

                {/* Main Deltas */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-300 mt-1">
                  {attDelta < 0 && (
                    <span className="text-rose-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                      Attendance {attDelta}%
                    </span>
                  )}
                  {assignDelta < 0 && (
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                      Assignments {assignDelta}%
                    </span>
                  )}
                  {attDelta >= 0 && assignDelta >= 0 && (
                    <span className="text-slate-400 text-[10px] truncate">
                      {stu.mainChange}
                    </span>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono text-[10px]">
                    Index: {stu.riskScore}/100
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReviewStudent(stu);
                    }}
                    className="text-cyan-400 group-hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Queue Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 space-y-2">
        <p className="text-[11px] text-slate-400 text-center">
          “6 students currently require deeper review.”
        </p>
        <button
          onClick={onOpenAllAlerts}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-400/30 text-cyan-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Open All Alerts</span>
        </button>
      </div>
    </div>
  );
}
