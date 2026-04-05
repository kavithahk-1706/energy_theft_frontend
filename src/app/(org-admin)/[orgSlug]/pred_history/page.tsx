"use client";

import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, ExternalLink, ShieldAlert, CheckCircle, Loader2, ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';



const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function exportLogsToCsv(logs: any[], filename: string) {
  const headers = ['ID', 'Name', 'Date', 'Type', 'Status', 'Theft Detected', 'Records Analyzed'];
  const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = logs.map(s => [
    s.id, s.name, s.date, s.type,
    s.theft_detected > 0 ? 'FLAGGED' : 'CLEAN',
    s.theft_detected, s.records_analyzed
  ].map(escape).join(','));
  const csv = [headers.map(escape).join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
}


export default function ConsumptionLogs() {
  const params = useParams();
  const slug = (params.orgSlug as string) || 'demo-utility';
  const [searchTerm, setSearchTerm] = useState('');
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BATCH' | 'SINGLE'>('ALL');

  useEffect(() => {
    fetch(`${API_URL}/logs/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setScanHistory(d.history || []);
        setLoading(false);
      })
      .catch((e) => {
        setError('Failed to fetch logs from backend');
        setLoading(false);
      });
  }, [slug]);

  const filtered = scanHistory.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">

      {/* HEADER */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold font-mono mb-6">
            <Link href={`/${slug}`} className="text-white/60 hover:text-white transition-colors">{slug.toUpperCase()}</Link>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-white/30">ARCHIVE</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Database className="text-purple-500" size={32} />
            PREDICTION <span className="text-white/40">ARCHIVE</span>
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            Historical registry of all Random Forest classification runs. Access past prediction snapshots and audit reports.
          </p>
        </div>
        <button
          onClick={() => exportLogsToCsv(filtered, `${slug}-prediction-archive`)}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/70
             bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
             px-3 py-2 rounded transition-colors disabled:opacity-30"
        >
          <Download size={13} /> EXPORT CSV
          {filtered.length > 0 && (
            <span className="text-white/40 font-mono">({filtered.length})</span>
          )}
        </button>
      </div>

      {/* TABLE CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['ALL', 'BATCH', 'SINGLE'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-2 rounded text-[10px] font-bold tracking-wider transition-colors border ${typeFilter === f
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-black/40 border-b border-white/10 text-[10px] font-bold text-white/40 tracking-[0.1em] uppercase">
                <th className="p-4">Prediction ID</th>
                <th className="p-4">Prediction Name</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Records</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-white/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-white/40">
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-xs tracking-wider font-bold">LOADING ARCHIVE...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-red-400 text-xs font-bold tracking-wider">
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-white/30 text-xs font-bold tracking-wider">
                    NO RECORDS FOUND
                  </td>
                </tr>
              ) : (
                filtered.map((scan, i) => {
                  const isFlagged = scan.theft_detected > 0;
                  return (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-cyan-400 font-bold">{scan.id}</td>
                      <td className="p-4 text-white/90 font-sans tracking-wide">{scan.name}</td>
                      <td className="p-4 text-white/50">{scan.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] tracking-wider font-sans font-bold border ${scan.type === 'BATCH'
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                            : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                          }`}>
                          {scan.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wider ${isFlagged ? 'text-red-400' : 'text-emerald-400'
                          }`}>
                          {isFlagged
                            ? <><ShieldAlert size={12} /> FLAGGED</>
                            : <><CheckCircle size={12} /> CLEAN</>
                          }
                        </span>
                      </td>
                      <td className="p-4 text-white/50 text-xs">
                        <span className="text-white/70">{scan.theft_detected}</span>
                        <span className="text-white/30"> / {scan.records_analyzed}</span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/${slug}/predict/results/${scan.id}`}
                          className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-wider text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 px-3 py-1.5 rounded transition-all"
                        >
                          VIEW ANALYSIS <ExternalLink size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-black/40 border-t border-white/10 p-4 flex items-center justify-between text-xs text-white/40 font-bold tracking-wider">
          <div>SHOWING {filtered.length} OF {scanHistory.length} RECORDS</div>
        </div>
      </div>
    </div>
  );
}