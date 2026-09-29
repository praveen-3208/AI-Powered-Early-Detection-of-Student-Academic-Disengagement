import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  AlertTriangle, 
  ClipboardList, 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from 'lucide-react';

interface QuickInsightCardsProps {
  totalCount: number;
  lowRiskCount: number;
  moderateRiskCount: number;
  highRiskCount: number;
  needsReviewCount: number;
  activeFilter: string | null;
  onSelectFilter: (filter: string) => void;
}

export default function QuickInsightCards({
  totalCount,
  lowRiskCount,
  moderateRiskCount,
  highRiskCount,
  needsReviewCount,
  activeFilter,
  onSelectFilter,
}: QuickInsightCardsProps) {
  const cards = [
    {
      id: 'all',
      title: 'TOTAL STUDENTS',
      count: totalCount,
      subtitle: 'Enrolled in active section',
      trend: '100% Non-PII monitored',
      trendType: 'neutral' as const,
      icon: Users,
      colorClass: 'text-slate-100',
      borderClass: 'hover:border-cyan-500/40',
      activeBorder: 'border-cyan-500 bg-cyan-950/20',
      badgeBg: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'low',
      title: 'LOW RISK',
      count: lowRiskCount,
      subtitle: 'Stable or improving engagement',
      trend: '70% of cohort',
      trendType: 'positive' as const,
      icon: ShieldCheck,
      colorClass: 'text-emerald-400',
      borderClass: 'hover:border-emerald-500/40',
      activeBorder: 'border-emerald-500 bg-emerald-950/20',
      badgeBg: 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'moderate',
      title: 'MODERATE RISK',
      count: moderateRiskCount,
      subtitle: 'Early negative changes detected',
      trend: '7–14d lead window',
      trendType: 'warning' as const,
      icon: AlertCircle,
      colorClass: 'text-amber-400',
      borderClass: 'hover:border-amber-500/40',
      activeBorder: 'border-amber-500 bg-amber-950/20',
      badgeBg: 'bg-amber-950/70 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'high',
      title: 'HIGH RISK',
      count: highRiskCount,
      subtitle: 'Multiple significant declines',
      trend: 'Requires proactive check-in',
      trendType: 'negative' as const,
      icon: AlertTriangle,
      colorClass: 'text-rose-400',
      borderClass: 'hover:border-rose-500/40',
      activeBorder: 'border-rose-500 bg-rose-950/20',
      badgeBg: 'bg-rose-950/70 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'review',
      title: 'NEEDS REVIEW',
      count: needsReviewCount,
      subtitle: 'Alerts awaiting faculty review',
      trend: 'Actionable today',
      trendType: 'accent' as const,
      icon: ClipboardList,
      colorClass: 'text-cyan-400',
      borderClass: 'hover:border-cyan-400/60',
      activeBorder: 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/50',
      badgeBg: 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`cursor-pointer rounded-2xl bg-[#091122]/90 border p-4 sm:p-5 transition-all duration-200 group text-left relative overflow-hidden ${
              isSelected ? card.activeBorder : `border-slate-800/90 ${card.borderClass}`
            }`}
          >
            {/* Subtle top indicator highlight */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900/90 border border-slate-800 ${card.colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Large Figure */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight ${card.colorClass}`}>
                {card.count}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                {card.trend}
              </span>
            </div>

            {/* Explanation */}
            <p className="text-xs text-slate-300 mt-2 font-normal leading-snug">
              {card.subtitle}
            </p>

            {/* Click to filter subtle prompt */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors">
              <span>{isSelected ? 'Currently filtering' : 'Click to filter'}</span>
              <span className="font-mono">→</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
