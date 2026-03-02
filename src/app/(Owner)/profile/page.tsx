"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useUser, SignOutButton } from "@clerk/nextjs";
import { 
  Lock, Terminal, Database, Shield, Activity, 
  Fingerprint, Globe, Power, Server, Wifi 
} from 'lucide-react';
import Link from 'next/link';

/**
 * MODULE: ADMIN_PROFILE_V1
 * STYLE: NEO_TOKYO_PRESERVED
 * CONTENT: PROFESSIONAL_ENTERPRISE
 */

export default function AdminProfile() {
  const { user, isLoaded } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('SYSTEM');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPoweringDown, setIsPoweringDown] = useState(false);
  const [systemLoad, setSystemLoad] = useState(12);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile to disable heavy 3D effects
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- 1. THE PARTICLE SYSTEM ---
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

  // --- 2. MOUSE TILT EFFECT (Disabled on mobile) ---
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // --- 3. REALISTIC DATA SIMULATION ---
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemLoad(prev => Math.min(100, Math.max(5, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // --- 4. PROFESSIONAL DATASETS ---
  const sysStats = [
    { label: 'CPU', val: systemLoad, max: 'CORE_1' },
    { label: 'MEM', val: 42, max: '32GB' },
    { label: 'NET', val: 88, max: '1GBps' },
    { label: 'STO', val: 24, max: '4TB' }
  ];

  const adminPermissions = [
    { id: 1, name: "ROOT_ACCESS", lv: "FULL", desc: "Unrestricted system modifications.", href:"#" },
    { id: 2, name: "USER_MGMT", lv: "READ_WRITE", desc: "Create, delete, and modify client orgs.", href:"/manage-clients" },
    { id: 3, name: "DB_ADMIN", lv: "SUDO", desc: "Direct access to PostgreSQL clusters.", href:"#" },
    { id: 4, name: "AUDIT_LOGS", lv: "VIEW", desc: "View global forensic activity.", href:"/client-logs" }
  ];

  const systemLogs = [
    `[${new Date().toLocaleTimeString()}] ADMIN_SESSION_INITIATED`,
    `[AUTH] IDENTITY_VERIFIED: ${user?.primaryEmailAddress?.emailAddress || 'ADMIN'}`,
    `[SYSTEM] CONNECTED_TO_NODE: HYDERABAD_PRIMARY`,
    `[DB] POSTGRES_CONNECTION: HEALTHY (45ms)`,
    `[SECURITY] TLS_1.3_HANDSHAKE_COMPLETE`,
    `[AUDIT] WAITING_FOR_INPUT...`
  ];

  if (!isLoaded) return null;

  return (
    <div className={`zenith-root ${isPoweringDown ? 'power-down' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: ZENITH_STYLES }} />
      <canvas ref={canvasRef} className="particle-canvas" />
      
      {/* BACKGROUND LAYERS */}
      <div className="bg-layers">
        <div className="vignette" />
        <div className="grain-overlay" />
        <div className="nebula-glow" style={{ transform: isMobile ? 'none' : `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }} />
        <div className="floating-glyphs">VOLTGUARD // SYSTEM_ADMIN // SECURE_SHELL</div>
      </div>

      {/* MAIN STAGE */}
      <main className="zenith-stage" style={{ transform: isMobile ? 'none' : `rotateY(${mousePos.x * 0.04}deg) rotateX(${-mousePos.y * 0.04}deg)` }}>
        
        {/* LEFT: ADMIN IDENTITY */}
        <section className="identity-flank">
          <div className="typography-block">
            <div className="rank-strip">SYSTEM_ADMINISTRATOR // LEVEL_5</div>
            <h1 className="mega-name">
              {user?.firstName?.toUpperCase() || 'ADMIN'}
            </h1>
            <h2 className="surname">{user?.lastName?.toUpperCase() || 'USER'}</h2>
            
            <div className="bio-container">
              <div className="bio-bracket top" />
              <p className="lore-para">
                Primary architect for the VoltGuard Forensic Platform. 
                Responsible for global grid integrity, client onboarding, and ML model deployment.
              </p>
              <div className="bio-bracket bottom" />
            </div>
          </div>

          <div className="stats-matrix">
            <div className="panel-tag">SERVER_TELEMETRY</div>
            {sysStats.map(stat => (
              <div key={stat.label} className="matrix-item">
                <div className="m-label">{stat.label}</div>
                <div className="m-bar"><div className="m-fill" style={{width: `${stat.val}%`}} /></div>
                <div className="m-val">{stat.max}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CENTER: AVATAR CORE */}
        <section className="nova-core-section">
          <div className="circular-orb-wrapper">
            <div className="orb-ring ring-1" />
            <div className="orb-ring ring-2" />
            <div className="orb-ring ring-3" />
            
            <div className="main-circle-avatar">
              <img src={user?.imageUrl || '/default-avatar.png'} alt="Profile" />
              <div className="avatar-scanline" />
            </div>

            <div className="status-orbit">
              <div className="orb-bit s1"><Database size={12} /></div>
              <div className="orb-bit s2"><Shield size={12} /></div>
              <div className="orb-bit s3"><Activity size={12} /></div>
              <div className="orb-bit s4"><Fingerprint size={12} /></div>
            </div>
          </div>

          <div className="sync-status">
            <div className="sync-label">PLATFORM_HEALTH</div>
            <div className="sync-val">OPTIMAL</div>
            <div className="sync-wave">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="wave-segment" />)}
            </div>
          </div>
        </section>

        {/* RIGHT: PROFESSIONAL MODULES */}
        <section className="modules-flank">
          
          {/* PERMISSIONS PANEL */}
          <div className="module-panel">
            <div className="panel-header">
              <Lock size={14} /> 
              <span>ACTIVE_PERMISSIONS</span>
              <div className="header-line" />
            </div>
            <div className="skill-grid">
              {adminPermissions.map(perm => (
                <Link key={perm.id} href={perm.href} className="skill-hex-card clickable-card">
                  <div className="hex-top">
                    <strong>{perm.name}</strong>
                    <span className="lvl-badge">{perm.lv}</span>
                  </div>
                  <p>{perm.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          

          

        </section>
      </main>

      {/* FOOTER */}
      <footer className="zenith-footer">
        <div className="footer-left">
          <div className="pill-tag"><Globe size={10} /> HYDERABAD_HQ</div>
          <div className="pill-tag"><Server size={10} /> PROD_ENV</div>
          <div className="pill-tag desktop-only"><Wifi size={10} /> LOW_LATENCY</div>
        </div>
        
        <div className="footer-right">
          <SignOutButton>
            <button className="shutdown-trigger" onClick={() => setIsPoweringDown(true)}>
              <Power size={18} />
            </button>
          </SignOutButton>
        </div>
      </footer>

    </div>
  );
};

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

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: #fff; font-family: 'Space Grotesk', sans-serif; perspective: 1500px; overflow-x: hidden; }

  /* Changed from 100vh to min-height to allow scrolling on mobile, added padding-top to clear global navbar */
  .zenith-root { min-height: 100vh; width: 100vw; display: flex; flex-direction: column; position: relative; transition: filter 1s, transform 1.5s; padding-top: 80px; }
  .zenith-root.power-down { filter: brightness(0) blur(40px); transform: scale(0.9); }
  
  .particle-canvas { position: fixed; inset: 0; z-index: -2; opacity: 0.6; }
  .bg-layers { position: fixed; inset: 0; z-index: -3; }
  .vignette { position: fixed; inset: 0; background: radial-gradient(circle, transparent 30%, #000 100%); }
  .grain-overlay { position: fixed; inset: 0; background: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.05; pointer-events: none; mix-blend-mode: overlay; }
  .nebula-glow { position: fixed; width: 1000px; height: 1000px; background: radial-gradient(circle, rgba(139, 0, 255, 0.12) 0%, transparent 70%); filter: blur(120px); top: -20%; left: -10%; transition: transform 0.15s ease-out; }
  .floating-glyphs { position: fixed; top: 15%; left: -10%; font-family: 'Syncopate'; font-size: 12vw; opacity: 0.03; white-space: nowrap; pointer-events: none; letter-spacing: -10px; }

  /* MAIN STAGE */
  .zenith-stage { flex: 1; display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 40px; padding: 40px; transform-style: preserve-3d; z-index: 10; }

  .identity-flank { display: flex; flex-direction: column; justify-content: center; transform: translateZ(60px); }
  .rank-strip { color: var(--pink); font-size: 10px; font-weight: 900; letter-spacing: 4px; margin-bottom: 10px; text-shadow: var(--glow); }
  .mega-name { font-family: 'Syncopate', sans-serif; font-size: 5vw; line-height: 0.8; margin-bottom: 5px; letter-spacing: -4px; color: #fff; max-width: 100%; word-wrap: break-word;}
  .surname { font-family: 'Syncopate'; font-size: 24px; color: var(--violet); opacity: 0.6; margin-bottom: 30px; }
  
  .bio-container { position: relative; padding: 20px; margin-bottom: 40px; }
  .bio-bracket { position: absolute; width: 30px; height: 30px; border: 2px solid var(--border); }
  .bio-bracket.top { top: 0; left: 0; border-right: none; border-bottom: none; }
  .bio-bracket.bottom { bottom: 0; right: 0; border-left: none; border-top: none; }
  .lore-para { font-size: 13px; color: #888; line-height: 1.6; font-weight: 400; max-width: 400px; }

  .panel-tag { font-size: 9px; font-weight: 900; color: #444; margin-bottom: 10px; letter-spacing: 2px; }
  .stats-matrix { display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 300px; }
  .matrix-item { display: flex; align-items: center; gap: 15px; }
  .m-label { font-size: 10px; font-weight: 900; width: 40px; color: var(--cyan); letter-spacing: 1px; }
  .m-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; position: relative; overflow: hidden; }
  .m-fill { height: 100%; background: linear-gradient(90deg, var(--violet), var(--pink)); box-shadow: 0 0 15px var(--pink); transition: 1s ease; }
  .m-val { font-family: 'JetBrains Mono'; font-size: 11px; color: #555; width: 50px; text-align: right; }

  /* CENTER */
  .nova-core-section { display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateZ(100px); }
  .circular-orb-wrapper { width: 380px; height: 380px; position: relative; display: flex; align-items: center; justify-content: center; }
  .orb-ring { position: absolute; border-radius: 50%; border: 1px solid var(--pink); opacity: 0.15; }
  .ring-1 { inset: -20px; border-style: dashed; animation: rotate 30s linear infinite; }
  .ring-2 { inset: 15px; border: 1px double var(--cyan); opacity: 0.1; animation: rotate 20s linear infinite reverse; }
  .ring-3 { inset: -45px; border-style: dotted; opacity: 0.05; animation: rotate 40s linear infinite; }

  .main-circle-avatar { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 8px solid var(--glass); position: relative; z-index: 10; box-shadow: 0 0 60px rgba(0,0,0,0.8); }
  .main-circle-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-scanline { position: absolute; inset: 0; background: linear-gradient(transparent, rgba(255,0,255,0.1), transparent); height: 20%; animation: scan 4s linear infinite; }

  .status-orbit { position: absolute; inset: 0; z-index: 20; animation: rotate 20s linear infinite; }
  .orb-bit { position: absolute; width: 30px; height: 30px; background: #000; border: 1px solid var(--pink); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--pink); box-shadow: 0 0 15px var(--pink); transition: 0.3s; }
  .orb-bit:hover { transform: scale(1.2); color: #fff; background: var(--pink); }
  .s1 { top: 0; left: 50%; transform: translateX(-50%); }
  .s2 { bottom: 20%; left: 8%; }
  .s3 { bottom: 20%; right: 8%; }
  .s4 { top: 25%; left: -5%; }

  .sync-status { margin-top: 50px; text-align: center; }
  .sync-label { font-size: 10px; letter-spacing: 3px; color: var(--cyan); margin-bottom: 5px; font-weight: 700; }
  .sync-val { font-family: 'Syncopate'; font-size: 32px; color: #fff; text-shadow: 0 0 20px var(--cyan); }
  .sync-wave { display: flex; gap: 6px; justify-content: center; margin-top: 10px; }
  .wave-segment { width: 12px; height: 3px; background: #222; border-radius: 2px; }
  .wave-segment:nth-child(odd) { animation: pulse 2s infinite; background: var(--pink); }

  /* RIGHT */
  .modules-flank { display: flex; flex-direction: column; gap: 25px; justify-content: center; transform: translateZ(60px); }
  .module-panel { background: var(--glass); border: 1px solid var(--border); border-radius: 12px; padding: 25px; backdrop-filter: blur(20px); border-left: 3px solid var(--border); }
  .panel-header { font-size: 10px; font-weight: 900; color: var(--pink); letter-spacing: 2px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .header-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }

  .skill-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
  .skill-hex-card { background: rgba(0,0,0,0.4); padding: 15px; border-radius: 8px; border: 1px solid var(--border); transition: 0.3s; }
  .skill-hex-card:hover { border-color: var(--pink); background: rgba(255,0,255,0.05); }
  .hex-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .hex-top strong { font-size: 11px; color: var(--pink); letter-spacing: 1px; }
  .lvl-badge { font-size: 9px; font-family: 'JetBrains Mono'; background: #000; padding: 2px 5px; border-radius: 3px; color: var(--cyan); }
  .skill-hex-card p { font-size: 10px; color: #777; line-height: 1.4; margin: 0; }

  .log-scroll { height: 120px; overflow: hidden; font-family: 'JetBrains Mono'; font-size: 10px; color: #555; display: flex; flex-direction: column; gap: 8px; border-left: 2px solid #111; padding-left: 15px; }
  .log-line.cursor { animation: blink 0.8s infinite; color: var(--pink); font-weight: 700; }

  .aesthetic-sidebar { position: fixed; right: 30px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 30px; align-items: flex-end; z-index: 100; }
  .side-tab { writing-mode: vertical-lr; font-size: 10px; font-weight: 900; letter-spacing: 4px; color: #333; cursor: pointer; transition: 0.3s; padding: 10px 0; border-right: 2px solid transparent; }
  .side-tab:hover { color: #888; }
  .side-tab.active { color: var(--pink); border-right: 3px solid var(--pink); text-shadow: var(--glow); transform: translateX(-3px); }

  .zenith-footer { height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-top: 1px solid var(--border); background: rgba(0,0,0,0.4); margin-top: auto; z-index: 10; position: relative;}
  .pill-tag { font-size: 10px; background: rgba(255,0,255,0.03); border: 1px solid var(--border); padding: 5px 15px; border-radius: 50px; color: #666; display: flex; align-items: center; gap: 8px; margin-right: 15px; }
  
  .shutdown-trigger { background: none; border: 2px solid #ff3e3e; color: #ff3e3e; padding: 10px; border-radius: 50%; cursor: pointer; transition: 0.3s; }
  .shutdown-trigger:hover { background: #ff3e3e; color: #fff; box-shadow: 0 0 20px #ff3e3e; transform: rotate(90deg); }


  @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes scan { from { top: -30%; } to { top: 110%; } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

  /* --- RESPONSIVE MEDIA QUERIES --- */
  @media (max-width: 1200px) {
    .zenith-stage {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 60px;
    }
    
    .identity-flank, .nova-core-section, .modules-flank {
      transform: none !important;
      align-items: center;
    }

    .bio-container { max-width: 100%; margin: 0 auto 40px; }
    .mega-name { font-size: 48px; }
    
    .circular-orb-wrapper { width: 300px; height: 300px; margin: 0 auto; }
    
    .module-panel { width: 100%; max-width: 500px; margin: 0 auto; text-align: left;}
    
    .aesthetic-sidebar { display: none; }
    
    .footer-left { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
    .pill-tag { margin-right: 0; }
  }

  @media (max-width: 768px) {
    .zenith-stage { padding: 20px; }
    .circular-orb-wrapper { width: 250px; height: 250px; }
    .mega-name { font-size: 36px; }
    .desktop-only { display: none !important; }
  }
`;