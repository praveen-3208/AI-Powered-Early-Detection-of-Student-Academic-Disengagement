import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  HeartHandshake,
  FileText,
  CalendarCheck2
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';

interface StudentsListViewProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  activeFilter?: string | null;
  onClearFilter?: () => void;
}

export default function StudentsListView({
  students,
  onSelectStudent,
  activeFilter,
  onClearFilter,
}: StudentsListViewProps) {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'moderate' | 'low' | 'review'>('all');

  const filtered = students.filter((s) => {
    // Search filter
    const matchesSearch = s.regNo.toLowerCase().includes(search.toLowerCase()) ||
      s.mainChange.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    // Direct risk tab filter inside this view
    if (riskFilter === 'high') return s.riskLevel === 'High Risk';
    if (riskFilter === 'moderate') return s.riskLevel === 'Moderate Risk';
    if (riskFilter === 'low') return s.riskLevel === 'Low Risk';
    if (riskFilter === 'review') return s.needsReview;

    return true;
  });

  return (
    <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 overflow-hidden shadow-xl text-left">
      {/* Top Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Class Student Roster & Telemetry Index
            </h2>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {filtered.length} of {students.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Anonymized 5-indicator academic engagement data with transparent risk indices
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Risk Filter */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setRiskFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                riskFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRiskFilter('high')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                riskFilter === 'high'
                  ? 'bg-rose-950/80 text-rose-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              High (6)
            </button>
            <button
              onClick={() => setRiskFilter('moderate')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                riskFilter === 'moderate'
                  ? 'bg-amber-950/80 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Moderate (12)
            </button>
            <button
              onClick={() => setRiskFilter('low')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                riskFilter === 'low'
                  ? 'bg-emerald-950/80 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Low (42)
            </button>
            <button
              onClick={() => setRiskFilter('review')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                riskFilter === 'review'
                  ? 'bg-cyan-950/80 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Review (8)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Student ID (e.g. ST1024)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 sm:w-60 pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          {activeFilter && (
            <button
              onClick={onClearFilter}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Student ID</th>
              <th className="py-3 px-4 font-semibold">Risk Level</th>
              <th className="py-3 px-4 font-semibold">Attendance</th>
              <th className="py-3 px-4 font-semibold">Assignments</th>
              <th className="py-3 px-4 font-semibold">Assessments</th>
              <th className="py-3 px-4 font-semibold">LMS Activity</th>
              <th className="py-3 px-4 font-semibold">Participation</th>
              <th className="py-3 px-4 font-semibold">Key Observed Change</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.slice(0, 25).map((stu) => {
              const isHigh = stu.riskLevel === 'High Risk';
              const isModerate = stu.riskLevel === 'Moderate Risk';

              return (
                <tr
                  key={stu.studentId}
                  onClick={() => onSelectStudent(stu)}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                >
                  {/* ID */}
                  <td className="py-3 px-4 font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {stu.studentId}
                  </td>

                  {/* Risk */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        isHigh
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                          : isModerate
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isHigh ? 'bg-rose-400' : isModerate ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      {stu.riskScore}/100
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4 text-slate-200">
                    <span className={stu.attendance < 75 ? 'text-rose-400 font-bold' : ''}>
                      {stu.attendance}%
                    </span>
                  </td>

                  {/* Assignments */}
                  <td className="py-3 px-4 text-slate-200">
                    <span className={stu.assignmentCompletion < 75 ? 'text-rose-400 font-bold' : ''}>
                      {stu.assignmentCompletion}%
                    </span>
                  </td>

                  {/* Assessments */}
                  <td className="py-3 px-4 text-slate-200">
                    <span className={stu.assessmentAverage < 75 ? 'text-rose-400 font-bold' : ''}>
                      {stu.assessmentAverage}%
                    </span>
                  </td>

                  {/* LMS Activity */}
                  <td className="py-3 px-4 text-slate-200">
                    <span className={stu.learningActivity < 70 ? 'text-amber-400 font-bold' : ''}>
                      {stu.learningActivity}%
                    </span>
                  </td>

                  {/* Participation */}
                  <td className="py-3 px-4 text-slate-200">
                    {stu.participation}%
                  </td>

                  {/* Main Change */}
                  <td className="py-3 px-4 font-sans text-slate-300 text-[11px] max-w-xs truncate">
                    {stu.mainChange}
                  </td>

                  {/* Review Action Button */}
                  <td className="py-3 px-4 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectStudent(stu)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 text-xs font-medium transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > 25 && (
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-center text-[11px] text-slate-400 font-mono">
          Showing top 25 of {filtered.length} students. Use search to filter specific records.
        </div>
      )}
    </div>
  );
}
