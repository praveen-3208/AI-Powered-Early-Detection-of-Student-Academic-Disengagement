import React, { useState } from 'react';
import { 
  Send, 
  Calendar, 
  UserCheck, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  HeartHandshake,
  MessageSquare
} from 'lucide-react';
import { Student } from '../types';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onCheckInSent: (studentId: string) => void;
}

export default function CheckInModal({ isOpen, onClose, student, onCheckInSent }: CheckInModalProps) {
  if (!isOpen || !student) return null;

  const [message, setMessage] = useState(
    `Hi Reg No ${student.regNo},\n\nI hope your week is going smoothly! I noticed you missed our recent lab session and wanted to check in to see how you are doing. Academic workloads can ramp up quickly this time of semester.\n\nIf there's any topic you'd like to review together or if you need an extension on the upcoming milestone, please feel free to drop by my office hours this Wednesday or reply to this note.\n\nWarm regards,\nDr. Sarah Chen\nDepartment of Computer Science`
  );

  const [supportType, setSupportType] = useState<'checkin' | 'office_hour' | 'tutoring'>('checkin');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        onCheckInSent(student.id);
        setSentSuccess(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-[#0b1426] border border-cyan-500/25 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {!sentSuccess ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                  Faculty Proactive Outreach
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Empathetic Support Check-in: Reg No {student.regNo}
                </h3>
              </div>
            </div>

            {/* AI Context Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px] font-mono uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Pattern Context & Tone Recommendation</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {student.aiInsight}
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-slate-500">Suggested Tone:</span>
                <span className="text-emerald-300 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                  {student.recommendedTone}
                </span>
              </div>
            </div>

            {/* Action Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Intervention Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSupportType('checkin')}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                    supportType === 'checkin'
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 mb-1 text-cyan-400" />
                  <span className="block font-semibold">Empathetic Note</span>
                  <span className="text-[10px] text-slate-400">Direct campus email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSupportType('office_hour')}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                    supportType === 'office_hour'
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 mb-1 text-indigo-400" />
                  <span className="block font-semibold">Office Hour Invite</span>
                  <span className="text-[10px] text-slate-400">1-on-1 Calendly link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSupportType('tutoring')}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                    supportType === 'tutoring'
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 mb-1 text-teal-400" />
                  <span className="block font-semibold">Peer Tutoring</span>
                  <span className="text-[10px] text-slate-400">Connect with TA</span>
                </button>
              </div>
            </div>

            {/* Editable Message Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Message Content (Faculty-Reviewed & Non-Punitive)
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500 leading-relaxed"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={handleSend}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transmitting Outreach...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Faculty Support</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Outreach Recorded & Dispatched</h3>
              <p className="text-xs text-slate-300">
                Empathetic check-in sent to Reg No <span className="text-cyan-300 font-semibold">{student.regNo}</span>. Engagement recovery tracking activated.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
              Status: Marked as "Faculty Addressed" in CS 204 Cohort Overview.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
