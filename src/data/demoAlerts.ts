export type AlertSeverity = 'High Priority' | 'Moderate' | 'Low';
export type AlertCategory = 'EARLY ALERT' | 'CHANGING PATTERN' | 'SINGLE INDICATOR CHANGE';
export type AlertStatus =
  | 'NEW'
  | 'REVIEWED'
  | 'New'
  | 'Monitor'
  | 'Early Alert'
  | 'Reviewed'
  | 'Support Planned'
  | 'Follow-up Due'
  | 'Completed';

export interface AffectedIndicator {
  name: 'Attendance' | 'Assignments' | 'Assessments' | 'Learning Activity' | 'Participation';
  previous: number;
  current: number;
  delta: number; // e.g. -21
}

export interface FacultyAlert {
  id: string;
  regNo: string; // 922525106001 to 922525106360
  category: AlertCategory;
  categoryExplanation: string;
  severity: AlertSeverity;
  status: AlertStatus;
  reviewStatus?: 'New' | 'Monitor' | 'Early Alert' | 'Reviewed' | 'Support Planned' | 'Follow-up Due' | 'Completed';
  detectedTime: string;
  detectedDate: string;
  riskScore: number;
  riskLevel?: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  affectedIndicators: AffectedIndicator[];
  previousValue?: number;
  currentValue?: number;
  reason?: string;
  evidenceExplanation: string;
  reviewDate?: string;
  reviewTime?: string;
  reviewedBy?: string; // "Faculty Reviewed"
  notes?: string;
}

export interface AlertTimelineEvent {
  id: string;
  time: string;
  date: string;
  regNo: string;
  indicator: string;
  status: 'New Alert' | 'Threshold Shift' | 'Faculty Reviewed' | 'Pattern Shift';
  message: string;
}

export interface PreviousAlertLog {
  id: string;
  regNo: string;
  alertType: AlertCategory;
  date: string;
  status: 'Reviewed';
  reviewedBy: string; // Always "Faculty Reviewed"
  indicatorSummary: string;
}

// Initial Alert dataset using Reg Nos 922525106001 to 922525106030
export const INITIAL_ALERTS: FacultyAlert[] = [
  // 1. High Priority - Early Alert (Reg No 922525106003)
  {
    id: 'alt-001',
    regNo: '922525106003',
    category: 'EARLY ALERT',
    categoryExplanation: 'Multiple indicators show significant decline across the current evaluation window.',
    severity: 'High Priority',
    status: 'NEW',
    detectedTime: '10:42 AM',
    detectedDate: 'Today',
    riskScore: 78,
    affectedIndicators: [
      { name: 'Attendance', previous: 82, current: 61, delta: -21 },
      { name: 'Assignments', previous: 88, current: 54, delta: -34 },
      { name: 'Assessments', previous: 76, current: 58, delta: -18 },
    ],
    evidenceExplanation:
      'Attendance decreased by 21% and assignment deliverables dropped by 34% compared with the previous period. Multiple thresholds crossed simultaneously.',
  },

  // 2. High Priority - Early Alert (Reg No 922525106007)
  {
    id: 'alt-002',
    regNo: '922525106007',
    category: 'EARLY ALERT',
    categoryExplanation: 'Multiple indicators show significant decline across the current evaluation window.',
    severity: 'High Priority',
    status: 'NEW',
    detectedTime: '10:35 AM',
    detectedDate: 'Today',
    riskScore: 74,
    affectedIndicators: [
      { name: 'Attendance', previous: 85, current: 64, delta: -21 },
      { name: 'Assignments', previous: 90, current: 62, delta: -28 },
      { name: 'Learning Activity', previous: 78, current: 55, delta: -23 },
    ],
    evidenceExplanation:
      'Consecutive absences across 3 lab sessions and unsubmitted programming exercise milestone over the last 10 days.',
  },

  // 3. High Priority - Early Alert (Reg No 922525106018)
  {
    id: 'alt-003',
    regNo: '922525106018',
    category: 'EARLY ALERT',
    categoryExplanation: 'Multiple indicators show significant decline across the current evaluation window.',
    severity: 'High Priority',
    status: 'NEW',
    detectedTime: '10:15 AM',
    detectedDate: 'Today',
    riskScore: 71,
    affectedIndicators: [
      { name: 'Assignments', previous: 86, current: 58, delta: -28 },
      { name: 'Assessments', previous: 80, current: 62, delta: -18 },
      { name: 'Participation', previous: 75, current: 52, delta: -23 },
    ],
    evidenceExplanation:
      'Mid-term formative quiz score decreased by 18% coupled with zero LMS discussion replies in 2 weeks.',
  },

  // 4. Moderate - Changing Pattern (Reg No 922525106005)
  {
    id: 'alt-004',
    regNo: '922525106005',
    category: 'CHANGING PATTERN',
    categoryExplanation: 'One or more indicators show meaningful decline requiring faculty attention.',
    severity: 'Moderate',
    status: 'NEW',
    detectedTime: '09:55 AM',
    detectedDate: 'Today',
    riskScore: 48,
    affectedIndicators: [
      { name: 'Attendance', previous: 91, current: 76, delta: -15 },
      { name: 'Learning Activity', previous: 85, current: 70, delta: -15 },
    ],
    evidenceExplanation:
      'Attendance dropped 15% below individual baseline over the past 4 lecture sessions; LMS dwell duration reduced.',
  },

  // 5. Moderate - Changing Pattern (Reg No 922525106012)
  {
    id: 'alt-005',
    regNo: '922525106012',
    category: 'CHANGING PATTERN',
    categoryExplanation: 'One or more indicators show meaningful decline requiring faculty attention.',
    severity: 'Moderate',
    status: 'NEW',
    detectedTime: '09:30 AM',
    detectedDate: 'Today',
    riskScore: 45,
    affectedIndicators: [
      { name: 'Assignments', previous: 92, current: 74, delta: -18 },
      { name: 'Participation', previous: 80, current: 66, delta: -14 },
    ],
    evidenceExplanation:
      'Homework submission latency lengthened by 48 hours; missing group repository commits on current team milestone.',
  },

  // 6. Moderate - Single Indicator Change (Reg No 922525106014)
  {
    id: 'alt-006',
    regNo: '922525106014',
    category: 'SINGLE INDICATOR CHANGE',
    categoryExplanation: 'One academic engagement metric has changed significantly while others remain stable.',
    severity: 'Moderate',
    status: 'NEW',
    detectedTime: '08:50 AM',
    detectedDate: 'Today',
    riskScore: 42,
    affectedIndicators: [
      { name: 'Assignments', previous: 89, current: 68, delta: -21 },
    ],
    evidenceExplanation:
      'Assignment completion dropped 21% this week while lecture attendance remains steady at 88%.',
  },

  // 7. Moderate - Single Indicator Change (Reg No 922525106021) - Reviewed
  {
    id: 'alt-007',
    regNo: '922525106021',
    category: 'SINGLE INDICATOR CHANGE',
    categoryExplanation: 'One academic engagement metric has changed significantly while others remain stable.',
    severity: 'Moderate',
    status: 'REVIEWED',
    detectedTime: 'Yesterday, 04:15 PM',
    detectedDate: 'Yesterday',
    reviewTime: '05:30 PM',
    reviewDate: 'Yesterday',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 39,
    affectedIndicators: [
      { name: 'Attendance', previous: 88, current: 72, delta: -16 },
    ],
    evidenceExplanation:
      'Missed two morning recitation sessions. Accommodation note submitted and acknowledged by faculty.',
    notes: 'Medical leave approved for 2 sessions. Student caught up via recorded lecture modules.',
  },

  // 8. Moderate - Changing Pattern (Reg No 922525106027) - Reviewed
  {
    id: 'alt-008',
    regNo: '922525106027',
    category: 'CHANGING PATTERN',
    categoryExplanation: 'One or more indicators show meaningful decline requiring faculty attention.',
    severity: 'Moderate',
    status: 'REVIEWED',
    detectedTime: 'Yesterday, 02:40 PM',
    detectedDate: 'Yesterday',
    reviewTime: '03:10 PM',
    reviewDate: 'Yesterday',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 46,
    affectedIndicators: [
      { name: 'Assessments', previous: 84, current: 68, delta: -16 },
      { name: 'Learning Activity', previous: 82, current: 67, delta: -15 },
    ],
    evidenceExplanation:
      'Formative quiz 3 score dipped 16%; LMS reading module access declined prior to quiz.',
    notes: 'Office hour invitation extended. Discussed memory hierarchy topics.',
  },

  // 9-18: Additional historical reviewed alerts for high-fidelity logs
  {
    id: 'alt-009',
    regNo: '922525106002',
    category: 'SINGLE INDICATOR CHANGE',
    categoryExplanation: 'One academic engagement metric has changed significantly while others remain stable.',
    severity: 'Low',
    status: 'REVIEWED',
    detectedTime: '3 days ago',
    detectedDate: '3 days ago',
    reviewTime: '11:00 AM',
    reviewDate: '3 days ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 28,
    affectedIndicators: [
      { name: 'Learning Activity', previous: 89, current: 75, delta: -14 },
    ],
    evidenceExplanation: 'Temporary drop in supplementary module access; rebounded to baseline.',
  },
  {
    id: 'alt-010',
    regNo: '922525106008',
    category: 'CHANGING PATTERN',
    categoryExplanation: 'One or more indicators show meaningful decline requiring faculty attention.',
    severity: 'Moderate',
    status: 'REVIEWED',
    detectedTime: '4 days ago',
    detectedDate: '4 days ago',
    reviewTime: '02:15 PM',
    reviewDate: '4 days ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 44,
    affectedIndicators: [
      { name: 'Attendance', previous: 86, current: 73, delta: -13 },
      { name: 'Assignments', previous: 88, current: 74, delta: -14 },
    ],
    evidenceExplanation: 'Minor dip across attendance and homework deliverables; faculty mentor sync completed.',
  },
  {
    id: 'alt-011',
    regNo: '922525106011',
    category: 'SINGLE INDICATOR CHANGE',
    categoryExplanation: 'One academic engagement metric has changed significantly while others remain stable.',
    severity: 'Low',
    status: 'REVIEWED',
    detectedTime: '5 days ago',
    detectedDate: '5 days ago',
    reviewTime: '04:00 PM',
    reviewDate: '5 days ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 25,
    affectedIndicators: [
      { name: 'Participation', previous: 82, current: 70, delta: -12 },
    ],
    evidenceExplanation: 'Low seminar question frequency during Week 3.',
  },
  {
    id: 'alt-012',
    regNo: '922525106015',
    category: 'CHANGING PATTERN',
    categoryExplanation: 'One or more indicators show meaningful decline requiring faculty attention.',
    severity: 'Moderate',
    status: 'REVIEWED',
    detectedTime: '1 week ago',
    detectedDate: '1 week ago',
    reviewTime: '09:20 AM',
    reviewDate: '1 week ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 47,
    affectedIndicators: [
      { name: 'Assignments', previous: 90, current: 75, delta: -15 },
      { name: 'Assessments', previous: 85, current: 71, delta: -14 },
    ],
    evidenceExplanation: 'Two late submissions on milestone 1; extension granted.',
  },
  {
    id: 'alt-013',
    regNo: '922525106019',
    category: 'EARLY ALERT',
    categoryExplanation: 'Multiple indicators show significant decline across the current evaluation window.',
    severity: 'High Priority',
    status: 'REVIEWED',
    detectedTime: '1 week ago',
    detectedDate: '1 week ago',
    reviewTime: '01:45 PM',
    reviewDate: '1 week ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 72,
    affectedIndicators: [
      { name: 'Attendance', previous: 84, current: 65, delta: -19 },
      { name: 'Assignments', previous: 86, current: 60, delta: -26 },
      { name: 'Participation', previous: 78, current: 58, delta: -20 },
    ],
    evidenceExplanation: 'Student reached out for tutoring support; academic coaching ongoing.',
  },
  {
    id: 'alt-014',
    regNo: '922525106022',
    category: 'SINGLE INDICATOR CHANGE',
    categoryExplanation: 'One academic engagement metric has changed significantly while others remain stable.',
    severity: 'Low',
    status: 'REVIEWED',
    detectedTime: '10 days ago',
    detectedDate: '10 days ago',
    reviewTime: '10:10 AM',
    reviewDate: '10 days ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 30,
    affectedIndicators: [
      { name: 'Learning Activity', previous: 88, current: 74, delta: -14 },
    ],
    evidenceExplanation: 'LMS portal access paused during university sports meet.',
  },
  {
    id: 'alt-015',
    regNo: '922525106025',
    category: 'CHANGING PATTERN',
    categoryExplanation: 'One or more indicators show meaningful decline requiring faculty attention.',
    severity: 'Moderate',
    status: 'REVIEWED',
    detectedTime: '12 days ago',
    detectedDate: '12 days ago',
    reviewTime: '03:50 PM',
    reviewDate: '12 days ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 49,
    affectedIndicators: [
      { name: 'Attendance', previous: 90, current: 75, delta: -15 },
      { name: 'Assessments', previous: 82, current: 68, delta: -14 },
    ],
    evidenceExplanation: 'Missed pre-lab quiz and one lecture; reviewed in office hour.',
  },
  {
    id: 'alt-016',
    regNo: '922525106028',
    category: 'SINGLE INDICATOR CHANGE',
    categoryExplanation: 'One academic engagement metric has changed significantly while others remain stable.',
    severity: 'Low',
    status: 'REVIEWED',
    detectedTime: '2 weeks ago',
    detectedDate: '2 weeks ago',
    reviewTime: '11:30 AM',
    reviewDate: '2 weeks ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 26,
    affectedIndicators: [
      { name: 'Assignments', previous: 94, current: 80, delta: -14 },
    ],
    evidenceExplanation: 'One unsubmitted assignment; completed under grace period.',
  },
  {
    id: 'alt-017',
    regNo: '922525106029',
    category: 'CHANGING PATTERN',
    categoryExplanation: 'One or more indicators show meaningful decline requiring faculty attention.',
    severity: 'Moderate',
    status: 'REVIEWED',
    detectedTime: '2 weeks ago',
    detectedDate: '2 weeks ago',
    reviewTime: '04:20 PM',
    reviewDate: '2 weeks ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 45,
    affectedIndicators: [
      { name: 'Participation', previous: 80, current: 65, delta: -15 },
      { name: 'Attendance', previous: 88, current: 74, delta: -14 },
    ],
    evidenceExplanation: 'Group peer review highlighted lower collaboration; resolved with team contract.',
  },
  {
    id: 'alt-018',
    regNo: '922525106030',
    category: 'SINGLE INDICATOR CHANGE',
    categoryExplanation: 'One academic engagement metric has changed significantly while others remain stable.',
    severity: 'Low',
    status: 'REVIEWED',
    detectedTime: '3 weeks ago',
    detectedDate: '3 weeks ago',
    reviewTime: '02:00 PM',
    reviewDate: '3 weeks ago',
    reviewedBy: 'Faculty Reviewed',
    riskScore: 24,
    affectedIndicators: [
      { name: 'Learning Activity', previous: 90, current: 78, delta: -12 },
    ],
    evidenceExplanation: 'Initial onboarding lag during week 1.',
  },
];

// Timeline events for "Alert Activity"
export const INITIAL_TIMELINE_EVENTS: AlertTimelineEvent[] = [
  {
    id: 'tl-1',
    time: '10:42 AM',
    date: 'Today',
    regNo: '922525106003',
    indicator: 'Multiple Indicators',
    status: 'New Alert',
    message: 'Multiple indicators crossed the review threshold (Attendance, Assignments, Assessments).',
  },
  {
    id: 'tl-2',
    time: '10:35 AM',
    date: 'Today',
    regNo: '922525106007',
    indicator: 'Attendance & Assignments',
    status: 'New Alert',
    message: 'Consecutive lab absences registered; assignment milestone pending.',
  },
  {
    id: 'tl-3',
    time: '10:18 AM',
    date: 'Today',
    regNo: '922525106014',
    indicator: 'Assignments',
    status: 'Threshold Shift',
    message: 'Assignment completion declined from 89% to 68% (↓21%).',
  },
  {
    id: 'tl-4',
    time: '09:55 AM',
    date: 'Today',
    regNo: '922525106021',
    indicator: 'Attendance',
    status: 'Pattern Shift',
    message: 'Attendance trend changed significantly across 4 sessions.',
  },
  {
    id: 'tl-5',
    time: '09:30 AM',
    date: 'Today',
    regNo: '922525106012',
    indicator: 'Assignments & Participation',
    status: 'New Alert',
    message: 'Team milestone submission latency exceeded 48-hour threshold.',
  },
  {
    id: 'tl-6',
    time: '08:50 AM',
    date: 'Today',
    regNo: '922525106005',
    indicator: 'Attendance & LMS Activity',
    status: 'Threshold Shift',
    message: 'Lecture check-in decline detected; platform activity decreased.',
  },
];

// Previous Alerts History Log
export const PREVIOUS_ALERTS_LOG: PreviousAlertLog[] = [
  {
    id: 'pal-1',
    regNo: '922525106021',
    alertType: 'SINGLE INDICATOR CHANGE',
    date: 'Yesterday, 05:30 PM',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Attendance dropped by 16%',
  },
  {
    id: 'pal-2',
    regNo: '922525106027',
    alertType: 'CHANGING PATTERN',
    date: 'Yesterday, 03:10 PM',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Assessments & LMS Activity declined',
  },
  {
    id: 'pal-3',
    regNo: '922525106002',
    alertType: 'SINGLE INDICATOR CHANGE',
    date: '3 days ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Learning activity dip',
  },
  {
    id: 'pal-4',
    regNo: '922525106008',
    alertType: 'CHANGING PATTERN',
    date: '4 days ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Attendance & Assignments drop',
  },
  {
    id: 'pal-5',
    regNo: '922525106011',
    alertType: 'SINGLE INDICATOR CHANGE',
    date: '5 days ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Participation score reduction',
  },
  {
    id: 'pal-6',
    regNo: '922525106015',
    alertType: 'CHANGING PATTERN',
    date: '1 week ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Assignments & Assessments decline',
  },
  {
    id: 'pal-7',
    regNo: '922525106019',
    alertType: 'EARLY ALERT',
    date: '1 week ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Multi-indicator significant shift',
  },
  {
    id: 'pal-8',
    regNo: '922525106022',
    alertType: 'SINGLE INDICATOR CHANGE',
    date: '10 days ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Learning activity pause',
  },
  {
    id: 'pal-9',
    regNo: '922525106025',
    alertType: 'CHANGING PATTERN',
    date: '12 days ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Attendance & Assessments dip',
  },
  {
    id: 'pal-10',
    regNo: '922525106028',
    alertType: 'SINGLE INDICATOR CHANGE',
    date: '2 weeks ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Assignment milestone latency',
  },
  {
    id: 'pal-11',
    regNo: '922525106029',
    alertType: 'CHANGING PATTERN',
    date: '2 weeks ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Participation & Attendance shift',
  },
  {
    id: 'pal-12',
    regNo: '922525106030',
    alertType: 'SINGLE INDICATOR CHANGE',
    date: '3 weeks ago',
    status: 'Reviewed',
    reviewedBy: 'Faculty Reviewed',
    indicatorSummary: 'Onboarding LMS activity',
  },
];
