import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  FileCheck2, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { SUBJECT_NAMES, QuizTestItem } from '../../data/demoAcademicData';

interface AddAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  regNo: string;
  onAddAssessment: (item: Omit<QuizTestItem, 'id' | 'percentage'>) => void;
}

export default function AddAssessmentModal({
  isOpen,
  onClose,
  regNo,
  onAddAssessment,
}: AddAssessmentModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<QuizTestItem['type']>('Quiz');
  const [subject, setSubject] = useState<string>(SUBJECT_NAMES[0]);
  const [maxMarks, setMaxMarks] = useState<number>(20);
  const [marksObtained, setMarksObtained] = useState<number>(16);
  const [date, setDate] = useState('2026-10-02');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an assessment name.');
      return;
    }
    if (marksObtained > maxMarks) {
      setError(`Marks obtained (${marksObtained}) cannot exceed maximum marks (${maxMarks}).`);
      return;
    }
    if (marksObtained < 0 || maxMarks <= 0) {
      setError('Marks must be non-negative.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      onAddAssessment({
        name: name.trim(),
        type,
        subject,
        maxMarks: Number(maxMarks),
        marksObtained: Number(marksObtained),
        date,
      });
      setIsSubmitting(false);
      setName('');
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#091122] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 text-left"
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
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Academic Assessment Entry
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Add Assessment: Reg No {regNo}
            </h3>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
              ASSESSMENT NAME:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Quiz 3 (Finite State Machines)"
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                ASSESSMENT TYPE:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Quiz">Quiz</option>
                <option value="Unit Test">Unit Test</option>
                <option value="Mid-Semester">Mid-Semester Test</option>
                <option value="Practical / Lab Test">Practical / Lab Test</option>
                <option value="Assignment Test">Assignment Test</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                SUBJECT:
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {SUBJECT_NAMES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                MAX MARKS:
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                MARKS OBTAINED:
              </label>
              <input
                type="number"
                min="0"
                max={maxMarks}
                step="0.5"
                value={marksObtained}
                onChange={(e) => setMarksObtained(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                PERCENTAGE:
              </label>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-emerald-400 text-center">
                {maxMarks > 0 ? ((marksObtained / maxMarks) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
              EVALUATION DATE:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Record Assessment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
