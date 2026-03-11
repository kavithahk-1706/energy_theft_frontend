"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import Link from 'next/link'; 
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  Activity, ArrowUpRight, Cpu, Database, 
  Server, Network, ShieldCheck,
  Search, FileBarChart, Timer, BarChart3, Target, Layers, Shield
} from 'lucide-react';

/**
 * MODULE: SUDARSHAN CORE ROOT PORTAL
 * TONE: PROFESSIONAL // NAVIGATIONAL // DYNAMIC
 */

export default function SudarshanEnterpriseMaster() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // --- ROLE DETECTION ---
  const metadata = user?.publicMetadata as { role?: string; orgSlug?: string; orgName?: string };
  const role = metadata?.role || 'user';
  const orgSlug = metadata?.orgSlug || 'demo-utility';

  const isOwner = user?.primaryEmailAddress?.emailAddress === "pradhyumnavojjala@gmail.com";
  const finalRole = isOwner ? 'owner' : role;
  
  // --- DYNAMIC CONTENT BLOCKS ---
  const heroContent = finalRole === 'owner' ? {
    badge: "GLOBAL COMMAND CENTER",
    primaryBtn: { label: "MANAGE_CLIENTS", href: "/manage-clients" },
    secondaryBtn: { label: "ADMIN_CONSOLE", href: "/profile" },
    metric1: { label: "CLIENT_LOGS", val: "900+", icon: Database, href: "/client-logs" },
    metric2: { label: "MODEL_METRICS", val: "99.6%", icon: Activity, href: "/demo-utility/metrics" }
  } : {
    // CLIENT CONTENT
    badge: `${orgSlug ? orgSlug.toUpperCase() : 'UTILITY'} GRID SECURED`,
    primaryBtn: { label: "GO_TO_DASHBOARD", href: `/${orgSlug}` },
    secondaryBtn: { label: "RUN_NEW_PREDICTION", href: `/${orgSlug}/predict` },
    metric1: { label: "RECENT_SCANS", val: "142", icon: Layers, href: `/${orgSlug}/logs` },
    metric2: { label: "MODEL_PERFORMANCE", val: "99.6%", icon: Server, href: `/${orgSlug}/model-metrics` }
  };
  
  return (
    <div className="master-root">
      <style dangerouslySetInnerHTML={{ __html: masterStyles }} />
      
      {/* HUD OVERLAY */}
      <div className="hud-overlay">
        <div className="hud-left">
          <div className="hud-metric">
            <span className="label">SYSTEM_STATUS</span>
            <span className="val text-cyan">ONLINE</span>
          </div>
        </div>
        <div className="hud-right">
          <div className="hud-metric text-right">
            <span className="label">SERVER_TIME</span>
            <span className="val font-mono">
              {mounted ? new Date().toLocaleTimeString() : "00:00:00"}
            </span>
          </div>
        </div>
      </div>

      <motion.div className="global-progress" style={{ scaleX }} />

      {/* PART 1: HERO SECTION */}
      <section className="hero-section">
        <div className="hero-grid">
          
          {/* TEXT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-stack"
          >
            
            <div className="hero-badge">
              <ShieldCheck size={12} className={finalRole === 'owner' ? "text-purple-400" : "text-cyan-400"} />
              <span>{heroContent.badge}</span>
            </div>

            <h1 className="hero-title shadow-effect">
              <p className="gradient-text">Data-Driven <br/>
              Energy Assurance.</p>
            </h1>

            <p className="hero-description gradient-text shadow-effect">
              Transform reactive inspections into proactive audits. Our <strong>Random Forest</strong> engine 
              analyzes appliance-level consumption patterns to identify irregularities 
              with <strong>99.6% precision</strong>.
            </p>

            {/* DYNAMIC ACTION BUTTONS */}
            <div className="hero-cta-group">
              <Link href={heroContent.primaryBtn.href} className="btn-primary">
                 {heroContent.primaryBtn.label}
                 <div className="btn-shimmer" />
              </Link>
              
              <Link href={heroContent.secondaryBtn.href} className="btn-secondary">
                 {heroContent.secondaryBtn.label} <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* DYNAMIC METRICS */}
            <div className="hero-metrics">
              <Link href={heroContent.metric1.href} className="m-unit hover-effect">
                <div className="m-icon"><heroContent.metric1.icon size={16} className="text-purple" /></div>
                <div>
                  <span className="m-val">{heroContent.metric1.val}</span>
                  <span className="m-lbl">{heroContent.metric1.label}</span>
                </div>
              </Link>

              <Link href={heroContent.metric2.href} className="m-unit hover-effect">
                <div className="m-icon"><heroContent.metric2.icon size={16} className="text-cyan" /></div>
                <div>
                  <span className="m-val">{heroContent.metric2.val}</span>
                  <span className="m-lbl">{heroContent.metric2.label}</span>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* VISUAL COLUMN - SUDARSHAN CHAKRA */}
          <div className="hero-visual">
            <div className="engine-viewport">
              <div className="chakra-container">
                <div className="grid-bg" />
                
                {/* LETHAL SPINNING DISCS */}
                <div className="chakra-ring ring-outer" />
                <div className="chakra-ring ring-mid" />
                <div className="chakra-ring ring-inner" />
                
                <div className="core-node">
                   <Target size={44} className="text-white drop-target" />
                   <div className="core-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PART 2: THE CHALLENGE */}
      <section id="challenge" className="challenge-section">
        <div className="section-header">
          <div className="section-tag">01 // THE_INTELLIGENCE_GAP</div>
          <h2 className="section-title">Traditional Audits Are <span className="text-purple">Obsolete.</span></h2>
          <p className="section-subtitle">
            Manual inspections and aggregate metering leave utilities blind to sophisticated tampering. 
            You cannot fix what you cannot measure.
          </p>
        </div>

        <div className="card-grid">
          <div className="tech-card">
            <div className="card-icon"><Timer size={24} className="text-purple" /></div>
            <h3>Reactive Latency</h3>
            <p>Traditional methods only flag theft months after it occurs. Real-time detection is required to stop losses at the source.</p>
          </div>
          <div className="tech-card">
            <div className="card-icon"><BarChart3 size={24} className="text-cyan" /></div>
            <h3>Aggregate Blindness</h3>
            <p>Total consumption data hides "Meter Bypassing." By analyzing granular loads (AC vs. Lighting), we expose physics violations.</p>
          </div>
          <div className="tech-card">
            <div className="card-icon"><Search size={24} className="text-white" /></div>
            <h3>Inefficient Sampling</h3>
            <p>Random field inspections waste resources. Targeted, probability-based auditing increases enforcement efficiency by 10x.</p>
          </div>
        </div>
      </section>

      {/* PART 3: THE PIPELINE */}
      <section id="architecture" className="arch-section">
        <div className="arch-inner">
          <div className="arch-layout">
            <div className="diagram-box">
              <div className="d-node start">
                <Database size={20} />
                <span>RAW_INPUT</span>
              </div>
              <div className="d-line"><div className="d-packet" /></div>
              <div className="d-node mid">
                <Network size={28} className="text-cyan" />
                <span>RF_MODEL</span>
              </div>
              <div className="d-line"><div className="d-packet delay" /></div>
              <div className="d-node end">
                <FileBarChart size={20} className="text-purple" />
                <span>AUDIT_LOG</span>
              </div>
            </div>

            <div className="arch-content">
              <h3>The Data Pipeline</h3>
              <div className="step">
                <div className="step-num">01</div>
                <div>
                  <h4>Data Ingestion & Normalization</h4>
                  <p>Consumption logs are standardized and validated against building-class profiles.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <div>
                  <h4>Structural Anomaly Detection</h4>
                  <p>Our Random Forest classifier identifies discrepancies between appliance loads that indicate tampering.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <div>
                  <h4>Sector-Level Localization</h4>
                  <p>Anomalies are aggregated by Area ID, generating high-confidence heatmaps for enforcement teams.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const masterStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@500;700&display=swap');

  :root {
    --bg: #050505;
    --card-bg: rgba(255, 255, 255, 0.03);
    --border: rgba(255, 255, 255, 0.1);
    --cyan: #00f2ff;
    --purple: #7b00ff;
    --text-main: #ffffff;
    --text-muted: #888888;
  }

  * { box-sizing: border-box; }
  body { background: var(--bg); color: var(--text-main); font-family: 'Inter', sans-serif; margin: 0; overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }

  /* HUD */
  .hud-overlay { position: fixed; inset: 0; padding: 25px; display: flex; justify-content: space-between; align-items: flex-end; pointer-events: none; z-index: 50; }
  .hud-metric { display: flex; flex-direction: column; gap: 2px; }
  .label { font-family: 'JetBrains Mono'; font-size: 10px; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; }
  .val { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; }
  .global-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; background: var(--cyan); z-index: 1000; transform-origin: 0%; }
  .text-cyan { color: var(--cyan); }
  .text-purple { color: var(--purple); }

  /* HERO SECTION */
  .hero-section { min-height: 100vh; padding-top: 120px; display: flex; align-items: center; justify-content: center; }
  .hero-grid { width: 90%; max-width: 1200px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  
  .hero-badge { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 100px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; width: fit-content; margin-bottom: 25px; }
  .hero-title { font-size: 64px; font-weight: 800; line-height: 1.1; letter-spacing: -2px; margin-bottom: 20px; }
  .shadow-effect { text-shadow: 5px 5px 10px rgba(242, 225, 225, 0.2); }
  .gradient-text { background: linear-gradient(to right, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-description { font-size: 18px; color: #fff; font-weight:bold; line-height: 1.5; width: 100%; max-width: 500px; margin-bottom: 40px; margin-left: 0; margin-right:0; }
  
  .hero-cta-group { display: flex; gap: 15px; margin-bottom: 50px; }
  .btn-primary { position: relative; background: #fff; color: #000; border: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; overflow: hidden; font-family: 'JetBrains Mono'; display: flex; align-items: center; justify-content: center; text-decoration: none;}
  .btn-shimmer { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent); animation: shimmer 3s infinite; }
  .btn-secondary { background: transparent; border: 1px solid var(--border); color: #fff; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: 'JetBrains Mono'; transition: 0.2s; text-decoration: none;}
  .btn-secondary:hover { border-color: #fff; background: rgba(255,255,255,0.05); }

  .hero-metrics { display: flex; gap: 30px; border-top: 1px solid var(--border); padding-top: 30px; }
  .m-unit { display: flex; align-items: center; gap: 15px; cursor: pointer; transition: 0.3s; padding: 10px; border-radius: 8px; text-decoration: none; }
  .m-unit:hover { background: rgba(255,255,255,0.05); }
  .m-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.03); border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); }
  .m-val { font-size: 20px; font-weight: 800; display: block; line-height: 1; color: #fff; }
  .m-lbl { font-size: 9px; color: var(--text-muted); font-family: 'JetBrains Mono'; margin-top: 4px; display: block; font-weight: 600; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.2); }

  /* VISUAL ENGINE - SUDARSHAN CHAKRA */
  .hero-visual { display: flex; justify-content: center; transform: scale(1.25); padding-top:0; padding-bottom:25%; }
  .engine-viewport { width: 400px; height: 400px; position: relative; }
  .chakra-container { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
  .grid-bg { position: absolute; inset: -50px; background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 30px 30px; opacity: 0.2; border-radius: 50%; }
  
  .chakra-ring { position: absolute; border-radius: 50%; }
  
  /* Outer weapon disc - massive cyan dashes spinning fast */
  .ring-outer { 
    width: 350px; height: 350px; 
    border: 4px dotted rgba(0, 242, 255, 0.6); 
    box-shadow: 0 0 40px rgba(0, 242, 255, 0.3), inset 0 0 20px rgba(0, 242, 255, 0.1);
    animation: spin 1s linear infinite; 
  }
  
  /* Mid containment field - solid purple reverse spin */
  .ring-mid { 
    width: 270px; height: 270px; 
    border: 2px solid rgba(123, 0, 255, 0.8); 
    border-top-color: transparent; border-bottom-color: transparent;
    box-shadow: 0 0 50px rgba(123, 0, 255, 0.4), inset 0 0 30px rgba(123, 0, 255, 0.2);
    animation: spin 0.5s linear infinite; 
  }
  
  /* Inner high-velocity track - tight cyan dashed */
  .ring-inner { 
    width: 180px; height: 180px; 
    border: 3px dashed var(--cyan); 
    box-shadow: 0 0 30px var(--cyan), inset 0 0 10px var(--cyan);
    animation: spin 0.5s linear infinite; 
  }
  
  .core-node { 
    width: 80px; height: 80px; 
    border: 2px solid var(--cyan);  
    border-radius: 50%; display: flex; align-items: center; justify-content: center; 
    position: relative; background: rgba(0,0,0,0.8); 
    box-shadow: 0 0 40px var(--cyan); z-index: 10; 
  }
  .drop-target { color: var(--cyan); filter: drop-shadow(0 0 10px var(--cyan)); }
  .core-pulse { 
    position: absolute; inset: -20px; z-index: -1; 
    background: var(--purple); opacity: 0.5; filter: blur(25px); 
    border-radius: 50%; animation: pulse 2s infinite; 
  }

  /* CHALLENGE SECTION */
  .challenge-section { padding: 120px 0; width: 90%; max-width: 1200px; margin: 0 auto; }
  .section-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: var(--text-muted); margin-bottom: 20px; }
  .section-title { font-size: 40px; font-weight: 800; margin-bottom: 20px; }
  .section-subtitle { font-size: 16px; color: var(--text-muted); max-width: 600px; line-height: 1.6; margin-bottom: 60px; }
  
  .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
  .tech-card { background: var(--card-bg); border: 1px solid var(--border); padding: 30px; border-radius: 12px; transition: 0.3s; }
  .tech-card:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
  .card-icon { margin-bottom: 20px; }
  .tech-card h3 { font-size: 18px; font-weight: 700; margin: 0 0 10px 0; }
  .tech-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin: 0; }

  /* ARCHITECTURE */
  .arch-section { padding: 100px 0; border-top: 1px solid var(--border); }
  .arch-inner { width: 90%; max-width: 1000px; margin: 0 auto; }
  .arch-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  
  .diagram-box { display: flex; align-items: center; justify-content: space-between; position: relative; }
  .d-node { width: 70px; height: 70px; border: 1px solid var(--border); border-radius: 12px; background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; font-size: 8px; font-family: 'JetBrains Mono'; color: var(--text-muted); z-index: 2; }
  .d-line { flex: 1; height: 1px; background: var(--border); position: relative; margin: 0 -10px; }
  .d-packet { position: absolute; width: 20px; height: 2px; background: var(--cyan); animation: packet 2s linear infinite; }
  .delay { animation-delay: 2s; background: var(--purple); }

  .arch-content h3 { font-size: 32px; font-weight: 800; margin-bottom: 40px; }
  .step { display: flex; gap: 20px; margin-bottom: 30px; }
  .step-num { font-family: 'JetBrains Mono'; color: var(--border); font-size: 12px; margin-top: 4px; }
  .step h4 { margin: 0 0 5px 0; font-size: 16px; font-weight: 700; }
  .step p { margin: 0; font-size: 14px; color: var(--text-muted); line-height: 1.5; }

  /* ANIMATIONS */
  @keyframes spin { 100% { transform: rotate(360deg); } }
  @keyframes spin-rev { 100% { transform: rotate(-360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
  @keyframes packet { 0% { left: 0; opacity: 1; } 100% { left: 100%; opacity: 0; } }
  @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }

  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; text-align: center; grid-template-rows: auto; position: relative; overflow: hidden;}
    .hero-text-stack { align-items: center; }
    .hero-text-stack, .hero-visual { grid-area: 1/1; }
    .core-pulse { transform: scale(2); opacity:0.4; }
    .hero-description { max-width: 100%; text-align: center; padding:10px;}
    .hero-badge { margin: 0 auto 25px; }
    .hero-cta-group { justify-content: center; }
    .hero-metrics { justify-content: center; }
    .hero-visual { z-index:-1; opacity:0.3; pointer-events:none; position: fixed; top: 75%; left: 50%; transform: translate(-50%,-50%) scale(1.5)}
    .card-grid { grid-template-columns: 1fr; }
    .arch-layout { grid-template-columns: 1fr; }
  }
`;