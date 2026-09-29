import React from 'react';
import { HeartHandshake, CheckCircle2, Clock, Send, ShieldCheck, UserCheck } from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';

interface InterventionsViewProps {
  students: StudentRecord[];
  onOpenStudentModal: (student: StudentRecord) => void;
}

export default function InterventionsView({ students, onOpenStudentModal }: InterventionsViewProps) {
  const addressedStudents = students.filter(s => s.status === 'support_initiated' || s.status === 'reviewed');
  const pendingOutreach = students.filter(s => s.mentorCheckInRecommended && s.status === 'pending');

  return (
    <div className="space-y-6 text-left">
      <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-400 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Faculty Support Plans & Mentorship Queue
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active empathetic interventions, office-hour invitations, and peer tutoring referrals.
            </p>
          </div>
          <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/30">
            {pendingOutreach.length} Pending Recommendations
          </div>
        </div>

        {/* Priority Outreach Recommendations */}
        <div className="mt-5 space-y-3">
          <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Recommended Faculty Outreaches (5 Students)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingOutreach.slice(0, 5).map((stu) => (
              <div
                key={stu.studentId}
                onClick={() => onOpenStudentModal(stu)}
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-sm">
                      {stu.studentId}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
                      {stu.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 mt-2">
                    {stu.mainChange}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Recommended: {stu.recommendedAction}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
                  <span>Dispatch Empathetic Support</span>
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Support History */}
        <div className="mt-8 pt-5 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Recently Addressed Student Check-ins</span>
          </h3>

          <div className="divide-y divide-slate-800/60 bg-slate-950/50 rounded-xl border border-slate-800/80">
            {addressedStudents.map((stu) => (
              <div key={stu.studentId} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white">{stu.studentId}</span>
                  <span className="text-slate-300">{stu.mainChange}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Outreach Recorded</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
