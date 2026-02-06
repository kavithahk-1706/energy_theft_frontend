"use client";
import React from 'react';
import { 
  Database, Search, Filter, Download, 
  ChevronRight, HardDrive, FileText, ExternalLink 
} from 'lucide-react';

export default function CaptureLogs() {
  const logs = [
    { id: 'LOG-8821', type: 'THEFT_CONFIRMED', node: 'Sector 4', date: '04/02/2026', gain: '+450 XP' },
    { id: 'LOG-8790', type: 'AUDIT_COMPLETE', node: 'Neon District', date: '01/02/2026', gain: '+200 XP' },
    { id: 'LOG-8655', type: 'MAINTENANCE', node: 'Hub 7', date: '28/01/2026', gain: '+600 XP' },
  ];

  return (
    <div className="bento-grid">
      
      {/* 1. DATA STORAGE STATUS (Medium) */}
      <div className="bento-box col-span-2 row-span-1">
        <div className="box-label">STORAGE_INTEGRITY</div>
        <div className="flex items-center gap-6 mt-4">
          <HardDrive size={40} className="text-pink-500" />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] mb-1">
              <span>LOCAL_BUFFER</span>
              <span>82%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 shadow-[0_0_10px_#ff00ff]" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTIONS (Medium) */}
      <div className="bento-box col-span-2 row-span-1">
        <div className="box-label">LOG_UTILITIES</div>
        <div className="flex gap-4 mt-4">
          <button className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center hover:border-pink-500 transition-all">
            <Download size={18} className="text-pink-500 mb-1" />
            <span className="text-[8px] font-bold uppercase">Export_CSV</span>
          </button>
          <button className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center hover:border-pink-500 transition-all">
            <FileText size={18} className="text-pink-500 mb-1" />
            <span className="text-[8px] font-bold uppercase">Request_Cert</span>
          </button>
        </div>
      </div>

      {/* 3. THE DATA LOG TABLE (Large - Spans 4 Cols) */}
      <div className="bento-box col-span-4 row-span-3">
        <div className="flex justify-between items-center mb-6">
          <div className="box-label">CHRONOLOGICAL_CAPTURE_LOGS</div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
              <input 
                type="text" 
                placeholder="SEARCH_LOGS..." 
                className="bg-black/40 border border-white/5 rounded-full py-1.5 pl-8 pr-4 text-[10px] focus:border-pink-500 outline-none w-48"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <table className="w-full text-left text-[11px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-600 uppercase tracking-widest text-[9px]">
                <th className="pb-4 pl-4">Log_Reference</th>
                <th className="pb-4">Incident_Type</th>
                <th className="pb-4">Location_Node</th>
                <th className="pb-4">Timestamp</th>
                <th className="pb-4 text-right pr-4">XP_Yield</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="group cursor-pointer">
                  <td className="bg-white/5 py-4 pl-4 rounded-l-2xl border-y border-l border-white/5 group-hover:border-pink-500/30 transition-all">
                    <span className="font-bold text-white group-hover:text-pink-500">{log.id}</span>
                  </td>
                  <td className="bg-white/5 border-y border-white/5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${log.type === 'THEFT_CONFIRMED' ? 'bg-red-500/10 text-red-500' : 'bg-pink-500/10 text-pink-500'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="bg-white/5 border-y border-white/5 text-gray-400 font-mono">
                    {log.node}
                  </td>
                  <td className="bg-white/5 border-y border-white/5 text-gray-500 font-mono">
                    {log.date}
                  </td>
                  <td className="bg-white/5 py-4 pr-4 rounded-r-2xl border-y border-r border-white/5 group-hover:border-pink-500/30 text-right">
                    <span className="text-pink-500 font-black">{log.gain}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-auto pt-6 flex justify-center border-t border-white/5">
          <button className="text-[9px] text-gray-600 flex items-center gap-2 hover:text-pink-500 transition-all">
            LOAD_OLDER_DATA_ARCHIVES <ExternalLink size={10} />
          </button>
        </div>
      </div>

    </div>
  );
}