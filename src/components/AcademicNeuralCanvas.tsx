import React, { useEffect, useRef, useState } from 'react';
import { CalendarCheck2, FileText, Award, Activity, Users, Sparkles, Info } from 'lucide-react';

interface AcademicNode {
  id: string;
  name: string;
  category: string;
  description: string;
  signalStrength: string;
  leadTime: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const ACADEMIC_NODES: AcademicNode[] = [
  {
    id: 'attendance',
    name: 'Attendance',
    category: 'Presence & Punctuality',
    description: 'Lecture attendance drop & lab absence streaks detected 14 days before grade impact',
    signalStrength: 'High Early Signal',
    leadTime: '10–14 days ahead',
    x: 20,
    y: 28,
    color: '#38bdf8', // sky-400
    icon: CalendarCheck2,
  },
  {
    id: 'assignments',
    name: 'Assignments',
    category: 'Submission Velocity',
    description: 'Late submissions, draft upload delays, and deadline crunch intervals',
    signalStrength: 'Leading Velocity Metric',
    leadTime: '7–10 days ahead',
    x: 76,
    y: 24,
    color: '#06b6d4', // cyan-400
    icon: FileText,
  },
  {
    id: 'assessments',
    name: 'Assessments',
    category: 'Formative Milestone Slope',
    description: 'Weekly low-stakes quiz trends and concept retention inflection points',
    signalStrength: 'Core Diagnostic',
    leadTime: '5–8 days ahead',
    x: 82,
    y: 72,
    color: '#818cf8', // indigo-400
    icon: Award,
  },
  {
    id: 'activity',
    name: 'Learning Activity',
    category: 'LMS Platform Interaction',
    description: 'Reading module dwell time, syllabus check frequency, and resource access rhythm',
    signalStrength: 'Baseline Pulse',
    leadTime: '12–18 days ahead',
    x: 24,
    y: 74,
    color: '#2dd4bf', // teal-400
    icon: Activity,
  },
  {
    id: 'participation',
    name: 'Participation',
    category: 'Collaborative Engagement',
    description: 'Discussion board questions, peer review comments, and interactive seminar polls',
    signalStrength: 'Qualitative Synthesis',
    leadTime: '7–12 days ahead',
    x: 50,
    y: 50,
    color: '#a78bfa', // purple-400
    icon: Users,
  },
];

export default function AcademicNeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string>('participation');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Animated canvas for live neural pulses & synaptic connections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Floating micro-particles
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      size: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // Data packets traveling between nodes
    interface DataPacket {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      color: string;
      size: number;
    }

    const connections: [number, number][] = [
      [0, 4], // Attendance <-> Participation
      [1, 4], // Assignments <-> Participation
      [2, 4], // Assessments <-> Participation
      [3, 4], // Learning Activity <-> Participation
      [0, 1], // Attendance <-> Assignments
      [1, 2], // Assignments <-> Assessments
      [2, 3], // Assessments <-> Learning Activity
      [3, 0], // Learning Activity <-> Attendance
    ];

    const packets: DataPacket[] = connections.map(([fromIndex, toIndex], i) => ({
      fromIndex,
      toIndex,
      progress: (i * 0.15) % 1,
      speed: 0.003 + Math.random() * 0.004,
      color: ACADEMIC_NODES[fromIndex].color,
      size: 2.5,
    }));

    let step = 0;

    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      // Draw faint grid dots for high-tech academic feel
      ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Convert percentage coordinates to pixels
      const nodeCoords = ACADEMIC_NODES.map((n) => ({
        x: (n.x / 100) * width,
        y: (n.y / 100) * height,
        color: n.color,
        id: n.id,
      }));

      // Draw synaptic connections
      connections.forEach(([from, to]) => {
        const p1 = nodeCoords[from];
        const p2 = nodeCoords[to];
        const isConnectedToActive =
          ACADEMIC_NODES[from].id === activeNodeId || ACADEMIC_NODES[to].id === activeNodeId;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = isConnectedToActive ? 1.6 : 0.8;
        ctx.strokeStyle = isConnectedToActive
          ? 'rgba(56, 189, 248, 0.35)'
          : 'rgba(56, 189, 248, 0.12)';
        ctx.stroke();

        // Secondary subtle glow line for active
        if (isConnectedToActive) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
          ctx.stroke();
        }
      });

      // Update and draw traveling data packets
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
        }

        const p1 = nodeCoords[pkt.fromIndex];
        const p2 = nodeCoords[pkt.toIndex];
        const curX = p1.x + (p2.x - p1.x) * pkt.progress;
        const curY = p1.y + (p2.y - p1.y) * pkt.progress;

        // Packet outer glow
        const radGlow = ctx.createRadialGradient(curX, curY, 0, curX, curY, pkt.size * 3);
        radGlow.addColorStop(0, pkt.color);
        radGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(curX, curY, pkt.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Packet center dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(curX, curY, pkt.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update & draw background particles
      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0) pt.x = 100;
        if (pt.x > 100) pt.x = 0;
        if (pt.y < 0) pt.y = 100;
        if (pt.y > 100) pt.y = 0;

        const px = (pt.x / 100) * width;
        const py = (pt.y / 100) * height;

        ctx.fillStyle = `rgba(56, 189, 248, ${pt.opacity * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw faint pulsing orbital ring around center node (Participation)
      const center = nodeCoords[4];
      if (center) {
        const pulseRadius = 45 + Math.sin(step * 0.03) * 6;
        ctx.beginPath();
        ctx.arc(center.x, center.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.18)';
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [activeNodeId]);

  const activeNode =
    ACADEMIC_NODES.find((n) => n.id === (hoveredNodeId || activeNodeId)) || ACADEMIC_NODES[4];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] lg:h-[400px] rounded-2xl bg-gradient-to-b from-[#091122]/90 to-[#060c19]/90 border border-cyan-500/15 overflow-hidden shadow-2xl shadow-cyan-950/30 flex flex-col justify-between"
    >
      {/* Background canvas for nodes & live packet flow */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top status bar inside canvas */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 text-xs">
        <div className="flex items-center gap-2 text-cyan-300/80 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-[11px] font-medium tracking-wide">
            NEURAL INDICATOR GRAPH · 5 SENSORS
          </span>
        </div>
        <span className="text-slate-400 text-[11px] hidden sm:inline-block">
          Interactive: Click or hover nodes
        </span>
      </div>

      {/* Interactive Overlay Nodes */}
      <div className="absolute inset-0 pointer-events-auto">
        {ACADEMIC_NODES.map((node) => {
          const Icon = node.icon;
          const isActive = node.id === activeNodeId;
          const isHovered = node.id === hoveredNodeId;

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 group cursor-pointer"
              onClick={() => setActiveNodeId(node.id)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              {/* Outer pulsing ring when active */}
              {(isActive || isHovered) && (
                <div
                  className="absolute inset-0 -m-3 rounded-full animate-ping opacity-25"
                  style={{ backgroundColor: node.color }}
                />
              )}

              {/* Main Node Disc */}
              <div
                className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border transition-all duration-300 ${
                  isActive || isHovered
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-slate-700/80 hover:border-cyan-400/60 bg-slate-900/90'
                }`}
                style={{
                  backgroundColor: isActive || isHovered ? '#0f172a' : 'rgba(15, 23, 42, 0.85)',
                  boxShadow:
                    isActive || isHovered
                      ? `0 0 24px ${node.color}55, 0 0 8px ${node.color}`
                      : '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                <Icon
                  className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                  style={{ color: node.color }}
                />
              </div>

              {/* Label below node */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-center pointer-events-none">
                <span
                  className={`text-[11px] font-medium tracking-tight block px-2 py-0.5 rounded transition-all ${
                    isActive || isHovered
                      ? 'text-white font-semibold bg-slate-900/80 border border-slate-700/60'
                      : 'text-slate-300'
                  }`}
                >
                  {node.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Node Detail Card at bottom of canvas */}
      <div className="relative z-10 p-3 sm:p-4 mt-auto m-3 sm:m-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: activeNode.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  {activeNode.name} Indicator
                </span>
                <span className="text-[10px] text-cyan-300/90 font-mono border border-cyan-500/30 px-1.5 py-0.2 rounded">
                  {activeNode.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                {activeNode.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-[11px] font-mono">
            <div className="text-right">
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">
                Detection Window
              </span>
              <span className="text-cyan-300 font-semibold">{activeNode.leadTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
