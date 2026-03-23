"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { Target, Activity, ShieldAlert, Zap, ArrowRight, Database, Server, ExternalLink } from 'lucide-react';

export default function ClientOverviewDashboard({ params }: { params: Promise<{ orgSlug: string }> }) {
  // NEXT.JS 15 FIX: Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const slug = resolvedParams.orgSlug || 'demo-utility';

  const stats = [
    { label: "TOTAL METERS SCANNED", value: "489,204", icon: Database, color: "text-cyan-400", border: "border-cyan-400/30" },
    { label: "THEFT FLAGS DETECTED", value: "1,240", icon: ShieldAlert, color: "text-purple-400", border: "border-purple-400/30" },
    { label: "GRID INTEGRITY", value: "99.6%", icon: Activity, color: "text-emerald-400", border: "border-emerald-400/30" },
    { label: "ACTIVE REGIONS", value: "12", icon: Zap, color: "text-blue-400", border: "border-blue-400/30" }
  ];

  const recentScans = [
    { id: "PRD-0042", name: "Sector 7 Monthly Grid Audit", date: "2024-10-26 14:30:00", type: "BATCH" },
    { id: "PRD-0041", name: "Manual Inspection: MTR-8829", date: "2024-10-25 09:15:22", type: "SINGLE" },
    { id: "PRD-0040", name: "Industrial Zone Q3 Review", date: "2024-10-24 18:45:10", type: "BATCH" },
  ];

  return (
    <div className="h-full bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-cyan-400 text-xs font-bold tracking-[0.2em] mb-2 uppercase">
            {slug} // Operations Overview
          </div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Target className="text-purple-500" size={36} />
            SUDARSHAN <span className="text-white/40">CORE</span>
          </h1>
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
        
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold tracking-wide flex items-center gap-2">
              <Server size={18} className="text-purple-400" />
              RECENT AUDIT LOGS
            </h2>
            <Link href={`/${slug}/logs`} className="text-xs text-cyan-400 hover:underline tracking-wider">VIEW ALL</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-white/40 tracking-[0.1em] uppercase">
                  <th className="pb-3 font-bold">Prediction ID</th>
                  <th className="pb-3 font-bold">Prediction Name</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentScans.map((scan, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 font-mono text-cyan-400/80 font-bold">{scan.id}</td>
                    <td className="py-4 text-white/90 font-sans tracking-wide">{scan.name}</td>
                    <td className="py-4">
                      <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] tracking-wider font-sans font-bold text-purple-400">
                        {scan.type}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link 
                        href={`/${slug}/logs/${scan.id}`} 
                        className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-wider text-cyan-400 hover:text-cyan-300 opacity-50 group-hover:opacity-100 transition-all"
                      >
                        VIEW <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
                <div className="h-full bg-emerald-400 w-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs tracking-wider text-white/50 mb-2">
                <span>MODEL ACCURACY (RF)</span>
                <span className="text-cyan-400">99.61%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-cyan-400 w-[99.6%] shadow-[0_0_10px_rgba(0,242,255,0.5)]"></div>
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