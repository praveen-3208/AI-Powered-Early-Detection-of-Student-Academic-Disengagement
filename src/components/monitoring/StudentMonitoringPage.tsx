import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UploadCloud, 
  Download, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';
import EngagementFingerprint from './EngagementFingerprint';
import TrendSparkline from './TrendSparkline';
import FacultyAttentionQueuePanel from './FacultyAttentionQueuePanel';
import StudentQuickPreviewDrawer from './StudentQuickPreviewDrawer';

interface StudentMonitoringPageProps {
  students: StudentRecord[];
  onOpenAnalysisModal: (student: StudentRecord) => void;
  onOpenAddDataModal: () => void;
  onUpdateStudentStatus: (studentId: string, newStatus: 'reviewed' | 'support_initiated') => void;
  initialFilter?: string | null;
}

export type FilterCategory = 
  | 'all'
  | 'stable'
  | 'changing'
  | 'early_alert'
  | 'att_decline'
  | 'assign_decline'
  | 'assess_decline'
  | 'lms_decline'
  | 'part_decline';

export default function StudentMonitoringPage({
  students,
  onOpenAnalysisModal,
  onOpenAddDataModal,
  onUpdateStudentStatus,
  initialFilter,
}: StudentMonitoringPageProps) {
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Active filter chip
  const [activeFilter, setActiveFilter] = useState<FilterCategory>(() => {
    if (initialFilter === 'low') return 'stable';
    if (initialFilter === 'moderate') return 'changing';
    if (initialFilter === 'high') return 'early_alert';
    if (initialFilter === 'signal_attendance') return 'att_decline';
    if (initialFilter === 'signal_assignments') return 'assign_decline';
    if (initialFilter === 'signal_assessments') return 'assess_decline';
    if (initialFilter === 'signal_activity') return 'lms_decline';
    if (initialFilter === 'signal_participation') return 'part_decline';
    return 'all';
  });

  // Pagination: Requirement 10 (25, 50, 100, or All students per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(50);

  // Sorting: Requirement 10 (Reg No, Risk Score, Engagement Score, Attendance, Performance)
  const [sortField, setSortField] = useState<'regNo' | 'engagement' | 'risk' | 'performance' | 'attendance'>('regNo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Selected student for quick preview drawer
  const [previewStudent, setPreviewStudent] = useState<StudentRecord | null>(null);

  // Export report notification
  const [exportNotice, setExportNotice] = useState(false);

  // Overall counts
  const totalCount = students.length;
  const stableCount = students.filter((s) => s.riskLevel === 'Low Risk').length;
  const changingCount = students.filter((s) => s.riskLevel === 'Moderate Risk').length;
  const earlyAlertCount = students.filter((s) => s.riskLevel === 'High Risk').length;
  const requireReviewCount = students.filter((s) => s.needsReview).length;

  // Filtered & Sorted dataset
  const filteredStudents = useMemo(() => {
    const list = students.filter((s) => {
      // 1. Search Query (supports Reg No or observed change)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || s.regNo.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.mainChange.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      // 2. Filter Category
      if (activeFilter === 'stable') return s.riskLevel === 'Low Risk';
      if (activeFilter === 'changing') return s.riskLevel === 'Moderate Risk';
      if (activeFilter === 'early_alert') return s.riskLevel === 'High Risk';
      if (activeFilter === 'att_decline') return s.attendance < s.previousAttendance;
      if (activeFilter === 'assign_decline') return s.assignmentCompletion < s.previousAssignmentCompletion;
      if (activeFilter === 'assess_decline') return s.assessmentAverage < s.previousAssessmentAverage;
      if (activeFilter === 'lms_decline') return s.learningActivity < s.previousLearningActivity;
      if (activeFilter === 'part_decline') return s.participation < s.previousParticipation;

      return true;
    });

    // Sort
    return list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'regNo') {
        comparison = a.regNo.localeCompare(b.regNo);
      } else if (sortField === 'engagement') {
        comparison = (a.overallEngagementScore || a.overallEngagement) - (b.overallEngagementScore || b.overallEngagement);
      } else if (sortField === 'risk') {
        comparison = a.riskScore - b.riskScore;
      } else if (sortField === 'performance') {
        comparison = a.assessmentAverage - b.assessmentAverage;
      } else if (sortField === 'attendance') {
        comparison = a.attendance - b.attendance;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [students, searchQuery, activeFilter, sortField, sortDirection]);

  // Pagination calculation (Requirement 10: 25, 50, 100, or All)
  const numericPageSize = pageSize === 'all' ? (filteredStudents.length || 1) : pageSize;
  const totalPages = Math.ceil(filteredStudents.length / numericPageSize) || 1;
  const paginatedStudents = useMemo(() => {
    if (pageSize === 'all') return filteredStudents;
    const startIndex = (currentPage - 1) * numericPageSize;
    return filteredStudents.slice(startIndex, startIndex + numericPageSize);
  }, [filteredStudents, currentPage, pageSize, numericPageSize]);

  // Handle Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Reg No',
      'Status',
      'Risk Score',
      'Engagement Score',
      'Attendance (%)',
      'Prev Attendance (%)',
      'Assignments (%)',
      'Prev Assignments (%)',
      'Assessments (%)',
      'Prev Assessments (%)',
      'Learning Activity (%)',
      'Prev Learning Activity (%)',
      'Participation (%)',
      'Prev Participation (%)',
      'Observed Changes',
    ];

    const rows = students.map((s) => [
      s.regNo,
      s.riskLevel,
      s.riskScore,
      s.overallEngagement,
      s.attendance,
      s.previousAttendance,
      s.assignmentCompletion,
      s.previousAssignmentCompletion,
      s.assessmentAverage,
      s.previousAssessmentAverage,
      s.learningActivity,
      s.previousLearningActivity,
      s.participation,
      s.previousParticipation,
      `"${s.mainChange.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EngageAI_Student_Monitoring_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Student Monitoring
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI Analysis Updated
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Track engagement patterns, review emerging changes, and identify students who may need faculty attention.
          </p>

          <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Last analysis: Today, 10:45 AM</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddDataModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/35 text-cyan-300 text-xs font-semibold transition-all shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add / Import Academic Data</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Exported full {students.length}-student telemetry dataset to CSV.</span>
        </div>
      )}

      {/* 2. TOP INSIGHT STRIP (Class Pulse Strip) */}
      <div className="rounded-2xl bg-[#091122]/95 border border-slate-800/90 p-4 sm:p-5 shadow-xl space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Total Students */}
          <button
            onClick={() => setActiveFilter('all')}
            className={`p-3 rounded-xl text-left transition-all border ${
              activeFilter === 'all'
                ? 'bg-cyan-950/40 border-cyan-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Total Students
            </span>
            <span className="text-2xl font-extrabold font-mono text-white tabular-nums">
              {totalCount}
            </span>
          </button>

          {/* Stable */}
          <button
            onClick={() => setActiveFilter('stable')}
            className={`p-3 rounded-xl text-left transition-all border ${
              activeFilter === 'stable'
                ? 'bg-emerald-950/40 border-emerald-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/30'
            }`}
          >
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Stable
            </span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {stableCount}
            </span>
          </button>

          {/* Changing Pattern */}
          <button
            onClick={() => setActiveFilter('changing')}
            className={`p-3 rounded-xl text-left transition-all border ${
              activeFilter === 'changing'
                ? 'bg-amber-950/40 border-amber-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/30'
            }`}
          >
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Changing Pattern
            </span>
            <span className="text-2xl font-extrabold font-mono text-amber-400 tabular-nums">
              {changingCount}
            </span>
          </button>

          {/* Early Alert */}
          <button
            onClick={() => setActiveFilter('early_alert')}
            className={`p-3 rounded-xl text-left transition-all border ${
              activeFilter === 'early_alert'
                ? 'bg-rose-950/40 border-rose-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-rose-500/30'
            }`}
          >
            <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Early Alert
            </span>
            <span className="text-2xl font-extrabold font-mono text-rose-400 tabular-nums">
              {earlyAlertCount}
            </span>
          </button>

          {/* Require Review */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Require Review
            </span>
            <span className="text-2xl font-extrabold font-mono text-cyan-300 tabular-nums">
              {requireReviewCount}
            </span>
          </div>
        </div>

        {/* Small text insight */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            “Most students remain stable. A small group shows meaningful changes across multiple indicators.”
          </span>
        </div>
      </div>

      {/* 3 & 4. SMART SEARCH & SMART FILTERS */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Large Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Registration Number (e.g. 922525106001, 922525106125)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091122] border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500 font-mono shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-xs font-mono text-cyan-400 hover:text-white"
            >
              Clear Search
            </button>
          )}

          {/* Sort Controls (Requirement 10) */}
          <div className="flex items-center gap-2 bg-[#091122] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="regNo" className="bg-slate-900 text-white">Reg No</option>
              <option value="risk" className="bg-slate-900 text-white">Risk Score</option>
              <option value="engagement" className="bg-slate-900 text-white">Engagement Score</option>
              <option value="attendance" className="bg-slate-900 text-white">Attendance</option>
              <option value="performance" className="bg-slate-900 text-white">Academic Performance</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white font-semibold transition-colors"
              title="Toggle Sort Order"
            >
              {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          {[
            { id: 'all' as FilterCategory, label: `All Students (${totalCount})` },
            { id: 'stable' as FilterCategory, label: `Stable (${stableCount})` },
            { id: 'changing' as FilterCategory, label: `Changing Pattern (${changingCount})` },
            { id: 'early_alert' as FilterCategory, label: `Early Alert (${earlyAlertCount})` },
            { id: 'att_decline' as FilterCategory, label: 'Attendance Decline' },
            { id: 'assign_decline' as FilterCategory, label: 'Assignment Decline' },
            { id: 'assess_decline' as FilterCategory, label: 'Assessment Decline' },
            { id: 'lms_decline' as FilterCategory, label: 'Learning Activity Decline' },
            { id: 'part_decline' as FilterCategory, label: 'Participation Decline' },
          ].map((chip) => {
            const isSelected = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  setActiveFilter(chip.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-sm'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. MAIN STUDENT MONITORING AREA (HYBRID LAYOUT: LEFT TABLE + RIGHT ATTENTION QUEUE) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT: Student Table / Cards (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#091122]/95 border border-slate-800/90 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              Displaying {paginatedStudents.length > 0 ? (currentPage - 1) * numericPageSize + 1 : 0}–
              {Math.min(currentPage * numericPageSize, filteredStudents.length)} of {filteredStudents.length} Students
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Click student row for Quick Preview Drawer
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3.5 font-semibold">Reg No</th>
                  <th className="py-3 px-3 font-semibold text-center">Fingerprint</th>
                  <th className="py-3 px-3 font-semibold">Risk Level</th>
                  <th className="py-3 px-3 font-semibold">Engagement Score</th>
                  <th className="py-3 px-3 font-semibold">Attendance</th>
                  <th className="py-3 px-3 font-semibold">Assignments</th>
                  <th className="py-3 px-3 font-semibold">Assessment</th>
                  <th className="py-3 px-3 font-semibold">Learning Activity</th>
                  <th className="py-3 px-3 font-semibold">Participation</th>
                  <th className="py-3 px-3 font-semibold">Trend</th>
                  <th className="py-3 px-3 font-semibold">Review Status</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => {
                    const isEarlyAlert = student.riskLevel === 'High Risk';
                    const isChanging = student.riskLevel === 'Moderate Risk';

                    const statusBadgeClass = isEarlyAlert
                      ? 'bg-rose-950/70 text-rose-300 border-rose-500/30'
                      : isChanging
                      ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';

                    const statusLabel = isEarlyAlert
                      ? 'Early Alert'
                      : isChanging
                      ? 'Changing Pattern'
                      : 'Stable';

                    const overall = student.overallEngagementScore || student.overallEngagement;

                    const sparklineData = student.sparkline && student.sparkline.length >= 4
                      ? student.sparkline
                      : (isEarlyAlert
                        ? [84, 76, 62, overall]
                        : isChanging
                        ? [88, 84, 75, overall]
                        : [92, 90, 93, overall]);

                    const trendType = student.trend || (isEarlyAlert || isChanging ? 'declining' : 'stable');

                    // Deltas
                    const attDelta = student.attendance - student.previousAttendance;
                    const assignDelta = student.assignmentCompletion - student.previousAssignmentCompletion;
                    const assessDelta = student.assessmentAverage - student.previousAssessmentAverage;

                    return (
                      <tr
                        key={student.regNo}
                        onClick={() => setPreviewStudent(student)}
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      >
                        {/* Reg No */}
                        <td className="py-3 px-3.5 font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                          {student.regNo}
                        </td>

                        {/* 6. Engagement Fingerprint Radar */}
                        <td className="py-2 px-3 text-center">
                          <EngagementFingerprint
                            attendance={student.attendance}
                            assignments={student.assignmentCompletion}
                            assessments={student.assessmentAverage}
                            activity={student.learningActivity}
                            participation={student.participation}
                            size={36}
                            status={statusLabel}
                          />
                        </td>

                        {/* Risk Level */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isEarlyAlert ? 'bg-rose-400' : isChanging ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            />
                            {student.riskLevel}
                          </span>
                        </td>

                        {/* Engagement Score */}
                        <td className="py-3 px-3 font-bold text-white">
                          {overall}%
                        </td>

                        {/* Attendance (Current + Delta) */}
                        <td className="py-3 px-3">
                          <span className={student.attendance < 75 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                            {student.attendance}%
                          </span>
                          {attDelta !== 0 && (
                            <span
                              className={`block text-[10px] ${
                                attDelta < 0 ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {attDelta < 0 ? `↓ ${Math.abs(attDelta)}%` : `↑ ${attDelta}%`}
                            </span>
                          )}
                        </td>

                        {/* Assignments (Current + Delta) */}
                        <td className="py-3 px-3">
                          <span className={student.assignmentCompletion < 75 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                            {student.assignmentCompletion}%
                          </span>
                          {assignDelta !== 0 && (
                            <span
                              className={`block text-[10px] ${
                                assignDelta < 0 ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {assignDelta < 0 ? `↓ ${Math.abs(assignDelta)}%` : `↑ ${assignDelta}%`}
                            </span>
                          )}
                        </td>

                        {/* Assessment */}
                        <td className="py-3 px-3">
                          <span className={student.assessmentAverage < 75 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                            {student.assessmentAverage}%
                          </span>
                          {assessDelta !== 0 && (
                            <span
                              className={`block text-[10px] ${
                                assessDelta < 0 ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {assessDelta < 0 ? `↓ ${Math.abs(assessDelta)}%` : `↑ ${assessDelta}%`}
                            </span>
                          )}
                        </td>

                        {/* Learning Activity */}
                        <td className="py-3 px-3 text-slate-300">
                          {student.learningActivity}%
                        </td>

                        {/* Participation */}
                        <td className="py-3 px-3 text-slate-300">
                          {student.participation}%
                        </td>

                        {/* 11. Trend Sparkline */}
                        <td className="py-3 px-3">
                          <TrendSparkline
                            data={sparklineData}
                            trend={trendType}
                            width={44}
                            height={18}
                          />
                        </td>

                        {/* Review Status */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                              student.status === 'reviewed'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                : student.status === 'support_initiated'
                                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                                : student.needsReview
                                ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {student.status === 'reviewed'
                              ? 'Reviewed'
                              : student.status === 'support_initiated'
                              ? 'Support Planned'
                              : student.needsReview
                              ? 'Needs Review'
                              : 'Monitored'}
                          </span>
                        </td>

                        {/* Action: [View Details & Mark Reviewed] */}
                        <td className="py-3 px-3.5 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {student.needsReview && (
                              <button
                                onClick={() => onUpdateStudentStatus(student.regNo, 'reviewed')}
                                className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold transition-colors whitespace-nowrap"
                                title="Mark as Reviewed"
                              >
                                Mark Reviewed
                              </button>
                            )}
                            <button
                              onClick={() => onOpenAnalysisModal(student)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 text-xs font-semibold transition-colors whitespace-nowrap"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} className="py-10 text-center text-slate-400 font-sans">
                      No student records match the active search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 13. PAGINATION (Requirement 10: 25, 50, 100, or All) */}
          <div className="p-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                    setPageSize(val);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                  <option value="all">All 360 Students</option>
                </select>
              </div>

              <span className="hidden sm:inline text-slate-600">·</span>

              <span>
                Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
              </span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="text-cyan-300">
                Range: {filteredStudents.length > 0 ? (currentPage - 1) * numericPageSize + 1 : 0}–{Math.min(currentPage * numericPageSize, filteredStudents.length)} of {filteredStudents.length} students
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                disabled={currentPage === 1 || pageSize === 'all'}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none border border-slate-800 text-slate-200 font-medium flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              {/* Quick Jump Buttons for Pages */}
              {pageSize !== 'all' && (
                <div className="hidden md:flex items-center gap-1">
                  {Array.from({ length: Math.min(8, totalPages) }, (_, idx) => {
                    let pNum = idx + 1;
                    if (totalPages > 8 && currentPage > 5) {
                      pNum = Math.min(totalPages - 7 + idx, currentPage - 4 + idx);
                    }
                    return (
                      <button
                        key={pNum}
                        onClick={() => setCurrentPage(pNum)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors ${
                          currentPage === pNum
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                        title={`Page ${pNum}`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                disabled={currentPage >= totalPages || pageSize === 'all'}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none border border-slate-800 text-slate-200 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: 9. FACULTY ATTENTION QUEUE (LIVE ATTENTION PANEL) (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <FacultyAttentionQueuePanel
            students={students}
            onReviewStudent={(stu) => setPreviewStudent(stu)}
            onOpenAllAlerts={() => setActiveFilter('early_alert')}
          />

          {/* 15. Risk Calculation Explainer Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-semibold text-[11px] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diagnostic Scoring Standard</span>
            </div>
            <p className="leading-relaxed">
              “Risk score reflects observed engagement indicators and is not a prediction of student failure.”
            </p>
            <div className="pt-1.5 border-t border-slate-800/80 space-y-1 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-emerald-400">0–30:</span>
                <span>Stable Baseline</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400">31–60:</span>
                <span>Changing Pattern</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-400">61–100:</span>
                <span>Early Alert Threshold</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 12. STUDENT QUICK PREVIEW SIDE DRAWER */}
      <StudentQuickPreviewDrawer
        isOpen={Boolean(previewStudent)}
        onClose={() => setPreviewStudent(null)}
        student={previewStudent}
        onOpenFullAnalysis={(stu) => onOpenAnalysisModal(stu)}
        onMarkReviewed={(sid) => onUpdateStudentStatus(sid, 'reviewed')}
      />
    </div>
  );
}
