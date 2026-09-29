import React, { useMemo } from 'react';
import { 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Layers, 
  TrendingUp, 
  Info,
  Calendar,
  Database,
  ArrowRight,
  GitBranch,
  BarChart2,
  Check,
  Activity
} from 'lucide-react';
import { StudentRecord } from '../../data/demoStudents';
import { evaluateRandomForestPerformance } from '../../services/randomForestModel';

interface ModelPerformanceEvaluationProps {
  students: StudentRecord[];
}

export default function ModelPerformanceEvaluation({ students }: ModelPerformanceEvaluationProps) {
  // 1. TRAIN / TEST SPLIT (80% Train, 20% Test) & EVALUATE ON TEST SET
  const evalResult = useMemo(() => {
    return evaluateRandomForestPerformance(students);
  }, [students]);

  const {
    labeledDataAvailable,
    status,
    summary,
    metrics,
    classificationReport,
    macroAverage,
    weightedAverage,
    confusionMatrix,
    featureImportances,
    interpretation,
    responsibleAiNote,
  } = evalResult;

  const riskOrder: ('Low Risk' | 'Moderate Risk' | 'High Risk')[] = [
    'Low Risk',
    'Moderate Risk',
    'High Risk',
  ];

  return (
    <section 
      id="ai-model-performance" 
      className="rounded-2xl bg-[#091122]/95 border border-slate-800/90 p-5 sm:p-7 shadow-2xl text-left space-y-6 font-sans relative overflow-hidden"
    >
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header with Title: “AI Model Performance” */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/90 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-950/50">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
                Supervised Telemetry Verification
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                AI Model Performance
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Measures how effectively the Random Forest Classifier identifies student engagement risk across Low, Moderate, and High Risk categories using an independent 80/20 train-test partition.
          </p>
        </div>

        {/* Partition Split Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Train Split (80%): <strong className="text-white">{summary.trainSampleSize}</strong> samples</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Test Split (20%): <strong className="text-white">{summary.testSampleSize}</strong> samples</span>
          </div>
        </div>
      </div>

      {/* 9. MODEL EVALUATION STATUS CARD */}
      <div className="rounded-xl bg-[#060c18] border border-slate-800/80 p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        {/* Status Item 1: AI MODEL */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">AI MODEL</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {status.aiModelStatus}
            </span>
          </div>
          <Cpu className="w-4 h-4 text-emerald-400/60 hidden sm:block" />
        </div>

        {/* Status Item 2: Training Data */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Training Data</span>
            <span className={`text-sm font-bold mt-0.5 ${status.trainingDataStatus === 'Available' ? 'text-cyan-300' : 'text-slate-400'}`}>
              {status.trainingDataStatus}
            </span>
          </div>
          <Database className="w-4 h-4 text-cyan-400/60 hidden sm:block" />
        </div>

        {/* Status Item 3: Testing Data */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Testing Data</span>
            <span className={`text-sm font-bold mt-0.5 ${status.testingDataStatus === 'Available' ? 'text-indigo-300' : 'text-slate-400'}`}>
              {status.testingDataStatus}
            </span>
          </div>
          <Layers className="w-4 h-4 text-indigo-400/60 hidden sm:block" />
        </div>

        {/* Status Item 4: Evaluation */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Evaluation</span>
            <span className={`text-sm font-bold mt-0.5 ${status.evaluationStatus === 'Completed' ? 'text-emerald-300' : 'text-amber-400'}`}>
              {status.evaluationStatus}
            </span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-400/60 hidden sm:block" />
        </div>
      </div>

      {/* 8. PIPELINE FLOW CONNECTION BANNER */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-300">
            End-to-End Analysis Pipeline:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">CSV Data</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Preprocessing</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">Random Forest Model</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Prediction</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Risk Level</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Explainable Factors</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">Alerts</span>
        </div>
      </div>

      {labeledDataAvailable ? (
        <>
          {/* 2. CALCULATE ACTUAL METRICS: 4 Clean Performance Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
            {/* Accuracy */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#0c1629] to-[#070e1c] border border-slate-800/90 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold tracking-wider">
                Accuracy
              </span>
              <div className="text-3xl font-black text-white mt-1 tracking-tight">
                {metrics.accuracy}%
              </div>
              <span className="text-[10px] text-cyan-400 font-sans block mt-1">
                {confusionMatrix.correctCount} of {confusionMatrix.totalSamples} test samples correct
              </span>
            </div>

            {/* Precision */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#0c1629] to-[#070e1c] border border-slate-800/90 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold tracking-wider">
                Precision
              </span>
              <div className="text-3xl font-black text-cyan-300 mt-1 tracking-tight">
                {metrics.macroPrecision}%
              </div>
              <span className="text-[10px] text-slate-400 font-sans block mt-1">
                Macro Average (Test Split)
              </span>
            </div>

            {/* Recall */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#0c1629] to-[#070e1c] border border-slate-800/90 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold tracking-wider">
                Recall
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1 tracking-tight">
                {metrics.macroRecall}%
              </div>
              <span className="text-[10px] text-slate-400 font-sans block mt-1">
                Macro Average (Test Split)
              </span>
            </div>

            {/* F1 Score */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#0c1629] to-[#070e1c] border border-slate-800/90 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold tracking-wider">
                F1 Score
              </span>
              <div className="text-3xl font-black text-indigo-300 mt-1 tracking-tight">
                {metrics.macroF1Score}%
              </div>
              <span className="text-[10px] text-slate-400 font-sans block mt-1">
                Harmonic Mean (Precision & Recall)
              </span>
            </div>
          </div>

          {/* 3. CONFUSION MATRIX & 4. CLASSIFICATION REPORT GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* 3. CONFUSION MATRIX (Actual vs Predicted) */}
            <div className="xl:col-span-7 p-4 sm:p-5 rounded-xl bg-[#060c18] border border-slate-800/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400" />
                    Confusion Matrix (Actual vs Predicted)
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Heatmap matrix computed on hold-out test set (N = {confusionMatrix.totalSamples})
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-400/60" />
                    Correct (Diagonal)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800" />
                    Off-diagonal
                  </span>
                </div>
              </div>

              {/* Confusion Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3 text-left font-semibold">Actual \ Predicted</th>
                      <th className="py-2.5 px-3 text-center font-semibold text-emerald-400">Pred Low</th>
                      <th className="py-2.5 px-3 text-center font-semibold text-amber-400">Pred Moderate</th>
                      <th className="py-2.5 px-3 text-center font-semibold text-rose-400">Pred High</th>
                      <th className="py-2.5 px-3 text-right font-semibold text-slate-300">Total Actual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {riskOrder.map((actualRow) => {
                      const rowTotal = confusionMatrix.rowTotals[actualRow] || 0;
                      return (
                        <tr key={actualRow} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-3 px-3 text-left font-bold text-slate-200">
                            <span className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${
                                actualRow === 'Low Risk' ? 'bg-emerald-400' :
                                actualRow === 'Moderate Risk' ? 'bg-amber-400' : 'bg-rose-400'
                              }`} />
                              Actual {actualRow.replace(' Risk', '')}
                            </span>
                          </td>

                          {riskOrder.map((predCol) => {
                            const count = confusionMatrix.matrix[actualRow][predCol] || 0;
                            const isCorrect = actualRow === predCol;
                            const pctOfRow = rowTotal > 0 ? ((count / rowTotal) * 100).toFixed(0) : '0';

                            // Heatmap color logic
                            let cellBg = 'bg-slate-950/40 text-slate-400';
                            let cellBorder = 'border-slate-800/40';

                            if (isCorrect && count > 0) {
                              if (actualRow === 'Low Risk') {
                                cellBg = 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40';
                              } else if (actualRow === 'Moderate Risk') {
                                cellBg = 'bg-amber-950/50 text-amber-300 border-amber-500/40';
                              } else {
                                cellBg = 'bg-rose-950/50 text-rose-300 border-rose-500/40';
                              }
                            } else if (count > 0) {
                              cellBg = 'bg-slate-900/80 text-amber-300/80 border-slate-700/50';
                            }

                            return (
                              <td key={predCol} className="py-2.5 px-3 text-center">
                                <div className={`py-1.5 px-2 rounded-lg border ${cellBg} ${cellBorder} flex flex-col items-center justify-center`}>
                                  <span className="font-bold text-sm leading-tight flex items-center gap-1">
                                    {count}
                                    {isCorrect && count > 0 && (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    )}
                                  </span>
                                  <span className="text-[9px] opacity-75 mt-0.5">
                                    {pctOfRow}%
                                  </span>
                                </div>
                              </td>
                            );
                          })}

                          <td className="py-3 px-3 text-right font-bold text-slate-300">
                            {rowTotal}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Column Totals Row */}
                    <tr className="bg-slate-950/80 font-bold border-t border-slate-700 text-slate-300">
                      <td className="py-2.5 px-3 text-left">Total Predicted</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400">
                        {confusionMatrix.colTotals['Low Risk']}
                      </td>
                      <td className="py-2.5 px-3 text-center text-amber-400">
                        {confusionMatrix.colTotals['Moderate Risk']}
                      </td>
                      <td className="py-2.5 px-3 text-center text-rose-400">
                        {confusionMatrix.colTotals['High Risk']}
                      </td>
                      <td className="py-2.5 px-3 text-right text-cyan-300">
                        {confusionMatrix.totalSamples}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Confusion Matrix Interpretation note */}
              <div className="text-[11px] text-slate-400 font-sans bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Reading the Heatmap:</strong> Rows represent actual student risk categories confirmed in ground truth. Columns represent the Random Forest's test predictions. Diagonal cells indicate correct classifications.
                </span>
              </div>
            </div>

            {/* 4. CLASSIFICATION REPORT TABLE */}
            <div className="xl:col-span-5 p-4 sm:p-5 rounded-xl bg-[#060c18] border border-slate-800/90 space-y-4 flex flex-col justify-between">
              <div>
                <div className="pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Classification Report
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Per-class Precision, Recall, F1 Score, and Support
                  </p>
                </div>

                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-left">
                        <th className="py-2 px-2">Risk Level</th>
                        <th className="py-2 px-2 text-right">Precision</th>
                        <th className="py-2 px-2 text-right">Recall</th>
                        <th className="py-2 px-2 text-right">F1 Score</th>
                        <th className="py-2 px-2 text-right">Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {classificationReport.map((row) => (
                        <tr key={row.riskLevel} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-2.5 px-2 font-semibold text-slate-200">
                            <span className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${
                                row.riskLevel === 'Low Risk' ? 'bg-emerald-400' :
                                row.riskLevel === 'Moderate Risk' ? 'bg-amber-400' : 'bg-rose-400'
                              }`} />
                              {row.riskLevel}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right text-cyan-300 font-semibold">
                            {row.precision}%
                          </td>
                          <td className="py-2.5 px-2 text-right text-emerald-400 font-semibold">
                            {row.recall}%
                          </td>
                          <td className="py-2.5 px-2 text-right text-indigo-300 font-semibold">
                            {row.f1Score}%
                          </td>
                          <td className="py-2.5 px-2 text-right text-slate-300">
                            {row.support}
                          </td>
                        </tr>
                      ))}

                      {/* Macro Average Row */}
                      <tr className="bg-slate-900/50 font-bold border-t border-slate-700 text-slate-300">
                        <td className="py-2.5 px-2">Macro Avg</td>
                        <td className="py-2.5 px-2 text-right text-cyan-300">{macroAverage.precision}%</td>
                        <td className="py-2.5 px-2 text-right text-emerald-400">{macroAverage.recall}%</td>
                        <td className="py-2.5 px-2 text-right text-indigo-300">{macroAverage.f1Score}%</td>
                        <td className="py-2.5 px-2 text-right">{macroAverage.totalSupport}</td>
                      </tr>

                      {/* Weighted Average Row */}
                      <tr className="bg-slate-950/70 font-bold text-slate-400 text-[11px]">
                        <td className="py-2 px-2">Weighted Avg</td>
                        <td className="py-2 px-2 text-right text-cyan-300">{weightedAverage.precision}%</td>
                        <td className="py-2 px-2 text-right text-emerald-400">{weightedAverage.recall}%</td>
                        <td className="py-2 px-2 text-right text-indigo-300">{weightedAverage.f1Score}%</td>
                        <td className="py-2 px-2 text-right">{weightedAverage.totalSupport}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 7. MODEL PERFORMANCE INTERPRETATION */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 font-sans space-y-1 mt-3">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase text-[10px] font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Model Performance Interpretation</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {interpretation}
                </p>
              </div>
            </div>
          </div>

          {/* 5. MODEL SUMMARY & 6. KEY RISK FEATURES (Feature Importance) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 5. MODEL SUMMARY CARD */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#060c18] border border-slate-800/90 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Model Summary
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  Ensemble Classifier
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Model:</span>
                  <span className="text-white font-bold">{summary.modelName}</span>
                </div>

                <div className="py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-sans block mb-1.5">Features used:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {summary.featuresUsed.map((feat) => (
                      <span 
                        key={feat}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px]"
                      >
                        • {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Training samples:</span>
                  <span className="text-cyan-300 font-bold">{summary.trainSampleSize} (80% partition)</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Testing samples:</span>
                  <span className="text-indigo-300 font-bold">{summary.testSampleSize} (20% partition)</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-sans">Last model evaluation:</span>
                  <span className="text-slate-300 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {summary.evaluationTimestamp}
                  </span>
                </div>
              </div>
            </div>

            {/* 6. KEY RISK FEATURES (Random Forest ML Feature Importance) */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#060c18] border border-slate-800/90 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Key Risk Features
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                    Random Forest ML Feature Importance (Mean Decrease in Impurity)
                  </p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  Sum = 100%
                </span>
              </div>

              <div className="space-y-3 font-mono">
                {featureImportances.map((item) => (
                  <div key={item.feature} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-sans flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {item.feature}
                      </span>
                      <span className="text-cyan-300 font-bold">{item.importance}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.importance * 2.8)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 font-sans pt-1">
                <span className="text-cyan-400 font-semibold font-mono">Note:</span> Actual ML feature importance derived from 25 decision trees. Attendance and Assignment Completion exhibit the strongest predictive weight in flagging early disengagement trajectory shifts.
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Fallback when labeled dataset is not available */
        <div className="p-8 sm:p-12 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">
            Model evaluation requires labeled data
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto font-sans leading-relaxed">
            Evaluation metrics, 3x3 confusion matrix, and classification report require confirmed historical risk labels to calculate genuine performance metrics without fabrication.
          </p>
        </div>
      )}

      {/* 10. RESPONSIBLE AI NOTE */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3 font-sans">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-slate-300 font-semibold">Responsible AI Note:</strong> {responsibleAiNote}
        </span>
      </div>
    </section>
  );
}
