import React from 'react';
import { 
  X, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  FileSpreadsheet, 
  Cpu, 
  CheckCircle2, 
  BarChart3 
} from 'lucide-react';
import { StudentAcademicRecord } from '../../data/demoAcademicData';

interface CompareExamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: StudentAcademicRecord;
}

export default function CompareExamsModal({
  isOpen,
  onClose,
  record,
}: CompareExamsModalProps) {
  if (!isOpen) return null;

  const marksDelta = record.internal2Total - record.internal1Total;
  const pctDelta = Number((record.internal2Percentage - record.internal1Percentage).toFixed(1));
  const isImproved = marksDelta > 0;
  const isDeclined = marksDelta < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-[#091122] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Internal Exam Comparison
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Internal 1 vs Internal 2 Comparison: Reg No {record.regNo}
            </h3>
          </div>
        </div>

        {/* Top Overall Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 text-xs font-mono">
          {/* Internal Exam 1 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">
              INTERNAL EXAM 1
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{record.internal1Total}</span>
              <span className="text-slate-400">/ 300</span>
            </div>
            <div className="text-cyan-300 font-bold text-sm mt-0.5">
              {record.internal1Percentage}%
            </div>
          </div>

          {/* Internal Exam 2 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">
              INTERNAL EXAM 2
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{record.internal2Total}</span>
              <span className="text-slate-400">/ 300</span>
            </div>
            <div className="text-cyan-300 font-bold text-sm mt-0.5">
              {record.internal2Percentage}%
            </div>
          </div>

          {/* Variance / Delta */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 uppercase block font-semibold">
              OBSERVED CHANGE
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black ${
                  isImproved ? 'text-emerald-400' : isDeclined ? 'text-rose-400' : 'text-slate-300'
                }`}
              >
                {marksDelta >= 0 ? `+${marksDelta}` : marksDelta} marks
              </span>
            </div>
            <div
              className={`text-sm font-bold flex items-center gap-1 mt-0.5 ${
                isImproved ? 'text-emerald-400' : isDeclined ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {isImproved ? (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>+{pctDelta}% ↗ Improving</span>
                </>
              ) : isDeclined ? (
                <>
                  <TrendingDown className="w-4 h-4" />
                  <span>{pctDelta}% ↘ Declining</span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4" />
                  <span>0.0% → Stable</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Subject-Wise Side-by-Side Comparison */}
        <div className="mt-5 space-y-2 text-xs">
          <span className="text-[11px] font-mono text-slate-300 font-semibold uppercase tracking-wider block">
            Subject-wise Marks Delta (out of 50 marks each)
          </span>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left font-mono">
              <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/90 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3 text-center">Internal 1 (/50)</th>
                  <th className="py-2.5 px-3 text-center">Internal 2 (/50)</th>
                  <th className="py-2.5 px-3 text-center">Marks Delta</th>
                  <th className="py-2.5 px-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {record.subjects.map((sub) => {
                  const sDelta = sub.internal2 - sub.internal1;
                  const sDeltaPct = Number(((sDelta / 50) * 100).toFixed(1));

                  return (
                    <tr key={sub.subjectName} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-sans font-medium text-white">
                        {sub.subjectName}
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Code: {sub.code}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center text-slate-300">
                        {sub.internal1} <span className="text-[10px] text-slate-400">/ 50</span>
                        <div className="text-[10px] text-cyan-300">{((sub.internal1 / 50) * 100).toFixed(0)}%</div>
                      </td>

                      <td className="py-3 px-3 text-center text-white font-bold">
                        {sub.internal2} <span className="text-[10px] text-slate-400">/ 50</span>
                        <div className="text-[10px] text-cyan-300">{((sub.internal2 / 50) * 100).toFixed(0)}%</div>
                      </td>

                      <td className="py-3 px-3 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            sDelta > 0
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : sDelta < 0
                              ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {sDelta >= 0 ? `+${sDelta}` : sDelta} ({sDelta >= 0 ? `+${sDeltaPct}` : sDeltaPct}%)
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-sans">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold text-xs ${
                            sub.trend === 'improving'
                              ? 'text-emerald-400'
                              : sub.trend === 'declining'
                              ? 'text-rose-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {sub.trend === 'improving' ? '↗ Improving' : sub.trend === 'declining' ? '↘ Declining' : '→ Stable'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
