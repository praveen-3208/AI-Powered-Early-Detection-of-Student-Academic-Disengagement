import React, { useState } from 'react';
import { 
  X, 
  HeartHandshake, 
  Sparkles, 
  Calendar, 
  CheckSquare, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  PlusCircle,
  FileText
} from 'lucide-react';
import { SupportPlanItem, SupportPlanType } from '../../data/demoInterventions';
import { StudentRecord } from '../../data/demoStudents';

interface CreateSupportPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentRecord[];
  onCreatePlan: (newPlan: Omit<SupportPlanItem, 'id' | 'createdDate'>) => void;
  defaultRegNo?: string;
}

export default function CreateSupportPlanModal({
  isOpen,
  onClose,
  students,
  onCreatePlan,
  defaultRegNo,
}: CreateSupportPlanModalProps) {
  const [regNo, setRegNo] = useState(defaultRegNo || '922525106003');
  const [observedIndicator, setObservedIndicator] = useState('Assignment completion decline');
  const [supportType, setSupportType] = useState<SupportPlanType>('Assignment Support');
  const [priority, setPriority] = useState<'Normal' | 'High'>('High');
  const [startDate, setStartDate] = useState('2026-10-02');
  const [followUpDate, setFollowUpDate] = useState('2026-10-09');
  const [facultyNotes, setFacultyNotes] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([
    'Schedule 15-minute 1:1 check-in',
    'Provide alternative assignment deadline'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const actionOptions = [
    'Schedule 15-minute 1:1 check-in',
    'Provide alternative assignment deadline',
    'Share module concept review guide',
    'Assign peer study buddy from lab section',
    'Provide structured academic planning roadmap',
    'Weekly follow-up check-in'
  ];

  const toggleAction = (act: string) => {
    setSelectedActions((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onCreatePlan({
        regNo,
        status: priority === 'High' ? 'Support Required' : 'Active',
        planType: supportType,
        priority,
        mainObservedIndicator: observedIndicator,
        suggestedSupport: `${supportType}: ${selectedActions[0] || 'Empathetic faculty follow-up'}`,
        startDate,
        followUpDate,
        facultyNotes: facultyNotes.trim() || 'Custom faculty support plan initialized via EngageAI portal.',
        selectedActions,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
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
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Faculty Intervention Setup
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Create Faculty Support Plan
            </h3>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Reg No & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                STUDENT REG NO:
              </label>
              <select
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.regNo} value={s.regNo}>
                    {s.regNo} ({s.engagementStatus})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                PRIORITY LEVEL:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Normal', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                      priority === p
                        ? p === 'High'
                          ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                          : 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p} Priority
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Observed Indicator & Support Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                MAIN OBSERVED INDICATOR:
              </label>
              <select
                value={observedIndicator}
                onChange={(e) => setObservedIndicator(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Assignment completion decline">Assignment completion decline</option>
                <option value="Attendance & lecture absence">Attendance & lecture absence</option>
                <option value="Formative assessment slope drop">Formative assessment slope drop</option>
                <option value="LMS learning activity dwell decrease">LMS learning activity dwell decrease</option>
                <option value="Lab collaborative participation dip">Lab collaborative participation dip</option>
                <option value="Multi-indicator pattern shift">Multi-indicator pattern shift</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                SUPPORT PLAN TYPE:
              </label>
              <select
                value={supportType}
                onChange={(e) => setSupportType(e.target.value as SupportPlanType)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Mentor Check-in">Mentor Check-in (1:1 academic sync)</option>
                <option value="Assignment Support">Assignment Support (Guidance / extension)</option>
                <option value="Learning Resources">Learning Resources (Study materials)</option>
                <option value="Peer Tutoring">Peer Tutoring (Peer study assistance)</option>
                <option value="Study Planning">Study Planning (Milestone roadmap)</option>
                <option value="Follow-up Monitoring">Follow-up Monitoring (Passive review)</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                START DATE:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
                FOLLOW-UP REVIEW DATE:
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* AI Suggested Actions (Checkboxes) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Suggested Faculty Actions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {actionOptions.map((act) => {
                const isSelected = selectedActions.includes(act);
                return (
                  <div
                    key={act}
                    onClick={() => toggleAction(act)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-medium leading-snug">{act}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] shrink-0 ml-2 ${
                        isSelected
                          ? 'bg-cyan-500 border-cyan-400 text-white'
                          : 'border-slate-700 bg-slate-950'
                      }`}
                    >
                      {isSelected && '✓'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Faculty Notes */}
          <div>
            <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1">
              FACULTY OBSERVATIONS & ACTION PLAN NOTES:
            </label>
            <textarea
              rows={3}
              value={facultyNotes}
              onChange={(e) => setFacultyNotes(e.target.value)}
              placeholder="Record contextual faculty observations (e.g., student communicated overlap with lab practicals; agreed on extension until Oct 06)..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {/* Trust and Ethics banner */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Support plans are faculty-managed interventions. AI recommendations serve as exploratory suggestions only.</span>
          </div>

          {/* Action buttons */}
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
              <span>{isSubmitting ? 'Creating...' : 'Create Support Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
