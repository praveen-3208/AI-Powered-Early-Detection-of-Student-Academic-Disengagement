import React, { useState } from 'react';
import SidebarNav, { NavTab } from './dashboard/SidebarNav';
import DashboardHeader from './dashboard/DashboardHeader';
import QuickInsightCards from './dashboard/QuickInsightCards';
import TodaysAttentionSection from './dashboard/TodaysAttentionSection';
import ClassEngagementPulse from './dashboard/ClassEngagementPulse';
import EngagementDistribution from './dashboard/EngagementDistribution';
import EarlyWarningSignals from './dashboard/EarlyWarningSignals';
import FacultyActionCenter from './dashboard/FacultyActionCenter';
import RecentActivityTimeline from './dashboard/RecentActivityTimeline';
import EngageAIInsightPanel from './dashboard/EngageAIInsightPanel';
import TeacherQuickActions from './dashboard/TeacherQuickActions';
import StudentAnalysisModal from './dashboard/StudentAnalysisModal';
import StudentsListView from './dashboard/StudentsListView';
import StudentMonitoringPage from './monitoring/StudentMonitoringPage';
import StudentAnalysisPage from './analysis/StudentAnalysisPage';
import AlertsPage from './alerts/AlertsPage';
import InterventionsPage from './interventions/InterventionsPage';
import AcademicPerformancePage from './academic/AcademicPerformancePage';
import AddAcademicDataModal from './dashboard/AddAcademicDataModal';
import InterventionsView from './dashboard/InterventionsView';
import PrivacySecurityView from './dashboard/PrivacySecurityView';
import ModelPerformanceEvaluation from './analytics/ModelPerformanceEvaluation';
import { INITIAL_STUDENTS_DATA, StudentRecord } from '../data/demoStudents';
import { calculateStudentRisk } from '../services/engageAiEngine';

interface FacultyDashboardProps {
  onLogout: () => void;
  facultyName?: string;
  facultyEmail?: string;
  students?: StudentRecord[];
  onUpdateStudents?: (updated: StudentRecord[]) => void;
}

export default function FacultyDashboard({
  onLogout,
  facultyName = 'Dr. Sarah Chen',
  facultyEmail = 'dr.chen@polytechnic.edu',
  students: propStudents,
  onUpdateStudents,
}: FacultyDashboardProps) {
  // Navigation & View States
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Class & Term Selector States
  const [currentClass, setCurrentClass] = useState('ECE-B');
  const [currentTerm, setCurrentTerm] = useState('Fall 2026 · Term 1');

  // Student Dataset State dynamically calculated with AI/ML Risk Scoring
  const [internalStudents, setInternalStudents] = useState<StudentRecord[]>(() => {
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

  const students = propStudents || internalStudents;
  const setStudents = (updater: StudentRecord[] | ((prev: StudentRecord[]) => StudentRecord[])) => {
    if (typeof updater === 'function') {
      const next = updater(students);
      setInternalStudents(next);
      if (onUpdateStudents) onUpdateStudents(next);
    } else {
      setInternalStudents(updater);
      if (onUpdateStudents) onUpdateStudents(updater);
    }
  };

  // Filter State
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Modals State
  const [selectedStudentForReview, setSelectedStudentForReview] = useState<StudentRecord | null>(null);
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false);
  const [analysisStudent, setAnalysisStudent] = useState<StudentRecord | null>(null);
  const [selectedAcademicRegNo, setSelectedAcademicRegNo] = useState<string>('922525106003');

  // Computed Counts (60 total)
  const totalCount = students.length; // 60
  const lowRiskCount = students.filter((s) => s.riskLevel === 'Low Risk').length; // 42
  const moderateRiskCount = students.filter((s) => s.riskLevel === 'Moderate Risk').length; // 12
  const highRiskCount = students.filter((s) => s.riskLevel === 'High Risk').length; // 6
  const needsReviewCount = students.filter((s) => s.needsReview).length; // 8

  // Filter handlers
  const handleQuickCardFilter = (filterKey: string) => {
    setActiveFilter(filterKey);
    setCurrentTab('students');
  };

  const handleSignalFilter = (signalKey: string) => {
    setActiveFilter(`signal_${signalKey}`);
    setCurrentTab('students');
  };

  const handleUpdateStudentStatus = (studentId: string, newStatus: 'reviewed' | 'support_initiated') => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId || s.regNo === studentId
          ? { ...s, status: newStatus, needsReview: newStatus === 'reviewed' ? false : s.needsReview }
          : s
      )
    );
    setAnalysisStudent((prev) =>
      prev && (prev.studentId === studentId || prev.regNo === studentId)
        ? {
            ...prev,
            status: newStatus,
            needsReview: newStatus === 'reviewed' ? false : prev.needsReview,
          }
        : prev
    );
  };

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 11. SIDEBAR NAVIGATION */}
      <SidebarNav
        currentTab={analysisStudent ? 'students' : currentTab}
        onSelectTab={(tab) => {
          setAnalysisStudent(null);
          setCurrentTab(tab);
          if (tab !== 'students') setActiveFilter(null);
        }}
        onLogout={onLogout}
        unreadAlertsCount={needsReviewCount}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* 1. DASHBOARD HEADER */}
        <DashboardHeader
          currentClass={currentClass}
          onChangeClass={(cls) => setCurrentClass(cls)}
          currentTerm={currentTerm}
          onChangeTerm={(term) => setCurrentTerm(term)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={onLogout}
          unreadCount={needsReviewCount}
        />

        {/* Dynamic Content Based on Active Sidebar Tab or Active Student Analysis */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {analysisStudent ? (
            <StudentAnalysisPage
              student={analysisStudent}
              allStudents={students}
              onSelectStudent={(stu) => setAnalysisStudent(stu)}
              onBackToStudents={() => {
                setAnalysisStudent(null);
                setCurrentTab('students');
              }}
              onBackToDashboard={() => {
                setAnalysisStudent(null);
                setCurrentTab('dashboard');
              }}
              onViewAcademicPerformance={(regNo) => {
                setSelectedAcademicRegNo(regNo);
                setAnalysisStudent(null);
                setCurrentTab('academic');
              }}
              onUpdateStatus={handleUpdateStudentStatus}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <>
                  {/* 10. TEACHER QUICK ACTIONS */}
                  <TeacherQuickActions
                    onAddData={() => setIsAddDataModalOpen(true)}
                    onViewStudents={() => {
                      setActiveFilter(null);
                      setCurrentTab('students');
                    }}
                    onReviewAlerts={() => {
                      setCurrentTab('alerts');
                    }}
                    onClassAnalytics={() => setCurrentTab('analytics')}
                    onAcademicPerformance={() => setCurrentTab('academic')}
                    onSupportPlans={() => setCurrentTab('interventions')}
                  />

                  {/* 2. QUICK INSIGHT CARDS */}
                  <QuickInsightCards
                    totalCount={totalCount}
                    lowRiskCount={lowRiskCount}
                    moderateRiskCount={moderateRiskCount}
                    highRiskCount={highRiskCount}
                    needsReviewCount={needsReviewCount}
                    activeFilter={activeFilter}
                    onSelectFilter={handleQuickCardFilter}
                  />

                  {/* 9. AI INSIGHT PANEL */}
                  <EngageAIInsightPanel
                    students={students}
                    onViewSupportingData={() => {
                      const pulseElem = document.getElementById('class-engagement-pulse');
                      if (pulseElem) pulseElem.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />

                  {/* 7. FACULTY ACTION CENTER */}
                  <FacultyActionCenter
                    students={students}
                    onReviewAlerts={() => {
                      setCurrentTab('alerts');
                    }}
                    onViewStudents={() => {
                      setActiveFilter(null);
                      setCurrentTab('students');
                    }}
                    onOpenClassAnalytics={() => setCurrentTab('analytics')}
                    onFilterRepeatedAlerts={() => {
                      setActiveFilter('repeated');
                      setCurrentTab('students');
                    }}
                    onFilterMentorCheckins={() => {
                      setActiveFilter('mentor');
                      setCurrentTab('students');
                    }}
                    onFilterAssignmentDecline={() => {
                      setActiveFilter('assignment_decline');
                      setCurrentTab('students');
                    }}
                  />

                  {/* 3. “TODAY’S ATTENTION” SECTION */}
                  <TodaysAttentionSection
                    students={students}
                    onReviewStudent={(stu) => setAnalysisStudent(stu)}
                    onViewAllAlerts={() => {
                      setCurrentTab('alerts');
                    }}
                  />

                  {/* 4 & 5: CLASS ENGAGEMENT PULSE + ENGAGEMENT DISTRIBUTION */}
                  <div id="class-engagement-pulse" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                      {/* 4. Class Engagement Pulse */}
                      <ClassEngagementPulse students={students} />
                    </div>
                    <div>
                      {/* 5. Student Engagement Distribution */}
                      <EngagementDistribution
                        lowRiskCount={lowRiskCount}
                        moderateRiskCount={moderateRiskCount}
                        highRiskCount={highRiskCount}
                        onFilterRisk={(risk) => handleQuickCardFilter(risk)}
                      />
                    </div>
                  </div>

                  {/* 6. EARLY WARNING SIGNALS */}
                  <EarlyWarningSignals
                    students={students}
                    onFilterBySignal={handleSignalFilter}
                  />

                  {/* 8. RECENT SYSTEM ACTIVITY */}
                  <RecentActivityTimeline />
                </>
              )}

              {currentTab === 'students' && (
                <StudentMonitoringPage
                  students={students}
                  onOpenAnalysisModal={(stu) => setAnalysisStudent(stu)}
                  onOpenAddDataModal={() => setIsAddDataModalOpen(true)}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                  initialFilter={activeFilter}
                />
              )}

              {currentTab === 'alerts' && (
                <AlertsPage
                  students={students}
                  onOpenStudentAnalysis={(regNo) => {
                    const found = students.find((s) => s.regNo === regNo || s.studentId === regNo);
                    if (found) {
                      setAnalysisStudent(found);
                    }
                  }}
                />
              )}

              {currentTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Model Performance & ML Verification */}
                  <ModelPerformanceEvaluation students={students} />

                  <ClassEngagementPulse students={students} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EngagementDistribution
                      lowRiskCount={lowRiskCount}
                      moderateRiskCount={moderateRiskCount}
                      highRiskCount={highRiskCount}
                    />
                    <EarlyWarningSignals
                      onFilterBySignal={handleSignalFilter}
                    />
                  </div>
                </div>
              )}

              {currentTab === 'academic' && (
                <AcademicPerformancePage
                  initialRegNo={selectedAcademicRegNo}
                  students={students}
                  onNavigateToStudentAnalysis={(regNo) => {
                    const found = students.find((s) => s.regNo === regNo || s.studentId === regNo);
                    if (found) {
                      setAnalysisStudent(found);
                    }
                  }}
                />
              )}

              {currentTab === 'interventions' && (
                <InterventionsPage
                  students={students}
                  onOpenStudentAnalysis={(regNo) => {
                    const found = students.find((s) => s.regNo === regNo || s.studentId === regNo);
                    if (found) {
                      setAnalysisStudent(found);
                    }
                  }}
                />
              )}

              {currentTab === 'privacy' && (
                <PrivacySecurityView />
              )}
            </>
          )}
        </main>

        {/* 18. FOOTER / TRUST MESSAGE */}
        <footer className="border-t border-slate-800/80 bg-[#040810]/70 py-4 px-6 lg:px-8 text-center text-xs text-slate-400">
          <p className="font-medium">
            “EngageAI supports faculty decisions with explainable academic insights. Every intervention remains human-reviewed.”
          </p>
          <div className="mt-1 flex items-center justify-center gap-3 text-[11px] text-slate-500 font-mono">
            <span>DATA → ENGAGEMENT CHANGE → AI ANALYSIS → EARLY WARNING → FACULTY REVIEW → STUDENT SUPPORT</span>
          </div>
        </footer>
      </div>

      {/* 12. STUDENT ANALYSIS MODAL */}
      <StudentAnalysisModal
        isOpen={Boolean(selectedStudentForReview)}
        onClose={() => setSelectedStudentForReview(null)}
        student={selectedStudentForReview}
        onUpdateStudentStatus={handleUpdateStudentStatus}
      />

      {/* Add Academic Data Modal */}
      <AddAcademicDataModal
        isOpen={isAddDataModalOpen}
        onClose={() => setIsAddDataModalOpen(false)}
        onDataAdded={(updatedStudents) => {
          if (updatedStudents && updatedStudents.length > 0) {
            setStudents(updatedStudents);
            if (analysisStudent) {
              const refreshed = updatedStudents.find(
                (s) => s.regNo === analysisStudent.regNo || s.studentId === analysisStudent.studentId
              );
              if (refreshed) {
                setAnalysisStudent(refreshed);
              }
            }
          }
        }}
        existingStudents={students}
      />
    </div>
  );
}
