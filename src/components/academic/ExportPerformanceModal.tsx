import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Printer 
} from 'lucide-react';
import { StudentAcademicRecord } from '../../data/demoAcademicData';

interface ExportPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: StudentAcademicRecord;
}

export default function ExportPerformanceModal({
  isOpen,
  onClose,
  record,
}: ExportPerformanceModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportText = `=====================================================
ENGAGEAI ACADEMIC PERFORMANCE DOSSIER (CONFIDENTIAL)
=====================================================
REGISTRATION NUMBER: ${record.regNo}
REPORT DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
ANONYMIZED FACULTY RECORD: STRICT FERPA / ETHICAL GOVERNANCE COMPLIANT

1. EXAMINATION TOTALS & PERCENTAGE
-----------------------------------------------------
Internal Exam 1 Total:     ${record.internal1Total} / 300 (${record.internal1Percentage}%)
Internal Exam 2 Total:     ${record.internal2Total} / 300 (${record.internal2Percentage}%)
Combined Semester Total:   ${record.combinedTotal} / 600
Overall Percentage:        ${record.overallPercentage}%
Performance Category:      ${record.performanceClassification}
Semester Trajectory Trend: ${record.performanceTrend.toUpperCase()}

2. SUBJECT-WISE BREAKDOWN (OUT OF 50 MARKS EACH)
-----------------------------------------------------
${record.subjects
  .map(
    (s, i) =>
      `${i + 1}. ${s.subjectName} (${s.code})\n   Internal 1: ${s.internal1}/50 | Internal 2: ${s.internal2}/50 | Total: ${s.total}/100 (${s.percentage}%) [${s.performanceCategory}]`
  )
  .join('\n\n')}

3. QUIZ & FORMATIVE ASSESSMENTS
-----------------------------------------------------
Quiz / Test Average:       ${record.quizTestAverage}%
Total Assessments Logged:  ${record.quizzesAndTests.length}
${record.quizzesAndTests
  .map(
    (q) =>
      `- ${q.name} (${q.subject}): ${q.marksObtained}/${q.maxMarks} (${q.percentage}%) [${q.date}]`
  )
  .join('\n')}

4. OVERALL ACADEMIC INTELLIGENCE SCORE
-----------------------------------------------------
Composite Academic Score:  ${record.overallScore} / 100
- Internal Examinations:   ${record.scoreBreakdown.internalExams}%
- Quiz/Test Performance:   ${record.scoreBreakdown.quizTest}%
- Subject Consistency:     ${record.scoreBreakdown.subjectConsistency}%

5. EVIDENCE-BASED FACULTY DIAGNOSTIC CONTEXT
-----------------------------------------------------
"${record.academicInsight}"

=====================================================
ENGAGEAI COGNITIVE ADVISING · HUMAN-IN-THE-LOOP AUDIT
=====================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([exportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Academic_Performance_${record.regNo}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#091122] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 text-left max-h-[92vh] overflow-y-auto"
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Dossier Export Engine
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Export Academic Performance: Reg No {record.regNo}
            </h3>
          </div>
        </div>

        {/* Content Box Preview */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
          {exportText}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>FERPA Compliant · Anonymized Registration Number Dossier</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
