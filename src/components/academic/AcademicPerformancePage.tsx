import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck2, 
  ArrowRight, 
  Download, 
  PlusCircle, 
  Search, 
  Sliders, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Layers, 
  Clock, 
  ExternalLink,
  ChevronDown,
  Cpu,
  ArrowUpRight
} from 'lucide-react';
import { 
  StudentAcademicRecord, 
  INITIAL_ACADEMIC_DATA_MAP, 
  ALL_STUDENT_REG_NOS, 
  SUBJECT_NAMES, 
  SubjectMarks, 
  QuizTestItem,
  buildStudentAcademicRecord
} from '../../data/demoAcademicData';
import { StudentRecord } from '../../data/demoStudents';
import AddAssessmentModal from './AddAssessmentModal';
import CompareExamsModal from './CompareExamsModal';
import SubjectDetailModal from './SubjectDetailModal';
import ExportPerformanceModal from './ExportPerformanceModal';

interface AcademicPerformancePageProps {
  initialRegNo?: string;
  onNavigateToStudentAnalysis: (regNo: string) => void;
  students?: StudentRecord[];
}

export default function AcademicPerformancePage({
  initialRegNo = '922525106003',
  onNavigateToStudentAnalysis,
  students,
}: AcademicPerformancePageProps) {
  // Academic Data State (Stores records for all 30 students)
  const [academicDataMap, setAcademicDataMap] = useState<Record<string, StudentAcademicRecord>>(
    INITIAL_ACADEMIC_DATA_MAP
  );

  // Selected Student & Filter States
  const [selectedRegNo, setSelectedRegNo] = useState<string>(initialRegNo);
  const [regNoSearchQuery, setRegNoSearchQuery] = useState('');
  const [selectedExamFilter, setSelectedExamFilter] = useState<'all' | 'internal1' | 'internal2'>('all');
  const [trendSubjectFilter, setTrendSubjectFilter] = useState<string>('all');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedSubjectForDetail, setSelectedSubjectForDetail] = useState<SubjectMarks | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Current active student record (dynamically synced with replaced/recalculated dataset)
  const currentRecord = useMemo(() => {
    const base = academicDataMap[selectedRegNo] || buildStudentAcademicRecord(selectedRegNo);
    if (students && students.length > 0) {
      const match = students.find((s) => s.regNo === selectedRegNo || s.studentId === selectedRegNo);
      if (match) {
        const factor = match.assessmentAverage / 100;
        const updatedSubjects = base.subjects.map((subj, idx) => {
          const scaledTotal = Math.min(100, Math.max(25, Math.round(100 * factor * (1 + ((idx % 3) - 1) * 0.04))));
          const i1 = Math.round(scaledTotal / 2);
          const i2 = scaledTotal - i1;
          return {
            ...subj,
            internal1: i1,
            internal2: i2,
            total: scaledTotal,
            percentage: scaledTotal,
            performanceCategory: (scaledTotal >= 75 ? 'GOOD' : scaledTotal >= 50 ? 'AVERAGE' : 'NEEDS IMPROVEMENT') as 'GOOD' | 'AVERAGE' | 'NEEDS IMPROVEMENT',
          };
        });
        const i1Tot = updatedSubjects.reduce((acc, s) => acc + s.internal1, 0);
        const i2Tot = updatedSubjects.reduce((acc, s) => acc + s.internal2, 0);
        const comb = i1Tot + i2Tot;
        const ovPct = Number(((comb / 600) * 100).toFixed(1));
        return {
          ...base,
          internal1Total: i1Tot,
          internal1Percentage: Number(((i1Tot / 300) * 100).toFixed(1)),
          internal2Total: i2Tot,
          internal2Percentage: Number(((i2Tot / 300) * 100).toFixed(1)),
          combinedTotal: comb,
          overallPercentage: ovPct,
          performanceClassification: (ovPct >= 75 ? 'GOOD' : ovPct >= 50 ? 'AVERAGE' : 'NEEDS IMPROVEMENT') as 'GOOD' | 'AVERAGE' | 'NEEDS IMPROVEMENT',
          subjects: updatedSubjects,
        };
      }
    }
    return base;
  }, [academicDataMap, selectedRegNo, students]);

  // Requirement 13: Class Academic Overview calculated from all 360 students
  const cohortStats = useMemo(() => {
    const list = ALL_STUDENT_REG_NOS.map((reg) => academicDataMap[reg] || buildStudentAcademicRecord(reg));
    const totalCount = list.length || 1;
    const avgOverallPercentage = Number(
      (list.reduce((acc, r) => acc + r.overallPercentage, 0) / totalCount).toFixed(1)
    );
    const goodCount = list.filter((r) => r.overallPercentage >= 75).length;
    const averageCount = list.filter((r) => r.overallPercentage >= 50 && r.overallPercentage < 75).length;
    const needsImprovementCount = list.filter((r) => r.overallPercentage < 50).length;

    const subjectAverages = SUBJECT_NAMES.map((name, sIdx) => {
      const sum = list.reduce((acc, r) => {
        const s = r.subjects[sIdx];
        return acc + (s ? s.percentage : 0);
      }, 0);
      return {
        name,
        avg: Number((sum / totalCount).toFixed(1)),
      };
    });

    return {
      totalCount,
      avgOverallPercentage,
      goodCount,
      averageCount,
      needsImprovementCount,
      subjectAverages,
    };
  }, [academicDataMap]);

  // Subject distribution counts
  const goodSubjectsCount = currentRecord.subjects.filter((s) => s.performanceCategory === 'GOOD').length;
  const averageSubjectsCount = currentRecord.subjects.filter((s) => s.performanceCategory === 'AVERAGE').length;
  const needsImprovementSubjectsCount = currentRecord.subjects.filter(
    (s) => s.performanceCategory === 'NEEDS IMPROVEMENT'
  ).length;

  // Sorted subjects for Strongest vs Needing Attention
  const sortedByScore = useMemo(() => {
    return [...currentRecord.subjects].sort((a, b) => b.percentage - a.percentage);
  }, [currentRecord]);

  const strongestSubjects = sortedByScore.slice(0, 3);
  const subjectsNeedingAttention = [...currentRecord.subjects]
    .filter((s) => s.percentage < 75)
    .sort((a, b) => a.percentage - b.percentage);

  // Add new assessment handler
  const handleAddAssessment = (itemData: Omit<QuizTestItem, 'id' | 'percentage'>) => {
    const newId = `quiz-${Date.now()}`;
    const pct = Number(((itemData.marksObtained / itemData.maxMarks) * 100).toFixed(1));
    const newItem: QuizTestItem = {
      ...itemData,
      id: newId,
      percentage: pct,
    };

    setAcademicDataMap((prev) => {
      const existing = prev[selectedRegNo] || buildStudentAcademicRecord(selectedRegNo);
      const updatedQuizzes = [newItem, ...existing.quizzesAndTests];
      const newAvg = Number(
        (
          updatedQuizzes.reduce((acc, q) => acc + q.percentage, 0) / updatedQuizzes.length
        ).toFixed(2)
      );

      const newScore = Math.round(
        existing.overallPercentage * 0.5 + newAvg * 0.3 + existing.scoreBreakdown.subjectConsistency * 0.2
      );

      return {
        ...prev,
        [selectedRegNo]: {
          ...existing,
          quizzesAndTests: updatedQuizzes,
          quizTestAverage: newAvg,
          overallScore: newScore,
          scoreBreakdown: {
            ...existing.scoreBreakdown,
            quizTest: newAvg,
          },
        },
      };
    });

    showToast(`Assessment "${itemData.name}" recorded for Reg No ${selectedRegNo}.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Reg Nos list for the searchable dropdown
  const filteredRegNos = useMemo(() => {
    if (!regNoSearchQuery.trim()) return ALL_STUDENT_REG_NOS;
    return ALL_STUDENT_REG_NOS.filter((r) => r.includes(regNoSearchQuery.trim()));
  }, [regNoSearchQuery]);

  // Overall Percentage Prominence Variables
  const overallPct = currentRecord.overallPercentage;
  const isGood = currentRecord.performanceClassification === 'GOOD';
  const isAverage = currentRecord.performanceClassification === 'AVERAGE';

  const categoryTheme = isGood
    ? {
        border: 'border-emerald-500/40',
        bgGlow: 'from-emerald-950/40 via-slate-900 to-slate-950',
        text: 'text-emerald-400',
        badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
        desc: 'Overall performance is currently in the Good range.',
      }
    : isAverage
    ? {
        border: 'border-cyan-500/40',
        bgGlow: 'from-cyan-950/40 via-slate-900 to-slate-950',
        text: 'text-cyan-400',
        badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
        desc: 'Overall performance is currently in the Average range.',
      }
    : {
        border: 'border-amber-500/40',
        bgGlow: 'from-amber-950/40 via-slate-900 to-slate-950',
        text: 'text-amber-400',
        badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
        desc: 'Overall performance requires academic attention.',
      };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto w-full font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in shadow-2xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Academic Performance
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Performance Data Updated
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor subject-wise marks, overall academic performance, and performance trends.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400/90 mt-1">
            <span>Academic Performance Analysis</span>
            <span>·</span>
            <span className="text-slate-500">6 Subjects × 50 Marks = 300 per Internal (Combined 600)</span>
          </div>
        </div>

        {/* Top-Right Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Reg No Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">Reg No:</span>
            <select
              value={selectedRegNo}
              onChange={(e) => setSelectedRegNo(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              {ALL_STUDENT_REG_NOS.map((reg) => (
                <option key={reg} value={reg} className="bg-slate-900 text-white">
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Filter */}
          <select
            value={selectedExamFilter}
            onChange={(e) => setSelectedExamFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Exams (Combined 600)</option>
            <option value="internal1">Internal Exam 1 (300)</option>
            <option value="internal2">Internal Exam 2 (300)</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Compare Exams</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Assessment</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => onNavigateToStudentAnalysis(selectedRegNo)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1"
          >
            <span>View Student Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CLASS ACADEMIC OVERVIEW (ALL 360 STUDENTS - Requirement 13) */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Class Academic Overview ({cohortStats.totalCount} Students)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregated internal evaluation benchmarks calculated across all {cohortStats.totalCount} student records.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Class Avg:</span>
            <span className="text-base font-extrabold text-cyan-300 px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40">
              {cohortStats.avgOverallPercentage}%
            </span>
          </div>
        </div>

        {/* 3 Performance Categories Count Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Good (≥75%)</span>
              <span className="text-xl font-black text-white mt-0.5 block">{cohortStats.goodCount} Students</span>
              <span className="text-[11px] text-slate-400 font-sans">{((cohortStats.goodCount / cohortStats.totalCount) * 100).toFixed(1)}% of cohort</span>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">Average (50%–74.99%)</span>
              <span className="text-xl font-black text-white mt-0.5 block">{cohortStats.averageCount} Students</span>
              <span className="text-[11px] text-slate-400 font-sans">{((cohortStats.averageCount / cohortStats.totalCount) * 100).toFixed(1)}% of cohort</span>
            </div>
            <span className="w-3 h-3 rounded-full bg-cyan-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Needs Improvement (&lt;50%)</span>
              <span className="text-xl font-black text-white mt-0.5 block">{cohortStats.needsImprovementCount} Students</span>
              <span className="text-[11px] text-slate-400 font-sans">{((cohortStats.needsImprovementCount / cohortStats.totalCount) * 100).toFixed(1)}% of cohort</span>
            </div>
            <span className="w-3 h-3 rounded-full bg-amber-400" />
          </div>
        </div>

        {/* 6 Subject-Wise Averages across all 360 students */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold tracking-wider block mb-2">
            Subject-Wise Cohort Averages (All {cohortStats.totalCount} Students):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
            {cohortStats.subjectAverages.map((s) => (
              <div key={s.name} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                <span className="text-[10px] text-slate-400 truncate block font-sans font-semibold">{s.name}</span>
                <span className="text-base font-bold text-white mt-1 block">{s.avg}%</span>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.avg >= 75 ? 'bg-emerald-400' : s.avg >= 50 ? 'bg-cyan-400' : 'bg-amber-400'}`}
                    style={{ width: `${s.avg}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 & 5. MAIN PERFORMANCE SUMMARY SECTION */}
      <div
        className={`rounded-3xl bg-gradient-to-r ${categoryTheme.bgGlow} border ${categoryTheme.border} p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Reg No and Classification */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  REGISTRATION NUMBER
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  {currentRecord.regNo}
                </h2>
              </div>
            </div>

            {/* Performance Status Card */}
            <div className="flex items-center gap-3 pt-1">
              <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full border ${categoryTheme.badge}`}>
                {currentRecord.performanceClassification}
              </span>
              <span className="text-xs text-slate-300 font-medium font-sans">
                “{categoryTheme.desc}”
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Combined Total: <strong className="text-white">{currentRecord.combinedTotal}</strong> / 600 Marks
              {' · '}
              Formula: <span className="text-cyan-300">({currentRecord.combinedTotal} / 600) × 100</span>
            </p>
          </div>

          {/* Center: Prominent Big Overall Percentage Number */}
          <div className="text-center lg:text-right bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5 sm:px-8 shrink-0">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              OVERALL PERCENTAGE
            </span>
            <div className="mt-1 flex items-baseline justify-center lg:justify-end gap-1">
              <span className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${categoryTheme.text}`}>
                {overallPct}%
              </span>
            </div>
            <div className="mt-2 flex items-center justify-center lg:justify-end gap-2 text-xs font-mono">
              <span className="text-slate-400">Semester Trend:</span>
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  currentRecord.performanceTrend === 'improving'
                    ? 'text-emerald-400'
                    : currentRecord.performanceTrend === 'declining'
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }`}
              >
                {currentRecord.performanceTrend === 'improving' && <TrendingUp className="w-3.5 h-3.5" />}
                {currentRecord.performanceTrend === 'declining' && <TrendingDown className="w-3.5 h-3.5" />}
                {currentRecord.performanceTrend === 'stable' && <Minus className="w-3.5 h-3.5" />}
                <span className="capitalize">{currentRecord.performanceTrend}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Exam Breakdown Bar (Internal 1 vs Internal 2) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Internal Exam 1</span>
            <div className="text-lg font-bold text-white mt-0.5">
              {currentRecord.internal1Total} <span className="text-xs text-slate-400 font-normal">/ 300</span>
            </div>
            <span className="text-cyan-300 font-bold block">{currentRecord.internal1Percentage}%</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Internal Exam 2</span>
            <div className="text-lg font-bold text-white mt-0.5">
              {currentRecord.internal2Total} <span className="text-xs text-slate-400 font-normal">/ 300</span>
            </div>
            <span className="text-cyan-300 font-bold block">{currentRecord.internal2Percentage}%</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Net Mark Variance</span>
            <div
              className={`text-lg font-bold mt-0.5 ${
                currentRecord.internal2Total >= currentRecord.internal1Total ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {currentRecord.internal2Total - currentRecord.internal1Total >= 0 ? '+' : ''}
              {currentRecord.internal2Total - currentRecord.internal1Total} Marks
            </div>
            <span className="text-slate-400 block">
              {(currentRecord.internal2Percentage - currentRecord.internal1Percentage).toFixed(1)}% delta
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Evaluation Status</span>
            <div className="text-lg font-bold text-white mt-0.5">
              6 / 6 Subjects
            </div>
            <span className="text-emerald-400 font-bold block">100% Evaluated</span>
          </div>
        </div>
      </div>

      {/* 14. ENGAGEAI ACADEMIC INSIGHT PANEL */}
      <section className="rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-blue-950/25 border border-cyan-500/30 p-5 shadow-xl text-left space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              EngageAI Academic Insight
            </span>
            <h3 className="text-sm font-bold text-white">
              Evidence-Based Performance Synthesis
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pt-1">
          “{currentRecord.academicInsight}”
        </p>

        <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-cyan-500/20">
          Evaluated against 6 institutional course modules without predictive stereotyping.
        </p>
      </section>

      {/* 6. SUBJECT-WISE MARKS TABLE */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 overflow-hidden shadow-xl text-left">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Subject-wise Performance</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive breakdown across all 6 engineering subjects (each out of 50 marks per internal exam).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Good (≥75%)
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ml-2" /> Average (50-74%)
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-2" /> Needs Improvement (&lt;50%)
          </div>
        </div>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/90 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-3 text-center">Internal 1 / 50</th>
                <th className="py-3 px-3 text-center">Internal 2 / 50</th>
                <th className="py-3 px-3 text-center">Total / 100</th>
                <th className="py-3 px-3 text-center">Percentage</th>
                <th className="py-3 px-3 text-center">Performance</th>
                <th className="py-3 px-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentRecord.subjects.map((sub) => {
                const isSubGood = sub.performanceCategory === 'GOOD';
                const isSubAverage = sub.performanceCategory === 'AVERAGE';

                const categoryBadge = isSubGood
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : isSubAverage
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/40';

                return (
                  <tr
                    key={sub.subjectName}
                    onClick={() => setSelectedSubjectForDetail(sub)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-sans font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {sub.subjectName}
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Code: {sub.code} · {sub.creditHours} Credits
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-300 font-mono">
                      {sub.internal1} <span className="text-[10px] text-slate-500">/ 50</span>
                    </td>

                    <td className="py-3.5 px-3 text-center text-white font-bold font-mono">
                      {sub.internal2} <span className="text-[10px] text-slate-500">/ 50</span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-white font-mono">
                      {sub.total} <span className="text-[10px] text-slate-500">/ 100</span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold font-mono text-cyan-300 text-sm">
                      {sub.percentage}%
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${categoryBadge}`}>
                        {sub.performanceCategory}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-xs ${
                          sub.trend === 'improving'
                            ? 'text-emerald-400'
                            : sub.trend === 'declining'
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {sub.trend === 'improving' && '↗'}
                        {sub.trend === 'declining' && '↘'}
                        {sub.trend === 'stable' && '→'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. SUBJECT PERFORMANCE CARDS (6 Interactive Cards) */}
      <section className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Subject Performance Cards
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Click any card to inspect detailed concept diagnostics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRecord.subjects.map((sub) => {
            const isSubGood = sub.performanceCategory === 'GOOD';
            const isSubAvg = sub.performanceCategory === 'AVERAGE';

            return (
              <div
                key={sub.subjectName}
                onClick={() => setSelectedSubjectForDetail(sub)}
                className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 hover:border-cyan-500/50 p-5 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                        {sub.code}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {sub.subjectName}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isSubGood
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : isSubAvg
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                          : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {sub.performanceCategory}
                    </span>
                  </div>

                  {/* Main Percentage & Total */}
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black font-mono text-white">
                        {sub.percentage}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {sub.total} / 100 combined
                      </span>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="text-slate-300">
                        I1: <strong className="text-white">{sub.internal1}</strong> / 50
                      </div>
                      <div className="text-slate-300">
                        I2: <strong className="text-white">{sub.internal2}</strong> / 50
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        isSubGood ? 'bg-emerald-400' : isSubAvg ? 'bg-cyan-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Trend:</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      sub.trend === 'improving'
                        ? 'text-emerald-400'
                        : sub.trend === 'declining'
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {sub.trend === 'improving' && '↗ Improving'}
                    {sub.trend === 'declining' && '↘ Declining'}
                    {sub.trend === 'stable' && '→ Stable'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8, 15, & 10. VISUAL SECTION: DISTRIBUTION, COMPOSITE SCORE & COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 8. SUBJECT PERFORMANCE DISTRIBUTION */}
        <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Subject Distribution
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">6 Subjects</span>
          </div>

          {/* Donut / Segmented Visual Bar */}
          <div className="space-y-3">
            <div className="w-full bg-slate-950 rounded-xl p-1 border border-slate-800 flex h-4 overflow-hidden gap-1">
              <div
                className="bg-emerald-400 rounded-lg transition-all"
                style={{ width: `${(goodSubjectsCount / 6) * 100}%` }}
                title={`Good: ${goodSubjectsCount}`}
              />
              <div
                className="bg-cyan-400 rounded-lg transition-all"
                style={{ width: `${(averageSubjectsCount / 6) * 100}%` }}
                title={`Average: ${averageSubjectsCount}`}
              />
              <div
                className="bg-amber-400 rounded-lg transition-all"
                style={{ width: `${(needsImprovementSubjectsCount / 6) * 100}%` }}
                title={`Needs Improvement: ${needsImprovementSubjectsCount}`}
              />
            </div>

            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Good Subjects (≥75%):
                </span>
                <span className="font-bold text-emerald-400">{goodSubjectsCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Average Subjects (50–74%):
                </span>
                <span className="font-bold text-cyan-400">{averageSubjectsCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Needs Improvement (&lt;50%):
                </span>
                <span className="font-bold text-amber-400">{needsImprovementSubjectsCount}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 pt-1 font-medium font-sans">
              “{goodSubjectsCount} of 6 subjects are currently in the Good range.”
            </p>
          </div>
        </section>

        {/* 15. CIRCULAR ACADEMIC PERFORMANCE SCORE */}
        <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 shadow-xl text-center space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Academic Score
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Multimodal</span>
          </div>

          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            {/* SVG Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-cyan-400 transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * currentRecord.overallScore) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono text-white">
                {currentRecord.overallScore}
              </span>
              <span className="text-[10px] font-mono text-slate-400">/ 100 SCORE</span>
            </div>
          </div>

          <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${categoryTheme.badge}`}>
            {currentRecord.performanceClassification}
          </span>

          {/* Explainable Score Breakdown */}
          <div className="space-y-1.5 pt-1 text-left font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Internal Examinations (50%):</span>
              <span className="text-cyan-300 font-bold">{currentRecord.scoreBreakdown.internalExams}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Quiz/Test Performance (30%):</span>
              <span className="text-cyan-300 font-bold">{currentRecord.scoreBreakdown.quizTest}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Subject Consistency (20%):</span>
              <span className="text-cyan-300 font-bold">{currentRecord.scoreBreakdown.subjectConsistency}%</span>
            </div>
          </div>
        </section>

        {/* 10. MARKS COMPARISON (Side-by-side Internal 1 vs Internal 2) */}
        <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Internal Exam Comparison
            </h3>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
            >
              Full Detail →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Internal 1</span>
              <div className="text-xl font-bold text-white mt-1">
                {currentRecord.internal1Total} <span className="text-xs text-slate-400 font-normal">/ 300</span>
              </div>
              <span className="text-cyan-300 font-bold">{currentRecord.internal1Percentage}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Internal 2</span>
              <div className="text-xl font-bold text-white mt-1">
                {currentRecord.internal2Total} <span className="text-xs text-slate-400 font-normal">/ 300</span>
              </div>
              <span className="text-cyan-300 font-bold">{currentRecord.internal2Percentage}%</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Change:</span>
              <span className="text-emerald-400 font-bold">
                {currentRecord.internal2Total - currentRecord.internal1Total >= 0 ? '+' : ''}
                {currentRecord.internal2Total - currentRecord.internal1Total} Marks
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Percentage Shift:</span>
              <span className="text-cyan-300 font-bold">
                {(currentRecord.internal2Percentage - currentRecord.internal1Percentage).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="capitalize">{currentRecord.performanceTrend}</span>
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 9. ACADEMIC PERFORMANCE TREND (Interactive SVG Chart) */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Academic Performance Trend</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Trajectory between Internal Exam 1 and Internal Exam 2 evaluations.
            </p>
          </div>

          {/* Subject Filter Switcher */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Filter Trajectory:</span>
            <select
              value={trendSubjectFilter}
              onChange={(e) => setTrendSubjectFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">Overall Percentage</option>
              {SUBJECT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Trend Chart Display */}
        {(() => {
          let p1 = currentRecord.internal1Percentage;
          let p2 = currentRecord.internal2Percentage;
          let label = 'Overall Percentage';

          if (trendSubjectFilter !== 'all') {
            const match = currentRecord.subjects.find((s) => s.subjectName === trendSubjectFilter);
            if (match) {
              p1 = Number(((match.internal1 / 50) * 100).toFixed(1));
              p2 = Number(((match.internal2 / 50) * 100).toFixed(1));
              label = match.subjectName;
            }
          }

          const delta = Number((p2 - p1).toFixed(1));

          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-400">Trajectory for:</span>{' '}
                  <strong className="text-white font-sans">{label}</strong>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    Internal 1: <strong className="text-cyan-300">{p1}%</strong>
                  </span>
                  <span>→</span>
                  <span className="text-slate-400">
                    Internal 2: <strong className="text-cyan-300">{p2}%</strong>
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      delta > 0
                        ? 'bg-emerald-950 text-emerald-300'
                        : delta < 0
                        ? 'bg-rose-950 text-rose-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Trend: {delta >= 0 ? `+${delta}` : delta} percentage points
                  </span>
                </div>
              </div>

              {/* Visual Slope Bar Graph */}
              <div className="grid grid-cols-2 gap-4 h-32 pt-4 px-4 bg-slate-950/70 border border-slate-800/80 rounded-xl relative">
                {/* Horizontal reference lines */}
                <div className="absolute inset-x-4 top-4 border-b border-dashed border-slate-800 text-[10px] font-mono text-slate-600">
                  100%
                </div>
                <div className="absolute inset-x-4 top-1/2 border-b border-dashed border-slate-800 text-[10px] font-mono text-slate-600">
                  50%
                </div>

                {/* Exam 1 Bar */}
                <div className="flex flex-col items-center justify-end h-full pb-2">
                  <div
                    className="w-16 sm:w-24 rounded-t-xl bg-gradient-to-t from-cyan-600 to-blue-500 transition-all flex items-center justify-center font-mono font-bold text-white text-xs shadow-md"
                    style={{ height: `${Math.max(15, p1)}%` }}
                  >
                    {p1}%
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-2">
                    Internal Exam 1
                  </span>
                </div>

                {/* Exam 2 Bar */}
                <div className="flex flex-col items-center justify-end h-full pb-2">
                  <div
                    className="w-16 sm:w-24 rounded-t-xl bg-gradient-to-t from-cyan-400 to-emerald-400 transition-all flex items-center justify-center font-mono font-bold text-slate-950 text-xs shadow-md"
                    style={{ height: `${Math.max(15, p2)}%` }}
                  >
                    {p2}%
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-2">
                    Internal Exam 2
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 11 & 12. STRONGEST SUBJECTS & SUBJECTS NEEDING ATTENTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 11. STRONGEST SUBJECTS */}
        <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 shadow-xl text-left space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Strongest Subjects</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Top 3 Modules</span>
          </div>

          <div className="space-y-2.5">
            {strongestSubjects.map((sub, idx) => (
              <div
                key={sub.subjectName}
                onClick={() => setSelectedSubjectForDetail(sub)}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {sub.subjectName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sub.total} / 100 marks combined
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-base font-bold text-emerald-400">{sub.percentage}%</span>
                  <span className="text-[10px] text-slate-400 block capitalize">{sub.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 12. SUBJECTS NEEDING ATTENTION */}
        <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 shadow-xl text-left space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Subjects Needing Attention</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Targeted Focus</span>
          </div>

          {subjectsNeedingAttention.length > 0 ? (
            <div className="space-y-2.5">
              {subjectsNeedingAttention.map((sub) => {
                const sDelta = sub.internal2 - sub.internal1;

                return (
                  <div
                    key={sub.subjectName}
                    onClick={() => setSelectedSubjectForDetail(sub)}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer group space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {sub.subjectName}
                      </h4>
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-amber-400">{sub.percentage}%</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">
                          ({sDelta >= 0 ? `+${sDelta}` : sDelta} mark change)
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans">
                      “May benefit from additional practice.”
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-1 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="font-semibold text-white">All subjects currently ≥ 75%</p>
              <p className="text-slate-400 font-mono text-[10px]">No immediate intervention flags identified.</p>
            </div>
          )}
        </section>
      </div>

      {/* 13. QUIZ & TEST PERFORMANCE SECTION */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>Quiz & Test Performance</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous formative evaluations, mid-term tests, and unit problem solving records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Quiz/Test Average:</span>
              <span className="text-base font-bold text-cyan-300">
                {currentRecord.quizTestAverage}%
              </span>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Assessment</span>
            </button>
          </div>
        </div>

        {/* Quizzes List / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono text-xs">
          {currentRecord.quizzesAndTests.map((q) => (
            <div
              key={q.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold block">{q.type}</span>
                  <h4 className="text-xs font-bold text-white font-sans mt-0.5">{q.name}</h4>
                </div>
                <span className="text-[10px] text-slate-400">{q.date}</span>
              </div>

              <div className="flex items-baseline justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">
                  {q.marksObtained} / {q.maxMarks} marks
                </span>
                <span className="text-sm font-bold text-cyan-300">{q.percentage}%</span>
              </div>

              <div className="text-[10px] text-slate-400 font-sans truncate">
                {q.subject}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ETHICAL DATA STANDARDS FOOTER */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-400 space-y-2 text-left">
        <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Academic Evaluation Integrity & Ethical Governance</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
          <div>✓ Registration numbers only</div>
          <div>✓ Objective score computation</div>
          <div>✓ Multi-assessment consistency</div>
          <div>✓ Non-judgmental academic coaching</div>
        </div>
      </div>

      {/* MODALS */}
      <AddAssessmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        regNo={selectedRegNo}
        onAddAssessment={handleAddAssessment}
      />

      <CompareExamsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        record={currentRecord}
      />

      <SubjectDetailModal
        isOpen={Boolean(selectedSubjectForDetail)}
        onClose={() => setSelectedSubjectForDetail(null)}
        subject={selectedSubjectForDetail}
        regNo={selectedRegNo}
      />

      <ExportPerformanceModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        record={currentRecord}
      />
    </div>
  );
}
