"use client";

import React, { useEffect, useRef, useState } from 'react';
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  Zap, Shield, ArrowUpRight, Globe, ChevronRight, Activity, 
  Terminal, Cpu, BarChart3, MapPin, Database, Lock, Server,
  AlertTriangle, CheckCircle2, TrendingUp, DollarSign, MousePointer2,
  Settings, Bell, Search, Menu, X, Filter, Share2, Download,
  Layers,
  BatteryCharging,
  Thermometer
} from 'lucide-react';

/**
 * MODULE 1: THE FOUNDATION & THE SUPER-HERO
 * Focus: High-density technical layout, 3D Engine, and Value Prop.
 */

export default function VoltGuardEnterpriseMaster() {
  const { isSignedIn } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
  
  // Smooth Scroll Progress
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Parallax effects for the "Super-Hero" Section
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateCore = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div ref={containerRef} className="master-root">
      <style dangerouslySetInnerHTML={{ __html: masterStyles }} />
      
      {/* HUD OVERLAY: Always visible technical metrics */}
      <div className="hud-overlay">
        <div className="hud-left">
          <div className="hud-metric">
            <span className="label">SYSTEM_STATUS</span>
            <span className="val text-cyan">OPERATIONAL</span>
          </div>
          <div className="hud-metric">
            <span className="label">NODE_SYNC</span>
            <span className="val">99.98%</span>
          </div>
        </div>
        <div className="hud-right">
          <div className="hud-metric text-right">
            <span className="label">ENCRYPTION</span>
            <span className="val text-purple">AES-256_P4</span>
          </div>
          <div className="hud-metric text-right">
            <span className="label">LOCAL_TIME</span>
            <span className="val font-mono">
  {mounted ? new Date().toLocaleTimeString() : "00:00:00"}
</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC SCROLL PROGRESS */}
      <motion.div className="global-progress" style={{ scaleX }} />

      {/* PART 1.2: THE TITAN HERO SECTION */}
      <section className="titan-hero">
        <div className="hero-grid">
          {/* CONTENT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-stack"
          >
            <div className="hero-badge">
              <Activity size={12} className="text-cyan animate-pulse" />
              <span>REAL-TIME LOSS MITIGATION PLATFORM</span>
            </div>
            
            <h1 className="hero-title">
              Recover Lost Revenue <br/>
              <span className="outline-h1">With AI-Driven</span> <br/>
              <span className="gradient-cyan">Grid Integrity.</span>
            </h1>

            <p className="hero-description">
              Stop bleeding revenue to Non-Technical Losses (NTL). Our machine learning engine 
              cross-references smart meter telemetry with historical baselines to pinpoint 
              energy theft and tampering with 98.4% accuracy.
            </p>

            <div className="hero-cta-group">
              <button className="btn-primary-titan">
                REQUEST_SYSTEM_PILOT
                <div className="btn-shimmer" />
              </button>
              <button className="btn-secondary-titan">
                VIEW_LIVE_GRID <ArrowUpRight size={18} />
              </button>
            </div>

            <div className="hero-trust-row">
              <div className="trust-unit">
                <span className="t-val">$96B+</span>
                <span className="t-lbl">MARKET_LOSS_ADDRESSABLE</span>
              </div>
              <div className="trust-unit">
                <span className="t-val">98.4%</span>
                <span className="t-lbl">DETECTION_ACCURACY</span>
              </div>
            </div>
          </motion.div>

          {/* THE MASSIVE ENGINE VISUAL */}
          <div className="hero-visual-stage">
            <div className="energy-viewport">
      <style dangerouslySetInnerHTML={{ __html: masterStyles }} />
      
      <div className="reactor-container">
        {/* BACKGROUND: INDUCTION FIELD */}
        <div className="induction-grid" />
        <div className="magnetic-waves" />

        {/* COMPONENT 1: THE PLASMA CONDUCTORS */}
        <div className="conductor-array">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`conductor-pillar p-${i}`}>
              <div className="plasma-arc" />
              <div className="voltage-flare" />
            </div>
          ))}
        </div>

        {/* COMPONENT 2: ROTATING INDUCTION COILS */}
        <div className="induction-coil coil-inner">
          <div className="coil-wire" />
        </div>
        <div className="induction-coil coil-outer" />

        {/* COMPONENT 3: THE SINGULARITY CORE */}
        <div className="energy-core">
          <div className="core-glass">
            <Zap size={60} className="zap-icon" />
            <div className="liquid-energy" />
          </div>
          {/* ORBITING DATA ELECTRONS */}
          <div className="electron-orbit">
            <div className="electron e1" />
            <div className="electron e2" />
          </div>
        </div>

        {/* ENERGY METRICS HUD */}
        <div className="energy-hud h-left">
          <div className="hud-metric">
            <BatteryCharging size={14} className="text-cyan" />
            <div className="m-text">
              <span className="m-label">GRID_INPUT</span>
              <span className="m-val">440.8 KV</span>
            </div>
          </div>
          <div className="induction-line" />
        </div>

        <div className="energy-hud h-right">
          <div className="induction-line" />
          <div className="hud-metric">
            <Thermometer size={14} className="text-purple" />
            <div className="m-text">
              <span className="m-label">CORE_TEMP</span>
              <span className="m-val">1,240°K</span>
            </div>
          </div>
        </div>

      </div>
    </div>
          </div>
        </div>

        {/* SECTION TRANSITION MASK */}
        <div className="hero-bottom-fade" />
      </section>

      {/* PART 2.1: THE CHALLENGE SECTION (PAIN POINTS) */}
      <section id="problem" className="problem-area">
        <div className="section-header">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="section-tag"
          >
            02 // MARKET_INEFFICIENCY_REPORT
          </motion.div>
          <h2 className="section-title">The Billion-Dollar <span className="text-purple">Bleed.</span></h2>
          <p className="section-subtitle">
            Non-Technical Losses (NTL) aren't just a grid problem—they're a financial crisis 
            for modern energy providers.
          </p>
        </div>

        <div className="pain-grid">
          {/* PAIN CARD 1: GLOBAL IMPACT */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="pain-card glass-border"
          >
            <div className="card-icon-wrap">
              <DollarSign size={32} className="text-purple" />
              <div className="icon-pulse" />
            </div>
            <div className="card-stats">
              <span className="stat-value">$96,000,000,000</span>
              <span className="stat-label">ANNUAL GLOBAL REVENUE LOSS</span>
            </div>
            <p className="card-desc">
              Energy theft and tampering cost utilities enough to power entire 
              developing nations. Most losses go undetected for 6-18 months.
            </p>
            <div className="card-footer-line" />
          </motion.div>

          {/* PAIN CARD 2: SAFETY & STABILITY */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="pain-card glass-border"
          >
            <div className="card-icon-wrap">
              <AlertTriangle size={32} className="text-cyan" />
            </div>
            <div className="card-stats">
              <span className="stat-value">GRID_INSTABILITY</span>
              <span className="stat-label">SAFETY & LIABILITY RISKS</span>
            </div>
            <p className="card-desc">
              Illegal taps create phase imbalances and transformer overloads, 
              leading to catastrophic fires and unmanaged grid downtime.
            </p>
            <div className="card-footer-line" />
          </motion.div>

          {/* PAIN CARD 3: OPEX COSTS */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="pain-card glass-border"
          >
            <div className="card-icon-wrap">
              <TrendingUp size={32} className="text-white" />
            </div>
            <div className="card-stats">
              <span className="stat-value">15%_DETECTION</span>
              <span className="stat-label">MANUAL INSPECTION FAILURE</span>
            </div>
            <p className="card-desc">
              Field teams relying on manual checks miss 85% of sophisticated 
              tampering, turning OpEx into a sunk cost with no ROI.
            </p>
            <div className="card-footer-line" />
          </motion.div>
        </div>
      </section>

      {/* PART 2.2: THE ENGINE (HOW IT WORKS) */}
      <section id="engine" className="engine-architecture">
        <div className="engine-inner">
          <div className="architecture-grid">
            
            {/* LEFT: THE VISUAL DIAGRAM */}
            <div className="diagram-container">
              <div className="diagram-node node-start">
                <Database size={24} />
                <div className="node-glow" />
                <span className="node-label">EDGE_INPUT</span>
              </div>
              
              {/* Animated Connection Lines */}
              <div className="connection-path">
                <motion.div 
                  animate={{ left: ["-10%", "110%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="data-packet" 
                />
              </div>

              <div className="diagram-node node-middle">
                <Cpu size={32} className="text-purple" />
                <div className="scan-effect" />
                <span className="node-label">NEURAL_CORE</span>
              </div>

              <div className="connection-path">
                <motion.div 
                  animate={{ left: ["-10%", "110%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                  className="data-packet cyan" 
                />
              </div>

              <div className="diagram-node node-end">
                <Bell size={24} className="text-cyan" />
                <div className="node-glow-cyan" />
                <span className="node-label">ACTION_HUB</span>
              </div>
            </div>

            {/* RIGHT: THE TECHNICAL EXPLANATION */}
            <div className="engine-copy">
              <h3 className="engine-h3">The Neural Defense Pipeline.</h3>
              
              <div className="step-item">
                <div className="step-icon">01</div>
                <div className="step-txt">
                  <h5>Smart Meter Ingestion</h5>
                  <p>Continuous telemetry streams from the grid edge are normalized and encrypted using P4 protocols.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-icon">02</div>
                <div className="step-txt">
                  <h5>Anomaly Vectorization</h5>
                  <p>Our ML models analyze phase shifts and consumption patterns against 5 years of historical baselines.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-icon">03</div>
                <div className="step-txt">
                  <h5>Automated Interception</h5>
                  <p>Instant GPS-tagged warrants are dispatched to field units the second theft is verified.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PART 3.1: THE FEATURE INTELLIGENCE MATRIX */}
      <section id="solutions" className="feature-matrix-sec">
        <div className="section-header center">
          <div className="section-tag">03 // CORE_CAPABILITIES</div>
          <h2 className="section-title">Enterprise-Grade <span className="text-cyan">Utility Defense.</span></h2>
        </div>

        <div className="matrix-wrapper">
          <table className="intel-table">
            <thead>
              <tr>
                <th>INFRASTRUCTURE LAYER</th>
                <th>TECHNICAL SPECIFICATION</th>
                <th>BUSINESS IMPACT</th>
              </tr>
            </thead>
            <tbody>
              <motion.tr initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <td className="feature-cell">
                  <Activity size={18} className="text-cyan" />
                  <span>Real-time Anomaly Engine</span>
                </td>
                <td className="mono-cell">v4.2 Sub-second Latency</td>
                <td className="impact-cell">Reduces detection window from 6 months to 120 seconds.</td>
              </motion.tr>
              
              <motion.tr initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <td className="feature-cell">
                  <MapPin size={18} className="text-purple" />
                  <span>Geospatial Heatmaps</span>
                </td>
                <td className="mono-cell">ArcGIS & Mapbox Integration</td>
                <td className="impact-cell">Visualizes "High-Risk" clusters for 40% better crew allocation.</td>
              </motion.tr>

              <motion.tr initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <td className="feature-cell">
                  <Lock size={18} className="text-white" />
                  <span>Tamper-Proof Hardware</span>
                </td>
                <td className="mono-cell">End-to-End P4 Encryption</td>
                <td className="impact-cell">Prevents sensor-level hacking and data spoofing.</td>
              </motion.tr>

              <motion.tr initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <td className="feature-cell">
                  <TrendingUp size={18} className="text-cyan" />
                  <span>Predictive Recovery</span>
                </td>
                <td className="mono-cell">LSTM Neural Networks</td>
                <td className="impact-cell">Forecasts future grid failure based on irregular load history.</td>
              </motion.tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PART 3.2: GEOSPATIAL HEATMAP SHOWCASE */}
      <section className="geospatial-showcase">
        <div className="geo-grid">
          
          {/* LEFT: THE INTERACTIVE MAP MOCKUP */}
          <div className="geo-map-wrap">
            <div className="map-glass-ui">
              <div className="map-sidebar-tools">
                <div className="tool-btn active"><Layers size={16} /></div>
                <div className="tool-btn"><Filter size={16} /></div>
                <div className="tool-btn"><Search size={16} /></div>
              </div>
              
              <div className="map-main-area">
                <div className="grid-overlay" />
                {/* The "Pulsing" Risk Zones */}
                <div className="risk-zone r-zone-1" />
                <div className="risk-zone r-zone-2" />
                
                <div className="map-hud-top">
                  <span className="mono">SCANNING_REGION: ZONE_delta_09</span>
                </div>

                <motion.div 
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="map-scan-line" 
                />
              </div>
            </div>

            {/* FLOATING DATA OVERLAY */}
            <div className="floating-metric-box">
              <div className="m-row">
                <span className="m-lbl">IDENTIFIED_LEAKS</span>
                <span className="m-val">42</span>
              </div>
              <div className="m-row">
                <span className="m-lbl">CONFIDENCE_SCORE</span>
                <span className="m-val text-cyan">99.2%</span>
              </div>
            </div>
          </div>

          {/* RIGHT: THE CONTENT */}
          <div className="geo-copy">
            <h3 className="geo-title">Eliminate Manual <br/> Surveillance.</h3>
            <p className="geo-p">
              Stop sending field teams blindly into the grid. Our geospatial intelligence 
              system identifies precise coordinates of meter tampering and energy diversion, 
              providing your teams with a high-confidence digital warrant.
            </p>
            <ul className="geo-list">
              <li><CheckCircle2 size={16} className="text-cyan" /> Automatic Asset Verification</li>
              <li><CheckCircle2 size={16} className="text-cyan" /> Dynamic Load Balancing</li>
              <li><CheckCircle2 size={16} className="text-cyan" /> GPS-Tagged Field Dispatch</li>
            </ul>
          </div>

        </div>
      </section>
 <section className="geospatial-showcase">
      {/* (Optional: Add content here or remove this section if not needed) */}
 </section>

      <section id="dashboard" className="dashboard-showcase-sec">
        <div className="section-header center">
          <h2 className="section-title">Global <span className="text-purple">Visibility.</span></h2>
          <p className="section-subtitle center-sub">
            A centralized OS for grid managers. Monitor, detect, and intercept 
            anomalies across your entire service territory from a single pane of glass.
          </p>
        </div>

        <div className="dashboard-frame-wrap">
          {/* THE MAIN DASHBOARD INTERFACE */}
          <div className="dashboard-container glass-border">
            
            {/* SIDE NAVIGATION */}
            <aside className="dash-sidebar">
              <div className="s-logo"><Zap size={20} /></div>
              <div className="s-nav-group">
                <div className="s-icon active"><Globe size={20} /></div>
                <div className="s-icon"><Activity size={20} /></div>
                <div className="s-icon"><Database size={20} /></div>
                <div className="s-icon"><Shield size={20} /></div>
              </div>
              <div className="s-bottom"><Settings size={20} /></div>
            </aside>

            {/* DASHBOARD CONTENT */}
            <main className="dash-main">
              {/* TOP HEADER */}
              <header className="dash-header">
                <div className="dash-title">
                  <h4>GRID_MONITOR_ALPHA</h4>
                  <span className="mono-tiny text-cyan">STATUS: SCANNING_LIVE</span>
                </div>
                <div className="dash-actions">
                  <div className="search-bar"><Search size={14} /> <span>Search node ID...</span></div>
                  <div className="notif-bell"><Bell size={18} /><div className="n-dot" /></div>
                </div>
              </header>

              {/* METRIC GRID */}
              <div className="dash-metrics-row">
                <div className="m-card">
                  <span className="m-label">RECOVERED_REVENUE</span>
                  <div className="m-val-group">
                    <span className="m-val-big">$4,288,400</span>
                    <span className="m-trend text-cyan">+12.4%</span>
                  </div>
                </div>
                <div className="m-card">
                  <span className="m-label">ACTIVE_DETECTIONS</span>
                  <div className="m-val-group">
                    <span className="m-val-big">142</span>
                    <span className="m-trend text-purple">URGENT</span>
                  </div>
                </div>
                <div className="m-card">
                  <span className="m-label">GRID_EFFICIENCY</span>
                  <div className="m-val-group">
                    <span className="m-val-big">99.8%</span>
                    <span className="m-trend text-white">OPTIMIZED</span>
                  </div>
                </div>
              </div>

              {/* MAIN VISUALIZATION AREA */}
              <div className="dash-center-grid">
                {/* LIVE TELEMETRY FEED */}
                <div className="telemetry-box glass-border">
                  <div className="box-head">LIVE_DETECTION_STREAM</div>
                  <div className="feed-list">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="feed-item">
                        <div className="f-status" />
                        <div className="f-info">
                          <span className="f-id">NODE_XA_{234 + i}</span>
                          <span className="f-msg">Unusual load pattern detected - Ph-B</span>
                        </div>
                        <span className="f-time">{i}m ago</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GRAPH VISUALIZATION */}
                <div className="graph-box glass-border">
                  <div className="box-head">RECOVERY_TRAJECTORY</div>
                  <div className="graph-mockup">
                    <motion.div 
                      className="graph-line"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <div className="graph-points">
                      {[20, 45, 30, 80, 60, 95].map((h, i) => (
                        <div key={i} className="g-bar" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* BACKGROUND ELEMENTS FOR DEPTH */}
          <div className="dash-glow-bg" />
        </div>
      </section>
    </div>
  );
}

const masterStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@700&display=swap');

  :root {
    --bg: #030303;
    --purple: #7b00ff;
    --cyan: #00f2ff;
    --border: rgba(255, 255, 255, 0.08);
    --glass: rgba(255, 255, 255, 0.02);
    --text-main: #ffffff;
    --text-muted: #555555;
  }

  * { box-sizing: border-box; }
  body { background: var(--bg); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; }

  /* HUD OVERLAY */
  .hud-overlay {
    position: fixed; inset: 0; padding: 30px; display: flex; justify-content: space-between; 
    align-items: flex-end; pointer-events: none; z-index: 50;
  }
  .hud-metric { display: flex; flex-direction: column; gap: 4px; }
  .hud-metric .label { font-family: 'JetBrains Mono'; font-size: 9px; color: var(--text-muted); font-weight: 800; }
  .hud-metric .val { font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 800; }

  .global-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; background: var(--cyan); z-index: 1000; transform-origin: 0%; }

  /* NAVIGATION */
  .mega-nav { position: fixed; top: 0; width: 100%; z-index: 100; padding: 20px 40px; }
  .nav-container { 
    background: rgba(10, 10, 12, 0.7); backdrop-filter: blur(25px); 
    border: 1px solid var(--border); border-radius: 20px;
    padding: 10px 10px 10px 25px; display: flex; justify-content: space-between; align-items: center;
  }
  .nav-brand { display: flex; align-items: center; gap: 15px; }
  .logo-outer { width: 42px; height: 42px; background: #fff; color: #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .brand-stack { display: flex; flex-direction: column; }
  .brand-main { font-weight: 800; font-size: 18px; letter-spacing: -1px; line-height: 1; }
  .brand-sub { font-size: 8px; font-family: 'JetBrains Mono'; color: var(--text-muted); font-weight: 800; margin-top: 4px; }

  .nav-pill-menu { display: flex; gap: 5px; background: #000; padding: 5px; border-radius: 100px; border: 1px solid var(--border); }
  .nav-item { 
    padding: 10px 22px; border-radius: 100px; font-size: 10px; font-weight: 800; 
    color: var(--text-muted); text-decoration: none; transition: 0.3s;
  }
  .nav-item:hover { color: #fff; background: var(--glass); }

  .nav-actions { display: flex; align-items: center; gap: 15px; }
  .btn-connect { 
    background: #fff; color: #000; border: none; padding: 12px 24px; border-radius: 100px;
    font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 8px; cursor: pointer;
  }
  .auth-pill { display: flex; align-items: center; gap: 12px; background: var(--glass); padding-right: 15px; border-radius: 100px; }
  .user-meta { display: flex; flex-direction: column; }
  .u-name { font-size: 10px; font-weight: 800; }
  .u-status { font-size: 8px; color: var(--purple); font-weight: 800; }

  /* HERO SECTION */
  .titan-hero { min-height: 100vh; position: relative; padding-top: 150px; display: flex; align-items: center; overflow: hidden; }
  .hero-grid { width: 90%; max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px;  }

  .hero-badge {
    display: flex; align-items: center; gap: 10px; background: rgba(0, 242, 255, 0.05);
    border: 1px solid rgba(0, 242, 255, 0.1); padding: 8px 16px; border-radius: 100px;
    font-family: 'JetBrains Mono'; font-size: 10px; color: var(--cyan); font-weight: 800; width: fit-content; margin-bottom: 30px;
  }

  .hero-title { font-family: 'Space Grotesk'; font-size: 100px; font-weight: 700; line-height: 0.85; letter-spacing: -6px; margin-bottom: 35px; }
  .outline-h1 { -webkit-text-stroke: 3px rgba(255, 255, 255, 0.15); color: transparent; }
  .gradient-cyan { background: linear-gradient(to right, var(--cyan), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  .hero-description { font-size: 20px; color: var(--text-muted); line-height: 1.6; max-width: 580px; margin-bottom: 50px; }
  
  .hero-cta-group { display: flex; gap: 20px; margin-bottom: 60px; }
  .btn-primary-titan {
    position: relative; background: var(--purple); color: #fff; border: none;
    padding: 22px 45px; border-radius: 16px; font-weight: 800; font-size: 15px;
    cursor: pointer; box-shadow: 0 20px 40px rgba(123,0,255,0.3); overflow: hidden;
  }
  .btn-shimmer { position: absolute; top: -100%; left: -100%; width: 50%; height: 300%; background: rgba(255,255,255,0.1); transform: rotate(45deg); animation: shimmer 4s infinite; }
  .btn-secondary-titan {
    background: transparent; border: 1px solid var(--border); color: #fff;
    padding: 22px 45px; border-radius: 16px; font-weight: 800; font-size: 15px;
    display: flex; align-items: center; gap: 12px; cursor: pointer;
  }

  .hero-trust-row { display: flex; gap: 50px; padding-top: 40px; border-top: 1px solid var(--border); }
  .trust-unit { display: flex; flex-direction: column; gap: 5px; }
  .t-val { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .t-lbl { font-family: 'JetBrains Mono'; font-size: 9px; color: var(--text-muted); font-weight: 800; }

  /* TITAN ENGINE VISUAL */
  .hero-visual-stage { display: flex; justify-content: center; align-items: center; position: relative; }
  .titan-engine-container { position: relative; width: 600px; height: 600px; display: flex; align-items: center; justify-content: center; }
  
  .engine-ring { position: absolute; border-radius: 50%; border: 1px solid var(--border); }
  .r-1 { width: 550px; height: 550px; border-style: dashed; opacity: 0.3; }
  .r-2 { width: 400px; height: 400px; border-color: var(--purple); opacity: 0.1; }
  .r-3 { width: 280px; height: 280px; border-color: var(--cyan); opacity: 0.2; }

  .engine-heart { position: relative; z-index: 5; }
  .heart-glow { position: absolute; inset: -50px; background: radial-gradient(circle, rgba(123,0,255,0.2) 0%, transparent 70%); border-radius: 50%; }
  .heart-icon { color: var(--purple); filter: drop-shadow(0 0 30px var(--purple)); }

  .orbit-path { position: absolute; width: 450px; height: 450px; display: flex; justify-content: center; }
  .orbit-node { width: 8px; height: 8px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 15px var(--cyan); margin-top: -4px; }

  .callout { position: absolute; display: flex; align-items: center; gap: 15px; }
  .c-top { top: 10%; right: -20px; }
  .c-line { width: 60px; height: 1px; background: var(--cyan); }
  .c-box { background: #000; border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; }
  .c-label { font-size: 8px; color: var(--text-muted); font-weight: 800; font-family: 'JetBrains Mono'; }
  .c-val { font-size: 12px; font-weight: 800; }

  @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }
  .text-cyan { color: var(--cyan); }
  .text-purple { color: var(--purple); }

  @media (max-width: 1200px) {
    .hero-grid { grid-template-columns: 1fr; }
    .hero-title { font-size: 60px; }
    .hero-visual-stage { display: none; }
  }
    /* PART 2: INDUSTRIAL GRID & ENGINE STYLES */
  .problem-area { padding: 150px 0; border-top: 1px solid var(--border); width: 90%; max-width: 1400px; margin: 0 auto; }
  .section-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: var(--text-muted); margin-bottom: 20px; letter-spacing: 2px; }
  .section-title { font-size: 56px; font-weight: 800; letter-spacing: -3px; margin-bottom: 25px; }
  .section-subtitle { font-size: 18px; color: var(--text-muted); max-width: 600px; margin-bottom: 80px; }

  .pain-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
  .pain-card { 
    background: var(--glass); padding: 50px 40px; border-radius: 32px; 
    border: 1px solid var(--border); position: relative; overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .pain-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.15); }

  .card-icon-wrap { width: 64px; height: 64px; background: rgba(0,0,0,0.5); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; position: relative; }
  .icon-pulse { position: absolute; inset: 0; background: var(--purple); border-radius: 16px; opacity: 0.1; animation: pulse-out 2s infinite; }

  .card-stats { display: flex; flex-direction: column; gap: 5px; margin-bottom: 20px; }
  .stat-value { font-size: 24px; font-weight: 800; font-family: 'Space Grotesk'; letter-spacing: -1px; }
  .stat-label { font-family: 'JetBrains Mono'; font-size: 9px; color: var(--text-muted); font-weight: 800; }
  .card-desc { font-size: 14px; color: #666; line-height: 1.6; }
  .card-footer-line { position: absolute; bottom: 0; left: 0; width: 40px; height: 4px; background: var(--purple); }

  /* ENGINE ARCHITECTURE */
  .engine-architecture { padding: 150px 0; background: linear-gradient(to bottom, #030303, #0a0a0c); }
  .engine-inner { width: 90%; max-width: 1400px; margin: 0 auto; }
  .architecture-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }

  .diagram-container { display: flex; align-items: center; justify-content: space-between; position: relative; height: 300px; }
  .diagram-node { 
    width: 80px; height: 80px; background: #000; border: 1px solid var(--border); 
    border-radius: 20px; display: flex; align-items: center; justify-content: center; 
    position: relative; flex-direction: column; z-index: 2;
  }
  .node-label { position: absolute; bottom: -30px; font-family: 'JetBrains Mono'; font-size: 9px; color: var(--text-muted); font-weight: 800; white-space: nowrap; }
  .node-glow { position: absolute; inset: -10px; background: var(--purple); opacity: 0.1; filter: blur(20px); border-radius: 50%; }
  .node-glow-cyan { position: absolute; inset: -10px; background: var(--cyan); opacity: 0.1; filter: blur(20px); border-radius: 50%; }

  .connection-path { flex: 1; height: 1px; background: var(--border); position: relative; margin: 0 -10px; }
  .data-packet { position: absolute; width: 30px; height: 2px; background: var(--purple); box-shadow: 0 0 10px var(--purple); top: -1px; }
  .data-packet.cyan { background: var(--cyan); box-shadow: 0 0 10px var(--cyan); }

  .engine-copy { display: flex; flex-direction: column; gap: 40px; }
  .engine-h3 { font-size: 40px; font-weight: 800; margin-bottom: 10px; }
  
  .step-item { display: flex; gap: 25px; }
  .step-icon { 
    width: 40px; height: 40px; border: 1px solid var(--purple); border-radius: 10px; 
    display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; 
    font-size: 12px; font-weight: 800; color: var(--purple); flex-shrink: 0;
  }
  .step-txt h5 { font-size: 18px; margin: 0 0 10px; font-weight: 700; }
  .step-txt p { font-size: 15px; color: #555; line-height: 1.5; margin: 0; }

  @keyframes pulse-out { 0% { transform: scale(1); opacity: 0.1; } 100% { transform: scale(1.5); opacity: 0; } }
  /* PART 3: FEATURE MATRIX & GEOSPATIAL STYLES */
  .feature-matrix-sec { padding: 150px 0; width: 90%; max-width: 1400px; margin: 0 auto; }
  .matrix-wrapper { margin-top: 60px; border: 1px solid var(--border); border-radius: 32px; background: var(--glass); overflow: hidden; }
  
  .intel-table { width: 100%; border-collapse: collapse; text-align: left; }
  .intel-table th { padding: 25px 40px; background: rgba(255,255,255,0.03); font-family: 'JetBrains Mono'; font-size: 11px; color: #444; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
  .intel-table td { padding: 30px 40px; border-bottom: 1px solid var(--border); }
  
  .feature-cell { display: flex; align-items: center; gap: 15px; font-weight: 800; font-size: 16px; }
  .mono-cell { font-family: 'JetBrains Mono'; font-size: 11px; color: #555; }
  .impact-cell { color: #888; font-size: 14px; line-height: 1.5; }

  /* GEOSPATIAL SECTION */
  .geospatial-showcase { padding: 150px 0; background: #000; }
  .geo-grid { width: 90%; max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 100px; align-items: center; }

  .geo-map-wrap { position: relative; }
  .map-glass-ui { 
    height: 500px; background: #050505; border: 1px solid var(--border); 
    border-radius: 40px; display: flex; overflow: hidden; position: relative;
    box-shadow: 0 40px 100px rgba(0,0,0,0.8);
  }
  
  .map-sidebar-tools { width: 60px; border-right: 1px solid var(--border); background: #080808; display: flex; flex-direction: column; align-items: center; padding-top: 20px; gap: 20px; }
  .tool-btn { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #444; cursor: pointer; transition: 0.3s; }
  .tool-btn.active { background: var(--glass); color: #fff; border: 1px solid var(--border); }

  .map-main-area { flex: 1; position: relative; background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 30px 30px; }
  .grid-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0%, #000 100%); opacity: 0.6; }

  .risk-zone { position: absolute; border-radius: 50%; filter: blur(20px); animation: pulse-risk 4s infinite; }
  .r-zone-1 { width: 150px; height: 150px; background: rgba(123, 0, 255, 0.2); top: 20%; left: 30%; }
  .r-zone-2 { width: 100px; height: 100px; background: rgba(0, 242, 255, 0.1); bottom: 25%; right: 20%; animation-delay: 2s; }

  .map-hud-top { position: absolute; top: 20px; left: 20px; font-family: 'JetBrains Mono'; font-size: 9px; color: #333; }
  .map-scan-line { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(to right, transparent, var(--cyan), transparent); z-index: 5; }

  .floating-metric-box { 
    position: absolute; bottom: -30px; right: -30px; background: #000; 
    border: 1px solid var(--border); padding: 25px; border-radius: 20px; 
    display: flex; gap: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }
  .m-row { display: flex; flex-direction: column; gap: 5px; }
  .m-lbl { font-family: 'JetBrains Mono'; font-size: 8px; color: #444; font-weight: 800; }
  .m-val { font-size: 22px; font-weight: 800; font-family: 'Space Grotesk'; }

  .geo-title { font-size: 64px; line-height: 0.9; font-weight: 800; margin-bottom: 30px; letter-spacing: -3px; }
  .geo-p { font-size: 18px; color: #666; line-height: 1.6; margin-bottom: 40px; }
  .geo-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 15px; }
  .geo-list li { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 15px; }

  @keyframes pulse-risk { 0%, 100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.3); opacity: 0.4; } }
  .center { text-align: center; }
  /* PART 4: COMMAND CENTER STYLES */
  .dashboard-showcase-sec { padding: 150px 0; background: radial-gradient(circle at 50% -20%, rgba(123,0,255,0.05) 0%, transparent 50%); }
  .center-sub { margin-left: auto; margin-right: auto; }

  .dashboard-frame-wrap { position: relative; width: 94%; max-width: 1500px; margin: 60px auto 0; }
  .dashboard-container { 
    height: 800px; background: #050505; display: flex; overflow: hidden; border-radius: 40px;
    box-shadow: 0 50px 100px rgba(0,0,0,0.9); position: relative; z-index: 5;
  }

  /* SIDEBAR */
  .dash-sidebar { width: 80px; background: #080808; border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding: 30px 0; }
  .s-logo { color: #fff; margin-bottom: 60px; }
  .s-nav-group { flex: 1; display: flex; flex-direction: column; gap: 30px; }
  .s-icon { color: #333; cursor: pointer; transition: 0.3s; }
  .s-icon:hover, .s-icon.active { color: var(--cyan); }
  .s-bottom { color: #333; cursor: pointer; }

  /* MAIN DASH */
  .dash-main { flex: 1; display: flex; flex-direction: column; padding: 40px; gap: 40px; }
  .dash-header { display: flex; justify-content: space-between; align-items: center; }
  .dash-title h4 { font-family: 'Space Grotesk'; font-size: 20px; margin: 0; }
  .dash-actions { display: flex; align-items: center; gap: 20px; }
  .search-bar { background: var(--glass); border: 1px solid var(--border); padding: 10px 20px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 11px; color: #444; }
  .notif-bell { position: relative; color: #444; }
  .n-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: var(--purple); border-radius: 50%; border: 2px solid #050505; }

  /* METRICS */
  .dash-metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; }
  .m-card { background: var(--glass); border: 1px solid var(--border); padding: 30px; border-radius: 24px; }
  .m-label { font-family: 'JetBrains Mono'; font-size: 9px; color: #444; font-weight: 800; }
  .m-val-group { display: flex; align-items: flex-end; gap: 15px; margin-top: 10px; }
  .m-val-big { font-size: 32px; font-weight: 800; font-family: 'Space Grotesk'; }
  .m-trend { font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 800; margin-bottom: 8px; }

  /* CENTER GRID */
  .dash-center-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 25px; flex: 1; }
  .box-head { font-family: 'JetBrains Mono'; font-size: 10px; color: #444; padding: 20px; border-bottom: 1px solid var(--border); font-weight: 800; }
  .telemetry-box { background: rgba(255,255,255,0.01); border-radius: 24px; display: flex; flex-direction: column; }
  .feed-list { padding: 10px; display: flex; flex-direction: column; gap: 10px; }
  .feed-item { display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px solid transparent; transition: 0.3s; }
  .feed-item:hover { border-color: var(--border); background: var(--glass); }
  .f-status { width: 8px; height: 8px; background: var(--purple); border-radius: 50%; animation: pulse 2s infinite; }
  .f-id { display: block; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 800; color: #fff; }
  .f-msg { display: block; font-size: 11px; color: #555; margin-top: 2px; }
  .f-time { font-size: 9px; color: #333; margin-left: auto; }

  .graph-box { background: rgba(255,255,255,0.01); border-radius: 24px; display: flex; flex-direction: column; }
  .graph-mockup { flex: 1; padding: 30px; position: relative; display: flex; align-items: flex-end; gap: 10px; }
  .graph-line { position: absolute; bottom: 40%; left: 0; height: 2px; background: linear-gradient(to right, var(--purple), var(--cyan)); z-index: 2; }
  .g-bar { flex: 1; background: var(--glass); border: 1px solid var(--border); border-radius: 8px 8px 0 0; transition: 0.5s; }
  .g-bar:hover { background: var(--purple); opacity: 0.4; }

  .dash-glow-bg { position: absolute; inset: -100px; background: radial-gradient(circle at center, rgba(123,0,255,0.07) 0%, transparent 60%); z-index: 1; pointer-events: none; }
  :root {
    --plasma-cyan: #00f2ff;
    --plasma-purple: #7b00ff;
    --reactor-speed: 8s;
  }

  .energy-viewport {
    width: 100%; height: 850px; background: #010101;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; font-family: 'JetBrains Mono', monospace;
  }

  .reactor-container {
    position: relative; width: 600px; height: 600px;
    display: flex; align-items: center; justify-content: center;
    transform: perspective(1000px);
  }

  /* INDUCTION FIELD EFFECTS */
  .induction-grid {
    position: absolute; inset: -100px;
    background: 
      radial-gradient(circle at center, transparent 30%, rgba(123, 0, 255, 0.05) 100%),
      repeating-radial-gradient(circle at center, transparent 0, transparent 40px, rgba(255,255,255,0.01) 41px);
  }

  .magnetic-waves {
    position: absolute; inset: 0; border-radius: 50%;
    border: 1px solid rgba(0, 242, 255, 0.1);
    animation: wave-expand 4s linear infinite;
  }

  @keyframes wave-expand {
    0% { transform: scale(0.5); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  /* CONDUCTOR PILLARS */
  .conductor-array { position: absolute; inset: 0; animation: rotate-cw 20s linear infinite; }
  .conductor-pillar {
    position: absolute; width: 4px; height: 60px;
    background: rgba(255,255,255,0.1); left: 50%; transform-origin: 0 300px;
  }
  .p-0 { transform: rotate(0deg) translateY(-280px); }
  .p-1 { transform: rotate(90deg) translateY(-280px); }
  .p-2 { transform: rotate(180deg) translateY(-280px); }
  .p-3 { transform: rotate(270deg) translateY(-280px); }

  .plasma-arc {
    position: absolute; top: 0; left: 50%; width: 200px; height: 1px;
    background: linear-gradient(90deg, var(--plasma-cyan), transparent);
    box-shadow: 0 0 15px var(--plasma-cyan);
    transform-origin: left; animation: arc-flicker 0.2s infinite;
  }

  @keyframes arc-flicker {
    0%, 100% { opacity: 0.8; transform: rotate(0deg) scaleX(1); }
    50% { opacity: 1; transform: rotate(2deg) scaleX(1.1); }
  }

  /* INDUCTION COILS */
  .induction-coil {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .coil-inner {
    width: 320px; height: 320px;
    border: 4px double var(--plasma-purple);
    box-shadow: 0 0 20px rgba(123, 0, 255, 0.2);
    animation: rotate-ccw 10s linear infinite;
  }
  .coil-outer {
    width: 500px; height: 500px;
    border: 1px dashed rgba(0, 242, 255, 0.2);
    animation: rotate-cw 30s linear infinite;
  }

  /* THE ENERGY CORE */
  .energy-core { position: relative; z-index: 10; }
  .core-glass {
    width: 140px; height: 140px; background: #000;
    border: 1px solid rgba(255,255,255,0.2); border-radius: 30px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; box-shadow: inset 0 0 30px rgba(123,0,255,0.5);
  }

  .liquid-energy {
    position: absolute; bottom: 0; width: 100%; height: 60%;
    background: var(--plasma-purple); opacity: 0.3;
    filter: blur(20px); animation: liquid-slosh 4s ease-in-out infinite;
  }

  .zap-icon { color: white; filter: drop-shadow(0 0 15px var(--plasma-cyan)); z-index: 5; }

  /* ELECTRON ORBIT */
  .electron-orbit {
    position: absolute; inset: -40px;
    animation: rotate-cw 3s linear infinite;
  }
  .electron {
    position: absolute; width: 8px; height: 8px;
    background: white; border-radius: 50%;
    box-shadow: 0 0 15px white, 0 0 30px var(--plasma-cyan);
  }
  .e1 { top: 0; left: 50%; }
  .e2 { bottom: 0; left: 50%; }

  /* HUD METRICS */
  .energy-hud { position: absolute; display: flex; align-items: center; gap: 20px; }
  .h-left { left: -80px; top: 20%; }
  .h-right { right: -80px; bottom: 20%; }

  .hud-metric {
    background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1);
    padding: 12px 20px; border-radius: 8px; display: flex; gap: 15px; align-items: center;
  }
  .m-label { display: block; font-size: 8px; color: #444; letter-spacing: 1px; }
  .m-val { display: block; font-size: 16px; font-weight: 800; color: #fff; }

  .induction-line { width: 60px; height: 1px; background: linear-gradient(90deg, var(--plasma-cyan), transparent); }

  /* GLOBAL ANIMATIONS */
  @keyframes rotate-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes rotate-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  @keyframes liquid-slosh {
    0%, 100% { height: 40%; transform: skewY(0deg); }
    50% { height: 70%; transform: skewY(10deg); }
  }

  .text-cyan { color: var(--plasma-cyan); }
  .text-purple { color: var(--plasma-purple); }
`;