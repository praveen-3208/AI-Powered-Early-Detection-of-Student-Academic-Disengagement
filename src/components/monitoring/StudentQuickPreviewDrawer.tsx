import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CalendarCheck2, 
  FileText, 
  Award, 
  Activity, 
  Users, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  Clock, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';
import EngagementFingerprint from './EngagementFingerprint';
import TrendSparkline from './TrendSparkline';

interface StudentQuickPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord | null;
  onOpenFullAnalysis: (student: StudentRecord) => void;
  onMarkReviewed: (studentId: string) => void;
}

export default function StudentQuickPreviewDrawer({
  isOpen,
  onClose,
  student,
  onOpenFullAnalysis,
  onMarkReviewed,
}: StudentQuickPreviewDrawerProps) {
  const [isWhyPanelOpen, setIsWhyPanelOpen] = useState(true);

  if (!isOpen || !student) return null;

  // Determine status color styling
  const isEarlyAlert = student.riskLevel === 'High Risk';
  const isChanging = student.riskLevel === 'Moderate Risk';

  const statusLabel = isEarlyAlert
    ? 'Early Alert'
    : isChanging
    ? 'Changing Pattern'
    : 'Stable';

  const statusBadge = isEarlyAlert
    ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
    : isChanging
    ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
    : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300';

  // Overall engagement score (composite average)
  const overallScore = Math.round(
    (student.attendance +
      student.assignmentCompletion +
      student.assessmentAverage +
      student.learningActivity +
      student.participation) /
      5
  );

  // Sparkline points
  const sparklineData = isEarlyAlert
    ? [86, 78, 64, overallScore]
    : isChanging
    ? [88, 85, 76, overallScore]
    : [92, 90, 93, overallScore];

  const trendType = isEarlyAlert || isChanging ? 'declining' : 'stable';

  // Indicators list with delta
  const metrics = [
    {
      name: 'Attendance',
      current: student.attendance,
      previous: student.previousAttendance,
      delta: student.attendance - student.previousAttendance,
      icon: CalendarCheck2,
      color: '#38bdf8',
    },
    {
      name: 'Assignments',
      current: student.assignmentCompletion,
      previous: student.previousAssignmentCompletion,
      delta: student.assignmentCompletion - student.previousAssignmentCompletion,
      icon: FileText,
      color: '#06b6d4',
    },
    {
      name: 'Assessments',
      current: student.assessmentAverage,
      previous: student.previousAssessmentAverage,
      delta: student.assessmentAverage - student.previousAssessmentAverage,
      icon: Award,
      color: '#818cf8',
    },
    {
      name: 'Learning Activity',
      current: student.learningActivity,
      previous: student.previousLearningActivity,
      delta: student.learningActivity - student.previousLearningActivity,
      icon: Activity,
      color: '#2dd4bf',
    },
    {
      name: 'Participation',
      current: student.participation,
      previous: student.previousParticipation,
      delta: student.participation - student.previousParticipation,
      icon: Users,
      color: '#a78bfa',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      />

      {/* Slide-over Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#070e1e] border-l border-cyan-500/25 shadow-2xl shadow-cyan-950/60 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-extrabold text-white text-base shadow-md">
                {student.studentId}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-mono">
                    {student.studentId}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusBadge}`}>
                    {statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Last analysis: Today, 10:45 AM</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Overall Engagement & Fingerprint Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Composite Engagement Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  {overallScore}%
                </span>
                <TrendSparkline
                  data={sparklineData}
                  trend={trendType}
                />
              </div>
              <p className="text-[11px] text-slate-400 pt-0.5">
                Observed delta across 4-week window
              </p>
            </div>

            {/* Engagement Fingerprint Radar Visual */}
            <div className="flex flex-col items-center">
              <EngagementFingerprint
                attendance={student.attendance}
                assignments={student.assignmentCompletion}
                assessments={student.assessmentAverage}
                activity={student.learningActivity}
                participation={student.participation}
                size={70}
                status={statusLabel}
              />
              <span className="text-[9px] font-mono text-cyan-300 mt-1">
                Fingerprint
              </span>
            </div>
          </div>

          {/* Change Detection: Previous vs Current Comparison */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                5 Indicator Change Detection
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                Previous → Current
              </span>
            </div>

            <div className="space-y-2">
              {metrics.map((m) => {
                const Icon = m.icon;
                const isDown = m.delta < 0;

                return (
                  <div
                    key={m.name}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center shrink-0"
                        style={{ color: m.color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-slate-200">{m.name}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400 text-[11px]">
                        {m.previous}% → <strong className="text-white font-semibold">{m.current}%</strong>
                      </span>
                      <span
                        className={`text-[11px] font-bold min-w-[42px] text-right flex items-center justify-end gap-0.5 ${
                          isDown ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {m.delta > 0 ? `+${m.delta}%` : `${m.delta}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10. AI EXPLANATION PREVIEW: “Why is this student here?” */}
          <div className="rounded-2xl bg-cyan-950/20 border border-cyan-500/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsWhyPanelOpen(!isWhyPanelOpen)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-cyan-950/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Why is this student flagged?
                </span>
              </div>
              {isWhyPanelOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isWhyPanelOpen && (
              <div className="p-3.5 pt-0 space-y-2.5 text-xs text-slate-300 border-t border-cyan-500/15">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Observed Behavioral Momentum:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-slate-200">
                    <li>{student.mainChange}</li>
                    <li>
                      Attendance variance: {student.previousAttendance}% → {student.attendance}% ({student.attendance - student.previousAttendance}%)
                    </li>
                    <li>
                      Assignment upload velocity delta: {student.assignmentCompletion - student.previousAssignmentCompletion}%
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-cyan-500/15">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block mb-0.5">
                    AI Interpretation (Non-Judgmental):
                  </span>
                  <p className="text-slate-300 leading-relaxed italic">
                    “Multiple academic engagement indicators have declined compared with the previous period. Faculty review may help determine whether additional support or office-hour check-in is appropriate.”
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Trust disclaimer */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Risk index is solely based on objective course milestones. The system does not claim certainty about underlying personal reasons.
            </span>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/80 sticky bottom-0 z-10 backdrop-blur-md space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenFullAnalysis(student);
              }}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-1.5"
            >
              <span>Open Full Analysis</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                onMarkReviewed(student.studentId);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Review Alert</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
