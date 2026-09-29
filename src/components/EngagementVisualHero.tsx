import React from 'react';
import AcademicNeuralCanvas from './AcademicNeuralCanvas';
import { 
  Sparkles, 
  BrainCircuit, 
  HeartHandshake, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  GraduationCap
} from 'lucide-react';

export default function EngagementVisualHero() {
  return (
    <div className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 h-full overflow-hidden">
      {/* Background ambient lighting glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Brand Row */}
      <div className="relative z-10 space-y-6">
        {/* Brand label & early insight badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Engage<span className="text-cyan-400">AI</span>
              </span>
            </div>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Badge: EARLY ACADEMIC INSIGHT PLATFORM */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            EARLY ACADEMIC INSIGHT PLATFORM
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-3 max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            See the Change.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Support Early.
            </span>
          </h1>

          {/* Supporting text */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
            AI-powered insights that help faculty recognize changing student engagement patterns
            before they become academic challenges.
          </p>
        </div>
      </div>

      {/* Centerpiece: Abstract Neural-Academic Engagement Visualization */}
      <div className="relative z-10 my-6 lg:my-8 max-w-2xl">
        <AcademicNeuralCanvas />
      </div>

      {/* Bottom Section: AI identifies patterns. Faculty provides the support. */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Human + AI Relationship visual & text */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div className="-ml-2 w-10 h-10 rounded-xl bg-slate-900/90 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                “AI identifies patterns. Faculty provides the support.”
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Proactive faculty outreach preserves student retention and graduation velocity.
              </p>
            </div>
          </div>

          {/* Subtle Key Metrics */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>14-day early window</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Non-PII metrics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
