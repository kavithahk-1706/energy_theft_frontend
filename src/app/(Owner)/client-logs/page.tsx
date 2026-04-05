"use client";

import React, { useState, useEffect } from 'react';
import { 
  Terminal, Search, Filter, Download, 
  AlertTriangle, CheckCircle, Info, Database, Zap, Loader2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function HistoryLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/logs`);
        const data = await res.json();
        if (data.success) setLogs(data.logs);
      } catch (e) {
        console.error("Failed to fetch logs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.tenant_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.prediction_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.mode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || log.status === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleExportLogs = () => {
    const headers = ['LOG_ID', 'DATE', 'TIME', 'TENANT_SLUG', 'PREDICTION_NAME', 'MODE', 'RECORDS_ANALYZED', 'THEFT_DETECTED', 'STATUS', 'EXEC_TIME'];
    const csvRows = filteredLogs.map(l =>
      [l.id, l.date, l.time, l.tenant_slug, `"${l.prediction_name}"`, l.mode, l.records_analyzed, l.theft_detected, l.status, l.execution_time].join(',')
    );
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `system_audit_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="history-root">
      <style dangerouslySetInnerHTML={{ __html: HISTORY_STYLES }} />

      <header className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Terminal className="text-purple-500" size={28} />
            GLOBAL_AUDIT_LOGS
          </h1>
          <p className="page-sub text-gray-400 font-mono text-xs mt-2 tracking-widest">
            IMMUTABLE_FORENSIC_RECORD // SYSTEM_AND_TENANT_ACTIVITY
          </p>
        </div>

        <div className="header-stats">
          <div className="stat-pill"><Database size={12} className="text-cyan-400" /> <span>{logs.length} EVENTS</span></div>
          <div className="stat-pill"><Zap size={12} className="text-purple-400" /> <span>LIVE_DATA</span></div>
        </div>
      </header>

      {/* CONTROLS */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by tenant, prediction name, or mode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="custom-select-wrapper">
            <Filter size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
            <select
              className="select-dropdown pl-8"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">ALL EVENTS</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
          <button className="btn-icon" onClick={handleExportLogs}>
            <Download size={16} /> EXPORT_DUMP
          </button>
        </div>
      </div>

      {/* TERMINAL LOG TABLE */}
      <div className="terminal-container custom-scroll">
        {loading ? (
          <div className="empty-state">
            <Loader2 size={32} className="text-gray-600 mb-3 animate-spin" />
            <p>FETCHING_FORENSIC_RECORDS...</p>
          </div>
        ) : (
          <table className="log-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>TENANT_SLUG</th>
                <th>PREDICTION_NAME</th>
                <th>MODE</th>
                <th>RECORDS</th>
                <th>THEFT</th>
                <th>STATUS</th>
                <th className="text-right">EXEC_TIME</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="log-row">
                  <td className="time-cell">
                    <span className="date">{log.date}</span>
                    <span className="time">{log.time}</span>
                  </td>
                  <td><span className="org-tag">{log.tenant_slug}</span></td>
                  <td className="name-cell">{log.prediction_name}</td>
                  <td><span className={`mode-tag ${log.mode === 'BATCH' ? 'batch' : 'single'}`}>{log.mode}</span></td>
                  <td className="font-mono text-cyan-400 text-xs">{log.records_analyzed}</td>
                  <td className={`font-mono text-xs font-bold ${log.theft_detected > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {log.theft_detected}
                  </td>
                  <td><StatusIcon status={log.status} /></td>
                  <td className="latency-cell">{log.execution_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredLogs.length === 0 && (
          <div className="empty-state">
            <Terminal size={32} className="text-gray-600 mb-3" />
            <p>NO_LOGS_FOUND_FOR_QUERY</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'SUCCESS') return <span className="status-badge success"><CheckCircle size={10} /> {status}</span>;
  if (status === 'CRITICAL') return <span className="status-badge critical"><AlertTriangle size={10} /> {status}</span>;
  return <span className="status-badge"><Info size={10} /> {status}</span>;
}

const HISTORY_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;600;700&display=swap');

  .history-root { min-height: 100vh; padding: 120px 5% 50px; background: #030303; font-family: 'Inter', sans-serif; }

  .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
  .page-title { font-size: 28px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.5px; }

  .header-stats { display: flex; gap: 10px; }
  .stat-pill { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; color: #aaa; }

  .controls-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 20px; }
  .search-box { flex: 1; max-width: 500px; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 15px; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
  .search-box:focus-within { border-color: #7b00ff; background: rgba(123,0,255,0.02); }
  .search-box input { background: transparent; border: none; color: #fff; font-size: 12px; width: 100%; outline: none; font-family: 'JetBrains Mono'; }

  .filter-group { display: flex; gap: 10px; align-items: center; }
  .custom-select-wrapper { position: relative; display: flex; align-items: center; }
  .select-dropdown { appearance: none; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); color: #ccc; padding: 8px 30px 8px 35px; border-radius: 8px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; cursor: pointer; outline: none; transition: 0.2s; }
  .select-dropdown:hover, .select-dropdown:focus { border-color: #7b00ff; color: #fff; }
  .select-dropdown option { background: #111; color: #fff; }

  .btn-icon { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); color: #ccc; padding: 8px 15px; border-radius: 8px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
  .btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: #fff; }

  .terminal-container { background: #050505; border: 1px solid #1a1a1a; border-radius: 12px; overflow-x: auto; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }

  .log-table { width: 100%; border-collapse: collapse; text-align: left; font-family: 'JetBrains Mono', monospace; }
  .log-table th { background: #0a0a0a; padding: 12px 20px; font-size: 10px; color: #555; font-weight: 700; border-bottom: 1px solid #1a1a1a; }
  .log-row { border-bottom: 1px solid #111; transition: 0.1s; }
  .log-row:hover { background: #0a0a0a; }
  .log-table td { padding: 12px 20px; font-size: 11px; vertical-align: middle; }

  .time-cell { display: flex; flex-direction: column; gap: 2px; }
  .date { color: #555; font-size: 9px; }
  .time { color: #ccc; }

  .org-tag { color: #8b00ff; font-weight: 700; }
  .name-cell { color: #aaa; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .mode-tag { padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; }
  .mode-tag.batch { background: rgba(0,242,255,0.1); color: #00f2ff; }
  .mode-tag.single { background: rgba(123,0,255,0.1); color: #b366ff; }

  .latency-cell { color: #555; text-align: right; }

  .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; background: #111; color: #666; }
  .status-badge.success { background: rgba(0,255,136,0.1); color: #00ff88; }
  .status-badge.critical { background: rgba(255,0,85,0.1); color: #ff0055; box-shadow: 0 0 10px rgba(255,0,85,0.2); }

  .empty-state { padding: 60px 20px; text-align: center; font-family: 'JetBrains Mono'; font-size: 12px; color: #444; display: flex; flex-direction: column; align-items: center; }

  .custom-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
  .custom-scroll::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
  .custom-scroll::-webkit-scrollbar-track { background: #050505; }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .animate-spin { animation: spin 1s linear infinite; }

  @media (max-width: 768px) {
    .controls-bar { flex-direction: column; align-items: stretch; }
    .search-box { max-width: 100%; }
    .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
    .filter-group { width: 100%; justify-content: space-between; }
  }
`;