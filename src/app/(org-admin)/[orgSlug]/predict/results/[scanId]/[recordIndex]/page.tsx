"use client";

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, CheckCircle, ArrowLeft, AlertTriangle,
  Info, ChevronRight, Activity, Cpu, MapPin, Trees,
  Zap, Flame, Wind, Thermometer, Lightbulb, Droplets, Download, FileText, Table2, Loader2
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, Cell, Legend
} from 'recharts';
import { exportToPDF, exportSingleRecordToCSV } from '@/lib/exportUtils';
import { ConsumptionRadar, FlaggedFeaturesChart, FIELD_LABELS, AREA_MAP } from '@/components/PredictionCharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';



function DomainContextNote({ result, isTheft }: { result: any; isTheft: boolean }) {
  const hasDomain = !!result?.domain_flag;
  const hasFlags = result?.anomaly_flags?.length > 0;
  const tier = result?.domain_tier;

  const borderColor = hasDomain
    ? tier === 'impossible' ? 'border-red-500/20 bg-red-500/5'
      : tier === 'suspicious' ? 'border-amber-500/20 bg-amber-500/5'
        : 'border-cyan-500/20 bg-cyan-500/5'
    : isTheft && !hasFlags
      ? 'border-white/10 bg-white/5'
      : 'border-white/10 bg-white/5';

  const iconColor = hasDomain
    ? tier === 'impossible' ? 'text-red-400'
      : tier === 'suspicious' ? 'text-amber-400'
        : 'text-cyan-400'
    : 'text-white/40';

  const message = hasDomain
    ? result.domain_note
    : isTheft && !hasFlags
      ? "No individual feature anomalies were detected — the random forest classified this record as theft based on the combined consumption signature across all 9 features simultaneously. The overall pattern deviates from what is statistically normal for this building class."
      : isTheft && hasFlags
        ? `${result.anomaly_flags.length} feature${result.anomaly_flags.length > 1 ? 's' : ''} deviate significantly from the class baseline and likely contributed to the theft classification. See anomaly flags below for details.`
        : !isTheft && hasFlags
          ? "Statistical deviations were detected in some features, but the random forest classified this record as normal based on the overall consumption pattern. Individual deviations do not necessarily indicate theft."
          : "All features are within normal statistical range for this building class. The random forest found no theft signature in the overall consumption pattern.";

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border mb-5 ${borderColor}`}>
      <Info size={13} className={`mt-0.5 shrink-0 ${iconColor}`} />
      <div className="flex-1">
        {hasDomain && (
          <span className={`text-[9px] font-bold tracking-widest mr-2 ${iconColor}`}>
            {result.domain_flag} ·{' '}
          </span>
        )}
        <span className="text-[10px] text-white/50 leading-relaxed">{message}</span>
      </div>
    </div>
  );
}

// ─── Tree Votes ──────────────────────────────────────────────────────────────
function TreeVotesBar({ votes }: { votes: { theft: number; normal: number; total: number } }) {
  const theftPct = (votes.theft / votes.total) * 100;
  const isTheft = votes.theft > votes.normal;
  const dominantVotes = isTheft ? votes.theft : votes.normal;
  const dominantLabel = isTheft ? 'Theft' : 'Normal';
  const dominantColor = isTheft ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className="space-y-4">
      {/* big number */}
      <div className="flex items-end gap-3">
        <span className={`text-5xl font-black tabular-nums ${dominantColor}`}>
          {dominantVotes}
        </span>
        <div className="pb-1.5">
          <div className="text-white/50 text-xs font-mono">/ {votes.total} trees</div>
          <div className={`text-sm font-bold ${dominantColor}`}>voted {dominantLabel}</div>
        </div>
      </div>

      {/* bar */}
      <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden flex gap-0.5">
        <div
          className="h-full bg-red-400 rounded-l-full transition-all duration-700"
          style={{ width: `${theftPct}%` }}
        />
        <div
          className="h-full bg-emerald-400 rounded-r-full transition-all duration-700"
          style={{ width: `${100 - theftPct}%` }}
        />
      </div>

      {/* legend */}
      <div className="flex justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-red-400">{votes.theft} theft votes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400">{votes.normal} normal votes</span>
        </div>
      </div>

      <p className="text-[10px] text-white/50 leading-relaxed">
        Each of the {votes.total} decision trees in the random forest independently
        classified this record. <span className={dominantColor}>{dominantVotes} trees ({((dominantVotes / votes.total) * 100).toFixed(1)}%)</span> agreed
        on <span className={dominantColor}>{dominantLabel}</span>.
      </p>
    </div>
  );
}

// ─── Feature vs Baseline bars ─────────────────────────────────────────────────
function FeatureBaselineChart({ features, anomalyFlags }: { features: Record<string, any>; anomalyFlags: any[] }) {
  const flagMap: Record<string, any> = {};
  anomalyFlags.forEach((f) => { flagMap[f.feature] = f; });

  const numerical = Object.entries(features).filter(([k]) => k !== 'class');

  return (
    <div className="space-y-4">
      {numerical.map(([key, val]) => {
        const num = parseFloat(val) || 0;
        const flag = flagMap[key];
        const meta = FIELD_LABELS[key];
        const isFlagged = !!flag;

        // compute bar widths
        // if flagged, we show value vs mean side by side
        // otherwise just the value bar relative to max across all features
        const allVals = numerical.map(([, v]) => parseFloat(v) || 0);
        const maxVal = Math.max(...allVals, flag?.mean || 0, 1);

        const valuePct = Math.min((num / maxVal) * 100, 100);
        const meanPct = flag ? Math.min((flag.mean / maxVal) * 100, 100) : 0;

        const barColor = isFlagged
          ? Math.abs(flag.z_score) > 5 ? 'bg-red-400' : 'bg-amber-400'
          : 'bg-cyan-400/50';

        return (
          <div key={key} className={`rounded-lg p-3 ${isFlagged ? 'bg-white/5 border border-amber-500/20' : ''}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className={isFlagged ? 'text-amber-400' : 'text-white/40'}>
                  {meta?.icon}
                </span>
                <span className={isFlagged ? 'text-white/80 font-bold' : 'text-white/50'}>
                  {meta?.label || key}
                </span>
                {isFlagged && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${Math.abs(flag.z_score) > 5
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400'
                    }`}>
                    z={flag.z_score > 0 ? '+' : ''}{flag.z_score}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-white/60">{num.toFixed(4)} kW</span>
            </div>

            {/* value bar */}
            <div className="space-y-1">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${valuePct}%` }}
                />
              </div>

              {/* baseline comparison if flagged */}
              {isFlagged && (
                <>
                  <div className="flex justify-between text-[9px] text-white/50 font-mono">
                    <span>this record</span>
                    <span>{num.toFixed(4)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/20 rounded-full"
                      style={{ width: `${meanPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-white/50 font-mono">
                    <span>class mean ± {flag.std.toFixed(4)}</span>
                    <span>{flag.mean.toFixed(4)}</span>
                  </div>
                  <p className="text-[9px] text-white/40 mt-1">
                    {flag.direction === 'above'
                      ? `↑ ${Math.abs(flag.z_score)}σ above what's normal for this building class`
                      : `↓ ${Math.abs(flag.z_score)}σ below what's normal for this building class`}
                  </p>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Anomaly Flags Summary ────────────────────────────────────────────────────
function AnomalyFlagsSummary({ flags, isTheft }: { flags: any[]; isTheft: boolean }) {
  if (flags.length === 0) {
    return (
      <div className="p-4 border border-white/10 bg-white/5 rounded-lg flex items-start gap-3">
        <Info size={14} className="text-white/50 mt-0.5 shrink-0" />
        <p className="text-xs text-white/40 leading-relaxed">
          {isTheft
            ? "No single feature stood out as a statistical outlier — the model flagged this record based on the combined consumption pattern across all 9 features simultaneously. The random forest detected a signature that, as a whole, doesn't match normal usage for this building class."
            : "All features are within the normal statistical range for this building class."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">

      {!isTheft && flags.length > 0 && (
        <div className="p-3 border border-white/10 bg-white/5 rounded-lg flex items-start gap-2 mb-3">
          <Info size={13} className="text-white/50 mt-0.5 shrink-0" />
          <p className="text-[10px] text-white/50 leading-relaxed">
            These features deviate statistically from the class baseline, but the random forest
            classified this record as <span className="text-emerald-400 font-bold">Normal</span> based
            on the overall consumption pattern. Individual deviations do not necessarily indicate theft.
          </p>
        </div>
      )}
      {flags.map((flag: any, i: number) => {
        const severity = Math.abs(flag.z_score) > 5 ? 'high' : 'medium';
        const meta = FIELD_LABELS[flag.feature];
        return (
          <div
            key={i}
            className={`p-4 rounded-lg border flex items-start gap-3 ${severity === 'high'
              ? 'border-red-500/30 bg-red-500/5'
              : 'border-amber-500/30 bg-amber-500/5'
              }`}
          >
            <AlertTriangle
              size={14}
              className={`mt-0.5 shrink-0 ${severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-white/80">{meta?.label || flag.feature}</span>
                <span className={`text-xs font-mono font-bold ${severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                  {flag.z_score > 0 ? '+' : ''}{flag.z_score}σ
                </span>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Recorded <span className="text-white/70 font-mono">{flag.value}</span> kW —{' '}
                {flag.direction === 'above' ? 'exceeds' : 'falls below'} the{' '}
                class mean of <span className="text-white/70 font-mono">{flag.mean}</span> kW
                {' '}(σ = <span className="text-white/70 font-mono">{flag.std}</span>).
                {' '}{Math.abs(flag.z_score) > 5
                  ? 'Extreme deviation — strongly atypical for this building class.'
                  : 'Moderate deviation — statistically unusual.'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecordExportDropdown({ record, scanId }: { record: any; scanId: string }) {
  const [open, setOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePDF = async () => {
    setOpen(false);
    setPdfLoading(true);
    try {
      await exportToPDF('record-export-root', `${scanId}_record_${record.record_index}`);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={pdfLoading}
        className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/70
                   bg-white/5 hover:bg-white/10 border border-white/10
                   px-3 py-2 rounded transition-colors disabled:opacity-50"
      >
        {pdfLoading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
        {pdfLoading ? 'GENERATING...' : 'EXPORT ▾'}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-20 bg-[#0a0a0f] border border-white/10
                          rounded-lg overflow-hidden min-w-[160px] shadow-xl">
            <button
              onClick={handlePDF}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-white/70
                         hover:bg-white/5 hover:text-white transition-colors text-left"
            >
              <FileText size={12} /> Export PDF
            </button>
            <button
              onClick={() => { exportSingleRecordToCSV(record, scanId); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-cyan-400/70
                         hover:bg-cyan-500/5 hover:text-cyan-400 transition-colors text-left border-t border-white/5"
            >
              <Table2 size={12} /> Export CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RecordDrilldownPage({
  params,
}: {
  params: Promise<{ orgSlug: string; scanId: string; recordIndex: string }>;
}) {
  const { orgSlug: slug, scanId, recordIndex } = use(params);
  const [record, setRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/logs/${slug}/${scanId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) throw new Error('Snapshot not found');
        const snap = d.snapshot;
        const idx = parseInt(recordIndex, 10);

        // try all_predictions first, fall back to theft_predictions
        const allPreds: any[] = snap.all_predictions || [];
        const theftPreds: any[] = snap.theft_predictions || [];
        const pool = allPreds.length > 0 ? allPreds : theftPreds;

        const found = pool.find((r: any) => r.record_index === idx);
        if (!found) throw new Error(`Record ${idx} not found in this scan`);
        setRecord(found);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [slug, scanId, recordIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030105] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/40">
          <Activity size={16} className="animate-pulse" />
          <span className="text-sm font-bold tracking-wider font-mono">LOADING RECORD...</span>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-[#030105] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-400 font-bold tracking-wider">{error || 'Record not found'}</p>
          <Link
            href={`/${slug}/predict/results/${scanId}`}
            className="text-xs text-white/40 hover:text-white underline"
          >
            Back to scan results
          </Link>
        </div>
      </div>
    );
  }

  const isTheft = record.prediction === 1;
  const area = AREA_MAP[String(record.area_id)];
  const buildingClass = record.features?.class || '—';
  const anomalyFlags: any[] = record.anomaly_flags || [];
  const treeVotes = record.tree_votes;
  const probabilities = record.probabilities;

  return (
    <div className="min-h-screen bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">

      {/* BREADCRUMB */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-white/50 font-mono mb-4">
            <Link href={`/${slug}/logs`} className="hover:text-white transition-colors">ARCHIVE</Link>
            <ChevronRight size={10} />
            <Link href={`/${slug}/predict/results/${scanId}`} className="hover:text-white transition-colors">{scanId}</Link>
            <ChevronRight size={10} />
            <span className="text-white/60">RECORD #{recordIndex}</span>
          </div>
          <Link
            href={`/${slug}/predict/results/${scanId}`}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white mb-6 transition-colors w-fit"
          >
            <ArrowLeft size={14} /> BACK TO SCAN RESULTS
          </Link>
        </div>
        <RecordExportDropdown record={record} scanId={scanId} />
      </div>

      {/*record export root*/}
      <div id="record-export-root">
        <div className={`p-6 rounded-xl mb-5 border ${isTheft
          ? 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-transparent'
          : 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent'
          }`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {isTheft
                ? <ShieldAlert size={40} className="text-red-400 shrink-0" />
                : <CheckCircle size={40} className="text-emerald-400 shrink-0" />}
              <div>
                <h1 className={`text-3xl font-black tracking-tight ${isTheft ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isTheft ? 'ENERGY THEFT DETECTED' : 'CONSUMPTION NORMAL'}
                </h1>
                <p className="text-xs text-white/40 font-mono mt-1">
                  Scan {scanId} · Record #{recordIndex} · {buildingClass}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'CONFIDENCE', val: `${((record.confidence || 0) * 100).toFixed(1)}%`, color: isTheft ? 'text-red-400' : 'text-emerald-400' },
                { label: 'AREA', val: area?.name || (record.area_id ? `Area ${record.area_id}` : '—'), color: 'text-purple-400' },
                { label: 'BUILDING CLASS', val: buildingClass, color: 'text-purple-400' },
                { label: 'FLAGS', val: anomalyFlags.length > 0 ? `${anomalyFlags.length} feature${anomalyFlags.length > 1 ? 's' : ''}` : 'None', color: anomalyFlags.length > 0 ? 'text-amber-400' : 'text-white/40' },
                { label: 'RECORD', val: `#${record.record_index}`, color: 'text-white/60' },
              ].map((s) => (
                <div key={s.label} className="bg-black/50 border border-white/10 px-4 py-2 rounded text-center min-w-[80px]">
                  <div className="text-[8px] text-white/30 font-bold tracking-widest mb-1">{s.label}</div>
                  <div className={`text-sm font-black ${s.color}`}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DOMAIN CONTEXT STRIP */}
        {record?.domain_flag && (
          <div className={`flex items-start gap-3 p-4 rounded-lg border mb-5 ${record.domain_tier === 'impossible' ? 'border-red-500/20 bg-red-500/5'
              : record.domain_tier === 'suspicious' ? 'border-amber-500/20 bg-amber-500/5'
                : 'border-cyan-500/20 bg-cyan-500/5'
            }`}>
            <Info size={13} className={`mt-0.5 shrink-0 ${record.domain_tier === 'impossible' ? 'text-red-400'
                : record.domain_tier === 'suspicious' ? 'text-amber-400'
                  : 'text-cyan-400'
              }`} />
            <div>
              <span className={`text-[9px] font-bold tracking-widest ${record.domain_tier === 'impossible' ? 'text-red-400'
                  : record.domain_tier === 'suspicious' ? 'text-amber-400'
                    : 'text-cyan-400'
                }`}>{record.domain_flag}</span>
              <p className="text-[10px] text-white/50 leading-relaxed mt-0.5">{record.domain_note}</p>
            </div>
          </div>
        )}
        {/* MAIN GRID */}
        {/* ROW 1: tree votes | probabilities | metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">

          {/* tree votes */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trees size={14} className="text-white/50" />
              <h2 className="text-[10px] font-bold text-white/40 tracking-widest">DECISION FOREST</h2>
            </div>
            {treeVotes
              ? <TreeVotesBar votes={treeVotes} />
              : <p className="text-xs text-white/30">No vote data</p>}
          </div>

          {/* probabilities */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-[10px] font-bold text-white/40 tracking-widest mb-4">CLASS PROBABILITIES</h2>
            {probabilities ? (
              <div className="space-y-4">
                {[
                  { label: 'Theft', val: probabilities.theft, bar: 'bg-red-400', text: 'text-red-400' },
                  { label: 'Normal', val: probabilities.normal, bar: 'bg-emerald-400', text: 'text-emerald-400' },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-bold ${p.text}`}>{p.label}</span>
                      <span className="font-mono text-lg font-black text-white/80">
                        {(p.val * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${p.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${p.val * 100}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-[9px] text-white/40 leading-relaxed">
                  Fraction of trees that voted for each class via <span className="font-mono">predict_proba()</span>
                </p>
              </div>
            ) : <p className="text-xs text-white/30">No probability data</p>}
          </div>

          {/* metadata */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-[10px] font-bold text-white/40 tracking-widest mb-4">RECORD METADATA</h2>
            <div className="space-y-3">
              {[
                { label: 'Building Class', val: buildingClass, color: 'text-purple-400', icon: <Cpu size={12} /> },
                { label: 'Area', val: area ? `${area.name} (Area ${record.area_id})` : record.area_id ? `Area ${record.area_id}` : '—', color: 'text-purple-400', icon: <MapPin size={12} /> },
                { label: 'Record Index', val: `#${record.record_index}`, color: 'text-white/60', icon: null },
                { label: 'Statistical Flags', val: anomalyFlags.length > 0 ? `${anomalyFlags.length} deviate` : 'None', color: anomalyFlags.length > 0 ? 'text-amber-400' : 'text-white/30', icon: null },
              ].map((m) => (
                <div key={m.label} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-white/40 flex items-center gap-1.5">
                    {m.icon} {m.label}
                  </span>
                  <span className={`text-xs font-bold ${m.color}`}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: radar | flagged features + anomaly flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

          {/* radar */}
          {record.features && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h2 className="text-[10px] font-bold text-white/40 tracking-widest mb-2">CONSUMPTION FINGERPRINT</h2>
              <p className="text-[9px] text-white/50 mb-4 leading-relaxed">
                Cyan = this record · Purple dashed = <span className="text-purple-400">{buildingClass}</span> baseline
              </p>
              <ConsumptionRadar
                features={record.features}
                anomalyFlags={anomalyFlags}
                buildingClass={buildingClass}
              />
            </div>
          )}

          {/* flagged features bar + anomaly flags stacked */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-5">

            {/* top: flagged features bar */}
            <div>
              <h2 className="text-[10px] font-bold text-white/40 tracking-widest mb-3">
                FLAGGED FEATURES VS BASELINE
              </h2>
              {anomalyFlags.length > 0
                ? <FlaggedFeaturesChart anomalyFlags={anomalyFlags} />
                : <p className="text-xs text-white/30 italic">No flagged features</p>}
            </div>

            <div className="border-t border-white/10" />

            {/* bottom: anomaly flags list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-bold text-white/40 tracking-widest">
                  {isTheft ? 'ANOMALY FLAGS' : 'STATISTICAL DEVIATIONS'}
                </h2>
                {anomalyFlags.length > 0 && (
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                    {anomalyFlags.length} detected
                  </span>
                )}
              </div>
              <AnomalyFlagsSummary flags={anomalyFlags} isTheft={isTheft} />
            </div>
          </div>
        </div>

        {/* ROW 3: feature vs baseline full width */}
        {record.features && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">
            <h2 className="text-[10px] font-bold text-white/40 tracking-widest mb-2">
              FEATURE VALUES VS CLASS BASELINE
            </h2>
            <p className="text-[9px] text-white/50 mb-5 leading-relaxed">
              Flagged features show this record's value alongside the statistical mean for{' '}
              <span className="text-purple-400">{buildingClass}</span> buildings.
            </p>
            <FeatureBaselineChart features={record.features} anomalyFlags={anomalyFlags} />
          </div>
        )}

        {/* FOOTER NOTE */}
        <div className="pt-6 border-t border-white/5">
          <p className="text-[9px] text-white/40 leading-relaxed max-w-2xl">
            Classification performed by a Random Forest model trained on 560,000+ records.
            Tree vote counts are derived directly from <span className="font-mono">model.estimators_</span> in scikit-learn.
            Statistical deviations are computed against per-class baselines (mean ± std) derived from the training distribution.
          </p>
        </div>
      </div>
    </div>
  );
}