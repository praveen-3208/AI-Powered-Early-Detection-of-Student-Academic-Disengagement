import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BellRing, 
  BarChart3, 
  HeartHandshake, 
  ShieldCheck, 
  HelpCircle, 
  User, 
  LogOut, 
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

export type NavTab = 'dashboard' | 'students' | 'alerts' | 'academic' | 'analytics' | 'interventions' | 'privacy';

interface SidebarNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onLogout: () => void;
  unreadAlertsCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function SidebarNav({
  currentTab,
  onSelectTab,
  onLogout,
  unreadAlertsCount,
  isMobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, badge: 60 },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: unreadAlertsCount },
    { id: 'academic', label: 'Academic Performance', icon: GraduationCap },
    { id: 'analytics', label: 'Class Analytics', icon: BarChart3 },
    { id: 'interventions', label: 'Interventions', icon: HeartHandshake },
    { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#070d1d] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand Section */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 border border-cyan-400/30">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white flex items-center">
                  ENGAGE<span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 block -mt-1 font-medium tracking-wide">
                  FACULTY INTELLIGENCE
                </span>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Navigation Items */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-cyan-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className={isActive ? 'font-semibold text-white' : ''}>
                      {item.label}
                    </span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                          : item.id === 'alerts' && item.badge > 0
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            Account & Support
          </div>

          <button
            onClick={() => onSelectTab('privacy')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help & Support</span>
          </button>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono">
                SC
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-white block leading-tight">
                  Dr. Sarah Chen
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Faculty Access
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out to Login Page"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
