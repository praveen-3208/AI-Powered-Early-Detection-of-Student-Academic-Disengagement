import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  PlusCircle, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Users, 
  CalendarCheck2, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Filter, 
  CheckSquare, 
  ChevronRight, 
  Search,
  MessageSquare
} from 'lucide-react';
import { 
  SupportPlanItem, 
  UpcomingFollowUp, 
  OutcomeMonitoringItem, 
  SupportHistoryItem, 
  SupportPlanType, 
  SupportPlanStatus,
  ProgressStatus,
  SUPPORT_TYPE_DEFINITIONS,
  INITIAL_SUPPORT_PLANS,
  INITIAL_FOLLOW_UPS,
  INITIAL_OUTCOME_MONITORING,
  INITIAL_SUPPORT_HISTORY
} from '../../data/demoInterventions';
import { StudentRecord } from '../../data/demoStudents';
import CreateSupportPlanModal from './CreateSupportPlanModal';
import SupportPlanDetailsDrawer from './SupportPlanDetailsDrawer';

interface InterventionsPageProps {
  students: StudentRecord[];
  onOpenStudentAnalysis: (regNo: string) => void;
}

export default function InterventionsPage({ students, onOpenStudentAnalysis }: InterventionsPageProps) {
  // Support Plans State
  const [plans, setPlans] = useState<SupportPlanItem[]>(INITIAL_SUPPORT_PLANS);
  const [followUps, setFollowUps] = useState<UpcomingFollowUp[]>(INITIAL_FOLLOW_UPS);
  const [outcomes, setOutcomes] = useState<OutcomeMonitoringItem[]>(INITIAL_OUTCOME_MONITORING);
  const [history, setHistory] = useState<SupportHistoryItem[]>(INITIAL_SUPPORT_HISTORY);

  // Filters & UI States
  const [searchRegNo, setSearchRegNo] = useState('');
  const [selectedPlanTypeFilter, setSelectedPlanTypeFilter] = useState<SupportPlanType | 'All'>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<SupportPlanStatus | 'All'>('All');

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlanForDrawer, setSelectedPlanForDrawer] = useState<SupportPlanItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Recommendation Selected Student
  const [recommendationRegNo, setRecommendationRegNo] = useState('922525106003');

  // Computed Summary Counts
  const activePlansCount = plans.filter((p) => p.status === 'Active' || p.status === 'Support Required').length;
  const pendingReviewCount = plans.filter((p) => p.status === 'Draft' || p.status === 'Support Required').length;
  const followUpsDueCount = followUps.filter((f) => f.status !== 'Completed').length;
  const completedCount = history.length + plans.filter((p) => p.status === 'Completed').length;

  // Filtered Plans Queue
  const filteredPlans = useMemo(() => {
    let result = plans;

    if (searchRegNo.trim()) {
      const q = searchRegNo.trim().toLowerCase();
      result = result.filter((p) => p.regNo.toLowerCase().includes(q) || p.mainObservedIndicator.toLowerCase().includes(q));
    }

    if (selectedPlanTypeFilter !== 'All') {
      result = result.filter((p) => p.planType === selectedPlanTypeFilter);
    }

    if (selectedStatusFilter !== 'All') {
      result = result.filter((p) => p.status === selectedStatusFilter);
    }

    return result;
  }, [plans, searchRegNo, selectedPlanTypeFilter, selectedStatusFilter]);

  // Handle Create Plan
  const handleCreatePlan = (newPlanData: Omit<SupportPlanItem, 'id' | 'createdDate'>) => {
    const newId = `sp-${Date.now()}`;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const fullPlan: SupportPlanItem = {
      ...newPlanData,
      id: newId,
      createdDate: nowStr,
    };

    setPlans((prev) => [fullPlan, ...prev]);

    // Also add to follow-up tracker
    setFollowUps((prev) => [
      {
        id: `fu-${Date.now()}`,
        regNo: fullPlan.regNo,
        supportType: fullPlan.planType,
        followUpDate: fullPlan.followUpDate,
        status: 'Scheduled',
        note: `Initial follow-up check for ${fullPlan.planType}`,
      },
      ...prev,
    ]);

    showToast(`Support plan created successfully for Reg No ${fullPlan.regNo}.`);
  };

  // Handle Update Plan Status in Drawer
  const handleUpdatePlanStatus = (planId: string, newStatus: SupportPlanStatus) => {
    let updatedRegNo = '';
    let updatedType: SupportPlanType = 'Mentor Check-in';

    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          updatedRegNo = p.regNo;
          updatedType = p.planType;
          return { ...p, status: newStatus };
        }
        return p;
      })
    );

    if (selectedPlanForDrawer?.id === planId) {
      setSelectedPlanForDrawer((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (newStatus === 'Completed') {
      const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      setHistory((prev) => [
        {
          id: `sh-${Date.now()}`,
          regNo: updatedRegNo || 'Record',
          supportType: updatedType,
          date: nowStr,
          status: 'Completed',
          followUpResult: 'Faculty verified milestone progress; engagement normalized.',
        },
        ...prev,
      ]);
      showToast(`Support plan for Reg No ${updatedRegNo} marked as Completed.`);
    } else {
      showToast(`Status updated to ${newStatus} for Reg No ${updatedRegNo}.`);
    }
  };

  // Handle Save Outcome Notes & Progress Status from Drawer
  const handleSaveOutcomeNotes = (
    planId: string,
    progressStatus: ProgressStatus,
    outcomeNotes: string,
    reviewOutcomeDate: string
  ) => {
    let targetRegNo = '';
    let targetType: SupportPlanType = 'Mentor Check-in';

    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          targetRegNo = p.regNo;
          targetType = p.planType;
          return {
            ...p,
            progressStatus,
            outcomeNotes,
            facultyNotes: outcomeNotes,
            reviewOutcomeDate,
          };
        }
        return p;
      })
    );

    if (selectedPlanForDrawer?.id === planId) {
      setSelectedPlanForDrawer((prev) =>
        prev
          ? {
              ...prev,
              progressStatus,
              outcomeNotes,
              facultyNotes: outcomeNotes,
              reviewOutcomeDate,
            }
          : null
      );
    }

    // Synchronize into outcomes list
    setOutcomes((prev) => {
      const existing = prev.find((o) => o.regNo === targetRegNo);
      if (existing) {
        return prev.map((o) =>
          o.regNo === targetRegNo
            ? {
                ...o,
                progressStatus,
                reviewOutcomeDate,
                facultyInterventionNotes: outcomeNotes,
                observedTrajectory: `Outcome verified: ${progressStatus}. Faculty note: ${outcomeNotes}`,
              }
            : o
        );
      } else {
        return [
          {
            id: `om-${Date.now()}`,
            regNo: targetRegNo || 'Record',
            supportType: targetType,
            supportWindow: 'Current Term',
            attendanceBefore: 70,
            attendanceAfter: progressStatus === 'Improved' ? 82 : progressStatus === 'Declined' ? 62 : 71,
            assignmentsBefore: 65,
            assignmentsAfter: progressStatus === 'Improved' ? 80 : progressStatus === 'Declined' ? 58 : 66,
            overallBefore: 66,
            overallAfter: progressStatus === 'Improved' ? 80 : progressStatus === 'Declined' ? 60 : 67,
            observedTrajectory: `Outcome verified: ${progressStatus}. Faculty note: ${outcomeNotes}`,
            progressStatus,
            reviewOutcomeDate,
            facultyInterventionNotes: outcomeNotes,
          },
          ...prev,
        ];
      }
    });

    showToast(`Saved progress status (${progressStatus}) for Reg No ${targetRegNo}.`);
  };

  // Handle Complete Follow-up
  const handleCompleteFollowUp = (fuId: string) => {
    let targetRegNo = '';
    setFollowUps((prev) =>
      prev.map((f) => {
        if (f.id === fuId) {
          targetRegNo = f.regNo;
          return { ...f, status: 'Completed' };
        }
        return f;
      })
    );
    showToast(`Follow-up checkpoint marked as Complete for Reg No ${targetRegNo || 'record'}.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Selected student for recommendation context
  const currentRecStudent = students.find((s) => s.regNo === recommendationRegNo) || students[2];

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto w-full font-sans">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in shadow-2xl shadow-emerald-950/50">
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

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Interventions & Support Plans
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" />
              Faculty Directed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Turn early engagement insights into thoughtful faculty support.
          </p>
        </div>

        {/* Top-Right: [Create Support Plan] */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Support Plan</span>
        </button>
      </div>

      {/* 1. HEADER SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Support Plans */}
        <div 
          onClick={() => setSelectedStatusFilter('Active')}
          className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-4 sm:p-5 shadow-xl text-left hover:border-cyan-500/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400">
              ACTIVE SUPPORT PLANS
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {activePlansCount}
            </span>
            <span className="text-[11px] font-mono text-cyan-300">
              In progress
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Active faculty mentorship & extensions
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Cohort support active
          </div>
        </div>

        {/* Pending Faculty Review */}
        <div 
          onClick={() => setSelectedStatusFilter('Support Required')}
          className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-4 sm:p-5 shadow-xl text-left hover:border-amber-500/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
              PENDING FACULTY REVIEW
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {pendingReviewCount}
            </span>
            <span className="text-[11px] font-mono text-amber-300">
              Awaiting action
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Alerts requiring plan finalization
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Instructor consultation queued
          </div>
        </div>

        {/* Follow-ups Due */}
        <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-4 sm:p-5 shadow-xl text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-sky-400">
              FOLLOW-UPS DUE
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {followUpsDueCount}
            </span>
            <span className="text-[11px] font-mono text-sky-300">
              Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Checkpoints due within 7 days
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Outcome review checkpoints
          </div>
        </div>

        {/* Completed */}
        <div 
          onClick={() => setSelectedStatusFilter('Completed')}
          className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-4 sm:p-5 shadow-xl text-left hover:border-emerald-500/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
              COMPLETED
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {completedCount}
            </span>
            <span className="text-[11px] font-mono text-emerald-300">
              Resolved
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Documented support cycles
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Historical outcomes recorded
          </div>
        </div>
      </div>

      {/* 5. AI SUPPORT SUGGESTION ("EngageAI Recommendation" Panel) */}
      <section className="rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-blue-950/25 border border-cyan-500/30 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                EngageAI Recommendation
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Contextual Faculty Guidance Engine
              </h3>
            </div>
          </div>

          {/* Quick Reg No Switcher */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Review Reg No:</span>
            <select
              value={recommendationRegNo}
              onChange={(e) => setRecommendationRegNo(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.regNo} value={s.regNo}>
                  {s.regNo} ({s.engagementStatus})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Context Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              REG NO
            </span>
            <span className="text-base font-bold font-mono text-white block">
              {currentRecStudent.regNo}
            </span>
            <span className="text-[11px] text-cyan-300 font-mono">
              Status: {currentRecStudent.engagementStatus}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              OBSERVED PATTERN
            </span>
            <p className="text-slate-200 font-medium">
              Attendance and assignment completion have declined ({currentRecStudent.attendance}% att, {currentRecStudent.assignmentCompletion}% assign).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              POSSIBLE SUPPORT ACTIONS
            </span>
            <ul className="space-y-0.5 text-slate-200 text-xs">
              <li>• Mentor check-in (1:1 discussion)</li>
              <li>• Assignment guidance (clarify recursion)</li>
              <li>• Follow-up monitoring (2-week review)</li>
            </ul>
          </div>
        </div>

        {/* Important notice disclaimer */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-slate-300 italic text-[11px] leading-relaxed">
            “These are general support suggestions based on observed engagement patterns. Faculty should consider the student's context before taking action.”
          </p>

          <button
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 hover:text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Apply to New Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. SUPPORT PLAN TYPES (Selectable Support Cards) */}
      <section className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Support Plan Types
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click card to filter support queue
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SUPPORT_TYPE_DEFINITIONS.map((typeDef) => {
            const isSelected = selectedPlanTypeFilter === typeDef.id;

            return (
              <div
                key={typeDef.id}
                onClick={() => setSelectedPlanTypeFilter(isSelected ? 'All' : typeDef.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950/50'
                    : 'bg-[#091122]/90 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-100'}`}>
                    {typeDef.title}
                  </h3>
                  <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
                </div>

                <p className="text-xs text-cyan-300/90 mt-1 font-medium">
                  {typeDef.shortDesc}
                </p>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  Best for: {typeDef.recommendedFor}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Typical scope: {typeDef.typicalDuration}</span>
                  <span className="text-cyan-400 font-semibold">
                    {plans.filter(p => p.planType === typeDef.id).length} Active Plans
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. SUPPORT WORK QUEUE ("Faculty Support Queue") */}
      <section className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Faculty Support Queue
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                ({filteredPlans.length} Managed Records)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Organized early intervention pathways. Click [Open Plan] to view or progress status.
            </p>
          </div>

          {/* Search by Reg No */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchRegNo}
              onChange={(e) => setSearchRegNo(e.target.value)}
              placeholder="Filter by Reg No..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Plan Cards Grid */}
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => {
              const isHigh = plan.priority === 'High';
              const isRequired = plan.status === 'Support Required';
              const isFollowUpDue = plan.status === 'Follow-up Due';
              const isCompleted = plan.status === 'Completed';

              const statusBadge = isRequired
                ? 'bg-rose-950/70 text-rose-300 border-rose-500/40'
                : isFollowUpDue
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                : isCompleted
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40';

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanForDrawer(plan)}
                  className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 hover:border-cyan-500/50 p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between group text-left"
                >
                  <div>
                    {/* Header: Reg No & Status */}
                    <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          REG NO
                        </span>
                        <h3 className="text-xl font-black font-mono text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                          {plan.regNo}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                          {plan.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          {plan.priority} Priority
                        </span>
                      </div>
                    </div>

                    {/* Main observed indicator */}
                    <div className="mt-3 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Observed:
                      </span>
                      <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                        {plan.mainObservedIndicator}
                      </p>
                    </div>

                    {/* Suggested support */}
                    <div className="mt-2.5 space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                        Suggested:
                      </span>
                      <p className="text-xs text-white font-medium">
                        {plan.suggestedSupport}
                      </p>
                    </div>

                    {/* Next review date */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Next Review:</span>
                      <span className="text-cyan-300 font-bold">{plan.followUpDate}</span>
                    </div>
                  </div>

                  {/* Open Plan action */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenStudentAnalysis(plan.regNo)}
                      className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Analysis</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => setSelectedPlanForDrawer(plan)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1"
                    >
                      <span>Open Plan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 rounded-2xl bg-[#091122]/60 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-7 h-7 text-cyan-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Support Plans Match Filter</h4>
            <p className="text-xs text-slate-400 font-mono">
              Try resetting your Reg No search query or plan category filter.
            </p>
            <button
              onClick={() => {
                setSearchRegNo('');
                setSelectedPlanTypeFilter('All');
                setSelectedStatusFilter('All');
              }}
              className="mt-2 text-xs font-mono text-cyan-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 7. FOLLOW-UP TRACKER ("Upcoming Follow-ups") */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Upcoming Follow-ups</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled milestone and check-in review dates for faculty attention.
            </p>
          </div>

          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            {followUps.filter(f => f.status !== 'Completed').length} Pending Checkpoints
          </span>
        </div>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Reg No</th>
                <th className="py-2.5 px-3">Support Type</th>
                <th className="py-2.5 px-3">Follow-up Date</th>
                <th className="py-2.5 px-3">Checkpoint Goal</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {followUps.map((fu) => (
                <tr key={fu.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{fu.regNo}</td>
                  <td className="py-3 px-3 text-cyan-300">{fu.supportType}</td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">{fu.followUpDate}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans text-xs">{fu.note}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        fu.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {fu.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    {fu.status !== 'Completed' ? (
                      <button
                        onClick={() => handleCompleteFollowUp(fu.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-colors whitespace-nowrap"
                      >
                        Mark Follow-up Complete
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-xs flex items-center justify-end gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. OUTCOME MONITORING ("After Support") */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>After Support — Observed Outcome Trajectories</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare engagement telemetry before and after the defined support period.
            </p>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Observed Trajectory Metrics
          </span>
        </div>

        {/* Before & After Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {outcomes.map((item) => {
            const isImproved = item.progressStatus === 'Improved';
            const isInProgress = item.progressStatus === 'In Progress';
            const isNoChange = item.progressStatus === 'No Change';
            const isDeclined = item.progressStatus === 'Declined';

            const statusBadgeClass = isImproved
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
              : isInProgress
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
              : isNoChange
              ? 'bg-amber-950 text-amber-300 border-amber-500/40'
              : 'bg-rose-950 text-rose-300 border-rose-500/40';

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">{item.regNo}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusBadgeClass}`}>
                      {item.progressStatus}
                    </span>
                  </div>

                  <div className="text-[10px] text-cyan-300 pt-1 pb-2">
                    {item.supportType} · <span className="text-slate-400">{item.supportWindow}</span>
                  </div>

                  {/* Metric comparisons */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Attendance:</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-slate-400">{item.attendanceBefore}%</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-emerald-400">{item.attendanceAfter}%</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          ({item.attendanceAfter >= item.attendanceBefore ? `+${item.attendanceAfter - item.attendanceBefore}` : item.attendanceAfter - item.attendanceBefore}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Assignments:</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-slate-400">{item.assignmentsBefore}%</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-emerald-400">{item.assignmentsAfter}%</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          ({item.assignmentsAfter >= item.assignmentsBefore ? `+${item.assignmentsAfter - item.assignmentsBefore}` : item.assignmentsAfter - item.assignmentsBefore}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-slate-300 font-semibold">Overall:</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-slate-400">{item.overallBefore}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-cyan-300 text-sm">{item.overallAfter}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800 text-[11px] font-sans text-slate-300">
                    “{item.observedTrajectory}”
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Reviewed:</span>
                    <span className="text-slate-200 font-semibold">{item.reviewOutcomeDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear non-causal disclaimer */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Observed change after support:</strong> Metric deltas reflect chronological engagement indicators recorded following faculty support. The system does not claim that the intervention alone caused the improvement; multiple academic and individual factors influence student progression.
          </span>
        </div>
      </section>

      {/* 9. SUPPORT HISTORY */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Support History ({history.length} Completed Cycles)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Audit Archive
          </span>
        </div>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Reg No</th>
                <th className="py-2.5 px-3">Support Type</th>
                <th className="py-2.5 px-3">Completed Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Follow-up Result</th>
                <th className="py-2.5 px-3 text-right">Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{h.regNo}</td>
                  <td className="py-2.5 px-3 text-cyan-300">{h.supportType}</td>
                  <td className="py-2.5 px-3 text-slate-400">{h.date}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                      {h.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans text-xs">{h.followUpResult}</td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    <button
                      onClick={() => onOpenStudentAnalysis(h.regNo)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ethical Trust Disclaimer */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-400 space-y-2 text-left">
        <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Faculty Autonomy & Compassionate Support Standards</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
          <div>✓ Registration numbers only</div>
          <div>✓ Constructive support pathways</div>
          <div>✓ Instructor holds final decision</div>
          <div>✓ Confidential ethical audit trail</div>
        </div>
      </div>

      {/* Create Support Plan Modal */}
      <CreateSupportPlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        students={students}
        onCreatePlan={handleCreatePlan}
        defaultRegNo={recommendationRegNo}
      />

      {/* Support Plan Details Drawer */}
      <SupportPlanDetailsDrawer
        isOpen={Boolean(selectedPlanForDrawer)}
        onClose={() => setSelectedPlanForDrawer(null)}
        plan={selectedPlanForDrawer}
        onUpdateStatus={handleUpdatePlanStatus}
        onSaveOutcomeNotes={handleSaveOutcomeNotes}
        onOpenStudentAnalysis={onOpenStudentAnalysis}
      />
    </div>
  );
}
