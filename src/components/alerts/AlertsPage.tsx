import React, { useState, useMemo } from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Search, 
  Sliders, 
  CheckCheck, 
  Sparkles, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  CalendarCheck2, 
  FileText, 
  Award, 
  Users, 
  ShieldCheck, 
  Cpu, 
  Filter,
  Layers,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { 
  FacultyAlert, 
  INITIAL_ALERTS, 
  INITIAL_TIMELINE_EVENTS, 
  PREVIOUS_ALERTS_LOG, 
  AlertTimelineEvent, 
  PreviousAlertLog 
} from '../../data/demoAlerts';
import { StudentRecord } from '../../data/demoStudents';
import { generateDynamicAlerts } from '../../services/engageAiEngine';
import AlertDetailsDrawer from './AlertDetailsDrawer';
import AlertSettingsModal from './AlertSettingsModal';

interface AlertsPageProps {
  onOpenStudentAnalysis: (regNo: string) => void;
  onFilterAlertsCount?: (newCount: number) => void;
  students?: StudentRecord[];
}

export type AlertFilterChip = 
  | 'all'
  | 'new'
  | 'high'
  | 'moderate'
  | 'reviewed'
  | 'attendance'
  | 'assignments'
  | 'assessments'
  | 'activity'
  | 'participation';

export default function AlertsPage({ onOpenStudentAnalysis, onFilterAlertsCount, students }: AlertsPageProps) {
  // Alerts Dataset State: dynamically derived from live student indicators or default demo
  const initialAlertsList = useMemo(() => {
    if (students && students.length > 0) {
      return generateDynamicAlerts(students);
    }
    return INITIAL_ALERTS;
  }, [students]);

  const [alerts, setAlerts] = useState<FacultyAlert[]>(initialAlertsList);
  const [timelineEvents, setTimelineEvents] = useState<AlertTimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [previousAlerts, setPreviousAlerts] = useState<PreviousAlertLog[]>(PREVIOUS_ALERTS_LOG);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AlertFilterChip>('all');

  // Drawer & Modal State
  const [selectedAlertForDrawer, setSelectedAlertForDrawer] = useState<FacultyAlert | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Computed Summary Counts
  const newCount = alerts.filter((a) => a.status === 'NEW').length;
  const highPriorityCount = alerts.filter((a) => a.severity === 'High Priority' && a.status === 'NEW').length;
  const moderateCount = alerts.filter((a) => a.severity === 'Moderate').length;
  const reviewedCount = alerts.filter((a) => a.status === 'REVIEWED').length;

  // Filter & Search Logic
  const filteredAlerts = useMemo(() => {
    let result = alerts;

    // Search by Reg No
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (a) => a.regNo.toLowerCase().includes(q) || a.evidenceExplanation.toLowerCase().includes(q)
      );
    }

    // Filter Chips
    switch (activeFilter) {
      case 'new':
        result = result.filter((a) => a.status === 'NEW');
        break;
      case 'high':
        result = result.filter((a) => a.severity === 'High Priority');
        break;
      case 'moderate':
        result = result.filter((a) => a.severity === 'Moderate');
        break;
      case 'reviewed':
        result = result.filter((a) => a.status === 'REVIEWED');
        break;
      case 'attendance':
        result = result.filter((a) => a.affectedIndicators.some((ind) => ind.name === 'Attendance'));
        break;
      case 'assignments':
        result = result.filter((a) => a.affectedIndicators.some((ind) => ind.name === 'Assignments'));
        break;
      case 'assessments':
        result = result.filter((a) => a.affectedIndicators.some((ind) => ind.name === 'Assessments'));
        break;
      case 'activity':
        result = result.filter((a) => a.affectedIndicators.some((ind) => ind.name === 'Learning Activity'));
        break;
      case 'participation':
        result = result.filter((a) => a.affectedIndicators.some((ind) => ind.name === 'Participation'));
        break;
      case 'all':
      default:
        break;
    }

    return result;
  }, [alerts, searchQuery, activeFilter]);

  // Handle Mark Single Alert as Reviewed
  const handleMarkAsReviewed = (alertId: string, note?: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedRegNo = '';

    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          updatedRegNo = a.regNo;
          return {
            ...a,
            status: 'REVIEWED',
            reviewDate: 'Today',
            reviewTime: nowTime,
            reviewedBy: 'Faculty Reviewed',
            notes: note || a.notes,
          };
        }
        return a;
      })
    );

    // Add entry to Previous Alerts Log
    setPreviousAlerts((prev) => [
      {
        id: `pal-new-${Date.now()}`,
        regNo: updatedRegNo || 'Reg No',
        alertType: selectedAlertForDrawer?.category || 'EARLY ALERT',
        date: `Today, ${nowTime}`,
        status: 'Reviewed',
        reviewedBy: 'Faculty Reviewed',
        indicatorSummary: 'Faculty review completed',
      },
      ...prev,
    ]);

    // Close drawer if open with this alert
    if (selectedAlertForDrawer?.id === alertId) {
      setSelectedAlertForDrawer((prev) =>
        prev
          ? {
              ...prev,
              status: 'REVIEWED',
              reviewDate: 'Today',
              reviewTime: nowTime,
              reviewedBy: 'Faculty Reviewed',
              notes: note || prev.notes,
            }
          : null
      );
    }

    showToast(`Alert marked as reviewed for Reg No ${updatedRegNo || 'record'}.`);
  };

  // Handle Mark All as Reviewed
  const handleMarkAllAsReviewed = () => {
    const unreviewed = alerts.filter((a) => a.status === 'NEW');
    if (unreviewed.length === 0) {
      showToast('All active alerts have already been reviewed.');
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        status: 'REVIEWED',
        reviewDate: 'Today',
        reviewTime: nowTime,
        reviewedBy: 'Faculty Reviewed',
      }))
    );

    // Append to previous alerts log
    const newLogs: PreviousAlertLog[] = unreviewed.map((a, i) => ({
      id: `pal-batch-${Date.now()}-${i}`,
      regNo: a.regNo,
      alertType: a.category,
      date: `Today, ${nowTime}`,
      status: 'Reviewed',
      reviewedBy: 'Faculty Reviewed',
      indicatorSummary: 'Batch faculty review confirmed',
    }));

    setPreviousAlerts((prev) => [...newLogs, ...prev]);
    showToast(`All ${unreviewed.length} new alerts successfully marked as reviewed.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto w-full font-sans">
      {/* Toast Notification */}
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

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Alerts
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI Monitoring Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review emerging engagement changes and prioritize faculty attention.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mt-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Last analysis completed: Today, 10:45 AM</span>
          </div>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleMarkAllAsReviewed}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CheckCheck className="w-4 h-4 text-cyan-400" />
            <span>Mark All as Reviewed</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4" />
            <span>Alert Settings</span>
          </button>
        </div>
      </div>

      {/* 2. ALERT SUMMARY (4 Premium Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New Alerts */}
        <div 
          onClick={() => setActiveFilter('new')}
          className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer text-left ${
            activeFilter === 'new'
              ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-950/50'
              : 'bg-[#091122]/90 border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400">
              NEW ALERTS
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {newCount}
            </span>
            <span className="text-[11px] font-mono text-cyan-300">
              Require review
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Require immediate faculty attention
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Trend indicator</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +2 from yesterday
            </span>
          </div>
        </div>

        {/* Card 2: High Priority */}
        <div 
          onClick={() => setActiveFilter('high')}
          className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer text-left ${
            activeFilter === 'high'
              ? 'bg-rose-950/30 border-rose-500 shadow-lg shadow-rose-950/40'
              : 'bg-[#091122]/90 border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-400">
              HIGH PRIORITY
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {highPriorityCount}
            </span>
            <span className="text-[11px] font-mono text-rose-300">
              Significant drift
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Multiple significant declines
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Current queue</span>
            <span className="text-rose-400 font-semibold">
              3 active cases
            </span>
          </div>
        </div>

        {/* Card 3: Moderate */}
        <div 
          onClick={() => setActiveFilter('moderate')}
          className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer text-left ${
            activeFilter === 'moderate'
              ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-950/40'
              : 'bg-[#091122]/90 border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
              MODERATE
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {moderateCount}
            </span>
            <span className="text-[11px] font-mono text-amber-300">
              Evolving
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Early negative changes detected
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Pattern status</span>
            <span className="text-amber-400 font-semibold">
              Stable pattern
            </span>
          </div>
        </div>

        {/* Card 4: Reviewed */}
        <div 
          onClick={() => setActiveFilter('reviewed')}
          className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer text-left ${
            activeFilter === 'reviewed'
              ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-950/40'
              : 'bg-[#091122]/90 border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
              REVIEWED
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {reviewedCount}
            </span>
            <span className="text-[11px] font-mono text-emerald-300">
              Interventions logged
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Faculty interventions logged
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Resolution audit</span>
            <span className="text-emerald-400 font-semibold">
              Audit trail intact
            </span>
          </div>
        </div>
      </div>

      {/* 9. SMART ALERT INSIGHT */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/30 border border-cyan-500/30 p-4 sm:p-5 shadow-xl text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                EngageAI Alert Insight
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-900/50 text-cyan-200">
                Cohort Synthesis
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
              “Most active alerts are currently related to declining assignment completion and attendance.”
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Identified 4 students with parallel assignment latency exceeding the 48-hour course milestone deadline.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveFilter('assignments');
            const alertQueue = document.getElementById('faculty-attention-queue');
            if (alertQueue) alertQueue.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-sm"
        >
          <span>View Supporting Data</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. PRIORITY FILTER BAR & SEARCH */}
      <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-4 sm:p-5 shadow-xl text-left space-y-3.5">
        {/* Top Filter Controls: Search & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search by Reg No */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Reg No (e.g. 922525106003)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredAlerts.length}</strong> of{' '}
              <strong className="text-slate-300">{alerts.length}</strong> alerts
            </span>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Interactive Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-mono">
          {[
            { id: 'all', label: 'All Alerts', count: alerts.length },
            { id: 'new', label: 'New', count: newCount },
            { id: 'high', label: 'High Priority', count: highPriorityCount },
            { id: 'moderate', label: 'Moderate', count: moderateCount },
            { id: 'reviewed', label: 'Reviewed', count: reviewedCount },
            { id: 'attendance', label: 'Attendance', count: alerts.filter(a => a.affectedIndicators.some(i => i.name === 'Attendance')).length },
            { id: 'assignments', label: 'Assignments', count: alerts.filter(a => a.affectedIndicators.some(i => i.name === 'Assignments')).length },
            { id: 'assessments', label: 'Assessments', count: alerts.filter(a => a.affectedIndicators.some(i => i.name === 'Assessments')).length },
            { id: 'activity', label: 'Learning Activity', count: alerts.filter(a => a.affectedIndicators.some(i => i.name === 'Learning Activity')).length },
            { id: 'participation', label: 'Participation', count: alerts.filter(a => a.affectedIndicators.some(i => i.name === 'Participation')).length },
          ].map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilter(chip.id as AlertFilterChip)}
                className={`px-3 py-1.5 rounded-xl border text-xs transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-md shadow-cyan-950/40'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{chip.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-cyan-800/60 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 & 5. PRIORITY ALERT CENTER ("Faculty Attention Queue") */}
      <section id="faculty-attention-queue" className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Faculty Attention Queue
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                ({filteredAlerts.length} Active Records)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Prioritized by evidence-grounded non-sensitive indicator shifts. Click any card for detailed diagnostic drawer.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Early Alert
            <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" /> Changing Pattern
            <span className="w-2 h-2 rounded-full bg-cyan-400 ml-2" /> Single Indicator
          </div>
        </div>

        {/* Alert Cards Grid */}
        {filteredAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlerts.map((alert) => {
              const isHigh = alert.severity === 'High Priority';
              const isEarlyAlert = alert.category === 'EARLY ALERT';
              const isChanging = alert.category === 'CHANGING PATTERN';

              const cardBorderClass = alert.status === 'NEW'
                ? isHigh
                  ? 'border-rose-500/40 hover:border-rose-400/80 bg-gradient-to-b from-[#0f172a] to-[#091122]'
                  : 'border-amber-500/40 hover:border-amber-400/80 bg-gradient-to-b from-[#0e1628] to-[#091122]'
                : 'border-slate-800/80 hover:border-slate-700 bg-[#070d1d]/80 opacity-80 hover:opacity-100';

              const categoryBadge = isEarlyAlert
                ? 'bg-rose-950/70 text-rose-300 border-rose-500/30'
                : isChanging
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30';

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlertForDrawer(alert)}
                  className={`rounded-2xl border p-5 shadow-xl transition-all hover:shadow-2xl cursor-pointer flex flex-col justify-between group ${cardBorderClass}`}
                >
                  <div>
                    {/* Card Top: Reg No & Category Badge */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                            REG NO
                          </span>
                          {alert.status === 'NEW' && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" title="New Alert" />
                          )}
                        </div>
                        <h3 className="text-xl font-black font-mono text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                          {alert.regNo}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${categoryBadge}`}
                        >
                          {alert.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          Risk: <strong className="text-white">{alert.riskScore}</strong>/100
                        </span>
                      </div>
                    </div>

                    {/* Category Explanation Subtext */}
                    <p className="text-[11px] text-slate-300 mt-2.5 font-medium leading-normal">
                      {alert.affectedIndicators.length} indicator{alert.affectedIndicators.length > 1 ? 's' : ''} showing decline
                    </p>

                    {/* Indicator Changes List */}
                    <div className="mt-3 space-y-2 font-mono text-xs">
                      {alert.affectedIndicators.map((ind) => (
                        <div
                          key={ind.name}
                          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                        >
                          <span className="font-sans font-medium text-slate-300 text-xs">
                            {ind.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">{ind.previous}%</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-white font-bold">{ind.current}%</span>
                            <span className="text-rose-400 font-bold ml-1">
                              ↓{Math.abs(ind.delta)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detection Time */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-3.5 pt-2 border-t border-slate-800/70">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Detected: {alert.detectedTime}</span>
                      </span>

                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        alert.status === 'NEW' ? 'text-cyan-300 bg-cyan-950/70' : 'text-emerald-300 bg-emerald-950/70'
                      }`}>
                        {alert.status === 'NEW' ? 'Awaiting Review' : 'Reviewed'}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenStudentAnalysis(alert.regNo)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>View Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {alert.status === 'NEW' ? (
                      <button
                        onClick={() => setSelectedAlertForDrawer(alert)}
                        className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-500/20"
                      >
                        Review
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedAlertForDrawer(alert)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reviewed</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 rounded-2xl bg-[#091122]/60 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Alerts Match Selected Filter</h4>
            <p className="text-xs text-slate-400 font-mono">
              All academic engagement indicators within current baseline.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-mono text-cyan-400 hover:underline"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* 6. ALERT TIMELINE ("Alert Activity") */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Alert Activity</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live chronology of detection signals, threshold crossings, and faculty resolution actions.
            </p>
          </div>

          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30">
            Real-time Feed
          </span>
        </div>

        {/* Timeline Event Items */}
        <div className="space-y-3 font-mono text-xs">
          {timelineEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onOpenStudentAnalysis(evt.regNo)}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold shrink-0">{evt.time}</span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-white font-bold group-hover:text-cyan-300 transition-colors shrink-0">
                  {evt.regNo}
                </span>
                <span className="text-slate-300 font-sans text-xs">{evt.message}</span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] shrink-0">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {evt.indicator}
                </span>
                <span className="text-cyan-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. ALERT HISTORY ("Previous Alerts") */}
      <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 overflow-hidden text-left shadow-xl">
        <button
          type="button"
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-900/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Previous Alerts ({previousAlerts.length} Historical Logs)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{isHistoryOpen ? 'Collapse' : 'Expand History'}</span>
            {isHistoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isHistoryOpen && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 space-y-2 font-mono text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-800 pb-2">
                  <tr>
                    <th className="py-2.5 px-3">Reg No</th>
                    <th className="py-2.5 px-3">Alert Type</th>
                    <th className="py-2.5 px-3">Indicator Summary</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Reviewer</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {previousAlerts.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white">{log.regNo}</td>
                      <td className="py-2.5 px-3 text-cyan-300">{log.alertType}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{log.indicatorSummary}</td>
                      <td className="py-2.5 px-3 text-slate-400">{log.date}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {log.reviewedBy}
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        <button
                          onClick={() => onOpenStudentAnalysis(log.regNo)}
                          className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
                        >
                          View Analysis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Ethical Trust Baseline */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-400 space-y-2 text-left">
        <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Evidence-Based Academic Alert Governance</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
          <div>✓ Registration number identification</div>
          <div>✓ Non-sensitive engagement telemetry</div>
          <div>✓ Human faculty review required</div>
          <div>✓ No punitive automated actions</div>
        </div>
      </div>

      {/* 7. ALERT DETAILS DRAWER */}
      <AlertDetailsDrawer
        isOpen={Boolean(selectedAlertForDrawer)}
        onClose={() => setSelectedAlertForDrawer(null)}
        alert={selectedAlertForDrawer}
        onMarkAsReviewed={handleMarkAsReviewed}
        onOpenStudentAnalysis={(regNo) => {
          setSelectedAlertForDrawer(null);
          onOpenStudentAnalysis(regNo);
        }}
      />

      {/* ALERT SETTINGS MODAL */}
      <AlertSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => showToast('Faculty alert detection thresholds saved.')}
      />
    </div>
  );
}
