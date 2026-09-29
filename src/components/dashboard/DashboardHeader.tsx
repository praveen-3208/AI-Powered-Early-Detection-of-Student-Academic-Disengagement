import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  User, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { RECENT_SYSTEM_ACTIVITY } from '../../data/demoStudents';

interface DashboardHeaderProps {
  currentClass: string;
  onChangeClass: (cls: string) => void;
  currentTerm: string;
  onChangeTerm: (term: string) => void;
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
  unreadCount: number;
}

export default function DashboardHeader({
  currentClass,
  onChangeClass,
  currentTerm,
  onChangeTerm,
  onOpenMobileSidebar,
  onLogout,
  unreadCount,
}: DashboardHeaderProps) {
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-[#060b16]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left Greeting & Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Good Morning, Faculty <span>👋</span>
            </h1>
            
            {/* Status Badge: AI Monitoring Active */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-medium tracking-wide">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>AI Monitoring Active</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Here’s your academic engagement overview for today.
          </p>
        </div>
      </div>

      {/* Right Controls: Class Selector, Term Selector, Bell, Profile */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Class / Department Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <select
            value={currentClass}
            onChange={(e) => onChangeClass(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="ECE-B" className="bg-[#0b1426] text-white">
              Class ECE-B: Data Structures & Algorithms
            </option>
            <option value="CS-A" className="bg-[#0b1426] text-white">
              Class CS-A: Computer Systems
            </option>
            <option value="ECE-A" className="bg-[#0b1426] text-white">
              Class ECE-A: Digital Signal Processing
            </option>
          </select>
        </div>

        {/* Academic Term Selector */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={currentTerm}
            onChange={(e) => onChangeTerm(e.target.value)}
            className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="Fall 2026 · Term 1" className="bg-[#0b1426] text-white">
              Fall 2026 · Term 1
            </option>
            <option value="Spring 2026" className="bg-[#0b1426] text-white">
              Spring 2026
            </option>
          </select>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white font-mono shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0b1426] border border-cyan-500/25 p-4 shadow-2xl shadow-cyan-950/50 z-50 text-left animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  Recent System Signals
                </span>
                <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  {unreadCount} New
                </span>
              </div>

              <div className="py-2 space-y-2.5 max-h-72 overflow-y-auto">
                {RECENT_SYSTEM_ACTIVITY.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{item.time}</span>
                      <span className="text-cyan-400 uppercase">{item.category}</span>
                    </div>
                    <p className="font-medium text-slate-200 mt-1 leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400">
                  Real-time Non-Sensitive Telemetry
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Faculty Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 transition-colors"
          >
            <div className="hidden sm:block text-left pr-1">
              <span className="text-xs font-semibold text-white block leading-tight">
                Dr. Sarah Chen
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                ECE-B Instructor
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono">
              SC
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0b1426] border border-cyan-500/25 p-2 shadow-2xl shadow-cyan-950/50 z-50 text-left animate-in fade-in">
              <div className="p-3 border-b border-slate-800 text-xs">
                <span className="font-semibold text-white block">Dr. Sarah Chen</span>
                <span className="text-[11px] text-slate-400 font-mono">s.chen@university.edu</span>
                <span className="text-[10px] text-cyan-400 block mt-1">Associate Professor, Computer Engineering</span>
              </div>

              <div className="py-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout to Sign In</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
