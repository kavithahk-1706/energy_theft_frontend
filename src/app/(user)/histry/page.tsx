"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  History, ArrowLeft, Download, Search, TrendingUp, 
  CheckCircle2, Clock, Zap, Activity, ShieldAlert,
  MapPin, User, ChevronRight, BarChart3, FileText, 
  Calendar, Database, Cpu, Globe, ArrowUpRight, 
  Maximize2, Radio, Server, Fingerprint, RefreshCw,
  Share2
} from 'lucide-react';

interface BillingRecord {
  id: string;
  period: string;
  year: string;
  prev: string;
  curr: string;
  usage: number;
  cost: string;
  status: string;
}

export default function VoltGuardApex() {
  const [view, setView] = useState<'dashboard' | 'history'>('dashboard');
  const [activeYear, setActiveYear] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const METER_ID = "MTR-100001";
  const USER_NAME = "PRUTHVI VOJJALA";

  const billingHistory = useMemo((): BillingRecord[] => {
    const data: BillingRecord[] = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let startReading = 2274.67;
    for (let year = 2022; year <= 2026; year++) {
      for (let m = 0; m < 12; m++) {
        if (year === 2026 && m > 0) break; 
        const usage = Math.floor(Math.random() * (250) + 350); 
        const cost = (usage * 0.16).toFixed(2);
        const currReading = startReading + usage;
        data.unshift({
          id: `VG-${year}${(m + 1).toString().padStart(2, '0')}`,
          period: `${months[m]} ${year}`,
          year: year.toString(),
          prev: startReading.toFixed(2),
          curr: currReading.toFixed(2),
          usage: usage,
          cost: cost,
          status: (year === 2026 || (year === 2025 && m > 9)) ? "Pending" : "Paid",
        });
        startReading = currReading;
      }
    }
    return data;
  }, []);

  // 2. ADD THIS: The missing filteredData logic
  const filteredData = useMemo(() => {
    return billingHistory.filter(item => {
      const matchesSearch = 
        item.period.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = activeYear === 'All' || item.year === activeYear;
      return matchesSearch && matchesYear;
    });
  }, [billingHistory, searchTerm, activeYear]);

  return (
    <div className="apex-terminal">
      <style dangerouslySetInnerHTML={{ __html: APEX_CSS }} />
      
      {view === 'dashboard' ? (
        <main className="dash-container">
          {/* --- TOP LEVEL SYSTEM UTILITY BAR --- */}
          <div className="system-utility-bar">
             <div className="util-item"><Radio size={12} className="pulse-icon" /> <span>SIGNAL: 98%</span></div>
             <div className="util-item"><Server size={12} /> <span>UPTIME: {Math.floor(uptime/60)}m {uptime%60}s</span></div>
             <div className="util-item"><RefreshCw size={12} /> <span>SYNC: v4.0.12</span></div>
          </div>

          <header className="main-nav">
            <div className="nav-left">
              <div className="brand-stack">
                <div className="brand-logo"><Zap size={18} fill="currentColor" /></div>
                <div className="brand-text">
                  <h1>VOLTGUARD <span className="text-primary">CORE</span></h1>
                  <div className="sub-line">ENERGY_MANAGEMENT_TERMINAL</div>
                </div>
              </div>
            </div>
            
            <div className="nav-right">
              <div className="user-access-card">
                <div className="fingerprint-box"><Fingerprint size={20} /></div>
                <div className="user-meta">
                  <span className="user-name">{USER_NAME}</span>
                  <span className="access-id">RANK_01 // SEC_AUTH</span>
                </div>
              </div>
            </div>
          </header>

          <div className="apex-grid">
            {/* 1. THE DATA ENGINE (HISTORY) */}
            <section className="tile tile-main history-engine" onClick={() => setView('history')}>
              <div className="module-header">
                <div className="module-title">
                  <History size={16} />
                  <span>TEMPORAL_DATA_ENGINE</span>
                </div>
                <div className="module-action"><Maximize2 size={14} /></div>
              </div>

              <div className="engine-body">
                <div className="stats-row">
                  <div className="stat-pill">
                    <label>ARCHIVE_SIZE</label>
                    <div className="val">49 <small>LOGS</small></div>
                  </div>
                  <div className="stat-pill">
                    <label>NET_EFFICIENCY</label>
                    <div className="val">98.4%</div>
                  </div>
                  <div className="stat-pill">
                    <label>NODE_HEALTH</label>
                    <div className="val text-success">OPTIMAL</div>
                  </div>
                </div>

                <div className="data-preview-list">
                  <div className="list-header">
                    <span>TX_ID</span><span>TIMESCALE</span><span>USAGE</span><span>STATUS</span>
                  </div>
                  {billingHistory.slice(0, 5).map(item => (
                    <div key={item.id} className="list-row">
                      <span className="mono">{item.id}</span>
                      <span className="period">{item.period}</span>
                      <span className="usage">{item.usage} <small>kWh</small></span>
                      <span className={`status-dot ${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="module-footer">
                <span>EXEC_READ_ALL_ARCHIVE</span>
                <ChevronRight size={14} />
              </div>
            </section>

            {/* 2. REALTIME TELEMETRY SCANNER */}
            <section className="tile telemetry-scanner">
              <div className="module-header">
                <div className="module-title"><Activity size={16} /><span>LIVE_SCANNER</span></div>
              </div>
              <div className="v-reading">
                <div className="v-label">SYSTEM_VOLTAGE</div>
                <div className="v-number">231.84 <small>VAC</small></div>
                <div className="v-graph">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="v-bar" style={{height: `${40 + Math.random() * 60}%`}} />
                  ))}
                </div>
              </div>
              <div className="load-matrix">
                <div className="m-item">
                  <label>CURRENT_LOAD</label>
                  <div className="m-val">0.84 <small>kW</small></div>
                </div>
                <div className="m-item">
                  <label>PEAK_24H</label>
                  <div className="m-val">4.21 <small>kW</small></div>
                </div>
              </div>
            </section>

            {/* 3. NODE GEOLOCATION */}
            <section className="tile location-node">
               <div className="map-view">
                  <div className="scanner-line" />
                  <div className="node-point" />
                  <MapPin size={24} className="pin" />
                  <div className="location-overlay">
                    <Globe size={12} />
                    <span>BANGALORE_CORE_01</span>
                  </div>
               </div>
            </section>

            {/* 4. SECURITY FIREWALL */}
            <section className="tile security-vault">
              <div className="vault-header">
                <ShieldAlert size={20} className="text-primary" />
                <div className="vault-title">
                  <strong>SEC_PRO_ENABLED</strong>
                  <p>AI_THREAT_DETECTION</p>
                </div>
              </div>
              <div className="vault-actions">
                <button className="btn-vault">ARM_ALARM</button>
                <button className="btn-vault danger">EMERGENCY_CUT</button>
              </div>
            </section>

            {/* 5. SYSTEM RESOURCE MONITOR */}
            <section className="tile resource-monitor">
               <div className="module-title">SYSTEM_RESOURCE</div>
               <div className="res-grid">
                  <div className="res-item">
                    <label>CPU</label>
                    <div className="res-bar"><div style={{width: '24%'}} /></div>
                  </div>
                  <div className="res-item">
                    <label>MEM</label>
                    <div className="res-bar"><div style={{width: '42%'}} /></div>
                  </div>
               </div>
            </section>
          </div>
        </main>
      ) : (
        /* ================= HISTORY PAGE ================= */
        <main className="history-interface">
          <aside className="sidebar">
            <button className="back-link" onClick={() => setView('dashboard')}>
              <ArrowLeft size={18} /> RETURN_TO_DASH
            </button>
            
            <div className="sidebar-section">
              <label>TEMPORAL_ARCHIVE</label>
              <nav className="year-nav">
                {['All', '2026', '2025', '2024', '2023', '2022'].map(y => (
                  <button 
                    key={y} 
                    className={activeYear === y ? 'active' : ''} 
                    onClick={() => setActiveYear(y)}
                  >
                    <Calendar size={14} /> {y} {y === 'All' ? 'Records' : 'Archive'}
                  </button>
                ))}
              </nav>
            </div>

            <div className="sidebar-stats">
              <div className="s-stat">
                <label>TOTAL_EXPENDITURE</label>
                <div className="v">$4,291.10</div>
              </div>
              <div className="s-stat">
                <label>SYSTEM_UPTIME</label>
                <div className="v">99.98%</div>
              </div>
            </div>
          </aside>

          <section className="history-main">
            <header className="history-header">
              <div className="search-bar">
                <Search size={18} />
                <input 
                  placeholder="FILTER_RECORDS_BY_DATE_OR_ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="header-actions">
                <button className="btn-icon-sq"><Download size={18} /></button>
                <button className="btn-icon-sq"><Share2 size={18} /></button>
              </div>
            </header>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PERIOD</th>
                    <th>PREV_READ</th>
                    <th>CURR_READ</th>
                    <th>USAGE_KWH</th>
                    <th>BILLING_TOTAL</th>
                    <th>STATUS</th>
                    <th>DATA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(row => (
                    <tr key={row.id}>
                      <td className="font-bold">{row.period}</td>
                      <td className="text-mono">{row.prev}</td>
                      <td className="text-mono">{row.curr}</td>
                      <td>
                        <div className="usage-cell">
                          <span>{row.usage}</span>
                          <div className="usage-graph"><div className="bar" style={{width: `${(row.usage/600)*100}%`}} /></div>
                        </div>
                      </td>
                      <td className="text-primary text-mono">${row.cost}</td>
                      <td>
                        <span className={`status-box ${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td><button className="btn-minimal"><FileText size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

const APEX_CSS = `
  /**
 * VOLTGUARD APEX - INDUSTRIAL DATA ARCHITECTURE
 * VERSION: 4.2.0 (ENTERPRISE CORE)
 * DESIGN PHILOSOPHY: HIGH-DENSITY, LOW-LATENCY, NOIR AESTHETIC
 */

/* =========================================
   1. SYSTEM DESIGN TOKENS
   ========================================= */
:root {
  /* Surface Layers */
  --bg-void: #020203;
  --bg-core: #050507;
  --bg-surface: #0a0a0c;
  --bg-elevated: #111114;
  --bg-glass: rgba(10, 10, 12, 0.7);
  
  /* Brand Spectrum */
  --primary: #d946ef;
  --primary-rgb: 217, 70, 239;
  --primary-glow: rgba(217, 70, 239, 0.35);
  --primary-muted: rgba(217, 70, 239, 0.08);
  
  /* Status Engine */
  --success: #10b981;
  --success-glow: rgba(16, 185, 129, 0.2);
  --danger: #ef4444;
  --danger-glow: rgba(239, 68, 68, 0.2);
  --warning: #f59e0b;
  --info: #3b82f6;

  /* Borders & Rules */
  --border-ghost: rgba(255, 255, 255, 0.03);
  --border-dim: rgba(255, 255, 255, 0.07);
  --border-med: rgba(255, 255, 255, 0.12);
  --border-bright: rgba(255, 255, 255, 0.2);
  
  /* Typography */
  --font-main: 'Inter', -apple-system, system-ui, sans-serif;
  --font-data: 'JetBrains Mono', 'Fira Code', monospace;

  /* Motion Physics */
  --spring: cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* =========================================
   2. FOUNDATION & RESET
   ========================================= */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: var(--bg-void);
  color: #f4f4f5;
  font-family: var(--font-main);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Custom High-Performance Scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: var(--bg-void); }
::-webkit-scrollbar-thumb { 
  background: var(--border-med); 
  border-radius: 10px; 
}
::-webkit-scrollbar-thumb:hover { background: var(--primary); }

/* =========================================
   3. MASTER LAYOUT CONTAINERS
   ========================================= */
.apex-terminal {
  min-height: 100vh;
  padding: 2rem;
  background-image: 
    radial-gradient(at 0% 0%, var(--primary-muted) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);
  display: flex;
  flex-direction: column;
}

.dash-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* =========================================
   4. SYSTEM UTILITY BAR & HEADER
   ========================================= */
.system-utility-bar {
  display: flex;
  gap: 2rem;
  padding: 0.6rem 1.2rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 8px;
  margin-bottom: 2rem;
  backdrop-filter: blur(12px);
}

.util-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-data);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #71717a;
}

.pulse-icon {
  color: var(--success);
  filter: drop-shadow(0 0 4px var(--success));
  animation: hardware-pulse 2s infinite;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.brand-stack {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand-logo {
  width: 48px;
  height: 48px;
  background: #000;
  border: 1px solid var(--primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  box-shadow: 0 0 20px var(--primary-muted);
}

.brand-text h1 {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
}

.text-primary { color: var(--primary); }

.user-access-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 12px;
}

.user-name { font-weight: 700; font-size: 0.85rem; display: block; }
.access-id { font-family: var(--font-data); font-size: 0.6rem; color: #52525b; }

/* =========================================
   5. BENTO GRID SYSTEM
   ========================================= */
.apex-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 1.5rem;
}

.tile {
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 24px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.4s var(--spring);
  overflow: hidden;
}

.tile:hover {
  border-color: var(--primary);
  background: var(--bg-elevated);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px -20px #000;
}

.tile-main {
  grid-column: span 2;
  grid-row: span 2;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.module-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-data);
  font-size: 0.7rem;
  font-weight: 700;
  color: #52525b;
  text-transform: uppercase;
}

/* =========================================
   6. DATA VISUALIZATION COMPONENTS
   ========================================= */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-pill {
  background: rgba(0,0,0,0.3);
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid var(--border-ghost);
}

.stat-pill label {
  font-size: 0.6rem;
  text-transform: uppercase;
  color: #71717a;
  letter-spacing: 0.05em;
}

.stat-pill .val {
  font-family: var(--font-data);
  font-size: 1.5rem;
  font-weight: 800;
  margin-top: 0.5rem;
}

.v-reading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
}

.v-number {
  font-family: var(--font-data);
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--primary);
  text-shadow: 0 0 25px var(--primary-glow);
}

.v-graph {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 40px;
  margin-top: 1.5rem;
}

.v-bar {
  flex: 1;
  background: var(--primary);
  opacity: 0.2;
  border-radius: 1px;
}

/* =========================================
   7. LISTS & TABLES
   ========================================= */
.data-preview-list {
  background: rgba(0,0,0,0.2);
  border-radius: 16px;
  border: 1px solid var(--border-ghost);
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 1fr 0.8fr;
  padding: 0.75rem 1.25rem;
  font-size: 0.6rem;
  font-family: var(--font-data);
  color: #52525b;
  border-bottom: 1px solid var(--border-dim);
}

.list-row {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 1fr 0.8fr;
  padding: 0.85rem 1.25rem;
  font-size: 0.8rem;
  border-bottom: 1px solid var(--border-ghost);
  transition: background 0.2s;
}

.list-row:hover { background: rgba(255,255,255,0.02); }

.mono { font-family: var(--font-data); color: #71717a; }

.status-dot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-dot.paid { color: var(--success); }
.status-dot.pending { color: var(--primary); }

/* =========================================
   8. INTERACTIVE MODULES (MAP/SECURITY)
   ========================================= */
.map-view {
  height: 200px;
  background: #000;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.scanner-line {
  position: absolute;
  width: 100%;
  height: 1px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
  animation: laser-scan 4s linear infinite;
  z-index: 2;
}

.vault-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-vault {
  width: 100%;
  padding: 0.8rem;
  background: var(--bg-void);
  border: 1px solid var(--border-med);
  color: #fff;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s;
}

.btn-vault.danger { border-color: var(--danger); color: var(--danger); }
.btn-vault:hover { background: var(--border-dim); border-color: var(--primary); }

/* =========================================
   9. HISTORY INTERFACE SYSTEM
   ========================================= */
.history-interface {
  display: flex;
  gap: 2rem;
  height: calc(100vh - 4rem);
}

.sidebar {
  width: 280px;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  color: #f4f4f5;
  font-weight: 800;
  margin-bottom: 3rem;
  cursor: pointer;
  font-size: 0.8rem;
}

.year-nav { display: flex; flex-direction: column; gap: 0.5rem; }

.year-nav button {
  text-align: left;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: transparent;
  border: 1px solid transparent;
  color: #71717a;
  transition: all 0.2s;
}

.year-nav button.active {
  background: var(--primary-muted);
  border-color: var(--primary-glow);
  color: var(--primary);
}

.history-main { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }

.history-header {
  background: var(--bg-surface);
  padding: 1rem 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--border-dim);
  display: flex;
  justify-content: space-between;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.search-bar input {
  background: transparent;
  border: none;
  color: #fff;
  width: 100%;
  outline: none;
}

.data-table-container {
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 24px;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 1.25rem;
  text-align: left;
  font-family: var(--font-data);
  font-size: 0.65rem;
  color: #52525b;
  text-transform: uppercase;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid var(--border-dim);
}

.data-table td {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-ghost);
  font-size: 0.85rem;
}

.usage-graph {
  height: 4px;
  background: var(--bg-void);
  border-radius: 2px;
  width: 80px;
  overflow: hidden;
}

.usage-graph .bar { height: 100%; background: var(--primary); }

/* =========================================
   10. ANIMATION KEYFRAMES
   ========================================= */
@keyframes hardware-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

@keyframes laser-scan {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

@keyframes tile-entry {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* =========================================
   11. RESPONSIVE ARCHITECTURE
   ========================================= */
@media (max-width: 1200px) {
  .apex-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .apex-grid { grid-template-columns: 1fr; }
  .history-interface { flex-direction: column; height: auto; }
  .sidebar { width: 100%; }
}
`;