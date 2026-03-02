"use client";

import React, { useState } from 'react';
import { 
  Terminal, Search, Filter, Download, 
  AlertTriangle, CheckCircle, Info, Database, Zap
} from 'lucide-react';

/**
 * MODULE: GLOBAL_AUDIT_LOGS
 * PURPOSE: Immutable forensic receipt of all platform activity.
 */

// --- MOCK DATABASE OF FORENSIC EVENTS ---
const MOCK_LOGS = [
  { id: 'LOG-8902', time: '13:42:05', date: '2026-02-14', org: 'tata-power', action: 'BATCH_PREDICTION', status: 'SUCCESS', details: 'Processed 15,200 records. 412 anomalies flagged.', latency: '1.2s' },
  { id: 'LOG-8901', time: '13:38:12', date: '2026-02-14', org: 'bescom', action: 'MODEL_INFERENCE', status: 'WARNING', details: 'Confidence threshold below 80% on Sector 4 data.', latency: '85ms' },
  { id: 'LOG-8900', time: '13:15:00', date: '2026-02-14', org: 'SYSTEM', action: 'DB_SYNC', status: 'SUCCESS', details: 'Global telemetry synchronized across all active nodes.', latency: '4.5s' },
  { id: 'LOG-8899', time: '12:55:33', date: '2026-02-14', org: 'adani', action: 'AUTH_FAILED', status: 'CRITICAL', details: 'Multiple invalid API key attempts from 192.168.1.4', latency: '-' },
  { id: 'LOG-8898', time: '12:40:10', date: '2026-02-14', org: 'demo-utility', action: 'DATA_INGESTION', status: 'SUCCESS', details: 'Uploaded 500 rows via manual CSV portal.', latency: '320ms' },
  { id: 'LOG-8897', time: '11:20:05', date: '2026-02-14', org: 'tata-power', action: 'THEFT_ALERT', status: 'WARNING', details: 'Meter bypass detected in Area_A104. Dispatch required.', latency: '45ms' },
  { id: 'LOG-8896', time: '10:05:00', date: '2026-02-14', org: 'SYSTEM', action: 'RF_RETRAIN', status: 'SUCCESS', details: 'Random Forest model weights updated based on confirmed reports.', latency: '12.4s' },
];

export default function HistoryLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // --- FILTERING LOGIC ---
  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesSearch = 
      log.org.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || log.status === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleExportLogs = () => {
    const headers = ['LOG_ID', 'TIMESTAMP', 'ORG_SLUG', 'ACTION', 'STATUS', 'LATENCY', 'DETAILS'];
    const csvRows = filteredLogs.map(l => 
      [l.id, `${l.date} ${l.time}`, l.org, l.action, l.status, l.latency, `"${l.details}"`].join(',')
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
          <div className="stat-pill"><Database size={12} className="text-cyan-400"/> <span>{MOCK_LOGS.length} EVENTS</span></div>
          <div className="stat-pill"><Zap size={12} className="text-purple-400"/> <span>REAL_TIME</span></div>
        </div>
      </header>

      {/* CONTROLS */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search logs by org, action, or details..." 
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
              <option value="WARNING">WARNING</option>
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
        <table className="log-table">
          <thead>
            <tr>
              <th className="w-32">TIMESTAMP</th>
              <th className="w-32">ORG_SLUG</th>
              <th className="w-40">EVENT_TYPE</th>
              <th className="w-24">STATUS</th>
              <th>EVENT_DETAILS</th>
              <th className="w-24 text-right">LATENCY</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="log-row">
                <td className="time-cell">
                  <span className="date">{log.date}</span>
                  <span className="time">{log.time}</span>
                </td>
                <td><span className="org-tag">{log.org}</span></td>
                <td className="action-cell">{log.action}</td>
                <td><StatusIcon status={log.status} /></td>
                <td className="details-cell">{log.details}</td>
                <td className="latency-cell">{log.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            <Terminal size={32} className="text-gray-600 mb-3" />
            <p>NO_LOGS_FOUND_FOR_QUERY</p>
          </div>
        )}
      </div>

    </div>
  );
}

// HELPER FOR STATUS ICONS
function StatusIcon({ status }: { status: string }) {
  if (status === 'SUCCESS') return <span className="status-badge success"><CheckCircle size={10} /> {status}</span>;
  if (status === 'WARNING') return <span className="status-badge warning"><AlertTriangle size={10} /> {status}</span>;
  if (status === 'CRITICAL') return <span className="status-badge critical"><AlertTriangle size={10} /> {status}</span>;
  return <span className="status-badge"><Info size={10} /> {status}</span>;
}

const HISTORY_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;600;700&display=swap');

  .history-root {
    min-height: 100vh;
    padding: 120px 5% 50px; 
    background: #030303;
    font-family: 'Inter', sans-serif;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 20px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    letter-spacing: -0.5px;
  }

  .header-stats { display: flex; gap: 10px; }
  .stat-pill {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
    padding: 6px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; color: #aaa;
  }

  /* CONTROLS */
  .controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
  }

  .search-box {
    flex: 1;
    max-width: 500px;
    background: #0a0a0a;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: 0.2s;
  }
  .search-box:focus-within { border-color: #7b00ff; background: rgba(123,0,255,0.02); }
  .search-box input {
    background: transparent; border: none; color: #fff; font-size: 12px; width: 100%; outline: none; font-family: 'JetBrains Mono';
  }

  .filter-group { display: flex; gap: 10px; align-items: center; }
  
  .custom-select-wrapper { position: relative; display: flex; align-items: center; }
  .select-dropdown {
    appearance: none;
    background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); color: #ccc;
    padding: 8px 30px 8px 35px; border-radius: 8px;
    font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700;
    cursor: pointer; outline: none; transition: 0.2s;
  }
  .select-dropdown:hover, .select-dropdown:focus { border-color: #7b00ff; color: #fff; }
  .select-dropdown option { background: #111; color: #fff; }

  .btn-icon {
    background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); color: #ccc;
    padding: 8px 15px; border-radius: 8px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s;
  }
  .btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: #fff; }

  /* TERMINAL TABLE */
  .terminal-container {
    background: #050505;
    border: 1px solid #1a1a1a;
    border-radius: 12px;
    overflow-x: auto;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
  }

  .log-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-family: 'JetBrains Mono', monospace;
  }

  .log-table th {
    background: #0a0a0a;
    padding: 12px 20px;
    font-size: 10px;
    color: #555;
    font-weight: 700;
    border-bottom: 1px solid #1a1a1a;
  }

  .log-row { border-bottom: 1px solid #111; transition: 0.1s; }
  .log-row:hover { background: #0a0a0a; }

  .log-table td { padding: 12px 20px; font-size: 11px; vertical-align: middle; }

  .time-cell { display: flex; flex-direction: column; gap: 2px; }
  .date { color: #555; font-size: 9px; }
  .time { color: #ccc; }

  .org-tag { color: #8b00ff; font-weight: 700; }
  .action-cell { color: #00f2ff; font-weight: 700; }
  .details-cell { color: #999; }
  .latency-cell { color: #555; text-align: right; }

  .status-badge {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 4px;
    font-size: 9px; font-weight: 700; background: #111; color: #666;
  }
  .status-badge.success { background: rgba(0,255,136,0.1); color: #00ff88; }
  .status-badge.warning { background: rgba(255,215,0,0.1); color: #ffd700; }
  .status-badge.critical { background: rgba(255,0,85,0.1); color: #ff0055; box-shadow: 0 0 10px rgba(255,0,85,0.2); }

  .empty-state { padding: 60px 20px; text-align: center; font-family: 'JetBrains Mono'; font-size: 12px; color: #444; display: flex; flex-direction: column; align-items: center; }

  .custom-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
  .custom-scroll::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
  .custom-scroll::-webkit-scrollbar-track { background: #050505; }

  @media (max-width: 768px) {
    .controls-bar { flex-direction: column; align-items: stretch; }
    .search-box { max-width: 100%; }
    .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
    .filter-group { width: 100%; display: flex; justify-content: space-between; }
  }
`;