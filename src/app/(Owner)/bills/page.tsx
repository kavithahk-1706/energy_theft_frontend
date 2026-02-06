"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Globe, Calculator, Landmark, CreditCard, 
  Zap, RefreshCcw, ArrowRight, TrendingUp,
  AlertTriangle, ShieldCheck, Download, Search,
  Cpu, Activity, FileText, Save, Terminal,
  Layers, BarChart3, Fingerprint, History
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, 
  Tooltip, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { useUser } from "@clerk/nextjs";

// --- DATASET GENERATION (8,000 Nodes) ---
const MASTER_DATASET = Array.from({ length: 8000 }, (_, i) => {
  const zones = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA', 'SIGMA'];
  const zone = zones[i % zones.length];
  return {
    id: `NODE-${zone}-${i.toString(16).toUpperCase().padStart(4, '0')}`,
    zone: zone,
    load: Math.floor(Math.random() * 850) + 150,
    status: Math.random() > 0.98 ? 'OVERLOAD' : 'STABLE',
    efficiency: (Math.random() * (99 - 85) + 85).toFixed(1),
    temp: Math.floor(Math.random() * (75 - 35) + 35)
  };
});

export default function MasterBillingTerminal() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState(MASTER_DATASET[0]);
  const [tariffRate, setTariffRate] = useState(0.125);
  const [sessionCost, setSessionCost] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // --- LIVE CHART DATA ---
  const [chartData, setChartData] = useState<{time: string, val: number}[]>([]);

  // 1. PERSISTENCE ENGINE
  useEffect(() => {
    const saved = localStorage.getItem(`ledger_v2_${selectedNode.id}`);
    setSessionCost(saved ? parseFloat(saved) : 0);
    addLog(`INIT_NODE_CONNECTION: ${selectedNode.id}`);
  }, [selectedNode.id]);

  // 2. QUANTUM TICKER & REAL-TIME CHARTING
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionCost(prev => {
        const increment = (selectedNode.load * tariffRate) / 3600;
        const total = prev + increment;
        localStorage.setItem(`ledger_v2_${selectedNode.id}`, total.toString());
        return total;
      });

      setChartData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), val: selectedNode.load + (Math.random() * 20 - 10) }];
        return newData.slice(-20); // Keep last 20 points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedNode, tariffRate]);

  // 3. UTILITIES
  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleDownload = () => {
    addLog(`GENERATING_ENCRYPTED_MANIFEST...`);
    const manifest = `
    VOLTGUARD ENCRYPTED BILLING MANIFEST
    ====================================
    OPERATOR_ID: ${user?.id || 'ANON_SURGE'}
    NODE_TARGET: ${selectedNode.id}
    ZONE_SECTOR: ${selectedNode.zone}
    LIFETIME_COST: $${sessionCost.toFixed(8)}
    AUTH_STAMP: ${btoa(selectedNode.id + Date.now()).substring(0, 16)}
    `;
    const blob = new Blob([manifest], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LEDGER_${selectedNode.id}.txt`;
    a.click();
  };

  const filteredNodes = useMemo(() => {
    const term = searchTerm.toUpperCase();
    return MASTER_DATASET.filter(n => n.id.includes(term) || n.zone.includes(term)).slice(0, 40);
  }, [searchTerm]);

  return (
    <div className="terminal-container">
      <div className="scanline" />
      <div className="noise" />

      {/* TOP NAVIGATION */}
      <nav className="terminal-nav">
        <div className="brand">
          <Fingerprint className="text-violet animate-pulse" size={28} />
          <div>
            <h1 className="glitch" data-text="VOLTGUARD_OS">VOLTGUARD_OS</h1>
            <p className="subtext">VER 4.0.26 // FINANCIAL_GRID_CORE</p>
          </div>
        </div>

        <div className="search-box">
          <Search size={14} className="text-violet" />
          <input 
            type="text" 
            placeholder="FILTER_8000_NODES..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="nav-actions">
          <div className="operator-chip">
            <span className="dot" />
            <span className="name">{user?.firstName || 'ADMIN'}</span>
          </div>
          <button className="btn-primary" onClick={handleDownload}>
            <Download size={16} /> EXPORT_LEDGER
          </button>
        </div>
      </nav>

      <main className="terminal-body">
        {/* LEFT PANEL: NODE REGISTRY */}
        <aside className="panel registry-panel">
          <div className="panel-header">
            <Cpu size={14} /> REGISTRY_MAP
            <span className="count">{MASTER_DATASET.length} NODES</span>
          </div>
          <div className="node-scroll">
            {filteredNodes.map(node => (
              <div 
                key={node.id} 
                className={`node-card ${selectedNode.id === node.id ? 'active' : ''}`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="node-info">
                  <span className="id">{node.id}</span>
                  <span className="zone">{node.zone} // EFF_{node.efficiency}%</span>
                </div>
                <div className={`status ${node.status.toLowerCase()}`}>{node.load}kW</div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER PANEL: THE LEDGER ENGINE */}
        <section className="panel central-ledger">
          <div className="panel-header">
            <Calculator size={14} /> COST_ACCUMULATION_ENGINE
            <div className="sync-status">VAULT_SYNC: OK</div>
          </div>

          <div className="ledger-main">
            <div className="cost-display">
              <label>TOTAL_NODE_EXPENSE_USD</label>
              <div className="ticker">
                <span className="currency">$</span>
                <span className="value">
                  {sessionCost.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 })}
                </span>
              </div>
              <div className="burn-indicator">
                <Zap size={12} className="text-violet" />
                ACCRIUNG_AT ${(selectedNode.load * tariffRate).toFixed(3)}/HOUR
              </div>
            </div>

            <div className="visualizer-area">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false}/>
                  <Tooltip 
                    contentStyle={{background: '#0a0a0c', border: '1px solid #bc13fe', fontSize: '10px'}}
                    itemStyle={{color: '#bc13fe'}}
                  />
                  <Area type="monotone" dataKey="val" stroke="#bc13fe" fillOpacity={1} fill="url(#colorLoad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="ledger-controls">
              <div className="control-group">
                <div className="labels">
                  <label>DYNAMIC_TARIFF_MODIFIER</label>
                  <span>${tariffRate.toFixed(3)}</span>
                </div>
                <input 
                  type="range" min="0.05" max="0.5" step="0.005" 
                  value={tariffRate} onChange={(e) => setTariffRate(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* LOG TERMINAL FOOTER */}
          <div className="log-panel">
            <div className="log-header"><Terminal size={12} /> SYSTEM_EVENT_LOG</div>
            <div className="log-entries">
              {logs.map((l, i) => <div key={i} className="log-line">{l}</div>)}
              <div ref={logEndRef} />
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: ANALYTICS */}
        <aside className="panel analytics-panel">
          <div className="panel-header"><BarChart3 size={14} /> QUANTUM_ANALYTICS</div>
          
          <div className="p-4 space-y-6">
            <div className="stat-box">
              <label>NODE_TEMPERATURE</label>
              <div className="bar-wrap">
                <div className="bar-fill" style={{ width: `${(selectedNode.temp/100)*100}%`, background: selectedNode.temp > 60 ? '#ff0055' : '#00f3ff' }} />
              </div>
              <span className="val">{selectedNode.temp}°C</span>
            </div>

            <div className="analytics-grid">
              <div className="a-tile">
                <label>CARBON_FOOTPRINT</label>
                <div className="num">{(selectedNode.load * 0.42).toFixed(1)}kg</div>
              </div>
              <div className="a-tile">
                <label>GRID_TAX</label>
                <div className="num text-violet">2.4%</div>
              </div>
              <div className="a-tile">
                <label>EFFICIENCY</label>
                <div className="num text-green-500">{selectedNode.efficiency}%</div>
              </div>
              <div className="a-tile">
                <label>UPTIME</label>
                <div className="num">99.98%</div>
              </div>
            </div>

            <div className="mini-alert">
              <AlertTriangle size={18} className="text-yellow-500" />
              <div>
                <p className="alert-title">LOAD_THRESHOLD_WARNING</p>
                <p className="alert-desc">Current load exceeds regional baseline by 14%.</p>
              </div>
            </div>

            <button className="reset-node-btn" onClick={() => { localStorage.removeItem(`ledger_v2_${selectedNode.id}`); setSessionCost(0); addLog('LEDGER_MANUALLY_WIPED'); }}>
              <RefreshCcw size={14} /> CLEAR_PERSISTENT_STORAGE
            </button>
          </div>
        </aside>
      </main>

      <style dangerouslySetInnerHTML={{ __html: MASTER_CSS }} />
    </div>
  );
}

const MASTER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;400;800&display=swap');

  :root {
    --bg: #030305;
    --panel-bg: rgba(10, 10, 15, 0.8);
    --violet: #bc13fe;
    --cyan: #00f3ff;
    --border: rgba(188, 19, 254, 0.2);
    --text: #e0e0e0;
  }

  .terminal-container {
    height: 100vh; background: var(--bg); color: var(--text);
    font-family: 'JetBrains Mono', monospace; padding: 15px;
    display: flex; flex-direction: column; gap: 15px; position: relative; overflow: hidden;
  }

  /* EFFECTS */
  .scanline {
    position: fixed; inset: 0; pointer-events: none; z-index: 1000;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
    background-size: 100% 4px; opacity: 0.15;
  }
  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("https://grainy-gradients.vercel.app/noise.svg");
    opacity: 0.05; contrast: 150%;
  }

  /* NAV */
  .terminal-nav {
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px 25px; background: var(--panel-bg); border: 1px solid var(--border);
    border-radius: 12px; backdrop-filter: blur(10px);
  }
  .brand { display: flex; gap: 15px; align-items: center; }
  .brand h1 { font-size: 18px; font-weight: 800; letter-spacing: 2px; }
  .subtext { font-size: 8px; opacity: 0.4; }

  .search-box {
    display: flex; align-items: center; gap: 10px; background: #000;
    padding: 8px 15px; border-radius: 6px; border: 1px solid var(--border);
  }
  .search-box input { background: none; border: none; outline: none; color: #fff; font-size: 10px; width: 250px; }

  /* LAYOUT */
  .terminal-body { flex: 1; display: grid; grid-template-columns: 300px 1fr 300px; gap: 15px; overflow: hidden; }
  .panel { background: var(--panel-bg); border: 1px solid var(--border); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; }
  .panel-header {
    padding: 10px 15px; font-size: 9px; font-weight: 800; color: var(--violet);
    background: rgba(188, 19, 254, 0.05); border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }

  /* REGISTRY */
  .node-scroll { flex: 1; overflow-y: auto; padding: 10px; }
  .node-card {
    padding: 12px; border-radius: 8px; margin-bottom: 6px; cursor: pointer;
    background: rgba(255,255,255,0.02); border: 1px solid transparent; transition: 0.2s;
    display: flex; justify-content: space-between; align-items: center;
  }
  .node-card:hover { background: rgba(188, 19, 254, 0.05); }
  .node-card.active { background: rgba(188, 19, 254, 0.1); border-color: var(--violet); }
  .node-info .id { display: block; font-size: 11px; font-weight: 800; }
  .node-info .zone { font-size: 7px; opacity: 0.4; }
  .status { font-size: 10px; font-weight: 800; color: var(--cyan); }
  .status.overload { color: #ff0055; }

  /* LEDGER MAIN */
  .central-ledger { background: radial-gradient(circle at top right, rgba(188,19,254,0.05), transparent); }
  .ledger-main { flex: 1; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  
  .cost-display { text-align: center; margin-bottom: 30px; }
  .cost-display label { font-size: 9px; opacity: 0.3; letter-spacing: 5px; }
  .ticker { display: flex; align-items: baseline; gap: 15px; margin: 15px 0; }
  .ticker .currency { font-size: 32px; font-weight: 100; color: var(--violet); }
  .ticker .value { font-size: 84px; font-weight: 800; letter-spacing: -4px; font-variant-numeric: tabular-nums; }
  .burn-indicator { font-size: 10px; opacity: 0.6; display: flex; gap: 8px; align-items: center; }

  .visualizer-area { width: 100%; max-width: 600px; margin: 20px 0; }
  
  .ledger-controls { width: 100%; max-width: 450px; }
  .control-group .labels { display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 12px; }
  input[type=range] { -webkit-appearance: none; width: 100%; height: 2px; background: #333; outline: none; }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 40px; height: 12px; background: var(--violet);
    border-radius: 2px; cursor: pointer; border: 1px solid #fff; box-shadow: 0 0 10px var(--violet);
  }

  /* LOGS */
  .log-panel { height: 180px; background: #000; border-top: 1px solid var(--border); display: flex; flex-direction: column; }
  .log-entries { flex: 1; overflow-y: auto; padding: 10px; font-size: 8px; color: #555; display: flex; flex-direction: column-reverse; }
  .log-line { padding: 2px 0; font-family: 'JetBrains Mono'; }

  /* ANALYTICS */
  .stat-box label { font-size: 8px; opacity: 0.5; margin-bottom: 8px; display: block; }
  .bar-wrap { height: 4px; background: #111; border-radius: 2px; overflow: hidden; margin: 5px 0; }
  .bar-fill { height: 100%; transition: 1s ease-in-out; }
  .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .a-tile { background: rgba(255,255,255,0.02); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); }
  .a-tile label { font-size: 7px; opacity: 0.4; }
  .a-tile .num { font-size: 14px; font-weight: 800; margin-top: 5px; }

  .mini-alert {
    background: rgba(255, 170, 0, 0.05); border: 1px solid rgba(255, 170, 0, 0.2);
    padding: 15px; border-radius: 10px; display: flex; gap: 12px; align-items: center;
  }
  .alert-title { font-size: 9px; font-weight: 800; color: #ffaa00; }
  .alert-desc { font-size: 7px; opacity: 0.6; }

  .reset-node-btn {
    width: 100%; padding: 12px; background: none; border: 1px solid rgba(255,0,85,0.3);
    color: #ff0055; font-size: 9px; font-weight: 800; cursor: pointer; transition: 0.2s;
    border-radius: 8px; display: flex; justify-content: center; gap: 10px;
  }
  .reset-node-btn:hover { background: rgba(255,0,85,0.1); }

  .btn-primary {
    background: var(--violet); color: #fff; border: none; padding: 10px 20px;
    border-radius: 6px; font-size: 10px; font-weight: 800; cursor: pointer;
    display: flex; gap: 10px; align-items: center;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: var(--border); }
`;