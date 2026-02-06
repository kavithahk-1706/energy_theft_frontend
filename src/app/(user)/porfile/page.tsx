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
  Dna, Microscope, Atom, Ghost, Monitor, HardDrive,
  Music,
  Users,
  Receipt
} from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * APEX_ZENITH_INTERFACE_V2 [MASTER_BUILD_700]
 * REPLACES: CUSTOM_AUTH_CONTEXT
 * INTEGRATION: CLERK_CORE_V5
 */

// --- ARCHITECTURAL TYPES ---
interface SkillTrait {
  id: string;
  name: string;
  level: number;
  category: 'OFFENSE' | 'DEFENSE' | 'UTILITY' | 'CORE';
  rarity: 'COMMON' | 'ELITE' | 'LEGENDARY' | 'ARTIFACT';
  integrity: number;
  desc: string;
}

interface SystemEvent {
  timestamp: string;
  origin: string;
  payload: string;
  severity: 'LOW' | 'CRITICAL' | 'STABLE';
}

interface InventoryItem {
  slot: string;
  name: string;
  power: number;
  status: string;
}

 // For the Ledger
const pendingBills = [
  { id: 'INV-882', amount: '4.22 ETH', dueDate: '2026-02-15', status: 'OVERDUE', service: 'SATELLITE_UPLINK' },
  { id: 'INV-901', amount: '1.05 ETH', dueDate: '2026-02-28', status: 'PENDING', service: 'GRID_MAINTENANCE' },
];

// For the Hired Help
const hiredOperatives = [
  { name: 'Kaelith.exe', role: 'Infiltrator', contract: 'ACTIVE', performance: 98 },
  { name: 'Spector_Unit', role: 'Security', contract: 'TERMINATED', performance: 45 },
];

const ApexZenithProfile: React.FC = () => {
  const { user, isLoaded } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- EXTENDED ENGINE STATE ---
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [syncRate, setSyncRate] = useState(99.12);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPoweringDown, setIsPoweringDown] = useState(false);
  const [bootSequence, setBootSequence] = useState(0);
  const [missions, setMissions] = useState<any[]>([]);

useEffect(() => {
  if (!user?.primaryEmailAddress?.emailAddress) return;

  const q = query(
    collection(db, "missions"),
    where("clientEmail", "==", user.primaryEmailAddress.emailAddress)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedMissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMissions(fetchedMissions);
  });

  return () => unsubscribe();
}, [user]);

  // --- LORE DATA: SKILL MATRIX ---
  const skillMatrix: SkillTrait[] = useMemo(() => [
    { id: 'S1', name: 'KERNAL_BREACH', level: 99, category: 'OFFENSE', rarity: 'ARTIFACT', integrity: 100, desc: 'Bypasses root-level encryption via neural ghosting.' },
    { id: 'S2', name: 'GHOST_PROTOCOL', level: 85, category: 'DEFENSE', rarity: 'ELITE', integrity: 92, desc: 'Impossible to track via standard server pings.' },
    { id: 'S3', name: 'COFFEE_DRIVE', level: 10, category: 'CORE', rarity: 'COMMON', integrity: 40, desc: 'Current caffeine levels are critically low.' },
    { id: 'S4', name: 'DATA_SIPHON', level: 72, category: 'UTILITY', rarity: 'LEGENDARY', integrity: 88, desc: 'Extracts 4GB of raw intent per second.' },
    { id: 'S5', name: 'VOID_SHELL', level: 44, category: 'DEFENSE', rarity: 'ARTIFACT', integrity: 100, desc: 'Immune to all emotional damage from CSS bugs.' },
    { id: 'S6', name: 'OVERCLOCK', level: 60, category: 'CORE', rarity: 'ELITE', integrity: 75, desc: 'Boosts cognitive output at the cost of sleep.' },
    { id: 'S7', name: 'LOGIC_STORM', level: 81, category: 'OFFENSE', rarity: 'LEGENDARY', integrity: 95, desc: 'Deploys 1000 micro-functions simultaneously.' },
    { id: 'S8', name: 'REFRACTOR', level: 30, category: 'UTILITY', rarity: 'COMMON', integrity: 100, desc: 'Auto-formats all messy code on save.' }
  ], []);

  // --- INVENTORY DATA ---
  const inventory: InventoryItem[] = [
    { slot: 'HEAD', name: 'NEURAL_LINK_V4', power: 85, status: 'SYNCED' },
    { slot: 'CHEST', name: 'TITANIUM_CHASSIS', power: 120, status: 'STABLE' },
    { slot: 'HANDS', name: 'HAPTIC_GLOVES', power: 45, status: 'DAMAGED' },
    { slot: 'CORE', name: 'ATOM_REACTOR', power: 999, status: 'OVERLOAD' }
  ];

  // --- BACKGROUND PARTICLE ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * canvas.width,
          o: Math.random(),
          s: Math.random() * 2
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 1, 5, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.z -= 2;
        if (p.z <= 0) p.z = canvas.width;
        const sx = (p.x - canvas.width / 2) * (canvas.width / p.z) + canvas.width / 2;
        const sy = (p.y - canvas.height / 2) * (canvas.width / p.z) + canvas.height / 2;
        const size = (1 - p.z / canvas.width) * 3;
        ctx.fillStyle = `rgba(255, 0, 255, ${p.o})`;
        ctx.fillRect(sx, sy, size, size);
      });
      requestAnimationFrame(animate);
    };

    init(); animate();
    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- INTERACTIVITY HOOKS ---
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 30, y: (e.clientY / window.innerHeight - 0.5) * 30 });
    };
    window.addEventListener('mousemove', handleMove);
    const syncInt = setInterval(() => setSyncRate(r => +(r + (Math.random() * 0.02 - 0.01)).toFixed(2)), 3000);
    return () => { window.removeEventListener('mousemove', handleMove); clearInterval(syncInt); };
  }, []);

  if (!isLoaded) return <div className="loading-screen">INITIALIZING_OS_V2...</div>;

  return (
    <div className={`apex-root ${isPoweringDown ? 'shutdown' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: MASTER_CSS }} />
      <canvas ref={canvasRef} className="starfield" />
      
      {/* HUD: STATUS STRIPS */}
      <div className="status-strip left">
         {['ADMIN', 'ROOT', 'CLERK_AUTH', 'SECURE'].map(t => <span key={t}>{t}</span>)}
      </div>
      <div className="status-strip right">
         {['0XFF2', 'SYNC_OK', '99.9%', 'VOLT'].map(t => <span key={t}>{t}</span>)}
      </div>
      {/* MAIN CONTENT STAGE */}
      <main className="apex-stage" style={{ transform: `rotateY(${mousePos.x * 0.03}deg) rotateX(${-mousePos.y * 0.03}deg)` }}>
        
        {/* IDENTITY FLANK */}
        <section className="flank-left">
          <div className="id-card">
            <div className="id-tag">SUBJECT: {user?.id.substring(0, 10)}</div>
            <h1 className="id-name">{user?.firstName?.toUpperCase()}</h1>
            <h2 className="id-surname">{user?.lastName?.toUpperCase()}</h2>
            <div className="id-bio">
               <p>"Reality is just a variable I haven't defined yet. Logic is the only absolute."</p>
            </div>
          </div>

          <div className="module-box stats">
             <div className="box-header"><Activity size={14}/> NEURAL_METRICS</div>
             {[
               { n: 'SYN', v: 99 }, { n: 'LOG', v: 82 }, { n: 'MEM', v: 45 }, { n: 'PWR', v: 100 }
             ].map(s => (
               <div key={s.n} className="stat-line">
                 <span className="s-name">{s.n}</span>
                 <div className="s-track"><div className="s-fill" style={{width: `${s.v}%`}} /></div>
                 <span className="s-val">{s.v}%</span>
               </div>
             ))}
          </div>

          <div className="module-box inventory">
            <div className="box-header"><Box size={14}/> LOADOUT_SLOTS</div>
            {inventory.map(item => (
              <div key={item.slot} className="inv-item">
                <span className="i-slot">{item.slot}</span>
                <span className="i-name">{item.name}</span>
                <span className={`i-status ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CORE SECTION */}
        <section className="core-center">
          <div className="avatar-ring-system">
            <div className="ring r-outer" />
            <div className="ring r-inner" />
            <div className="avatar-hex">
               <img src={user?.imageUrl} alt="Profile" />
               <div className="scanline" />
            </div>
            <div className="orbiters-container"> {/* Wrap orbiters for a smoother spin */}
  <div className="orb-point p1"><Skull size={14}/></div>
  <div className="orb-point p2"><Dna size={14}/></div>
  <div className="orb-point p3"><Atom size={14}/></div>
</div>
          </div>
          
          <div className="sync-banner">
             <div className="banner-label">OS_STABILITY_INDEX</div>
             <div className="banner-value">{syncRate}%</div>
             <div className="banner-grid">
               {[...Array(20)].map((_, i) => <div key={i} className={`g-bar ${i < 15 ? 'active' : ''}`} />)}
             </div>
          </div>
        </section>

        {/* DATA FLANK */}
        {/* DATA FLANK */}
<section className="flank-right">
  {/* Add the Ledger and Personnel Dossier here */}
  <FinancialLedger missions={[]} />
  <PersonnelDossier missions={[]} />

  <div className="module-box traits">
    <div className="box-header"><Sparkles size={14}/> ACTIVE_SKILL_TREE</div>
    <div className="trait-list">
      {skillMatrix.map(skill => (
        <div key={skill.id} className={`trait-node rarity-${skill.rarity.toLowerCase()}`}>
          <div className="node-top">
            <strong>{skill.name}</strong>
            <span>LV.{skill.level}</span>
          </div>
          <p>{skill.desc}</p>
        </div>
      ))}
    </div>
  </div>

  <div className="module-box terminal">
    <div className="box-header"><Terminal size={14}/> KERNEL_LOGS</div>
    <div className="terminal-screen">
      <p>[SYSTEM] MOUNTING_USER_SESSIONS...</p>
      <p>[INFO] ENCRYPTION_STABLE_AES_256</p>
      <p>[AUTH] CLERK_JWT_VALIDATED</p>
      <p className="typing">SCANNING_FOR_INTRUSIONS...<span className="cursor">_</span></p>
    </div>
  </div>
</section>
      </main>

      {/* FOOTER CONTROL DOCK */}
      <footer className="apex-footer">
        <div className="foot-left">
           <div className="pill"><Globe size={12}/> NEO_TOKYO</div>
           <div className="pill"><Lock size={12}/> ENCRYPTED</div>
        </div>

        <div className="foot-center">
           <div className="system-path">VOLTGUARD / USERS / {user?.firstName?.toUpperCase()} / PROFILE</div>
        </div>

        <div className="foot-right">
          <button className="btn-action">MOD_PROFILE</button>
          <button className="btn-action primary">RESYNC_CORE</button>
          <SignOutButton>
            <button className="btn-power" onClick={() => setIsPoweringDown(true)}>
              <Power size={18} />
            </button>
          </SignOutButton>
        </div>
      </footer>

      <div className="vignette" />
    </div>
  );
};

const SocialPulse = () => (
  <div className="module-box social-box">
    <div className="box-header"><Share2 size={14}/> NEURAL_ACTIVITY</div>
    <div className="pulse-graph">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="pulse-bar" 
          style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} 
        />
      ))}
    </div>
    <div className="social-stats">
      <div className="s-stat"><span>FOLLOWERS</span><strong>4.2K</strong></div>
      <div className="s-stat"><span>REPUTATION</span><strong>ELITE</strong></div>
    </div>
  </div>
);

const MediaDeck = () => (
  <div className="module-box media-box">
    <div className="box-header"><Radio size={14}/> CURRENT_FREQUENCIES</div>
    <div className="media-content">
      <div className="media-art"><Music size={20} className="floating" /></div>
      <div className="media-info">
        <div className="track-name">CYBER_PUNK_2026_OST</div>
        <div className="track-artist">SYSTEM_GHOST</div>
        <div className="track-progress"><div className="t-fill" /></div>
      </div>
    </div>
  </div>
);

const FinancialLedger = ({ missions }: { missions: any[] }) => {
  const pendingMissions = missions.filter(m => m.status === 'PENDING' || m.status === 'ACCEPTED');
  
  return (
    <div className="module-box ledger-box">
      <div className="box-header"><Receipt size={14}/> FINANCIAL_CHRONOLOGY</div>
      <div className="ledger-list">
        {pendingMissions.length > 0 ? pendingMissions.map(mission => (
          <div key={mission.id} className="ledger-item">
            <div className="l-meta">
              <span className="l-id">{mission.orderId || 'ORD-UNKNOWN'}</span>
              <span className={`l-status ${mission.status === 'PENDING' ? 'pending' : 'active'}`}>
                {mission.status}
              </span>
            </div>
            <div className="l-main">
              <span className="l-service truncate mr-4">{mission.serviceTitle}</span>
              <span className="l-amount">₹{mission.price}</span>
            </div>
            <div className="l-bar">
              <div className={`l-progress ${mission.status === 'PENDING' ? 'pending' : 'overdue'}`} />
            </div>
          </div>
        )) : (
          <p className="text-[10px] text-gray-600 text-center py-4 italic">NO_OUTSTANDING_DEBT_FOUND</p>
        )}
      </div>
    </div>
  );
};

const PersonnelDossier = ({ missions }: { missions: any[] }) => {
  // Only show missions that have an assigned worker
  const activeOps = missions.filter(m => m.workerId);

  return (
    <div className="module-box personnel-box">
      <div className="box-header"><Users size={14}/> HIRED_OPERATIVES</div>
      <div className="personnel-list">
        {activeOps.length > 0 ? activeOps.map(op => (
          <div key={op.id} className="op-card">
            <div className="op-info">
              <strong>{op.workerName || 'ASSIGNED_SPECIALIST'}</strong>
              <span>{op.serviceTitle}</span>
            </div>
            <div className="op-stats">
              <div className="op-perf" style={{color: 'var(--cyan)'}}>
                99%_EFF
              </div>
              <div className="op-contract uppercase">{op.status}</div>
            </div>
          </div>
        )) : (
          <p className="text-[10px] text-gray-600 text-center py-4 italic">SEARCHING_FOR_AVAILABLE_UNITS...</p>
        )}
      </div>
    </div>
  );
};




export default ApexZenithProfile;

// --- CSS ARCHITECTURE ---
const MASTER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono&display=swap');

  :root {
    --magenta: #ff00ff;
    --cyan: #00ffff;
    --violet: #8b00ff;
    --bg: #030105;
    --panel: rgba(15, 5, 25, 0.85);
    --border: rgba(255, 0, 255, 0.2);
    --glow: 0 0 20px rgba(255, 0, 255, 0.3);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: #fff; font-family: 'Space Grotesk', sans-serif; margin-top: 8%; }

  .apex-root { height: 100vh; display: flex; flex-direction: column; position: relative; perspective: 2000px; }
  .starfield { position: absolute; inset: 0; z-index: -1; }
  .loading-screen { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; color: var(--magenta); }

  /* HUD ELEMENTS */
  .status-strip { position: fixed; top: 0; bottom: 0; width: 30px; display: flex; flex-direction: column; justify-content: center; gap: 40px; font-family: 'JetBrains Mono'; font-size: 9px; color: var(--border); writing-mode: vertical-rl; z-index: 100; }
  .status-strip.left { left: 15px; border-right: 1px solid var(--border); }
  .status-strip.right { right: 15px; border-left: 1px solid var(--border); }

  /* NAV STYLING */
  .apex-nav { height: 90px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; border-bottom: 1px solid var(--border); backdrop-filter: blur(20px); z-index: 1000; }
  .nav-brand { display: flex; align-items: center; gap: 15px; }
  .brand-icon { color: var(--magenta); filter: drop-shadow(0 0 10px var(--magenta)); animation: pulse 2s infinite; }
  .brand-meta strong { display: block; font-family: 'Syncopate'; font-size: 16px; letter-spacing: 2px; }
  .brand-meta span { font-size: 10px; color: var(--violet); }

  .search-capsule { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 4px; padding: 10px 20px; display: flex; align-items: center; gap: 15px; width: 350px; }
  .search-capsule input { background: none; border: none; color: #fff; font-family: 'JetBrains Mono'; font-size: 12px; outline: none; width: 100%; }
  .tag { font-size: 9px; color: #444; border: 1px solid #333; padding: 2px 5px; }

  .user-hub { display: flex; align-items: center; gap: 20px; padding: 8px 20px; background: rgba(255,255,255,0.02); border-radius: 40px; border: 1px solid var(--border); }
  .user-text { text-align: right; }
  .user-text p { font-size: 13px; font-weight: 700; }
  .user-text span { font-size: 9px; color: var(--magenta); }

  /* STAGE LAYOUT */
  .apex-stage { flex: 1; display: grid; grid-template-columns: 1fr 1.2fr 1fr; padding: 40px 60px; gap: 40px; transform-style: preserve-3d; transition: transform 0.1s ease-out; }
  
  .module-box { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid var(--magenta); backdrop-filter: blur(10px); }
  .box-header { font-size: 11px; font-weight: 900; color: var(--magenta); letter-spacing: 3px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }

  /* LEFT SIDE */
  .id-card { margin-bottom: 40px; }
  .id-tag { font-size: 10px; color: var(--cyan); letter-spacing: 3px; margin-bottom: 10px; }
  .id-name { font-family: 'Syncopate'; font-size: 80px; line-height: 0.8; letter-spacing: -5px; }
  .id-surname { font-family: 'Syncopate'; font-size: 30px; opacity: 0.3; color: var(--violet); }
  .id-bio { margin-top: 25px; font-size: 14px; color: #888; border-left: 2px solid var(--magenta); padding-left: 20px; font-style: italic; }

  .stat-line { display: flex; align-items: center; gap: 15px; margin-bottom: 12px; }
  .s-name { font-size: 11px; font-weight: 900; color: var(--cyan); width: 35px; }
  .s-track { flex: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
  .s-fill { height: 100%; background: linear-gradient(90deg, var(--violet), var(--magenta)); box-shadow: 0 0 10px var(--magenta); }
  .s-val { font-family: 'JetBrains Mono'; font-size: 11px; color: #444; width: 35px; }

  .inv-item { display: flex; justify-content: space-between; font-size: 11px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .i-slot { color: var(--magenta); font-weight: 700; }
  .i-status.damaged { color: #ff3e3e; }
  .i-status.overload { animation: blink 0.5s infinite; color: var(--cyan); }

  /* CENTER CORE */
  .avatar-ring-system { width: 450px; height: 450px; position: relative; margin: 0 auto; display: flex; align-items: center; justify-content: center; transform: translateZ(100px); }
  .avatar-hex { width: 300px; height: 300px; border-radius: 50%; overflow: hidden; border: 10px solid var(--panel); position: relative; z-index: 10; box-shadow: 0 0 60px rgba(0,0,0,0.8); }
  .avatar-hex img { width: 100%; height: 100%; object-fit: cover; filter: contrast(1.1) brightness(1.1); }
  .scanline { position: absolute; inset: 0; background: linear-gradient(transparent, rgba(255,0,255,0.1), transparent); height: 20%; animation: scan 3s linear infinite; }
  
  .ring { position: absolute; border-radius: 50%; border: 1px solid var(--magenta); opacity: 0.2; }
  .r-outer { inset: -30px; border-style: dashed; animation: rotate 40s linear infinite; }
  .r-inner { inset: 20px; border-color: var(--cyan); animation: rotate 25s linear infinite reverse; }

  .orb-point { position: absolute; width: 35px; height: 35px; background: #000; border: 1px solid var(--magenta); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--magenta); box-shadow: 0 0 15px var(--magenta); animation: pulse 2s infinite; }
  .p1 { top: 5%; right: 15%; }
  .p2 { bottom: 20%; left: -5%; }
  .p3 { top: 40%; left: -15%; }

  .sync-banner { margin-top: 50px; text-align: center; }
  .banner-value { font-family: 'Syncopate'; font-size: 50px; color: #fff; text-shadow: 0 0 30px var(--cyan); margin: 10px 0; }
  .banner-grid { display: flex; gap: 5px; justify-content: center; }
  .g-bar { width: 15px; height: 5px; background: #111; }
  .g-bar.active { background: var(--magenta); box-shadow: 0 0 10px var(--magenta); }

  /* RIGHT SIDE */
  .trait-list { height: 350px; overflow-y: auto; padding-right: 10px; }
  .trait-node { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; padding: 15px; margin-bottom: 15px; transition: 0.3s; }
  .trait-node:hover { border-color: var(--magenta); background: rgba(255,0,255,0.05); transform: translateX(-5px); }
  .node-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .node-top strong { color: var(--magenta); font-size: 12px; }
  .trait-node p { font-size: 11px; color: #666; line-height: 1.4; }

  .terminal-screen { font-family: 'JetBrains Mono'; font-size: 11px; color: #444; line-height: 1.8; }
  .cursor { color: var(--magenta); animation: blink 1s infinite; }

  /* FOOTER */
  .apex-footer { height: 100px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 50px; backdrop-filter: blur(10px); }
  .pill { font-size: 10px; border: 1px solid #222; padding: 6px 15px; border-radius: 20px; color: #555; display: flex; align-items: center; gap: 8px; }
  .system-path { font-family: 'JetBrains Mono'; font-size: 10px; color: #333; letter-spacing: 2px; }
  .btn-action { background: none; border: 1px solid #333; color: #777; padding: 12px 25px; border-radius: 4px; font-weight: 700; font-size: 11px; cursor: pointer; transition: 0.3s; }
  .btn-action.primary { background: #fff; color: #000; border: none; margin: 0 15px; }
  .btn-power { background: none; border: 2.5px solid #ff3e3e; color: #ff3e3e; padding: 10px; border-radius: 50%; cursor: pointer; transition: 0.3s; }
  .btn-power:hover { background: #ff3e3e; color: #fff; box-shadow: 0 0 20px #ff3e3e; transform: rotate(90deg); }

  /* ANIMATIONS */
  @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
  @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes blink { 50% { opacity: 0; } }
  @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--magenta); border-radius: 10px; }
  /* CENTER CORE - UPDATED FOR MOVEMENT */
  .avatar-ring-system { 
    width: 450px; 
    height: 450px; 
    position: relative; 
    margin: 0 auto; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    transform: translateZ(100px); 
  }

  .avatar-hex { 
    width: 300px; 
    height: 300px; 
    border-radius: 50%; 
    overflow: hidden; 
    border: 10px solid var(--panel); 
    position: relative; 
    z-index: 10; 
    box-shadow: 0 0 60px rgba(0,0,0,0.8); 
  }

  .avatar-hex img { width: 100%; height: 100%; object-fit: cover; }

  /* THE ACTIVE SCANLINE */
  .scanline { 
    position: absolute; 
    inset: 0; 
    background: linear-gradient(transparent, var(--magenta), transparent); 
    height: 10px; 
    width: 100%;
    opacity: 0.5;
    z-index: 11;
    animation: scanVertical 3s linear infinite; 
  }
  
  .ring { position: absolute; border-radius: 50%; border: 1px solid var(--magenta); opacity: 0.3; }
  .r-outer { inset: -30px; border-style: dashed; animation: rotateCW 40s linear infinite; }
  .r-inner { inset: 20px; border-color: var(--cyan); animation: rotateCCW 25s linear infinite; }

  /* ORBITING SYSTEM */
  .orbiters-container {
    position: absolute;
    inset: -50px;
    animation: rotateCW 20s linear infinite;
    pointer-events: none;
  }

  .orb-point { 
    position: absolute; 
    width: 38px; 
    height: 38px; 
    background: #000; 
    border: 2px solid var(--magenta); 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: var(--magenta); 
    box-shadow: 0 0 15px var(--magenta); 
    animation: orbPulse 2s ease-in-out infinite, rotateCCW 20s linear infinite; /* Counter-rotates to stay upright */
    pointer-events: auto;
  }

  .p1 { top: 10%; right: 10%; }
  .p2 { bottom: 15%; left: 5%; }
  .p3 { top: 45%; left: -10%; }

  /* --- ENGINE KEYFRAMES --- */
  @keyframes scanVertical { 
    0% { top: -10%; } 
    100% { top: 110%; } 
  }

  @keyframes rotateCW { 
    from { transform: rotate(0deg); } 
    to { transform: rotate(360deg); } 
  }

  @keyframes rotateCCW { 
    from { transform: rotate(360deg); } 
    to { transform: rotate(0deg); } 
  }

  @keyframes orbPulse { 
    0%, 100% { transform: scale(1); box-shadow: 0 0 15px var(--magenta); } 
    50% { transform: scale(1.15); box-shadow: 0 0 30px var(--cyan); border-color: var(--cyan); color: var(--cyan); } 
  }

  @keyframes blink { 50% { opacity: 0; } }

  .typing .cursor {
    display: inline-block;
    width: 8px;
    height: 15px;
    background: var(--magenta);
    margin-left: 5px;
    animation: blink 0.8s step-end infinite;
  }
    /* SOCIAL PULSE */
  .pulse-graph {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 40px;
    margin: 15px 0;
  }
  .pulse-bar {
    flex: 1;
    background: var(--magenta);
    box-shadow: 0 0 5px var(--magenta);
    animation: barPulse 1.5s ease-in-out infinite;
  }
  .social-stats { display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 10px; }
  .s-stat span { display: block; font-size: 8px; color: #555; }
  .s-stat strong { font-size: 12px; color: var(--cyan); }

  /* MEDIA DECK */
  .media-content { display: flex; gap: 15px; align-items: center; }
  .media-art { width: 45px; height: 45px; background: rgba(255,0,255,0.1); border: 1px solid var(--magenta); display: flex; align-items: center; justify-content: center; }
  .media-info { flex: 1; }
  .track-name { font-size: 10px; font-weight: 900; color: #fff; }
  .track-artist { font-size: 8px; color: var(--magenta); margin-bottom: 5px; }
  .track-progress { height: 2px; background: #111; width: 100%; position: relative; }
  .t-fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--cyan); width: 65%; box-shadow: 0 0 5px var(--cyan); }

  /* FLOATING ANIMATION */
  .floating { animation: float 3s ease-in-out infinite; }

  @keyframes barPulse {
    0%, 100% { height: 30%; }
    50% { height: 90%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  /* LEDGER STYLING */
  .ledger-item { margin-bottom: 20px; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 4px; }
  .l-meta { display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 5px; }
  .l-status.overdue { color: #ff3e3e; text-shadow: 0 0 5px #ff3e3e; }
  .l-status.pending { color: var(--cyan); }
  .l-main { display: flex; justify-content: space-between; font-weight: 700; font-size: 12px; margin-bottom: 8px; }
  .l-amount { color: var(--magenta); font-family: 'JetBrains Mono'; }
  .l-bar { height: 2px; background: #111; width: 100%; }
  .l-progress { height: 100%; width: 60%; }
  .l-progress.overdue { background: #ff3e3e; box-shadow: 0 0 10px #ff3e3e; width: 100%; }
  .l-progress.pending { background: var(--cyan); box-shadow: 0 0 10px var(--cyan); width: 40%; }

  /* PERSONNEL STYLING */
  .op-card { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--border); transition: 0.3s; }
  .op-card:hover { background: rgba(0,255,255,0.05); border-left: 2px solid var(--cyan); }
  .op-info strong { display: block; font-size: 12px; color: #fff; }
  .op-info span { font-size: 9px; color: #555; }
  .op-stats { text-align: right; font-family: 'JetBrains Mono'; font-size: 10px; }
  .op-contract { font-size: 8px; margin-top: 4px; opacity: 0.5; }
  .flank-right {
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 10px;
}
/* Optional: style the scrollbar for the column to match the theme */
.flank-right::-webkit-scrollbar { width: 4px; }
.flank-right::-webkit-scrollbar-thumb { background: var(--magenta); }
`;