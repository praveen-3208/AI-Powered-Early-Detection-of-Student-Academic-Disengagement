export interface Student {
  id: string;
  regNo: string;
  course: string;
  riskLevel: 'critical' | 'moderate' | 'mild';
  shiftDays: number;
  indicators: {
    attendance: number;
    attendanceDelta: number;
    assignmentLatency: string;
    lmsActivityDelta: string;
    formativeSlope: string;
    participationScore: string;
  };
  aiInsight: string;
  suggestedAction: string;
  recommendedTone: string;
  status: 'pending' | 'addressed';
}
