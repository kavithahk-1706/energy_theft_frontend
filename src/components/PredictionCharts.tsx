"use client";

import React from 'react';
import { AlertTriangle, Info, Cpu, Activity, Wind, Thermometer, Zap, Lightbulb, Flame, Droplets } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, Cell, Legend
} from 'recharts';

export const FIELD_LABELS: Record<string, { label: string; unit: string; icon: React.ReactNode }> = {
  fans_electricity:               { label: "Fans",               unit: "kW", icon: <Wind size={12} /> },
  cooling_electricity:            { label: "Cooling",            unit: "kW", icon: <Thermometer size={12} /> },
  heating_electricity:            { label: "Heating (Elec)",     unit: "kW", icon: <Zap size={12} /> },
  interior_lights_electricity:    { label: "Interior Lights",    unit: "kW", icon: <Lightbulb size={12} /> },
  interior_equipment_electricity: { label: "Interior Equipment", unit: "kW", icon: <Cpu size={12} /> },
  gas_facility:                   { label: "Gas Facility",       unit: "kW", icon: <Flame size={12} /> },
  heating_gas:                    { label: "Heating (Gas)",      unit: "kW", icon: <Flame size={12} /> },
  interior_equipment_gas:         { label: "Equip. Gas",         unit: "kW", icon: <Activity size={12} /> },
  water_heater_gas:               { label: "Water Heater Gas",   unit: "kW", icon: <Droplets size={12} /> },
};

export const AREA_MAP: Record<string, { name: string; lat: number; lng: number }> = {
  "1": { name: "Secunderabad", lat: 17.4399, lng: 78.4983 },
  "2": { name: "Hitech City",  lat: 17.4486, lng: 78.3908 },
  "3": { name: "Charminar",    lat: 17.3616, lng: 78.4747 },
  "4": { name: "Gachibowli",   lat: 17.4401, lng: 78.3489 },
  "5": { name: "Kukatpally",   lat: 17.4849, lng: 78.3996 },
};

// ─── Consumption Radar ────────────────────────────────────────────────────────
export function ConsumptionRadar({
  features,
  anomalyFlags,
  buildingClass,
}: {
  features: Record<string, any>;
  anomalyFlags: any[];
  buildingClass: string;
}) {
  const flagMap: Record<string, any> = {};
  anomalyFlags.forEach((f) => { flagMap[f.feature] = f; });

  const data = Object.entries(FIELD_LABELS).map(([key, meta]) => {
    const value = parseFloat(features[key]) || 0;
    const flag = flagMap[key];
    return {
      feature: meta.label,
      value: parseFloat(value.toFixed(3)),
      baseline: flag ? parseFloat(flag.mean.toFixed(3)) : value,
      isFlagged: !!flag,
      zScore: flag?.z_score || 0,
    };
  });

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload?.isFlagged) return null;
    const isExtreme = Math.abs(payload.zScore) > 5;
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill={isExtreme ? '#f87171' : '#fbbf24'} opacity={0.9} />
        <circle cx={cx} cy={cy} r={10} fill="none" stroke={isExtreme ? '#f87171' : '#fbbf24'} strokeWidth={1} opacity={0.4} />
      </g>
    );
  };

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} margin={{ top: 15, right: 35, bottom: 15, left: 35 }}>
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis
            dataKey="feature"
            tick={({ x, y, payload, index }: any) => {
              const entry = data[index];
              const color = entry?.isFlagged
                ? Math.abs(entry.zScore) > 5 ? '#f87171' : '#fbbf24'
                : 'rgba(255,255,255,0.5)';
              return (
                <text x={x} y={y} fill={color} fontSize={9} fontFamily="monospace" textAnchor="middle" dominantBaseline="central">
                  {payload.value}
                  {entry?.isFlagged ? ' ⚑' : ''}
                </text>
              );
            }}
          />
          <Radar
            name="Class Baseline"
            dataKey="baseline"
            stroke="rgba(168,85,247,0.8)"
            fill="rgba(168,85,247,0.15)"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
          <Radar
            name="This Record"
            dataKey="value"
            stroke="#22d3ee"
            fill="rgba(34,211,238,0.12)"
            strokeWidth={2.5}
            dot={<CustomDot />}
          />
          <Legend
            wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a0f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#fff'
            }}
            formatter={(val: any, name: any) => [`${val} kW`, name]}
          />
        </RadarChart>
      </ResponsiveContainer>

      {anomalyFlags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {anomalyFlags.map((f, i) => {
            const isExtreme = Math.abs(f.z_score) > 5;
            return (
              <span key={i} className={`text-[9px] font-mono px-2 py-1 rounded border ${
                isExtreme
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              }`}>
                ⚑ {FIELD_LABELS[f.feature]?.label} ({f.z_score > 0 ? '+' : ''}{f.z_score}σ)
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Flagged Features Bar Chart ───────────────────────────────────────────────
export function FlaggedFeaturesChart({ anomalyFlags }: { anomalyFlags: any[] }) {
  if (anomalyFlags.length === 0) return null;

  const data = anomalyFlags.map((f) => ({
    name: FIELD_LABELS[f.feature]?.label || f.feature,
    record: parseFloat(f.value.toFixed(3)),
    baseline: parseFloat(f.mean.toFixed(3)),
    z: f.z_score,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 55)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        barSize={10}
        barGap={3}
      >
        <XAxis
          type="number"
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#0a0a0f',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#fff'
          }}
          formatter={(val: any, name: any) => [`${val} kW`, name]}
        />
        <Legend
          wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}
        />
        <Bar dataKey="record" name="This Record" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={Math.abs(entry.z) > 5 ? '#f87171' : '#fbbf24'} />
          ))}
        </Bar>
        <Bar dataKey="baseline" name="Class Baseline" fill="rgba(168,85,247,0.5)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}