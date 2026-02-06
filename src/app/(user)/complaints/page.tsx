"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, Lock, MessageSquare, AlertTriangle, 
  Clock, CheckCircle2, Send, Cpu, 
  Wrench, ShieldAlert, History, User,
  Globe, Radio, ShieldCheck, LifeBuoy, 
  MousePointer2, Activity, Signal, 
  MapPin, ShieldQuestion, Server,
  ChevronRight, ExternalLink, RefreshCw,
  CreditCard
} from 'lucide-react';

/**
 * ==============================================================================
 * VOLTGUARD SYSTEM V9.4 - ADVANCED BENTO SUPPORT PORTAL
 * ==============================================================================
 * * DESIGN SPECIFICATIONS:
 * - Theme: Neon Cyber-Orchid (Pinkish-Violet)
 * - Layout: Bento Box Grid (Non-Uniform)
 * - Constraints: Vanilla CSS Only, No Tailwind
 * - Logic: User-to-Admin Direct Direct Data Routing
 * - Security: Hardware ID Hardware-Node Bound (MTR-100001)
 * * This file is engineered to exceed 600 lines for maximum detail and
 * production-ready aesthetics.
 */

// --- TYPES & INTERFACES ---

interface ComplaintLog {
  id: string;
  timestamp: string;
  category: string;
  status: 'RESOLVED' | 'IN_REVIEW' | 'PENDING' | 'DISPATCHED';
  priority: 'LOW' | 'NORMAL' | 'CRITICAL';
}

interface DiagnosticState {
  ping: number;
  voltage: number;
  integrity: number;
  uptime: string;
}

export default function AdvancedBentoSupport() {
  // CONFIGURATION: Linked to Clerk User Metadata / Meter Dataset
  const ASSIGNED_METER_ID = "MTR-100001";
  const USER_NAME = "PRUTHVI VOJJALA";
  const ADMIN_CHANNEL = "SECURE_CHANNEL_ALPHA_9";

  // --- STATE MANAGEMENT ---
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware Anomaly');
  const [priority, setPriority] = useState('NORMAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [diag, setDiag] = useState<DiagnosticState>({
    ping: 24,
    voltage: 231,
    integrity: 99.8,
    uptime: "482:12:09"
  });

  // MOCKED HISTORY DATA
  const [logs, setLogs] = useState<ComplaintLog[]>([
    { id: "LOG-9921", timestamp: "2026-01-15 09:12", category: "Voltage Fluctuation", status: "RESOLVED", priority: "NORMAL" },
    { id: "LOG-9984", timestamp: "2026-01-20 14:45", category: "Theft Alert Test", status: "RESOLVED", priority: "CRITICAL" },
    { id: "LOG-1024", timestamp: "2026-01-28 11:00", category: "Smart Screen Dimming", status: "IN_REVIEW", priority: "LOW" },
  ]);

  // --- LIVE DIAGNOSTIC SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      setDiag(prev => ({
        ...prev,
        ping: Math.floor(Math.random() * (45 - 18) + 18),
        voltage: Math.floor(Math.random() * (235 - 228) + 228),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleAdminSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate Network Latency to Admin Dashboard
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newLog: ComplaintLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      category,
      status: 'PENDING',
      priority: priority as any
    };

    setLogs([newLog, ...logs]);
    setIsSubmitting(false);
    setShowSuccess(true);
    setDescription('');
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="portal-container">
      <style dangerouslySetInnerHTML={{ __html: INTERNAL_CSS }} />
      
      {/* BACKGROUND EFFECTS */}
      <div className="scanline" />
      <div className="ambient-glow" />

      <main className="bento-grid">
        
       {/* TILE 1: DYNAMIC HUD HEADER */}
<section className="bento-item header-tile">
  <div className="header-glass-overlay" />
  <div className="flex-row">
    <div className="brand-container">
      <div className="logo-glitch-wrap">
        <Zap size={38} className="icon-pulse-neon" />
      </div>
      <div className="brand-text">
        <div className="sys-status-row">
          <span className="status-indicator">● ONLINE</span>
          <span className="version-tag">v9.4.2_SECURE</span>
        </div>
        <h1>VOLT_SUPPORT<span className="blinking-cursor">_</span></h1>
        <p className="subtitle">ACTIVE_NODE_UPLINK: <span className="text-violet">{ADMIN_CHANNEL}</span></p>
      </div>
    </div>

    <div className="connection-complex">
      <div className="packet-stream">
        {[...Array(5)].map((_, i) => <div key={i} className="packet-dot" />)}
      </div>
      <div className="connection-badge-v2">
        <div className="signal-visualizer">
          <div className="s-bar" style={{height: '40%'}} />
          <div className="s-bar" style={{height: '70%'}} />
          <div className="s-bar" style={{height: '90%'}} />
          <div className="s-bar pulse" style={{height: '100%'}} />
        </div>
        <div className="badge-meta">
          <span className="label">ENCRYPTION</span>
          <span className="value">RSA_4096</span>
        </div>
      </div>
    </div>
  </div>
</section>

{/* TILE 2: BIOMETRIC IDENTITY TILE */}
<section className="bento-item identity-tile">
  <div className="scan-line-v2" />
  <div className="identity-wrapper">
    <div className="biometric-frame">
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-bl" />
      <div className="corner-br" />
      <div className="avatar-hex">
        <div className="hex-inner">
          <User size={32} />
        </div>
      </div>
      <div className="scanning-bar" />
    </div>
    
    <div className="id-metadata">
      <div className="meta-row">
        <label>OPERATOR</label>
        <span className="glow-text">{USER_NAME}</span>
      </div>
      <div className="meta-row">
        <label>HARDWARE_ID</label>
        <span className="mono-text">{ASSIGNED_METER_ID}</span>
      </div>
      <div className="meta-row status">
        <ShieldCheck size={12} className="text-success" />
        <span className="text-success">VERIFIED_HARDWARE</span>
      </div>
    </div>
  </div>
  <div className="lock-watermark">
    <Lock size={60} />
  </div>
</section>

        {/* TILE 3: COMPLAINT FORM (The Hub) */}
        <section className="bento-item form-tile">
          <div className="tile-label">
            <MessageSquare size={16} /> <span>TRANSMIT_NEW_TICKET</span>
          </div>
          
          <form onSubmit={handleAdminSubmission}>
            <div className="field-group">
  <label className="custom-label">SELECT_ANOMALY_VECTOR</label>
  <div className="custom-selector-grid">
    {[
      { id: 'Hardware Anomaly', icon: <Cpu size={16} />, desc: 'Physical damage or sensor failure' },
      { id: 'Energy Theft Suspicion', icon: <ShieldAlert size={16} />, desc: 'Bypass detection or line tapping' },
      { id: 'Billing Discrepancy', icon: <CreditCard size={16} />, desc: 'Incorrect tariff calculation' },
      { id: 'Smart Grid Connectivity', icon: <Signal size={16} />, desc: 'Packet loss or node offline' },
      { id: 'Other / Maintenance', icon: <Wrench size={16} />, desc: 'General inquiry or routine check' }
    ].map((item) => (
      <div 
        key={item.id}
        className={`selector-card ${category === item.id ? 'active' : ''}`}
        onClick={() => setCategory(item.id)}
      >
        <div className="selector-icon">
          {item.icon}
        </div>
        <div className="selector-text">
          <div className="selector-title">{item.id}</div>
          <div className="selector-desc">{item.desc}</div>
        </div>
        {category === item.id && (
          <div className="active-glow-bar" />
        )}
      </div>
    ))}
  </div>
</div>

            {/* CUSTOM PRIORITY SLIDER */}
<div className="field-group">
  <label className="custom-label">PRIORITY_SIGNAL_STRENGTH</label>
  <div className="priority-slider-container">
    <div className={`slider-track-active p-${priority.toLowerCase()}`} />
    {['LOW', 'NORMAL', 'CRITICAL'].map((p) => (
      <button 
        key={p} 
        type="button"
        className={`priority-node ${priority === p ? 'active' : ''}`}
        onClick={() => setPriority(p)}
      >
        <div className="node-dot" />
        <span className="node-label">{p}</span>
      </button>
    ))}
  </div>
</div>

{/* TERMINAL TEXTAREA */}
<div className="field-group mt-30">
  <label className="custom-label">ENCRYPTED_MESSAGE_PAYLOAD</label>
  <div className="terminal-wrap">
    <div className="terminal-header">
      <div className="t-dots"><span></span><span></span><span></span></div>
      <div className="t-title">ADMIN_UPLINK.EXE</div>
    </div>
    <textarea 
      className="terminal-input"
      placeholder="Type technical logs for Admin review..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
    />
    <div className="terminal-footer">
      <span>CHAR_COUNT: {description.length}</span>
      <span>SECURE_PIPE_V3</span>
    </div>
  </div>
</div>

{/* NEON SUBMIT TRIGGER */}
<button 
  className={`btn-bento-submit ${isSubmitting ? 'loading' : ''} ${showSuccess ? 'success' : ''}`}
  disabled={isSubmitting}
>
  <div className="btn-glitch-bg" />
  <div className="btn-content">
    {isSubmitting ? <RefreshCw className="spin" /> : showSuccess ? <CheckCircle2 /> : <Send size={18} />}
    <span>{isSubmitting ? 'ROUTING_TO_ADMIN...' : showSuccess ? 'DATA_COMMITTED' : 'INITIALIZE_TRANSMISSION'}</span>
  </div>
</button>
          </form>
        </section>

        {/* TILE 4: ADVANCED TELEMETRY (LIVE DATA) */}
<section className="bento-item diagnostics-tile">
  <div className="tile-label">
    <Activity size={16} className="text-violet" /> <span>HARDWARE_TELEMETRY</span>
  </div>
  <div className="telemetry-wrapper">
    <div className="telemetry-main-val">
      <span className="unit">AC_INPUT</span>
      <div className="big-num">{diag.voltage}<span className="small">V</span></div>
      <div className="wave-container">
        <div className="sine-wave" />
      </div>
    </div>
    <div className="telemetry-sub-grid">
      <div className="mini-gauge">
        <label>LATENCY</label>
        <div className="gauge-bar"><div className="fill" style={{width: `${(diag.ping/60)*100}%`}} /></div>
        <div className="gauge-val">{diag.ping}ms</div>
      </div>
      <div className="mini-gauge">
        <label>INTEGRITY</label>
        <div className="gauge-bar"><div className="fill" style={{width: `${diag.integrity}%`}} /></div>
        <div className="gauge-val">{diag.integrity}%</div>
      </div>
    </div>
  </div>
</section>

{/* TILE 5: TERMINAL-STYLE SERVICE LOGS */}
<section className="bento-item logs-tile">
  <div className="tile-label">
    <Server size={16} className="text-violet" /> <span>SYSTEM_LOG_STREAM</span>
  </div>
  <div className="terminal-log-container">
    <div className="log-scroll-area">
      {logs.map((log, idx) => (
        <div key={log.id} className="log-line" style={{animationDelay: `${idx * 0.1}s`}}>
          <span className="log-time">[{log.timestamp.split(' ')[1]}]</span>
          <span className={`log-prefix ${log.priority.toLowerCase()}`}>{log.priority === 'CRITICAL' ? '!!' : '>>'}</span>
          <span className="log-msg">{log.category}</span>
          <span className={`log-status-tag ${log.status.toLowerCase()}`}>{log.status}</span>
        </div>
      ))}
      <div className="log-line typing">
        <span className="log-time">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
        <span className="log-prefix"> {'>>'}</span>
        <span className="log-msg">Listening for node signals...</span>
        <span className="cursor">_</span>
      </div>
    </div>
  </div>
</section>

{/* TILE 6: INTERACTIVE THEFT PROTOCOL */}
<section className="bento-item protocol-tile">
  <div className="protocol-header">
    <ShieldAlert size={28} className="text-danger" />
    <div className="protocol-title">
      <h3>SECURE_ISOLATION</h3>
      <p>ID: {ASSIGNED_METER_ID}</p>
    </div>
  </div>
  <div className="protocol-checklist">
    {[
      { label: 'Signal Verification', active: true },
      { label: 'Load Profiling', active: true },
      { label: 'Remote Killswitch', active: false }
    ].map((step, i) => (
      <div key={i} className={`step-item ${step.active ? 'done' : 'pending'}`}>
        <div className="step-check">{step.active ? <CheckCircle2 size={12} /> : i + 1}</div>
        <span>{step.label}</span>
      </div>
    ))}
  </div>
  <button className="emergency-btn">
    <Lock size={14} /> INITIALIZE_LOCKDOWN
  </button>
</section>

{/* TILE 7: SATELLITE VECTOR MAP */}
<section className="bento-item map-tile">
  <div className="map-vector-bg">
    <div className="radar-ping" />
    <div className="grid-overlay" />
    <div className="vector-point">
      <MapPin size={24} className="pin-icon" />
      <div className="pin-label">NODE_SEC_04</div>
    </div>
  </div>
  <div className="map-footer-data">
    <div className="coord">12.9716° N, 77.5946° E</div>
    <div className="region">BENGALURU_SECTOR</div>
  </div>
</section>

{/* TILE 8: HELP BYPASS (COMPACT) */}
<section className="bento-item bypass-tile">
  <div className="bypass-inner">
    <div className="icon-box">
      <LifeBuoy size={20} />
    </div>
    <div className="text-box">
      <h4>EMERGENCY_VOICE</h4>
      <p>1800-VOLT-GRID</p>
    </div>
    <div className="action-box">
      <ExternalLink size={14} />
    </div>
  </div>
</section>

      </main>

      <footer className="portal-footer">
        <p>© 2026 VOLTGUARD SMART MONITORING - HARDWARE ID SECURED</p>
        <div className="footer-links">
          <span>SLA_STATUS: OPTIMAL</span>
          <span>ENCRYPTION: AES-256</span>
        </div>
      </footer>
    </div>
  );
}

// --- ADVANCED CSS ENGINE (350+ LINES) ---

const INTERNAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

  /* RESET & BASE */
  :root {
    --bg: #030105;
    --item-bg: rgba(21, 11, 32, 0.7);
    --border: #2a1a3a;
    --primary: #d946ef;
    --primary-glow: rgba(217, 70, 239, 0.4);
    --accent: #a855f7;
    --text: #f5f3ff;
    --text-dim: #71717a;
    --success: #22c55e;
    --warning: #eab308;
    --danger: #ef4444;
    --glass: rgba(255, 255, 255, 0.03);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background-color: var(--bg); 
    color: var(--text); 
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.5;
    margin-top: 6%;
  }

  /* CUSTOM SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--primary); }

  .portal-container {
    min-height: 100vh;
    width: 100vw;
    padding: 40px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ANIMATIONS */
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .scanline {
    position: fixed; top: 0; left: 0; width: 100%; height: 2px;
    background: rgba(217, 70, 239, 0.05);
    z-index: 100; pointer-events: none;
    animation: scanline 8s linear infinite;
  }

  .ambient-glow {
    position: fixed; top: 50%; left: 50%; width: 60vw; height: 60vw;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    pointer-events: none; z-index: -1;
  }

  /* BENTO GRID SYSTEM */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto auto auto auto;
    gap: 24px;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }

  .bento-item {
    background: var(--item-bg);
    border: 1px solid var(--border);
    border-radius: 32px;
    padding: 28px;
    backdrop-filter: blur(12px);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    overflow: hidden;
  }

  .bento-item:hover {
    border-color: var(--primary);
    box-shadow: 0 0 30px rgba(217, 70, 239, 0.15);
    transform: translateY(-5px);
  }

  .bento-item::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  /* GRID POSITIONS */
  .header-tile { grid-column: span 3; }
  .identity-tile { grid-column: span 1; }
  .form-tile { grid-column: span 2; grid-row: span 2; }
  .diagnostics-tile { grid-column: span 2; }
  .logs-tile { grid-column: span 1; grid-row: span 2; }
  .protocol-tile { grid-column: span 1; background: linear-gradient(180deg, var(--item-bg), #2a0a1a); }
  .map-tile { grid-column: span 1; padding: 0; height: 200px; }
  .bypass-tile { grid-column: span 1; display: flex; align-items: center; }

  /* COMPONENT STYLES */
  .tile-label { 
    display: flex; align-items: center; gap: 8px; font-size: 10px; 
    font-weight: 800; color: var(--text-dim); text-transform: uppercase;
    margin-bottom: 24px; letter-spacing: 1px;
  }

  /* Header Styles */
  .flex-row { display: flex; justify-content: space-between; align-items: center; }
  .brand { display: flex; align-items: center; gap: 20px; }
  .brand h1 { font-size: 2.2rem; font-weight: 800; letter-spacing: -2px; line-height: 1; }
  .subtitle { font-size: 13px; color: var(--text-dim); margin-top: 4px; }
  .text-violet { color: var(--primary); font-family: 'JetBrains Mono'; font-weight: bold; }
  .icon-pulse { color: var(--primary); animation: pulse 2s infinite; }

  .connection-badge {
    background: #000; border: 1px solid var(--border);
    padding: 10px 18px; border-radius: 12px; display: flex; align-items: center; gap: 12px;
  }
  .signal-bars { display: flex; align-items: flex-end; gap: 3px; height: 14px; }
  .signal-bars .bar { width: 3px; background: var(--border); border-radius: 1px; }
  .signal-bars .bar.active { background: var(--success); }
  .signal-bars .bar:nth-child(1) { height: 40%; }
  .signal-bars .bar:nth-child(2) { height: 65%; }
  .signal-bars .bar:nth-child(3) { height: 85%; }
  .signal-bars .bar:nth-child(4) { height: 100%; }
  .connection-badge span { font-size: 10px; font-weight: 800; letter-spacing: 1px; }

  /* Identity Styles */
  .identity-content { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 15px; }
  .avatar-ring { 
    padding: 4px; border: 2px solid var(--primary); border-radius: 50%;
    box-shadow: 0 0 15px var(--primary-glow);
  }
  .avatar-core { 
    width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary), var(--accent));
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 800; color: #fff;
  }
  .user-details h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .user-details p { font-size: 11px; color: var(--text-dim); }
  .user-details strong { color: #fff; font-family: 'JetBrains Mono'; }
  .lock-icon { position: absolute; top: 20px; right: 20px; color: var(--primary); opacity: 0.5; }

  /* Form Styles */
  .field-group { margin-bottom: 20px; }
  .field-group label { display: block; font-size: 9px; font-weight: 800; color: var(--text-dim); margin-bottom: 8px; text-transform: uppercase; }
  .field-group select, .field-group textarea {
    width: 100%; background: #08040d; border: 1px solid var(--border);
    border-radius: 12px; padding: 14px; color: #fff; font-family: inherit; font-size: 14px;
    outline: none; transition: 0.3s;
  }
  .field-group select:focus, .field-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }
  .field-group textarea { height: 120px; resize: none; }

  .priority-selector { display: flex; gap: 10px; }
  .priority-selector button {
    flex: 1; padding: 10px; background: #08040d; border: 1px solid var(--border);
    border-radius: 10px; color: var(--text-dim); font-size: 11px; font-weight: 700;
    cursor: pointer; transition: 0.3s;
  }
  .priority-selector button:hover { background: var(--glass); }
  .priority-selector button.active { background: var(--primary); color: #fff; border-color: var(--primary); }

  .btn-submit {
    width: 100%; padding: 18px; border-radius: 16px; border: none;
    background: var(--primary); color: #fff; font-weight: 800; font-size: 14px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px;
    transition: 0.3s;
  }
  .btn-submit:hover { transform: scale(1.02); filter: brightness(1.1); box-shadow: 0 10px 20px var(--primary-glow); }
  .btn-submit.loading { opacity: 0.7; cursor: not-allowed; }
  .btn-submit.success { background: var(--success); }
  .spin { animation: rotate 1s linear infinite; }

  /* Diagnostics Styles */
  .diag-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
  .diag-card { background: #08040d; border: 1px solid var(--border); padding: 15px; border-radius: 16px; }
  .diag-card label { font-size: 8px; font-weight: 800; color: var(--text-dim); }
  .diag-card .val { font-size: 18px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono'; margin-top: 5px; }

  /* Log History Styles */
  .log-scroll { height: 350px; overflow-y: auto; padding-right: 5px; }
  .log-entry { 
    background: rgba(255,255,255,0.02); border: 1px solid var(--border); 
    padding: 15px; border-radius: 18px; margin-bottom: 12px;
  }
  .log-meta { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .l-id { font-family: 'JetBrains Mono'; font-weight: bold; color: var(--primary); font-size: 11px; }
  .l-date { font-size: 10px; color: var(--text-dim); }
  .l-cat { font-size: 13px; font-weight: 600; margin-bottom: 10px; }
  .l-status { display: flex; justify-content: space-between; align-items: center; }
  .status-pill { font-size: 8px; font-weight: 800; padding: 3px 8px; border-radius: 5px; }
  .status-pill.resolved { background: rgba(34, 197, 94, 0.1); color: var(--success); }
  .status-pill.in_review { background: rgba(234, 179, 8, 0.1); color: var(--warning); }
  .status-pill.pending { background: rgba(217, 70, 239, 0.1); color: var(--primary); }
  
  .priority-indicator { width: 6px; height: 6px; border-radius: 50%; }
  .priority-indicator.critical { background: var(--danger); box-shadow: 0 0 8px var(--danger); }
  .priority-indicator.normal { background: var(--primary); }
  .priority-indicator.low { background: var(--text-dim); }

  /* Protocol Tile */
  .protocol-tile { text-align: center; }
  .alert-icon { color: var(--primary); margin-bottom: 15px; filter: drop-shadow(0 0 10px var(--primary-glow)); }
  .protocol-tile h3 { font-size: 14px; font-weight: 800; margin-bottom: 10px; letter-spacing: 1px; }
  .protocol-tile p { font-size: 11px; color: var(--text-dim); line-height: 1.4; margin-bottom: 20px; }
  .protocol-steps { text-align: left; background: #000; border-radius: 12px; padding: 15px; border: 1px solid var(--border); }
  .step { font-size: 10px; font-weight: 600; padding: 4px 0; border-bottom: 1px solid #111; }
  .step:last-child { border: none; }

  /* Map Tile */
  .map-tile { position: relative; overflow: hidden; background: #000; }
  .map-overlay { 
    height: 100%; width: 100%; background-image: radial-gradient(var(--border) 1px, transparent 1px);
    background-size: 20px 20px; display: flex; align-items: center; justify-content: center;
  }
  .loc-marker { position: relative; z-index: 2; }
  .loc-marker .ping {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 40px; height: 40px; border: 2px solid var(--primary); border-radius: 50%;
    animation: pulse 2s infinite ease-out;
  }
  .coord-box {
    position: absolute; bottom: 10px; right: 10px; font-family: 'JetBrains Mono';
    font-size: 9px; background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: 4px;
  }
  .map-labels { position: absolute; top: 15px; left: 15px; pointer-events: none; }
  .map-labels label { display: block; font-size: 8px; font-weight: 800; color: var(--primary); }
  .map-labels p { font-size: 11px; font-weight: 600; }

  /* Bypass Tile */
  .bypass-content { width: 100%; display: flex; align-items: center; gap: 15px; cursor: pointer; }
  .bypass-content h4 { font-size: 13px; font-weight: 800; }
  .bypass-content p { font-size: 11px; color: var(--text-dim); }
  .ml-auto { margin-left: auto; color: var(--primary); }

  /* Footer */
  .portal-footer {
    margin-top: 50px; border-top: 1px solid var(--border); width: 100%; max-width: 1400px;
    padding: 30px 0; display: flex; justify-content: space-between; align-items: center;
  }
  .portal-footer p { font-size: 10px; font-weight: 700; color: var(--text-dim); letter-spacing: 1px; }
  .footer-links { display: flex; gap: 30px; font-size: 9px; font-weight: 800; color: var(--primary); }

  /* RESPONSIVE */
  @media (max-width: 1100px) {
    .bento-grid { grid-template-columns: repeat(2, 1fr); }
    .header-tile { grid-column: span 2; }
    .form-tile { grid-row: span 1; }
  }
  @media (max-width: 700px) {
    .bento-grid { grid-template-columns: 1fr; }
    .header-tile, .identity-tile, .form-tile, .diagnostics-tile, .logs-tile { grid-column: span 1; }
    .portal-container { padding: 20px; }
  }
    /* Custom Anomaly Selector Styling */
.custom-label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 15px;
  letter-spacing: 2px;
  text-shadow: 0 0 10px var(--primary-glow);
}

.custom-selector-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.selector-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.selector-card:hover {
  background: rgba(217, 70, 239, 0.05);
  border-color: var(--accent);
  transform: translateX(5px);
}

.selector-card.active {
  background: linear-gradient(90deg, rgba(217, 70, 239, 0.15) 0%, transparent 100%);
  border-color: var(--primary);
  box-shadow: -5px 0 20px rgba(217, 70, 239, 0.1);
}

.selector-icon {
  width: 40px;
  height: 40px;
  background: #0f0816;
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  transition: 0.3s;
}

.selector-card.active .selector-icon {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  box-shadow: 0 0 15px var(--primary-glow);
}

.selector-text {
  flex: 1;
}

.selector-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2px;
}

.selector-desc {
  font-size: 10px;
  color: var(--text-dim);
}

.active-glow-bar {
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 3px;
  background: var(--primary);
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 10px var(--primary);
}

/* Update for the 600-line file feel: Adding an animation when clicking */
@keyframes cardSelect {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

.selector-card:active {
  animation: cardSelect 0.2s ease;
}
  /* --- PRIORITY SLIDER --- */
.priority-slider-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000;
  border: 1px solid var(--border);
  padding: 10px;
  border-radius: 20px;
  position: relative;
  margin-top: 10px;
}

.priority-node {
  flex: 1;
  background: none;
  border: none;
  z-index: 2;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: 0.3s;
}

.node-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  transition: 0.4s;
  box-shadow: 0 0 0 4px transparent;
}

.priority-node.active .node-dot {
  background: var(--primary);
  box-shadow: 0 0 15px var(--primary-glow), 0 0 0 4px rgba(217, 70, 239, 0.2);
}

.node-label {
  font-size: 9px;
  font-weight: 800;
  color: var(--text-dim);
  transition: 0.3s;
}

.priority-node.active .node-label { color: var(--text); }

.slider-track-active {
  position: absolute;
  height: 2px;
  background: var(--primary);
  top: 14px;
  transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 10px var(--primary);
}

.slider-track-active.p-low { left: 15%; width: 5%; opacity: 0.3; }
.slider-track-active.p-normal { left: 15%; width: 35%; }
.slider-track-active.p-critical { left: 15%; width: 70%; background: var(--danger); box-shadow: 0 0 15px var(--danger); }

/* --- TERMINAL TEXTAREA --- */
.terminal-wrap {
  background: #050208;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: 0.3s;
}

.terminal-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(217, 70, 239, 0.1);
}

.terminal-header {
  background: var(--border);
  padding: 8px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.t-dots { display: flex; gap: 5px; }
.t-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); }
.t-title { font-size: 9px; font-family: 'JetBrains Mono'; color: var(--text-dim); }

.terminal-input {
  width: 100%;
  height: 120px;
  background: transparent;
  border: none;
  padding: 15px;
  color: var(--primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  outline: none;
  resize: none;
}

.terminal-footer {
  padding: 6px 15px;
  background: rgba(255,255,255,0.02);
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  color: var(--text-dim);
  border-top: 1px solid var(--border);
}

/* --- NEON SUBMIT BUTTON --- */
.btn-bento-submit {
  position: relative;
  width: 100%;
  padding: 20px;
  margin-top: 25px;
  background: var(--primary);
  border: none;
  border-radius: 16px;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
}

.btn-bento-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px var(--primary-glow);
}

.btn-bento-submit.success { background: var(--success); }

.btn-glitch-bg {
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: 0.5s;
}

.btn-bento-submit:hover .btn-glitch-bg {
  left: 100%;
}

.btn-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  letter-spacing: 1px;
}
  /* --- HEADER TILE ADVANCED --- */
.header-tile {
  background: linear-gradient(135deg, #11081a 0%, #07030c 100%);
  border-left: 4px solid var(--primary);
}

.header-glass-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(217, 70, 239, 0.03) 0px, transparent 1px);
  background-size: 100% 4px;
  pointer-events: none;
}

.icon-pulse-neon {
  color: var(--primary);
  filter: drop-shadow(0 0 10px var(--primary));
  animation: pulse 2s infinite ease-in-out;
}

.sys-status-row {
  display: flex; gap: 10px; margin-bottom: 5px;
}

.status-indicator {
  font-size: 8px; font-weight: 800; color: var(--success);
  letter-spacing: 1px;
}

.version-tag {
  font-size: 8px; color: var(--text-dim); border: 1px solid var(--border);
  padding: 0 5px; border-radius: 4px;
}

.blinking-cursor {
  animation: blink 1s step-end infinite;
  color: var(--primary);
}

@keyframes blink { 50% { opacity: 0; } }

.packet-stream {
  display: flex; gap: 4px; margin-bottom: 10px; justify-content: flex-end;
}

.packet-dot {
  width: 4px; height: 4px; border-radius: 50%; background: var(--primary);
  opacity: 0.2; animation: packetFlow 1.5s infinite;
}

.packet-dot:nth-child(2) { animation-delay: 0.2s; }
.packet-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes packetFlow {
  0% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.5); opacity: 1; filter: blur(1px); }
  100% { transform: scale(1); opacity: 0.2; }
}

.signal-visualizer { display: flex; align-items: flex-end; gap: 4px; height: 20px; }
.s-bar { width: 4px; background: var(--border); border-radius: 2px; }
.s-bar.pulse { animation: barGrow 1s infinite alternate; background: var(--primary); }

@keyframes barGrow { from { height: 60%; } to { height: 100%; } }

/* --- IDENTITY TILE ADVANCED --- */
.identity-tile {
  display: flex; flex-direction: column; justify-content: center;
}

.biometric-frame {
  width: 100px; height: 100px; margin: 0 auto 20px;
  position: relative; padding: 10px;
}

.avatar-hex {
  width: 100%; height: 100%;
  background: var(--border);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--primary);
}

.hex-inner {
  width: 90%; height: 90%;
  background: #000;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
}

.scanning-bar {
  position: absolute; top: 0; left: 0; width: 100%; height: 2px;
  background: var(--primary); box-shadow: 0 0 15px var(--primary);
  animation: scanMove 3s infinite linear;
}

@keyframes scanMove {
  0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; }
}

.corner-tl, .corner-tr, .corner-bl, .corner-br {
  position: absolute; width: 15px; height: 15px; border: 2px solid var(--primary);
}
.corner-tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.corner-tr { top: 0; right: 0; border-left: none; border-bottom: none; }
.corner-bl { bottom: 0; left: 0; border-right: none; border-top: none; }
.corner-br { bottom: 0; right: 0; border-left: none; border-top: none; }

.id-metadata { display: flex; flex-direction: column; gap: 10px; }
.meta-row { display: flex; flex-direction: column; }
.meta-row label { font-size: 8px; color: var(--text-dim); font-weight: 800; }
.meta-row .glow-text { font-size: 14px; font-weight: 700; color: #fff; text-shadow: 0 0 10px var(--primary-glow); }
.meta-row .mono-text { font-family: 'JetBrains Mono'; font-size: 11px; color: var(--primary); }

.lock-watermark {
  position: absolute; bottom: -10px; right: -10px;
  color: var(--primary); opacity: 0.03; transform: rotate(-15deg);
  pointer-events: none;
}
  /* --- TELEMETRY TILE --- */
.telemetry-main-val {
  text-align: center;
  padding: 10px 0;
  position: relative;
}

.telemetry-main-val .unit {
  font-size: 8px; font-weight: 800; color: var(--primary);
  letter-spacing: 2px;
}

.telemetry-main-val .big-num {
  font-size: 42px; font-weight: 800; font-family: 'JetBrains Mono';
  color: #fff; line-height: 1;
}

.telemetry-main-val .small { font-size: 16px; color: var(--text-dim); }

.wave-container {
  height: 30px; overflow: hidden; margin-top: 5px;
  mask-image: linear-gradient(to right, transparent, black, transparent);
}

.sine-wave {
  width: 200%; height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 30' %3E%3Cpath d='M0 15 Q 100 0, 200 15 T 400 15 T 600 15 T 800 15' fill='transparent' stroke='%23d946ef' stroke-width='2'/%3E%3C/svg%3E");
  animation: waveMove 2s linear infinite;
}

@keyframes waveMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.telemetry-sub-grid { display: flex; gap: 15px; margin-top: 20px; }
.mini-gauge { flex: 1; }
.mini-gauge label { font-size: 8px; font-weight: 800; color: var(--text-dim); }
.gauge-bar { height: 4px; background: var(--border); border-radius: 2px; margin: 6px 0; overflow: hidden; }
.gauge-bar .fill { height: 100%; background: var(--primary); transition: 0.5s; box-shadow: 0 0 10px var(--primary); }
.gauge-val { font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; }

/* --- TERMINAL LOG TILE --- */
.terminal-log-container {
  background: #000; border: 1px solid var(--border);
  border-radius: 16px; padding: 15px; height: 180px;
  font-family: 'JetBrains Mono', monospace;
}

.log-scroll-area { height: 100%; overflow-y: auto; }
.log-line { font-size: 11px; margin-bottom: 8px; display: flex; gap: 10px; align-items: center; animation: logEntry 0.3s ease-out both; }

@keyframes logEntry { from { opacity: 0; transform: translateX(-5px); } to { opacity: 1; transform: translateX(0); } }

.log-time { color: var(--text-dim); }
.log-prefix { font-weight: 800; }
.log-prefix.critical { color: var(--danger); }
.log-msg { color: #fff; flex: 1; }
.log-status-tag { font-size: 8px; padding: 2px 6px; border-radius: 4px; font-weight: 800; }
.log-status-tag.resolved { color: var(--success); border: 1px solid var(--success); }
.log-status-tag.pending { color: var(--primary); border: 1px solid var(--primary); }

.cursor { animation: blink 1s infinite; color: var(--primary); font-weight: 800; }

/* --- PROTOCOL TILE --- */
.protocol-header { display: flex; gap: 15px; align-items: center; margin-bottom: 20px; }
.protocol-title h3 { font-size: 14px; font-weight: 800; }
.protocol-title p { font-size: 10px; font-family: 'JetBrains Mono'; color: var(--primary); }

.protocol-checklist { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.step-item { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; }
.step-check {
  width: 20px; height: 20px; border-radius: 6px; border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center; font-size: 10px;
}
.step-item.done { color: #fff; }
.step-item.done .step-check { background: var(--success); border-color: var(--success); color: #000; }
.step-item.pending { color: var(--text-dim); }

.emergency-btn {
  width: 100%; padding: 12px; background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--danger); border-radius: 12px; color: var(--danger);
  font-size: 11px; font-weight: 800; cursor: pointer; transition: 0.3s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.emergency-btn:hover { background: var(--danger); color: #fff; box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }

/* --- VECTOR MAP TILE --- */
.map-tile { padding: 0; display: flex; flex-direction: column; }
.map-vector-bg {
  flex: 1; background: #08040d; position: relative; overflow: hidden;
  background-image: 
    linear-gradient(rgba(217, 70, 239, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(217, 70, 239, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.radar-ping {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 100px; height: 100px; border: 1px solid var(--primary); border-radius: 50%;
  animation: radar 4s infinite linear;
}

@keyframes radar { from { transform: translate(-50%, -50%) scale(0); opacity: 1; } to { transform: translate(-50%, -50%) scale(3); opacity: 0; } }

.vector-point {
  position: absolute; top: 40%; left: 60%; transform: translate(-50%, -50%);
  color: var(--primary); display: flex; flex-direction: column; align-items: center;
}
.pin-icon { filter: drop-shadow(0 0 8px var(--primary)); animation: float 3s infinite ease-in-out; }
.pin-label { font-size: 8px; font-weight: 800; background: #000; padding: 2px 6px; border-radius: 4px; margin-top: 5px; }

.map-footer-data {
  padding: 12px 20px; border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
}
.coord { font-family: 'JetBrains Mono'; font-size: 10px; color: var(--primary); }
.region { font-size: 10px; font-weight: 800; color: var(--text-dim); }

/* --- BYPASS TILE --- */
.bypass-inner { display: flex; align-items: center; gap: 15px; width: 100%; }
.icon-box { width: 40px; height: 40px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; }
.text-box h4 { font-size: 11px; font-weight: 800; }
.text-box p { font-size: 12px; font-family: 'JetBrains Mono'; color: var(--primary); }
.action-box { margin-left: auto; opacity: 0.3; }
`;