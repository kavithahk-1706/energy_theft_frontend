"use client";

import React, { useState, useRef, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud, FileText, Play, Target,
  X, ChevronDown, Download, Info, Loader2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const FIELD_LABELS: Record<string, string> = {
  fans_electricity:              'Fans Electricity (kW)',
  cooling_electricity:           'Cooling Electricity (kW)',
  heating_electricity:           'Heating Electricity (kW)',
  interior_lights_electricity:   'Interior Lights Electricity (kW)',
  interior_equipment_electricity:'Interior Equipment Electricity (kW)',
  gas_facility:                  'Gas Facility (kW)',
  heating_gas:                   'Heating Gas (kW)',
  interior_equipment_gas:        'Interior Equipment Gas (kW)',
  water_heater_gas:              'Water Heater Gas (kW)',
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
  const router = useRouter();

  const [mode, setMode] = useState<'BATCH' | 'SINGLE'>('BATCH');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [singleData, setSingleData] = useState<Record<string, string>>(EMPTY_FORM);
  const [selectedClass, setSelectedClass] = useState('');
  const [validClasses, setValidClasses] = useState<string[]>([]);
  const [predictionName, setPredictionName] = useState('Manual Single Audit');
  const [showCsvModal, setShowCsvModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/model/classes`)
      .then((r) => r.json())
      .then((d) => {
        setValidClasses(d.valid_classes || []);
        if (d.valid_classes?.length) setSelectedClass(d.valid_classes[0]);
      })
      .catch(() => {
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

  const runSinglePrediction = async () => {
    setIsScanning(true);
    setError(null);
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
      router.push(`/${slug}/predict/results/${data.scan_id}`);
    } catch (e: any) {
      setError(e.message);
      setIsScanning(false);
    }
  };

  const runBatchPrediction = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);
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
      router.push(`/${slug}/predict/results/${data.scan_id}`);
    } catch (e: any) {
      setError(e.message);
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

  const downloadSampleCsv = () => {
    const headers = [...NUMERICAL_FIELDS, 'class', 'area_id'].join(',');
    const example = [1.49, 0.0, 0.0, 0.275, 1.65, 7.206, 7.186, 0.0, 0.02, 'SmallOffice', 1].join(',');
    const blob = new Blob([`${headers}\n${example}\n`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_batch.csv';
    a.click();
  };

  return (
    <div className="min-h-full bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">

      {/* CSV MODAL */}
      {showCsvModal && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowCsvModal(false)}
        >
          <div
            className="bg-[#0a0a0f] border border-white/20 rounded-lg p-4 max-w-md w-full max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold tracking-wider text-[11px] text-cyan-400">CSV FORMAT GUIDE</h3>
              <button onClick={() => setShowCsvModal(false)}>
                <X size={14} className="text-white/50 hover:text-white" />
              </button>
            </div>
            <p className="text-[10px] text-white/40 mb-3 leading-relaxed">
              These columns are required (any order).{' '}
              <span className="text-cyan-400">class</span> must be one of the 16 building types.{' '}
              <span className="text-white/50">area_id</span> is optional (1–5).
            </p>
            <div className="bg-black/50 rounded p-2 mb-3">
              <table className="w-full font-mono">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left pb-1 text-[9px] text-white/50 pr-4">COLUMN</th>
                    <th className="text-left pb-1 text-[9px] text-white/50">TYPE</th>
                  </tr>
                </thead>
                <tbody>
                  {NUMERICAL_FIELDS.map((f) => (
                    <tr key={f} className="border-b border-white/5">
                      <td className="py-0.5 pr-4 text-[10px] text-cyan-400/80">{f}</td>
                      <td className="py-0.5 text-[10px] text-white/40">float</td>
                    </tr>
                  ))}
                  <tr className="border-b border-white/5">
                    <td className="py-0.5 pr-4 text-[10px] text-purple-400">class</td>
                    <td className="py-0.5 text-[10px] text-white/40">string</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-4 text-[10px] text-white/50">area_id</td>
                    <td className="py-0.5 text-[10px] text-white/50">int 1–5 (optional)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[9px] text-white/50 mb-2 tracking-wider font-bold">VALID BUILDING CLASSES</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {validClasses.map((c) => (
                <span key={c} className="text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                  {c}
                </span>
              ))}
            </div>
            <button
              onClick={downloadSampleCsv}
              className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-2 rounded transition-colors"
            >
              <Download size={12} /> DOWNLOAD SAMPLE CSV
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold font-mono mb-6">
          <Link href={`/${slug}`} className="text-white/60 hover:text-white transition-colors">{slug.toUpperCase()}</Link>
          <ChevronRight size={12} className="text-white/30" />
          <span className="text-white/30">PREDICT</span>
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

      {/* CENTERED FORM */}
      <div className="max-w-2xl mx-auto space-y-5">

        {/* AUDIT NAME */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/40 tracking-wider">AUDIT NAME</label>
          <input
            type="text"
            value={predictionName}
            onChange={(e) => setPredictionName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* MODE TOGGLE */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => { setMode('BATCH'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold tracking-wider rounded-md transition-all ${
              mode === 'BATCH'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            BATCH UPLOAD
          </button>
          <button
            onClick={() => { setMode('SINGLE'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold tracking-wider rounded-md transition-all ${
              mode === 'SINGLE'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(123,0,255,0.2)]'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            SINGLE METER
          </button>
        </div>

        {/* INPUT CARD */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          {mode === 'BATCH' ? (
            <div className="space-y-4">
              <button
                onClick={() => setShowCsvModal(true)}
                className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-2 rounded transition-colors w-full justify-center"
              >
                <Info size={13} /> VIEW CSV FORMAT & VALID CLASSES
              </button>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  dragActive ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/20 hover:border-white/40'
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                      <FileText className="text-emerald-400" size={28} />
                    </div>
                    <div className="text-sm font-bold text-emerald-400">{file.name}</div>
                    <div className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-1"
                    >
                      <X size={12} /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <UploadCloud className="text-cyan-400" size={36} />
                    </div>
                    <div>
                      <div className="text-sm font-bold tracking-wide">DROP DATASET HERE</div>
                      <div className="text-xs text-white/40 mt-1">CSV files only</div>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/10 hover:bg-white/20 text-xs font-bold px-5 py-2 rounded transition-colors"
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
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-purple-400 tracking-wider">BUILDING CLASS</label>
                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full appearance-none bg-[#0a0a0a] border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors pr-8"
                  >
                    {validClasses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>

              {/* 3 col grid since we have full width now */}
              <div className="grid grid-cols-3 gap-3">
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
                      onChange={(e) => setSingleData((prev) => ({ ...prev, [field]: e.target.value }))}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500/50 font-mono transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 border border-red-500/30 bg-red-500/10 rounded text-xs text-red-400 font-mono">
              {error}
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={!canScan}
            className={`w-full mt-6 py-4 rounded-md font-black tracking-[0.2em] flex items-center justify-center gap-3 transition-all text-sm ${
              isScanning
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : !canScan
                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]'
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                ANALYZING — REDIRECTING TO RESULTS...
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
    </div>
  );
}