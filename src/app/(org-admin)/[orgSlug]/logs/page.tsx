"use client";

import React, { useState } from 'react';
import { Database, Search, Filter, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ConsumptionLogs({ params }: { params: { orgSlug: string } }) {
  const slug = params.orgSlug || 'demo-utility';
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy history data - stripped down to your exact requested schema
  const scanHistory = [
    { id: "PRD-0042", name: "Sector 7 Monthly Grid Audit", date: "2024-10-26 14:30:00", type: "BATCH" },
    { id: "PRD-0041", name: "Manual Inspection: MTR-8829", date: "2024-10-25 09:15:22", type: "SINGLE" },
    { id: "PRD-0040", name: "Industrial Zone Q3 Review", date: "2024-10-24 18:45:10", type: "BATCH" },
    { id: "PRD-0039", name: "Residential Flag Investigation", date: "2024-10-24 11:20:05", type: "SINGLE" },
    { id: "PRD-0038", name: "City Center Global Scan", date: "2024-10-23 08:00:00", type: "BATCH" },
  ];

  return (
    <div className="h-full bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-cyan-400 text-xs font-bold tracking-[0.2em] mb-2 uppercase">
            {slug} // Infrastructure // Archive
          </div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Database className="text-purple-500" size={32} />
            PREDICTION <span className="text-white/40">ARCHIVE</span>
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            Historical registry of all Random Forest classification runs. Access past prediction snapshots and audit reports.
          </p>
        </div>
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
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/70 hover:text-white px-4 py-2 rounded text-xs font-bold tracking-wider w-full md:w-auto transition-colors">
            <Filter size={14} /> FILTER
          </button>
        </div>
      </div>

      {/* THE LEDGER (TABLE) */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-black/40 border-b border-white/10 text-[10px] font-bold text-white/40 tracking-[0.1em] uppercase">
                <th className="p-4">Prediction ID</th>
                <th className="p-4">Prediction Name</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-white/80">
              {scanHistory.map((scan, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors group">
                  <td className="p-4 text-cyan-400 font-bold">{scan.id}</td>
                  <td className="p-4 text-white/90 font-sans tracking-wide">{scan.name}</td>
                  <td className="p-4 text-white/50">{scan.date}</td>
                  <td className="p-4">
                    <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] tracking-wider font-sans font-bold text-purple-400">
                      {scan.type}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href="#" 
                      className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-wider text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 px-3 py-1.5 rounded transition-all"
                    >
                      VIEW ANALYSIS <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="bg-black/40 border-t border-white/10 p-4 flex items-center justify-between text-xs text-white/40 font-bold tracking-wider">
          <div>SHOWING 1-5 OF 142 RECORDS</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 hover:text-white transition-colors">PREV</button>
            <button className="px-3 py-1 hover:text-white transition-colors">NEXT</button>
          </div>
        </div>
      </div>

    </div>
  );
}