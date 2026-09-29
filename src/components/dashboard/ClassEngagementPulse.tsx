import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CalendarCheck2, 
  FileText, 
  Award, 
  Activity, 
  Users, 
  Info,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { StudentRecord, INITIAL_STUDENTS_DATA, computeCohortPulse, WeekPulsePoint } from '../../data/demoStudents';

type MetricKey = 'attendance' | 'assignments' | 'assessments' | 'activity' | 'participation';

interface MetricConfig {
  key: MetricKey;
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const METRICS: MetricConfig[] = [
  { key: 'attendance', label: 'Attendance', color: '#38bdf8', icon: CalendarCheck2 },
  { key: 'assignments', label: 'Assignment Completion', color: '#06b6d4', icon: FileText },
  { key: 'assessments', label: 'Assessment Performance', color: '#818cf8', icon: Award },
  { key: 'activity', label: 'Learning Activity', color: '#2dd4bf', icon: Activity },
  { key: 'participation', label: 'Participation', color: '#a78bfa', icon: Users },
];

interface ClassEngagementPulseProps {
  students?: StudentRecord[];
}

export default function ClassEngagementPulse({ students = INITIAL_STUDENTS_DATA }: ClassEngagementPulseProps) {
  const [activeMetrics, setActiveMetrics] = useState<Record<MetricKey, boolean>>({
    attendance: true,
    assignments: true,
    assessments: true,
    activity: true,
    participation: true,
  });

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) => {
      // Don't allow turning all off
      const count = Object.values(prev).filter(Boolean).length;
      if (count === 1 && prev[key]) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  };

  // Requirement 13: Dynamically compute Class Averages from all 360 students
  const totalCount = students.length || 1;
  const avgAttendance = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / totalCount);
  const avgAssignments = Math.round(students.reduce((acc, s) => acc + s.assignmentCompletion, 0) / totalCount);
  const avgAssessments = Math.round(students.reduce((acc, s) => acc + s.assessmentAverage, 0) / totalCount);
  const avgActivity = Math.round(students.reduce((acc, s) => acc + s.learningActivity, 0) / totalCount);
  const avgParticipation = Math.round(students.reduce((acc, s) => acc + s.participation, 0) / totalCount);
  const avgEngagement = Math.round(
    students.reduce((acc, s) => acc + (s.overallEngagementScore || s.overallEngagement), 0) / totalCount
  );

  // Pattern Counts (Requirement 13)
  const stableCount = students.filter((s) => s.riskLevel === 'Low Risk').length;
  const changingCount = students.filter((s) => s.riskLevel === 'Moderate Risk').length;
  const earlyAlertCount = students.filter((s) => s.riskLevel === 'High Risk').length;

  // 6-Week Cohort Pulse dynamically aggregated across all students
  const pulsePoints: WeekPulsePoint[] = useMemo(() => {
    return computeCohortPulse(students);
  }, [students]);

  // SVG Chart dimensions
  const svgWidth = 540;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 25;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // Min/Max Y scale: 60% to 100%
  const minY = 60;
  const maxY = 100;

  const getYCoord = (val: number) => {
    const ratio = (val - minY) / (maxY - minY);
    return svgHeight - paddingY - ratio * graphHeight;
  };

  const getXCoord = (index: number) => {
    return paddingX + (index / (pulsePoints.length - 1)) * graphWidth;
  };

  return (
    <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Class Engagement Pulse & Analytics
              </h2>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                6-Week Cohort Trend · {students.length} Students
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregated non-sensitive telemetry trajectory calculated across all {students.length} students
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>All {students.length} Records Grounded</span>
          </div>
        </div>

        {/* Dynamic Class Analytics Summary Strip (Requirement 13) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 my-4 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-sans">Avg Engagement</span>
            <span className="text-lg font-bold text-white">{avgEngagement}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-sky-400 block uppercase font-sans">Avg Attendance</span>
            <span className="text-lg font-bold text-sky-300">{avgAttendance}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-cyan-400 block uppercase font-sans">Avg Assignments</span>
            <span className="text-lg font-bold text-cyan-300">{avgAssignments}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-indigo-400 block uppercase font-sans">Avg Assessments</span>
            <span className="text-lg font-bold text-indigo-300">{avgAssessments}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-teal-400 block uppercase font-sans">Avg LMS Activity</span>
            <span className="text-lg font-bold text-teal-300">{avgActivity}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-purple-400 block uppercase font-sans">Avg Participation</span>
            <span className="text-lg font-bold text-purple-300">{avgParticipation}%</span>
          </div>
        </div>

        {/* Pattern Summary Pills (Requirement 13: stable, changing, early alerts) */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Stable Students: <strong>{stableCount}</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Changing Patterns: <strong>{changingCount}</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Early Alerts: <strong>{earlyAlertCount}</strong>
          </span>
        </div>

        {/* Metric Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 my-3">
          {METRICS.map((m) => {
            const isEnabled = activeMetrics[m.key];
            const Icon = m.icon;

            return (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleMetric(m.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isEnabled
                    ? 'bg-slate-900 border text-white shadow-sm'
                    : 'bg-slate-950/60 border border-slate-800/80 text-slate-500 hover:text-slate-300'
                }`}
                style={{
                  borderColor: isEnabled ? `${m.color}60` : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isEnabled ? m.color : '#64748b' }}
                />
                <Icon className="w-3.5 h-3.5" style={{ color: isEnabled ? m.color : '#64748b' }} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Grid: Interactive Chart + Explainable AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center my-2">
        {/* The SVG Line Graph */}
        <div className="lg:col-span-2 relative w-full overflow-hidden bg-slate-950/50 rounded-xl p-2 border border-slate-800/80">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 sm:h-56"
          >
            {/* Horizontal Grid lines */}
            {[60, 70, 80, 90, 100].map((level) => {
              const y = getYCoord(level);
              return (
                <g key={level}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="rgba(51, 65, 85, 0.4)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Vertical Week Marker lines */}
            {pulsePoints.map((pt, i) => {
              const x = getXCoord(i);
              return (
                <g key={pt.week}>
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={svgHeight - paddingY}
                    stroke="rgba(51, 65, 85, 0.25)"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={svgHeight - paddingY + 16}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="500"
                  >
                    {pt.week}
                  </text>
                </g>
              );
            })}

            {/* Drawn Lines for each active metric */}
            {METRICS.map((m) => {
              if (!activeMetrics[m.key]) return null;

              const points = pulsePoints.map((pt, i) => {
                const x = getXCoord(i);
                const y = getYCoord(pt[m.key]);
                return `${x},${y}`;
              }).join(' ');

              return (
                <g key={m.key}>
                  {/* Subtle Glow shadow */}
                  <polyline
                    fill="none"
                    stroke={m.color}
                    strokeWidth="4"
                    strokeOpacity="0.18"
                    points={points}
                  />
                  {/* Solid Line */}
                  <polyline
                    fill="none"
                    stroke={m.color}
                    strokeWidth="2.2"
                    points={points}
                  />

                  {/* Data Dots */}
                  {pulsePoints.map((pt, i) => {
                    const x = getXCoord(i);
                    const y = getYCoord(pt[m.key]);
                    return (
                      <g key={`${m.key}-${i}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#0b1426"
                          stroke={m.color}
                          strokeWidth="2"
                        />
                        {/* Final point label */}
                        {i === pulsePoints.length - 1 && (
                          <text
                            x={x + 8}
                            y={y + 3}
                            fill={m.color}
                            fontSize="10"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {pt[m.key]}%
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Explainable AI Insight beside the graph */}
        <div className="p-4 sm:p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/25 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Cohort Pulse Diagnosis</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            “Class average engagement is {avgEngagement}%. The majority of students ({stableCount} of {students.length}) maintain stable learning momentum.”
          </p>

          <div className="space-y-1.5 pt-1 border-t border-cyan-500/20 text-[11px] text-slate-400">
            <div className="flex items-center justify-between font-mono">
              <span>Attention Queue:</span>
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                {earlyAlertCount} Early Alerts
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              A small group of {earlyAlertCount} students shows concentrated drops across multiple metrics. Faculty consultation and support plans are queued.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
