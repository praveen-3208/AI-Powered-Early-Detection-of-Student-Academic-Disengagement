import React from 'react';
import { Clock, Activity, CheckCircle2, RefreshCw, Cpu } from 'lucide-react';
import { RECENT_SYSTEM_ACTIVITY } from '../../data/demoStudents';

export default function RecentActivityTimeline() {
  return (
    <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Recent System Activity
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            System Events
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Auditable chronological record of indicator processing and synchronization jobs.
        </p>

        {/* Timeline List */}
        <div className="space-y-3.5 mt-4">
          {RECENT_SYSTEM_ACTIVITY.map((event, idx) => (
            <div key={event.id} className="relative flex items-start gap-3 group">
              {/* Vertical connector line */}
              {idx !== RECENT_SYSTEM_ACTIVITY.length - 1 && (
                <div className="absolute top-5 left-3.5 w-px h-full -ml-[0.5px] bg-slate-800" />
              )}

              {/* Marker dot */}
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 z-10 group-hover:border-cyan-500/40 transition-colors">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {event.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {event.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Non-invasive telemetry pipeline</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Nominal
        </span>
      </div>
    </section>
  );
}
