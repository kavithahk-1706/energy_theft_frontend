"use client";

import React from 'react';
import { motion } from "framer-motion";
import { 
  Zap, Globe, Shield, Terminal, Cpu, Database, 
  Github, Twitter, Linkedin, MessageSquare, 
  ArrowUpRight, Mail, MapPin, Radio, CheckCircle2
} from 'lucide-react';

export default function VoltGuardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="vg-enterprise-footer">
      <style dangerouslySetInnerHTML={{ __html: footerStyles }} />
      
      {/* SECTION 1: GLOBAL STATUS TICKER */}
      <div className="footer-status-bar">
        <div className="container">
          <div className="status-grid">
            <div className="status-item">
              <div className="indicator pulse-cyan" />
              <span className="label">GLOBAL_NODES:</span>
              <span className="val">14,202_ACTIVE</span>
            </div>
            <div className="status-item">
              <div className="indicator pulse-purple" />
              <span className="label">THREAT_LEVEL:</span>
              <span className="val">MINIMAL</span>
            </div>
            <div className="status-item">
              <div className="indicator pulse-green" />
              <span className="label">UPTIME:</span>
              <span className="val">99.998%</span>
            </div>
            <div className="status-item hidden-mobile">
              <span className="label">API_STATE:</span>
              <span className="val text-cyan">STABLE_v4.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE MAIN SITEMAP */}
      <div className="footer-main">
        <div className="container">
          <div className="main-grid">
            
            {/* BRANDING COLUMN */}
            <div className="brand-col">
              <div className="footer-logo">
                <div className="logo-icon"><Zap size={22} fill="currentColor" /></div>
                <span className="logo-text">VOLT<span className="text-purple">GUARD</span></span>
              </div>
              <p className="brand-pitch">
                The world's first AI-native Grid Integrity OS. We provide 
                enterprise utilities with the neural infrastructure to 
                eliminate Non-Technical Losses in real-time.
              </p>
              <div className="social-row">
                <a href="#" className="s-icon"><Github size={18} /></a>
                <a href="#" className="s-icon"><Twitter size={18} /></a>
                <a href="#" className="s-icon"><Linkedin size={18} /></a>
                <a href="#" className="s-icon"><MessageSquare size={18} /></a>
              </div>
            </div>

            {/* LINK COLUMNS */}
            <div className="links-col">
              <h4 className="col-title">PLATFORM_CORE</h4>
              <ul className="footer-links">
                <li><a href="#">Command Center</a></li>
                <li><a href="#">Geospatial Engine</a></li>
                <li><a href="#">NTL Telemetry</a></li>
                <li><a href="#">Neural Defense</a></li>
                <li><a href="#">Edge Hardware</a></li>
              </ul>
            </div>

            <div className="links-col">
              <h4 className="col-title">RESOURCES</h4>
              <ul className="footer-links">
                <li><a href="#">API Documentation</a></li>
                <li><a href="#">Network Logs</a></li>
                <li><a href="#">Security Audits</a></li>
                <li><a href="#">Global Whitepaper</a></li>
                <li><a href="#">System Pilot</a></li>
              </ul>
            </div>

            {/* CONTACT / HQ COLUMN */}
            <div className="contact-col">
              <h4 className="col-title">GLOBAL_HQ</h4>
              <div className="contact-item">
                <MapPin size={16} className="text-purple" />
                <span>Sector 7, Neo-Tech District, SF</span>
              </div>
              <div className="contact-item">
                <Mail size={16} className="text-cyan" />
                <span>ops@voltguard.ai</span>
              </div>
              <div className="newsletter-box">
                <span className="news-label">STAY_UPDATED</span>
                <div className="input-group">
                  <input type="email" placeholder="operator@enterprise.com" />
                  <button><ArrowUpRight size={16} /></button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 3: LEGAL & COPYRIGHT */}
      <div className="footer-bottom">
        <div className="container bottom-inner">
          <div className="bottom-left">
            <span className="copy">© {currentYear} VOLTGUARD_INDUSTRIES. NO_RIGHTS_RESERVED_FOR_THIEVES.</span>
          </div>
          <div className="bottom-right">
            <a href="#">PRIVACY_PROTOCOL</a>
            <a href="#">TERMS_OF_SERVICE</a>
            <a href="#">ISO_27001_CERTIFIED</a>
          </div>
        </div>
      </div>
      
      {/* DECORATIVE BACKGROUND GRADIENT */}
      <div className="footer-glow" />
    </footer>
  );
}

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

  .vg-enterprise-footer {
    background: #030303; border-top: 1px solid rgba(255,255,255,0.05);
    font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow: hidden;
  }
  .container { width: 92%; max-width: 1600px; margin: 0 auto; }

  /* STATUS BAR */
  .footer-status-bar { 
    border-bottom: 1px solid rgba(255,255,255,0.03); padding: 20px 0; 
    background: rgba(255,255,255,0.01);
  }
  .status-grid { display: flex; gap: 40px; }
  .status-item { display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 800; }
  .indicator { width: 6px; height: 6px; border-radius: 50%; }
  .pulse-cyan { background: #00f2ff; box-shadow: 0 0 10px #00f2ff; animation: footer-pulse 2s infinite; }
  .pulse-purple { background: #7b00ff; box-shadow: 0 0 10px #7b00ff; }
  .pulse-green { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
  .status-item .label { color: #333; }
  .status-item .val { color: #fff; }

  /* MAIN AREA */
  .footer-main { padding: 100px 0; position: relative; z-index: 2; }
  .main-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 80px; }

  .brand-col .footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 25px; }
  .logo-icon { width: 36px; height: 36px; background: #fff; color: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .logo-text { font-weight: 900; font-size: 22px; letter-spacing: -1px; }
  .brand-pitch { color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 30px; max-width: 320px; }
  .social-row { display: flex; gap: 15px; }
  .s-icon { 
    width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; 
    display: flex; align-items: center; justify-content: center; color: #444; transition: 0.3s;
  }
  .s-icon:hover { color: #fff; border-color: #fff; background: rgba(255,255,255,0.05); }

  .col-title { font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 800; color: #222; letter-spacing: 2px; margin-bottom: 30px; }
  .footer-links { list-style: none; padding: 0; margin: 0; }
  .footer-links li { margin-bottom: 15px; }
  .footer-links a { color: #666; text-decoration: none; font-size: 14px; font-weight: 700; transition: 0.2s; }
  .footer-links a:hover { color: #fff; padding-left: 5px; }

  .contact-col { display: flex; flex-direction: column; gap: 20px; }
  .contact-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #666; font-weight: 700; }
  
  .newsletter-box { margin-top: 20px; padding: 25px; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
  .news-label { font-family: 'JetBrains Mono'; font-size: 9px; font-weight: 800; color: #7b00ff; margin-bottom: 15px; display: block; }
  .input-group { display: flex; gap: 10px; }
  .input-group input { 
    background: #000; border: 1px solid #1a1a1a; padding: 12px; border-radius: 10px; 
    font-size: 12px; color: #fff; outline: none; width: 100%;
  }
  .input-group button { background: #fff; color: #000; border: none; padding: 0 15px; border-radius: 10px; cursor: pointer; }

  /* BOTTOM AREA */
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.03); padding: 40px 0; }
  .bottom-inner { display: flex; justify-content: space-between; align-items: center; }
  .bottom-left .copy { font-family: 'JetBrains Mono'; font-size: 9px; color: #333; font-weight: 800; }
  .bottom-right { display: flex; gap: 30px; }
  .bottom-right a { color: #333; text-decoration: none; font-family: 'JetBrains Mono'; font-size: 9px; font-weight: 800; transition: 0.2s; }
  .bottom-right a:hover { color: #7b00ff; }

  .footer-glow { 
    position: absolute; bottom: -200px; left: 50%; transform: translateX(-50%); 
    width: 600px; height: 600px; background: radial-gradient(circle, rgba(123,0,255,0.05) 0%, transparent 70%); 
    pointer-events: none; z-index: 1;
  }

  @keyframes footer-pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
  .text-purple { color: #7b00ff; }
  .text-cyan { color: #00f2ff; }

  @media (max-width: 1024px) {
    .main-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
    .hidden-mobile { display: none; }
  }
`;