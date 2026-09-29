export interface SubjectMarks {
  subjectName: string;
  code: string;
  internal1: number; // 0 - 50
  internal2: number; // 0 - 50
  total: number; // 0 - 100
  percentage: number;
  performanceCategory: 'GOOD' | 'AVERAGE' | 'NEEDS IMPROVEMENT';
  trend: 'improving' | 'declining' | 'stable';
  creditHours: number;
  facultyInstructor: string;
}

export interface QuizTestItem {
  id: string;
  name: string;
  type: 'Quiz' | 'Unit Test' | 'Mid-Semester' | 'Practical / Lab Test' | 'Assignment Test';
  subject: string;
  maxMarks: number;
  marksObtained: number;
  percentage: number;
  date: string;
}

export interface StudentAcademicRecord {
  regNo: string; // 922525106001 to 922525106030
  subjects: SubjectMarks[];
  internal1Total: number; // 0 - 300
  internal1Percentage: number;
  internal2Total: number; // 0 - 300
  internal2Percentage: number;
  combinedTotal: number; // 0 - 600
  overallPercentage: number;
  performanceClassification: 'GOOD' | 'AVERAGE' | 'NEEDS IMPROVEMENT';
  performanceTrend: 'improving' | 'declining' | 'stable';
  overallScore: number; // 0 - 100 circular score
  scoreBreakdown: {
    internalExams: number; // %
    quizTest: number; // %
    subjectConsistency: number; // %
  };
  quizzesAndTests: QuizTestItem[];
  quizTestAverage: number;
  academicInsight: string;
}

export const SUBJECT_NAMES = [
  'Electronics Devices',
  'Digital Electronics',
  'Control Systems',
  'Mathematics',
  'Signals and Systems',
  'Data Structures & Algorithms',
] as const;

export const SUBJECT_CODES: Record<string, string> = {
  'Electronics Devices': 'EC301',
  'Digital Electronics': 'EC302',
  'Control Systems': 'EE303',
  'Mathematics': 'MA301',
  'Signals and Systems': 'EC304',
  'Data Structures & Algorithms': 'CS305',
};

// Helper to compute category based on percentage
export function getPerformanceCategory(pct: number): 'GOOD' | 'AVERAGE' | 'NEEDS IMPROVEMENT' {
  if (pct >= 75) return 'GOOD';
  if (pct >= 50) return 'AVERAGE';
  return 'NEEDS IMPROVEMENT';
}

// Helper to compute trend (compares student's own Internal 1 vs Internal 2)
export function getTrend(i1: number, i2: number): 'improving' | 'declining' | 'stable' {
  const diff = i2 - i1;
  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}

// Raw mark patterns for key benchmark students
const RAW_STUDENT_MARKS: Record<string, { i1: number[]; i2: number[] }> = {
  '922525106001': { i1: [44, 41, 43, 38, 42, 47], i2: [45, 43, 44, 40, 43, 48] }, // 85.5% Good
  '922525106002': { i1: [38, 36, 40, 32, 35, 42], i2: [39, 38, 41, 35, 36, 44] }, // 74.3% Average
  '922525106003': { i1: [42, 35, 39, 29, 34, 49], i2: [45, 32, 41, 27, 31, 48] }, // 77.0% Good (Math dropped)
  '922525106004': { i1: [46, 45, 47, 44, 45, 49], i2: [47, 46, 48, 45, 46, 50] }, // 93.0% Good
  '922525106005': { i1: [34, 31, 35, 26, 29, 38], i2: [31, 28, 33, 24, 27, 35] }, // 61.8% Average
  '922525106006': { i1: [43, 42, 41, 39, 40, 46], i2: [44, 43, 42, 41, 42, 47] }, // 85.0% Good
  '922525106007': { i1: [32, 28, 30, 21, 25, 34], i2: [28, 25, 27, 19, 22, 30] }, // 53.5% Average
  '922525106008': { i1: [39, 37, 38, 34, 36, 43], i2: [40, 39, 41, 36, 38, 45] }, // 77.7% Good
  '922525106009': { i1: [45, 44, 46, 42, 43, 48], i2: [46, 45, 47, 44, 45, 49] }, // 90.7% Good
  '922525106010': { i1: [41, 40, 42, 38, 39, 46], i2: [43, 41, 44, 40, 42, 47] }, // 84.5% Good
  '922525106011': { i1: [36, 34, 37, 30, 32, 40], i2: [37, 36, 38, 32, 34, 42] }, // 71.3% Average
  '922525106012': { i1: [38, 35, 39, 29, 33, 43], i2: [36, 32, 36, 27, 30, 41] }, // 69.7% Average
  '922525106013': { i1: [47, 46, 48, 45, 46, 50], i2: [48, 47, 49, 46, 47, 50] }, // 94.8% Good
  '922525106014': { i1: [37, 35, 36, 31, 33, 41], i2: [35, 32, 34, 28, 30, 38] }, // 68.3% Average
  '922525106015': { i1: [42, 39, 41, 36, 38, 45], i2: [43, 41, 43, 38, 40, 46] }, // 82.7% Good
  '922525106016': { i1: [40, 38, 41, 35, 37, 44], i2: [41, 40, 42, 37, 39, 46] }, // 80.0% Good
  '922525106017': { i1: [35, 32, 36, 28, 31, 39], i2: [36, 34, 37, 30, 33, 41] }, // 68.7% Average
  '922525106018': { i1: [28, 25, 29, 18, 22, 30], i2: [24, 21, 25, 15, 18, 26] }, // 46.8% Needs Improvement
  '922525106019': { i1: [31, 28, 30, 22, 26, 33], i2: [35, 32, 34, 27, 30, 37] }, // 59.2% Average (improving)
  '922525106020': { i1: [43, 41, 44, 39, 41, 47], i2: [44, 43, 45, 41, 43, 48] }, // 86.3% Good
  '922525106021': { i1: [34, 30, 32, 23, 27, 36], i2: [38, 35, 36, 29, 32, 40] }, // 65.3% Average (improving)
  '922525106022': { i1: [39, 37, 40, 33, 36, 43], i2: [40, 38, 41, 35, 37, 44] }, // 77.2% Good
  '922525106023': { i1: [46, 44, 47, 43, 45, 49], i2: [47, 46, 48, 44, 46, 50] }, // 92.5% Good
  '922525106024': { i1: [41, 39, 42, 36, 38, 45], i2: [42, 40, 43, 38, 40, 46] }, // 81.8% Good
  '922525106025': { i1: [37, 34, 38, 29, 33, 41], i2: [39, 36, 40, 32, 35, 43] }, // 73.0% Average
  '922525106026': { i1: [26, 22, 27, 16, 20, 28], i2: [23, 19, 24, 14, 17, 25] }, // 43.5% Needs Improvement
  '922525106027': { i1: [36, 33, 37, 28, 31, 40], i2: [40, 38, 41, 33, 36, 44] }, // 72.8% Average (improving)
  '922525106028': { i1: [42, 40, 43, 37, 39, 46], i2: [43, 42, 44, 39, 41, 47] }, // 83.8% Good
  '922525106029': { i1: [38, 36, 39, 32, 35, 42], i2: [37, 34, 37, 30, 33, 40] }, // 72.2% Average
  '922525106030': { i1: [44, 42, 45, 40, 42, 48], i2: [45, 44, 46, 42, 44, 49] }, // 88.5% Good
};

export function getStudentMarks(regNo: string): { i1: number[]; i2: number[] } {
  if (RAW_STUDENT_MARKS[regNo]) {
    return RAW_STUDENT_MARKS[regNo];
  }

  const num = parseInt(regNo.slice(-3), 10) || 1;
  const seed = (num * 9301 + 49297) % 233280;
  const rnd = seed / 233280;

  // Realistic distribution:
  // ~8% Needs improvement (<50%)
  // ~32% Average (50% - 74.99%)
  // ~60% Good (>=75%)
  if (num % 13 === 0 || num % 29 === 0) {
    // Needs improvement
    const b1 = 20 + Math.floor(rnd * 8); // 20-27
    const b2 = 18 + Math.floor(((seed * 7) % 100) / 100 * 7); // 18-24
    return {
      i1: [b1 + 3, b1 - 1, b1 + 2, Math.max(12, b1 - 6), b1 - 2, b1 + 5].map((v) => Math.min(50, Math.max(10, v))),
      i2: [b2 + 2, b2 - 2, b2 + 1, Math.max(10, b2 - 6), b2 - 3, b2 + 4].map((v) => Math.min(50, Math.max(10, v))),
    };
  } else if (num % 3 === 0 || num % 5 === 0) {
    // Average
    const b1 = 32 + Math.floor(rnd * 6); // 32-37
    const delta = ((num % 7) === 0 ? 3 : (num % 2 === 0 ? 1 : -1));
    const b2 = b1 + delta;
    return {
      i1: [b1 + 2, b1 - 1, b1 + 3, Math.max(20, b1 - 5), b1, b1 + 5].map((v) => Math.min(50, Math.max(15, v))),
      i2: [b2 + 3, b2, b2 + 2, Math.max(19, b2 - 4), b2 + 1, b2 + 6].map((v) => Math.min(50, Math.max(15, v))),
    };
  } else {
    // Good (75% - 96%)
    const b1 = 39 + Math.floor(rnd * 8); // 39-46
    const b2 = Math.min(48, b1 + ((num % 4 === 0) ? 2 : 1));
    return {
      i1: [b1 + 2, b1, b1 + 3, Math.max(30, b1 - 3), b1 + 1, Math.min(50, b1 + 4)].map((v) => Math.min(50, Math.max(25, v))),
      i2: [b2 + 2, b2 + 1, b2 + 2, Math.max(32, b2 - 2), b2 + 1, Math.min(50, b2 + 3)].map((v) => Math.min(50, Math.max(25, v))),
    };
  }
}

export function buildStudentAcademicRecord(regNo: string): StudentAcademicRecord {
  const marks = getStudentMarks(regNo);

  const subjects: SubjectMarks[] = SUBJECT_NAMES.map((name, idx) => {
    const internal1 = marks.i1[idx];
    const internal2 = marks.i2[idx];
    const total = internal1 + internal2; // max 100
    const percentage = Number(total.toFixed(1));
    const performanceCategory = getPerformanceCategory(percentage);
    const trend = getTrend(internal1, internal2);

    return {
      subjectName: name,
      code: SUBJECT_CODES[name] || 'EC300',
      internal1,
      internal2,
      total,
      percentage,
      performanceCategory,
      trend,
      creditHours: name === 'Data Structures & Algorithms' || name === 'Mathematics' ? 4 : 3,
      facultyInstructor: 'Faculty Instructor',
    };
  });

  const internal1Total = marks.i1.reduce((a, b) => a + b, 0); // max 300
  const internal2Total = marks.i2.reduce((a, b) => a + b, 0); // max 300
  const combinedTotal = internal1Total + internal2Total; // max 600

  const internal1Percentage = Number(((internal1Total / 300) * 100).toFixed(1));
  const internal2Percentage = Number(((internal2Total / 300) * 100).toFixed(1));
  const overallPercentage = Number(((combinedTotal / 600) * 100).toFixed(1));

  const performanceClassification = getPerformanceCategory(overallPercentage);
  const performanceTrend = getTrend(internal1Total, internal2Total);

  // Generate initial quizzes and tests
  const quizzesAndTests: QuizTestItem[] = [
    {
      id: `q1-${regNo}`,
      name: 'Quiz 1 (Unit 1 & 2)',
      type: 'Quiz' as const,
      subject: 'Data Structures & Algorithms',
      maxMarks: 20,
      marksObtained: Math.min(20, Math.max(6, Math.round((overallPercentage / 100) * 20))),
      percentage: 0,
      date: 'Aug 22, 2026',
    },
    {
      id: `q2-${regNo}`,
      name: 'Quiz 2 (Problem Solving)',
      type: 'Quiz' as const,
      subject: 'Digital Electronics',
      maxMarks: 20,
      marksObtained: Math.min(20, Math.max(5, Math.round((overallPercentage / 100) * 19))),
      percentage: 0,
      date: 'Sep 05, 2026',
    },
    {
      id: `ut-${regNo}`,
      name: 'Unit Test 1',
      type: 'Unit Test' as const,
      subject: 'Control Systems',
      maxMarks: 50,
      marksObtained: Math.min(50, Math.max(15, Math.round((internal1Percentage / 100) * 50))),
      percentage: 0,
      date: 'Sep 14, 2026',
    },
    {
      id: `mst-${regNo}`,
      name: 'Mid-Semester Test',
      type: 'Mid-Semester' as const,
      subject: 'Electronics Devices',
      maxMarks: 50,
      marksObtained: Math.min(50, Math.max(14, Math.round((internal2Percentage / 100) * 50))),
      percentage: 0,
      date: 'Sep 25, 2026',
    },
  ].map((item): QuizTestItem => ({
    ...item,
    percentage: Number(((item.marksObtained / item.maxMarks) * 100).toFixed(1)),
  }));

  const quizTestAvg = Number(
    (
      quizzesAndTests.reduce((acc, curr) => acc + curr.percentage, 0) / quizzesAndTests.length
    ).toFixed(2)
  );

  // Consistency score: standard deviation across subjects
  const subjectValues = subjects.map((s) => s.percentage);
  const mean = subjectValues.reduce((a, b) => a + b, 0) / subjectValues.length;
  const variance = subjectValues.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / subjectValues.length;
  const stdDev = Math.sqrt(variance);
  const subjectConsistency = Math.max(50, Math.min(95, Math.round(100 - stdDev * 2)));

  // Overall circular score: 50% internal exams + 30% quiz/test + 20% consistency
  const overallScore = Math.round(
    overallPercentage * 0.5 + quizTestAvg * 0.3 + subjectConsistency * 0.2
  );

  // Generate evidence-based academic insight (comparing student with own performance)
  const lowestSubjects = [...subjects].sort((a, b) => a.percentage - b.percentage);
  const s1 = lowestSubjects[0];
  const s2 = lowestSubjects[1];

  let insight = '';
  if (overallPercentage >= 75) {
    insight = `Overall academic performance is in the Good range at ${overallPercentage}%. Performance ${
      internal2Total > internal1Total ? 'improved' : internal2Total === internal1Total ? 'remained steady' : 'changed slightly'
    } between Internal Exam 1 (${internal1Percentage}%) and Internal Exam 2 (${internal2Percentage}%). ${
      s1.percentage < 70
        ? `${s1.subjectName} shows relatively lower scores (${s1.percentage}%) and may benefit from additional practice.`
        : `All six subjects maintain balanced performance above departmental benchmarks.`
    }`;
  } else if (overallPercentage >= 50) {
    insight = `Overall academic performance is currently in the Average range at ${overallPercentage}%. Internal exam scores changed by ${
      internal2Total - internal1Total >= 0 ? '+' : ''
    }${internal2Total - internal1Total} marks between evaluations. ${s1.subjectName} (${s1.percentage}%) and ${
      s2.subjectName
    } (${s2.percentage}%) exhibit score variance where structured tutorial problem sets may assist understanding.`;
  } else {
    insight = `Overall academic performance requires academic attention at ${overallPercentage}%. Multiple subject milestones, notably ${
      s1.subjectName
    } (${s1.percentage}%) and ${s2.subjectName} (${
      s2.percentage
    }%), reflect lower examination totals. Faculty consultation and targeted problem-solving review sessions are suggested.`;
  }

  return {
    regNo,
    subjects,
    internal1Total,
    internal1Percentage,
    internal2Total,
    internal2Percentage,
    combinedTotal,
    overallPercentage,
    performanceClassification,
    performanceTrend,
    overallScore,
    scoreBreakdown: {
      internalExams: overallPercentage,
      quizTest: quizTestAvg,
      subjectConsistency,
    },
    quizzesAndTests,
    quizTestAverage: quizTestAvg,
    academicInsight: insight,
  };
}

// Generate sequential dataset for EXACTLY 360 students: 922525106001 through 922525106360 (Requirement 1)
export const ALL_STUDENT_REG_NOS: string[] = Array.from(
  { length: 360 },
  (_, i) => `922525106${String(i + 1).padStart(3, '0')}`
);

export const INITIAL_ACADEMIC_DATA_MAP: Record<string, StudentAcademicRecord> = {};
ALL_STUDENT_REG_NOS.forEach((regNo) => {
  INITIAL_ACADEMIC_DATA_MAP[regNo] = buildStudentAcademicRecord(regNo);
});
