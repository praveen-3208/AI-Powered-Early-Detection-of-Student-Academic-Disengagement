export type SupportPlanStatus = 'Draft' | 'Active' | 'Follow-up Due' | 'Completed' | 'Support Required';
export type ProgressStatus = 'In Progress' | 'Improved' | 'No Change' | 'Declined';
export type SupportPlanType = 
  | 'Mentor Check-in' 
  | 'Assignment Support' 
  | 'Learning Resources' 
  | 'Peer Tutoring' 
  | 'Study Planning' 
  | 'Follow-up Monitoring';

export interface SupportPlanItem {
  id: string;
  regNo: string; // 922525106001 to 922525106360
  status: SupportPlanStatus;
  planType: SupportPlanType;
  priority: 'Normal' | 'High';
  mainObservedIndicator: string;
  suggestedSupport: string;
  createdDate: string;
  startDate: string;
  followUpDate: string;
  facultyNotes: string;
  selectedActions: string[];
  progressStatus?: ProgressStatus;
  reviewOutcomeDate?: string;
  reviewOutcomeTime?: string;
  outcomeNotes?: string;
}

export interface UpcomingFollowUp {
  id: string;
  regNo: string;
  supportType: SupportPlanType;
  followUpDate: string;
  status: 'Due Soon' | 'Overdue' | 'Scheduled' | 'Completed';
  note: string;
}

export interface OutcomeMonitoringItem {
  id: string;
  regNo: string;
  supportType: SupportPlanType;
  supportWindow: string;
  attendanceBefore: number;
  attendanceAfter: number;
  assignmentsBefore: number;
  assignmentsAfter: number;
  overallBefore: number;
  overallAfter: number;
  observedTrajectory: string;
  progressStatus: ProgressStatus;
  reviewOutcomeDate: string;
  facultyInterventionNotes: string;
}

export interface SupportHistoryItem {
  id: string;
  regNo: string;
  supportType: SupportPlanType;
  date: string;
  status: 'Completed';
  followUpResult: string;
}

export interface SupportTypeDefinition {
  id: SupportPlanType;
  title: string;
  shortDesc: string;
  recommendedFor: string;
  typicalDuration: string;
}

export const SUPPORT_TYPE_DEFINITIONS: SupportTypeDefinition[] = [
  {
    id: 'Mentor Check-in',
    title: 'Mentor Check-in',
    shortDesc: 'One-to-one academic conversation',
    recommendedFor: 'Early engagement drift, sudden participation decline, or lecture absences',
    typicalDuration: '15–20 minutes',
  },
  {
    id: 'Assignment Support',
    title: 'Assignment Support',
    shortDesc: 'Guidance for incomplete or difficult work',
    recommendedFor: 'Submission delays, missing lab milestones, or homework comprehension gaps',
    typicalDuration: '1–2 weeks grace / office-hour review',
  },
  {
    id: 'Learning Resources',
    title: 'Learning Resources',
    shortDesc: 'Additional study materials',
    recommendedFor: 'Low formative quiz scores or slow LMS module progress',
    typicalDuration: 'Self-paced with review check-in',
  },
  {
    id: 'Peer Tutoring',
    title: 'Peer Tutoring',
    shortDesc: 'Peer-supported learning assistance',
    recommendedFor: 'Complex algorithmic topics, lab programming setups, or collaborative problem sets',
    typicalDuration: '2 sessions / week',
  },
  {
    id: 'Study Planning',
    title: 'Study Planning',
    shortDesc: 'Structured academic planning',
    recommendedFor: 'Mid-semester workload cramming or multiple concurrent assignment deadlines',
    typicalDuration: 'Semester milestone roadmap',
  },
  {
    id: 'Follow-up Monitoring',
    title: 'Follow-up Monitoring',
    shortDesc: 'Review engagement after a defined period',
    recommendedFor: 'Verifying if student engagement indicators naturally rebound to baseline',
    typicalDuration: '2–3 weeks automated checkpoint',
  },
];

export const INITIAL_SUPPORT_PLANS: SupportPlanItem[] = [
  // 1. High Priority - Early Alert
  {
    id: 'sp-001',
    regNo: '922525106003',
    status: 'Support Required',
    planType: 'Assignment Support',
    priority: 'High',
    mainObservedIndicator: 'Assignment completion decline (88% → 54%)',
    suggestedSupport: 'Assignment guidance & lab extension',
    createdDate: 'Oct 01, 2026',
    startDate: 'Oct 01, 2026',
    followUpDate: 'Oct 06, 2026',
    facultyNotes: 'Noticed difficulty with recursion lab milestone. Extended milestone deadline to Oct 05 and invited to Wednesday office hours.',
    selectedActions: ['Provide alternative assignment deadline', 'Schedule 15-minute 1:1 check-in', 'Share module concept review guide'],
  },

  // 2. High Priority - Active
  {
    id: 'sp-002',
    regNo: '922525106007',
    status: 'Active',
    planType: 'Mentor Check-in',
    priority: 'High',
    mainObservedIndicator: 'Attendance & lab absence (85% → 64%)',
    suggestedSupport: 'Empathetic 1:1 faculty consultation',
    createdDate: 'Sep 29, 2026',
    startDate: 'Sep 29, 2026',
    followUpDate: 'Oct 07, 2026',
    facultyNotes: 'Conducted brief check-in after recitation. Student confirmed conflicting family commitments; agreed on asynchronous lab access.',
    selectedActions: ['Schedule 15-minute 1:1 check-in', 'Weekly follow-up check-in'],
  },

  // 3. Follow-up Due
  {
    id: 'sp-003',
    regNo: '922525106018',
    status: 'Follow-up Due',
    planType: 'Peer Tutoring',
    priority: 'High',
    mainObservedIndicator: 'Formative quiz slope & assignments (80% → 62%)',
    suggestedSupport: 'Peer tutoring referral & study buddy',
    createdDate: 'Sep 24, 2026',
    startDate: 'Sep 25, 2026',
    followUpDate: 'Oct 02, 2026',
    facultyNotes: 'Matched with senior lab peer tutor for data structures review. Need to evaluate whether Quiz 4 score improves.',
    selectedActions: ['Assign peer study buddy from lab section', 'Share module concept review guide'],
  },

  // 4. Active
  {
    id: 'sp-004',
    regNo: '922525106005',
    status: 'Active',
    planType: 'Study Planning',
    priority: 'Normal',
    mainObservedIndicator: 'Attendance & LMS dwell drop (91% → 76%)',
    suggestedSupport: 'Structured academic study plan',
    createdDate: 'Sep 28, 2026',
    startDate: 'Sep 28, 2026',
    followUpDate: 'Oct 09, 2026',
    facultyNotes: 'Helped formulate a balanced weekly timetable balancing CS and ECE coursework.',
    selectedActions: ['Provide structured academic planning roadmap', 'Weekly follow-up check-in'],
  },

  // 5. Active
  {
    id: 'sp-005',
    regNo: '922525106012',
    status: 'Active',
    planType: 'Learning Resources',
    priority: 'Normal',
    mainObservedIndicator: 'Assignment latency & team repo commits (92% → 74%)',
    suggestedSupport: 'Additional study materials & git tutorial',
    createdDate: 'Sep 27, 2026',
    startDate: 'Sep 27, 2026',
    followUpDate: 'Oct 10, 2026',
    facultyNotes: 'Shared supplementary video walkthrough on git branch merges and pointer arithmetic.',
    selectedActions: ['Share module concept review guide'],
  },

  // 6. Follow-up Due
  {
    id: 'sp-006',
    regNo: '922525106014',
    status: 'Follow-up Due',
    planType: 'Assignment Support',
    priority: 'Normal',
    mainObservedIndicator: 'Assignment drop (89% → 68%)',
    suggestedSupport: 'Homework review & concept clarification',
    createdDate: 'Sep 25, 2026',
    startDate: 'Sep 26, 2026',
    followUpDate: 'Oct 03, 2026',
    facultyNotes: 'Homework 3 submitted late. Check if Homework 4 submission is on track.',
    selectedActions: ['Provide alternative assignment deadline'],
  },

  // 7. Draft Plan
  {
    id: 'sp-007',
    regNo: '922525106020',
    status: 'Draft',
    planType: 'Follow-up Monitoring',
    priority: 'Normal',
    mainObservedIndicator: 'Slight LMS activity slowdown (88% → 75%)',
    suggestedSupport: 'Passive engagement tracking',
    createdDate: 'Oct 02, 2026',
    startDate: 'Oct 05, 2026',
    followUpDate: 'Oct 16, 2026',
    facultyNotes: 'Drafting 2-week passive telemetry checkpoint to ensure student stays within normal range.',
    selectedActions: ['Weekly follow-up check-in'],
  },

  // 8. Follow-up Due
  {
    id: 'sp-008',
    regNo: '922525106026',
    status: 'Follow-up Due',
    planType: 'Mentor Check-in',
    priority: 'Normal',
    mainObservedIndicator: 'Lecture attendance dip (87% → 73%)',
    suggestedSupport: 'Mid-term check-in review',
    createdDate: 'Sep 23, 2026',
    startDate: 'Sep 24, 2026',
    followUpDate: 'Oct 01, 2026',
    facultyNotes: 'Follow-up scheduled to confirm transport issues are resolved.',
    selectedActions: ['Schedule 15-minute 1:1 check-in'],
  },
];

export const INITIAL_FOLLOW_UPS: UpcomingFollowUp[] = [
  {
    id: 'fu-1',
    regNo: '922525106018',
    supportType: 'Peer Tutoring',
    followUpDate: 'Tomorrow, Oct 02',
    status: 'Due Soon',
    note: 'Review peer tutor progress report and verify formative Quiz 4 score.',
  },
  {
    id: 'fu-2',
    regNo: '922525106026',
    supportType: 'Mentor Check-in',
    followUpDate: 'Today, Oct 01',
    status: 'Due Soon',
    note: 'Confirm morning lecture check-ins have normalized.',
  },
  {
    id: 'fu-3',
    regNo: '922525106014',
    supportType: 'Assignment Support',
    followUpDate: 'Oct 03, 2026',
    status: 'Scheduled',
    note: 'Verify Homework 4 on-time repository submission timestamp.',
  },
  {
    id: 'fu-4',
    regNo: '922525106003',
    supportType: 'Assignment Support',
    followUpDate: 'Oct 06, 2026',
    status: 'Scheduled',
    note: 'Review submitted recursion project and check-in on confidence.',
  },
];

export const INITIAL_OUTCOME_MONITORING: OutcomeMonitoringItem[] = [
  {
    id: 'om-1',
    regNo: '922525106019',
    supportType: 'Mentor Check-in',
    supportWindow: 'Sep 10 – Sep 28',
    attendanceBefore: 61,
    attendanceAfter: 74,
    assignmentsBefore: 54,
    assignmentsAfter: 71,
    overallBefore: 51,
    overallAfter: 68,
    observedTrajectory: 'Observed upward recovery in lab submission cadence following faculty consultation.',
    progressStatus: 'Improved',
    reviewOutcomeDate: 'Sep 28, 2026',
    facultyInterventionNotes: 'Student attended 1:1 check-in; agreed on asynchronous lab access for commuter conflict.',
  },
  {
    id: 'om-2',
    regNo: '922525106021',
    supportType: 'Assignment Support',
    supportWindow: 'Sep 12 – Sep 29',
    attendanceBefore: 72,
    attendanceAfter: 85,
    assignmentsBefore: 70,
    assignmentsAfter: 88,
    overallBefore: 64,
    overallAfter: 82,
    observedTrajectory: 'Completed milestone 1 catch-up tasks and attended 4 consecutive lecture sessions.',
    progressStatus: 'Improved',
    reviewOutcomeDate: 'Sep 29, 2026',
    facultyInterventionNotes: 'Completed grace period extensions; test bench unit tests now passing.',
  },
  {
    id: 'om-3',
    regNo: '922525106027',
    supportType: 'Learning Resources',
    supportWindow: 'Sep 15 – Sep 30',
    attendanceBefore: 74,
    attendanceAfter: 82,
    assignmentsBefore: 68,
    assignmentsAfter: 81,
    overallBefore: 62,
    overallAfter: 79,
    observedTrajectory: 'LMS review module completion increased; formative assessment scores improved by 13%.',
    progressStatus: 'In Progress',
    reviewOutcomeDate: 'Sep 30, 2026',
    facultyInterventionNotes: 'Shared supplementary video walkthrough on recursion trees; monitoring next quiz.',
  },
  {
    id: 'om-4',
    regNo: '922525106014',
    supportType: 'Assignment Support',
    supportWindow: 'Sep 20 – Oct 01',
    attendanceBefore: 78,
    attendanceAfter: 77,
    assignmentsBefore: 68,
    assignmentsAfter: 68,
    overallBefore: 73,
    overallAfter: 72,
    observedTrajectory: 'Engagement metrics stabilized at baseline; no further decline observed.',
    progressStatus: 'No Change',
    reviewOutcomeDate: 'Oct 01, 2026',
    facultyInterventionNotes: 'Student managing heavy exam schedule; scheduled follow-up checkpoint for next week.',
  },
];

export const INITIAL_SUPPORT_HISTORY: SupportHistoryItem[] = [
  {
    id: 'sh-1',
    regNo: '922525106019',
    supportType: 'Mentor Check-in',
    date: 'Sep 28, 2026',
    status: 'Completed',
    followUpResult: 'Positive momentum restored; attendance stabilized at 74% and homework 3 turned in.',
  },
  {
    id: 'sh-2',
    regNo: '922525106021',
    supportType: 'Assignment Support',
    date: 'Sep 29, 2026',
    status: 'Completed',
    followUpResult: 'Milestone 2 submitted on time; quiz scores improved from 70% to 88%.',
  },
  {
    id: 'sh-3',
    regNo: '922525106027',
    supportType: 'Learning Resources',
    date: 'Sep 30, 2026',
    status: 'Completed',
    followUpResult: 'Review module exercises completed; active in lab group discussions.',
  },
  {
    id: 'sh-4',
    regNo: '922525106008',
    supportType: 'Study Planning',
    date: 'Sep 22, 2026',
    status: 'Completed',
    followUpResult: 'Structured study schedule adopted; zero unexcused absences over past 10 days.',
  },
  {
    id: 'sh-5',
    regNo: '922525106011',
    supportType: 'Peer Tutoring',
    date: 'Sep 20, 2026',
    status: 'Completed',
    followUpResult: 'Attended two weekly peer tutoring sessions; scored 88% on lab practical.',
  },
  {
    id: 'sh-6',
    regNo: '922525106015',
    supportType: 'Assignment Support',
    date: 'Sep 18, 2026',
    status: 'Completed',
    followUpResult: 'Completed grace period extensions; now aligned with current course syllabus.',
  },
  {
    id: 'sh-7',
    regNo: '922525106022',
    supportType: 'Follow-up Monitoring',
    date: 'Sep 16, 2026',
    status: 'Completed',
    followUpResult: 'University sports competition finished; LMS platform dwell time rebounded to baseline.',
  },
  {
    id: 'sh-8',
    regNo: '922525106025',
    supportType: 'Mentor Check-in',
    date: 'Sep 14, 2026',
    status: 'Completed',
    followUpResult: 'Identified prerequisite calculus refresher needs; verified with tutor referral.',
  },
];
