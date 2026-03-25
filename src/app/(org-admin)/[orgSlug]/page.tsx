"use client";

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Target, Activity, ShieldAlert, Zap, ArrowRight, Database, Server, ExternalLink, ChevronRight, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ClientOverviewDashboard({ params }: { params: Promise<{ orgSlug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.orgSlug || 'demo-utility';

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/logs/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setHistory(d.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // aggregate stats computed from real data
  const totalRecords = history.reduce((sum, s) => sum + (s.records_analyzed || 0), 0);
  const totalTheft = history.reduce((sum, s) => sum + (s.theft_detected || 0), 0);
  const gridIntegrity = totalRecords > 0
    ? (((totalRecords - totalTheft) / totalRecords) * 100).toFixed(1)
    : '100.0';
  const recentScans = history.slice(0, 5);

  const stats = [
    { label: "TOTAL RECORDS SCANNED", value: loading ? '—' : totalRecords.toLocaleString(), icon: Database, color: "text-cyan-400", border: "border-cyan-400/30" },
    { label: "THEFT FLAGS DETECTED",  value: loading ? '—' : totalTheft.toLocaleString(),   icon: ShieldAlert, color: "text-purple-400", border: "border-purple-400/30" },
    { label: "GRID INTEGRITY",        value: loading ? '—' : `${gridIntegrity}%`,            icon: Activity, color: "text-emerald-400", border: "border-emerald-400/30" },
    { label: "ACTIVE REGIONS",        value: "5",                                             icon: Zap, color: "text-blue-400", border: "border-blue-400/30" },
  ];

  return (
    <div className="h-full bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold font-mono mb-6">
          <Link href={`/${slug}`} className="text-white/60 hover:text-white transition-colors">{slug.toUpperCase()}</Link>
          <ChevronRight size={12} className="text-white/30" />
          <span className="text-white/30">OVERVIEW</span>
        </div>
        <Link
          href={`/${slug}/predict`}
          className="group relative inline-flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-md font-bold tracking-wide transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,242,255,0.3)]"
        >
          <Target size={18} className="group-hover:animate-spin" />
          RUN NEW PREDICTION
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`bg-white/5 border ${stat.border} p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors`}>
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={100} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Icon size={20} className={stat.color} />
                <span className="text-xs font-bold text-white/50 tracking-wider">{stat.label}</span>
              </div>
              <div className="text-3xl font-black">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* RECENT LOGS */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold tracking-wide flex items-center gap-2">
              <Server size={18} className="text-purple-400" />
              RECENT AUDIT LOGS
            </h2>
            <Link href={`/${slug}/logs`} className="text-xs text-cyan-400 hover:underline tracking-wider">VIEW ALL</Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-white/30 gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs font-mono">LOADING...</span>
            </div>
          ) : recentScans.length === 0 ? (
            <div className="text-center py-12 text-white/20 text-xs font-mono">
              NO SCANS YET — RUN YOUR FIRST PREDICTION
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-white/40 tracking-[0.1em] uppercase">
                    <th className="pb-3 font-bold">ID</th>
                    <th className="pb-3 font-bold">Name</th>
                    <th className="pb-3 font-bold">Type</th>
                    <th className="pb-3 font-bold">Records</th>
                    <th className="pb-3 font-bold">Theft</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentScans.map((scan, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 font-mono text-xs text-cyan-400/80 font-bold">{scan.id}</td>
                      <td className="py-4 text-white/80 text-xs max-w-[160px] truncate">{scan.name}</td>
                      <td className="py-4">
                        <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] tracking-wider font-bold text-purple-400">
                          {scan.type}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-xs text-white/50">{scan.records_analyzed}</td>
                      <td className="py-4">
                        <span className={`text-xs font-bold font-mono ${scan.theft_detected > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {scan.theft_detected > 0 ? scan.theft_detected : '✓'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/${slug}/predict/results/${scan.id}`}
                          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-400 hover:text-cyan-300 opacity-50 group-hover:opacity-100 transition-all"
                        >
                          VIEW <ExternalLink size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ENGINE STATUS */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col">
          <h2 className="text-lg font-bold tracking-wide flex items-center gap-2 mb-6">
            <Activity size={18} className="text-cyan-400" />
            ENGINE STATUS
          </h2>

          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-xs tracking-wider text-white/50 mb-2">
                <span>ML MODEL SERVER</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-emerald-400 w-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs tracking-wider text-white/50 mb-2">
                <span>MODEL ACCURACY (RF)</span>
                <span className="text-cyan-400">99.61%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-cyan-400 w-[99.6%] shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs tracking-wider text-white/50 mb-2">
                <span>F1 SCORE (WEIGHTED)</span>
                <span className="text-purple-400">99.54%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-purple-400 w-[98.72%] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <Link href={`/${slug}/metrics`} className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-md transition-colors group">
                <div>
                  <div className="text-sm font-bold tracking-wide text-white/80 group-hover:text-white">VIEW MODEL METRICS</div>
                  <div className="text-xs text-white/40 mt-1">Confusion matrix & ROC curves</div>
                </div>
                <ArrowRight size={16} className="text-white/40 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}