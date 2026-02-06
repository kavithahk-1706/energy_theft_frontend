import React from 'react';
import { HardDrive, Activity, Zap, MapPin, AlertTriangle } from 'lucide-react';

export default function InfrastructurePage({ params }: { params: { orgSlug: string } }) {
  const { orgSlug } = params;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-(--neon-cyan)">GRID_ASSET_INVENTORY</h2>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            SCOPE: {orgSlug.replace('-', '_')} // PHYSICAL_LAYER_SECURITY
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 p-2 px-4 rounded-md text-right">
            <span className="block text-[9px] text-white/30 font-mono">TOTAL_NODES</span>
            <span className="text-xl font-bold font-mono">1,428</span>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-2 px-4 rounded-md text-right">
            <span className="block text-[9px] text-red-500/50 font-mono">ANOMALIES_DETECTED</span>
            <span className="text-xl font-bold font-mono text-red-500">14</span>
          </div>
        </div>
      </div>

      {/* ASSET TABLE */}
      <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/20 backdrop-blur-sm">
        <table className="w-full text-left text-[11px] font-mono border-collapse">
          <thead>
            <tr className="bg-white/5 text-white/40 border-b border-white/10">
              <th className="p-4 font-black">ASSET_ID</th>
              <th className="p-4 font-black">TYPE</th>
              <th className="p-4 font-black">LOCATION</th>
              <th className="p-4 font-black">LOAD_CAPACITY</th>
              <th className="p-4 font-black">HEALTH_INDEX</th>
              <th className="p-4 font-black">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-(--neon-cyan)/5 transition-colors group">
                <td className="p-4 text-white font-bold group-hover:text-(--neon-cyan)">#TX-700{i}</td>
                <td className="p-4 text-white/60">TRANSFORMER_P4</td>
                <td className="p-4 flex items-center gap-2 text-white/60">
                  <MapPin size={12} className="text-(--neon-cyan)" /> 
                  ZONE_{i}_PRIMARY
                </td>
                <td className="p-4">
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-(--neon-cyan) h-full" style={{ width: `${60 + i * 5}%` }} />
                  </div>
                </td>
                <td className="p-4">
                  <span className={i === 2 ? "text-red-500" : "text-green-500"}>
                    {i === 2 ? "CRITICAL (42%)" : "STABLE (98%)"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${i === 2 ? 'bg-red-500' : 'bg-(--neon-cyan)'}`} />
                    {i === 2 ? 'ATTENTION_REQ' : 'ONLINE'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER SYSTEM STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-white/10 bg-black/40 rounded-lg flex items-center gap-4">
           <Zap className="text-(--neon-cyan)" />
           <div>
             <span className="block text-[10px] text-white/40 font-mono">ENERGY_LOSS_BY_NODE</span>
             <span className="text-sm font-bold">14.2% AVG_ACROSS_GRID</span>
           </div>
        </div>
        <div className="p-4 border border-white/10 bg-black/40 rounded-lg flex items-center gap-4">
           <AlertTriangle className="text-red-500" />
           <div>
             <span className="block text-[10px] text-white/40 font-mono">TAMPER_EVENTS</span>
             <span className="text-sm font-bold text-red-500">3 NODES REPORTING VOLTAGE_DROP</span>
           </div>
        </div>
      </div>
    </div>
  );
}