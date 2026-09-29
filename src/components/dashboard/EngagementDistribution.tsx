import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface EngagementDistributionProps {
  lowRiskCount: number;
  moderateRiskCount: number;
  highRiskCount: number;
  onFilterRisk?: (risk: string) => void;
}

export default function EngagementDistribution({
  lowRiskCount = 42,
  moderateRiskCount = 12,
  highRiskCount = 6,
  onFilterRisk,
}: EngagementDistributionProps) {
  const total = lowRiskCount + moderateRiskCount + highRiskCount; // 60
  const lowPercent = Math.round((lowRiskCount / total) * 100);
  const modPercent = Math.round((moderateRiskCount / total) * 100);
  const highPercent = Math.round((highRiskCount / total) * 100);

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const lowStroke = (lowRiskCount / total) * circumference;
  const modStroke = (moderateRiskCount / total) * circumference;
  const highStroke = (highRiskCount / total) * circumference;

  return (
    <section className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-5 sm:p-6 shadow-xl text-left flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Student Engagement Distribution
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
            Cohort Proportion
          </span>
        </div>

        <p className="text-xs text-slate-300 font-medium mt-3">
          “Most students currently show stable engagement.”
        </p>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
        {/* The Donut Visual */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="rgba(30, 41, 59, 0.6)"
              strokeWidth="16"
              fill="transparent"
            />
            {/* Low Risk Segment (Emerald) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#10b981"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${lowStroke} ${circumference}`}
              strokeDashoffset="0"
              className="transition-all duration-500"
            />
            {/* Moderate Risk Segment (Amber) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#f59e0b"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${modStroke} ${circumference}`}
              strokeDashoffset={-lowStroke}
              className="transition-all duration-500"
            />
            {/* High Risk Segment (Rose) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#f43f5e"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${highStroke} ${circumference}`}
              strokeDashoffset={-(lowStroke + modStroke)}
              className="transition-all duration-500"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums leading-none">
              {total}
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">
              Students
            </span>
          </div>
        </div>

        {/* Legend breakdown */}
        <div className="w-full sm:w-auto space-y-2.5 text-xs">
          {/* Low Risk */}
          <button
            type="button"
            onClick={() => onFilterRisk?.('low')}
            className="w-full flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-left transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <span className="font-semibold text-white block">LOW RISK</span>
                <span className="text-[10px] text-slate-400">Stable momentum</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-emerald-400 text-sm">{lowRiskCount}</span>
              <span className="text-[10px] text-slate-400 font-mono block">{lowPercent}%</span>
            </div>
          </button>

          {/* Moderate Risk */}
          <button
            type="button"
            onClick={() => onFilterRisk?.('moderate')}
            className="w-full flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-left transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <div>
                <span className="font-semibold text-white block">MODERATE RISK</span>
                <span className="text-[10px] text-slate-400">Mild indicator shifts</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-amber-400 text-sm">{moderateRiskCount}</span>
              <span className="text-[10px] text-slate-400 font-mono block">{modPercent}%</span>
            </div>
          </button>

          {/* High Risk */}
          <button
            type="button"
            onClick={() => onFilterRisk?.('high')}
            className="w-full flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-left transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <div>
                <span className="font-semibold text-white block">HIGH RISK</span>
                <span className="text-[10px] text-slate-400">Multiple declines</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-rose-400 text-sm">{highRiskCount}</span>
              <span className="text-[10px] text-slate-400 font-mono block">{highPercent}%</span>
            </div>
          </button>
        </div>
      </div>

      {/* Non-punitive ethics note */}
      <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>Categorization reflects engagement pattern deltas, not student capability.</span>
      </div>
    </section>
  );
}
