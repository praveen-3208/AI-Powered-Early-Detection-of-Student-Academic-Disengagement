/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import EngagementVisualHero from './components/EngagementVisualHero';
import FacultyLoginCard, { AuthUser } from './components/FacultyLoginCard';
import FacultyDashboard from './components/FacultyDashboard';
import StudentSelfPortal from './components/portal/StudentSelfPortal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import { INITIAL_STUDENTS_DATA, StudentRecord } from './data/demoStudents';
import { calculateStudentRisk } from './services/engageAiEngine';
import { 
  ShieldCheck, 
  HelpCircle, 
  BookOpen
} from 'lucide-react';

export default function App() {
  // Centralized single dataset used throughout the entire application
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    return INITIAL_STUDENTS_DATA.map((s) => {
      const risk = calculateStudentRisk(s);
      return {
        ...s,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        engagementStatus: risk.engagementStatus,
        overallEngagement: risk.overallEngagement,
      };
    });
  });

  // Login page is kept FIRST by default
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  // If user has completed login, check role and route to FacultyDashboard or StudentSelfPortal
  if (isLoggedIn) {
    if (currentUser?.role === 'STUDENT') {
      return (
        <StudentSelfPortal
          studentRegNo={currentUser.studentRegNo || '922525106003'}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
          }}
          studentRecords={students}
        />
      );
    }

    return (
      <FacultyDashboard
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }}
        facultyName={currentUser?.name || 'Dr. Sarah Chen'}
        facultyEmail={currentUser?.email || 'dr.chen@polytechnic.edu'}
        students={students}
        onUpdateStudents={(newStudents) => setStudents(newStudents)}
      />
    );
  }

  // Otherwise, ALWAYS KEEP LOGIN PAGE AT FIRST
  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Background ambient radial gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-cyan-600/[0.07] blur-[120px]" />
        <div className="absolute top-[40%] -right-[15%] w-[45vw] h-[45vw] rounded-full bg-blue-600/[0.06] blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/[0.06] blur-[130px]" />
      </div>

      {/* Top Bar Navigation (Clean, restrained) */}
      <header className="relative z-20 border-b border-slate-800/80 bg-[#060b16]/80 backdrop-blur-md px-6 lg:px-12 py-3.5 flex items-center justify-between">
        {/* Left: Wordmark / Institutional designation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">
              Engage<span className="text-cyan-400">AI</span>
            </span>
          </div>
          <span className="hidden sm:inline-block text-slate-700">·</span>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
            Higher Education Early Warning System
          </span>
        </div>

        {/* Center / Right links & actions */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-400">
          <button
            onClick={() => setShowMethodologyModal(true)}
            className="hover:text-cyan-300 transition-colors hidden md:flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Detection Methodology</span>
          </button>

          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FERPA & Ethics</span>
          </button>

          <a
            href="mailto:support@university.edu"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:text-white transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Help Desk</span>
          </a>
        </div>
      </header>

      {/* Main Split Layout: Left (55%) & Right (45%) */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-stretch justify-center max-w-7xl mx-auto w-full">
        {/* LEFT SIDE — BRAND / AI VISUAL AREA (approx 55%) */}
        <section className="w-full lg:w-[56%] flex flex-col justify-center">
          <EngagementVisualHero />
        </section>

        {/* RIGHT SIDE — FLOATING GLASSMORPHISM LOGIN CARD (approx 44%) */}
        <section className="w-full lg:w-[44%] flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <FacultyLoginCard
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setIsLoggedIn(true);
            }}
          />
        </section>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-20 border-t border-slate-900/90 bg-[#040810]/70 py-4 px-6 lg:px-12 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>EngageAI Platform © {new Date().getFullYear()}</span>
          <span>·</span>
          <span>Built for College Hackathon Prototype</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Human-In-The-Loop AI Standard</span>
          <span className="text-slate-700">·</span>
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="hover:text-cyan-300 transition-colors"
          >
            Data Transparency Guidelines
          </button>
        </div>
      </footer>

      {/* Privacy modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Methodology modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0b1426] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white mb-2">
              Early Detection Indicators & Methodology
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              EngageAI tracks mathematical shift vectors in non-sensitive academic habits rather than raw test scores.
            </p>
            <div className="space-y-2.5 text-xs text-slate-300 mb-6 font-mono">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block">1. Attendance Rhythm:</span>
                Sudden delta from individual 3-week attendance rolling baseline.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block">2. Submission Timing Velocity:</span>
                Assignment submissions migrating from days-early to last-minute margins.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block">3. LMS Interaction Intervals:</span>
                Interval gaps between downloading reading materials and assignment deadlines.
              </div>
            </div>
            <button
              onClick={() => setShowMethodologyModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
            >
              Close Methodology
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
