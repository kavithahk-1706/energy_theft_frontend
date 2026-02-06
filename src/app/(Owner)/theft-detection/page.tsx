"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Skull, Eye, Database, Zap, Ghost, 
  MessageSquare, Search, ShieldAlert, 
  ShieldCheck, RefreshCcw, Terminal, Bug,
  Laugh, Bomb, Coffee, Coins, Flame, 
  Radio, Activity, Fingerprint, TrendingDown, 
  Gavel, Siren, ZapOff, Trash, Cpu, 
  Lock, Unlock, Wifi, AlertTriangle, Crosshair
} from 'lucide-react';

/**
 * PROJECT: FORENSIC_ANNIHILATOR_V3
 * TARGET: GRID_THEFT_DETECTION
 * STATUS: AGGRESSIVE_ROAST_PROTOCOL_ACTIVE
 */

// --- TYPES ---
interface ChatMessage {
  id: string;
  sender: 'VOLT' | 'SPARKY' | 'MANAGEMENT' | 'SYSTEM';
  msg: string;
  type: 'logic' | 'snark' | 'money' | 'alert' | 'insult' | 'glitch';
  timestamp: string;
}

interface ForensicNode {
  id: number;
  label: string;
  status: 'SCANNING' | 'COMPROMISED' | 'SECURE';
}

interface RoastProfile {
  title: string;
  verdict: string;
  burn: string;
}

export default function ForensicAnnihilatorTerminal() {
  // --- STATE MANAGEMENT ---
  const [analyzing, setAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<any>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [systemLoad, setSystemLoad] = useState(12);
  const [mana, setMana] = useState(100);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [evidence, setEvidence] = useState({
    area: "NEO_SHADY_SECTOR",
    official_bill: 145,    
    calculated_bill: 1250,  
    grid_input: 3500,      
    meter_reading: 400,    
    tamper_alerts: 12,
    transformer_temp: 112,  
    line_loss_factor: 8.4,
    harmonic_distortion: 45.2,
    neural_sync: 0.88
  });

  // --- BACKGROUND NODES DECOR ---
  const nodes = useMemo<ForensicNode[]>(() => [
    { id: 1, label: "SHUNT_DETECT", status: 'COMPROMISED' },
    { id: 2, label: "METER_BYPASS", status: 'COMPROMISED' },
    { id: 3, label: "CRYPTO_LOAD", status: 'SCANNING' },
    { id: 4, label: "NEURAL_LINK", status: 'SECURE' },
  ], []);

  // --- AUTO-SCROLL ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // --- DYNAMIC SYSTEM STATS ---
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => Math.min(100, Math.max(10, prev + (Math.random() * 10 - 5))));
      if (analyzing) setMana(prev => Math.max(0, prev - 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, [analyzing]);

  const generateInsultVerdict = (loss: number): RoastProfile => {
    if (loss > 2000) return {
      title: "S-RANK_GIGA_THIEF",
      verdict: "FINANCIAL_TERRORISM_DETECTED",
      burn: "This isn't just theft; it's a personality disorder. Your utility bill is smaller than your ego, and both are equally worthless."
    };
    if (loss > 1000) return {
      title: "AMATEUR_LEAK_LORD",
      verdict: "PATHETIC_BYPASS_FOUND",
      burn: "You tried to hack the grid but ended up just hacking your own dignity. Go back to burning candles, you absolute cave-dweller."
    };
    return {
      title: "PENNYSAVER_RAT",
      verdict: "MICRO_THEFT_CONFIRMED",
      burn: "Stealing this little? You're not just a criminal; you're a cheap one. That's actually more embarrassing."
    };
  };

  // --- THE BRUTAL 20-TURN ROAST ENGINE ---
  const startInterrogation = () => {
    setAnalyzing(true);
    setVerdict(null);
    setChat([]);
    setMana(100);
    
    const sequence: Omit<ChatMessage, 'id' | 'timestamp'>[] = [
      { sender: "SYSTEM", msg: "BOOTING_DISGRACE_SUBROUTINES...", type: "glitch" },
      { sender: "VOLT", msg: `Establishing link to ${evidence.area}. I hope you're ready for the truth.`, type: "logic" },
      { sender: "SPARKY", msg: "Scanning. Oh look, another bypass. How original. A toddler with a paperclip could do better.", type: "insult" },
      { sender: "VOLT", msg: `WARNING: Grid is losing ${evidence.grid_input - evidence.meter_reading}kWh. It's like pouring water into a sieve made of lies.`, type: "alert" },
      { sender: "MANAGEMENT", msg: "MY REVENUE! It's leaking like a punctured yacht! Sparky, find the source!", type: "money" },
      { sender: "SPARKY", msg: "Found it. They're using a literal clothesline to bridge the main fuse. I've seen smarter behavior from a bag of hammers.", type: "insult" },
      { sender: "VOLT", msg: `Transformer at ${evidence.transformer_temp}°C. If this gets any hotter, we'll be serving the residents 'Fried Stupid'.`, type: "alert" },
      { sender: "SPARKY", msg: "Phase imbalance is at 60%. They're pulling so much unmetered juice their wallpaper is probably glowing.", type: "snark" },
      { sender: "VOLT", msg: "Digital forensics show they tried to 'SQL Inject' the smart meter with a Sharpie. I'm losing brain cells just analyzing this.", type: "insult" },
      { sender: "MANAGEMENT", msg: "I want a lien on their house, their car, and their pet goldfish! PAY ME!", type: "money" },
      { sender: "SPARKY", msg: "I've just remotely disabled their air conditioning. If you want to steal, you can do it while sweating like the rat you are.", type: "insult" },
      { sender: "VOLT", msg: "Injecting tracer particles into the line. The theft signature is coming from the basement. It's... it's a bootleg server farm.", type: "logic" },
      { sender: "SPARKY", msg: "Mining crypto on stolen power? That's the digital equivalent of dumpster diving. Truly bottom-tier behavior.", type: "insult" },
      { sender: "SYSTEM", msg: "OVERRIDING_ETHICS_PROTOCOL_404_NOT_FOUND", type: "glitch" },
      { sender: "VOLT", msg: "Calculating total loss. It's massive. This person isn't just a thief; they're an economic black hole.", type: "alert" },
      { sender: "SPARKY", msg: "Finalizing the roast. I'm sending their browsing history to their mother as a bonus fine.", type: "snark" },
      { sender: "MANAGEMENT", msg: "VOLT! Give me the verdict! I need to buy a second helicopter!", type: "money" },
      { sender: "VOLT", msg: "Generating the 'Sticker of Eternal Shame'. Stand by for impact.", type: "logic" },
      { sender: "SPARKY", msg: "Imagine being this bad at crime. Honestly, the incarceration will be an upgrade for your IQ.", type: "insult" },
      { sender: "SYSTEM", msg: "PROTOCOL_COMPLETE. COMMENCING_TOTAL_VERBAL_ANNIHILATION.", type: "glitch" }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setChat(prev => [...prev, {
          ...sequence[i],
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString()
        }]);
        setGlitchActive(Math.random() > 0.8);
        setTimeout(() => setGlitchActive(false), 100);
        i++;
      } else {
        clearInterval(interval);
        finishAnalysis();
      }
    }, 1100);
  };

  const finishAnalysis = () => {
    const loss = evidence.calculated_bill - evidence.official_bill;
    const roast = generateInsultVerdict(loss);

    setVerdict({ 
      theft: true, 
      gap: evidence.grid_input - evidence.meter_reading, 
      loss: loss,
      confidence: 99.99,
      ...roast
    });
    setAnalyzing(false);
  };

  return (
    <div className={`annihilator-root ${glitchActive ? 'glitch-fx' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: MASTER_TERMINAL_CSS }} />
      
      {/* --- SVG FILTERS --- */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="chromatic">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" />
          <feOffset dx="-3" dy="0" />
        </filter>
      </svg>

      <div className="ui-overlay" />

      {/* --- TOP HUD --- */}
      <header className="terminal-header">
        <div className="h-left">
          <div className="sys-icon"><Cpu size={18} /></div>
          <div className="sys-title">
            <h1>FORENSIC_ANNIHILATOR_V3.0</h1>
            <div className="sys-tags">
              <span className="tag-red">ROAST_MODE</span>
              <span className="tag-cyan">GRID_ALPHA</span>
              <span className="tag-blink">LIVE_FEED</span>
            </div>
          </div>
        </div>
        <div className="h-right">
          <div className="vitals">
            <div className="v-item">LOAD: <span className={systemLoad > 80 ? 't-red' : 't-cyan'}>{systemLoad.toFixed(1)}%</span></div>
            <div className="v-item">MANA: <span>{mana.toFixed(0)}%</span></div>
          </div>
          <button className="reset-btn" onClick={() => window.location.reload()}>
            <RefreshCcw size={14} />
          </button>
        </div>
      </header>

      {/* --- MAIN INTERFACE --- */}
      <main className="terminal-grid">
        
        {/* LEFT: EVIDENCE CONTROL */}
        <section className="bento-box evidence-panel">
          <div className="b-label"><Crosshair size={12} /> TARGET_PARAMETERS</div>
          <div className="b-content custom-scroll">
            <div className="input-group main">
              <label>SECTOR_IDENTIFIER</label>
              <input value={evidence.area} onChange={(e) => setEvidence({...evidence, area: e.target.value.toUpperCase()})} />
            </div>

            <div className="params-grid">
              {Object.entries(evidence).map(([key, val]) => (
                key !== 'area' && (
                  <div key={key} className="param-field">
                    <label>{key.replace(/_/g, ' ')}</label>
                    <div className="p-input">
                      <input 
                        type="number" 
                        value={val} 
                        onChange={(e) => setEvidence({...evidence, [key]: Number(e.target.value)})} 
                      />
                      <span className="u-tag">{key.includes('bill') || key.includes('loss') ? '$' : 'U'}</span>
                    </div>
                  </div>
                )
              ))}
            </div>

            <button className={`burn-btn ${analyzing ? 'loading' : ''}`} onClick={startInterrogation} disabled={analyzing}>
              {analyzing ? "BRUTALIZING_DATA..." : "EXECUTE_FORENSIC_ROAST"}
            </button>
          </div>
        </section>

        {/* CENTER: CHAT INTERROGATION */}
        <section className="bento-box chat-panel">
          <div className="b-label"><MessageSquare size={12} /> INTERROGATION_FEED</div>
          <div className="chat-area custom-scroll">
  {chat.length === 0 && !analyzing && (
    <div className="empty-chat">
      <Ghost size={48} />
      <p>AWAITING SUSPICIOUS ACTIVITY...</p>
      <small>FEED_STATUS: IDLE</small>
    </div>
  )}

  {chat.map((m) => {
    // 🛡️ THE TRIPLE-GUARD FIREWALL
    // 1. Check if message exists
    // 2. Check if sender exists
    // 3. Fallback to 'system' if sender is missing to prevent .toLowerCase() crash
    if (!m) return null;
    const safeSender = m.sender ? m.sender.toLowerCase() : 'system';
    const safeType = m.type || 'logic';

    return (
      <div key={m.id} className={`chat-row ${safeSender} ${safeType}`}>
        <div className="row-avatar">
           {m.sender === 'VOLT' && <Eye size={16}/>}
           {m.sender === 'SPARKY' && <Skull size={16}/>}
           {m.sender === 'MANAGEMENT' && <Coins size={16}/>}
           {(m.sender === 'SYSTEM' || !m.sender) && <Zap size={16}/>}
        </div>
        <div className="row-bubble">
          <div className="bubble-header">
            <span className="sender-name">{m.sender || 'SYSTEM'}</span>
            <span className="timestamp">{m.timestamp || '00:00:00'}</span>
          </div>
          <p className="bubble-msg">{m.msg || '[[ DATA_CORRUPTED ]]'}</p>
        </div>
      </div>
    );
  })}
  <div ref={chatEndRef} />

            {/* THE DISGRACE STICKER */}
            {verdict && (
              <div className="verdict-container">
                <div className="disgrace-warrant">
                  <div className="w-border" />
                  <div className="w-content">
                    <div className="w-header">
                      <ShieldAlert size={32} />
                      <div>
                        <h3>WARRANT_OF_SHAME</h3>
                        <p>ID: {Math.random().toString(36).toUpperCase().substr(2, 10)}</p>
                      </div>
                    </div>
                    <div className="w-data">
                      <div className="w-row"><span>LEAKAGE:</span> <b>{verdict.gap} kWh</b></div>
                      <div className="w-row"><span>THEFT_LOSS:</span> <b>${verdict.loss}</b></div>
                      <div className="w-row"><span>SEVERITY:</span> <b className="t-red">{verdict.severity}</b></div>
                    </div>
                    <div className="w-footer">
                      <Fingerprint size={14} />
                      <span>SIGNATURE_FORENSIC_ANNIHILATOR</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: SYSTEM VITALS */}
        <aside className="right-stack">
          
          <div className="bento-box stats-card">
            <div className="b-label"><Activity size={12} /> GRID_HEALTH</div>
            <div className="p-4 space-y-4">
              <div className="v-stat">
                <div className="flex justify-between mb-1"><span>LINE_LOSS</span> <span>{evidence.line_loss_factor}%</span></div>
                <div className="s-bar"><div className="s-fill red" style={{width: `${evidence.line_loss_factor * 10}%`}} /></div>
              </div>
              <div className="v-stat">
                <div className="flex justify-between mb-1"><span>HARMONICS</span> <span>{evidence.harmonic_distortion}%</span></div>
                <div className="s-bar"><div className="s-fill cyan" style={{width: `${evidence.harmonic_distortion}%`}} /></div>
              </div>
              <div className="v-stat">
                <div className="flex justify-between mb-1"><span>TEMP_THRESHOLD</span> <span>{evidence.transformer_temp}°C</span></div>
                <div className="s-bar"><div className="s-fill orange" style={{width: `${(evidence.transformer_temp / 150) * 100}%`}} /></div>
              </div>
            </div>
          </div>

          <div className="bento-box node-panel">
            <div className="b-label"><Wifi size={12} /> SCAN_NODES</div>
            <div className="node-grid">
              {nodes.map(n => (
                <div key={n.id} className={`node ${n.status.toLowerCase()}`}>
                  <div className="node-point" />
                  <span>{n.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="roast-quote">
            <AlertTriangle className="text-yellow-500 mb-2" size={20} />
            <p>"If the grid was a person, it would be suing these residents for emotional distress."</p>
          </div>

        </aside>
      </main>

      {/* --- BOTTOM TICKET --- */}
      <footer className="terminal-footer">
        <div className="ticker-wrap">
          <div className="ticker-item">AUDIT_IN_PROGRESS // </div>
          <div className="ticker-item">NEO_TOKYO_ELECTRICAL_AUTHORITY // </div>
          <div className="ticker-item">BYPASS_DETECTED_IN_SECTOR_7 // </div>
        </div>
      </footer>
    </div>
  );
}

const MASTER_TERMINAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --pink: #ff00ff;
    --cyan: #00ffff;
    --red: #ff3e3e;
    --orange: #ff9d00;
    --bg: #030308;
    --glass: rgba(10, 10, 20, 0.8);
    --border: rgba(255, 255, 255, 0.05);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; cursor: crosshair; }
  body { background: var(--bg); color: #fff; font-family: 'Space Grotesk', sans-serif; margin-top: 6%; }

  .annihilator-root { 
    height: 100vh; width: 100vw; display: flex; flex-direction: column; 
    position: relative; padding: 20px;
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(139, 0, 255, 0.05) 0%, transparent 80%),
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
    background-size: 100% 100%, 100% 4px;
  }

  .ui-overlay { position: fixed; inset: 0; border: 1px solid rgba(255, 255, 255, 0.03); pointer-events: none; }

  /* --- HEADER --- */
  .terminal-header { 
    height: 70px; display: flex; justify-content: space-between; align-items: center;
    background: var(--glass); border: 1px solid var(--border); border-radius: 12px;
    padding: 0 25px; margin-bottom: 20px; backdrop-filter: blur(10px);
  }
  .h-left { display: flex; gap: 20px; align-items: center; }
  .sys-icon { color: var(--pink); animation: spin 4s linear infinite; }
  .sys-title h1 { font-family: 'Syncopate'; font-size: 16px; letter-spacing: 2px; }
  .sys-tags { display: flex; gap: 10px; margin-top: 4px; }
  .sys-tags span { font-size: 8px; font-weight: 900; padding: 2px 8px; border-radius: 4px; border: 1px solid currentColor; }
  .tag-red { color: var(--red); }
  .tag-cyan { color: var(--cyan); }
  .tag-blink { color: #fff; animation: blink 1s infinite; }

  .vitals { display: flex; gap: 30px; font-family: 'JetBrains Mono'; font-size: 12px; font-weight: bold; }
  .t-red { color: var(--red); }
  .t-cyan { color: var(--cyan); }

  /* --- GRID LAYOUT --- */
  .terminal-grid { flex: 1; display: grid; grid-template-columns: 340px 1fr 300px; gap: 20px; height: calc(100vh - 160px); }
  .bento-box { background: var(--glass); border: 1px solid var(--border); border-radius: 16px; position: relative; overflow: hidden; display: flex; flex-direction: column; }
  .b-label { position: absolute; top: 12px; right: 12px; font-size: 8px; font-weight: 900; background: #000; padding: 4px 10px; border-radius: 4px; color: var(--cyan); z-index: 10; display: flex; align-items: center; gap: 6px; border: 1px solid rgba(255,255,255,0.1); }

  /* --- EVIDENCE PANEL --- */
  .b-content { padding: 40px 20px 20px; flex: 1; }
  .input-group.main { margin-bottom: 25px; }
  .input-group.main label { display: block; font-size: 9px; font-weight: bold; color: #555; margin-bottom: 8px; }
  .input-group.main input { background: #000; border: 1px solid var(--pink); border-radius: 8px; padding: 12px; width: 100%; color: #fff; font-family: 'Syncopate'; font-size: 12px; outline: none; box-shadow: 0 0 10px rgba(255,0,255,0.1); }
  
  .params-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
  .param-field label { font-size: 8px; font-weight: bold; color: #444; display: block; margin-bottom: 5px; text-transform: uppercase; }
  .p-input { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.02); padding: 5px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); }
  .p-input input { background: none; border: none; width: 100%; color: var(--cyan); font-family: 'JetBrains Mono'; font-size: 13px; outline: none; }
  .u-tag { font-size: 9px; color: #333; font-weight: 900; }

  .burn-btn { width: 100%; padding: 20px; background: var(--pink); color: #000; font-weight: 900; border: none; border-radius: 12px; cursor: pointer; transition: 0.3s; font-family: 'Syncopate'; font-size: 10px; }
  .burn-btn:hover { transform: scale(1.02); filter: brightness(1.2); box-shadow: 0 0 30px rgba(255,0,255,0.3); }
  .burn-btn.loading { background: #333; color: #666; cursor: wait; animation: pulse 1s infinite; }

  /* --- CHAT AREA --- */
  .chat-area { flex: 1; padding: 30px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; background: rgba(0,0,0,0.2); }
  .chat-row { display: flex; gap: 15px; max-width: 85%; animation: slideIn 0.3s forwards; }
  .chat-row.management { align-self: flex-end; flex-direction: row-reverse; }
  .row-avatar { width: 40px; height: 40px; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .volt .row-avatar { color: var(--cyan); border-color: var(--cyan); }
  .sparky .row-avatar { color: var(--red); border-color: var(--red); }
  .management .row-avatar { color: var(--orange); border-color: var(--orange); }

  .row-bubble { background: rgba(255,255,255,0.02); padding: 15px; border-radius: 0 16px 16px 16px; border: 1px solid var(--border); flex: 1; }
  .management .row-bubble { border-radius: 16px 0 16px 16px; background: rgba(255, 157, 0, 0.05); }
  .bubble-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 10px; font-weight: bold; }
  .sender-name { color: var(--pink); text-transform: uppercase; }
  .bubble-msg { font-size: 14px; color: #bbb; line-height: 1.5; font-family: 'Space Grotesk'; }

  /* TYPE STYLES */
  .insult .row-bubble { border-color: var(--red); background: rgba(255, 62, 62, 0.05); }
  .insult .sender-name { color: var(--red); }
  .glitch .bubble-msg { font-family: 'JetBrains Mono'; color: var(--cyan); font-weight: bold; }

  /* --- DISGRACE WARRANT --- */
  .verdict-container { padding: 50px 0; display: flex; justify-content: center; }
  .disgrace-warrant { position: relative; width: 340px; background: var(--red); padding: 3px; border-radius: 20px; transform: rotate(-2deg); box-shadow: 20px 20px 60px rgba(0,0,0,0.8); }
  .w-content { background: #000; padding: 25px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); }
  .w-header { display: flex; gap: 15px; align-items: center; color: var(--red); margin-bottom: 25px; }
  .w-header h3 { font-family: 'Syncopate'; font-size: 16px; }
  .w-data { border-top: 1px dashed #222; border-bottom: 1px dashed #222; padding: 20px 0; margin-bottom: 20px; }
  .w-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; }
  .w-row span { color: #555; }
  .w-footer { display: flex; justify-content: space-between; font-size: 9px; opacity: 0.4; font-weight: bold; }

  /* --- RIGHT COLUMN --- */
  .right-stack { display: flex; flex-direction: column; gap: 20px; }
  .stats-card { padding: 40px 20px 20px; }
  .s-bar { height: 4px; background: #111; border-radius: 10px; overflow: hidden; margin-top: 6px; }
  .s-fill { height: 100%; transition: 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .s-fill.red { background: var(--red); }
  .s-fill.cyan { background: var(--cyan); }
  .s-fill.orange { background: var(--orange); }

  .node-panel { padding: 40px 20px 20px; }
  .node-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .node { background: rgba(255,255,255,0.02); padding: 12px; border-radius: 10px; display: flex; items-center; gap: 10px; font-size: 10px; font-weight: bold; border: 1px solid var(--border); }
  .node-point { width: 8px; height: 8px; border-radius: 50%; background: #222; }
  .node.compromised { border-color: var(--red); color: var(--red); }
  .node.compromised .node-point { background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 0.5s infinite; }
  .node.secure { border-color: var(--cyan); color: var(--cyan); }
  .node.secure .node-point { background: var(--cyan); }

  .roast-quote { background: rgba(255, 157, 0, 0.05); border: 1px solid rgba(255, 157, 0, 0.1); border-radius: 16px; padding: 20px; font-size: 12px; color: #888; font-style: italic; }

  /* --- FOOTER TICKER --- */
  .terminal-footer { height: 40px; background: #000; border-top: 1px solid var(--border); display: flex; align-items: center; overflow: hidden; }
  .ticker-wrap { display: flex; white-space: nowrap; animation: ticker 20s linear infinite; }
  .ticker-item { font-family: 'JetBrains Mono'; font-size: 10px; color: #333; margin-right: 20px; }

  /* --- ANIMATIONS --- */
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes blink { 50% { opacity: 0.3; } }
  @keyframes slideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

  .glitch-fx { filter: url(#chromatic); transform: translate(1px, -1px); }

  .custom-scroll::-webkit-scrollbar { width: 4px; }
  .custom-scroll::-webkit-scrollbar-thumb { background: var(--pink); border-radius: 10px; }
`;