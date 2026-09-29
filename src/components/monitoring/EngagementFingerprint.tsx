import React, { useState } from 'react';

interface EngagementFingerprintProps {
  attendance: number;
  assignments: number;
  assessments: number;
  activity: number;
  participation: number;
  size?: number; // width/height in px
  status?: 'Stable' | 'Changing Pattern' | 'Early Alert';
  interactive?: boolean;
}

export default function EngagementFingerprint({
  attendance,
  assignments,
  assessments,
  activity,
  participation,
  size = 54,
  status = 'Stable',
  interactive = true,
}: EngagementFingerprintProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Center coordinate and radius
  const cx = size / 2;
  const cy = size / 2;
  const maxR = (size / 2) - 5; // leave margin for stroke

  // 5 dimensions in order around the clock:
  // 0: Attendance (top, -90 deg)
  // 1: Assignments (72 deg clockwise from top)
  // 2: Assessments (144 deg)
  // 3: Learning Activity (216 deg)
  // 4: Participation (288 deg)
  const angles = [-Math.PI / 2, -Math.PI / 2 + 0.4 * Math.PI * 1, -Math.PI / 2 + 0.4 * Math.PI * 2, -Math.PI / 2 + 0.4 * Math.PI * 3, -Math.PI / 2 + 0.4 * Math.PI * 4];

  const values = [
    Math.min(100, Math.max(10, attendance)),
    Math.min(100, Math.max(10, assignments)),
    Math.min(100, Math.max(10, assessments)),
    Math.min(100, Math.max(10, activity)),
    Math.min(100, Math.max(10, participation)),
  ];

  // Calculate polygon points
  const points = values.map((val, idx) => {
    const r = (val / 100) * maxR;
    const x = cx + r * Math.cos(angles[idx]);
    const y = cy + r * Math.sin(angles[idx]);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Calculate 100% outer reference polygon
  const outerPoints = angles.map((ang) => {
    const x = cx + maxR * Math.cos(ang);
    const y = cy + maxR * Math.sin(ang);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Calculate 50% inner reference polygon
  const midPoints = angles.map((ang) => {
    const x = cx + (maxR * 0.5) * Math.cos(ang);
    const y = cy + (maxR * 0.5) * Math.sin(ang);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Color scheme based on status
  let strokeColor = '#38bdf8'; // sky-400
  let fillColor = 'rgba(56, 189, 248, 0.25)';

  if (status === 'Early Alert') {
    strokeColor = '#f43f5e'; // rose-500
    fillColor = 'rgba(244, 63, 94, 0.28)';
  } else if (status === 'Changing Pattern') {
    strokeColor = '#f59e0b'; // amber-500
    fillColor = 'rgba(245, 158, 11, 0.25)';
  }

  return (
    <div 
      className="relative inline-flex items-center justify-center shrink-0 group/fingerprint"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Background reference grids */}
        <polygon
          points={outerPoints}
          fill="none"
          stroke="rgba(51, 65, 85, 0.35)"
          strokeWidth="0.8"
        />
        <polygon
          points={midPoints}
          fill="none"
          stroke="rgba(51, 65, 85, 0.25)"
          strokeDasharray="2 2"
          strokeWidth="0.8"
        />

        {/* 5 Axis spokes from center */}
        {angles.map((ang, idx) => {
          const x = cx + maxR * Math.cos(ang);
          const y = cy + maxR * Math.sin(ang);
          return (
            <line
              key={idx}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(51, 65, 85, 0.3)"
              strokeWidth="0.7"
            />
          );
        })}

        {/* The Student Fingerprint Polygon */}
        <polygon
          points={points}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover/fingerprint:brightness-125"
        />

        {/* Small vertices dots */}
        {values.map((val, idx) => {
          const r = (val / 100) * maxR;
          const x = cx + r * Math.cos(angles[idx]);
          const y = cy + r * Math.sin(angles[idx]);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="1.8"
              fill={strokeColor}
            />
          );
        })}
      </svg>

      {/* Interactive hover tooltip */}
      {interactive && isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none w-48 p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-[10px] font-mono text-left animate-in fade-in duration-150">
          <div className="font-bold text-white mb-1 pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>Engagement Fingerprint</span>
            <span style={{ color: strokeColor }}>{status}</span>
          </div>
          <div className="space-y-0.5 text-slate-300">
            <div className="flex justify-between">
              <span>Attendance:</span>
              <span className="font-bold text-white">{attendance}%</span>
            </div>
            <div className="flex justify-between">
              <span>Assignments:</span>
              <span className="font-bold text-white">{assignments}%</span>
            </div>
            <div className="flex justify-between">
              <span>Assessments:</span>
              <span className="font-bold text-white">{assessments}%</span>
            </div>
            <div className="flex justify-between">
              <span>LMS Activity:</span>
              <span className="font-bold text-white">{activity}%</span>
            </div>
            <div className="flex justify-between">
              <span>Participation:</span>
              <span className="font-bold text-white">{participation}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
