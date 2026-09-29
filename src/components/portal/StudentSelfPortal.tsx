import React, { useState } from 'react';
import { 
  GraduationCap, 
  CalendarCheck2, 
  FileText, 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Info
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';
import { buildStudentAcademicRecord, StudentAcademicRecord } from '../../data/demoAcademicData';
import { INITIAL_SUPPORT_PLANS, SupportPlanItem } from '../../data/demoInterventions';

interface StudentSelfPortalProps {
  studentRegNo: string;
  onLogout: () => void;
  studentRecords: StudentRecord[];
}

export default function StudentSelfPortal({
  studentRegNo,
  onLogout,
  studentRecords,
}: StudentSelfPortalProps) {
  // Find current student from centralized dataset
  const currentStudent = studentRecords.find((s) => s.regNo === studentRegNo) || studentRecords[0];
  const academicRecord: StudentAcademicRecord = buildStudentAcademicRecord(currentStudent.regNo);
  const activeSupportPlans: SupportPlanItem[] = INITIAL_SUPPORT_PLANS.filter(
    (p) => p.regNo === currentStudent.regNo
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'attendance' | 'support'>('overview');

  const attDelta = currentStudent.attendance - currentStudent.previousAttendance;
  const assignDelta = currentStudent.assignmentCompletion - currentStudent.previousAssignmentCompletion;

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#070e1e]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">EngageAI</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Student Self-Service Portal
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 block">
              REG NO: <strong className="text-white">{currentStudent.regNo}</strong>
            </span>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authenticated Student View</span>
          </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 text-left">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800 font-mono text-xs">
          {[
            { id: 'overview', label: 'My Engagement Pulse', icon: Sparkles },
            { id: 'academic', label: 'Internal Examination Marks', icon: BookOpen },
            { id: 'attendance', label: 'Attendance & Assignments', icon: CalendarCheck2 },
            { id: 'support', label: 'Academic Support & Office Hours', icon: HeartHandshake },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-md shadow-cyan-950/40'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Identity Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-blue-950/20 border border-cyan-500/30 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  REGISTRATION NUMBER: {currentStudent.regNo}
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
                  Academic Progress & Semester Standing
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-sans max-w-xl">
                  Track your continuous internal assessment scores, course attendance, and learning milestone completions.
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-950/70 p-4 rounded-xl border border-slate-800 shrink-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Overall Percentage</span>
                <span className="text-3xl font-black font-mono text-cyan-400 block mt-0.5">
                  {academicRecord.overallPercentage}%
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {academicRecord.performanceClassification}
                </span>
              </div>
            </div>

            {/* Quick Summary Grid: 5 Core Engagement Indicators (Requirement 15) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-mono text-xs">
              {/* 1. Attendance */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Attendance</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{currentStudent.attendance}%</span>
                  <span className={`text-[11px] ${attDelta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {attDelta >= 0 ? `+${attDelta}%` : `${attDelta}%`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Previous: {currentStudent.previousAttendance}%</span>
              </div>

              {/* 2. Assignments */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Assignments</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{currentStudent.assignmentCompletion}%</span>
                  <span className={`text-[11px] ${assignDelta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {assignDelta >= 0 ? `+${assignDelta}%` : `${assignDelta}%`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Previous: {currentStudent.previousAssignmentCompletion}%</span>
              </div>

              {/* 3. Assessment Average */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Formative Tests</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{currentStudent.assessmentAverage}%</span>
                  <span className={`text-[11px] ${currentStudent.assessmentAverage >= currentStudent.previousAssessmentAverage ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentStudent.assessmentAverage >= currentStudent.previousAssessmentAverage ? `+${currentStudent.assessmentAverage - currentStudent.previousAssessmentAverage}%` : `${currentStudent.assessmentAverage - currentStudent.previousAssessmentAverage}%`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Previous: {currentStudent.previousAssessmentAverage}%</span>
              </div>

              {/* 4. Learning Activity */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">LMS Learning Activity</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{currentStudent.learningActivity}%</span>
                  <span className={`text-[11px] ${currentStudent.learningActivity >= currentStudent.previousLearningActivity ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentStudent.learningActivity >= currentStudent.previousLearningActivity ? `+${currentStudent.learningActivity - currentStudent.previousLearningActivity}%` : `${currentStudent.learningActivity - currentStudent.previousLearningActivity}%`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Previous: {currentStudent.previousLearningActivity}%</span>
              </div>

              {/* 5. Participation */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Seminar Participation</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{currentStudent.participation}%</span>
                  <span className={`text-[11px] ${currentStudent.participation >= currentStudent.previousParticipation ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentStudent.participation >= currentStudent.previousParticipation ? `+${currentStudent.participation - currentStudent.previousParticipation}%` : `${currentStudent.participation - currentStudent.previousParticipation}%`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Previous: {currentStudent.previousParticipation}%</span>
              </div>
            </div>

            {/* 6-Week Engagement Trend (Requirement 15) */}
            <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    6-Week Personal Engagement Trend
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">
                  Continuous Semester Observation
                </span>
              </div>

              {/* Trend Chart */}
              <div className="pt-2">
                {(() => {
                  const trendList = currentStudent.weeklyTrend || currentStudent.weeklyHistory || [
                    { week: 'Week 1', overall: 85, attendance: 88, assignments: 86, assessments: 84, activity: 82, participation: 85 },
                    { week: 'Week 2', overall: 84, attendance: 87, assignments: 85, assessments: 84, activity: 81, participation: 84 },
                    { week: 'Week 3', overall: 83, attendance: 86, assignments: 84, assessments: 83, activity: 80, participation: 83 },
                    { week: 'Week 4', overall: 81, attendance: 84, assignments: 82, assessments: 82, activity: 79, participation: 81 },
                    { week: 'Week 5', overall: 80, attendance: 83, assignments: 80, assessments: 81, activity: 78, participation: 80 },
                    { week: 'Week 6', overall: currentStudent.overallEngagementScore || currentStudent.overallEngagement, attendance: currentStudent.attendance, assignments: currentStudent.assignmentCompletion, assessments: currentStudent.assessmentAverage, activity: currentStudent.learningActivity, participation: currentStudent.participation },
                  ];

                  const svgW = 600;
                  const svgH = 140;
                  const padX = 40;
                  const padY = 20;
                  const gW = svgW - padX * 2;
                  const gH = svgH - padY * 2;
                  const minY = 30;
                  const maxY = 100;

                  const points = trendList.map((pt, i) => {
                    const x = padX + (i / (trendList.length - 1)) * gW;
                    const val = pt.overall;
                    const y = svgH - padY - ((val - minY) / (maxY - minY)) * gH;
                    return { x, y, val, week: pt.week };
                  });

                  const pathD = points.reduce((acc, curr, i) => {
                    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
                  }, '');

                  return (
                    <div className="space-y-2">
                      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-36 overflow-visible">
                        {/* Grid lines */}
                        <line x1={padX} y1={padY} x2={svgW - padX} y2={padY} stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1={padX} y1={svgH / 2} x2={svgW - padX} y2={svgH / 2} stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1={padX} y1={svgH - padY} x2={svgW - padX} y2={svgH - padY} stroke="#1e293b" />

                        {/* Smooth area fill */}
                        <path
                          d={`${pathD} L ${points[points.length - 1].x} ${svgH - padY} L ${points[0].x} ${svgH - padY} Z`}
                          fill="url(#studentGradient)"
                          opacity="0.25"
                        />

                        {/* Stroke path */}
                        <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Data dots */}
                        {points.map((p, idx) => (
                          <g key={idx}>
                            <circle cx={p.x} cy={p.y} r={4} fill="#091122" stroke="#38bdf8" strokeWidth={2} />
                            <text
                              x={p.x}
                              y={p.y - 8}
                              textAnchor="middle"
                              fill="#94a3b8"
                              fontSize="9"
                              fontFamily="monospace"
                            >
                              {p.val}%
                            </text>
                            <text
                              x={p.x}
                              y={svgH - 4}
                              textAnchor="middle"
                              fill="#64748b"
                              fontSize="9"
                              fontFamily="monospace"
                            >
                              {p.week}
                            </text>
                          </g>
                        ))}

                        <defs>
                          <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Supportive Non-Judgmental Guidance & Areas to Focus On (Requirement 15) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              {/* Areas to Focus On */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Areas to Focus On</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {currentStudent.attendance < 75
                    ? '• Prioritize attending scheduled laboratory and lecture hours to maintain departmental eligibility.'
                    : '• Your attendance is above department guidelines. Keep up the consistent pace!'}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {currentStudent.assignmentCompletion < 75
                    ? '• Make use of tutorial lab support hours to submit any pending programming exercises.'
                    : '• Your assignment completion rate is solid. Continue submitting work on time.'}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {currentStudent.assessmentAverage < 75
                    ? '• Schedule time for unit concept revision before upcoming continuous assessments.'
                    : '• Formative assessment understanding is steady.'}
                </p>
              </div>

              {/* Support Resources Available */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono">
                  <HeartHandshake className="w-4 h-4 text-emerald-400" />
                  <span>Support Resources Available</span>
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Faculty Office Hours: Available Tuesdays & Thursdays for 1:1 doubts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Peer Tutoring Network: Lab buddy assistance for algorithmic problem sets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>LMS Recorded Modules: Self-paced concept catch-up videos available 24/7</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Internal Examination Marks */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white tracking-tight">
                Subject-Wise Continuous Internal Assessments (out of 50 marks each)
              </h3>
              <span className="text-xs font-mono text-cyan-300">
                Combined Total: {academicRecord.combinedTotal} / 600 ({academicRecord.overallPercentage}%)
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 font-mono text-xs">
              <table className="w-full text-left">
                <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/90 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-3 text-center">Internal 1 / 50</th>
                    <th className="py-3 px-3 text-center">Internal 2 / 50</th>
                    <th className="py-3 px-3 text-center">Combined / 100</th>
                    <th className="py-3 px-3 text-center">Percentage</th>
                    <th className="py-3 px-4 text-right">Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {academicRecord.subjects.map((sub) => (
                    <tr key={sub.subjectName} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-semibold text-white">
                        {sub.subjectName}
                        <span className="text-[10px] text-slate-400 font-mono block">Code: {sub.code}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-300">{sub.internal1} / 50</td>
                      <td className="py-3.5 px-3 text-center text-white font-bold">{sub.internal2} / 50</td>
                      <td className="py-3.5 px-3 text-center text-cyan-300 font-bold">{sub.total} / 100</td>
                      <td className="py-3.5 px-3 text-center font-bold text-white">{sub.percentage}%</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                          {sub.performanceCategory}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Attendance & Assignments */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Continuous Attendance & Milestone Logs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block">Lecture Attendance Record</span>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span>Current 4-Week Rate:</span>
                  <span className="font-bold text-cyan-400">{currentStudent.attendance}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Prior 4-Week Rate:</span>
                  <span className="text-slate-400">{currentStudent.previousAttendance}%</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans pt-2 border-t border-slate-800">
                  Minimum institutional threshold: 75%. Please notify course coordinator for verified medical leaves.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block">Homework & Lab Submission Rate</span>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span>Current Completion Rate:</span>
                  <span className="font-bold text-cyan-400">{currentStudent.assignmentCompletion}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Prior Completion Rate:</span>
                  <span className="text-slate-400">{currentStudent.previousAssignmentCompletion}%</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans pt-2 border-t border-slate-800">
                  All programming lab exercises and problem sets contribute towards internal evaluation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Academic Support & Office Hours */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Academic Support & Faculty Mentorship Advising
            </h3>

            {activeSupportPlans.length > 0 ? (
              <div className="space-y-3">
                {activeSupportPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono">
                      <span className="text-cyan-400 font-bold text-sm">{plan.planType}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px]">
                        Status: {plan.status}
                      </span>
                    </div>

                    <p className="text-slate-300 font-sans text-xs">
                      <strong>Focus Area:</strong> {plan.suggestedSupport}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                      <strong>Scheduled Review Date:</strong> {plan.followUpDate}
                    </div>

                    <div className="pt-2 text-[11px] text-slate-400 font-sans">
                      {plan.facultyNotes}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Active Support Interventions Required</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Your academic engagement metrics are aligned with current course guidelines.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#040810]/70 py-4 px-6 text-center text-xs text-slate-400">
        <p className="font-mono text-[11px]">
          Confidential Student Portal · Reg No: {currentStudent.regNo} · Restricted Access
        </p>
      </footer>
    </div>
  );
}
