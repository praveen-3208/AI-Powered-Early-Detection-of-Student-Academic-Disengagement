import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CalendarCheck2, 
  FileText, 
  Award, 
  Activity, 
  Users, 
  Clock, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Layers,
  HeartHandshake,
  BookOpen,
  Send,
  UserCheck,
  Calendar,
  CheckSquare,
  FileCheck2,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';
import EngagementFingerprint from '../monitoring/EngagementFingerprint';

interface StudentAnalysisPageProps {
  student: StudentRecord;
  onBackToStudents: () => void;
  onBackToDashboard?: () => void;
  onUpdateStatus: (regNo: string, newStatus: 'reviewed' | 'support_initiated') => void;
  allStudents?: StudentRecord[];
  onSelectStudent?: (student: StudentRecord) => void;
  onViewAcademicPerformance?: (regNo: string) => void;
}

export default function StudentAnalysisPage({
  student,
  onBackToStudents,
  onBackToDashboard,
  onUpdateStatus,
  allStudents = [],
  onSelectStudent,
  onViewAcademicPerformance,
}: StudentAnalysisPageProps) {
  // Navigation & UI States
  const [selectedTrendMetric, setSelectedTrendMetric] = useState<
    'overall' | 'attendance' | 'assignments' | 'assessments' | 'activity' | 'participation'
  >('overall');

  const [isAlertHistoryOpen, setIsAlertHistoryOpen] = useState(false);
  const [isCompareModeOpen, setIsCompareModeOpen] = useState(false);
  const [selectedSupportActions, setSelectedSupportActions] = useState<string[]>([
    'Mentor Check-in',
    'Assignment Support'
  ]);
  const [facultyNote, setFacultyNote] = useState(student.facultyNotes || '');
  const [reviewStatus, setReviewStatus] = useState<'Pending Review' | 'Reviewed'>(
    student.status === 'reviewed' ? 'Reviewed' : 'Pending Review'
  );
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [reviewedTimestamp, setReviewedTimestamp] = useState<string | null>(null);

  // Status computation
  const isEarlyAlert = student.riskLevel === 'High Risk' || student.engagementStatus === 'Early Alert';
  const isChanging = student.riskLevel === 'Moderate Risk' || student.engagementStatus === 'Changing Pattern';

  const statusLabel = isEarlyAlert ? 'EARLY ALERT' : isChanging ? 'CHANGING PATTERN' : 'STABLE';
  const statusColor = isEarlyAlert ? 'text-rose-400' : isChanging ? 'text-amber-400' : 'text-emerald-400';
  const statusBadge = isEarlyAlert
    ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
    : isChanging
    ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
    : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300';

  // Metrics Data
  const metrics = [
    {
      key: 'attendance',
      name: 'Attendance',
      current: student.attendance,
      previous: student.previousAttendance,
      delta: student.attendance - student.previousAttendance,
      icon: CalendarCheck2,
      color: '#38bdf8',
    },
    {
      key: 'assignments',
      name: 'Assignment Completion',
      current: student.assignmentCompletion,
      previous: student.previousAssignmentCompletion,
      delta: student.assignmentCompletion - student.previousAssignmentCompletion,
      icon: FileText,
      color: '#06b6d4',
    },
    {
      key: 'assessments',
      name: 'Assessment Average',
      current: student.assessmentAverage,
      previous: student.previousAssessmentAverage,
      delta: student.assessmentAverage - student.previousAssessmentAverage,
      icon: Award,
      color: '#818cf8',
    },
    {
      key: 'activity',
      name: 'Learning Activity',
      current: student.learningActivity,
      previous: student.previousLearningActivity,
      delta: student.learningActivity - student.previousLearningActivity,
      icon: Activity,
      color: '#2dd4bf',
    },
    {
      key: 'participation',
      name: 'Participation',
      current: student.participation,
      previous: student.previousParticipation,
      delta: student.participation - student.previousParticipation,
      icon: Users,
      color: '#a78bfa',
    },
  ];

  // Support Suggestions List: dynamically generated based on student's actual contributing indicators (Requirement 12)
  const supportOptions = useMemo(() => {
    const opts: { id: string; label: string; desc: string; matched: boolean }[] = [];

    const attDropped = student.attendance < student.previousAttendance;
    const assignDropped = student.assignmentCompletion < student.previousAssignmentCompletion;
    const assessDropped = student.assessmentAverage < student.previousAssessmentAverage;
    const actDropped = student.learningActivity < student.previousLearningActivity;
    const partDropped = student.participation < student.previousParticipation;

    if (attDropped) {
      opts.push({
        id: 'Attendance Counseling',
        label: 'Attendance Counseling',
        desc: `Targeted advising session on lecture & laboratory presence (dropped by ${Math.abs(student.attendance - student.previousAttendance)}%).`,
        matched: true,
      });
    }

    if (assignDropped) {
      opts.push({
        id: 'Assignment Extension / Tutorial Support',
        label: 'Assignment Extension / Tutorial Support',
        desc: `Guidance on homework blockers, modular recursion labs, or temporary deadline extensions (dropped by ${Math.abs(student.assignmentCompletion - student.previousAssignmentCompletion)}%).`,
        matched: true,
      });
    }

    if (assessDropped) {
      opts.push({
        id: 'Remedial Academic Support',
        label: 'Remedial Academic Support',
        desc: `Faculty-led concept reviews and remedial problem-solving sets for internal assessment milestones (dropped by ${Math.abs(student.assessmentAverage - student.previousAssessmentAverage)}%).`,
        matched: true,
      });
    }

    if (actDropped) {
      opts.push({
        id: 'LMS Re-engagement',
        label: 'LMS Re-engagement Plan',
        desc: `Structured digital roadmap to re-engage with platform video lectures and supplementary reading materials.`,
        matched: true,
      });
    }

    if (partDropped) {
      opts.push({
        id: 'Seminar Engagement',
        label: 'Peer Discussion & Forum Engagement',
        desc: `Low-stakes seminar collaboration and designated study partner pairing to boost participation.`,
        matched: true,
      });
    }

    // Always provide core advising options
    opts.push({
      id: 'Mentor Check-in',
      label: '1:1 Mentor Check-in',
      desc: 'One-to-one confidential faculty conversation exploring holistic workload balance.',
      matched: false,
    });

    opts.push({
      id: 'Follow-up Monitoring',
      label: 'Follow-up Monitoring',
      desc: 'Scheduled checkpoint review across the next 2 bi-weekly submission cycles.',
      matched: false,
    });

    return opts;
  }, [student]);

  const toggleSupportOption = (id: string) => {
    setSelectedSupportActions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMarkAsReviewed = () => {
    setReviewStatus('Reviewed');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setReviewedTimestamp(`Today at ${now}`);
    onUpdateStatus(student.regNo, 'reviewed');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  const handleCreateSupportPlan = () => {
    onUpdateStatus(student.regNo, 'support_initiated');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  // 5. Trend chart data calculation
  const weeklyData = student.weeklyTrend || [
    { week: 'Week 1', overall: 82, attendance: 82, assignments: 88, assessments: 76, activity: 71, participation: 69 },
    { week: 'Week 2', overall: 79, attendance: 78, assignments: 84, assessments: 74, activity: 68, participation: 65 },
    { week: 'Week 3', overall: 67, attendance: 70, assignments: 68, assessments: 66, activity: 58, participation: 54 },
    { week: 'Week 4', overall: 51, attendance: 61, assignments: 54, assessments: 58, activity: 48, participation: 43 },
  ];

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const minY = 30;
  const maxY = 100;

  const getYCoord = (val: number) => {
    const ratio = (val - minY) / (maxY - minY);
    return svgHeight - paddingY - ratio * graphHeight;
  };

  const getXCoord = (index: number) => {
    return paddingX + (index / (weeklyData.length - 1)) * graphWidth;
  };

  const trendPoints = weeklyData.map((pt, i) => {
    const val = pt[selectedTrendMetric];
    return `${getXCoord(i)},${getYCoord(val)}`;
  }).join(' ');

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto w-full font-sans">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <button
              onClick={onBackToDashboard || onBackToStudents}
              className="hover:text-cyan-300 transition-colors"
            >
              Dashboard
            </button>
            <span>/</span>
            <button onClick={onBackToStudents} className="hover:text-cyan-300 transition-colors">
              Students
            </button>
            <span>/</span>
            <span className="text-cyan-400 font-bold">Student Analysis</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBackToStudents}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Students</span>
            </button>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Student Analysis
            </h1>

            {allStudents.length > 0 && onSelectStudent && (
              <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-slate-800">
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">Select:</span>
                <select
                  value={student.regNo}
                  onChange={(e) => {
                    const match = allStudents.find((s) => s.regNo === e.target.value);
                    if (match) onSelectStudent(match);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {allStudents.map((s) => (
                    <option key={s.regNo} value={s.regNo}>
                      {s.regNo} ({s.engagementStatus})
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <button
                    title="Previous Student"
                    disabled={allStudents.findIndex((s) => s.regNo === student.regNo) <= 0}
                    onClick={() => {
                      const idx = allStudents.findIndex((s) => s.regNo === student.regNo);
                      if (idx > 0) onSelectStudent(allStudents[idx - 1]);
                    }}
                    className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Next Student"
                    disabled={allStudents.findIndex((s) => s.regNo === student.regNo) >= allStudents.length - 1}
                    onClick={() => {
                      const idx = allStudents.findIndex((s) => s.regNo === student.regNo);
                      if (idx < allStudents.length - 1) onSelectStudent(allStudents[idx + 1]);
                    }}
                    className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI Analysis Updated · Today, 10:45 AM</span>
          </div>

          {onViewAcademicPerformance && (
            <button
              onClick={() => onViewAcademicPerformance(student.regNo)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>View Academic Performance</span>
            </button>
          )}

          <button
            onClick={() => {
              const reviewArea = document.getElementById('faculty-review-area');
              if (reviewArea) reviewArea.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Review Alert</span>
          </button>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Faculty decision recorded for Reg No <strong className="font-mono text-white">{student.regNo}</strong>. Audit trail updated with timestamp.
          </span>
        </div>
      )}

      {/* 2. STUDENT IDENTITY CARD */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a1428] via-[#091122] to-[#0d1633] border border-cyan-500/30 p-5 sm:p-7 shadow-2xl text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Identity Block */}
          <div className="flex items-center gap-4">
            {/* Minimal abstract academic/AI icon (NO student photo!) */}
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/60 shrink-0">
              <Cpu className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  REG NO
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                  {isEarlyAlert ? '🔴' : isChanging ? '🟡' : '🟢'} {statusLabel}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mt-0.5">
                {student.regNo}
              </h2>

              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <span>Class {student.classId}</span>
                <span>·</span>
                <span className="text-cyan-300 font-medium">
                  “Observed engagement indicators require faculty review.”
                </span>
              </p>
            </div>
          </div>

          {/* Quick Metrics on Header Card */}
          <div className="flex items-center gap-5 sm:gap-8 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Overall Engagement
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                  {student.overallEngagement}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Trajectory Trend
              </span>
              <div className={`text-base sm:text-lg font-bold font-mono mt-0.5 flex items-center gap-1 ${statusColor}`}>
                {student.trend === 'declining' ? '↘ Declining' : student.trend === 'improving' ? '↗ Improving' : '→ Stable'}
              </div>
            </div>

            {/* Compare Periods Button */}
            <button
              onClick={() => setIsCompareModeOpen(!isCompareModeOpen)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isCompareModeOpen ? 'Hide Comparison' : 'Compare Periods'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 12. COMPARISON MODE (INTERACTIVE DRAWER / INLINE) */}
      {isCompareModeOpen && (
        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/35 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Period Comparison Mode: Previous Window vs Current Window</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300">
              Delta Variance Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            {metrics.map((m) => (
              <div key={m.key} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-300 block truncate">{m.name}</span>
                <div className="mt-2 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Previous:</span>
                    <span className="text-slate-200">{m.previous}%</span>
                  </div>
                  <div className="flex justify-between text-white font-bold">
                    <span>Current:</span>
                    <span>{m.current}%</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-slate-800">
                    <span>Change:</span>
                    <span className={m.delta < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {m.delta > 0 ? `+${m.delta}%` : `${m.delta}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ENGAGEMENT OVERVIEW (5 DISTINCT METRIC CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isDown = m.delta < 0;

          return (
            <div
              key={m.key}
              className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-4 sm:p-5 shadow-xl text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 text-xs truncate max-w-[120px]">
                    {m.name}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800" style={{ color: m.color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                    {m.current}%
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">
                  Previous: {m.previous}%
                </span>
                <span
                  className={`font-bold flex items-center gap-0.5 ${
                    isDown ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {isDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {Math.abs(m.delta)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 & 5: ENGAGEMENT FINGERPRINT & TREND ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. ENGAGEMENT FINGERPRINT RADAR */}
        <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Engagement Fingerprint</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                5-Axis Radar
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Visual geometric profile mapping attendance, assignments, assessments, activity, and participation.
            </p>

            {/* Radar Diagram */}
            <div className="py-6 flex items-center justify-center">
              <EngagementFingerprint
                attendance={student.attendance}
                assignments={student.assignmentCompletion}
                assessments={student.assessmentAverage}
                activity={student.learningActivity}
                participation={student.participation}
                size={140}
                status={statusLabel as any}
              />
            </div>
          </div>

          {/* Pattern Summary */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Pattern Summary
            </span>
            <p className="text-xs font-semibold text-slate-200">
              “Engagement is currently below the previous period across multiple indicators.”
            </p>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Uneven shape indicates concentrated drop in lab participation and homework completion.
            </p>
          </div>
        </div>

        {/* 5. TREND ANALYSIS (4-8 WEEK CHART) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Engagement Trend (4-Week Horizon)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track weekly progression slopes for Reg No {student.regNo}
                </p>
              </div>

              {/* Metric Switcher */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                {[
                  { key: 'overall', label: 'Overall' },
                  { key: 'attendance', label: 'Attendance' },
                  { key: 'assignments', label: 'Assignments' },
                  { key: 'assessments', label: 'Assessments' },
                  { key: 'activity', label: 'LMS Activity' },
                  { key: 'participation', label: 'Participation' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedTrendMetric(tab.key as any)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      selectedTrendMetric === tab.key
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/50 font-semibold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* The SVG Line Graph */}
            <div className="my-4 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 sm:h-52">
                {/* Horizontal grid lines */}
                {[40, 60, 80, 100].map((level) => {
                  const y = getYCoord(level);
                  return (
                    <g key={level}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="rgba(51, 65, 85, 0.35)"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text x={paddingX - 8} y={y + 3} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                        {level}%
                      </text>
                    </g>
                  );
                })}

                {/* Vertical week labels */}
                {weeklyData.map((pt, i) => {
                  const x = getXCoord(i);
                  return (
                    <g key={pt.week}>
                      <line x1={x} y1={paddingY} x2={x} y2={svgHeight - paddingY} stroke="rgba(51, 65, 85, 0.2)" strokeWidth="1" />
                      <text x={x} y={svgHeight - paddingY + 16} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">
                        {pt.week}
                      </text>
                    </g>
                  );
                })}

                {/* Line graph */}
                <polyline fill="none" stroke="#38bdf8" strokeWidth="4" strokeOpacity="0.2" points={trendPoints} />
                <polyline fill="none" stroke="#06b6d4" strokeWidth="2.4" points={trendPoints} />

                {/* Point nodes */}
                {weeklyData.map((pt, i) => {
                  const x = getXCoord(i);
                  const y = getYCoord(pt[selectedTrendMetric]);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#070e1e" stroke="#06b6d4" strokeWidth="2" />
                      <text x={x} y={y - 8} textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        {pt[selectedTrendMetric]}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
            <span>Historical slope: {weeklyData[0][selectedTrendMetric]}% (Week 1) → {weeklyData[weeklyData.length - 1][selectedTrendMetric]}% (Week 4)</span>
            <span className={statusColor}>
              Δ {weeklyData[weeklyData.length - 1][selectedTrendMetric] - weeklyData[0][selectedTrendMetric]}% Net Shift
            </span>
          </div>
        </div>
      </div>

      {/* 6 & 7: AI EXPLANATION & EXPLAINABLE RISK SCORE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 6. AI EXPLANATION PANEL */}
        <div className="rounded-2xl bg-cyan-950/20 border border-cyan-500/30 p-5 sm:p-6 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Why was this Reg No flagged?
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              Evidence Grounded
            </span>
          </div>

          {/* Observed changes bullets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Observed changes:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {metrics.map((m) => (
                <li key={m.key} className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 font-mono">
                  <span>• {m.name} {m.delta < 0 ? 'decreased' : 'changed'} from {m.previous}% to {m.current}%</span>
                  <span className={m.delta < 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {m.delta < 0 ? `↓ ${Math.abs(m.delta)}%` : `+${m.delta}%`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* EngageAI Insight Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block font-semibold">
              EngageAI Insight
            </span>
            <p className="text-xs sm:text-sm text-white leading-relaxed">
              “Multiple engagement indicators have declined compared with the previous period. The system has therefore marked this Reg No for faculty review.”
            </p>
            <p className="text-[11px] text-slate-400 leading-normal pt-1 border-t border-slate-800">
              The platform notes objective behavioral deltas only. Faculty consultation is recommended to understand appropriate course accommodations.
            </p>
          </div>
        </div>

        {/* 7. RISK SCORE BREAKDOWN */}
        <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Explainable Risk Score</span>
              </h3>
              <div className="text-right font-mono">
                <span className="text-lg font-bold text-white">{student.riskScore}</span>
                <span className="text-xs text-slate-400"> / 100</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Transparent additive point contributions based on verified threshold deviations:
            </p>

            {/* Horizontal Bar Breakdown */}
            <div className="space-y-2.5 mt-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Attendance Contribution</span>
                  <span className="text-white font-bold">{student.riskBreakdown.attendancePoints} pts</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-sky-400 h-2 rounded-full" style={{ width: `${(student.riskBreakdown.attendancePoints / 30) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Assignment Contribution</span>
                  <span className="text-white font-bold">{student.riskBreakdown.assignmentPoints} pts</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${(student.riskBreakdown.assignmentPoints / 30) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Assessment Contribution</span>
                  <span className="text-white font-bold">{student.riskBreakdown.assessmentPoints} pts</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-indigo-400 h-2 rounded-full" style={{ width: `${(student.riskBreakdown.assessmentPoints / 30) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Learning Activity Contribution</span>
                  <span className="text-white font-bold">{student.riskBreakdown.activityPoints} pts</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${(student.riskBreakdown.activityPoints / 30) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Participation Contribution</span>
                  <span className="text-white font-bold">{student.riskBreakdown.participationPoints} pts</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${(student.riskBreakdown.participationPoints / 30) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 font-sans leading-normal">
            “Risk score represents observed engagement patterns and is not a prediction of student failure.”
          </div>
        </div>
      </div>

      {/* 8. CHANGE DETECTION TIMELINE */}
      <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Significant Changes Detected
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Chronological Sequence
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(student.significantChanges && student.significantChanges.length > 0
            ? student.significantChanges
            : [
                { id: '1', indicator: 'Assessment trend updated', previousValue: 76, currentValue: 58, changePercent: -18, date: 'Today' },
                { id: '2', indicator: 'Assignment completion declined', previousValue: 88, currentValue: 54, changePercent: -34, date: '2 days ago' },
                { id: '3', indicator: 'Attendance trend declined', previousValue: 82, currentValue: 61, changePercent: -21, date: '5 days ago' },
                { id: '4', indicator: 'Learning activity declined', previousValue: 71, currentValue: 48, changePercent: -23, date: '1 week ago' },
                { id: '5', indicator: 'Participation frequency declined', previousValue: 69, currentValue: 43, changePercent: -26, date: '10 days ago' },
              ]
          ).map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
              <span className="text-[10px] font-mono text-cyan-400 block font-semibold">
                {item.date}
              </span>
              <p className="font-semibold text-slate-200 line-clamp-1">{item.indicator}</p>
              <div className="flex items-baseline justify-between font-mono pt-1 text-[11px]">
                <span className="text-slate-400">{item.previousValue}% → {item.currentValue}%</span>
                <span className="text-rose-400 font-bold">↓ {Math.abs(item.changePercent)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. SUPPORT SUGGESTIONS (SELECTABLE CARDS) */}
      <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-cyan-400" />
              <span>Possible Faculty Support</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select one or multiple intervention strategies to configure for this Reg No:
            </p>
          </div>

          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            {selectedSupportActions.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {supportOptions.map((opt) => {
            const isSelected = selectedSupportActions.includes(opt.id);

            return (
              <div
                key={opt.id}
                onClick={() => toggleSupportOption(opt.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className={isSelected ? 'text-white' : 'text-slate-200'}>{opt.label}</span>
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                    isSelected ? 'bg-cyan-500 border-cyan-400 text-white' : 'border-slate-700 bg-slate-950'
                  }`}>
                    {isSelected && '✓'}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{opt.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium">
          “AI provides support suggestions. Final intervention decisions remain with faculty.”
        </div>
      </div>

      {/* 10. FACULTY REVIEW AREA */}
      <div id="faculty-review-area" className="rounded-2xl bg-gradient-to-b from-[#0b162c] to-[#070e1e] border border-cyan-500/25 p-5 sm:p-7 shadow-2xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-cyan-400" />
              <span>Faculty Review Area</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
              Official Instructor Log for Reg No {student.regNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Review Status:</span>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
              reviewStatus === 'Reviewed'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
            }`}>
              {reviewStatus}
            </span>
            {reviewedTimestamp && (
              <span className="text-[11px] font-mono text-slate-400">({reviewedTimestamp})</span>
            )}
          </div>
        </div>

        {/* Large Faculty Notes Text Area */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
            Faculty Observations & Action Plan Notes:
          </label>
          <textarea
            rows={4}
            value={facultyNote}
            onChange={(e) => setFacultyNote(e.target.value)}
            placeholder="Document confidential notes on recent office hour discussions, verified accommodation extensions, or scheduled mentor sync..."
            className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={onBackToStudents}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            ← Return to Student List
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCreateSupportPlan}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Create Support Plan</span>
            </button>

            <button
              onClick={handleMarkAsReviewed}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Reviewed</span>
            </button>
          </div>
        </div>
      </div>

      {/* 11. ALERT HISTORY (COLLAPSIBLE) */}
      <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 overflow-hidden text-left shadow-xl">
        <button
          type="button"
          onClick={() => setIsAlertHistoryOpen(!isAlertHistoryOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-900/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Alert History ({student.alertHistory?.length || 3} Logs)
            </h3>
          </div>
          {isAlertHistoryOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isAlertHistoryOpen && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 space-y-2">
            {(student.alertHistory && student.alertHistory.length > 0
              ? student.alertHistory
              : [
                  { id: '1', alertNumber: 'Alert 01', patternType: 'Moderate Pattern', changeSummary: 'Attendance decline', status: 'Reviewed', date: '3 weeks ago' },
                  { id: '2', alertNumber: 'Alert 02', patternType: 'Changing Pattern', changeSummary: 'Assignment decline', status: 'Reviewed', date: '12 days ago' },
                  { id: '3', alertNumber: 'Alert 03', patternType: 'Early Alert', changeSummary: 'Multiple indicators', status: 'Pending Review', date: 'Today' },
                ]
            ).map((hist) => (
              <div
                key={hist.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-cyan-400">{hist.alertNumber}</span>
                  <span className="text-slate-300">{hist.patternType}: {hist.changeSummary}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-400">{hist.date}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    hist.status === 'Reviewed' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {hist.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 13. DATA PRIVACY & TRUST MESSAGE */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-400 space-y-2 text-left">
        <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy-first academic monitoring</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
          <div>✓ Registration number based identification</div>
          <div>✓ Non-sensitive academic indicators</div>
          <div>✓ Human-reviewed interventions</div>
          <div>✓ No automatic academic penalties</div>
        </div>
      </div>
    </div>
  );
}
