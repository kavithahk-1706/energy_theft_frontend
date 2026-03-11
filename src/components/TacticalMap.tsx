"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { 
  Terminal, Activity, Search, Radar, Ghost, ListFilter, 
  Lock, Unlock, Target, Database, Fingerprint, Compass, 
  ShieldAlert, ZapOff, Cpu, Wifi, Radio, ChevronRight,
  ShieldCheck, AlertTriangle, Zap, Server, Globe, Power
} from 'lucide-react';
import { useUser, SignOutButton } from "@clerk/nextjs";

import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// --- ADVANCED SIMULATION ENGINE ---
// Generates 1000 nodes with localized "chaos" factors for a cinematic feel
const generateTacticalData = () => {
  const nodes = [];
  const HYD_CENTER = [17.3850, 78.4867];
  for (let i = 0; i < 1000; i++) {
    const lat = HYD_CENTER[0] + (Math.random() - 0.5) * 0.45;
    const lng = HYD_CENTER[1] + (Math.random() - 0.5) * 0.45;
    const riskFactor = Math.random();
    const risk = riskFactor > 0.96 ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40);
    
    nodes.push({
      id: `VG-UNIT-${i.toString(16).toUpperCase().padStart(4, '0')}`,
      coords: [lat, lng] as [number, number],
      risk,
      load: (Math.random() * 800 + 200).toFixed(2),
      temp: (24 + Math.random() * 18).toFixed(1),
      stability: (95 + Math.random() * 5).toFixed(2),
      vitals: Array.from({ length: 30 }, (_, j) => ({ 
        t: j, 
        v: Math.floor(Math.random() * 40) + (risk > 80 ? 50 : 10) 
      }))
    });
  }
  return nodes.sort((a, b) => b.risk - a.risk);
};

const MASTER_DATA = generateTacticalData();

// --- TACTICAL COMPONENTS ---

const MapFocusHandler = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 2, easeLinearity: 0.2 });
  }, [center, zoom, map]);
  return null;
};

// --- MAIN OS INTERFACE ---

export default function SudarshanCinemaOS() {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [activeNode, setActiveNode] = useState(MASTER_DATA[0]);
  const [search, setSearch] = useState("");
  const [isLockdown, setIsLockdown] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [sysTime, setSysTime] = useState(new Date().toLocaleTimeString());
  const logEndRef = useRef<HTMLDivElement>(null);

  // System Initialization Sequence
  useEffect(() => {
    setIsMounted(true);
    const bootSequence = [
      ">> INITIALIZING SUDARSHAN CORE_CORE_v12.5...",
      ">> CLERK_AUTH_SESSION: VALIDATED",
      ">> MESH_NETWORK_DISCOVERY: 1,000 NODES FOUND",
      ">> APPLYING TACTICAL_DARK_LAYER...",
      ">> GEOSPATIAL_ENCRYPTION: ACTIVE",
      ">> SYSTEM READY. STANDBY OPERATOR."
    ];
    
    bootSequence.forEach((msg, i) => {
      setTimeout(() => setLogs(prev => [...prev, msg]), i * 450);
    });

    const timer = setInterval(() => {
      setSysTime(new Date().toLocaleTimeString());
      if (Math.random() > 0.85) {
        const rNode = MASTER_DATA[Math.floor(Math.random() * 50)];
        setLogs(prev => [...prev.slice(-15), `[ALERT] FLUCTUATION @ ${rNode.id}`]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll logic for terminal
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const registry = useMemo(() => {
    return MASTER_DATA.filter(n => n.id.includes(search.toUpperCase())).slice(0, 60);
  }, [search]);

  if (!isMounted) return <div className="os-booting">ENCRYPTING_SESSION...</div>;

  return (
    <div className={`os-root ${isLockdown ? 'mode-lockdown' : ''}`}>
      {/* VFX LAYERS */}
      <div className="os-noise" />
      <div className="os-scanlines" />

      {/* TOP NAVIGATION HUD */}
      <header className="os-nav">
        <div className="nav-group">
          <Ghost className="os-logo" size={28} />
          <div className="os-brand">
            <h1>SUDARSHAN CORE <span className="text-glitch">CINEMA_OS</span></h1>
            <p>ID: {user?.id?.slice(-8) || "GHOST_OPERATOR"}</p>
          </div>
        </div>

        <div className="os-global-stats">
          <div className="nav-stat">
            <label>UPTIME</label>
            <span>99.998%</span>
          </div>
          <div className="nav-stat">
            <label>TIME_UTC</label>
            <span>{sysTime}</span>
          </div>
          <div className="nav-stat">
            <label>MESH_SAT</label>
            <span className="text-neon">SECURE</span>
          </div>
        </div>

        <div className="os-auth">
          <div className="auth-meta">
            <span className="op-name">{user?.firstName || "OP_NULL"}</span>
            <SignOutButton><button className="op-exit">TERMINATE</button></SignOutButton>
          </div>
          <div className="op-avatar-frame">
            <img src={user?.imageUrl} alt="AVATAR" />
          </div>
        </div>
      </header>

      {/* BENTO GRID WORKSPACE */}
      <main className="os-grid">
        
        {/* LARGE MAP BENTO (Main Viewport) */}
        <section className="bento-tile map-tile">
          <div className="tile-header">
            <Compass size={14} className="icon-violet" />
            <span>GEOSPATIAL_INTERCEPT_LAYER_v11</span>
            <div className="map-coords">
              {activeNode.coords[0].toFixed(5)}°N, {activeNode.coords[1].toFixed(5)}°E
            </div>
          </div>
          <div className="map-view-container">
            <MapContainer center={activeNode.coords} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                className="tactical-tiles"
              />
              <MapFocusHandler center={activeNode.coords} zoom={isLockdown ? 16 : 14} />
              {MASTER_DATA.slice(0, 500).map(node => (
                <Circle 
                  key={node.id}
                  center={node.coords}
                  radius={activeNode.id === node.id ? 900 : 220}
                  eventHandlers={{ click: () => setActiveNode(node) }}
                  pathOptions={{
                    color: node.risk > 80 ? '#ff0055' : (activeNode.id === node.id ? '#bc13fe' : '#333'),
                    fillColor: node.risk > 80 ? '#ff0055' : (activeNode.id === node.id ? '#bc13fe' : '#111'),
                    fillOpacity: activeNode.id === node.id ? 0.9 : 0.4,
                    weight: activeNode.id === node.id ? 3 : 1
                  }}
                />
              ))}
            </MapContainer>
            <div className="map-vignette" />
          </div>
        </section>

        {/* SIDEBAR BENTO STACK */}
        <div className="os-sidebar">
          
          {/* TERMINAL BENTO */}
          <div className="bento-tile terminal-tile">
            <div className="tile-header"><Terminal size={14}/> SYSTEM_TERMINAL</div>
            <div className="terminal-body">
              {logs.map((log, i) => (
                <div key={i} className="terminal-row">
                  <span className="row-ptr">{">"}</span> {log}
                </div>
              ))}
              <div ref={logEndRef} className="terminal-cursor" />
            </div>
          </div>

          {/* ANALYTICS BENTO */}
          <div className="bento-tile metrics-tile">
            <div className="tile-header"><Activity size={14}/> TELEMETRY: {activeNode.id}</div>
            <div className="metrics-body">
              <div className="focus-risk">
                <h2 className={activeNode.risk > 80 ? 'text-alert' : ''}>{activeNode.risk}<span>%</span></h2>
                <p>THREAT_PROBABILITY</p>
              </div>
              <div className="mini-grid">
                <div className="m-pill"><label>LOAD</label><span>{activeNode.load} kW</span></div>
                <div className="m-pill"><label>TEMP</label><span>{activeNode.temp} °C</span></div>
                <div className="m-pill"><label>STAB</label><span>{activeNode.stability}%</span></div>
                <div className="m-pill"><label>MODE</label><span>ACTIVE</span></div>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={activeNode.vitals}>
                    <defs>
                      <linearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#bc13fe" strokeWidth={2} fill="url(#neonGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* REGISTRY BENTO */}
          <div className="bento-tile registry-tile">
            <div className="tile-header"><Database size={14}/> NODE_REGISTRY</div>
            <div className="search-bar">
              <Search size={14} className="icon-dim" />
              <input 
                placeholder="SCAN_HEX_ID..." 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <div className="registry-scroll">
              {registry.map(node => (
                <div 
                  key={node.id} 
                  className={`reg-item ${activeNode.id === node.id ? 'selected' : ''}`}
                  onClick={() => setActiveNode(node)}
                >
                  <div className="reg-id-box">
                    <span className="reg-name">{node.id}</span>
                    <span className="reg-meta">{node.load} kW</span>
                  </div>
                  <span className={`reg-risk ${node.risk > 80 ? 'alert' : ''}`}>{node.risk}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* COMMAND BENTO */}
          <div className="bento-tile command-tile">
            <div className="tile-header"><ShieldCheck size={14}/> COMMAND_CENTER</div>
            <div className="command-body">
              <button className="btn-lock" onClick={() => setIsLockdown(!isLockdown)}>
                {isLockdown ? <Unlock size={18}/> : <Lock size={18}/>}
                {isLockdown ? "DISABLE_LOCKDOWN" : "INITIATE_LOCKDOWN"}
              </button>
              <div className="btn-split">
                <button className="btn-sub"><ZapOff size={14}/> KILL_V</button>
                <button className="btn-sub"><Fingerprint size={14}/> TRACE</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="os-footer">
        <div className="f-left"><Server size={10}/> HYDERABAD_GRID_CENTRAL</div>
        <div className="f-center">SUDARSHAN CORE // ENCRYPTED_CHANNEL_A1</div>
        <div className="f-right">BUILD_2026.01.30_v12</div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: TACTICAL_STYLES }} />
    </div>
  );
}

// --- MASSIVE BENTO STYLING ENGINE ---
const TACTICAL_STYLES = `
  :root {
    --bg: #010103;
    --bento: #08080c;
    --violet: #bc13fe;
    --red: #ff0055;
    --neon-cyan: #00f3ff;
    --text: #e2e8f0;
    --border: rgba(188, 19, 254, 0.12);
    --font-mono: 'JetBrains Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-mono); height: 100vh;  margin-top: 6%;}

  /* OVERLAYS */
  .os-noise { position: fixed; inset: 0; background: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.04; pointer-events: none; z-index: 1000; }
  .os-scanlines { position: fixed; inset: 0; background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.1) 50%); background-size: 100% 4px; pointer-events: none; z-index: 1001; opacity: 0.1; }

  .os-root { height: 100vh; display: flex; flex-direction: column; padding: 12px; position: relative; gap: 12px; }
  .mode-lockdown { --violet: var(--red); animation: os-alert 3s infinite; }

  /* NAVIGATION */
  .os-nav { height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border: 1px solid var(--border); border-radius: 16px; background: var(--bento); }
  .nav-group { display: flex; align-items: center; gap: 18px; }
  .os-logo { color: var(--violet); filter: drop-shadow(0 0 10px var(--violet)); }
  .os-brand h1 { font-size: 18px; letter-spacing: 3px; font-weight: 900; }
  .os-brand p { font-size: 8px; opacity: 0.4; letter-spacing: 1px; }
  .text-glitch { color: var(--red); text-shadow: 2px 0 var(--violet); }

  .os-global-stats { display: flex; gap: 40px; }
  .nav-stat label { display: block; font-size: 7px; color: var(--violet); margin-bottom: 3px; }
  .nav-stat span { font-size: 14px; font-weight: bold; }

  .os-auth { display: flex; align-items: center; gap: 15px; background: rgba(188, 19, 254, 0.05); padding: 5px 15px; border-radius: 12px; border: 1px solid var(--border); }
  .op-avatar-frame { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--violet); overflow: hidden; }
  .op-avatar-frame img { width: 100%; height: 100%; object-fit: cover; }
  .auth-meta { text-align: right; }
  .op-name { font-size: 10px; font-weight: bold; display: block; }
  .op-exit { background: none; border: none; color: var(--red); font-size: 8px; cursor: pointer; text-decoration: underline; padding: 0; }

  /* BENTO WORKSPACE */
  .os-grid { flex: 1; display: flex; gap: 12px; overflow: hidden; }
  .map-tile { flex: 1; position: relative; }
  .os-sidebar { width: 360px; display: flex; flex-direction: column; gap: 12px; }

  .bento-tile { background: var(--bento); border: 1px solid var(--border); border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .bento-tile:hover { border-color: var(--violet); box-shadow: 0 0 25px rgba(188, 19, 254, 0.1); }
  .tile-header { padding: 12px 20px; font-size: 9px; font-weight: 900; color: var(--violet); background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }

  /* MAP VIEW */
  .map-view-container { flex: 1; position: relative; background: #000; }
  .tactical-tiles { filter: invert(100%) hue-rotate(180deg) brightness(0.55) contrast(1.2) !important; }
  .map-coords { margin-left: auto; font-size: 9px; opacity: 0.6; }
  .map-vignette { position: absolute; inset: 0; pointer-events: none; z-index: 1000; background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.8) 100%); }

  /* TERMINAL */
  .terminal-tile { height: 160px; }
  .terminal-body { flex: 1; background: #000; padding: 12px; font-size: 9px; color: var(--violet); overflow-y: auto; font-family: 'Courier New', monospace; line-height: 1.5; }
  .terminal-row { margin-bottom: 3px; display: flex; gap: 8px; }
  .row-ptr { opacity: 0.5; }
  .terminal-cursor { width: 7px; height: 12px; background: var(--violet); display: inline-block; animation: blink 1s infinite; }

  /* METRICS */
  .metrics-tile { height: 240px; }
  .metrics-body { padding: 20px; display: flex; flex-direction: column; justify-content: space-between; flex: 1; }
  .focus-risk { text-align: center; }
  .focus-risk h2 { font-size: 52px; font-weight: 900; color: var(--violet); line-height: 1; }
  .focus-risk h2 span { font-size: 18px; opacity: 0.3; }
  .mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 15px; }
  .m-pill { background: rgba(0,0,0,0.4); padding: 8px; border-radius: 10px; border-bottom: 2px solid var(--border); }
  .m-pill label { display: block; font-size: 7px; opacity: 0.4; }
  .m-pill span { font-size: 11px; font-weight: bold; }

  /* REGISTRY */
  .registry-tile { flex: 1; }
  .search-bar { padding: 12px 18px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2); }
  .search-bar input { background: none; border: none; color: #fff; font-size: 11px; outline: none; width: 100%; }
  .registry-scroll { flex: 1; overflow-y: auto; }
  .reg-item { padding: 12px 20px; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.02); cursor: pointer; transition: 0.2s; }
  .reg-item:hover { background: rgba(188, 19, 254, 0.05); }
  .reg-item.selected { background: rgba(188, 19, 254, 0.12); border-left: 4px solid var(--violet); }
  .reg-name { font-weight: bold; font-size: 12px; display: block; }
  .reg-meta { font-size: 8px; opacity: 0.4; }
  .reg-risk { font-weight: bold; color: var(--violet); }
  .reg-risk.alert { color: var(--red); }

  /* COMMAND CENTER */
  .command-tile { height: 160px; flex-shrink: 0; }
  .command-body { padding: 18px; display: flex; flex-direction: column; gap: 10px; }
  .btn-lock { width: 100%; padding: 14px; background: var(--red); border: none; border-radius: 12px; color: #fff; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 5px 15px rgba(255, 0, 85, 0.2); transition: 0.2s; }
  .btn-lock:active { transform: scale(0.98); }
  .btn-split { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .btn-sub { padding: 10px; background: none; border: 1px solid var(--border); color: var(--violet); border-radius: 10px; font-size: 9px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }

  /* FOOTER */
  .os-footer { height: 30px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; font-size: 8px; color: var(--violet); opacity: 0.5; border-top: 1px solid var(--border); margin-top: auto; }

  /* KEYFRAMES */
  @keyframes blink { 50% { opacity: 0; } }
  @keyframes os-alert { 0%, 100% { box-shadow: inset 0 0 120px rgba(255, 0, 85, 0.05); } 50% { box-shadow: inset 0 0 240px rgba(255, 0, 85, 0.15); } }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
  .text-alert { color: var(--red); }
`;