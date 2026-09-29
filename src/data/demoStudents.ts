export interface SignificantChangeItem {
  id: string;
  indicator: string;
  previousValue: number;
  currentValue: number;
  changePercent: number;
  date: string;
}

export interface AlertHistoryItem {
  id: string;
  alertNumber: string;
  patternType: string;
  changeSummary: string;
  status: 'Reviewed' | 'Pending Review';
  date: string;
}

export interface WeeklyTrendPoint {
  week: string;
  overall: number;
  attendance: number;
  assignments: number;
  assessments: number;
  activity: number;
  participation: number;
}

export interface StudentRecord {
  regNo: string; // 922525106001 to 922525106360
  studentId: string; // Reg No identifier alias
  classId: string;

  // 5 Core Indicators
  attendance: number;
  previousAttendance: number;
  assignmentCompletion: number;
  previousAssignmentCompletion: number;
  assessmentAverage: number;
  previousAssessmentAverage: number;
  learningActivity: number;
  previousLearningActivity: number;
  participation: number;
  previousParticipation: number;

  // Aliases matching Requirement 2
  attendanceCurrent: number;
  attendancePrevious: number;
  assignmentCurrent: number;
  assignmentPrevious: number;
  assessmentCurrent: number;
  assessmentPrevious: number;
  learningActivityCurrent: number;
  learningActivityPrevious: number;
  participationCurrent: number;
  participationPrevious: number;

  // Computed Risk & Logic
  riskScore: number; // 0–100
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  groundTruthRiskLevel?: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  engagementStatus: 'Stable' | 'Changing Pattern' | 'Early Alert';
  overallEngagement: number; // 0–100
  overallEngagementScore: number; // Alias matching Requirement 2
  trend: 'improving' | 'stable' | 'declining';
  sparkline: number[];

  needsReview: boolean;
  mainChange: string;
  timeDetected: string;

  // Specific flags for Action Center
  repeatedAlert: boolean;
  mentorCheckInRecommended: boolean;
  assignmentRelatedDecline: boolean;

  // Detailed explainable reasoning
  aiDiagnosticContext: string;
  recommendedAction: string;
  status: 'pending' | 'reviewed' | 'support_initiated';
  reviewStatus: string; // Alias matching Requirement 2

  // 6-week historical trend (Requirement 3)
  weeklyTrend: WeeklyTrendPoint[];
  weeklyHistory: WeeklyTrendPoint[]; // Alias matching Requirement 2

  // Specific change timeline
  significantChanges: SignificantChangeItem[];

  // Alert history
  alertHistory: AlertHistoryItem[];

  // Risk breakdown points
  riskBreakdown: {
    attendancePoints: number;
    assignmentPoints: number;
    assessmentPoints: number;
    activityPoints: number;
    participationPoints: number;
  };

  riskFactors?: {
    indicator: string;
    deltaPercent: number;
    currentValue: number;
    previousValue: number;
    severityImpact: string;
  }[];

  academicPerformance?: any;
  alerts?: any[];
  supportPlans?: any[];
  facultyNotes?: string;
}

/**
 * Requirement 5 Formula:
 * Overall Engagement Score =
 *   Attendance × 0.25
 * + Assignment × 0.25
 * + Assessment × 0.20
 * + Learning Activity × 0.15
 * + Participation × 0.15
 */
function calcEngagement(
  att: number,
  assign: number,
  assess: number,
  act: number,
  part: number
): number {
  return Math.round(
    att * 0.25 +
    assign * 0.25 +
    assess * 0.20 +
    act * 0.15 +
    part * 0.15
  );
}

// Generate the 360 demo students strictly with sequential Reg Nos 922525106001 to 922525106360
function generateCohort360(): StudentRecord[] {
  const cohort: StudentRecord[] = [];

  for (let i = 1; i <= 360; i++) {
    const regNo = `922525106${String(i).padStart(3, '0')}`;
    const studentId = regNo;
    const classId = i <= 180 ? 'ECE-A' : 'ECE-B';

    // Seeded pseudo-random generator for determinism
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;

    let att = 90;
    let prevAtt = 91;
    let assign = 92;
    let prevAssign = 91;
    let assess = 88;
    let prevAssess = 87;
    let act = 86;
    let prevAct = 85;
    let part = 84;
    let prevPart = 83;

    let riskScore = 15;
    let riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' = 'Low Risk';
    let engagementStatus: 'Stable' | 'Changing Pattern' | 'Early Alert' = 'Stable';
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    let needsReview = false;
    let mainChange = 'Consistent & stable participation pattern';
    let repeatedAlert = false;
    let mentorCheckInRecommended = false;
    let assignmentRelatedDecline = false;
    let aiDiagnosticContext = 'Telemetry steady across lecture attendance, LMS activity, and deliverables.';
    let recommendedAction = 'Maintain current instructional cadence.';
    let status: 'pending' | 'reviewed' | 'support_initiated' = 'reviewed';
    let reviewStatus = 'Completed';

    let weeklyTrend: WeeklyTrendPoint[] = [];

    // Specific known benchmark students preserved from original system
    if (i === 1) {
      // 922525106001 (Stable Top Performer)
      att = 94; prevAtt = 92;
      assign = 95; prevAssign = 94;
      assess = 90; prevAssess = 88;
      act = 92; prevAct = 90;
      part = 89; prevPart = 86;
      riskScore = 12;
      riskLevel = 'Low Risk';
      engagementStatus = 'Stable';
      trend = 'improving';
      mainChange = 'Consistent & stable participation pattern';
      aiDiagnosticContext = 'Steady upward momentum across lecture check-ins and lab deliverables.';
      recommendedAction = 'Maintain current instructional cadence.';
      weeklyTrend = [
        { week: 'Week 1', overall: 88, attendance: 92, assignments: 94, assessments: 88, activity: 90, participation: 86 },
        { week: 'Week 2', overall: 90, attendance: 93, assignments: 94, assessments: 89, activity: 91, participation: 87 },
        { week: 'Week 3', overall: 91, attendance: 93, assignments: 95, assessments: 90, activity: 91, participation: 88 },
        { week: 'Week 4', overall: 92, attendance: 94, assignments: 95, assessments: 90, activity: 92, participation: 88 },
        { week: 'Week 5', overall: 92, attendance: 94, assignments: 95, assessments: 90, activity: 92, participation: 89 },
        { week: 'Week 6', overall: 93, attendance: 94, assignments: 95, assessments: 90, activity: 92, participation: 89 },
      ];
    } else if (i === 2) {
      // 922525106002 (Stable Average Performer)
      att = 85; prevAtt = 84;
      assign = 86; prevAssign = 85;
      assess = 80; prevAssess = 79;
      act = 82; prevAct = 81;
      part = 78; prevPart = 76;
      riskScore = 22;
      riskLevel = 'Low Risk';
      engagementStatus = 'Stable';
      trend = 'stable';
      mainChange = 'Continuous regular submissions and attendance';
      aiDiagnosticContext = 'Consistently meets module completion requirements within average class range.';
      recommendedAction = 'Routine academic advising check-in at midterm.';
      weeklyTrend = [
        { week: 'Week 1', overall: 81, attendance: 84, assignments: 85, assessments: 78, activity: 80, participation: 76 },
        { week: 'Week 2', overall: 82, attendance: 84, assignments: 85, assessments: 79, activity: 81, participation: 76 },
        { week: 'Week 3', overall: 82, attendance: 85, assignments: 85, assessments: 79, activity: 81, participation: 77 },
        { week: 'Week 4', overall: 83, attendance: 85, assignments: 86, assessments: 80, activity: 82, participation: 77 },
        { week: 'Week 5', overall: 83, attendance: 85, assignments: 86, assessments: 80, activity: 82, participation: 78 },
        { week: 'Week 6', overall: 83, attendance: 85, assignments: 86, assessments: 80, activity: 82, participation: 78 },
      ];
    } else if (i === 3) {
      // 922525106003 (Classic Benchmark Early Alert)
      att = 61; prevAtt = 82;
      assign = 54; prevAssign = 88;
      assess = 58; prevAssess = 76;
      act = 48; prevAct = 71;
      part = 43; prevPart = 69;
      riskScore = 78;
      riskLevel = 'High Risk';
      engagementStatus = 'Early Alert';
      trend = 'declining';
      needsReview = true;
      repeatedAlert = true;
      mentorCheckInRecommended = true;
      assignmentRelatedDecline = true;
      status = 'pending';
      reviewStatus = 'Early Alert';
      mainChange = 'Attendance decreased by 21%, assignment deliverables down 34%';
      aiDiagnosticContext = 'Multiple metrics shifted downward simultaneously over the last 14 days without prior warning.';
      recommendedAction = 'Direct outreach for 1:1 faculty consultation; verify possible personal/health accommodation.';
      weeklyTrend = [
        { week: 'Week 1', overall: 81, attendance: 82, assignments: 88, assessments: 76, activity: 71, participation: 69 },
        { week: 'Week 2', overall: 76, attendance: 78, assignments: 84, assessments: 74, activity: 68, participation: 65 },
        { week: 'Week 3', overall: 68, attendance: 72, assignments: 72, assessments: 68, activity: 60, participation: 56 },
        { week: 'Week 4', overall: 60, attendance: 66, assignments: 60, assessments: 62, activity: 52, participation: 48 },
        { week: 'Week 5', overall: 55, attendance: 63, assignments: 56, assessments: 59, activity: 50, participation: 45 },
        { week: 'Week 6', overall: 54, attendance: 61, assignments: 54, assessments: 58, activity: 48, participation: 43 },
      ];
    } else if (i === 4) {
      // 922525106004 (High Performer)
      att = 98; prevAtt = 96;
      assign = 99; prevAssign = 98;
      assess = 95; prevAssess = 94;
      act = 96; prevAct = 95;
      part = 94; prevPart = 92;
      riskScore = 8;
      riskLevel = 'Low Risk';
      engagementStatus = 'Stable';
      trend = 'improving';
      mainChange = 'Exemplary engagement and peer tutoring contribution';
      aiDiagnosticContext = 'Consistently top 5% in lecture check-ins and practical coding submissions.';
      recommendedAction = 'Encourage participation in undergraduate research or TA opportunities.';
      weeklyTrend = [
        { week: 'Week 1', overall: 95, attendance: 96, assignments: 98, assessments: 94, activity: 95, participation: 92 },
        { week: 'Week 2', overall: 95, attendance: 97, assignments: 98, assessments: 94, activity: 95, participation: 92 },
        { week: 'Week 3', overall: 96, attendance: 97, assignments: 98, assessments: 95, activity: 95, participation: 93 },
        { week: 'Week 4', overall: 96, attendance: 98, assignments: 99, assessments: 95, activity: 96, participation: 93 },
        { week: 'Week 5', overall: 97, attendance: 98, assignments: 99, assessments: 95, activity: 96, participation: 94 },
        { week: 'Week 6', overall: 97, attendance: 98, assignments: 99, assessments: 95, activity: 96, participation: 94 },
      ];
    } else if (i === 5) {
      // 922525106005 (Moderate Risk - Changing Pattern)
      att = 76; prevAtt = 91;
      assign = 70; prevAssign = 88;
      assess = 72; prevAssess = 82;
      act = 65; prevAct = 80;
      part = 68; prevPart = 85;
      riskScore = 52;
      riskLevel = 'Moderate Risk';
      engagementStatus = 'Changing Pattern';
      trend = 'declining';
      needsReview = true;
      repeatedAlert = false;
      mentorCheckInRecommended = true;
      assignmentRelatedDecline = true;
      status = 'pending';
      reviewStatus = 'Monitor';
      mainChange = 'Attendance dropped from 91% → 76% over 4 lecture sessions';
      aiDiagnosticContext = 'Isolated shift concentrated in attendance and assignment timeliness.';
      recommendedAction = 'Send targeted advising reminder regarding lab attendance policies.';
      weeklyTrend = [
        { week: 'Week 1', overall: 86, attendance: 91, assignments: 88, assessments: 82, activity: 80, participation: 85 },
        { week: 'Week 2', overall: 84, attendance: 88, assignments: 86, assessments: 80, activity: 78, participation: 82 },
        { week: 'Week 3', overall: 79, attendance: 84, assignments: 80, assessments: 78, activity: 74, participation: 76 },
        { week: 'Week 4', overall: 75, attendance: 80, assignments: 75, assessments: 75, activity: 70, participation: 72 },
        { week: 'Week 5', overall: 72, attendance: 78, assignments: 72, assessments: 73, activity: 67, participation: 70 },
        { week: 'Week 6', overall: 71, attendance: 76, assignments: 70, assessments: 72, activity: 65, participation: 68 },
      ];
    } else if (i === 7) {
      // 922525106007 (Early Alert)
      att = 64; prevAtt = 85;
      assign = 62; prevAssign = 90;
      assess = 68; prevAssess = 80;
      act = 55; prevAct = 78;
      part = 58; prevPart = 76;
      riskScore = 74;
      riskLevel = 'High Risk';
      engagementStatus = 'Early Alert';
      trend = 'declining';
      needsReview = true;
      mentorCheckInRecommended = true;
      status = 'pending';
      reviewStatus = 'Early Alert';
      mainChange = 'Consecutive absences across 3 lab sessions, unsubmitted milestone';
      aiDiagnosticContext = 'LMS dwell time and assignment submissions have dropped significantly.';
      recommendedAction = 'Schedule priority office-hour check-in with lab assistant.';
      weeklyTrend = [
        { week: 'Week 1', overall: 83, attendance: 85, assignments: 90, assessments: 80, activity: 78, participation: 76 },
        { week: 'Week 2', overall: 79, attendance: 82, assignments: 85, assessments: 78, activity: 74, participation: 73 },
        { week: 'Week 3', overall: 72, attendance: 76, assignments: 78, assessments: 74, activity: 68, participation: 68 },
        { week: 'Week 4', overall: 67, attendance: 70, assignments: 70, assessments: 71, activity: 62, participation: 63 },
        { week: 'Week 5', overall: 63, attendance: 66, assignments: 65, assessments: 69, activity: 58, participation: 60 },
        { week: 'Week 6', overall: 62, attendance: 64, assignments: 62, assessments: 68, activity: 55, participation: 58 },
      ];
    } else if (i === 18) {
      // 922525106018 (Early Alert)
      att = 52; prevAtt = 78;
      assign = 48; prevAssign = 74;
      assess = 46; prevAssess = 68;
      act = 42; prevAct = 66;
      part = 38; prevPart = 64;
      riskScore = 84;
      riskLevel = 'High Risk';
      engagementStatus = 'Early Alert';
      trend = 'declining';
      needsReview = true;
      mentorCheckInRecommended = true;
      repeatedAlert = true;
      assignmentRelatedDecline = true;
      status = 'pending';
      reviewStatus = 'Early Alert';
      mainChange = 'Across-the-board engagement drop with multiple overdue exercises';
      aiDiagnosticContext = 'Sustained 4-week decline across all monitored indicators.';
      recommendedAction = 'Immediate faculty mentor intervention & academic advisory review.';
      weeklyTrend = [
        { week: 'Week 1', overall: 71, attendance: 78, assignments: 74, assessments: 68, activity: 66, participation: 64 },
        { week: 'Week 2', overall: 66, attendance: 72, assignments: 70, assessments: 64, activity: 60, participation: 58 },
        { week: 'Week 3', overall: 60, attendance: 66, assignments: 62, assessments: 58, activity: 54, participation: 52 },
        { week: 'Week 4', overall: 54, attendance: 60, assignments: 55, assessments: 52, activity: 48, participation: 45 },
        { week: 'Week 5', overall: 48, attendance: 55, assignments: 50, assessments: 48, activity: 44, participation: 40 },
        { week: 'Week 6', overall: 46, attendance: 52, assignments: 48, assessments: 46, activity: 42, participation: 38 },
      ];
    } else if (i === 19) {
      // 922525106019 (Improving Student)
      att = 84; prevAtt = 70;
      assign = 82; prevAssign = 68;
      assess = 78; prevAssess = 66;
      act = 76; prevAct = 64;
      part = 74; prevPart = 62;
      riskScore = 20;
      riskLevel = 'Low Risk';
      engagementStatus = 'Stable';
      trend = 'improving';
      mainChange = 'Positive rebound following mentor session (+14% attendance)';
      aiDiagnosticContext = 'Strong upward recovery across all 5 telemetry dimensions.';
      recommendedAction = 'Acknowledge positive improvement during next lecture check-in.';
      weeklyTrend = [
        { week: 'Week 1', overall: 67, attendance: 70, assignments: 68, assessments: 66, activity: 64, participation: 62 },
        { week: 'Week 2', overall: 70, attendance: 73, assignments: 71, assessments: 68, activity: 67, participation: 65 },
        { week: 'Week 3', overall: 73, attendance: 76, assignments: 74, assessments: 71, activity: 70, participation: 68 },
        { week: 'Week 4', overall: 76, attendance: 79, assignments: 77, assessments: 74, activity: 72, participation: 70 },
        { week: 'Week 5', overall: 78, attendance: 82, assignments: 80, assessments: 76, activity: 74, participation: 72 },
        { week: 'Week 6', overall: 80, attendance: 84, assignments: 82, assessments: 78, activity: 76, participation: 74 },
      ];
    } else if (i === 21) {
      // 922525106021 (Improving Student)
      att = 82; prevAtt = 72;
      assign = 80; prevAssign = 69;
      assess = 76; prevAssess = 67;
      act = 75; prevAct = 65;
      part = 73; prevPart = 63;
      riskScore = 24;
      riskLevel = 'Low Risk';
      engagementStatus = 'Stable';
      trend = 'improving';
      mainChange = 'Progressive engagement growth over 3 consecutive weeks';
      aiDiagnosticContext = 'Submission pacing has normalized from late night to 2 days prior.';
      recommendedAction = 'Encourage ongoing consistency.';
      weeklyTrend = [
        { week: 'Week 1', overall: 68, attendance: 72, assignments: 69, assessments: 67, activity: 65, participation: 63 },
        { week: 'Week 2', overall: 71, attendance: 74, assignments: 72, assessments: 69, activity: 68, participation: 66 },
        { week: 'Week 3', overall: 73, attendance: 77, assignments: 74, assessments: 71, activity: 70, participation: 68 },
        { week: 'Week 4', overall: 75, attendance: 79, assignments: 77, assessments: 73, activity: 72, participation: 70 },
        { week: 'Week 5', overall: 77, attendance: 81, assignments: 79, assessments: 75, activity: 74, participation: 72 },
        { week: 'Week 6', overall: 78, attendance: 82, assignments: 80, assessments: 76, activity: 75, participation: 73 },
      ];
    } else if (i === 26) {
      // 922525106026 (Needs Improvement / High Risk)
      att = 50; prevAtt = 72;
      assign = 44; prevAssign = 66;
      assess = 48; prevAssess = 64;
      act = 41; prevAct = 60;
      part = 36; prevPart = 58;
      riskScore = 86;
      riskLevel = 'High Risk';
      engagementStatus = 'Early Alert';
      trend = 'declining';
      needsReview = true;
      mentorCheckInRecommended = true;
      assignmentRelatedDecline = true;
      status = 'pending';
      reviewStatus = 'Early Alert';
      mainChange = 'Significant deficit across assignments and assessments';
      aiDiagnosticContext = 'Combined low exam marks and missed programming lab milestones.';
      recommendedAction = 'Connect student with peer tutoring and formal academic guidance.';
      weeklyTrend = [
        { week: 'Week 1', overall: 65, attendance: 72, assignments: 66, assessments: 64, activity: 60, participation: 58 },
        { week: 'Week 2', overall: 61, attendance: 67, assignments: 61, assessments: 60, activity: 56, participation: 53 },
        { week: 'Week 3', overall: 56, attendance: 62, assignments: 56, assessments: 56, activity: 51, participation: 48 },
        { week: 'Week 4', overall: 51, attendance: 57, assignments: 50, assessments: 52, activity: 46, participation: 43 },
        { week: 'Week 5', overall: 47, attendance: 53, assignments: 46, assessments: 50, activity: 43, participation: 39 },
        { week: 'Week 6', overall: 45, attendance: 50, assignments: 44, assessments: 48, activity: 41, participation: 36 },
      ];
    } else {
      // Systematic distribution across remaining 350 students:
      // ~7% High Risk (Early Alert) - around every 14th student
      // ~13% Moderate Risk (Changing Pattern) - around every 8th student
      // ~80% Low Risk (Stable or Improving)
      const isHighRiskCandidate = (i % 14 === 0) || (i % 39 === 0);
      const isModerateCandidate = !isHighRiskCandidate && ((i % 8 === 0) || (i % 15 === 0));
      const isImprovingCandidate = !isHighRiskCandidate && !isModerateCandidate && (i % 9 === 0);

      if (isHighRiskCandidate) {
        // High Risk / Early Alert
        const dropFactor = 15 + Math.floor(rnd * 15); // 15 - 29 drop
        prevAtt = 80 + Math.floor(rnd * 10);
        att = Math.max(45, prevAtt - dropFactor);

        prevAssign = 82 + Math.floor(rnd * 10);
        assign = Math.max(40, prevAssign - (dropFactor + 5));

        prevAssess = 78 + Math.floor(rnd * 8);
        assess = Math.max(45, prevAssess - Math.floor(dropFactor * 0.7));

        prevAct = 75 + Math.floor(rnd * 10);
        act = Math.max(38, prevAct - dropFactor);

        prevPart = 72 + Math.floor(rnd * 10);
        part = Math.max(35, prevPart - dropFactor);

        riskScore = 65 + Math.floor(rnd * 28); // 65 - 92
        riskLevel = 'High Risk';
        engagementStatus = 'Early Alert';
        trend = 'declining';
        needsReview = true;
        repeatedAlert = (i % 2 === 0);
        mentorCheckInRecommended = true;
        assignmentRelatedDecline = (assign < 60);
        status = 'pending';
        reviewStatus = 'Early Alert';
        mainChange = `Multiple indicators declining: Attendance ↓${prevAtt - att}%, Assignments ↓${prevAssign - assign}%`;
        aiDiagnosticContext = 'Multi-period trajectory shift below departmental threshold markers.';
        recommendedAction = 'Proactive outreach recommended prior to upcoming examination period.';

        const baseOverall = calcEngagement(att, assign, assess, act, part);
        const w1Overall = calcEngagement(prevAtt, prevAssign, prevAssess, prevAct, prevPart);
        weeklyTrend = [
          { week: 'Week 1', overall: w1Overall, attendance: prevAtt, assignments: prevAssign, assessments: prevAssess, activity: prevAct, participation: prevPart },
          { week: 'Week 2', overall: Math.round(w1Overall * 0.95), attendance: Math.round(prevAtt * 0.96), assignments: Math.round(prevAssign * 0.95), assessments: prevAssess, activity: prevAct, participation: prevPart },
          { week: 'Week 3', overall: Math.round(w1Overall * 0.88), attendance: Math.round(prevAtt * 0.90), assignments: Math.round(prevAssign * 0.86), assessments: Math.round(prevAssess * 0.93), activity: Math.round(prevAct * 0.88), participation: Math.round(prevPart * 0.90) },
          { week: 'Week 4', overall: Math.round(w1Overall * 0.80), attendance: Math.round((prevAtt + att) / 2), assignments: Math.round((prevAssign + assign) / 2), assessments: Math.round((prevAssess + assess) / 2), activity: Math.round((prevAct + act) / 2), participation: Math.round((prevPart + part) / 2) },
          { week: 'Week 5', overall: Math.round(baseOverall * 1.05), attendance: att + 2, assignments: assign + 3, assessments: assess + 1, activity: act + 2, participation: part + 2 },
          { week: 'Week 6', overall: baseOverall, attendance: att, assignments: assign, assessments: assess, activity: act, participation: part },
        ];
      } else if (isModerateCandidate) {
        // Moderate Risk / Changing Pattern
        const dropOne = (i % 2 === 0);
        prevAtt = 84 + Math.floor(rnd * 8);
        att = dropOne ? Math.max(68, prevAtt - (10 + Math.floor(rnd * 6))) : prevAtt - 2;

        prevAssign = 86 + Math.floor(rnd * 8);
        assign = !dropOne ? Math.max(66, prevAssign - (12 + Math.floor(rnd * 8))) : prevAssign - 3;

        prevAssess = 80 + Math.floor(rnd * 8);
        assess = prevAssess - 2;

        prevAct = 78 + Math.floor(rnd * 8);
        act = prevAct - 3;

        prevPart = 76 + Math.floor(rnd * 8);
        part = prevPart - 2;

        riskScore = 35 + Math.floor(rnd * 22); // 35 - 56
        riskLevel = 'Moderate Risk';
        engagementStatus = 'Changing Pattern';
        trend = 'declining';
        needsReview = (i % 3 === 0);
        repeatedAlert = false;
        mentorCheckInRecommended = true;
        assignmentRelatedDecline = !dropOne;
        status = 'pending';
        reviewStatus = 'Monitor';
        mainChange = dropOne
          ? `Attendance decreased from ${prevAtt}% to ${att}% (↓${prevAtt - att}%)`
          : `Assignment completion decreased from ${prevAssign}% to ${assign}% (↓${prevAssign - assign}%)`;
        aiDiagnosticContext = 'Isolated indicator decline while secondary parameters remain steady.';
        recommendedAction = 'Monitor through next assessment cycle; send automated reminder.';

        const baseOverall = calcEngagement(att, assign, assess, act, part);
        const w1Overall = calcEngagement(prevAtt, prevAssign, prevAssess, prevAct, prevPart);
        weeklyTrend = [
          { week: 'Week 1', overall: w1Overall, attendance: prevAtt, assignments: prevAssign, assessments: prevAssess, activity: prevAct, participation: prevPart },
          { week: 'Week 2', overall: Math.round(w1Overall * 0.98), attendance: prevAtt, assignments: prevAssign, assessments: prevAssess, activity: prevAct, participation: prevPart },
          { week: 'Week 3', overall: Math.round(w1Overall * 0.94), attendance: Math.round(prevAtt * 0.96), assignments: Math.round(prevAssign * 0.94), assessments: prevAssess, activity: prevAct, participation: prevPart },
          { week: 'Week 4', overall: Math.round(w1Overall * 0.91), attendance: Math.round((prevAtt + att) / 2), assignments: Math.round((prevAssign + assign) / 2), assessments: assess, activity: act, participation: part },
          { week: 'Week 5', overall: Math.round(baseOverall * 1.02), attendance: att + 1, assignments: assign + 2, assessments: assess, activity: act, participation: part },
          { week: 'Week 6', overall: baseOverall, attendance: att, assignments: assign, assessments: assess, activity: act, participation: part },
        ];
      } else if (isImprovingCandidate) {
        // Improving Student
        prevAtt = 72 + Math.floor(rnd * 6);
        att = prevAtt + (8 + Math.floor(rnd * 8));

        prevAssign = 70 + Math.floor(rnd * 6);
        assign = prevAssign + (10 + Math.floor(rnd * 6));

        prevAssess = 70 + Math.floor(rnd * 6);
        assess = prevAssess + (6 + Math.floor(rnd * 6));

        prevAct = 68 + Math.floor(rnd * 6);
        act = prevAct + 8;

        prevPart = 66 + Math.floor(rnd * 6);
        part = prevPart + 8;

        riskScore = 14 + Math.floor(rnd * 12);
        riskLevel = 'Low Risk';
        engagementStatus = 'Stable';
        trend = 'improving';
        mainChange = `Engagement momentum upward: Attendance (+${att - prevAtt}%), Assignments (+${assign - prevAssign}%)`;
        aiDiagnosticContext = 'Consistent positive trajectory observed across LMS and class checkpoints.';
        recommendedAction = 'Recognize and encourage sustained study practices.';
        reviewStatus = 'Completed';

        const baseOverall = calcEngagement(att, assign, assess, act, part);
        const w1Overall = calcEngagement(prevAtt, prevAssign, prevAssess, prevAct, prevPart);
        weeklyTrend = [
          { week: 'Week 1', overall: w1Overall, attendance: prevAtt, assignments: prevAssign, assessments: prevAssess, activity: prevAct, participation: prevPart },
          { week: 'Week 2', overall: Math.round(w1Overall * 1.03), attendance: prevAtt + 2, assignments: prevAssign + 2, assessments: prevAssess + 1, activity: prevAct + 2, participation: prevPart + 2 },
          { week: 'Week 3', overall: Math.round(w1Overall * 1.07), attendance: prevAtt + 4, assignments: prevAssign + 4, assessments: prevAssess + 3, activity: prevAct + 4, participation: prevPart + 4 },
          { week: 'Week 4', overall: Math.round(w1Overall * 1.10), attendance: Math.round((prevAtt + att) / 2), assignments: Math.round((prevAssign + assign) / 2), assessments: assess - 2, activity: act - 2, participation: part - 2 },
          { week: 'Week 5', overall: Math.round(baseOverall * 0.98), attendance: att - 1, assignments: assign - 1, assessments: assess - 1, activity: act - 1, participation: part - 1 },
          { week: 'Week 6', overall: baseOverall, attendance: att, assignments: assign, assessments: assess, activity: act, participation: part },
        ];
      } else {
        // Stable Student
        att = 86 + Math.floor(rnd * 12);
        prevAtt = Math.min(99, att + (rnd > 0.5 ? 1 : -1));

        assign = 88 + Math.floor(rnd * 10);
        prevAssign = Math.min(99, assign + (rnd > 0.5 ? 1 : -1));

        assess = 84 + Math.floor(rnd * 12);
        prevAssess = Math.min(99, assess + (rnd > 0.5 ? 1 : -1));

        act = 82 + Math.floor(rnd * 12);
        prevAct = Math.min(99, act + (rnd > 0.5 ? 1 : -1));

        part = 80 + Math.floor(rnd * 14);
        prevPart = Math.min(99, part + (rnd > 0.5 ? 1 : -1));

        riskScore = 8 + Math.floor(rnd * 18); // 8 - 25
        riskLevel = 'Low Risk';
        engagementStatus = 'Stable';
        trend = 'stable';
        mainChange = 'Consistent & stable participation pattern';
        aiDiagnosticContext = 'All monitored indicators within healthy baseline operating parameters.';
        recommendedAction = 'Maintain standard instructional cadence.';
        reviewStatus = 'Completed';

        const baseOverall = calcEngagement(att, assign, assess, act, part);
        weeklyTrend = [
          { week: 'Week 1', overall: baseOverall - 1, attendance: prevAtt, assignments: prevAssign, assessments: prevAssess, activity: prevAct, participation: prevPart },
          { week: 'Week 2', overall: baseOverall, attendance: prevAtt, assignments: assign, assessments: assess, activity: act, participation: part },
          { week: 'Week 3', overall: baseOverall, attendance: att, assignments: assign, assessments: assess, activity: act, participation: part },
          { week: 'Week 4', overall: baseOverall + 1, attendance: att, assignments: assign, assessments: assess, activity: act, participation: part },
          { week: 'Week 5', overall: baseOverall, attendance: att, assignments: assign, assessments: assess, activity: act, participation: part },
          { week: 'Week 6', overall: baseOverall, attendance: att, assignments: assign, assessments: assess, activity: act, participation: part },
        ];
      }
    }

    const overallEngagement = calcEngagement(att, assign, assess, act, part);
    const overallEngagementScore = overallEngagement;

    // Sparkline derived from weekly trend
    const sparkline = weeklyTrend.slice(-4).map((w) => w.overall);

    // Risk points breakdown
    const attDelta = prevAtt - att;
    const assignDelta = prevAssign - assign;
    const assessDelta = prevAssess - assess;
    const actDelta = prevAct - act;
    const partDelta = prevPart - part;

    const riskBreakdown = {
      attendancePoints: Math.max(1, Math.min(28, Math.round(Math.max(0, 80 - att) * 0.35 + Math.max(0, attDelta) * 0.6))),
      assignmentPoints: Math.max(1, Math.min(26, Math.round(Math.max(0, 80 - assign) * 0.35 + Math.max(0, assignDelta) * 0.6))),
      assessmentPoints: Math.max(1, Math.min(20, Math.round(Math.max(0, 80 - assess) * 0.3 + Math.max(0, assessDelta) * 0.5))),
      activityPoints: Math.max(1, Math.min(14, Math.round(Math.max(0, 80 - act) * 0.2 + Math.max(0, actDelta) * 0.4))),
      participationPoints: Math.max(1, Math.min(12, Math.round(Math.max(0, 80 - part) * 0.2 + Math.max(0, partDelta) * 0.4))),
    };

    // Significant changes list
    const significantChanges: SignificantChangeItem[] = [];
    if (attDelta >= 5) {
      significantChanges.push({
        id: `sc-att-${regNo}`,
        indicator: 'Attendance rhythm changed',
        previousValue: prevAtt,
        currentValue: att,
        changePercent: -attDelta,
        date: 'Recent sessions',
      });
    }
    if (assignDelta >= 5) {
      significantChanges.push({
        id: `sc-asn-${regNo}`,
        indicator: 'Assignment completion shifted',
        previousValue: prevAssign,
        currentValue: assign,
        changePercent: -assignDelta,
        date: 'Last 2 deadlines',
      });
    }
    if (significantChanges.length === 0) {
      significantChanges.push({
        id: `sc-sta-${regNo}`,
        indicator: 'Engagement trajectory stable',
        previousValue: prevAtt,
        currentValue: att,
        changePercent: att - prevAtt,
        date: 'Current period',
      });
    }

    const alertHistory: AlertHistoryItem[] = [];
    if (riskLevel === 'High Risk') {
      alertHistory.push({
        id: `ah-1-${regNo}`,
        alertNumber: `ALT-${String(i).padStart(3, '0')}`,
        patternType: 'Multi-Indicator Early Disengagement',
        changeSummary: mainChange,
        status: status === 'reviewed' ? 'Reviewed' : 'Pending Review',
        date: 'Today',
      });
    }

    cohort.push({
      regNo,
      studentId,
      classId,

      attendance: att,
      previousAttendance: prevAtt,
      assignmentCompletion: assign,
      previousAssignmentCompletion: prevAssign,
      assessmentAverage: assess,
      previousAssessmentAverage: prevAssess,
      learningActivity: act,
      previousLearningActivity: prevAct,
      participation: part,
      previousParticipation: prevPart,

      attendanceCurrent: att,
      attendancePrevious: prevAtt,
      assignmentCurrent: assign,
      assignmentPrevious: prevAssign,
      assessmentCurrent: assess,
      assessmentPrevious: prevAssess,
      learningActivityCurrent: act,
      learningActivityPrevious: prevAct,
      participationCurrent: part,
      participationPrevious: prevPart,

      riskScore,
      riskLevel,
      groundTruthRiskLevel: riskLevel,
      engagementStatus,
      overallEngagement,
      overallEngagementScore,
      trend,
      sparkline,

      needsReview,
      mainChange,
      timeDetected: needsReview ? 'Today, 10:42 AM' : 'Within baseline',
      repeatedAlert,
      mentorCheckInRecommended,
      assignmentRelatedDecline,

      aiDiagnosticContext,
      recommendedAction,
      status,
      reviewStatus,

      weeklyTrend,
      weeklyHistory: weeklyTrend,

      significantChanges,
      alertHistory,
      riskBreakdown,

      facultyNotes: needsReview ? 'Flagged by cognitive engine for faculty observation.' : undefined,
    });
  }

  return cohort;
}

export const INITIAL_STUDENTS_DATA: StudentRecord[] = generateCohort360();

// System Activity Log Events
export interface SystemActivityEvent {
  id: string;
  time: string;
  category: 'indicator' | 'trend' | 'sync' | 'analysis';
  title: string;
  description: string;
}

export const RECENT_SYSTEM_ACTIVITY: SystemActivityEvent[] = [
  {
    id: 'act-1',
    time: '10:45 AM',
    category: 'analysis',
    title: 'AI Analysis Updated across 360 Students',
    description: '360 student registration records synthesized across 5 non-sensitive dimensions.',
  },
  {
    id: 'act-2',
    time: '10:42 AM',
    category: 'indicator',
    title: 'New early-alert indicator detected for Reg No 922525106003',
    description: 'Attendance drop registered across consecutive sessions (82% → 61%).',
  },
  {
    id: 'act-3',
    time: '10:18 AM',
    category: 'trend',
    title: 'Assessment trend updated for Cohort',
    description: 'Weekly formative quiz slope processed for 360 enrolled registration numbers.',
  },
  {
    id: 'act-4',
    time: '09:55 AM',
    category: 'indicator',
    title: 'New changing pattern detected for Reg No 922525106005',
    description: 'Attendance dropped from 91% → 76% over 4 lecture sessions.',
  },
  {
    id: 'act-5',
    time: '08:30 AM',
    category: 'sync',
    title: 'Canvas LMS telemetry synchronization verified',
    description: 'Non-sensitive submission and module dwell intervals updated for 360 records.',
  },
];

// Weekly Pulse Point
export interface WeekPulsePoint {
  week: string;
  attendance: number;
  assignments: number;
  assessments: number;
  activity: number;
  participation: number;
}

// 4-Week Class Engagement Pulse Data (computed dynamically from the 360 cohort)
export function computeCohortPulse(students: StudentRecord[] = INITIAL_STUDENTS_DATA): WeekPulsePoint[] {
  const weekNames = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
  return weekNames.map((wName, wIdx) => {
    let sumAtt = 0;
    let sumAsn = 0;
    let sumAss = 0;
    let sumAct = 0;
    let sumPart = 0;
    let count = 0;

    students.forEach((s) => {
      const pt = s.weeklyTrend[wIdx] || s.weeklyTrend[s.weeklyTrend.length - 1];
      if (pt) {
        sumAtt += pt.attendance;
        sumAsn += pt.assignments;
        sumAss += pt.assessments;
        sumAct += pt.activity;
        sumPart += pt.participation;
        count++;
      }
    });

    const c = count || 1;
    return {
      week: wName,
      attendance: Math.round(sumAtt / c),
      assignments: Math.round(sumAsn / c),
      assessments: Math.round(sumAss / c),
      activity: Math.round(sumAct / c),
      participation: Math.round(sumPart / c),
    };
  });
}

export const CLASS_PULSE_4WEEKS: WeekPulsePoint[] = computeCohortPulse(INITIAL_STUDENTS_DATA).slice(0, 4);
export const CLASS_PULSE_6WEEKS: WeekPulsePoint[] = computeCohortPulse(INITIAL_STUDENTS_DATA);
