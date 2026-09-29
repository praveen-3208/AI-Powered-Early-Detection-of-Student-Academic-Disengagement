import React from 'react';
import { ShieldCheck, EyeOff, Lock, UserCheck, CheckCircle2, FileCode } from 'lucide-react';

export default function PrivacySecurityView() {
  return (
    <div className="space-y-6 text-left">
      <div className="rounded-2xl bg-[#091122]/90 border border-slate-800/90 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Privacy, FERPA & Human-in-the-Loop Governance
            </h2>
            <p className="text-xs text-cyan-300 font-mono mt-0.5">
              Ethical AI Standard for Higher Education Analytics
            </p>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Zero Personal Identifiable Information (PII) Ingestion</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              EngageAI uses anonymized student tokens (e.g. ST1024). Faculty access remains strictly mapped to local university course rosters without centralized identity indexing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <EyeOff className="w-4 h-4" />
              <span>2. Absolute Ban on Invasive Telemetry</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Webcams, microphone activity, keystroke logging, device location, private browser histories, and communications are strictly non-existent in our telemetry architecture.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
              <UserCheck className="w-4 h-4" />
              <span>3. Human-Governed Intervention Principle</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              “AI identifies meaningful changes. Faculty decides how to support the student.” The platform will never automate academic penalties, attendance fines, or administrative reprimands.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Lock className="w-4 h-4" />
              <span>4. Cryptographic Role-Based Isolation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Only authenticated faculty members instructing the specific section can review engagement momentum indices. Data remains encrypted at rest and in transit using TLS 1.3 standards.
            </p>
          </div>
        </div>

        {/* Indicator Scope Table */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Approved Non-Sensitive Indicators
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 font-mono text-[11px] text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Indicator</th>
                  <th className="py-2.5 px-3">Data Source</th>
                  <th className="py-2.5 px-3">Collection Method</th>
                  <th className="py-2.5 px-3">Early Warning Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 text-cyan-300 font-semibold">Attendance</td>
                  <td className="py-2.5 px-3 text-slate-300">Classroom presence / Lab log</td>
                  <td className="py-2.5 px-3 text-slate-400">Lecture check-in timestamps</td>
                  <td className="py-2.5 px-3 text-emerald-400">10–14 days ahead of test</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-cyan-300 font-semibold">Assignment Velocity</td>
                  <td className="py-2.5 px-3 text-slate-300">Canvas / GitHub Classroom</td>
                  <td className="py-2.5 px-3 text-slate-400">Submission time vs deadline delta</td>
                  <td className="py-2.5 px-3 text-emerald-400">7–10 days ahead</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-cyan-300 font-semibold">Assessments</td>
                  <td className="py-2.5 px-3 text-slate-300">LMS Formative Quizzes</td>
                  <td className="py-2.5 px-3 text-slate-400">Weekly ungraded concept check slopes</td>
                  <td className="py-2.5 px-3 text-emerald-400">5–8 days ahead</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-cyan-300 font-semibold">Learning Activity</td>
                  <td className="py-2.5 px-3 text-slate-300">LMS Syllabus & Readings</td>
                  <td className="py-2.5 px-3 text-slate-400">Module dwell time & access gaps</td>
                  <td className="py-2.5 px-3 text-emerald-400">12–18 days ahead</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-cyan-300 font-semibold">Participation</td>
                  <td className="py-2.5 px-3 text-slate-300">Discussion forum / Peer review</td>
                  <td className="py-2.5 px-3 text-slate-400">Collaborative activity frequencies</td>
                  <td className="py-2.5 px-3 text-emerald-400">7–12 days ahead</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
