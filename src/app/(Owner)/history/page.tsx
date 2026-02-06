"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, History, Search, ShieldAlert, Database, 
  Download, FileText, Layers, MousePointer2,
  Printer, Loader2, CheckCircle2
} from 'lucide-react';
import { 
  XAxis, Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { useUser } from "@clerk/nextjs";

// --- INITIAL DATA ---
const generateHistoryData = () => {
  const events = [];
  const start = new Date(2026, 0, 1);
  for (let i = 0; i < 100; i++) {
    const date = new Date(start.getTime() + i * 3600000);
    events.push({
      id: `EVT-${Math.random().toString(36).substring(7).toUpperCase()}`,
      timestamp: date.toLocaleString(),
      nodeId: `NODE-TX-${Math.floor(Math.random() * 999).toString(16).toUpperCase()}`,
      incident: Math.random() > 0.8 ? "CRITICAL_SPIKE" : "ROUTINE_SYNC",
      severity: Math.random() > 0.8 ? "HIGH" : "LOW",
      load: Math.floor(Math.random() * 500) + 100,
      delta: (Math.random() * 5).toFixed(2),
      integrity: (90 + Math.random() * 10).toFixed(1)
    });
  }
  return events.reverse();
};

const HISTORICAL_RECORDS = generateHistoryData();
const INITIAL_CHART_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  load: Math.floor(Math.random() * 800) + 200,
}));

export default function VoltGuardHistory() {
  const { user } = useUser();
  const [filter, setFilter] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(HISTORICAL_RECORDS[0]);
  const [liveData, setLiveData] = useState(INITIAL_CHART_DATA);
  const [reportStatus, setReportStatus] = useState<'IDLE' | 'COMPILING' | 'SUCCESS'>('IDLE');
  const [reportProgress, setReportProgress] = useState(0);

  // --- LIVE CHART LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prevData) => {
        const now = new Date();
        const newLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        const newPoint = {
          hour: newLabel,
          load: Math.floor(Math.random() * 800) + 200,
        };
        return [...prevData.slice(1), newPoint];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredRecords = useMemo(() => {
    return HISTORICAL_RECORDS.filter(r => 
      r.nodeId.includes(filter.toUpperCase()) || r.incident.includes(filter.toUpperCase())
    );
  }, [filter]);

  // --- DOWNLOAD LOGIC ---
  const handleGenerateReport = async (record: typeof selectedRecord) => {
    setReportStatus('COMPILING');
    setReportProgress(0);

    const stages = [20, 45, 70, 95, 100];
    for (const p of stages) {
      await new Promise(r => setTimeout(r, 300));
      setReportProgress(p);
    }

    const reportContent = `
VOLTGUARD FORENSIC ARCHIVE
==========================
REPORT_ID: ${record.id}
TIMESTAMP: ${record.timestamp}
OPERATOR: ${user?.firstName?.toUpperCase() || "SYSTEM"}

[NODE_DATA]
NODE_ID: ${record.nodeId}
INCIDENT: ${record.incident}
SEVERITY: ${record.severity}

[METRICS]
LOAD_PEAK: ${record.load}kW
INTEGRITY: ${record.integrity}%

END_OF_RECORD`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VOLTGUARD_${record.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportStatus('SUCCESS');
    setTimeout(() => setReportStatus('IDLE'), 3000);
  };

  return (
    <div className="history-root">
      <div className="vfx-scanline" />

      {/* OVERLAY */}
      {reportStatus !== 'IDLE' && (
        <div className="report-overlay">
          <div className="report-modal">
            {reportStatus === 'COMPILING' ? (
              <>
                <Loader2 className="animate-spin text-violet" size={40} />
                <h2>COMPILING_MANIFEST</h2>
                <div className="report-progress-container">
                  <div className="report-progress-bar" style={{ width: `${reportProgress}%` }} />
                </div>
                <span className="percent">{reportProgress}%</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="text-green-500" size={40} />
                <h2>ARCHIVE_DOWNLOADED</h2>
                <button className="btn-done" onClick={() => setReportStatus('IDLE')}>RETURN</button>
              </>
            )}
          </div>
        </div>
      )}
      
      <header className="history-header">
        <div className="h-left">
          <History className="text-violet" size={24} />
          <div className="h-titles">
            <h1>ARCHIVAL_RECORDS</h1>
            <p>OPERATOR: {user?.firstName?.toUpperCase() || "UNKNOWN"}</p>
          </div>
        </div>
        <div className="h-actions">
          <div className="search-wrap">
            <Search size={14} />
            <input placeholder="FILTER_LOGS..." onChange={(e) => setFilter(e.target.value)} />
          </div>
          <button className="btn-export" onClick={() => handleGenerateReport(selectedRecord)}>
             <Printer size={14} /> EXPORT_ALL
          </button>
        </div>
      </header>

      <main className="history-grid">
        {/* CHART WITH LIVE INDICATOR */}
        <section className="bento-tile chart-tile">
          <div className="tile-header flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <BarChart3 size={14}/> <span>LOAD_DISTRIBUTION_LIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="text-[8px] opacity-50">SYNCED</span>
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveData}>
                <defs>
                  <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#444" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #bc13fe', fontSize: '10px' }} />
                <Area type="monotone" dataKey="load" stroke="#bc13fe" fill="url(#histGrad)" strokeWidth={2} isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bento-tile logs-tile">
          <div className="tile-header"><Layers size={14}/> SYSTEM_EVENT_LOG</div>
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>NODE_ID</th>
                  <th>INCIDENT</th>
                  <th>LOAD</th>
                  <th>REPORT</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className={selectedRecord.id === rec.id ? 'active' : ''} onClick={() => setSelectedRecord(rec)}>
                    <td>{rec.timestamp}</td>
                    <td className="text-violet">{rec.nodeId}</td>
                    <td>{rec.incident}</td>
                    <td>{rec.load}kW</td>
                    <td>
                      <button className="row-report-btn" onClick={(e) => { e.stopPropagation(); handleGenerateReport(rec); }}>
                        <FileText size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="history-sidebar">
          <div className="bento-tile forensic-tile">
            <div className="tile-header"><Database size={14}/> FORENSIC_ANALYSIS</div>
            <div className="forensic-body">
              <div className="f-item">
                <label>RECORD_UUID</label>
                <span>{selectedRecord.id}</span>
              </div>
              <div className="f-graph">
                 <div className="graph-label flex justify-between text-[10px] mb-1">
                    <span>DATA_INTEGRITY</span>
                    <span className="text-violet">{selectedRecord.integrity}%</span>
                 </div>
                 <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${selectedRecord.integrity}%` }} />
                 </div>
              </div>
              <button className="btn-report-main" onClick={() => handleGenerateReport(selectedRecord)}>
                <Download size={14} /> DOWNLOAD_FORENSIC_REPORT
              </button>
            </div>
          </div>

          <div className="bento-tile inspector-tile">
            <div className="tile-header"><MousePointer2 size={14}/> SNAPSHOT</div>
            <div className="inspector-content">
              <div className="node-box">
                <ShieldAlert size={32} className={selectedRecord.severity === 'HIGH' ? 'text-red' : 'text-violet'} />
                <h3 className="text-sm font-bold mt-2">{selectedRecord.incident}</h3>
              </div>
              <div className="raw-data">
                <div className="raw-header">TELEMETRY_JSON</div>
                <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <style dangerouslySetInnerHTML={{ __html: HISTORY_STYLES }} />
    </div>
  );
}

const HISTORY_STYLES = `
  :root { --bg: #010103; --bento: #08080c; --violet: #bc13fe; --red: #ff0055; --border: rgba(188, 19, 254, 0.12); }
  .history-root { height: 100vh; display: flex; flex-direction: column; padding: 15px; gap: 15px; background: var(--bg); color: #fff; font-family: 'JetBrains Mono', monospace; overflow: hidden; position: relative; }
  .vfx-scanline { position: fixed; inset: 0; background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.05) 50%); background-size: 100% 4px; pointer-events: none; z-index: 100; }
  .report-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
  .report-modal { width: 320px; background: var(--bento); border: 1px solid var(--violet); border-radius: 20px; padding: 30px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 15px; }
  .report-progress-container { width: 100%; height: 4px; background: #111; border-radius: 2px; overflow: hidden; }
  .report-progress-bar { height: 100%; background: var(--violet); transition: width 0.3s ease; }
  .history-header { height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; background: var(--bento); border: 1px solid var(--border); border-radius: 16px; }
  .h-titles h1 { font-size: 16px; letter-spacing: 2px; margin: 0; }
  .h-titles p { font-size: 8px; opacity: 0.4; margin: 0; }
  .search-wrap { display: flex; align-items: center; gap: 10px; background: #000; padding: 5px 15px; border-radius: 8px; border: 1px solid var(--border); }
  .search-wrap input { background: none; border: none; color: #fff; outline: none; font-size: 11px; width: 150px; }
  .btn-export { background: var(--violet); color: #fff; border: none; padding: 8px 15px; border-radius: 8px; font-size: 10px; font-weight: bold; display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .history-grid { flex: 1; display: grid; grid-template-columns: 1fr 300px; grid-template-rows: 220px 1fr; gap: 15px; overflow: hidden; }
  .bento-tile { background: var(--bento); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
  .tile-header { padding: 10px 15px; font-size: 9px; font-weight: 900; color: var(--violet); border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.02); }
  .chart-body { flex: 1; padding: 15px; }
  .table-wrapper { flex: 1; overflow-y: auto; }
  .history-table { width: 100%; border-collapse: collapse; font-size: 10px; }
  .history-table th { text-align: left; padding: 10px 15px; background: rgba(0,0,0,0.3); color: var(--violet); position: sticky; top: 0; }
  .history-table td { padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.03); cursor: pointer; }
  .history-table tr.active { background: rgba(188, 19, 254, 0.1); border-left: 3px solid var(--violet); }
  .row-report-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #fff; padding: 4px; border-radius: 4px; cursor: pointer; }
  .history-sidebar { grid-row: 1 / span 2; grid-column: 2; display: flex; flex-direction: column; gap: 15px; }
  .forensic-body { padding: 15px; display: flex; flex-direction: column; gap: 15px; }
  .f-item label { display: block; font-size: 7px; opacity: 0.5; }
  .f-item span { font-size: 11px; font-weight: bold; }
  .progress-bar { height: 4px; background: #222; border-radius: 2px; }
  .progress-fill { height: 100%; background: var(--violet); border-radius: 2px; box-shadow: 0 0 10px var(--violet); }
  .btn-report-main { background: rgba(188, 19, 254, 0.1); border: 1px solid var(--violet); color: var(--violet); padding: 10px; border-radius: 8px; font-size: 10px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .inspector-content { padding: 15px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .node-box { text-align: center; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px dashed var(--border); }
  .raw-data { flex: 1; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
  .raw-header { font-size: 8px; padding: 5px; background: #111; color: var(--violet); }
  .raw-data pre { padding: 8px; font-size: 8px; color: #666; white-space: pre-wrap; height: 120px; overflow-y: auto; }
  .live-dot { width: 6px; height: 6px; background: var(--violet); border-radius: 50%; animation: blink 1.5s infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.8); } }
  .text-violet { color: var(--violet); }
  .text-red { color: var(--red); }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: var(--border); }
`;