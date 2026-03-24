"use client";

import React, { useState, useRef, use, useEffect } from 'react';
import {
  UploadCloud, FileText, Play, Target, Activity,
  ShieldAlert, CheckCircle, AlertTriangle, X, Database,
  ChevronDown, Download, Info
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const FIELD_LABELS: Record<string, string> = {
  fans_electricity: 'Fans Electricity (kW)',
  cooling_electricity: 'Cooling Electricity (kW)',
  heating_electricity: 'Heating Electricity (kW)',
  interior_lights_electricity: 'Interior Lights Electricity (kW)',
  interior_equipment_electricity: 'Interior Equipment Electricity (kW)',
  gas_facility: 'Gas Facility (kW)',
  heating_gas: 'Heating Gas (kW)',
  interior_equipment_gas: 'Interior Equipment Gas (kW)',
  water_heater_gas: 'Water Heater Gas (kW)',
};

const NUMERICAL_FIELDS = Object.keys(FIELD_LABELS);

const EMPTY_FORM: Record<string, string> = Object.fromEntries(
  NUMERICAL_FIELDS.map((f) => [f, ''])
);

export default function PredictWorkbench({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug: slug } = use(params);

  const [mode, setMode] = useState<'BATCH' | 'SINGLE'>('BATCH');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // single prediction form state
  const [singleData, setSingleData] = useState<Record<string, string>>(EMPTY_FORM);
  const [selectedClass, setSelectedClass] = useState('');
  const [validClasses, setValidClasses] = useState<string[]>([]);
  const [predictionName, setPredictionName] = useState('Manual Single Audit');

  // CSV format modal
  const [showCsvModal, setShowCsvModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // fetch valid building classes on mount
  useEffect(() => {
    fetch(`${API_URL}/model/classes`)
      .then((r) => r.json())
      .then((d) => {
        setValidClasses(d.valid_classes || []);
        if (d.valid_classes?.length) setSelectedClass(d.valid_classes[0]);
      })
      .catch(() => {
        // fallback hardcoded if backend isn't up
        const fallback = [
          'FullServiceRestaurant','Hospital','LargeHotel','LargeOffice',
          'MediumOffice','MidriseApartment','OutPatient','PrimarySchool',
          'QuickServiceRestaurant','SecondarySchool','SmallHotel','SmallOffice',
          'Stand-aloneRetail','StripMall','SuperMarket','Warehouse',
        ];
        setValidClasses(fallback);
        setSelectedClass(fallback[0]);
      });
  }, []);

  // drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  // single prediction submit
  const runSinglePrediction = async () => {
    setIsScanning(true);
    setError(null);
    setResults(null);
    try {
      const payload = {
        tenant_slug: slug || 'demo-utility',
        prediction_name: predictionName,
        data: {
          ...Object.fromEntries(
            NUMERICAL_FIELDS.map((f) => [f, parseFloat(singleData[f]) || 0])
          ),
          class: selectedClass,
        },
      };

      const res = await fetch(`${API_URL}/predict/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Prediction failed');
      }

      const data = await res.json();
      setResults({ mode: 'SINGLE', ...data });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsScanning(false);
    }
  };

  // batch prediction submit
  const runBatchPrediction = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);
    setResults(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tenant_slug', slug || 'demo-utility');
      formData.append('prediction_name', predictionName);

      const res = await fetch(`${API_URL}/predict/batch`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Batch prediction failed');
      }

      const data = await res.json();
      setResults({ mode: 'BATCH', ...data });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = () => {
    if (mode === 'BATCH') runBatchPrediction();
    else runSinglePrediction();
  };

  const canScan =
    !isScanning &&
    (mode === 'SINGLE'
      ? NUMERICAL_FIELDS.every((f) => singleData[f] !== '') && selectedClass
      : !!file);

  // download sample CSV
  const downloadSampleCsv = () => {
    const headers = [...NUMERICAL_FIELDS, 'class', 'area_id'].join(',');
    const example = [
      1.49, 0.0, 0.0, 0.275, 1.65, 7.206, 7.186, 0.0, 0.02, 'SmallOffice', 1,
    ].join(',');
    const blob = new Blob([`${headers}\n${example}\n`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_batch.csv';
    a.click();
  };

  return (
    <div className="min-h-full bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">

      {/* CSV FORMAT MODAL */}
      {showCsvModal && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCsvModal(false)}
        >
          <div
            className="bg-[#0a0a0f] border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold tracking-wider text-sm text-cyan-400">CSV FORMAT GUIDE</h3>
              <button onClick={() => setShowCsvModal(false)}>
                <X size={18} className="text-white/50 hover:text-white" />
              </button>
            </div>
            <p className="text-xs text-white/50 mb-4 tracking-wide">
              Your CSV must have exactly these columns (in any order). The{' '}
              <span className="text-cyan-400">class</span> column must be one of the 16 valid building types.{' '}
              <span className="text-cyan-400">area_id</span> is optional (1–5).
            </p>
            <div className="overflow-x-auto bg-black/50 rounded p-3 mb-4">
              <table className="text-xs w-full font-mono">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left pb-2 text-white/50 pr-6">Column</th>
                    <th className="text-left pb-2 text-white/50">Type</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {NUMERICAL_FIELDS.map((f) => (
                    <tr key={f} className="border-b border-white/5">
                      <td className="py-1 pr-6 text-cyan-400/80">{f}</td>
                      <td className="py-1">float</td>
                    </tr>
                  ))}
                  <tr className="border-b border-white/5">
                    <td className="py-1 pr-6 text-purple-400">class</td>
                    <td className="py-1">string — see valid values below</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-6 text-white/40">area_id</td>
                    <td className="py-1 text-white/40">integer 1–5 (optional)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mb-4">
              <p className="text-[10px] text-white/40 mb-2 tracking-wider font-bold">VALID BUILDING CLASSES</p>
              <div className="flex flex-wrap gap-2">
                {validClasses.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-1 rounded"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={downloadSampleCsv}
              className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded transition-colors"
            >
              <Download size={14} /> DOWNLOAD SAMPLE CSV
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="text-cyan-400 text-xs font-bold tracking-[0.2em] mb-2 uppercase">
          {slug} // Operations // Analytics
        </div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Target className="text-purple-500" size={32} />
          PREDICTION <span className="text-white/40">WORKBENCH</span>
        </h1>
        <p className="text-white/50 text-sm mt-2 max-w-2xl">
          Upload raw grid telemetry or input single meter readings. The Sudarshan Random
          Forest engine will isolate structural anomalies and flag high-probability theft cases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-5">

          {/* PREDICTION NAME */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/40 tracking-wider">AUDIT NAME</label>
            <input
              type="text"
              value={predictionName}
              onChange={(e) => setPredictionName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* TOGGLE */}
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => { setMode('BATCH'); setResults(null); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-md transition-all ${
                mode === 'BATCH'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              BATCH UPLOAD
            </button>
            <button
              onClick={() => { setMode('SINGLE'); setResults(null); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-md transition-all ${
                mode === 'SINGLE'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(123,0,255,0.2)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              SINGLE METER
            </button>
          </div>

          {/* INPUT AREA */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-5 relative overflow-hidden">
            {mode === 'BATCH' ? (
              <div className="space-y-3">
                {/* info button */}
                <button
                  onClick={() => setShowCsvModal(true)}
                  className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-2 rounded transition-colors w-full justify-center"
                >
                  <Info size={13} /> VIEW CSV FORMAT & VALID CLASSES
                </button>

                {/* drop zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                        <FileText className="text-emerald-400" size={24} />
                      </div>
                      <div className="text-sm font-bold text-emerald-400">{file.name}</div>
                      <div className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <X size={12} /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <UploadCloud className="text-cyan-400" size={32} />
                      </div>
                      <div>
                        <div className="text-sm font-bold tracking-wide">DROP DATASET HERE</div>
                        <div className="text-xs text-white/40 mt-1">CSV files only</div>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/10 hover:bg-white/20 text-xs font-bold px-4 py-2 rounded transition-colors"
                      >
                        BROWSE FILES
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* SINGLE PREDICTION FORM */
              <div className="space-y-3">
                {/* class dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-purple-400 tracking-wider">
                    BUILDING CLASS
                  </label>
                  <div className="relative">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full appearance-none bg-[#0a0a0a] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors pr-8"
                    >
                      {validClasses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  </div>
                </div>

                {/* numerical fields */}
                <div className="grid grid-cols-2 gap-2">
                  {NUMERICAL_FIELDS.map((field) => (
                    <div key={field} className="space-y-1">
                      <label className="text-[9px] font-bold text-white/40 tracking-wide uppercase leading-tight block">
                        {FIELD_LABELS[field]}
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="0.000"
                        value={singleData[field]}
                        onChange={(e) =>
                          setSingleData((prev) => ({ ...prev, [field]: e.target.value }))
                        }
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500/50 font-mono transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* error */}
            {error && (
              <div className="mt-4 p-3 border border-red-500/30 bg-red-500/10 rounded text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            {/* SCAN BUTTON */}
            <button
              onClick={handleScan}
              disabled={!canScan}
              className={`w-full mt-5 py-4 rounded-md font-black tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                isScanning
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : !canScan
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]'
              }`}
            >
              {isScanning ? (
                <>
                  <Activity className="animate-pulse" size={18} />
                  ANALYZING...
                </>
              ) : (
                <>
                  <Play size={18} />
                  INITIALIZE SCAN
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - RESULTS */}
        <div className="lg:col-span-2">
          {isScanning ? (
            <div className="h-full min-h-[400px] bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-dashed border-cyan-500/30 rounded-full animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-4 border-2 border-purple-500/40 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                <Target size={40} className="text-cyan-400 animate-pulse" />
              </div>
              <div className="mt-8 text-center space-y-2">
                <div className="text-cyan-400 font-bold tracking-[0.3em] animate-pulse">
                  EXECUTING RANDOM FOREST
                </div>
                <div className="text-xs text-white/40 font-mono">
                  Passing vectors through decision nodes...
                </div>
              </div>
            </div>

          ) : results ? (
            /* ---- RESULTS ---- */
            results.mode === 'SINGLE' ? (
              <SingleResult result={results} />
            ) : (
              <BatchResult result={results} />
            )

          ) : (
            <div className="h-full min-h-[400px] bg-black/20 border border-white/5 rounded-lg flex flex-col items-center justify-center text-center p-8">
              <Database className="text-white/10 mb-4" size={48} />
              <h3 className="text-white/30 font-bold tracking-widest mb-2">AWAITING TELEMETRY DATA</h3>
              <p className="text-white/20 text-xs max-w-sm leading-relaxed">
                Connect your dataset or input manual features on the left to initialize
                the Random Forest classification engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- SINGLE RESULT COMPONENT ---- */
function SingleResult({ result }: { result: any }) {
  const d = result.data;
  const isTheft = d.prediction === 1;

  return (
    <div
      className={`bg-white/5 border rounded-lg p-6 relative overflow-hidden ${
        isTheft ? 'border-red-500/30' : 'border-emerald-500/30'
      }`}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        {isTheft ? (
          <ShieldAlert className="text-red-400" size={28} />
        ) : (
          <CheckCircle className="text-emerald-400" size={28} />
        )}
        <div>
          <h2
            className={`text-xl font-black tracking-wide ${
              isTheft ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {isTheft ? 'THEFT DETECTED' : 'NORMAL CONSUMPTION'}
          </h2>
          <p className="text-xs text-white/50 font-mono">
            Scan ID: {result.scan_id} · Execution: {result.execution_time}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-black/50 border border-white/5 p-4 rounded text-center">
          <div className="text-[10px] text-white/40 font-bold tracking-widest mb-1">PREDICTION</div>
          <div
            className={`text-2xl font-black ${isTheft ? 'text-red-400' : 'text-emerald-400'}`}
          >
            {d.prediction_label}
          </div>
        </div>
        <div className="bg-black/50 border border-white/5 p-4 rounded text-center">
          <div className="text-[10px] text-white/40 font-bold tracking-widest mb-1">CONFIDENCE</div>
          <div className="text-2xl font-black text-cyan-400">
            {(d.confidence * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-black/50 border border-white/5 p-4 rounded text-center">
          <div className="text-[10px] text-white/40 font-bold tracking-widest mb-1">MODEL</div>
          <div className="text-sm font-black text-white/70">Random Forest</div>
          <div className="text-xs text-white/30 mt-1">99.61% acc.</div>
        </div>
      </div>

      {/* probability bars */}
      <div className="space-y-3">
        <div className="text-[10px] font-bold text-white/40 tracking-wider mb-2">
          CLASS PROBABILITIES
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-emerald-400">Normal</span>
            <span className="text-white/50 font-mono">
              {(d.probabilities.normal * 100).toFixed(2)}%
            </span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded transition-all"
              style={{ width: `${d.probabilities.normal * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-400">Theft</span>
            <span className="text-white/50 font-mono">
              {(d.probabilities.theft * 100).toFixed(2)}%
            </span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
            <div
              className="h-full bg-red-400 rounded transition-all"
              style={{ width: `${d.probabilities.theft * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- BATCH RESULT COMPONENT ---- */
function BatchResult({ result }: { result: any }) {
  const stats = result.group_stats;
  const hasFullRecords = result.has_full_records;
  const allPredictions: any[] = result.all_predictions || [];
  const theftPredictions: any[] = result.theft_predictions || [];
  const areaBreakdown: Record<string, any> = result.area_breakdown || {};
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);

  const displayRecords = hasFullRecords ? allPredictions : theftPredictions;

  return (
    <div className="space-y-4">
      {/* warning banner */}
      {result.warning && (
        <div className="p-3 border border-amber-500/30 bg-amber-500/10 rounded text-xs text-amber-400 flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {result.warning}
        </div>
      )}

      {!hasFullRecords && (
        <div className="p-3 border border-white/10 bg-white/5 rounded text-xs text-white/50 flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          Batch exceeded {stats.total_analyzed} records — showing theft predictions only.
          Full drill-down available for batches under 500 rows.
        </div>
      )}

      {/* group stats */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          <CheckCircle className="text-emerald-400" size={20} />
          <div>
            <h2 className="font-black text-emerald-400 tracking-wide">SCAN COMPLETE</h2>
            <p className="text-xs text-white/40 font-mono">
              {result.scan_id} · {result.execution_time}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'TOTAL ANALYZED', val: stats.total_analyzed, color: 'text-white' },
            { label: 'THEFT DETECTED', val: stats.theft_detected, color: 'text-red-400' },
            { label: 'NORMAL', val: stats.normal_count, color: 'text-emerald-400' },
            { label: 'COMPROMISE RATE', val: stats.compromise_rate, color: 'text-amber-400' },
          ].map((s) => (
            <div key={s.label} className="bg-black/50 border border-white/5 p-3 rounded text-center">
              <div className="text-[9px] text-white/40 font-bold tracking-widest mb-1">{s.label}</div>
              <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* area breakdown */}
        {Object.keys(areaBreakdown).length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-[10px] font-bold text-white/40 tracking-wider mb-3">
              AREA BREAKDOWN
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(areaBreakdown).map(([areaId, data]: [string, any]) => {
                const rate = data.total > 0 ? ((data.theft / data.total) * 100).toFixed(1) : '0';
                return (
                  <div key={areaId} className="bg-black/40 border border-white/5 p-3 rounded">
                    <div className="text-[10px] text-purple-400 font-bold tracking-wider mb-1">
                      AREA {areaId}
                    </div>
                    <div className="text-xs text-white/60 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span className="font-mono">{data.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Theft</span>
                        <span className="font-mono text-red-400">{data.theft}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate</span>
                        <span className={`font-mono ${parseFloat(rate) > 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* individual records table */}
      {displayRecords.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-xs font-bold text-white/60 tracking-wider">
              {hasFullRecords ? 'ALL PREDICTIONS' : 'THEFT PREDICTIONS'}
              <span className="ml-2 text-white/30">({displayRecords.length} records)</span>
            </div>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[#0a0a0f]">
                <tr className="text-[9px] font-bold text-white/30 tracking-wider">
                  <th className="p-3">#</th>
                  <th className="p-3">RESULT</th>
                  <th className="p-3">CONFIDENCE</th>
                  <th className="p-3">AREA</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {displayRecords.map((rec: any) => {
                  const isTheft = rec.prediction === 1;
                  const isExpanded = expandedRecord === rec.record_index;
                  return (
                    <React.Fragment key={rec.record_index}>
                      <tr
                        className={`border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-white/5' : ''
                        }`}
                        onClick={() =>
                          setExpandedRecord(isExpanded ? null : rec.record_index)
                        }
                      >
                        <td className="p-3 font-mono text-xs text-white/40">{rec.record_index}</td>
                        <td className="p-3">
                          <span
                            className={`text-xs font-bold ${
                              isTheft ? 'text-red-400' : 'text-emerald-400'
                            }`}
                          >
                            {rec.prediction_label}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-xs text-white/60">
                          {(rec.confidence * 100).toFixed(1)}%
                        </td>
                        <td className="p-3 text-xs text-purple-400/70">
                          {rec.area_id ?? '—'}
                        </td>
                        <td className="p-3 text-xs text-white/30">
                          {isExpanded ? '▲' : '▼'}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-t border-white/5 bg-black/30">
                          <td colSpan={5} className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                              <div className="col-span-full text-[9px] font-bold text-white/30 tracking-wider mb-1">
                                PROBABILITY BREAKDOWN
                              </div>
                              {[
                                { label: 'Normal', val: rec.probabilities.normal, color: 'bg-emerald-400' },
                                { label: 'Theft', val: rec.probabilities.theft, color: 'bg-red-400' },
                              ].map((p) => (
                                <div key={p.label}>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white/50">{p.label}</span>
                                    <span className="font-mono text-white/50">
                                      {(p.val * 100).toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
                                    <div
                                      className={`h-full ${p.color} rounded`}
                                      style={{ width: `${p.val * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="text-[9px] font-bold text-white/30 tracking-wider mb-2">
                              INPUT FEATURES
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                              {Object.entries(rec.features).map(([k, v]: [string, any]) => (
                                <div key={k} className="flex justify-between text-[10px] bg-black/30 rounded px-2 py-1">
                                  <span className="text-white/40 truncate mr-2">{k}</span>
                                  <span className="font-mono text-white/70 shrink-0">{typeof v === 'number' ? v.toFixed(4) : v}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}