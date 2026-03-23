"use client";

import React, { useState, useEffect, useRef, use } from 'react';
import { useUser, SignOutButton, UserProfile } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { 
  Settings, Key, Users, CreditCard, Shield, Activity, 
  Fingerprint, Globe, Power, Server, Wifi, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

export default function ClientSettings({ params }: { params: Promise<{ orgSlug: string }> }) {
  const resolvedParams = use(params);
  const orgSlug = resolvedParams.orgSlug || "CLIENT_ORG";

  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPoweringDown, setIsPoweringDown] = useState(false);
  const [nodeLoad, setNodeLoad] = useState(12);
  const [isMobile, setIsMobile] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'ACCOUNT'>('SYSTEM');

  // Detect impersonation ONLY to lock down the Clerk profile page
  const isOwner = user?.primaryEmailAddress?.emailAddress === "pradhyumnavojjala@gmail.com" || user?.primaryEmailAddress?.emailAddress === "kavithahaimakidambi0613@gmail.com";
  const pathSegment = pathname?.split('/')[1] || '';
  const ownerRoutes = ['manage-clients', 'client-logs', 'profile', 'map', '']; 
  const isImpersonating = isOwner && pathSegment && !ownerRoutes.includes(pathSegment);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      length: Math.random() * 20 + 10,
      speedY: Math.random() * 4 + 2,
      opacity: Math.random() * 0.4
    });

    const init = () => {
        const rect = canvas.parentElement?.getBoundingClientRect();
        canvas.width = rect?.width || window.innerWidth;
        canvas.height = rect?.height || window.innerHeight;
        
        particles = []; 
        for (let i = 0; i < 80; i++) particles.push(createParticle());
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
        ctx.fillStyle = `rgba(0, 242, 255, ${p.opacity})`;
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

  useEffect(() => {
    const timer = setInterval(() => {
      setNodeLoad(prev => Math.min(100, Math.max(5, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const nodeStats = [
    { label: 'QTA', val: 65, max: '10k/MO' },
    { label: 'AGT', val: 100, max: '12/12' },
    { label: 'RSP', val: 15, max: '42ms' },
    { label: 'LOD', val: nodeLoad, max: 'NODE' }
  ];

  const clientModules = [
    { id: 1, name: "ORG_PREFERENCES", icon: Settings, desc: "Configure brand identity and global rules.", href:`#` },
    { id: 2, name: "TEAM_ACCESS", icon: Users, desc: "Manage operatives and role assignments.", href:`#` },
    { id: 3, name: "API_GATEWAY", icon: Key, desc: "Generate and revoke integration keys.", href:`#` },
    { id: 4, name: "SUBSCRIPTION", icon: CreditCard, desc: "Billing tier and resource allocation.", href:`#` }
  ];

  if (!isLoaded) return null;

  return (
    <div className={`sudarshan-root ${isPoweringDown ? 'power-down' : ''} min-h-screen bg-[#030105] flex flex-col`}>
      <style dangerouslySetInnerHTML={{ __html: SUDARSHAN_STYLES }} />
      
      {/* TOGGLE BAR */}
      <div className="w-full flex justify-center pt-8 pb-4 z-50 relative">
        <div className="bg-black/50 border border-white/10 p-1 rounded-lg inline-flex gap-1 backdrop-blur-md shadow-2xl">
          <button 
            onClick={() => setActiveTab('SYSTEM')}
            className={`px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest rounded-md transition-all ${
              activeTab === 'SYSTEM' 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
              : 'text-white/40 hover:text-white/80 border border-transparent'
            }`}
          >
            SYSTEM_TELEMETRY
          </button>
          <button 
            onClick={() => setActiveTab('ACCOUNT')}
            className={`px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest rounded-md transition-all ${
              activeTab === 'ACCOUNT' 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_15px_rgba(123,0,255,0.3)]' 
              : 'text-white/40 hover:text-white/80 border border-transparent'
            }`}
          >
            ACCOUNT_SECURITY
          </button>
        </div>
      </div>

      {activeTab === 'ACCOUNT' ? (
        <div className="flex-1 flex justify-center pt-10 px-4 relative z-40 pb-20">
          {isImpersonating ? (
            <div className="max-w-2xl w-full p-10 border border-purple-500/30 bg-purple-500/10 rounded-lg text-center h-fit backdrop-blur-md">
              <ShieldAlert className="text-purple-400 mx-auto mb-6" size={56} />
              <h2 className="text-3xl font-black text-white mb-3 tracking-wide font-sans">SECURITY LOCK ENGAGED</h2>
              <p className="text-purple-300/80 text-sm font-mono tracking-wider leading-relaxed">
                Profile modification is disabled while viewing a tenant workspace to prevent accidental modifications to the master administrative account.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} className="particle-canvas" />
          
          <div className="bg-layers">
            <div className="vignette" />
            <div className="grain-overlay" />
            <div className="nebula-glow" style={{ transform: isMobile ? 'none' : `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }} />
            <div className="floating-glyphs">{orgSlug.toUpperCase()} // LOCAL_NODE // SECURE</div>
          </div>

          <main className="sudarshan-stage flex-1" style={{ transform: isMobile ? 'none' : `rotateY(${mousePos.x * 0.04}deg) rotateX(${-mousePos.y * 0.04}deg)` }}>
            
            <section className="identity-flank">
              <div className="typography-block">
                <div className="rank-strip">AUTHORIZED_REPRESENTATIVE // {orgSlug.toUpperCase()}</div>
                <h1 className="mega-name">{user?.firstName?.toUpperCase() || 'CLIENT'}</h1>
                <h2 className="surname">{user?.lastName?.toUpperCase() || 'NODE_ADMIN'}</h2>
                
                <div className="bio-container">
                  <div className="bio-bracket top" />
                  <p className="lore-para">
                    Local administrator for the {orgSlug} organization node. Managing forensic grid access, team permissions, and localized telemetry data.
                  </p>
                  <div className="bio-bracket bottom" />
                </div>
              </div>

              <div className="stats-matrix">
                <div className="panel-tag">LOCAL_NODE_TELEMETRY</div>
                {nodeStats.map(stat => (
                  <div key={stat.label} className="matrix-item">
                    <div className="m-label">{stat.label}</div>
                    <div className="m-bar"><div className="m-fill" style={{width: `${stat.val}%`}} /></div>
                    <div className="m-val">{stat.max}</div>
                  </div>
                ))}
              </div>
            </section>

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
                  <div className="orb-bit s1"><Settings size={12} /></div>
                  <div className="orb-bit s2"><Shield size={12} /></div>
                  <div className="orb-bit s3"><Activity size={12} /></div>
                  <div className="orb-bit s4"><Fingerprint size={12} /></div>
                </div>
              </div>

              <div className="sync-status">
                <div className="sync-label">GRID_CONNECTION</div>
                <div className="sync-val text-cyan-400">STABLE</div>
                <div className="sync-wave">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="wave-segment" />)}
                </div>
              </div>
            </section>

            <section className="modules-flank">
              <div className="module-panel">
                <div className="panel-header">
                  <Shield size={14} /> 
                  <span>ORGANIZATION_SETTINGS</span>
                  <div className="header-line" />
                </div>
                <div className="skill-grid">
                  {clientModules.map(mod => {
                    const Icon = mod.icon;
                    return (
                      <Link key={mod.id} href={mod.href} className="skill-hex-card clickable-card">
                        <div className="hex-top">
                          <div className="flex items-center gap-2">
                            <Icon size={12} className="mod-icon" />
                            <strong>{mod.name}</strong>
                          </div>
                        </div>
                        <p>{mod.desc}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>

          <footer className="sudarshan-footer mt-auto">
            <div className="footer-left">
              <div className="pill-tag"><Globe size={10} /> {orgSlug.toUpperCase()}_ENV</div>
              <div className="pill-tag"><Server size={10} /> SECURE_TUNNEL</div>
              <div className="pill-tag desktop-only"><Wifi size={10} /> ENCRYPTED</div>
            </div>
            
            <div className="footer-right">
              <SignOutButton>
                <button className="shutdown-trigger" onClick={() => setIsPoweringDown(true)}>
                  <Power size={18} />
                </button>
              </SignOutButton>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

const SUDARSHAN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --pink: #00f2ff; 
    --violet: #7b00ff;
    --cyan: #00ffff;
    --glass: rgba(5, 15, 25, 0.6);
    --border: rgba(0, 242, 255, 0.15);
    --glow: 0 0 25px rgba(0, 242, 255, 0.4);
  }

  .sudarshan-root { 
    position: relative; 
    transition: filter 1s, transform 1.5s; 
    font-family: 'Space Grotesk', sans-serif;
    color: #fff;
    perspective: 1500px;
    background: transparent;
  }
  .sudarshan-root.power-down { filter: brightness(0) blur(40px); transform: scale(0.9); }
  
  .particle-canvas { position: absolute; inset: 0; z-index: 0; opacity: 0.8; pointer-events: none; }
  .bg-layers { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
  .vignette { position: absolute; inset: 0; background: radial-gradient(circle, transparent 40%, #000 120%); }
  .grain-overlay { position: absolute; inset: 0; background: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.05; mix-blend-mode: overlay; }
  .nebula-glow { position: absolute; width: 1000px; height: 1000px; background: radial-gradient(circle, rgba(0, 242, 255, 0.08) 0%, transparent 70%); filter: blur(120px); top: -20%; left: -10%; transition: transform 0.1s ease-out; }
  .floating-glyphs { position: absolute; top: 15%; left: -5%; font-family: 'Syncopate'; font-size: 8vw; opacity: 0.03; white-space: nowrap; letter-spacing: -5px; }

  /* MAIN STAGE */
  .sudarshan-stage { 
    display: grid; 
    grid-template-columns: 1fr 1.2fr 1fr; 
    gap: 30px; 
    padding: 20px 50px 50px; 
    transform-style: preserve-3d; 
    z-index: 10; 
  }

  .identity-flank { display: flex; flex-direction: column; justify-content: center; transform: translateZ(40px); }
  .rank-strip { color: var(--pink); font-size: 10px; font-weight: 900; letter-spacing: 4px; margin-bottom: 10px; text-shadow: var(--glow); }
  .mega-name { font-family: 'Syncopate', sans-serif; font-size: clamp(2rem, 4vw, 4rem); line-height: 0.9; margin-bottom: 5px; letter-spacing: -2px; color: #fff; word-wrap: break-word;}
  .surname { font-family: 'Syncopate'; font-size: 20px; color: var(--violet); opacity: 0.8; margin-bottom: 30px; text-shadow: 0 0 10px var(--violet); }
  
  .bio-container { position: relative; padding: 15px; margin-bottom: 30px; }
  .bio-bracket { position: absolute; width: 20px; height: 20px; border: 2px solid var(--border); }
  .bio-bracket.top { top: 0; left: 0; border-right: none; border-bottom: none; }
  .bio-bracket.bottom { bottom: 0; right: 0; border-left: none; border-top: none; }
  .lore-para { font-size: 12px; color: #999; line-height: 1.6; font-weight: 400; max-width: 350px; }

  .panel-tag { font-size: 9px; font-weight: 900; color: #555; margin-bottom: 10px; letter-spacing: 2px; }
  .stats-matrix { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 280px; }
  .matrix-item { display: flex; align-items: center; gap: 10px; }
  .m-label { font-size: 10px; font-weight: 900; width: 35px; color: var(--cyan); letter-spacing: 1px; }
  .m-bar { flex: 1; height: 3px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; overflow: hidden; }
  .m-fill { height: 100%; background: linear-gradient(90deg, var(--violet), var(--pink)); box-shadow: 0 0 10px var(--pink); transition: 1s ease; }
  .m-val { font-family: 'JetBrains Mono'; font-size: 10px; color: #777; width: 45px; text-align: right; }

  /* CENTER - SUDARSHAN CHAKRA CORE */
  .nova-core-section { display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateZ(80px); }
  .circular-orb-wrapper { width: 300px; height: 300px; position: relative; display: flex; align-items: center; justify-content: center; }
  
  .chakra-ring { position: absolute; border-radius: 50%; }
  
  /* Outer weapon disc */
  .ring-1 { 
    width: 100%; height: 100%; 
    border: 4px dashed rgba(0, 242, 255, 0.6); 
    box-shadow: 0 0 40px rgba(0, 242, 255, 0.3), inset 0 0 20px rgba(0, 242, 255, 0.1);
    animation: spin 3s linear infinite; 
  }
  
  /* Mid containment field */
  .ring-2 { 
    width: 82%; height: 82%; 
    border: 2px solid rgba(123, 0, 255, 0.8); 
    border-top-color: transparent; border-bottom-color: transparent;
    box-shadow: 0 0 50px rgba(123, 0, 255, 0.4), inset 0 0 30px rgba(123, 0, 255, 0.2);
    animation: spin-rev 2s linear infinite; 
  }
  
  /* Inner high-velocity track */
  .ring-3 { 
    width: 65%; height: 65%; 
    border: 3px dashed var(--cyan); 
    box-shadow: 0 0 30px var(--cyan), inset 0 0 10px var(--cyan);
    animation: spin 1.5s linear infinite; 
  }

  /* Core Avatar */
  .main-circle-avatar { 
    width: 55%; height: 55%; 
    border-radius: 50%; overflow: hidden; 
    border: 3px solid var(--cyan); position: relative; z-index: 10; 
    box-shadow: 0 0 40px rgba(0,242,255,0.6); 
  }
  .main-circle-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-scanline { position: absolute; inset: 0; background: linear-gradient(transparent, rgba(0,242,255,0.3), transparent); height: 20%; animation: scan 3s linear infinite; }

  .status-orbit { position: absolute; inset: 0; z-index: 20; animation: spin 25s linear infinite; }
  .orb-bit { position: absolute; width: 26px; height: 26px; background: #000; border: 1px solid var(--pink); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--pink); box-shadow: 0 0 10px var(--pink); transition: 0.3s; }
  .orb-bit:hover { transform: scale(1.2); color: #000; background: var(--pink); }
  .s1 { top: -5%; left: 50%; transform: translateX(-50%); }
  .s2 { bottom: 15%; left: 5%; }
  .s3 { bottom: 15%; right: 5%; }
  .s4 { top: 20%; left: -5%; }

  .sync-status { margin-top: 40px; text-align: center; }
  .sync-label { font-size: 10px; letter-spacing: 3px; color: var(--cyan); margin-bottom: 5px; font-weight: 700; }
  .sync-val { font-family: 'Syncopate'; font-size: 24px; text-shadow: 0 0 15px var(--cyan); }
  .sync-wave { display: flex; gap: 4px; justify-content: center; margin-top: 8px; }
  .wave-segment { width: 8px; height: 2px; background: #333; border-radius: 2px; }
  .wave-segment:nth-child(odd) { animation: pulse 2s infinite; background: var(--pink); }

  /* RIGHT */
  .modules-flank { display: flex; flex-direction: column; justify-content: center; transform: translateZ(40px); }
  .module-panel { background: var(--glass); border: 1px solid var(--border); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px); border-left: 3px solid var(--border); width: 100%; }
  .panel-header { font-size: 10px; font-weight: 900; color: var(--pink); letter-spacing: 2px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
  .header-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }

  .skill-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .skill-hex-card { background: rgba(0,0,0,0.5); padding: 12px 15px; border-radius: 8px; border: 1px solid rgba(0, 242, 255, 0.1); transition: all 0.2s ease; text-decoration: none; display: block; z-index: 20; position: relative;}
  .skill-hex-card:hover { border-color: var(--pink); background: rgba(0, 242, 255, 0.05); transform: translateX(-5px); box-shadow: 0 0 15px rgba(0,242,255,0.2);}
  .hex-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .mod-icon { color: var(--pink); }
  .hex-top strong { font-size: 11px; color: #fff; letter-spacing: 1px; }
  .skill-hex-card p { font-size: 10px; color: #888; line-height: 1.4; margin: 0; }

  .sudarshan-footer { display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; border-top: 1px solid var(--border); background: rgba(0,0,0,0.3); z-index: 10; position: relative;}
  .pill-tag { font-size: 9px; background: rgba(0, 242, 255, 0.05); border: 1px solid var(--border); padding: 5px 12px; border-radius: 50px; color: #888; display: flex; align-items: center; gap: 6px; margin-right: 10px; font-weight: 700; }
  
  .shutdown-trigger { background: none; border: 1px solid #ff3e3e; color: #ff3e3e; padding: 8px; border-radius: 50%; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; z-index: 30; position: relative;}
  .shutdown-trigger:hover { background: #ff3e3e; color: #000; box-shadow: 0 0 15px #ff3e3e; transform: rotate(90deg); }

  @media (max-width: 1200px) {
    .sudarshan-stage { grid-template-columns: 1fr; text-align: center; gap: 40px; padding: 20px; }
    .identity-flank, .nova-core-section, .modules-flank { transform: none !important; align-items: center; }
    .bio-container { max-width: 100%; margin: 0 auto 30px; }
    .circular-orb-wrapper { width: 250px; height: 250px; margin: 0 auto; }
    .module-panel { max-width: 400px; margin: 0 auto; text-align: left; }
    .footer-left { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
    .pill-tag { margin-right: 0; }
  }

  @media (max-width: 768px) {
    .circular-orb-wrapper { width: 200px; height: 200px; }
    .mega-name { font-size: 32px; }
    .desktop-only { display: none !important; }
  }
`;