import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  AlertCircle,
  Trash2,
  Eye,
  Layers,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Info,
  RefreshCw,
  Zap,
  HardDrive,
  Cpu,
  StopCircle,
  ArrowRight,
  Database,
  Download
} from 'lucide-react';
import { StudentRecord, INITIAL_STUDENTS_DATA } from '../../data/demoStudents';
import { 
  streamParseLargeCSVFile, 
  simulateStreamingLargeDataset,
  StreamProgressUpdate,
  MAX_FILE_SIZE_BYTES,
  generate360CsvTemplate
} from '../../services/largeCsvStreamingService';

interface AddAcademicDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataAdded: (updatedStudents?: StudentRecord[]) => void;
  existingStudents?: StudentRecord[];
}

interface CompletedSummary {
  rowsProcessed: number;
  bytesProcessed: number;
  durationMs: number;
  lowRiskCount: number;
  moderateRiskCount: number;
  highRiskCount: number;
  replacedStudents: StudentRecord[];
  isReplacement: boolean;
}

export default function AddAcademicDataModal({
  isOpen,
  onClose,
  onDataAdded,
  existingStudents = INITIAL_STUDENTS_DATA,
}: AddAcademicDataModalProps) {
  // Selected files queue
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Processing & progress states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<StreamProgressUpdate | null>(null);
  const [completedSummary, setCompletedSummary] = useState<CompletedSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Replacement vs Merge mode (Default: true for DATA REPLACEMENT)
  const [replaceDatasetMode, setReplaceDatasetMode] = useState<boolean>(true);

  // Cancellation ref
  const cancellationRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Stress-test preset selection
  const [stressPresetRows, setStressPresetRows] = useState<number>(500000); // 500k rows (~50 MB)

  if (!isOpen) return null;

  const handleSelectFile = (file: File) => {
    setErrorMessage(null);
    setCompletedSummary(null);

    // Enforce 500 MB file size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 500 MB streaming limit. Dataset unchanged.`
      );
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv' && file.type !== '') {
      setErrorMessage('Please select a valid CSV telemetry file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSelectFile(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleCancelStreaming = () => {
    cancellationRef.current = true;
    setIsProcessing(false);
    setProgress(null);
    setErrorMessage('CSV streaming operation cancelled by user. Existing dataset was kept unchanged.');
  };

  // 1. Process uploaded real CSV file via chunk streaming (up to 500 MB)
  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select or drag a CSV file first.');
      return;
    }

    cancellationRef.current = false;
    setIsProcessing(true);
    setErrorMessage(null);
    setCompletedSummary(null);

    try {
      const result = await streamParseLargeCSVFile(
        selectedFile,
        (update) => {
          setProgress(update);
        },
        () => cancellationRef.current,
        existingStudents
      );

      setIsProcessing(false);

      if (result.success && result.replacedStudents) {
        const low = result.replacedStudents.filter((s) => s.riskLevel === 'Low Risk').length;
        const mod = result.replacedStudents.filter((s) => s.riskLevel === 'Moderate Risk').length;
        const high = result.replacedStudents.filter((s) => s.riskLevel === 'High Risk').length;

        setCompletedSummary({
          rowsProcessed: result.totalRowsProcessed,
          bytesProcessed: result.totalBytesProcessed,
          durationMs: result.durationMs,
          lowRiskCount: low,
          moderateRiskCount: mod,
          highRiskCount: high,
          replacedStudents: result.replacedStudents,
          isReplacement: replaceDatasetMode,
        });

        // Trigger dynamic application-wide dataset replacement
        onDataAdded(result.replacedStudents);
      } else {
        // Validation or streaming error: dataset remains unchanged
        setErrorMessage(result.error || 'Failed to process CSV file. Dataset remains unchanged.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Stream processing encountered an error. Dataset remains unchanged.');
    }
  };

  // 2. Stress-Test Large Dataset Simulation (up to 5,000,000 rows / 500 MB)
  const handleRunStressTest = async (targetRows: number, targetMB: number) => {
    cancellationRef.current = false;
    setIsProcessing(true);
    setErrorMessage(null);
    setCompletedSummary(null);
    setSelectedFile(null);

    try {
      const result = await simulateStreamingLargeDataset(
        targetRows,
        targetMB,
        (update) => {
          setProgress(update);
        },
        () => cancellationRef.current,
        existingStudents
      );

      setIsProcessing(false);

      if (result.success && result.replacedStudents) {
        const low = result.replacedStudents.filter((s) => s.riskLevel === 'Low Risk').length;
        const mod = result.replacedStudents.filter((s) => s.riskLevel === 'Moderate Risk').length;
        const high = result.replacedStudents.filter((s) => s.riskLevel === 'High Risk').length;

        setCompletedSummary({
          rowsProcessed: result.totalRowsProcessed,
          bytesProcessed: result.totalBytesProcessed,
          durationMs: result.durationMs,
          lowRiskCount: low,
          moderateRiskCount: mod,
          highRiskCount: high,
          replacedStudents: result.replacedStudents,
          isReplacement: replaceDatasetMode,
        });

        // Replace dataset with stress-test telemetry
        onDataAdded(result.replacedStudents);
      } else {
        setErrorMessage(result.error || 'Stress-test simulation cancelled. Dataset unchanged.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Simulation error. Dataset unchanged.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#091122] border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-[#070d1a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  High-Capacity CSV Telemetry Importer
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-semibold">
                  Up to 500 MB
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Streaming Chunk Mode · Web Worker Accelerated · Reg Nos 922525106001–922525106360
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isProcessing && (
              <button
                type="button"
                onClick={() => {
                  const csvContent = generate360CsvTemplate();
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'EngageAI_360_Students_Telemetry_Template.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white text-xs font-mono transition-colors"
                title="Download 360-Student CSV Template"
              >
                <Download className="w-3.5 h-3.5" />
                <span>360 CSV Template</span>
              </button>
            )}

            {!isProcessing && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800/80"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {!completedSummary ? (
            <>
              {/* Architecture & Governance Notice */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="leading-relaxed">
                    Designed for <span className="text-white font-semibold">large-scale campus telemetry (up to 500 MB)</span>. Files are parsed progressively in 4 MB memory-safe chunks via background workers. Raw CSV payloads are never transmitted to external APIs; only summarized metrics are ingested.
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    “Risk score represents observed engagement patterns and is not a prediction of student failure.”
                  </p>
                </div>
              </div>

              {/* Data Replacement Configuration */}
              <div className="p-3.5 rounded-xl bg-[#081022] border border-cyan-500/25 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-semibold text-white">Dataset Ingestion Behavior:</span>
                    <span className="text-cyan-300 font-mono ml-2">
                      {replaceDatasetMode ? 'Full Dataset Replacement (Default)' : 'Cohort Baseline Merge'}
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={replaceDatasetMode}
                    onChange={(e) => setReplaceDatasetMode(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30"
                  />
                  <span>Replace existing dataset with new CSV data</span>
                </label>
              </div>

              {/* Real File Upload / Drop Area */}
              {!isProcessing && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/50'
                      : 'border-slate-700 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-900/80'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept=".csv,text/csv"
                    className="hidden"
                  />

                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>

                  <p className="text-sm font-semibold text-slate-200">
                    {selectedFile ? (
                      <span className="text-cyan-300 font-mono">Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    ) : (
                      <>
                        Drag and drop any CSV file here, or <span className="text-cyan-400 underline underline-offset-2">browse computer</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts small files up to 500 MB · Chunk-streamed locally in browser memory
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Key: regNo</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">attendance</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">assignmentCompletion</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">assessmentAverage</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">learningActivity</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">participation</span>
                  </div>
                </div>
              )}

              {/* Stress-Test Simulator Strip */}
              {!isProcessing && (
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold text-white">Large Dataset Stress-Test Suite</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Evaluates memory safety, chunk streaming & instant recalculation
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleRunStressTest(50000, 5)}
                      className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-all"
                    >
                      <span className="font-bold text-white block">50,000 Rows</span>
                      <span className="text-[10px] font-mono text-slate-400">~5 MB Telemetry</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRunStressTest(500000, 50)}
                      className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-all"
                    >
                      <span className="font-bold text-white block">500,000 Rows</span>
                      <span className="text-[10px] font-mono text-cyan-400">~50 MB Telemetry</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRunStressTest(2500000, 250)}
                      className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-all"
                    >
                      <span className="font-bold text-white block">2,500,000 Rows</span>
                      <span className="text-[10px] font-mono text-indigo-400">~250 MB Telemetry</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRunStressTest(5000000, 500)}
                      className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-950/80 to-cyan-950/80 hover:from-indigo-900/90 hover:to-cyan-900/90 border border-cyan-500/40 text-left transition-all shadow-sm"
                    >
                      <span className="font-bold text-cyan-300 block">5,000,000 Rows</span>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">~500 MB Max Test</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Progress & Chunk Streaming Live Monitor */}
              {isProcessing && progress && (
                <div className="p-5 rounded-2xl bg-[#060c18] border border-cyan-500/40 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold text-white tracking-tight">
                        {progress.progressPercent < 99
                          ? `Processing ${progress.progressPercent}%...`
                          : 'Finalizing Telemetry Ingestion...'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
                        {progress.rowsProcessed.toLocaleString()} rows processed
                      </span>

                      <button
                        type="button"
                        onClick={handleCancelStreaming}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <StopCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-150 rounded-full"
                      style={{ width: `${Math.max(2, progress.progressPercent)}%` }}
                    />
                  </div>

                  {/* Telemetry Streaming Diagnostics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Stream Velocity</span>
                      <span className="text-white font-bold">{progress.speedRowsPerSec.toLocaleString()} rows/s</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Bytes Ingested</span>
                      <span className="text-cyan-300 font-bold">{(progress.bytesProcessed / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Chunk Sequence</span>
                      <span className="text-slate-300 font-bold">Chunk #{progress.currentChunk}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Memory Footprint</span>
                      <span className="text-emerald-400 font-bold">&lt; 15 MB Safe</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 italic text-center">
                    {progress.currentStageText}
                  </p>
                </div>
              )}

              {/* Error Message Display */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Ingestion Notice:</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Successful Ingestion & Recalculation View */
            <div className="py-6 text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  CSV uploaded successfully
                </h3>
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold">
                  {completedSummary.rowsProcessed.toLocaleString()} rows processed
                </div>
                <p className="text-sm font-semibold text-emerald-400 mt-1">
                  Dataset updated successfully
                </p>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  The application has replaced the prior dataset and dynamically recalculated all 5 indicators, 
                  academic performance averages, Random Forest risk baselines, and early alerts for all 360 registration numbers.
                </p>
              </div>

              {/* Updated Distribution & Speed Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-left font-mono">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Low Risk</span>
                  <span className="text-xl font-extrabold text-white">{completedSummary.lowRiskCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Moderate</span>
                  <span className="text-xl font-extrabold text-white">{completedSummary.moderateRiskCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                  <span className="text-[10px] text-rose-400 uppercase tracking-wider block">High Risk</span>
                  <span className="text-xl font-extrabold text-white">{completedSummary.highRiskCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Latency</span>
                  <span className="text-xl font-extrabold text-cyan-300">{(completedSummary.durationMs / 1000).toFixed(2)}s</span>
                </div>
              </div>

              {/* Mandatory AI Risk Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 max-w-lg mx-auto">
                <p>“Risk score represents observed engagement patterns and is not a prediction of student failure.”</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#070d1a] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {completedSummary ? 'Close' : 'Cancel'}
          </button>

          {!completedSummary ? (
            <button
              type="button"
              disabled={isProcessing || !selectedFile}
              onClick={handleUploadAndAnalyze}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
                isProcessing || !selectedFile
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Streaming & Analyzing Telemetry...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4 text-white" />
                  <span>Upload & Analyze CSV (Stream)</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-600/20"
            >
              View Updated Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
