import React from 'react';
import { 
  CalendarCheck2, 
  FileText, 
  Award, 
  Activity, 
  Users, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';

interface EarlyWarningSignalsProps {
  onFilterBySignal: (signalKey: string) => void;
  students?: StudentRecord[];
}

export default function EarlyWarningSignals({ onFilterBySignal, students }: EarlyWarningSignalsProps) {
  const attCount = students ? students.filter(s => s.attendance < s.previousAttendance - 4).length : 28;
  const asnCount = students ? students.filter(s => s.assignmentCompletion < s.previousAssignmentCompletion - 4).length : 36;
  const assCount = students ? students.filter(s => s.assessmentAverage < s.previousAssessmentAverage - 4).length : 24;
  const actCount = students ? students.filter(s => s.learningActivity < s.previousLearningActivity - 4).length : 22;
  const partCount = students ? students.filter(s => s.participation < s.previousParticipation - 4).length : 18;

  const signals = [
    {
      key: 'attendance',
      title: 'Attendance Declining',
      count: attCount,
      subtitle: 'Lecture & lab presence shifts',
      icon: CalendarCheck2,
      color: 'text-sky-400',
      borderColor: 'hover:border-sky-500/50',
    },
    {
      key: 'assignments',
      title: 'Assignments Missing',
      count: asnCount,
      subtitle: 'Overdue or late upload delays',
      icon: FileText,
      color: 'text-cyan-400',
      borderColor: 'hover:border-cyan-500/50',
    },
    {
      key: 'assessments',
      title: 'Assessment Performance Declining',
      count: assCount,
      subtitle: 'Formative quiz slope downward',
      icon: Award,
      color: 'text-indigo-400',
      borderColor: 'hover:border-indigo-500/50',
    },
    {
      key: 'activity',
      title: 'Learning Activity Declining',
      count: actCount,
      subtitle: 'LMS platform dwell time reduction',
      icon: Activity,
      color: 'text-teal-400',
      borderColor: 'hover:border-teal-500/50',
    },
    {
      key: 'participation',
      title: 'Participation Declining',
      count: partCount,
      subtitle: 'Seminar forum contribution lags',
      icon: Users,
      color: 'text-purple-400',
      borderColor: 'hover:border-purple-500/50',
    },
  ];

  return (
    <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Early Warning Signals
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              Indicator Aggregations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Most prevalent non-sensitive behavioral changes observed across the cohort
          </p>
        </div>
      </div>

      {/* Grid of 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4">
        {signals.map((sig) => {
          const Icon = sig.icon;

          return (
            <div
              key={sig.key}
              className={`rounded-xl bg-slate-900/70 border border-slate-800 p-4 transition-all duration-200 group flex flex-col justify-between ${sig.borderColor}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2 rounded-lg bg-slate-950/80 border border-slate-800 ${sig.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-bold font-mono text-white tabular-nums">
                    {sig.count}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-slate-200 mt-2.5 leading-snug">
                  {sig.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {sig.subtitle}
                </p>
              </div>

              {/* Action: View Students */}
              <div className="mt-4 pt-2.5 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => onFilterBySignal(sig.key)}
                  className="w-full flex items-center justify-between text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors group/btn"
                >
                  <span>View Students</span>
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
