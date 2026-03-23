"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useUser, SignOutButton, UserProfile } from "@clerk/nextjs";
import { 
  Lock, Terminal, Database, Shield, Activity, 
  Fingerprint, Globe, Power, Server, Wifi 
} from 'lucide-react';
import Link from 'next/link';

/**
 * MODULE: ADMIN_PROFILE_V1
 * STYLE: SUDARSHAN_CORE_PRESERVED
 * CONTENT: PROFESSIONAL_ENTERPRISE
 */

export default function AdminProfile() {
  const { user, isLoaded } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'ACCOUNT'>('SYSTEM');
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

  // --- 1. HIGH-SPEED TELEMETRY DATA STREAM ---
  useEffect(() => {
    if (activeTab !== 'SYSTEM') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 30 + 10,
      speedY: Math.random() * 5 + 3,
      opacity: Math.random() * 0.3
    });

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 100; i++) particles.push(createParticle());
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speedY;
        if (p.y > canvas.height) { 
            p.y = -p.length; 
            p.x = Math.random() * canvas.width; 
        }
        // Admin gets the purple data streams
        ctx.fillStyle = `rgba(139, 0, 255, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, 2, p.length);
      });
      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationId);
    };
  }, [activeTab]);

  // --- 2. MOUSE TILT EFFECT (Disabled on mobile) ---
  useEffect(() => {
    if (isMobile || activeTab !== 'SYSTEM') return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, activeTab]);

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

  if (!isLoaded) return null;

  return (
    <div className={`sudarshan-root ${isPoweringDown ? 'power-down' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: SUDARSHAN_STYLES }} />
      
      {/* TOGGLE BAR */}
      <div className="w-full flex justify-center pb-4 z-50 relative">
        <div className="bg-black/50 border border-white/10 p-1 rounded-lg inline-flex gap-1 backdrop-blur-md shadow-2xl">
          <button 
            onClick={() => setActiveTab('SYSTEM')}
            className={`px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest rounded-md transition-all ${
              activeTab === 'SYSTEM' 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_15px_rgba(139,0,255,0.3)]' 
              : 'text-white/40 hover:text-white/80 border border-transparent'
            }`}
          >
            SYSTEM_TELEMETRY
          </button>
          <button 
            onClick={() => setActiveTab('ACCOUNT')}
            className={`px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest rounded-md transition-all ${
              activeTab === 'ACCOUNT' 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
              : 'text-white/40 hover:text-white/80 border border-transparent'
            }`}
          >
            ACCOUNT_SECURITY
          </button>
        </div>
      </div>

      {activeTab === 'ACCOUNT' ? (
        // ================= CLERK ACCOUNT TAB =================
        <div className="flex-1 flex justify-center pt-10 px-4 relative z-40 pb-20">
          <UserProfile 
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full max-w-4xl font-sans",
                card: "bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md",
                headerTitle: "text-white font-black",
                headerSubtitle: "text-white/60",
              }
            }}
          />
        </div>
      ) : (
        // ================= SCI-FI SYSTEM TAB =================
        <>
          <canvas ref={canvasRef} className="particle-canvas" />
          
          {/* BACKGROUND LAYERS */}
          <div className="bg-layers">
            <div className="vignette" />
            <div className="grain-overlay" />
            <div className="nebula-glow" style={{ transform: isMobile ? 'none' : `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }} />
            <div className="floating-glyphs">SUDARSHAN CORE // SYSTEM_ADMIN // SECURE_SHELL</div>
          </div>

          {/* MAIN STAGE */}
          <main className="sudarshan-stage" style={{ transform: isMobile ? 'none' : `rotateY(${mousePos.x * 0.04}deg) rotateX(${-mousePos.y * 0.04}deg)` }}>
            
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
                    Primary architect for the Sudarshan Forensic Platform. 
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
                <div className="chakra-ring ring-1" />
                <div className="chakra-ring ring-2" />
                <div className="chakra-ring ring-3" />
                
                <div className="main-circle-avatar">
                  <img src={user?.imageUrl || '/default-avatar.png'} alt="Profile" />
                  <div className="avatar-scanline" />
                </div>

                <div className="status-orbit">
                  <div className="orb-bit s1"><Database size={14} /></div>
                  <div className="orb-bit s2"><Shield size={14} /></div>
                  <div className="orb-bit s3"><Activity size={14} /></div>
                  <div className="orb-bit s4"><Fingerprint size={14} /></div>
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
        </>
      )}

      {/* FOOTER */}
      <footer className="sudarshan-footer mt-auto">
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
}

const SUDARSHAN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --pink: #ff00ff;
    --violet: #a53afd;
    --cyan: #00ffff;
    --bg: #030105;
    --glass: rgba(15, 5, 25, 0.8);
    --border: rgba(0, 242, 255, 0.15);
    --glow: 0 0 25px rgba(0, 242, 255, 0.4);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: #fff; font-family: 'Space Grotesk', sans-serif; perspective: 1500px; overflow-x: hidden; }

  .sudarshan-root { min-height: 100vh; width: 100vw; display: flex; flex-direction: column; position: relative; transition: filter 1s, transform 1.5s; padding-top: 80px; }
  .sudarshan-root.power-down { filter: brightness(0) blur(40px); transform: scale(0.9); }
  
  .particle-canvas { position: fixed; inset: 0; z-index: -2; opacity: 0.8; }
  .bg-layers { position: fixed; inset: 0; z-index: -3; }
  .vignette { position: fixed; inset: 0; background: radial-gradient(circle, transparent 30%, #000 100%); }
  .grain-overlay { position: fixed; inset: 0; background: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.05; pointer-events: none; mix-blend-mode: overlay; }
  .nebula-glow { position: fixed; width: 1000px; height: 1000px; background: radial-gradient(circle, rgba(139, 0, 255, 0.12) 0%, transparent 70%); filter: blur(120px); top: -20%; left: -10%; transition: transform 0.15s ease-out; }
  .floating-glyphs { position: fixed; top: 15%; left: -10%; font-family: 'Syncopate'; font-size: 12vw; opacity: 0.03; white-space: nowrap; pointer-events: none; letter-spacing: -10px; }

  /* MAIN STAGE */
  .sudarshan-stage { flex: 1; display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 40px; padding: 40px; transform-style: preserve-3d; z-index: 10; }

  .identity-flank { display: flex; flex-direction: column; justify-content: center; transform: translateZ(60px); }
  .rank-strip { color: var(--violet); font-size: 10px; font-weight: 900; letter-spacing: 4px; margin-bottom: 10px; text-shadow: var(--glow); }
  .mega-name { font-family: 'Syncopate', sans-serif; font-size: 5vw; line-height: 0.8; margin-bottom: 5px; letter-spacing: -4px; color: #fff; max-width: 100%; word-wrap: break-word;}
  .surname { font-family: 'Syncopate'; font-size: 24px; color: var(--violet); opacity: 0.8; margin-bottom: 30px; text-shadow: 0 0 10px var(--violet); }
  
  .bio-container { position: relative; padding: 20px; margin-bottom: 40px; }
  .bio-bracket { position: absolute; width: 30px; height: 30px; border: 2px solid var(--border); }
  .bio-bracket.top { top: 0; left: 0; border-right: none; border-bottom: none; }
  .bio-bracket.bottom { bottom: 0; right: 0; border-left: none; border-top: none; }
  .lore-para { font-size: 13px; color: #888; line-height: 1.6; font-weight: 400; max-width: 400px; }

  .panel-tag { font-size: 9px; font-weight: 900; color: #444; margin-bottom: 10px; letter-spacing: 2px; }
  .stats-matrix { display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 300px; }
  .matrix-item { display: flex; align-items: center; gap: 15px; }
  .m-label { font-size: 10px; font-weight: 900; width: 40px; color: var(--violet); letter-spacing: 1px; }
  .m-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; position: relative; overflow: hidden; }
  .m-fill { height: 100%; background: linear-gradient(90deg, var(--violet), var(--cyan)); box-shadow: 0 0 15px var(--violet); transition: 1s ease; }
  .m-val { font-family: 'JetBrains Mono'; font-size: 11px; color: #555; width: 50px; text-align: right; }

  /* CENTER - ADMIN SUDARSHAN CHAKRA CORE */
  .nova-core-section { display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateZ(100px); }
  .circular-orb-wrapper { width: 380px; height: 380px; position: relative; display: flex; align-items: center; justify-content: center; }
  
  .chakra-ring { position: absolute; border-radius: 50%; }
  
  /* Outer weapon disc */
  .ring-1 { 
    width: 100%; height: 100%; 
    
    border: 4px dashed rgba(139, 0, 255, 0.8); 
    box-shadow: 0 0 50px rgba(139, 0, 255, 0.3), inset 0 0 25px rgba(139, 0, 255, 0.2);
    animation: spin 3s linear infinite; 
  }
  
  /* Mid containment field */
  .ring-2 { 
    width: 82%; height: 82%; 
    border: 2px solid rgba(0, 242, 255, 0.6); 
    border-top-color: transparent; border-bottom-color: transparent;
    box-shadow: 0 0 60px rgba(0, 242, 255, 0.3), inset 0 0 30px rgba(0, 242, 255, 0.2);
    animation: spin-rev 2s linear infinite; 
  }
  
  /* Inner high-velocity track */
  .ring-3 { 
    width: 65%; height: 65%; 
    border: 3px dashed var(--violet); 
    box-shadow: 0 0 40px var(--violet), inset 0 0 15px var(--violet);
    animation: spin 1.5s linear infinite; 
  }

  /* Core Avatar */
  .main-circle-avatar { 
    width: 55%; height: 55%; 
    border-radius: 50%; overflow: hidden; 
    border: 4px solid var(--cyan); position: relative; z-index: 10; 
    box-shadow: 0 0 60px rgba(0,242,255,0.5); 
  }
  .main-circle-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-scanline { position: absolute; inset: 0; background: linear-gradient(transparent, rgba(139, 0, 255, 0.2), transparent); height: 20%; animation: scan 4s linear infinite; }

  .status-orbit { position: absolute; inset: 0; z-index: 20; animation: spin 20s linear infinite; }
  .orb-bit { position: absolute; width: 32px; height: 32px; background: #000; border: 1px solid var(--violet); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--violet); box-shadow: 0 0 15px var(--violet); transition: 0.3s; }
  .orb-bit:hover { transform: scale(1.2); color: #000; background: var(--violet); }
  .s1 { top: -2%; left: 50%; transform: translateX(-50%); }
  .s2 { bottom: 18%; left: 8%; }
  .s3 { bottom: 18%; right: 8%; }
  .s4 { top: 22%; left: -2%; }

  .sync-status { margin-top: 50px; text-align: center; }
  .sync-label { font-size: 10px; letter-spacing: 3px; color: var(--violet); margin-bottom: 5px; font-weight: 700; }
  .sync-val { font-family: 'Syncopate'; font-size: 32px; color: #fff; text-shadow: 0 0 20px var(--violet); }
  .sync-wave { display: flex; gap: 6px; justify-content: center; margin-top: 10px; }
  .wave-segment { width: 12px; height: 3px; background: #222; border-radius: 2px; }
  .wave-segment:nth-child(odd) { animation: pulse 2s infinite; background: var(--violet); }

  /* RIGHT */
  .modules-flank { display: flex; flex-direction: column; gap: 25px; justify-content: center; transform: translateZ(60px); }
  .module-panel { background: var(--glass); border: 1px solid var(--border); border-radius: 12px; padding: 25px; backdrop-filter: blur(20px); border-left: 3px solid var(--border); }
  .panel-header { font-size: 10px; font-weight: 900; color: var(--violet); letter-spacing: 2px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .header-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }

  .skill-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
  .skill-hex-card { background: rgba(0,0,0,0.4); padding: 15px; border-radius: 8px; border: 1px solid rgba(139, 0, 255, 0.2); transition: 0.3s; }
  .skill-hex-card:hover { border-color: var(--violet); background: rgba(139, 0, 255, 0.2); box-shadow: 0 0 15px rgba(139, 0, 255, 0.6);}
  .hex-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .hex-top strong { font-size: 11px; color: var(--violet); letter-spacing: 1px; }
  .lvl-badge { font-size: 9px; font-family: 'JetBrains Mono'; background: #000; padding: 2px 5px; border-radius: 3px; color: var(--violet); border: 1px solid var(--violet);}
  .skill-hex-card p { font-size: 10px; color: #777; line-height: 1.4; margin: 0; }

  .sudarshan-footer { height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-top: 1px solid var(--border); background: rgba(0,0,0,0.4); margin-top: auto; z-index: 10; position: relative;}
  .pill-tag { font-size: 10px; background: rgba(0,242,255,0.03); border: 1px solid var(--border); padding: 5px 15px; border-radius: 50px; color: #666; display: flex; align-items: center; gap: 8px; margin-right: 15px; font-weight: 700; }
  
  .shutdown-trigger { background: none; border: 2px solid #ff3e3e; color: #ff3e3e; padding: 10px; border-radius: 50%; cursor: pointer; transition: 0.3s; }
  .shutdown-trigger:hover { background: #ff3e3e; color: #fff; box-shadow: 0 0 20px #ff3e3e; transform: rotate(90deg); }

  @keyframes spin { 100% { transform: rotate(360deg); } }
  @keyframes spin-rev { 100% { transform: rotate(-360deg); } }
  @keyframes scan { from { top: -30%; } to { top: 110%; } }
  @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

  /* --- RESPONSIVE MEDIA QUERIES --- */
  @media (max-width: 1200px) {
    .sudarshan-stage { grid-template-columns: 1fr; text-align: center; gap: 60px; }
    .identity-flank, .nova-core-section, .modules-flank { transform: none !important; align-items: center; }
    .bio-container { max-width: 100%; margin: 0 auto 40px; }
    .mega-name { font-size: 48px; }
    .circular-orb-wrapper { width: 300px; height: 300px; margin: 0 auto; }
    .module-panel { width: 100%; max-width: 500px; margin: 0 auto; text-align: left;}
    .footer-left { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
    .pill-tag { margin-right: 0; }
  }

  @media (max-width: 768px) {
    .sudarshan-stage { padding: 20px; }
    .circular-orb-wrapper { width: 250px; height: 250px; }
    .mega-name { font-size: 36px; }
    .desktop-only { display: none !important; }
  }
`;