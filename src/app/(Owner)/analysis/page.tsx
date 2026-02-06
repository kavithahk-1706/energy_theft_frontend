"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Zap, ShieldAlert, Activity, Search, Globe, Cpu, Layers,
  Terminal, Database, Network, ChevronRight, Settings, Bell, 
  RefreshCcw, Power, User, ShieldCheck, HardDrive, Filter,
  Download, Maximize2, ExternalLink, AlertTriangle, Eye,
  Lock, MousePointer2, Briefcase, Map as MapIcon,
  Sliders,
  Save,
  RotateCcw,
  UserPlus,
  FileText,
  ZapOff,
  Share2,
  CheckCircle2,
  Hash,
  Clock,
  CheckCircle,
  LayoutGrid,
  BarChart3,
  Fingerprint,
  TrendingUp,
  Box,
  PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, ComposedChart, Scatter, 
  CartesianGrid, Cell, PieChart, Pie
} from 'recharts';

// --- DATA SOURCE ---
import energyData from '../../../../public/data/energy_data.json';

/**
 * VOLTGUARD ENTERPRISE ARCHITECTURE v5.0
 * PART 1: GLOBAL STATE & CORE STYLING
 */

// --- TYPES ---
interface TelemetryPoint {
  day: number;
  area_id: number;
  energy_consumed: number;
  voltage: number;
  current: number;
  anomaly: number;
  theft_detected: string;
  ts?: string;
}

interface SystemConfig {
  refreshRate: number;
  isSimulating: boolean;
  securityLevel: 'L1' | 'L2' | 'L3' | 'L4';
  theme: 'stealth' | 'paper' | 'high-contrast';
}

export default function VoltGuardEnterpriseOS() {
  // 1. Core State Management
  const [mounted, setMounted] = useState(false);
  const [stream, setStream] = useState<TelemetryPoint[]>([]);
  const [cursor, setCursor] = useState(0);
  const [activeView, setActiveView] = useState('DASHBOARD_LIVE');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  // 2. System Configuration
  const [config, setConfig] = useState<SystemConfig>({
    refreshRate: 1200,
    isSimulating: true,
    securityLevel: 'L4',
    theme: 'stealth'
  });

  // 3. UI Transient States
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 4. Telemetry Engine (Logic isolated for performance)
  const processNextFrame = useCallback(() => {
    setCursor(prev => {
      const next = (prev + 1) % energyData.length;
      const entry = energyData[next] as TelemetryPoint;
      
      setStream(curr => {
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        return [...curr, { ...entry, ts: timestamp }].slice(-100); // 100 points for deep analysis
      });

      if (entry.theft_detected === "Yes") {
        setIsAlertActive(true);
        setTerminalLogs(prevLogs => [
          `>> [DETECTION] ANOMALY AT SEC_0${entry.area_id} | VOLT_DROP: ${entry.voltage}V`,
          ...prevLogs
        ].slice(0, 50));
        setTimeout(() => setIsAlertActive(false), 1200);
      }

      return next;
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    const engine = setInterval(processNextFrame, config.refreshRate);
    return () => clearInterval(engine);
  }, [processNextFrame, config.refreshRate]);

  if (!mounted) return <div className="vg-boot-screen">INITIALIZING_VOLTGUARD_CORE...</div>;

  return (
    <div className={`vg-os-root ${sidebarCollapsed ? 'sidebar-min' : ''} theme-${config.theme}`}>
      <style dangerouslySetInnerHTML={{ __html: VoltGuardCoreStyles }} />
      
      {/* 5. GLOBAL NAVIGATION (CLERK-READY) */}
      <aside className="vg-sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">
            <Zap fill="var(--neon-pink)" stroke="none" size={24} />
          </div>
          <div className="brand-text">
            <span className="name">VOLTGUARD <small>OS</small></span>
            <span className="version">BUILD_5.0.2_ENT</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavGroup label="MONITORING_ARRAY">
            <NavItem 
              icon={<Activity size={18}/>} 
              label="Live Flux" 
              active={activeView === 'DASHBOARD_LIVE'} 
              onClick={() => setActiveView('DASHBOARD_LIVE')} 
            />
            <NavItem 
              icon={<MapIcon size={18}/>} 
              label="Spatial Topology" 
              badge="LIVE"
              onClick={() => setActiveView('MAP_VIEW')} 
            />
            <NavItem 
              icon={<Database size={18}/>} 
              label="Historical Archive" 
              onClick={() => setActiveView('ARCHIVE')} 
            />
          </NavGroup>

          <NavGroup label="SECURITY_PROTOCOL">
            <NavItem 
              icon={<ShieldAlert size={18}/>} 
              label="Detection Engine" 
              alert={isAlertActive}
              onClick={() => setActiveView('SECURITY')} 
            />
            <NavItem icon={<Lock size={18}/>} label="Access Logs" />
            <NavItem icon={<Network size={18}/>} label="Node Integrity" />
          </NavGroup>

          <NavGroup label="SYSTEM_ADMIN">
            <NavItem icon={<Settings size={18}/>} label="Configuration" />
            <NavItem icon={<Terminal size={18}/>} label="Console" />
          </NavGroup>
        </nav>

        <div className="sidebar-footer">
          <div className="security-badge">
            <ShieldCheck size={14} className="icon-green" />
            <span>SEC_LEVEL: {config.securityLevel}</span>
          </div>
          <button className="collapse-trigger" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <ChevronRight size={14} />
          </button>
        </div>
      </aside>

      {/* 6. MAIN VIEWPORT SYSTEM */}
      <main className="vg-main-viewport">
        <header className="vg-global-header">
          <div className="header-breadcrumbs">
            <span className="root">CORE</span>
            <ChevronRight size={12} className="sep" />
            <span className="active">{activeView}</span>
          </div>

          <div className="header-tools">
            <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
              <Search size={16} onClick={() => setIsSearchOpen(!isSearchOpen)} />
              <input 
                type="text" 
                placeholder="Search Node, Sector, or Log..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="kbd">⌘ K</span>
            </div>

            <div className="tool-icons">
              <div className="icon-btn notif">
                <Bell size={20} />
                <span className="notif-count">4</span>
              </div>
              <div className="v-divider" />
              <div className="user-clerk-profile">
                <div className="avatar-wrapper">
                  <div className="avatar-letter">A</div>
                  <div className="status-indicator" />
                </div>
                <div className="user-meta">
                  <span className="username">Admin_Root</span>
                  <span className="role">Security Engineer</span>
                </div>
                <ChevronDown size={14} className="chevron" />
              </div>
            </div>
          </div>
        </header>

        {/* 7. DYNAMIC VIEW RENDERER */}
        <div className="vg-content-area">
          {activeView === 'DASHBOARD_LIVE' && <LiveDashboardView stream={stream} logs={terminalLogs} config={config} setConfig={setConfig} />}
          {/* Other views will be defined in Part 2 and 3 */}
        </div>
      </main>

      {/* 8. GLOBAL ALERTS OVERLAY */}
      {isAlertActive && (
        <div className="global-threat-overlay">
          <div className="threat-content">
            <AlertTriangle size={48} className="threat-icon" />
            <div className="threat-text">
              <h2>CRITICAL_THEFT_DETECTED</h2>
              <p>Node SECTOR_0{stream[stream.length-1]?.area_id} reporting unusual voltage-to-load ratio.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="nav-group">
      <span className="group-label">{label}</span>
      {children}
    </div>
  );
}

function NavItem({ icon, label, active, onClick, badge, alert }: any) {
  return (
    <div className={`nav-item ${active ? 'active' : ''} ${alert ? 'alert' : ''}`} onClick={onClick}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
      {alert && <div className="nav-ping" />}
    </div>
  );
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
  return <ChevronRight size={size} className={className} style={{ transform: 'rotate(90deg)' }} />;
}

/**
 * VOLTGUARD ENTERPRISE OS v5.0
 * PART 2: DATA VISUALIZATION & ANALYSIS ENGINE
 */

interface LiveDashboardProps {
  stream: TelemetryPoint[];
  logs: string[];
  config: any;
  setConfig: (c: any) => void;
}

export function LiveDashboardView({ stream, logs, config, setConfig }: LiveDashboardProps) {
  const latest = stream[stream.length - 1] || { energy_consumed: 0, voltage: 0, current: 0, area_id: 0 };

  return (
    <><div className="view-container">
          {/* 1. KPI MATRIX ROW */}
          <div className="view-row kpi-grid">
              <KPICard
                  title="INSTANTANEOUS_LOAD"
                  value={latest.energy_consumed}
                  unit="kWh"
                  trend="+2.4%"
                  status="nominal"
                  sparkline={stream.slice(-15)}
                  dataKey="energy_consumed"
                  color="var(--neon-pink)" />
              <KPICard
                  title="LINE_VOLTAGE"
                  value={latest.voltage}
                  unit="V"
                  trend="-0.12%"
                  status={latest.voltage < 220 ? 'warning' : 'nominal'}
                  sparkline={stream.slice(-15)}
                  dataKey="voltage"
                  color="var(--neon-cyan)" />
              <KPICard
                  title="CURRENT_FLOW"
                  value={latest.current}
                  unit="A"
                  trend="STABLE"
                  status="nominal"
                  sparkline={stream.slice(-15)}
                  dataKey="current"
                  color="var(--neon-amber)" />
              <KPICard
                  title="ACTIVE_ANOMALIES"
                  value={latest.theft_detected === "Yes" ? "1" : "0"}
                  unit="COUNT"
                  trend="DETECTOR_ON"
                  status={latest.theft_detected === "Yes" ? 'critical' : 'nominal'}
                  color="var(--neon-purp)" />
          </div>

          {/* 2. THE MACRO-FLUX HERO CHART */}
          <div className="view-row hero-row">
              <div className="panel hero-panel">
                  <div className="panel-header">
                      <div className="ph-info">
                          <h3>MACRO_FLUX_VISUALIZER</h3>
                          <p>Correlation between Consumption (Area) and Voltage (Vector)</p>
                      </div>
                      <div className="ph-actions">
                          <button className="util-btn"><Download size={14} /> EXPORT_RAW</button>
                          <button className="util-btn"><Maximize2 size={14} /> FULLSCREEN</button>
                      </div>
                  </div>

                  <div className="main-viz-container">
                      <ResponsiveContainer width="100%" height={500}>
                          <ComposedChart data={stream}>
                              <defs>
                                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="var(--neon-pink)" stopOpacity={0.3} />
                                      <stop offset="95%" stopColor="var(--neon-pink)" stopOpacity={0} />
                                  </linearGradient>
                                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                                      <feGaussianBlur stdDeviation="4" result="blur" />
                                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                  </filter>
                              </defs>
                              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
                              <XAxis
                                  dataKey="ts"
                                  stroke="var(--text-2)"
                                  fontSize={10}
                                  tickLine={false}
                                  axisLine={false}
                                  minTickGap={50} />
                              <YAxis
                                  yAxisId="left"
                                  stroke="var(--text-2)"
                                  fontSize={10}
                                  tickLine={false}
                                  axisLine={false} />
                              <YAxis
                                  yAxisId="right"
                                  orientation="right"
                                  stroke="var(--text-2)"
                                  fontSize={10}
                                  tickLine={false}
                                  axisLine={false} />
                              <Tooltip content={<AnalyticTooltip />} />

                              <Area
                                  yAxisId="left"
                                  type="monotone"
                                  dataKey="energy_consumed"
                                  stroke="var(--neon-pink)"
                                  strokeWidth={3}
                                  fill="url(#areaGradient)"
                                  animationDuration={300} />
                              <Line
                                  yAxisId="right"
                                  type="stepAfter"
                                  dataKey="voltage"
                                  stroke="var(--neon-cyan)"
                                  strokeWidth={2}
                                  dot={false}
                                  filter="url(#neonGlow)" />
                              <Scatter
                                  yAxisId="left"
                                  dataKey="anomaly"
                                  fill="var(--neon-amber)"
                              >
                                  {stream.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.theft_detected === "Yes" ? 'var(--neon-pink)' : 'transparent'} />
                                  ))}
                              </Scatter>
                          </ComposedChart>
                      </ResponsiveContainer>
                  </div>

                  <div className="viz-footer">
                      <div className="status-item">
                          <span className="dot pulse-pink" />
                          <span>INGESTION_RATE: {(1000 / config.refreshRate).toFixed(1)} Hz</span>
                      </div>
                      <div className="status-item">
                          <span className="dot bg-cyan" />
                          <span>VOLTAGE_STABILITY: 99.4%</span>
                      </div>
                      <div className="status-item">
                          <span className="dot bg-amber" />
                          <span>ACTIVE_NODE: SEC_0{latest.area_id}</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* 3. SUB-ANALYSIS ROW */}
          <div className="view-row sub-grid">
              {/* SECTOR HEALTH MATRIX */}
              <div className="panel sector-matrix">
                  <div className="panel-header">
                      <h3>SECTOR_HEALTH_MATRIX</h3>
                  </div>
                  <div className="matrix-content">
                      {[1, 2, 3, 4, 5].map(id => (
                          <SectorNode
                              key={id}
                              id={id}
                              isActive={latest.area_id === id}
                              isCritical={latest.area_id === id && latest.theft_detected === "Yes"} />
                      ))}
                  </div>
                  <div className="radar-container">
                      <ResponsiveContainer width="100%" height={200}>
                          <RadarChart data={[
                              { subject: 'LOAD', A: latest.energy_consumed / 2 },
                              { subject: 'VOLT', A: latest.voltage / 2.5 },
                              { subject: 'AMP', A: latest.current * 10 },
                              { subject: 'LOSS', A: latest.theft_detected === 'Yes' ? 100 : 5 },
                          ]}>
                              <PolarGrid stroke="var(--border)" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-1)', fontSize: 10 }} />
                              <Radar dataKey="A" stroke="var(--neon-purp)" fill="var(--neon-purp)" fillOpacity={0.5} />
                          </RadarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* NEURAL COMMAND TERMINAL */}
              <div className="panel terminal-panel">
                  <div className="panel-header">
                      <div className="ph-title"><Terminal size={14} /> SYSTEM_KERNEL_v5.0</div>
                      <div className="terminal-actions">
                          <button className="t-btn" onClick={() => setConfig({ ...config, refreshRate: 300 })}>BURST</button>
                          <button className="t-btn" onClick={() => setConfig({ ...config, refreshRate: 1200 })}>NORM</button>
                      </div>
                  </div>
                  <div className="terminal-scroller">
                      {logs.map((log, i) => (
                          <div key={i} className={`log-line ${log.includes('CRITICAL') ? 'crit' : ''}`}>
                              <span className="ts">[{new Date().toLocaleTimeString()}]</span>
                              <span className="msg">{log}</span>
                          </div>
                      ))}
                      <div className="log-line typing">
                          <span className="prompt">admin@voltguard:~$</span>
                          <span className="cursor">_</span>
                      </div>
                  </div>
              </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: Part2Styles }} />
      </div><UltimateCommandHub stream={stream} /></>
  );
}

// --- SUB-COMPONENTS ---

function KPICard({ title, value, unit, trend, status, sparkline, dataKey, color }: any) {
  return (
    <div className={`kpi-card status-${status}`}>
      <div className="kpi-head">
        <span className="kpi-title">{title}</span>
        <span className="kpi-trend">{trend}</span>
      </div>
      <div className="kpi-body">
        <div className="kpi-value-group">
          <span className="val">{value}</span>
          <span className="unit">{unit}</span>
        </div>
        {sparkline && (
          <div className="kpi-mini-chart">
            <ResponsiveContainer width={80} height={40}>
              <LineChart data={sparkline}>
                <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="kpi-progress"><div className="fill" style={{width: '70%', background: color}} /></div>
    </div>
  );
}

function SectorNode({ id, isActive, isCritical }: any) {
  return (
    <div className={`sector-node ${isActive ? 'active' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="node-id">0{id}</div>
      <div className="node-label">SEC_NODE</div>
      <div className="node-bars">
        <div className="bar" /> <div className="bar" /> <div className="bar" />
      </div>
    </div>
  );
}

const AnalyticTooltip = ({ active, payload }: any) => {
  // Ensure the tooltip only renders if it's active and has valid data
  if (active && payload && payload.length) {
    return (
      <div className="analytic-tooltip">
        <div className="tt-header">FRAME_ANALYSIS</div>
        {payload.map((p: any, i: number) => {
          // Robust check: Skip rendering this row if p or p.name is missing
          if (!p || !p.name) return null;

          return (
            <div key={i} className="tt-row">
              <span className="label" style={{ color: p.color }}>
                {p.name.toUpperCase()}
              </span>
              <span className="value">
                {p.value?.toLocaleString() ?? '0'} {p.unit || ''}
              </span>
            </div>
          );
        })}
        <div className="tt-footer">STATUS: OK</div>
      </div>
    );
  }
  return null;
};
/**
 * VOLTGUARD ENTERPRISE OS v5.0 
 * PART 3: GEOSPATIAL ENGINE & ARCHIVE GRID
 */

// --- SUB-VIEW: GEOSPATIAL TOPOLOGY ---
export function GeospatialMapView({ stream }: { stream: TelemetryPoint[] }) {
  const latest = stream[stream.length - 1];
  
  // Simulated coordinates for our 5 Sectors
  const sectors = [
    { id: 1, x: 200, y: 150, name: 'Industrial_North' },
    { id: 2, x: 500, y: 100, name: 'Residential_East' },
    { id: 3, x: 650, y: 350, name: 'Commercial_Central' },
    { id: 4, x: 300, y: 400, name: 'Port_District' },
    { id: 5, x: 100, y: 300, name: 'Substation_Alpha' },
  ];

  return (
    <div className="view-container">
      <div className="map-hero-panel panel">
        <div className="panel-header">
          <div className="ph-info">
            <h3>GEOSPATIAL_TOPOLOGY_v2</h3>
            <p>Live spatial mapping of grid nodes and high-voltage transmission lines</p>
          </div>
          <div className="map-legend">
            <div className="leg-item"><span className="dot bg-cyan" /> NOMINAL</div>
            <div className="leg-item"><span className="dot bg-pink pulse" /> THEFT_ALERT</div>
          </div>
        </div>

        <div className="svg-map-container">
          <svg viewBox="0 0 800 500" className="city-grid-svg">
            {/* Background Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Transmission Lines (Connectors) */}
            <path d="M200,150 L500,100 L650,350 L300,400 L100,300 Z" fill="rgba(123,0,255,0.02)" stroke="var(--neon-purp)" strokeWidth="1" strokeDasharray="5,5" />
            <path d="M500,100 L300,400" stroke="rgba(123,0,255,0.1)" strokeWidth="1" />

            {/* Sector Nodes */}
            {sectors.map((s) => {
              const isActive = latest?.area_id === s.id;
              const isAlert = isActive && latest?.theft_detected === "Yes";
              return (
                <g key={s.id} className={`map-node-group ${isActive ? 'active' : ''} ${isAlert ? 'alert' : ''}`}>
                  {isActive && <circle cx={s.x} cy={s.y} r="40" className="node-glow" />}
                  <circle cx={s.x} cy={s.y} r="8" className="node-core" />
                  <circle cx={s.x} cy={s.y} r="15" className="node-ring" />
                  <text x={s.x + 20} y={s.y + 5} className="node-text">{s.name}</text>
                  {isAlert && (
                    <g transform={`translate(${s.x - 12}, ${s.y - 45})`}>
                      <rect width="80" height="20" rx="4" fill="var(--neon-pink)" />
                      <text x="40" y="14" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800">THEFT_DETECTED</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: MapStyles }} />
    </div>
  );
}

// --- SUB-VIEW: HISTORICAL ARCHIVE ---
export function HistoricalArchiveView() {
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'day', dir: 'desc' });

  // Memoized data processing for performance
  const processedData = useMemo(() => {
    let data = [...energyData];
    if (filter) {
      data = data.filter(d => 
        d.area_id.toString().includes(filter) || 
        d.theft_detected.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return data.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.dir === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filter, sortConfig]);

  return (
    <div className="view-container">
      <div className="archive-panel panel">
        <div className="archive-controls">
          <div className="search-box">
            <Search size={16} />
            <input 
              placeholder="Filter by Sector or Status..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="action-btns">
            <button className="util-btn"><Filter size={14}/> ADVANCED_FILTERS</button>
            <button className="util-btn export"><Download size={14}/> EXPORT_SATELLITE_DATA</button>
          </div>
        </div>

        <div className="table-container">
          <table className="archive-table">
            <thead>
              <tr>
                <th onClick={() => setSortConfig({key: 'day', dir: sortConfig.dir === 'asc' ? 'desc' : 'asc'})}>
                  DAY {sortConfig.key === 'day' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
                </th>
                <th>SECTOR_ID</th>
                <th>CONSUMPTION (kWh)</th>
                <th>VOLTAGE (V)</th>
                <th>CURRENT (A)</th>
                <th>THEFT_STATUS</th>
                <th>INTEGRITY_INDEX</th>
              </tr>
            </thead>
            <tbody>
              {processedData.slice(0, 50).map((row, i) => (
                <tr key={i} className={row.theft_detected === "Yes" ? "row-alert" : ""}>
                  <td className="mono">D_{row.day}</td>
                  <td><span className="sector-tag">SEC_0{row.area_id}</span></td>
                  <td className="bold">{row.energy_consumed}</td>
                  <td>{row.voltage} V</td>
                  <td>{row.current} A</td>
                  <td>
                    <span className={`status-pill ${row.theft_detected.toLowerCase()}`}>
                      {row.theft_detected === "Yes" ? "BREACH" : "SECURE"}
                    </span>
                  </td>
                  <td>
                    <div className="integrity-bar">
                      <div className="fill" style={{ width: row.theft_detected === "Yes" ? '20%' : '95%' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: ArchiveStyles }} />
    </div>
  );
}

/**
 * VOLTGUARD ENTERPRISE OS v5.0 
 * PART 4: SECURITY PROTOCOLS & SYSTEM CONFIG
 */

export function SecuritySettingsView({ config, setConfig }: { config: any, setConfig: (c: any) => void }) {
  const [sensitivity, setSensitivity] = useState(85);
  const [autoLock, setAutoLock] = useState(true);

  return (
    <div className="view-container">
      <div className="security-layout-grid">
        
        {/* AI DETECTION TUNING */}
        <div className="panel config-panel">
          <div className="panel-header">
            <div className="ph-info">
              <h3><Sliders size={18} /> NEURAL_DETECTION_TUNING</h3>
              <p>Calibrate AI sensitivity for voltage-drop anomaly correlation</p>
            </div>
          </div>
          
          <div className="config-body">
            <div className="setting-row">
              <div className="s-info">
                <label>DETECTION_SENSITIVITY</label>
                <span>Higher values reduce false negatives but may increase false alarms.</span>
              </div>
              <div className="s-control">
                <input 
                  type="range" 
                  min="1" max="100" 
                  value={sensitivity} 
                  onChange={(e) => setSensitivity(parseInt(e.target.value))} 
                />
                <span className="v-badge">{sensitivity}%</span>
              </div>
            </div>

            <div className="setting-row">
              <div className="s-info">
                <label>AUTO_MITIGATION_PROTOCOL</label>
                <span>Isolate node automatically upon 99% breach confidence.</span>
              </div>
              <div className="s-control">
                <div className={`toggle ${autoLock ? 'on' : ''}`} onClick={() => setAutoLock(!autoLock)}>
                  <div className="t-slider" />
                </div>
              </div>
            </div>

            <div className="config-footer">
              <button className="util-btn primary"><Save size={14}/> COMMIT_CHANGES</button>
              <button className="util-btn"><RotateCcw size={14}/> RESET_TO_DEFAULTS</button>
            </div>
          </div>
        </div>

        {/* CLERK IDENTITY & PERMISSIONS */}
        <div className="panel user-panel">
          <div className="panel-header">
            <h3><Lock size={18} /> IDENTITY_CONTROL</h3>
          </div>
          <div className="clerk-sim-box">
             <div className="user-card-active">
                <div className="u-avatar">AD</div>
                <div className="u-details">
                   <div className="u-name">Admin_Root</div>
                   <div className="u-status"><ShieldCheck size={12}/> Authenticated via Clerk</div>
                </div>
                <div className="u-badge">SUPER_USER</div>
             </div>
             
             <div className="permission-list">
                <PermissionItem label="GRID_READ_ACCESS" active />
                <PermissionItem label="SIMULATION_WRITE" active />
                <PermissionItem label="SECURITY_OVERRIDE" active />
                <PermissionItem label="DATA_EXPORT" active />
                <PermissionItem label="USER_MANAGEMENT" active={false} />
             </div>
             <button className="util-btn invite"><UserPlus size={14}/> INVITE_OPERATOR</button>
          </div>
        </div>

        {/* SYSTEM HARDENING LOGS */}
        <div className="panel audit-panel">
           <div className="panel-header">
              <h3>SYSTEM_HARDENING_AUDIT</h3>
           </div>
           <div className="audit-list">
              <AuditItem event="ENCRYPTION_KEY_ROTATED" status="SUCCESS" time="02:00:00" />
              <AuditItem event="NODE_04_HANDSHAKE" status="SECURE" time="22:15:04" />
              <AuditItem event="BRUTE_FORCE_ATTEMPT_BLOCKED" status="ALERT" time="23:45:12" />
              <AuditItem event="CLERK_SESSION_REVALIDATED" status="SUCCESS" time="LIVE" />
           </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: SecurityStyles }} />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PermissionItem({ label, active }: { label: string, active: boolean }) {
  return (
    <div className={`p-item ${active ? 'granted' : 'denied'}`}>
      <span className="p-dot" />
      <span className="p-label">{label}</span>
      <span className="p-status">{active ? 'ALLOWED' : 'RESTRICTED'}</span>
    </div>
  );
}

function AuditItem({ event, status, time }: any) {
  return (
    <div className={`audit-item ${status.toLowerCase()}`}>
       <div className="a-meta">
          <span className="a-time">{time}</span>
          <span className={`a-status`}>{status}</span>
       </div>
       <div className="a-event">{event}</div>
    </div>
  );
}

/**
 * VOLTGUARD ENTERPRISE OS v5.0 
 * PART 5: NEURAL ANALYTICS & MASTER ASSEMBLY
 */

// --- SUB-VIEW: DEEP NEURAL ANALYSIS ---
export function NeuralAnalysisView({ stream }: { stream: TelemetryPoint[] }) {
  const anomalies = useMemo(() => stream.filter(s => s.theft_detected === "Yes"), [stream]);
  
  return (
    <div className="view-container">
      <div className="neural-grid">
        {/* PATTERN RECOGNITION ENGINE */}
        <div className="panel pattern-panel">
          <div className="panel-header">
            <h3><Cpu size={18} /> PATTERN_RECOGNITION_CORE</h3>
          </div>
          <div className="analysis-stats">
            <div className="stat-box">
              <label>CORRELATION_COEFFICIENT</label>
              <div className="val">0.982</div>
            </div>
            <div className="stat-box">
              <label>MEAN_TIME_TO_DETECTION</label>
              <div className="val">1.2s</div>
            </div>
          </div>
          
          <div className="pattern-viz">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[
                { subject: 'Voltage Drop', A: 120, B: 110, fullMark: 150 },
                { subject: 'Load Spike', A: 98, B: 130, fullMark: 150 },
                { subject: 'Phase Shift', A: 86, B: 130, fullMark: 150 },
                { subject: 'Harmonic Dist.', A: 99, B: 100, fullMark: 150 },
                { subject: 'Thermal Flux', A: 85, B: 90, fullMark: 150 },
              ]}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{fill: 'var(--text-2)', fontSize: 10}} />
                <Radar name="Normal" dataKey="A" stroke="var(--neon-cyan)" fill="var(--neon-cyan)" fillOpacity={0.1} />
                <Radar name="Anomaly" dataKey="B" stroke="var(--neon-pink)" fill="var(--neon-pink)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INCIDENT REPORT GENERATOR */}
        <div className="panel report-panel">
          <div className="panel-header">
            <h3><FileText size={18} /> INCIDENT_REPORTS</h3>
          </div>
          <div className="report-list">
            {anomalies.length > 0 ? anomalies.map((a, i) => (
              <div key={i} className="report-item">
                <div className="r-icon"><ZapOff size={16} /></div>
                <div className="r-data">
                  <div className="r-title">Breach Detected: Sector_0{a.area_id}</div>
                  <div className="r-sub">Voltage: {a.voltage}V | Index: {a.day}</div>
                </div>
                <button className="util-btn sm"><Share2 size={12}/> EXPORT</button>
              </div>
            )) : (
              <div className="empty-state">
                <CheckCircle2 size={32} className="icon-green" />
                <p>No active breaches recorded in current buffer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: NeuralStyles }} />
    </div>
  );
}

// --- THE GRAND ASSEMBLY (ENTRY POINT INTEGRATION) ---
// This replaces the "activeView" logic in Part 1 to bridge all modules.

/* In your main VoltGuardEnterpriseOS component, update the renderer:
  
  const renderView = () => {
    switch(activeView) {
      case 'DASHBOARD_LIVE': 
        return <LiveDashboardView stream={stream} logs={terminalLogs} config={config} setConfig={setConfig} />;
      case 'MAP_VIEW': 
        return <GeospatialMapView stream={stream} />;
      case 'ARCHIVE': 
        return <HistoricalArchiveView />;
      case 'SECURITY': 
        return <SecuritySettingsView config={config} setConfig={setConfig} />;
      case 'NEURAL_DEEP':
        return <NeuralAnalysisView stream={stream} />;
      default: 
        return <LiveDashboardView stream={stream} logs={terminalLogs} config={config} setConfig={setConfig} />;
    }
  };
*/

/**
 * VOLTGUARD ENTERPRISE OS v5.0 
 * PART 6: LIVE INGESTION MATRIX
 */


export function LiveIngestionBox({ stream }: { stream: TelemetryPoint[] }) {
  return (
    <div className="view-row">
      <div className="panel ingestion-panel">
        <div className="panel-header">
          <div className="ph-info">
            <h3><Database size={18} className="icon-purp" /> LIVE_PACKET_INGESTION</h3>
            <p>Real-time stream of incoming telemetry frames from distributed nodes</p>
          </div>
          <div className="ph-stats">
            <span className="stat-pill">BUF_SIZE: {stream.length}</span>
            <span className="stat-pill">SYNC: 12ms</span>
          </div>
        </div>

        <div className="packet-grid-header">
          <span><Hash size={12}/> NODE_ID</span>
          <span><Clock size={12}/> TIMESTAMP</span>
          <span><Zap size={12}/> LOAD</span>
          <span><Activity size={12}/> STATUS</span>
        </div>

        <div className="packet-scroll-area">
          {stream.slice().reverse().map((packet, i) => (
            <div key={i} className={`packet-row ${packet.theft_detected === "Yes" ? 'packet-alert' : ''}`}>
              <div className="p-cell node-id">
                <div className="id-icon">N</div>
                <span>NODE_0{packet.area_id}</span>
              </div>
              <div className="p-cell p-time">{packet.ts}</div>
              <div className="p-cell p-load">{packet.energy_consumed} <small>kWh</small></div>
              <div className="p-cell p-status">
                <div className={`status-indicator ${packet.theft_detected === "Yes" ? 'red' : 'green'}`} />
                <span>{packet.theft_detected === "Yes" ? 'CRITICAL' : 'OPTIMAL'}</span>
              </div>
            </div>
          ))}
          {stream.length === 0 && <div className="loading-state">WAITING_FOR_DATA_STREAM...</div>}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: Part6Styles }} />
    </div>
  );
}

/**
 * VOLTGUARD ENTERPRISE OS v5.0 
 * PART 7: PREDICTIVE CHART SUITE
 */

export function PredictiveCharts({ stream }: { stream: TelemetryPoint[] }) {
  return (
    <div className="view-row sub-grid">
      {/* DISTRIBUTION BAR CHART */}
      <div className="panel chart-panel">
        <div className="ph-title">RESOURCE_DISTRIBUTION_BY_SECTOR</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stream.slice(-10)}>
            <XAxis dataKey="ts" hide />
            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<AnalyticTooltip />} />
            <Bar dataKey="energy_consumed" stackId="a" fill="var(--neon-purp)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="voltage" stackId="a" fill="rgba(0, 212, 255, 0.3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* NODE PERFORMANCE RADAR */}
      <div className="panel chart-panel">
        <div className="ph-title">EFFICIENCY_POLAR_COORDINATES</div>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
            { subject: 'LOAD', A: 120, B: 110, fullMark: 150 },
            { subject: 'VOLT', A: 98, B: 130, fullMark: 150 },
            { subject: 'AMP', A: 86, B: 130, fullMark: 150 },
            { subject: 'LOSS', A: 99, B: 100, fullMark: 150 },
          ]}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{fill: 'var(--text-2)', fontSize: 10}} />
            <Radar name="Target" dataKey="A" stroke="var(--neon-cyan)" fill="var(--neon-cyan)" fillOpacity={0.2} />
            <Radar name="Actual" dataKey="B" stroke="var(--neon-pink)" fill="var(--neon-pink)" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * VOLTGUARD ENTERPRISE OS v5.0 
 * PART 8: SYSTEM HEALTH & PIE METRICS
 */

export function SystemHealthWidgets({ stream }: { stream: TelemetryPoint[] }) {
  const latest = stream[stream.length - 1];
  
  const pieData = [
    { name: 'Active', value: 400, color: 'var(--neon-purp)' },
    { name: 'Idle', value: 300, color: 'var(--neon-cyan)' },
    { name: 'Alert', value: 100, color: 'var(--neon-pink)' },
  ];

  return (
    <div className="view-row health-grid">
      <div className="panel mini-viz">
        <div className="ph-title">NODE_AVAILABILITY</div>
        <div className="pie-container">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
             {pieData.map(d => <div key={d.name}><span style={{background: d.color}} /> {d.name}</div>)}
          </div>
        </div>
      </div>

      <div className="panel data-summary">
        <div className="ph-title">SECTOR_LOAD_BALANCING</div>
        <div className="summary-list">
          {[1, 2, 3, 4, 5].map(id => (
            <div key={id} className="s-row">
              <span className="s-label">SECTOR_0{id}</span>
              <div className="s-progress"><div className="s-fill" style={{width: `${Math.random()*100}%`}} /></div>
              <span className="s-val">{(Math.random()*10).toFixed(1)}kW</span>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: Part8Styles }} />
    </div>
  );
}

/**
 * VOLTGUARD ENTERPRISE OS v5.2
 * FINAL ASSEMBLY & ERROR HARDENING
 */

// 2. THE "LIVE PACKET BOX" (Requested Component)
export function LivePacketIngestor({ stream }: { stream: any[] }) {
  return (
    <div className="panel packet-box">
      <div className="panel-header">
        <h3><Activity size={16} className="icon-pink" /> LIVE_INGESTION_STREAM</h3>
        <div className="p-badge">SECURE_SYNC</div>
      </div>
      <div className="packet-scroll">
        {stream.slice().reverse().map((p, i) => (
          <div key={i} className={`packet-row ${p.theft_detected === "Yes" ? 'alert' : ''}`}>
            <div className="p-id">#ID_{p.area_id}</div>
            <div className="p-ts">{p.ts}</div>
            <div className="p-load">{p.energy_consumed}kW</div>
            <div className="p-icon">
              {p.theft_detected === "Yes" ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .packet-box { height: 400px; display: flex; flex-direction: column; }
        .packet-scroll { flex: 1; overflow-y: auto; padding-right: 10px; }
        .packet-row { 
          display: grid; grid-template-columns: 1fr 1.5fr 1fr 0.5fr;
          padding: 12px; margin-bottom: 8px; border-radius: 8px;
          background: var(--bg-card); border: 1px solid var(--glass);
          font-family: var(--font-mono); font-size: 11px;
        }
        .packet-row.alert { border-color: var(--neon-pink); background: rgba(255,0,212,0.05); color: var(--neon-pink); }
        .p-id { color: var(--neon-cyan); font-weight: 800; }
        .p-ts { color: var(--text-2); }
      `}</style>
    </div>
  );
}

// 3. MULTI-CHART PREDICTIVE SUITE (Matching the reference style)
export function PredictiveSuite({ stream }: { stream: any[] }) {
  return (
    <div className="view-row sub-grid">
      {/* Stacked Distribution */}
      <div className="panel chart-glass">
        <div className="ph-title">LOAD_DISTRIBUTION_VECTOR</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stream.slice(-12)}>
            <Bar dataKey="energy_consumed" fill="var(--neon-purp)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="voltage" fill="rgba(0, 212, 255, 0.2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Harmonic Flux Chart */}
      <div className="panel chart-glass">
        <div className="ph-title">HARMONIC_FLUX_ANALYSIS</div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={stream.slice(-20)}>
            <defs>
              <linearGradient id="cyanFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="step" dataKey="current" stroke="var(--neon-cyan)" fill="url(#cyanFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * VOLTGUARD ENTERPRISE OS v5.5
 * ULTIMATE COMMAND HUB: 4 Charts, 3 Graphs, & Neural Matrix
 */

export function UltimateCommandHub({ stream }: { stream: TelemetryPoint[] }) {
  const latest = stream[stream.length - 1];

  const pieData = [
    { name: 'Core', value: 40, color: 'var(--neon-purp)' },
    { name: 'Edge', value: 30, color: 'var(--neon-cyan)' },
    { name: 'Loss', value: 10, color: 'var(--neon-pink)' },
  ];

  return (
    <div className="command-hub-wrapper">
      <div className="hub-grid">
        
        {/* 1. THE NEURAL MATRIX BOX (Left) */}
        <div className="panel matrix-box glass-effect">
          <div className="panel-header">
            <h3><Fingerprint size={16} className="glow-icon"/> NEURAL_ZONE_INDEX</h3>
            <div className="pulse-container">
              <span className="live-dot" /> 
              <span className="live-text">STREAMING_v5.5</span>
            </div>
          </div>
          <div className="zone-matrix-scroll">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200].map((id) => (
              <div key={id} className={`matrix-item ${latest?.area_id === id && latest?.theft_detected === "Yes" ? 'critical-glow' : ''}`}>
                <div className="m-left">
                  <div className="m-hex">{id}</div>
                  <div className="m-meta">
                    <span className="m-id">ZONE_0{id}</span>
                    <span className="m-task">LOAD_BALANCING</span>
                  </div>
                </div>
                <div className="m-graph">
                  <ResponsiveContainer width="100%" height={20}>
                    <LineChart data={stream.slice(-10)}>
                      <Line type="monotone" dataKey="energy_consumed" stroke="var(--neon-cyan)" dot={false} strokeWidth={1} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="m-status">
                  <span className="m-val">{(Math.random() * 100).toFixed(1)}%</span>
                  <div className="m-led" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. THE ANALYTIC QUADRANT (Right) */}
        <div className="analytic-quadrant">
          
          {/* Chart 1: Resource Distribution (Pie) */}
          <div className="panel mini-card glass-morphism">
            <div className="ph-title"><PieChartIcon size={12}/> DIST_FLUX</div>
            <ResponsiveContainer width="100%" height={80}>
              <PieChart>
                <Pie data={pieData} innerRadius={25} outerRadius={35} paddingAngle={4} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Harmonic Variance (Line) */}
          <div className="panel mini-card glass-morphism">
            <div className="ph-title"><Activity size={12}/> WAVEFORM</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={stream.slice(-15)}>
                <Line type="step" dataKey="voltage" stroke="var(--neon-pink)" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Spectral Density (Area) */}
          <div className="panel mini-card glass-morphism">
            <div className="ph-title"><TrendingUp size={12}/> DENSITY</div>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={stream.slice(-15)}>
                <Area type="monotone" dataKey="current" stroke="var(--neon-amber)" fill="rgba(255, 174, 0, 0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 4: Load Vectors (Bar) */}
          <div className="panel mini-card glass-morphism">
            <div className="ph-title"><BarChart3 size={12}/> VECTORS</div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={stream.slice(-8)}>
                <Bar dataKey="energy_consumed" fill="var(--neon-purp)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

      {/* 3. SYSTEM STATS STRIP (Bottom) */}
      <div className="stats-strip panel">
         <div className="strip-item"><Cpu size={14}/> <span>CPU: 12%</span><div className="s-bar"><div className="s-fill" style={{width: '12%'}}/></div></div>
         <div className="strip-item"><Zap size={14}/> <span>TPS: 1.4k</span><div className="s-bar"><div className="s-fill" style={{width: '88%'}}/></div></div>
         <div className="strip-item"><Box size={14}/> <span>NODES: 512</span><div className="s-bar"><div className="s-fill" style={{width: '45%'}}/></div></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: HubStyles }} />
    </div>
  );
}

const HubStyles = `
  .command-hub-wrapper { margin-top: 30px; display: flex; flex-direction: column; gap: 20px; animation: hub-fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
  .hub-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }

  /* Matrix Box */
  .matrix-box { height: 420px; display: flex; flex-direction: column; border: 1px solid rgba(157, 0, 255, 0.2); }
  .zone-matrix-scroll { flex: 1; overflow-y: auto; padding-right: 8px; display: flex; flex-direction: column; gap: 12px; }
  
  .matrix-item { 
    display: grid; grid-template-columns: 1.5fr 1fr 0.8fr; align-items: center;
    padding: 12px 18px; background: rgba(255,255,255,0.02); border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease;
  }
  .matrix-item:hover { 
    background: rgba(157, 0, 255, 0.08); 
    border-color: var(--neon-purp);
    transform: scale(1.02) translateX(5px);
    box-shadow: 0 0 20px rgba(157, 0, 255, 0.15);
  }
  
  .critical-glow { border-color: var(--neon-pink) !important; background: rgba(255, 0, 212, 0.08) !important; animation: row-pulse 1.5s infinite; }
  
  .m-hex { width: 32px; height: 32px; background: var(--bg-3); border: 1px solid var(--neon-cyan); color: var(--neon-cyan); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 800; font-size: 12px; }
  .m-left { display: flex; align-items: center; gap: 15px; }
  .m-id { display: block; font-size: 13px; font-weight: 800; color: #fff; }
  .m-task { font-size: 9px; font-family: var(--font-mono); color: var(--text-3); letter-spacing: 1px; }
  
  .m-status { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
  .m-val { font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--text-2); }
  .m-led { width: 8px; height: 8px; background: var(--neon-green); border-radius: 50%; box-shadow: 0 0 10px var(--neon-green); }

  /* Quadrant */
  .analytic-quadrant { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px; }
  .mini-card { padding: 15px; border: 1px solid rgba(255,255,255,0.05); }
  .mini-card:hover { border-color: rgba(255,255,255,0.2); }

  /* Stats Strip */
  .stats-strip { display: flex; justify-content: space-around; padding: 15px; background: var(--bg-deep); border: 1px solid var(--border); border-radius: 12px; }
  .strip-item { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 10px; color: var(--text-2); }
  .s-bar { width: 60px; height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; }
  .s-fill { height: 100%; background: var(--neon-cyan); box-shadow: 0 0 8px var(--neon-cyan); border-radius: 2px; }

  /* Animations */
  @keyframes hub-fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes row-pulse { 0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 212, 0.1); } 50% { box-shadow: 0 0 25px rgba(255, 0, 212, 0.3); } }
  
  .glow-icon { filter: drop-shadow(0 0 5px var(--neon-purp)); }
  .live-dot { width: 6px; height: 6px; background: var(--neon-green); border-radius: 50%; animation: blink 1.5s infinite; }
  .live-text { font-family: var(--font-mono); font-size: 10px; color: var(--neon-green); margin-left: 8px; font-weight: 800; }
`;

const Part8Styles = `
  .health-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; }
  .pie-container { display: flex; align-items: center; justify-content: space-around; }
  .pie-legend { font-size: 10px; font-family: var(--font-mono); }
  .pie-legend div { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .pie-legend span { width: 8px; height: 8px; border-radius: 2px; }

  .summary-list { display: flex; flex-direction: column; gap: 15px; margin-top: 10px; }
  .s-row { display: flex; align-items: center; gap: 15px; }
  .s-label { font-family: var(--font-mono); font-size: 10px; width: 80px; }
  .s-progress { flex: 1; height: 4px; background: var(--bg-3); border-radius: 2px; overflow: hidden; }
  .s-fill { height: 100%; background: linear-gradient(90deg, var(--neon-purp), var(--neon-cyan)); }
  .s-val { font-family: var(--font-mono); font-size: 11px; font-weight: 800; width: 60px; text-align: right; }
`;

const Part6Styles = `
  .ingestion-panel { height: 450px; display: flex; flex-direction: column; }
  .packet-grid-header { 
    display: grid; grid-template-columns: 1fr 1.5fr 1fr 1.2fr; 
    padding: 12px 20px; background: rgba(255,255,255,0.03);
    font-family: var(--font-mono); font-size: 10px; color: var(--text-2);
    border-radius: 8px; margin-bottom: 10px;
  }
  .packet-scroll-area { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
  .packet-row { 
    display: grid; grid-template-columns: 1fr 1.5fr 1fr 1.2fr; 
    padding: 10px 20px; background: var(--bg-3); border-radius: 8px;
    align-items: center; border: 1px solid transparent; transition: 0.2s;
  }
  .packet-row:hover { border-color: var(--neon-purp); background: rgba(157, 0, 255, 0.05); }
  .packet-alert { border-color: var(--neon-pink); background: rgba(255, 0, 212, 0.05); animation: row-pulse 2s infinite; }
  
  .node-id { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #fff; }
  .id-icon { width: 18px; height: 18px; background: var(--neon-purp); border-radius: 4px; font-size: 9px; display: flex; align-items: center; justify-content: center; }
  .p-time { font-family: var(--font-mono); font-size: 11px; color: var(--text-2); }
  .p-load { font-weight: 800; color: var(--neon-cyan); }
  .p-status { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; }
  
  .status-indicator { width: 6px; height: 6px; border-radius: 50%; }
  .status-indicator.green { background: var(--neon-green); box-shadow: 0 0 8px var(--neon-green); }
  .status-indicator.red { background: var(--neon-pink); box-shadow: 0 0 8px var(--neon-pink); }
  
  @keyframes row-pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
`;

// --- PART 5 STYLES ---

const NeuralStyles = `
  .neural-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
  .analysis-stats { display: flex; gap: 20px; margin-bottom: 20px; }
  .stat-box { flex: 1; background: var(--bg-3); padding: 15px; border-radius: 12px; border: 1px solid var(--border); }
  .stat-box label { font-family: var(--font-mono); font-size: 9px; color: var(--text-2); display: block; margin-bottom: 5px; }
  .stat-box .val { font-size: 20px; font-weight: 800; color: var(--neon-cyan); }

  .report-list { display: flex; flex-direction: column; gap: 12px; height: 400px; overflow-y: auto; }
  .report-item { 
    display: flex; align-items: center; gap: 15px; background: var(--bg-3); 
    padding: 15px; border-radius: 12px; border: 1px solid var(--border);
    transition: 0.2s;
  }
  .report-item:hover { border-color: var(--neon-pink); transform: scale(1.02); }
  .r-icon { width: 36px; height: 36px; background: rgba(255,0,128,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--neon-pink); }
  .r-title { font-size: 13px; font-weight: 700; color: #fff; }
  .r-sub { font-size: 11px; color: var(--text-2); font-family: var(--font-mono); margin-top: 2px; }
  
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-2); }
  .icon-green { color: var(--neon-green); margin-bottom: 15px; opacity: 0.5; }
  .util-btn.sm { padding: 4px 8px; font-size: 9px; margin-left: auto; }

  .pattern-viz { background: rgba(0,0,0,0.2); border-radius: 20px; padding: 20px; border: 1px solid var(--border); }
`;

// --- PART 4 STYLES ---

const SecurityStyles = `
  .security-layout-grid { 
    display: grid; 
    grid-template-columns: 1.5fr 1fr; 
    grid-template-rows: auto auto; 
    gap: 30px; 
  }
  
  .config-panel { grid-row: span 1; }
  .audit-panel { grid-column: span 2; }

  .setting-row { 
    display: flex; justify-content: space-between; align-items: center; 
    padding: 25px 0; border-bottom: 1px solid var(--border); 
  }
  .s-info label { display: block; font-family: var(--font-mono); font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 5px; }
  .s-info span { font-size: 11px; color: var(--text-2); }
  
  .s-control { display: flex; align-items: center; gap: 20px; }
  .v-badge { background: var(--bg-3); padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 12px; color: var(--neon-cyan); border: 1px solid var(--border); }
  
  /* Toggle Switch */
  .toggle { width: 44px; height: 22px; background: var(--bg-3); border-radius: 20px; padding: 3px; cursor: pointer; transition: 0.3s; }
  .toggle.on { background: var(--neon-purp); }
  .t-slider { width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: 0.3s; }
  .toggle.on .t-slider { transform: translateX(22px); }

  /* User/Clerk Simulation */
  .clerk-sim-box { display: flex; flex-direction: column; gap: 20px; }
  .user-card-active { 
    background: linear-gradient(90deg, var(--bg-3), transparent); 
    padding: 20px; border-radius: 15px; border: 1px solid var(--border);
    display: flex; align-items: center; gap: 15px;
  }
  .u-avatar { width: 40px; height: 40px; background: var(--neon-pink); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
  .u-name { font-weight: 800; font-size: 14px; }
  .u-status { font-size: 10px; color: var(--neon-green); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  .u-badge { margin-left: auto; font-size: 9px; font-family: var(--font-mono); background: rgba(123,0,255,0.1); color: var(--neon-purp); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--neon-purp); }

  .permission-list { display: flex; flex-direction: column; gap: 10px; }
  .p-item { display: flex; align-items: center; gap: 12px; font-size: 11px; font-family: var(--font-mono); padding: 10px; background: rgba(255,255,255,0.01); border-radius: 8px; }
  .p-dot { width: 6px; height: 6px; border-radius: 50%; }
  .granted .p-dot { background: var(--neon-green); box-shadow: 0 0 10px var(--neon-green); }
  .denied .p-dot { background: var(--text-3); }
  .p-status { margin-left: auto; font-size: 9px; opacity: 0.6; }

  /* Audit List */
  .audit-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
  .audit-item { background: var(--bg-3); padding: 15px; border-radius: 12px; border-left: 3px solid var(--border); }
  .audit-item.success { border-left-color: var(--neon-green); }
  .audit-item.alert { border-left-color: var(--neon-pink); background: rgba(255,0,128,0.02); }
  .a-meta { display: flex; justify-content: space-between; margin-bottom: 8px; font-family: var(--font-mono); font-size: 10px; }
  .a-time { color: var(--text-2); }
  .a-event { font-size: 12px; font-weight: 700; color: #fff; }

  .util-btn.primary { background: var(--neon-purp); color: #fff; border: none; }
  .util-btn.invite { border-color: var(--neon-cyan); color: var(--neon-cyan); margin-top: 10px; }
`;

// --- PART 3 STYLES ---

const MapStyles = `
  .map-hero-panel { height: 700px; display: flex; flex-direction: column; overflow: hidden; }
  .svg-map-container { flex: 1; background: #000; border-radius: 15px; position: relative; overflow: hidden; border: 1px solid var(--border); }
  .city-grid-svg { width: 100%; height: 100%; }
  
  .map-legend { display: flex; gap: 20px; }
  .leg-item { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 10px; color: var(--text-2); }
  
  .node-core { fill: var(--bg-1); stroke: var(--neon-purp); stroke-width: 2; transition: 0.3s; }
  .node-ring { fill: none; stroke: var(--neon-purp); stroke-width: 1; opacity: 0.3; }
  .node-text { fill: var(--text-2); font-size: 11px; font-family: var(--font-mono); font-weight: 700; pointer-events: none; }
  
  .map-node-group.active .node-core { fill: var(--neon-purp); stroke: #fff; }
  .map-node-group.active .node-text { fill: #fff; }
  .map-node-group.active .node-glow { fill: var(--neon-purp); opacity: 0.1; animation: map-pulse 2s infinite; }
  
  .map-node-group.alert .node-core { fill: var(--neon-pink); stroke: #fff; }
  .map-node-group.alert .node-glow { fill: var(--neon-pink); }
  
  @keyframes map-pulse { 0% { transform: scale(0.5); opacity: 0.2; } 100% { transform: scale(1.5); opacity: 0; } }
`;

const ArchiveStyles = `
  .archive-panel { display: flex; flex-direction: column; gap: 20px; }
  .archive-controls { display: flex; justify-content: space-between; align-items: center; }
  .search-box { background: var(--bg-3); border: 1px solid var(--border); padding: 10px 15px; border-radius: 10px; display: flex; align-items: center; gap: 12px; width: 400px; }
  .search-box input { background: transparent; border: none; color: #fff; font-size: 13px; width: 100%; }
  .action-btns { display: flex; gap: 10px; }
  .util-btn.export { border-color: var(--neon-purp); color: var(--neon-purp); }

  .table-container { background: var(--bg-1); border-radius: 15px; border: 1px solid var(--border); overflow: hidden; }
  .archive-table { width: 100%; border-collapse: collapse; text-align: left; }
  .archive-table th { padding: 18px 20px; background: rgba(255,255,255,0.02); color: var(--text-2); font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; cursor: pointer; }
  .archive-table td { padding: 15px 20px; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text-1); }
  .archive-table tr:hover { background: rgba(255,255,255,0.01); }
  
  .mono { font-family: var(--font-mono); }
  .bold { font-weight: 800; color: #fff; }
  .sector-tag { background: var(--bg-3); padding: 4px 8px; border-radius: 6px; font-family: var(--font-mono); font-size: 11px; color: var(--neon-cyan); }
  
  .status-pill { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 900; letter-spacing: 1px; }
  .status-pill.no { background: rgba(51,255,170,0.1); color: var(--neon-green); }
  .status-pill.yes { background: var(--neon-pink); color: #fff; box-shadow: 0 0 15px rgba(255,0,128,0.3); }
  
  .row-alert { background: rgba(255,0,128,0.03) !important; }
  
  .integrity-bar { width: 100px; height: 4px; background: var(--bg-3); border-radius: 2px; overflow: hidden; }
  .integrity-bar .fill { height: 100%; background: var(--neon-green); border-radius: 2px; }
  .row-alert .integrity-bar .fill { background: var(--neon-pink); }
`;

// --- PART 2 SPECIFIC STYLES ---

const Part2Styles = `
  .view-container { display: flex; flex-direction: column; gap: 30px; animation: fade-in 0.5s ease; }
  
  /* KPI Cards */
  .kpi-grid { grid-template-columns: repeat(4, 1fr); display: grid; gap: 20px; }
  .kpi-card { background: var(--bg-1); border: 1px solid var(--border); padding: 20px; border-radius: 20px; transition: 0.3s; }
  .kpi-card:hover { transform: translateY(-5px); background: var(--bg-2); border-color: var(--neon-purp); }
  .kpi-title { font-family: var(--font-mono); font-size: 10px; color: var(--text-2); letter-spacing: 1px; }
  .kpi-trend { font-size: 10px; color: var(--neon-green); font-weight: 800; }
  .kpi-body { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 10px; }
  .kpi-value-group .val { font-size: 32px; font-weight: 800; }
  .kpi-value-group .unit { font-size: 12px; color: var(--text-2); margin-left: 5px; }
  .kpi-progress { height: 3px; background: rgba(255,255,255,0.05); margin-top: 15px; border-radius: 2px; overflow: hidden; }
  .status-critical { border-color: var(--neon-pink); box-shadow: 0 0 20px rgba(255, 0, 128, 0.1); }

  /* Panels */
  .panel { background: var(--bg-1); border: 1px solid var(--border); border-radius: 24px; padding: 25px; position: relative; }
  .panel-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
  .ph-info h3 { margin: 0; font-size: 16px; font-weight: 800; letter-spacing: 1px; }
  .ph-info p { margin: 5px 0 0; font-size: 11px; color: var(--text-2); }
  
  .util-btn { background: var(--bg-3); border: 1px solid var(--border); color: var(--text-1); padding: 8px 12px; border-radius: 8px; font-size: 10px; font-family: var(--font-mono); cursor: pointer; display: flex; align-items: center; gap: 8px; }

  /* Visualization */
  .viz-footer { display: flex; gap: 30px; margin-top: 25px; border-top: 1px solid var(--border); padding-top: 20px; }
  .status-item { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 10px; color: var(--text-1); }
  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .pulse-pink { background: var(--neon-pink); box-shadow: 0 0 10px var(--neon-pink); animation: alert-pulse 1s infinite alternate; }

  /* Matrix & Radar */
  .sub-grid { grid-template-columns: 1fr 1fr; display: grid; gap: 30px; }
  .matrix-content { display: flex; gap: 15px; justify-content: space-between; margin-bottom: 20px; }
  .sector-node { 
    flex: 1; background: var(--bg-3); border: 1px solid var(--border); border-radius: 12px; 
    padding: 15px; text-align: center; transition: 0.3s;
  }
  .sector-node.active { border-color: var(--neon-purp); box-shadow: 0 0 15px rgba(123,0,255,0.2); }
  .sector-node.critical { border-color: var(--neon-pink); background: rgba(255,0,128,0.05); }
  .node-id { font-size: 20px; font-weight: 800; }
  .node-label { font-size: 8px; color: var(--text-2); font-family: var(--font-mono); }
  .node-bars { display: flex; gap: 3px; justify-content: center; margin-top: 8px; }
  .node-bars .bar { width: 4px; height: 10px; background: var(--text-3); border-radius: 1px; }
  .active .node-bars .bar { background: var(--neon-purp); }
  .critical .node-bars .bar { background: var(--neon-pink); }

  /* Terminal */
  .terminal-scroller { 
    height: 250px; background: #000; border-radius: 15px; padding: 20px; 
    font-family: var(--font-mono); font-size: 11px; overflow-y: auto;
    border: 1px solid var(--border);
  }
  .log-line { margin-bottom: 6px; color: #4b5563; }
  .log-line.crit { color: var(--neon-pink); font-weight: 700; }
  .log-line .ts { color: var(--text-3); margin-right: 10px; }
  .log-line .prompt { color: var(--neon-purp); margin-right: 10px; }
  .cursor { width: 6px; height: 12px; background: var(--neon-purp); display: inline-block; animation: blink 1s infinite; }

  /* Tooltip */
  .analytic-tooltip { 
    background: var(--bg-1); border: 1px solid var(--neon-purp); padding: 15px; 
    border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px);
  }
  .tt-header { font-family: var(--font-mono); font-size: 10px; color: var(--text-2); border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 10px; }
  .tt-row { display: flex; justify-content: space-between; gap: 30px; margin-bottom: 5px; font-size: 12px; }
  .tt-row .label { font-family: var(--font-mono); font-size: 10px; }
  .tt-footer { margin-top: 10px; font-size: 9px; color: var(--neon-green); font-weight: 800; }

  @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes blink { 50% { opacity: 0; } }
`;

// --- PART 1 DESIGN SYSTEM (CSS) ---

const VoltGuardCoreStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    /* Color Palette */
    --bg-0: #020105; --bg-1: #080414; --bg-2: #0d081f; --bg-3: #150e2e;
    --neon-pink: #ff0080; --neon-purp: #7b00ff; --neon-cyan: #00d4ff;
    --neon-green: #33ffaa; --neon-amber: #facc15;
    --text-0: #ffffff; --text-1: #94a3b8; --text-2: #475569; --text-3: #1e293b;
    --border: rgba(255, 255, 255, 0.05);
    
    /* Layout */
    --sidebar-w: 280px; --header-h: 80px;
    
    /* Typography */
    --font-main: 'Plus Jakarta Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --glass: rgba(255, 255, 255, 0.03);
  --border-glow: rgba(157, 0, 255, 0.2);
  --bg-deep: #060212;
  --bg-panel: #110726;
  --bg-card: #1a0b38;
  --neon-pink: #ff00d4;
  --neon-purp: #9d00ff;
  --neon-cyan: #00d4ff;
  }

  .sidebar-min { --sidebar-w: 80px; }

  * { box-sizing: border-box; outline: none; }
  body { margin: 0; background: var(--bg-0); color: var(--text-0); font-family: var(--font-main); overflow: hidden; }

  /* Root Layout */
  .vg-os-root { display: flex; height: 100vh; width: 100vw; position: relative; }

  /* Sidebar */
  .vg-sidebar {
    width: var(--sidebar-w); background: var(--bg-1); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
  }
  .sidebar-header {
    height: var(--header-h); padding: 0 25px; display: flex; align-items: center; gap: 15px;
    border-bottom: 1px solid var(--border);
  }
  .brand-logo { 
    min-width: 42px; height: 42px; background: var(--bg-3); border: 1px solid var(--neon-purp);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 20px rgba(123, 0, 255, 0.2);
  }
  .brand-text .name { font-weight: 800; font-size: 18px; display: block; letter-spacing: -0.5px; }
  .brand-text small { color: var(--neon-pink); font-size: 10px; font-weight: 900; }
  .brand-text .version { font-family: var(--font-mono); font-size: 9px; color: var(--text-2); }
  .sidebar-min .brand-text { display: none; }

  /* Navigation */
  .sidebar-nav { flex: 1; padding: 20px 15px; overflow-y: auto; }
  .group-label {
    display: block; font-family: var(--font-mono); font-size: 10px; color: var(--text-2);
    letter-spacing: 2px; padding: 25px 15px 10px;
  }
  .sidebar-min .group-label { display: none; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 14px;
    color: var(--text-1); cursor: pointer; transition: 0.2s; position: relative;
  }
  .nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
  .nav-item.active { background: var(--neon-purp); color: #fff; box-shadow: 0 10px 20px rgba(123,0,255,0.2); }
  .nav-item.alert { color: var(--neon-pink); }
  .sidebar-min .nav-label { display: none; }

  /* Main Viewport */
  .vg-main-viewport { flex: 1; display: flex; flex-direction: column; background: var(--bg-0); }
  .vg-global-header {
    height: var(--header-h); padding: 0 40px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center; background: var(--bg-0);
  }
  .header-breadcrumbs { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 12px; }
  .header-breadcrumbs .root { color: var(--text-2); }
  .header-breadcrumbs .active { color: var(--neon-purp); font-weight: 800; border-bottom: 1px solid var(--neon-purp); }

  /* Header Tools */
  .header-tools { display: flex; align-items: center; gap: 30px; }
  .search-container {
    background: var(--bg-1); border: 1px solid var(--border); padding: 10px 15px; border-radius: 12px;
    display: flex; align-items: center; gap: 12px; width: 300px; transition: 0.3s;
  }
  .search-container input { background: transparent; border: none; color: #fff; font-size: 13px; width: 100%; }
  .kbd { font-size: 9px; background: var(--bg-3); padding: 2px 5px; border-radius: 4px; color: var(--text-2); }

  /* User Profile (Clerk Simulation) */
  .user-clerk-profile {
    display: flex; align-items: center; gap: 12px; background: var(--bg-1); padding: 8px 15px;
    border-radius: 14px; border: 1px solid var(--border); cursor: pointer;
  }
  .avatar-wrapper { position: relative; }
  .avatar-letter {
    width: 32px; height: 32px; background: linear-gradient(135deg, var(--neon-purp), var(--neon-pink));
    border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800;
  }
  .status-indicator {
    position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px;
    background: var(--neon-green); border: 2px solid var(--bg-1); border-radius: 50%;
  }
  .user-meta .username { font-size: 13px; font-weight: 700; display: block; }
  .user-meta .role { font-size: 10px; color: var(--text-1); }

  /* Alerts Overlay */
  .global-threat-overlay {
    position: fixed; inset: 0; background: rgba(255, 0, 128, 0.1); border: 4px solid var(--neon-pink);
    z-index: 1000; pointer-events: none; animation: alert-pulse 1s infinite alternate;
    display: flex; align-items: center; justify-content: center;
  }
  .threat-content { 
    background: var(--bg-0); border: 1px solid var(--neon-pink); padding: 40px; border-radius: 24px;
    text-align: center; box-shadow: 0 0 50px rgba(255, 0, 128, 0.5);
  }
  .threat-icon { color: var(--neon-pink); margin-bottom: 20px; animation: icon-shake 0.2s infinite; }

  @keyframes alert-pulse { from { opacity: 0.4; } to { opacity: 1; } }
  @keyframes icon-shake { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
  
  .vg-content-area { flex: 1; overflow-y: auto; padding: 40px; }
  /**
 * VOLTGUARD ENTERPRISE OS v6.0 - ULTIMATE EDITION
 * AESTHETIC: HYPER-GLASS / NEON-PULSE / DEEP-VOID
 */

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  /* The "Deep Void" Core Palette */
  --bg-void: #020106;
  --bg-nebula: #060212;
  --bg-panel: rgba(17, 7, 38, 0.7);
  --bg-card: rgba(26, 11, 56, 0.4);
  
  /* Atomic Neon Colors */
  --neon-pink: #ff00d4;
  --neon-purp: #9d00ff;
  --neon-cyan: #00d4ff;
  --neon-green: #00ffa3;
  --neon-amber: #ffaa00;
  
  /* Text & Utility */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-dim: rgba(255, 255, 255, 0.3);
  
  /* Effects */
  --glass-border: rgba(255, 255, 255, 0.08);
  --neon-glow: 0 0 20px rgba(157, 0, 255, 0.3);
  --shadow-deep: 0 20px 50px rgba(0, 0, 0, 0.8);
  
  /* Hardware Acceleration */
  --gpu: translateZ(0);
}

/* 1. GLOBAL LAYOUT - THE VOID */
body {
  margin: 0;
  background: var(--bg-void);
  background-image: 
    radial-gradient(circle at 50% 50%, #0d0426 0%, transparent 80%),
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
  background-size: 100% 100%, 100% 4px, 100% 100%;
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
  height: 100vh;
}

/* 2. ULTIMATE GLASS PANELS */
.panel {
  background: var(--bg-panel);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  box-shadow: var(--shadow-deep), inset 0 0 20px rgba(255, 255, 255, 0.02);
  padding: 30px;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s;
}

.panel::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  transition: 0.6s;
}

.panel:hover {
  transform: translateY(-5px) scale(1.005);
  border-color: rgba(157, 0, 255, 0.4);
}

.panel:hover::before {
  left: 200%;
}

/* 3. NEON KPI CARDS */
.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 25px;
  position: relative;
  overflow: hidden;
}

.kpi-card::after {
  content: '';
  position: absolute;
  bottom: 0; right: 0;
  width: 80px; height: 80px;
  background: radial-gradient(circle, var(--neon-purp) 0%, transparent 70%);
  opacity: 0.1;
}

.kpi-value-group .val {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(to bottom, #fff, #888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
}

/* 4. THE ULTIMATE TERMINAL */
.terminal-scroller {
  background: rgba(0, 0, 0, 0.6) !important;
  border: 1px solid #1a1a1a;
  box-shadow: inset 0 0 30px #000;
  border-radius: 12px;
  position: relative;
}

.terminal-scroller::before {
  content: "CRITICAL_SYSTEM_LOG";
  position: absolute;
  top: 10px; right: 20px;
  font-family: 'JetBrains Mono';
  font-size: 8px;
  color: var(--neon-pink);
  opacity: 0.5;
}

.log-line.crit {
  color: var(--neon-pink) !important;
  text-shadow: 0 0 8px var(--neon-pink);
  background: rgba(255, 0, 212, 0.1);
  border-radius: 4px;
  padding: 2px 8px;
}

/* 5. DYNAMIC STATUS INDICATORS */
.status-indicator.green {
  background: var(--neon-green);
  box-shadow: 0 0 15px var(--neon-green), 0 0 30px var(--neon-green);
}

.status-indicator.red {
  background: var(--neon-pink);
  box-shadow: 0 0 15px var(--neon-pink), 0 0 40px var(--neon-pink);
  animation: alarm-blink 0.5s infinite alternate;
}

/* 6. ULTIMATE MAP NODES */
.node-core {
  filter: drop-shadow(0 0 8px var(--neon-purp));
  cursor: pointer;
}

.map-node-group.active .node-glow {
  animation: map-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* 7. SCROLLBARS FROM THE FUTURE */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { 
  background: var(--bg-3); 
  border-radius: 10px; 
  border: 1px solid var(--glass-border); 
}
::-webkit-scrollbar-thumb:hover { background: var(--neon-purp); }

/* 8. ANIMATIONS */
@keyframes alarm-blink {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0.5; transform: scale(1.2); }
}

@keyframes map-ping {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(3.5); opacity: 0; }
}

@keyframes row-pulse {
  0% { background: rgba(255, 0, 212, 0.05); }
  50% { background: rgba(255, 0, 212, 0.15); }
  100% { background: rgba(255, 0, 212, 0.05); }
}
`;