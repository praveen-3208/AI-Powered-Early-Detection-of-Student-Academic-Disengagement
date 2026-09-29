import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CalendarCheck2, 
  FileText, 
  Award, 
  Activity, 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  Clock, 
  Send,
  CheckCircle2,
  Calendar,
  UserCheck,
  TrendingDown,
  TrendingUp,
  Info
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';

interface StudentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord | null;
  onUpdateStudentStatus?: (studentId: string, newStatus: 'reviewed' | 'support_initiated') => void;
}

export default function StudentAnalysisModal({
  isOpen,
  onClose,
  student,
  onUpdateStudentStatus,
}: StudentAnalysisModalProps) {
  if (!isOpen || !student) return null;

  const [activeActionTab, setActiveActionTab] = useState<'note' | 'office_hour' | 'mentor'>('note');
  const [supportMessage, setSupportMessage] = useState(
    `Hi ${student.studentId},\n\nI hope your week is going smoothly! I noticed you were unable to make our recent lab section, and I wanted to check in to see how you are finding the course material.\n\nAcademic workloads can pick up quickly during this part of the semester. If you would like to go over the recursion exercises or need extra time on the current milestone, please feel free to drop by office hours this Wednesday or reply to this note.\n\nBest regards,\nDr. Sarah Chen\nDepartment of Computer Engineering`
  );
  const [isSending, setIsSending] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  const handleSendOutreach = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setActionSuccess(true);
      if (onUpdateStudentStatus) {
        onUpdateStudentStatus(student.studentId, 'support_initiated');
      }
      setTimeout(() => {
        setActionSuccess(false);
        onClose();
      }, 1400);
    }, 900);
  };

  const handleMarkReviewed = () => {
    if (onUpdateStudentStatus) {
      onUpdateStudentStatus(student.studentId, 'reviewed');
    }
    onClose();
  };

  const isHigh = student.riskLevel === 'High Risk';
  const isModerate = student.riskLevel === 'Moderate Risk';

  // Metrics comparison table data
  const metricsComparison = [
    {
      label: 'Attendance',
      current: student.attendance,
      previous: student.previousAttendance,
      delta: student.attendance - student.previousAttendance,
      icon: CalendarCheck2,
      color: '#38bdf8',
    },
    {
      label: 'Assignment Completion',
      current: student.assignmentCompletion,
      previous: student.previousAssignmentCompletion,
      delta: student.assignmentCompletion - student.previousAssignmentCompletion,
      icon: FileText,
      color: '#06b6d4',
    },
    {
      label: 'Assessment Performance',
      current: student.assessmentAverage,
      previous: student.previousAssessmentAverage,
      delta: student.assessmentAverage - student.previousAssessmentAverage,
      icon: Award,
      color: '#818cf8',
    },
    {
      label: 'Learning Activity (LMS)',
      current: student.learningActivity,
      previous: student.previousLearningActivity,
      delta: student.learningActivity - student.previousLearningActivity,
      icon: Activity,
      color: '#2dd4bf',
    },
    {
      label: 'Participation',
      current: student.participation,
      previous: student.previousParticipation,
      delta: student.participation - student.previousParticipation,
      icon: Users,
      color: '#a78bfa',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-[#0b1426] border border-cyan-500/25 p-5 sm:p-7 shadow-2xl shadow-cyan-950/50 text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800/80"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-white text-base shadow-md">
              {student.studentId}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight font-mono">
                  {student.studentId}
                </h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {student.classId}
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  · {student.timeDetected}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Observed Shift: <strong className="text-white font-medium">{student.mainChange}</strong>
              </p>
            </div>
          </div>

          {/* Risk Score Pill */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 font-mono ${
                isHigh
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  : isModerate
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              }`}
            >
              <span className="text-xs uppercase font-bold tracking-wider">
                {student.riskLevel}
              </span>
              <span className="text-xs font-bold bg-slate-950/70 px-2 py-0.5 rounded">
                Index: {student.riskScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Mandatory Transparency Banner */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 flex items-start gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-cyan-300 font-medium">Core Diagnostic Principle:</strong> “Risk score represents observed engagement patterns and is not a prediction of student failure.”
          </span>
        </div>

        {/* 5-Indicator Historical Comparison Grid */}
        <div className="mt-5 space-y-2.5">
          <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Indicator Shift Matrix (Current vs. 3-Week Historical Baseline)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {metricsComparison.map((m) => {
              const Icon = m.icon;
              const isDeclining = m.delta < 0;

              return (
                <div key={m.label} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-slate-200">
                      <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                      <span className="text-[11px] truncate max-w-[120px]">{m.label}</span>
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold flex items-center gap-0.5 ${
                        isDeclining ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {isDeclining ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      {m.delta > 0 ? `+${m.delta}%` : `${m.delta}%`}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-800/60">
                    <div className="text-[10px] text-slate-400 font-mono">
                      <span>Baseline: </span>
                      <span className="text-slate-300">{m.previous}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-white font-mono">{m.current}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explainable AI Pattern Context */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Pattern Diagnosis & Behavioral Synthesis</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {student.aiDiagnosticContext}
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-slate-500 font-mono">Suggested Course Action:</span>
            <span className="text-cyan-300 font-medium">{student.recommendedAction}</span>
          </div>
        </div>

        {/* Human Faculty Support Dispatcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-cyan-400" />
              <span>Human Faculty Support Dispatcher</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Non-Punitive Outreach</span>
          </div>

          {/* Intervention Strategy Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveActionTab('note')}
              className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                activeActionTab === 'note'
                  ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-3 h-3 mb-1 text-cyan-400" />
              <span className="block font-semibold">Empathetic Note</span>
              <span className="text-[10px] text-slate-400">Direct campus email</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveActionTab('office_hour')}
              className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                activeActionTab === 'office_hour'
                  ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3 h-3 mb-1 text-indigo-400" />
              <span className="block font-semibold">Office Hours Link</span>
              <span className="text-[10px] text-slate-400">1-on-1 invite</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveActionTab('mentor')}
              className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                activeActionTab === 'mentor'
                  ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3 h-3 mb-1 text-teal-400" />
              <span className="block font-semibold">Peer Tutor Referral</span>
              <span className="text-[10px] text-slate-400">Connect with TA</span>
            </button>
          </div>

          {/* Editable Support Message */}
          <div>
            <textarea
              rows={4}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleMarkReviewed}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Mark Reviewed Without Sending
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={handleSendOutreach}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white transition-all shadow-md shadow-cyan-500/25 flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Dispatching Support...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Faculty Support</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {actionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Support dispatched successfully to {student.studentId}. Status updated in faculty records.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
