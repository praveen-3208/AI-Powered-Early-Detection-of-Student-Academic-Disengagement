import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendSparklineProps {
  data: number[]; // 4 or 5 points over 30 days
  trend: 'improving' | 'stable' | 'declining';
  width?: number;
  height?: number;
}

export default function TrendSparkline({
  data = [85, 82, 80, 75],
  trend = 'declining',
  width = 54,
  height = 20,
}: TrendSparklineProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const min = Math.min(...data, 40);
  const max = Math.max(...data, 100);
  const range = max - min || 1;

  // Color mapping
  let strokeColor = '#38bdf8'; // sky-400 for stable
  if (trend === 'declining') strokeColor = '#f43f5e'; // rose-500
  if (trend === 'improving') strokeColor = '#10b981'; // emerald-500

  // Points for SVG
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 4) + 2;
    const y = height - 2 - ((val - min) / range) * (height - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="relative inline-flex items-center gap-1.5 shrink-0 group/spark">
      {/* SVG Sparkline */}
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* End dot */}
        {data.length > 0 && (() => {
          const lastVal = data[data.length - 1];
          const x = width - 2;
          const y = height - 2 - ((lastVal - min) / range) * (height - 4);
          return (
            <circle
              cx={x}
              cy={y}
              r="2.2"
              fill={strokeColor}
            />
          );
        })()}
      </svg>

      {/* Trend text badge */}
      <span
        className={`text-[10px] font-mono font-medium flex items-center gap-0.5 ${
          trend === 'declining'
            ? 'text-rose-400'
            : trend === 'improving'
            ? 'text-emerald-400'
            : 'text-slate-400'
        }`}
      >
        {trend === 'declining' && <TrendingDown className="w-3 h-3" />}
        {trend === 'improving' && <TrendingUp className="w-3 h-3" />}
        {trend === 'stable' && <Minus className="w-3 h-3" />}
        <span className="capitalize">{trend}</span>
      </span>
    </div>
  );
}
