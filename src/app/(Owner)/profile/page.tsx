"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import { 
  Zap, Heart, Star, Search, MessageSquare, 
  Image as ImageIcon, User, Share2, MoreHorizontal,
  Flame, Sword, Shield, Wand2, Terminal,
  Target, Fingerprint, Info, Coffee, Skull,
  ChevronRight, ChevronLeft, Activity, Box,
  Database, Cpu, Globe, Lock, Unlock, Settings,
  Power, Sparkles, Radio, Anchor, Hexagon,
  Radar, Wind, ZapOff, Siren, Crosshair, 
  Dna, Microscope, Atom, Ghost
} from 'lucide-react';

/**
 * APEX_ZENITH_INTERFACE_V2 [MASTER_BUILD]
 * MODE: MAXIMUM_LORE_DENSITY
 * THEME: NEO_TOKYO_SYNERGY
 */

// --- TYPES & INTERFACES ---
interface Skill {
  id: number;
  name: string;
  lv: number | string;
  desc: string;
  rarity: 'COMMON' | 'ELITE' | 'GOD';
}

interface Achievement {
  id: number;
  title: string;
  status: 'LOCKED' | 'UNLOCKED';
  pts: number;
}

const ApexZenithProfile: React.FC = () => {
  const { user, isLoaded } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- EXTENDED STATE ---
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [glitchTrigger, setGlitchTrigger] = useState(false);
  const [manaLevel, setManaLevel] = useState(100);
  const [syncRate, setSyncRate] = useState(98.4);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPoweringDown, setIsPoweringDown] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // --- BACKGROUND PARTICLE SYSTEM ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      opacity: Math.random()
    });

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      for (let i = 0; i < 100; i++) particles.push(createParticle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0;
        ctx.fillStyle = `rgba(255, 0, 255, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, []);

  // --- MOUSE & SYNC EFFECTS ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 25,
        y: (e.clientY / window.innerHeight - 0.5) * 25,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSyncRate(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setGlitchTrigger(true);
      setTimeout(() => setGlitchTrigger(false), 120);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // --- COMPLEX DATA COLLECTIONS ---
  const skills: Skill[] = [
    { id: 1, name: "CODE_REAPER", lv: 9, rarity: 'ELITE', desc: "Bypasses all firewall logic with raw intent." },
    { id: 2, name: "CAFFEINE_LIMIT", lv: "MAX", rarity: 'GOD', desc: "No sleep required for 48 hours." },
    { id: 3, name: "CSS_MAGIC", lv: 4, rarity: 'COMMON', desc: "Ability to center a div without crying." },
    { id: 4, name: "GIT_ARCHIVIST", lv: 7, rarity: 'ELITE', desc: "Never loses a commit to the void." }
  ];

  const achievements: Achievement[] = [
    { id: 101, title: "HELLO_WORLD_SLAYER", status: 'UNLOCKED', pts: 500 },
    { id: 102, title: "PROD_CRASHER_VETERAN", status: 'UNLOCKED', pts: 2500 },
    { id: 103, title: "STACK_OVERFLOW_GOD", status: 'LOCKED', pts: 10000 }
  ];

  const gear = [
    { slot: "PRIMARY", item: "MECH_KEYBOARD_V3", type: "WEAPON" },
    { slot: "SECONDARY", item: "NOISE_CANCEL_HDP", type: "ARMOR" },
    { slot: "ACCESSORY", item: "BLUE_LIGHT_GLASSES", type: "CHARM" }
  ];

  const systemLogs = [
    `[${new Date().toLocaleTimeString()}] NEURAL_LINK_ESTABLISHED`,
    `[SYSTEM] LOGGED_IN_AS: ${user?.fullName}`,
    `[SECURITY] ENCRYPTION_LAYER: OMEGA_7`,
    `[STATUS] PIZZA_RESERVES: 12% - WARNING`,
    `[CORE] SYNC_RATE: ${syncRate}%`,
    `[INTEL] SCANNING_NEO_TOKYO_GRID...`
  ];

  if (!isLoaded) return <div className="loading-screen">INITIALIZING_VIRTUAL_CONSCIOUSNESS...</div>;

  return (
    <div className={`zenith-root ${isPoweringDown ? 'power-down' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: ZENITH_STYLES }} />
      <canvas ref={canvasRef} className="particle-canvas" />
      
      {/* --- BACKGROUND ORCHESTRATION --- */}
      <div className="bg-layers">
        <div className="vignette" />
        <div className="grain-overlay" />
        <div className="nebula-glow" style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }} />
        <div className="floating-glyphs">ADMIN_LV_99 // SYSTEM_ROOT // ENCRYPTED_SOUL</div>
      </div>

      {/* --- TOP HUD NAVIGATION --- */}
      <nav className="zenith-nav">
        <div className="nav-left">
          <div className="nav-hex-icon">
            <Hexagon size={20} className="hex-border" />
            <Zap size={14} fill="var(--pink)" className="hex-core" />
          </div>
          <div className="social-cluster">
            <Heart className="s-icon" size={14} />
            <Share2 className="s-icon" size={14} />
            <Star className="s-icon" size={14} />
            <div className="v-divider" />
            <Radio size={14} className="pulse-icon" />
          </div>
        </div>

        <div className="nav-center">
          <div className="search-capsule">
            <Search size={14} className="search-icon" />
            <input type="text" placeholder="QUERY_AKASHA_RECORDS..." />
            <div className="shortcut">CMD+K</div>
          </div>
        </div>

        <div className="nav-right">
          <div className="sys-clock">
            <span className="blink-dot" />
            {new Date().toLocaleDateString()}
          </div>
          <div className="user-button-wrap">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* --- MAIN STAGE --- */}
      <main className="zenith-stage" style={{ transform: `rotateY(${mousePos.x * 0.04}deg) rotateX(${-mousePos.y * 0.04}deg)` }}>
        
        {/* LEFT FLANK: IDENTITY & ATTRIBUTES */}
        <section className="identity-flank">
          <div className="typography-block">
            <div className="rank-strip">S-RANK_ADMINISTRATOR // PHASE_04</div>
            <h1 className={`mega-name ${glitchTrigger ? 'glitch' : ''}`} data-text={user?.firstName}>
              {user?.firstName?.toUpperCase()}
            </h1>
            <h2 className="surname">{user?.lastName?.toUpperCase()}_</h2>
            <div className="bio-container">
              <div className="bio-bracket top" />
              <p className="lore-para">
                "Code is the blood of the machine, and I am its heartbeat. 
                I don't debug; I rewrite reality itself."
              </p>
              <div className="bio-bracket bottom" />
            </div>
          </div>

          <div className="stats-matrix">
            {[
              { label: 'STR', val: 92, max: '255' },
              { label: 'INT', val: 100, max: 'MAX' },
              { label: 'AGI', val: 78, max: '190' },
              { label: 'LCK', val: 12, max: '??? ' }
            ].map(stat => (
              <div key={stat.label} className="matrix-item">
                <div className="m-label">{stat.label}</div>
                <div className="m-bar"><div className="m-fill" style={{width: `${stat.val}%`}} /></div>
                <div className="m-val">{stat.max}</div>
              </div>
            ))}
          </div>

          <div className="loadout-mini-panel">
            <div className="panel-tag">EQUIPPED_GEAR</div>
            <div className="gear-list">
              {gear.map(g => (
                <div key={g.slot} className="gear-item">
                  <span className="g-slot">{g.slot}</span>
                  <span className="g-name">{g.item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CENTER: THE NOVA CORE (AVATAR) */}
        <section className="nova-core-section">
          <div className="circular-orb-wrapper">
            <div className="orb-ring ring-1" />
            <div className="orb-ring ring-2" />
            <div className="orb-ring ring-3" />
            <div className="orb-ring ring-4" />
            
            <div className="main-circle-avatar">
              <img src={user?.imageUrl} alt="Profile" />
              <div className="avatar-scanline" />
              <div className="glitch-overlay" />
            </div>

            <div className="status-orbit">
              <div className="orb-bit s1"><Coffee size={12} /></div>
              <div className="orb-bit s2"><Shield size={12} /></div>
              <div className="orb-bit s3"><Zap size={12} /></div>
              <div className="orb-bit s4"><Target size={12} /></div>
            </div>

            <div className="radar-ping" />
          </div>

          <div className="sync-status">
            <div className="sync-label">SYSTEM_SYNCHRONIZATION</div>
            <div className="sync-val">{syncRate}%</div>
            <div className="sync-wave">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="wave-segment" />)}
            </div>
          </div>
        </section>

        {/* RIGHT FLANK: MODULES & FEEDS */}
        <section className="modules-flank">
          
          <div className="module-panel skills">
            <div className="panel-header">
              <Sparkles size={14} /> 
              <span>ACTIVE_TRAITS</span>
              <div className="header-line" />
            </div>
            <div className="skill-grid">
              {skills.map(skill => (
                <div key={skill.id} className={`skill-hex-card rarity-${skill.rarity.toLowerCase()}`}>
                  <div className="hex-top">
                    <strong>{skill.name}</strong>
                    <span className="lvl-badge">LV.{skill.lv}</span>
                  </div>
                  <p>{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="module-panel logs">
            <div className="panel-header">
              <Terminal size={14} /> 
              <span>TERMINAL_OUTPUT</span>
              <div className="header-line" />
            </div>
            <div className="log-scroll">
              {systemLogs.map((log, i) => (
                <div key={i} className="log-line">{log}</div>
              ))}
              <div className="log-line cursor">_</div>
            </div>
          </div>

          <div className="achievement-strip">
            <div className="panel-tag">RECENT_ACCOMPLISHMENTS</div>
            <div className="achieve-grid">
              {achievements.map(a => (
                <div key={a.id} className={`achieve-icon ${a.status === 'LOCKED' ? 'locked' : ''}`}>
                  {a.status === 'LOCKED' ? <Lock size={12} /> : <Unlock size={12} />}
                </div>
              ))}
            </div>
          </div>

          <div className="aesthetic-sidebar">
             {['DATA', 'GEAR', 'VOID', 'INTEL'].map(item => (
               <div key={item} 
                    className={`side-tab ${activeTab === item ? 'active' : ''}`}
                    onClick={() => setActiveTab(item)}>
                 {item}
               </div>
             ))}
          </div>

        </section>
      </main>

      {/* --- FOOTER DOCK --- */}
      <footer className="zenith-footer">
        <div className="footer-left">
          <div className="pill-tag"><Globe size={10} /> NEO_TOKYO</div>
          <div className="pill-tag"><Siren size={10} /> S_RANK</div>
          <div className="pill-tag"><Ghost size={10} /> UNKNOWN_ENTITY</div>
        </div>
        
        <div className="footer-right">
          <div className="btn-group">
            <button className="zenith-btn secondary"><ChevronLeft size={16} /> RESET</button>
            <button className="zenith-btn primary">UPGRADE <ChevronRight size={16} /></button>
          </div>
          <SignOutButton>
            <button className="shutdown-trigger" onClick={() => setIsPoweringDown(true)}>
              <Power size={18} />
            </button>
          </SignOutButton>
        </div>
      </footer>

      <div className="scanline-master" />
      <div className="vignette-master" />
    </div>
  );
};

export default ApexZenithProfile;

const ZENITH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --pink: #ff00ff;
    --violet: #8b00ff;
    --cyan: #00ffff;
    --bg: #030105;
    --glass: rgba(15, 5, 25, 0.8);
    --border: rgba(255, 0, 255, 0.15);
    --glow: 0 0 25px rgba(255, 0, 255, 0.4);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; cursor: url('https://cur.cursors-4u.net/games/gam-4/gam372.cur'), auto; }
  body { background: var(--bg); color: #fff; font-family: 'Space Grotesk', sans-serif; perspective: 1500px; }

  .zenith-root { height: 100vh; width: 100vw; display: flex; flex-direction: column; overflow: hidden; position: relative; transition: filter 1s, transform 1.5s; }
  .zenith-root.power-down { filter: brightness(0) blur(40px); transform: scale(0.9); }
  
  .particle-canvas { position: fixed; inset: 0; z-index: -2; opacity: 0.6; }
  .bg-layers { position: fixed; inset: 0; z-index: -3; }
  .vignette { position: absolute; inset: 0; background: radial-gradient(circle, transparent 30%, #000 100%); }
  .grain-overlay { position: absolute; inset: 0; background: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.05; pointer-events: none; mix-blend-mode: overlay; }
  .nebula-glow { position: absolute; width: 1000px; height: 1000px; background: radial-gradient(circle, rgba(139, 0, 255, 0.12) 0%, transparent 70%); filter: blur(120px); top: -20%; left: -10%; transition: transform 0.15s ease-out; }
  .floating-glyphs { position: absolute; top: 15%; left: -10%; font-family: 'Syncopate'; font-size: 12vw; opacity: 0.03; white-space: nowrap; pointer-events: none; letter-spacing: -10px; }

  .zenith-nav { height: 90px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.6); backdrop-filter: blur(25px); z-index: 1000; }
  .nav-hex-icon { position: relative; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; }
  .hex-border { color: var(--pink); filter: drop-shadow(var(--glow)); animation: float 3s ease-in-out infinite; }
  .hex-core { position: absolute; z-index: 2; }
  
  .social-cluster { display: flex; gap: 18px; margin-left: 25px; color: #444; }
  .s-icon:hover { color: var(--pink); transform: translateY(-3px) scale(1.1); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .v-divider { width: 1px; height: 20px; background: #222; }
  .pulse-icon { color: var(--cyan); animation: pulse 2s infinite; }

  .search-capsule { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 60px; padding: 10px 25px; display: flex; align-items: center; gap: 15px; width: 400px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
  .search-capsule input { background: none; border: none; color: #eee; font-size: 13px; width: 100%; outline: none; font-family: 'JetBrains Mono'; }
  .shortcut { font-size: 10px; color: #333; border: 1px solid #222; padding: 2px 8px; border-radius: 5px; }
  .sys-clock { font-family: 'JetBrains Mono'; font-size: 12px; color: #555; display: flex; align-items: center; gap: 10px; }
  .blink-dot { width: 6px; height: 6px; background: var(--pink); border-radius: 50%; box-shadow: 0 0 10px var(--pink); animation: blink 1s infinite; }

  .zenith-stage { flex: 1; display: grid; grid-template-columns: 1fr 1.3fr 1fr; gap: 50px; padding: 50px; transform-style: preserve-3d; }

  .identity-flank { display: flex; flex-direction: column; justify-content: center; transform: translateZ(60px); }
  .rank-strip { color: var(--pink); font-size: 11px; font-weight: 900; letter-spacing: 6px; margin-bottom: 12px; text-shadow: var(--glow); }
  .mega-name { font-family: 'Syncopate', sans-serif; font-size: 100px; line-height: 0.75; margin-bottom: 8px; letter-spacing: -8px; }
  .mega-name.glitch { animation: glitchSkew 0.2s infinite; text-shadow: 4px 0 var(--cyan), -4px 0 var(--pink); }
  .surname { font-family: 'Syncopate'; font-size: 28px; color: var(--violet); opacity: 0.5; margin-bottom: 35px; }
  .bio-container { position: relative; padding: 25px 30px; margin-bottom: 50px; }
  .bio-bracket { position: absolute; width: 40px; height: 40px; border: 2px solid var(--border); }
  .bio-bracket.top { top: 0; left: 0; border-right: none; border-bottom: none; }
  .bio-bracket.bottom { bottom: 0; right: 0; border-left: none; border-top: none; }
  .lore-para { font-size: 16px; color: #999; line-height: 1.7; font-style: italic; font-weight: 300; }

  .stats-matrix { display: flex; flex-direction: column; gap: 22px; width: 280px; margin-bottom: 40px; }
  .matrix-item { display: flex; align-items: center; gap: 18px; }
  .m-label { font-size: 12px; font-weight: 900; width: 45px; color: var(--cyan); letter-spacing: 2px; }
  .m-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.03); border-radius: 4px; position: relative; overflow: hidden; }
  .m-fill { height: 100%; background: linear-gradient(90deg, var(--violet), var(--pink)); box-shadow: 0 0 15px var(--pink); transition: 1.5s cubic-bezier(0.23, 1, 0.32, 1); }
  .m-val { font-family: 'JetBrains Mono'; font-size: 13px; color: #666; width: 40px; text-align: right; }

  .loadout-mini-panel { background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 12px; padding: 15px; }
  .panel-tag { font-size: 9px; font-weight: 900; color: #444; margin-bottom: 10px; letter-spacing: 2px; }
  .gear-list { display: flex; flex-direction: column; gap: 8px; }
  .gear-item { display: flex; justify-content: space-between; font-size: 10px; }
  .g-slot { color: var(--pink); font-weight: 700; }
  .g-name { color: #888; }

  .nova-core-section { display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateZ(120px); }
  .circular-orb-wrapper { width: 420px; height: 420px; position: relative; display: flex; align-items: center; justify-content: center; }
  .orb-ring { position: absolute; border-radius: 50%; border: 1px solid var(--pink); opacity: 0.15; }
  .ring-1 { inset: -30px; border-style: dashed; animation: rotate 25s linear infinite; }
  .ring-2 { inset: 15px; border: 1px double var(--cyan); opacity: 0.1; animation: rotate 18s linear infinite reverse; }
  .ring-3 { inset: -55px; border-style: dotted; opacity: 0.04; animation: rotate 35s linear infinite; }
  .ring-4 { inset: -80px; border: 1px solid var(--violet); opacity: 0.02; }

  .main-circle-avatar { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 12px solid var(--glass); position: relative; z-index: 10; box-shadow: 0 0 80px rgba(0,0,0,0.9); transition: transform 0.5s; }
  .main-circle-avatar:hover { transform: scale(1.02); }
  .main-circle-avatar img { width: 100%; height: 100%; object-fit: cover; filter: contrast(1.2) sepia(0.2) saturate(1.4); }
  .avatar-scanline { position: absolute; inset: 0; background: linear-gradient(transparent, rgba(255,0,255,0.15), transparent); height: 30%; animation: scan 3s linear infinite; }

  .status-orbit { position: absolute; inset: 0; z-index: 25; animation: rotate 15s linear infinite; }
  .orb-bit { position: absolute; width: 36px; height: 36px; background: #000; border: 1.5px solid var(--pink); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--pink); box-shadow: 0 0 20px var(--pink); transition: 0.3s; }
  .orb-bit:hover { transform: scale(1.2); color: #fff; background: var(--pink); }
  .s1 { top: 0; left: 50%; transform: translateX(-50%); }
  .s2 { bottom: 18%; left: 8%; }
  .s3 { bottom: 18%; right: 8%; }
  .s4 { top: 25%; left: -5%; }

  .radar-ping { position: absolute; inset: -100px; border: 2px solid var(--pink); border-radius: 50%; opacity: 0; animation: ping 4s ease-out infinite; }
  .sync-status { margin-top: 60px; text-align: center; }
  .sync-label { font-size: 11px; letter-spacing: 4px; color: var(--cyan); margin-bottom: 8px; font-weight: 700; }
  .sync-val { font-family: 'Syncopate'; font-size: 40px; color: #fff; text-shadow: 0 0 30px var(--cyan); }
  .sync-wave { display: flex; gap: 8px; justify-content: center; margin-top: 15px; }
  .wave-segment { width: 15px; height: 4px; background: #222; border-radius: 2px; }
  .wave-segment:nth-child(odd) { animation: pulse 1.5s infinite; background: var(--pink); }

  .modules-flank { display: flex; flex-direction: column; gap: 35px; justify-content: center; transform: translateZ(60px); }
  .module-panel { background: var(--glass); border: 1px solid var(--border); border-radius: 16px; padding: 30px; backdrop-filter: blur(25px); transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-left: 4px solid var(--border); }
  .module-panel:hover { border-color: var(--pink); transform: translateX(-10px); box-shadow: -10px 10px 50px rgba(0,0,0,0.6); }
  .panel-header { font-size: 11px; font-weight: 900; color: var(--pink); letter-spacing: 3px; margin-bottom: 25px; display: flex; align-items: center; gap: 15px; }
  .header-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }

  .skill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .skill-hex-card { background: rgba(0,0,0,0.5); padding: 18px; border-radius: 10px; border: 1px solid var(--border); transition: 0.3s; }
  .skill-hex-card:hover { background: rgba(255,0,255,0.05); border-color: var(--pink); }
  .hex-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .hex-top strong { font-size: 12px; color: var(--pink); letter-spacing: 1px; }
  .lvl-badge { font-size: 10px; font-family: 'JetBrains Mono'; background: #000; padding: 2px 6px; border-radius: 4px; color: var(--cyan); }
  .skill-hex-card p { font-size: 11px; color: #666; line-height: 1.5; font-weight: 400; }
  .rarity-god { border-top: 3px solid #ffd700; box-shadow: inset 0 5px 15px rgba(255,215,0,0.05); }

  .log-scroll { height: 150px; overflow-y: hidden; font-family: 'JetBrains Mono'; font-size: 11px; color: #444; display: flex; flex-direction: column; gap: 10px; border-left: 2px solid #111; padding-left: 15px; }
  .log-line { position: relative; }
  .log-line.cursor { animation: blink 0.8s infinite; color: var(--pink); font-weight: 700; }

  .achievement-strip { margin-top: 10px; }
  .achieve-grid { display: flex; gap: 15px; }
  .achieve-icon { width: 35px; height: 35px; background: #000; border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--violet); }
  .achieve-icon.locked { opacity: 0.2; filter: grayscale(1); }

  .aesthetic-sidebar { position: fixed; right: 50px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 45px; align-items: flex-end; z-index: 100; }
  .side-tab { writing-mode: vertical-lr; font-size: 11px; font-weight: 900; letter-spacing: 6px; color: #333; cursor: pointer; transition: 0.4s; padding: 15px 0; border-right: 2px solid transparent; }
  .side-tab:hover { color: #888; }
  .side-tab.active { color: var(--pink); border-right: 3px solid var(--pink); text-shadow: var(--glow); transform: translateX(-5px); }

  .zenith-footer { height: 110px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; border-top: 1px solid var(--border); background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); }
  .pill-tag { font-size: 11px; background: rgba(255,0,255,0.04); border: 1px solid var(--border); padding: 7px 20px; border-radius: 60px; color: #666; display: flex; align-items: center; gap: 10px; margin-right: 20px; transition: 0.3s; }
  .pill-tag:hover { color: var(--cyan); border-color: var(--cyan); background: rgba(0,255,255,0.05); }
  
  .btn-group { display: flex; gap: 20px; align-items: center; margin-right: 40px; }
  .zenith-btn { padding: 14px 35px; border-radius: 60px; font-weight: 900; font-size: 13px; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; gap: 12px; letter-spacing: 1px; }
  .zenith-btn.primary { background: #fff; color: #000; border: none; }
  .zenith-btn.primary:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(255,255,255,0.3); }
  .zenith-btn.secondary { background: none; border: 1px solid #333; color: #777; }
  .zenith-btn.secondary:hover { border-color: var(--pink); color: var(--pink); }
  
  .shutdown-trigger { background: none; border: 2.5px solid #ff3e3e; color: #ff3e3e; padding: 12px; border-radius: 50%; cursor: pointer; transition: 0.4s; }
  .shutdown-trigger:hover { background: #ff3e3e; color: #fff; box-shadow: 0 0 30px #ff3e3e; transform: rotate(90deg); }

  .scanline-master { position: fixed; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%); background-size: 100% 4px; pointer-events: none; z-index: 2000; opacity: 0.3; }
  .vignette-master { position: fixed; inset: 0; background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%); pointer-events: none; z-index: 1999; }

  @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes scan { from { top: -30%; } to { top: 110%; } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes ping { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes glitchSkew { 0% { transform: skew(0deg); } 20% { transform: skew(6deg); } 40% { transform: skew(-6deg); } 60% { transform: skew(4deg); } 100% { transform: skew(0deg); } }
`;