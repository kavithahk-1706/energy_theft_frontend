"use client";

import React, { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, CheckCircle, ArrowLeft, Clock, Cpu,
  Activity, AlertTriangle, ChevronDown, ChevronUp,
  MapPin, BarChart2, Loader2, Info, ChevronRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, Legend
} from 'recharts';

import { ConsumptionRadar, FlaggedFeaturesChart, FIELD_LABELS, AREA_MAP } from '@/components/PredictionCharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';




// ─── Donut Chart ─────────────────────────────────────────────────────────────
function TheftDonut({ theft, normal }: { theft: number; normal: number }) {
  const data = [
    { name: 'Theft', value: theft },
    { name: 'Normal', value: normal },
  ];
  const COLORS = ['#f87171', '#34d399'];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#0a0a0f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#fff'
            }}
            formatter={(val: any, name: any) => [`${val} records`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-4 text-xs font-mono -mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-red-400">{theft} theft</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400">{normal} normal</span>
        </div>
      </div>
    </div>
  );
}

// ─── Area Bar Chart ───────────────────────────────────────────────────────────
function AreaTheftBar({ areaBreakdown }: { areaBreakdown: Record<string, any> }) {
  const data = Object.entries(areaBreakdown).map(([areaId, d]: [string, any]) => ({
    name: AREA_MAP[areaId]?.name || `Area ${areaId}`,
    rate: d.total > 0 ? parseFloat(((d.theft / d.total) * 100).toFixed(1)) : 0,
    theft: d.theft,
    total: d.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={28} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            background: '#0a0a0f',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#fff'
          }}
          formatter={(val: any, _: any, props: any) => [
            `${val}% (${props.payload.theft}/${props.payload.total})`,
            'Theft Rate'
          ]}
        />
        <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.rate > 50 ? '#f87171' : entry.rate > 20 ? '#fbbf24' : '#34d399'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Leaflet map (client-only) ───────────────────────────────────────────────
function AreaMap({ areaBreakdown, allPredictions }: { 
  areaBreakdown: Record<string, any>;
  allPredictions: any[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [17.4239, 78.4738],
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19,
    }).addTo(map);

    // scatter individual prediction points around area center
    allPredictions.forEach((rec: any) => {
      if (rec.area_id == null) return;
      const area = AREA_MAP[String(rec.area_id)];
      if (!area) return;

      const isTheft = rec.prediction === 1;
      const confidence = rec.confidence || 0;

      // random offset within ~800m radius around area center
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 0.007; // ~700m in degrees
      const lat = area.lat + radius * Math.cos(angle);
      const lng = area.lng + radius * Math.sin(angle);

      const color = isTheft
        ? confidence > 0.8 ? '#f87171' : '#fbbf24'
        : '#34d399';

      L.circleMarker([lat, lng], {
        radius: 5,
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
        weight: 1,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:monospace;font-size:11px;color:#fff;background:#0a0a0f;padding:8px;border-radius:6px">
            <b style="color:${color}">${rec.prediction_label}</b><br/>
            Confidence: ${(confidence * 100).toFixed(1)}%<br/>
            Area: ${area.name}<br/>
            Record #${rec.record_index}
          </div>`
        );
    });

    // area name labels
    Object.entries(AREA_MAP).forEach(([id, area]) => {
      if (!areaBreakdown[id]) return;
      L.marker([area.lat, area.lng], {
        icon: L.divIcon({
          html: `<div style="color:rgba(255,255,255,0.6);font-size:10px;font-weight:bold;font-family:monospace;white-space:nowrap;text-shadow:0 0 4px #000">${area.name}</div>`,
          className: '',
          iconAnchor: [-4, 8],
        }),
      }).addTo(map);
    });

    mapInstance.current = map;
  }, [areaBreakdown, allPredictions]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />
      <div ref={mapRef} className="w-full h-64 rounded-lg overflow-hidden z-0" />
    </>
  );
}

// ─── Tree votes bar ──────────────────────────────────────────────────────────
function TreeVotesBar({ votes }: { votes: { theft: number; normal: number; total: number } }) {
  const theftPct = (votes.theft / votes.total) * 100;
  const isTheft = votes.theft > votes.normal;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/60 font-bold tracking-wider">TREE CONSENSUS</span>
        <span className={`font-mono font-bold ${isTheft ? 'text-red-400' : 'text-emerald-400'}`}>
          {isTheft ? votes.theft : votes.normal} / {votes.total} trees voted {isTheft ? 'Theft' : 'Normal'}
        </span>
      </div>
      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-red-400 transition-all"
          style={{ width: `${theftPct}%` }}
        />
        <div
          className="h-full bg-emerald-400 transition-all"
          style={{ width: `${100 - theftPct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-white/40 font-mono">
        <span className="text-red-400">{votes.theft} theft</span>
        <span className="text-emerald-400">{votes.normal} normal</span>
      </div>
    </div>
  );
}

// ─── Anomaly flags ───────────────────────────────────────────────────────────
function AnomalyFlags({ flags, isTheft }: { flags: any[]; isTheft: boolean }) {
  if (flags.length === 0) {
    return (
      <div className="p-4 border border-white/10 bg-white/5 rounded-lg flex items-start gap-3">
        <Info size={14} className="text-white/40 mt-0.5 shrink-0" />
        <p className="text-xs text-white/40 leading-relaxed">
          {isTheft
            ? "No individual feature anomalies detected — classification based on overall consumption pattern across all 9 features simultaneously."
            : "All features within normal statistical range for this building class."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {flags.map((flag: any, i: number) => (
        <div
          key={i}
          className={`p-3 rounded-lg border flex items-start gap-3 ${
            Math.abs(flag.z_score) > 5
              ? 'border-red-500/30 bg-red-500/5'
              : 'border-amber-500/30 bg-amber-500/5'
          }`}
        >
          <AlertTriangle
            size={14}
            className={`mt-0.5 shrink-0 ${Math.abs(flag.z_score) > 5 ? 'text-red-400' : 'text-amber-400'}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-white/80">
                {FIELD_LABELS[flag.feature]?.label || flag.feature}
              </span>
              <span className={`text-xs font-mono font-bold ${
                Math.abs(flag.z_score) > 5 ? 'text-red-400' : 'text-amber-400'
              }`}>
                z = {flag.z_score > 0 ? '+' : ''}{flag.z_score}
              </span>
            </div>
            <div className="text-[10px] text-white/40 font-mono">
              value: <span className="text-white/70">{flag.value}</span>
              &nbsp;·&nbsp; mean: <span className="text-white/70">{flag.mean}</span>
              &nbsp;·&nbsp; std: <span className="text-white/70">{flag.std}</span>
              &nbsp;·&nbsp;
              <span className={flag.direction === 'above' ? 'text-red-400' : 'text-cyan-400'}>
                {flag.direction} baseline
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Feature comparison bars ─────────────────────────────────────────────────
function FeatureComparison({ features }: { features: Record<string, any> }) {
  const numerical = Object.entries(features).filter(([k]) => k !== 'class');
  const max = Math.max(...numerical.map(([, v]) => parseFloat(v) || 0), 1);

  return (
    <div className="space-y-2">
      {numerical.map(([key, val]) => {
        const num = parseFloat(val) || 0;
        const pct = (num / max) * 100;
        return (
          <div key={key}>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-white/50">{FIELD_LABELS[key]?.label || key}</span>
              <span className="text-white/70 font-mono">{num.toFixed(4)}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
              <div
                className="h-full bg-cyan-400/60 rounded"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SINGLE result layout ────────────────────────────────────────────────────
function SingleLayout({ snapshot, slug }: { snapshot: any; slug: string }) {
  const rec = snapshot.all_predictions?.[0] || snapshot.theft_predictions?.[0];
  const isTheft = snapshot.theft_detected > 0;
  const buildingClass = rec?.features?.class || '—';
  const anomalyFlags = rec?.anomaly_flags || [];

  return (
    <div className="space-y-6">

      {/* VERDICT HERO */}
      <div className={`p-6 rounded-xl border ${
        isTheft
          ? 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-transparent'
          : 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent'
      }`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {isTheft
              ? <ShieldAlert size={40} className="text-red-400 shrink-0" />
              : <CheckCircle size={40} className="text-emerald-400 shrink-0" />}
            <div>
              <h2 className={`text-3xl font-black tracking-tight ${isTheft ? 'text-red-400' : 'text-emerald-400'}`}>
                {isTheft ? 'ENERGY THEFT DETECTED' : 'CONSUMPTION NORMAL'}
              </h2>
              <p className="text-xs text-white/40 font-mono mt-1">
                {snapshot.id} · {snapshot.timestamp} · {snapshot.execution_time}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'CONFIDENCE', val: `${((rec?.confidence || 0) * 100).toFixed(1)}%`, color: isTheft ? 'text-red-400' : 'text-emerald-400' },
              { label: 'BUILDING CLASS', val: buildingClass, color: 'text-purple-400' },
              { label: 'FLAGS', val: anomalyFlags.length > 0 ? `${anomalyFlags.length} feature${anomalyFlags.length > 1 ? 's' : ''}` : 'None', color: anomalyFlags.length > 0 ? 'text-amber-400' : 'text-white/40' },
              { label: 'MODE', val: snapshot.mode, color: 'text-white/70' },
              { label: 'ACCURACY', val: snapshot.accuracy || '99.61%', color: 'text-cyan-400' },
              { label: 'TIME', val: snapshot.execution_time, color: 'text-white/70' },
            ].map((s) => (
              <div key={s.label} className="bg-black/50 border border-white/10 px-4 py-2 rounded text-center min-w-[80px]">
                <div className="text-[8px] text-white/30 font-bold tracking-widest mb-1">{s.label}</div>
                <div className={`text-sm font-black ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 1: tree votes | probabilities | metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* tree votes */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-[10px] font-bold text-white/40 tracking-widest mb-4">DECISION FOREST</h3>
          {rec?.tree_votes ? (
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <span className={`text-5xl font-black tabular-nums ${isTheft ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isTheft ? rec.tree_votes.theft : rec.tree_votes.normal}
                </span>
                <div className="pb-1.5">
                  <div className="text-white/30 text-xs font-mono">/ {rec.tree_votes.total} trees</div>
                  <div className={`text-sm font-bold ${isTheft ? 'text-red-400' : 'text-emerald-400'}`}>
                    voted {isTheft ? 'Theft' : 'Normal'}
                  </div>
                </div>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-red-400 rounded-l-full transition-all duration-700"
                  style={{ width: `${(rec.tree_votes.theft / rec.tree_votes.total) * 100}%` }} />
                <div className="h-full bg-emerald-400 rounded-r-full transition-all duration-700"
                  style={{ width: `${(rec.tree_votes.normal / rec.tree_votes.total) * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-red-400">{rec.tree_votes.theft} theft</span>
                <span className="text-emerald-400">{rec.tree_votes.normal} normal</span>
              </div>
            </div>
          ) : <p className="text-xs text-white/30">No vote data</p>}
        </div>

        {/* probabilities */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-[10px] font-bold text-white/40 tracking-widests mb-4">CLASS PROBABILITIES</h3>
          {rec?.probabilities ? (
            <div className="space-y-4 mt-2">
              {[
                { label: 'Theft', val: rec.probabilities.theft, bar: 'bg-red-400', text: 'text-red-400' },
                { label: 'Normal', val: rec.probabilities.normal, bar: 'bg-emerald-400', text: 'text-emerald-400' },
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
              <p className="text-[9px] text-white/20 leading-relaxed">
                Fraction of trees that voted for each class via <span className="font-mono">predict_proba()</span>
              </p>
            </div>
          ) : <p className="text-xs text-white/30">No probability data</p>}
        </div>

        {/* metadata */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-[10px] font-bold text-white/40 tracking-widest mb-4">RECORD METADATA</h3>
          <div className="space-y-3">
            {[
              { label: 'Building Class', val: buildingClass, color: 'text-purple-400' },
              { label: 'Model Accuracy', val: snapshot.accuracy || '99.61%', color: 'text-cyan-400' },
              { label: 'Execution Time', val: snapshot.execution_time, color: 'text-white/70' },
              { label: 'Statistical Flags', val: anomalyFlags.length > 0 ? `${anomalyFlags.length} detected` : 'None', color: anomalyFlags.length > 0 ? 'text-amber-400' : 'text-white/30' },
            ].map((m) => (
              <div key={m.label} className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-white/40">{m.label}</span>
                <span className={`text-xs font-bold ${m.color}`}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: radar | anomaly flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* radar */}
        {rec?.features && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-[10px] font-bold text-white/40 tracking-widest mb-2">CONSUMPTION FINGERPRINT</h3>
            <p className="text-[9px] text-white/30 mb-4 leading-relaxed">
              Cyan = this record · Purple dashed = <span className="text-purple-400">{buildingClass}</span> class baseline
            </p>
            <ConsumptionRadar
              features={rec.features}
              anomalyFlags={anomalyFlags}
              buildingClass={buildingClass}
            />
          </div>
        )}

        
        {/* anomaly flags + baseline chart stacked */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-5">
          
          {/* top half: flagged features bar */}
          <div>
            <h3 className="text-[10px] font-bold text-white/40 tracking-widest mb-2">
              FLAGGED FEATURES VS BASELINE
            </h3>
            {anomalyFlags.length > 0 ? (
              <FlaggedFeaturesChart anomalyFlags={anomalyFlags} />
            ) : (
              <p className="text-xs text-white/30 italic">No flagged features</p>
            )}
          </div>

          <div className="border-t border-white/10" />

          {/* bottom half: anomaly flags list */}
          <div>
            <h3 className="text-[10px] font-bold text-white/40 tracking-widest mb-4">
              {isTheft
                ? <>ANOMALY FLAGS {anomalyFlags.length > 0 && <span className="ml-2 text-red-400">{anomalyFlags.length} likely contributors</span>}</>
                : <>STATISTICAL DEVIATIONS <span className="ml-2 text-white/30 font-normal">(record is Normal)</span></>
              }
            </h3>
            {!isTheft && anomalyFlags.length > 0 && (
              <div className="p-3 border border-white/10 bg-white/5 rounded-lg flex items-start gap-2 mb-3">
                <Info size={13} className="text-white/30 mt-0.5 shrink-0" />
                <p className="text-[10px] text-white/40 leading-relaxed">
                  These features deviate statistically from the class baseline, but the forest
                  classified this record as <span className="text-emerald-400 font-bold">Normal</span> based
                  on the overall consumption pattern.
                </p>
              </div>
            )}
            <AnomalyFlags flags={anomalyFlags} isTheft={isTheft} />
          </div>
        </div>
      </div>


      {/* ROW 3: feature values (full width) */}
      {rec?.features && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-[10px] font-bold text-white/40 tracking-widest mb-4">INPUT FEATURE VALUES</h3>
          <FeatureComparison features={rec.features} />
        </div>
      )}
    </div>
  );
}

// ─── BATCH result layout ─────────────────────────────────────────────────────
function BatchLayout({ snapshot, slug, scanId }: { snapshot: any; slug: string; scanId: string }) {
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const allPreds: any[] = snapshot.all_predictions || [];
  const theftPreds: any[] = snapshot.theft_predictions || [];
  const hasFullRecords = snapshot.has_full_records;
  const displayRecords = hasFullRecords ? allPreds : theftPreds;

  const totalAnalyzed = snapshot.records_analyzed;
  const theftDetected = snapshot.theft_detected;
  const normalCount = totalAnalyzed - theftDetected;
  const compromiseRate = totalAnalyzed > 0 ? ((theftDetected / totalAnalyzed) * 100).toFixed(1) : '0';

  // build area breakdown from predictions if not empty
  const areaBreakdown: Record<string, any> = {};
  displayRecords.forEach((rec: any) => {
    if (rec.area_id == null) return;
    const aid = String(rec.area_id);
    if (!areaBreakdown[aid]) areaBreakdown[aid] = { total: 0, theft: 0, normal: 0 };
    areaBreakdown[aid].total++;
    if (rec.prediction === 1) areaBreakdown[aid].theft++;
    else areaBreakdown[aid].normal++;
  });

  const hasAreaData = Object.keys(areaBreakdown).length > 0;

  useEffect(() => {
    // load leaflet script dynamically
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    } else {
      setMapLoaded(true);
    }
  }, []);

  return (
    <div className="space-y-6">

      {!hasFullRecords && (
        <div className="p-3 border border-white/10 bg-white/5 rounded text-xs text-white/50 flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          Large batch — individual record drill-down available for theft predictions only.
        </div>
      )}

      {/* BATCH VERDICT HERO */}
      {(() => {
        const rate = parseFloat(compromiseRate);
        const isHighRisk = rate > 50;
        const isMedRisk = rate > 20 && rate <= 50;
        const verdictText = isHighRisk ? 'HIGH COMPROMISE RATE DETECTED' : isMedRisk ? 'ELEVATED THEFT ACTIVITY' : 'GRID LARGELY SECURE';
        const borderColor = isHighRisk ? 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-transparent'
          : isMedRisk ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-transparent'
          : 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent';
        const icon = isHighRisk
          ? <ShieldAlert size={40} className="text-red-400 shrink-0" />
          : isMedRisk
          ? <AlertTriangle size={40} className="text-amber-400 shrink-0" />
          : <CheckCircle size={40} className="text-emerald-400 shrink-0" />;
        const titleColor = isHighRisk ? 'text-red-400' : isMedRisk ? 'text-amber-400' : 'text-emerald-400';

        return (
          <div className={`p-6 rounded-xl border ${borderColor}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {icon}
                <div>
                  <h2 className={`text-3xl font-black tracking-tight ${titleColor}`}>
                    {verdictText}
                  </h2>
                  <p className="text-xs text-white/40 font-mono mt-1">
                    {theftDetected} theft records out of {totalAnalyzed} analyzed
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'TOTAL RECORDS', val: totalAnalyzed, color: 'text-white/70' },
                  { label: 'THEFT DETECTED', val: theftDetected, color: 'text-red-400' },
                  { label: 'COMPROMISE RATE', val: `${compromiseRate}%`, color: titleColor },
                  { label: 'ACCURACY', val: snapshot.accuracy || '99.61%', color: 'text-cyan-400' },
                  { label: 'TIME', val: snapshot.execution_time, color: 'text-white/70' },
                ].map((s) => (
                  <div key={s.label} className="bg-black/50 border border-white/10 px-4 py-2 rounded text-center min-w-[80px]">
                    <div className="text-[8px] text-white/30 font-bold tracking-widest mb-1">{s.label}</div>
                    <div className={`text-sm font-black ${s.color}`}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* GROUP STATS */}
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
    <h3 className="text-[10px] font-bold text-white/40 tracking-wider mb-4">GROUP STATISTICS</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
        { label: 'TOTAL ANALYZED', val: totalAnalyzed, color: 'text-white' },
        { label: 'THEFT DETECTED', val: theftDetected, color: 'text-red-400' },
        { label: 'NORMAL', val: normalCount, color: 'text-emerald-400' },
        { label: 'COMPROMISE RATE', val: `${compromiseRate}%`, color: 'text-amber-400' },
        ].map((s) => (
        <div key={s.label} className="bg-black/50 border border-white/5 p-4 rounded text-center">
            <div className="text-[9px] text-white/50 font-bold tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
        </div>
        ))}
    </div>

    {/* charts row */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <div>
        <p className="text-[9px] font-bold text-white/50 tracking-wider mb-3">THEFT / NORMAL SPLIT</p>
        <TheftDonut theft={theftDetected} normal={normalCount} />
        </div>
        {hasAreaData && (
        <div>
            <p className="text-[9px] font-bold text-white/50 tracking-wider mb-3">THEFT RATE BY AREA</p>
            <AreaTheftBar areaBreakdown={areaBreakdown} />
        </div>
        )}
    </div>
    </div>

      {/* AREA BREAKDOWN + MAP */}
      {hasAreaData && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h3 className="text-[10px] font-bold text-white/40 tracking-wider mb-4 flex items-center gap-2">
            <MapPin size={12} /> AREA BREAKDOWN — HYDERABAD GRID
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* area cards */}
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(areaBreakdown).map(([areaId, data]: [string, any]) => {
                const area = AREA_MAP[areaId];
                const rate = data.total > 0 ? ((data.theft / data.total) * 100).toFixed(1) : '0';
                const rateNum = parseFloat(rate);
                return (
                  <div key={areaId} className="bg-black/40 border border-white/5 p-3 rounded flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white/80">{area?.name || `Area ${areaId}`}</div>
                      <div className="text-[10px] text-white/40 font-mono">{data.total} records</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-black ${rateNum > 50 ? 'text-red-400' : rateNum > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {rate}%
                      </div>
                      <div className="text-[10px] text-white/50">{data.theft} theft</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* map */}
            <div className="rounded-lg overflow-hidden border border-white/10">
              {mapLoaded
                ? <AreaMap areaBreakdown={areaBreakdown} allPredictions={displayRecords} />

                : <div className="h-64 flex items-center justify-center text-white/50 text-xs">
                    <Loader2 size={16} className="animate-spin mr-2" /> Loading map...
                  </div>
              }
            </div>
          </div>
        </div>
      )}

      {/* RECORDS TABLE */}
      {displayRecords.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-white/40 tracking-wider">
              {hasFullRecords ? 'ALL PREDICTIONS' : 'THEFT PREDICTIONS'}
              <span className="ml-2 text-white/40">({displayRecords.length})</span>
            </h3>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[#0a0a0f]">
                <tr className="text-[9px] font-bold text-white/50 tracking-wider border-b border-white/10">
                  <th className="p-3">#</th>
                  <th className="p-3">RESULT</th>
                  <th className="p-3">CONFIDENCE</th>
                  <th className="p-3">TREE VOTES</th>
                  <th className="p-3">AREA</th>
                  <th className="p-3">FLAGS</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {displayRecords.map((rec: any) => {
                  const isTheft = rec.prediction === 1;
                  const area = AREA_MAP[String(rec.area_id)];
                  const isExpanded = expandedRecord === rec.record_index;

                  return (
                    <React.Fragment key={rec.record_index}>
                      <tr
                        className={`border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${isExpanded ? 'bg-white/5' : ''}`}
                        onClick={() => setExpandedRecord(isExpanded ? null : rec.record_index)}
                      >
                        <td className="p-3 font-mono text-xs text-white/40">{rec.record_index}</td>
                        <td className="p-3">
                          <span className={`text-xs font-bold ${isTheft ? 'text-red-400' : 'text-emerald-400'}`}>
                            {rec.prediction_label}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-xs text-white/60">
                          {(rec.confidence * 100).toFixed(1)}%
                        </td>
                        <td className="p-3 font-mono text-xs">
                          {rec.tree_votes ? (
                            <span className={isTheft ? 'text-red-400' : 'text-emerald-400'}>
                              {isTheft ? rec.tree_votes.theft : rec.tree_votes.normal}/{rec.tree_votes.total}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="p-3 text-xs text-purple-400/70">
                          {area?.name || (rec.area_id ? `Area ${rec.area_id}` : '—')}
                        </td>
                        <td className="p-3">
                          {rec.anomaly_flags?.length > 0 ? (
                            <span className="text-[10px] text-amber-400 font-bold">
                              {rec.anomaly_flags.length} flag{rec.anomaly_flags.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/40">—</span>
                          )}
                        </td>
                        <td className="p-3 text-white/50 text-xs">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="border-t border-white/5 bg-black/30">
                          <td colSpan={7} className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {/* tree votes */}
                              {rec.tree_votes && (
                                <div>
                                  <p className="text-[9px] font-bold text-white/50 tracking-wider mb-3">TREE CONSENSUS</p>
                                  <TreeVotesBar votes={rec.tree_votes} />
                                </div>
                              )}
                              {/* probabilities */}
                              {rec.probabilities && (
                                <div>
                                  <p className="text-[9px] font-bold text-white/50 tracking-wider mb-3">PROBABILITIES</p>
                                  <div className="space-y-2">
                                    {[
                                      { label: 'Normal', val: rec.probabilities.normal, color: 'bg-emerald-400', text: 'text-emerald-400' },
                                      { label: 'Theft', val: rec.probabilities.theft, color: 'bg-red-400', text: 'text-red-400' },
                                    ].map((p) => (
                                      <div key={p.label}>
                                        <div className="flex justify-between text-xs mb-1">
                                          <span className={p.text}>{p.label}</span>
                                          <span className="text-white/50 font-mono">{(p.val * 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
                                          <div className={`h-full ${p.color} rounded`} style={{ width: `${p.val * 100}%` }} />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* anomaly flags */}
                              <div className="md:col-span-2">
                                <p className="text-[9px] font-bold text-white/50 tracking-wider mb-3">ANOMALY FLAGS</p>
                                <AnomalyFlags flags={rec.anomaly_flags || []} isTheft={isTheft} />
                              </div>
                              {/* features */}
                              {rec.features && (
                                <div className="md:col-span-2">
                                  <p className="text-[9px] font-bold text-white/50 tracking-wider mb-3">FEATURE VALUES</p>
                                  <FeatureComparison features={rec.features} />
                                </div>
                              )}
                            </div>
                            {/* drill-down link */}
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <Link
                                href={`/${slug}/predict/results/${scanId}/${rec.record_index}`}
                                className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded transition-colors"
                              >
                                OPEN DETAILED ANALYSIS & CHARTS →
                              </Link>
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

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ResultsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; scanId: string }>;
}) {
  const { orgSlug: slug, scanId } = use(params);
  const [snapshot, setSnapshot] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/logs/${slug}/${scanId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) throw new Error('Snapshot not found');
        setSnapshot(d.snapshot);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [slug, scanId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030105] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/40">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-bold tracking-wider">LOADING SNAPSHOT...</span>
        </div>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen bg-[#030105] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-400 font-bold tracking-wider">{error || 'Snapshot not found'}</p>
          <div className="flex items-center gap-2 text-[10px] text-white/50 font-mono mb-4">
            <Link href={`/${slug}/logs`} className="hover:text-white transition-colors">ARCHIVE</Link>
            <ChevronRight size={10} />
            <span className="text-white/60">{scanId}</span>
          </div>
          <Link href={`/${slug}/logs`} className="text-xs text-white/40 hover:text-white underline">
            Back to Archive
          </Link>
        </div>
      </div>
    );
  }

  const isBatch = snapshot.mode === 'BATCH';
  const isTheft = snapshot.theft_detected > 0;

  return (
    <div className="min-h-screen bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[10px] text-white/50 font-mono mb-4">
          <Link href={`/${slug}/logs`} className="hover:text-white transition-colors">ARCHIVE</Link>
          <ChevronRight size={10} />
          <span className="text-white/60">{scanId}</span>
        </div>
        <Link
          href={`/${slug}/predict`}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white mb-4 transition-colors w-fit"
        >
          <ArrowLeft size={14} /> BACK
        </Link>

      

      </div>

      {/* CONTENT */}
      {isBatch
        ? <BatchLayout snapshot={snapshot} slug={slug} scanId={scanId} />
        : <SingleLayout snapshot={snapshot} slug={slug} />
      }
    </div>
  );
}