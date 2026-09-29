import React from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';

interface EngageAIInsightPanelProps {
  onViewSupportingData: () => void;
  students?: StudentRecord[];
}

export default function EngageAIInsightPanel({ onViewSupportingData, students }: EngageAIInsightPanelProps) {
  const assignmentDropCount = students 
    ? students.filter(s => (s.previousAssignmentCompletion - s.assignmentCompletion) >= 8 || s.assignmentRelatedDecline).length 
    : 38;

  return (
    <section className="relative rounded-2xl bg-gradient-to-r from-[#0b1b36] via-[#09152b] to-[#0d1633] border border-cyan-500/35 p-5 sm:p-6 shadow-2xl shadow-cyan-950/40 text-left overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left copy & insight */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30 border border-cyan-300/30">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300">
              EngageAI Insight
            </h2>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/80">
              Probabilistic Assessment
            </span>
          </div>

          <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
            “Class engagement has remained stable overall. The main emerging change is a decline in assignment completion. <span className="text-cyan-300 font-semibold underline decoration-cyan-500/40 underline-offset-4">{assignmentDropCount} students</span> show this pattern over the last two submission cycles.”
          </p>

          <p className="text-xs text-slate-400 leading-normal">
            Trajectory suggests students may be encountering difficulty with modular recursion labs or facing concurrent project deadlines across other departments.
          </p>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 self-start md:self-auto">
          <button
            onClick={onViewSupportingData}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-2 group"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Supporting Data</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
