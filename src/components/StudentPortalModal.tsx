import React from 'react';
import { GraduationCap, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentPortalModal({ isOpen, onClose }: StudentPortalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#0b1426] border border-cyan-500/20 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
          <GraduationCap className="w-5 h-5" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Are you a Student?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          This portal is reserved strictly for faculty members, course coordinators, and academic success mentors to view cohort engagement patterns.
        </p>

        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-indigo-300 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Student Privacy Guarantee</span>
          </div>
          <p>
            Students do not receive automated diagnostic scores. If you need academic advising or support resources, please log in via your university’s standard student learning management system (Canvas/Blackboard) or contact your department advisor.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Return to Faculty Portal
          </button>
        </div>
      </div>
    </div>
  );
}
