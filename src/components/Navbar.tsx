"use client";

import React, { useState, useEffect } from 'react';
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { 
  Zap, LayoutDashboard, Map as MapIcon, Activity, ShieldAlert, 
  Bell, Search, Cpu, Settings, Database, BarChart3, Radio, Share2,
  HardDrive, Fingerprint, Layers, Network, ShieldCheck,
  Wrench, MessageSquareShare, UserCheck, Bot, User,
  Home
} from 'lucide-react';

export default function VoltGuardNavbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState("");

  // 1. ROLE & SLUG DETECTION [cite: 2026-01-25]
  const metadata = user?.publicMetadata as { role?: string; orgSlug?: string; orgName?: string };
  const role = metadata?.role || 'user';
  const orgSlug = metadata?.orgSlug || '';
  
  // Owner Override (Your specific email)
  const isOwner = user?.primaryEmailAddress?.emailAddress === "pradhyumnavojjala@gmail.com";
 const finalRole = isOwner ? 'owner' : role;

  // 2. NAVIGATION SETS
  
  // OWNER: Global Authority
const OWNER_NAV = [
    { id: 'home', label: 'DASHBOARD', icon: Home, href: '/' },
    { id: 'analysis', label: 'GRID_ANALYSIS', icon: BarChart3, href: '/analysis' },
    { id: 'theft', label: 'THEFT_RADAR', icon: ShieldAlert, href: '/theft-detection' },
    // If this is for managing organizations, ensure the folder is 'organizations'
    { id: 'map', label: 'MANAGE_ORGS', icon: Network, href: '/map' }, 
    { id: 'history', label: 'SYSTEM_LOGS', icon: Database, href: '/history' },
    { id: 'profile', label: 'ADMIN_CORE', icon: User, href: '/profile' },
  ];

  // ORG ADMIN: Specific Utility Command
  const getOrgNav = (slug: string) => [
    { id: 'dashboard', label: 'ORG_PULSE', icon: LayoutDashboard, href: `/${slug}` },
    { id: 'analytics', label: 'ML_INTEL', icon: Cpu, href: `/${slug}/analytics` },
    { id: 'assets', label: 'GRID_ASSETS', icon: HardDrive, href: `/${slug}/infrastructure` },
    { id: 'workforce', label: 'FORCE_MGMT', icon: UserCheck, href: `/${slug}/workforce` },
    { id: 'settings', label: 'CONFIG', icon: Settings, href: `/${slug}/settings` },
  ];

  // WORKER: Field Operations
  const WORKER_NAV = [
    { id: 'missions', label: 'MISSION_FEED', icon: Radio, href: '/missions' },
    { id: 'attendance', label: 'NEURAL_SYNC', icon: Activity, href: '/attendance' },
    { id: 'xp', label: 'EVOLUTION', icon: Layers, href: '/evolution' },
    { id: 'history', label: 'CAPTURE_LOGS', icon: Database, href: '/his' },
    { id: 'profile', label: 'OPERATIVE_ID', icon: User, href: '/pro' },
  ];

  // USER: Consumer Portal
  const USER_NAV = [
    { id: 'hiring', label: 'HIRE_PRO', icon: Wrench, href: '/hiring' }, 
    { id: 'billing', label: 'BILLING', icon: Zap, href: '/billing' },
    { id: 'complaints', label: 'REPORT', icon: MessageSquareShare, href: '/complaints' },
    { id: 'assistant', label: 'AI_BOT', icon: Bot, href: '/helper-ai' },
    { id: 'profile', label: 'ACCOUNT', icon: User, href: '/porfile' },
  ];

  // 3. DYNAMIC LOGIC SELECTION
  const currentNav = 
    finalRole === 'owner' ? OWNER_NAV : 
    finalRole === 'org_admin' ? getOrgNav(orgSlug) : 
    finalRole === 'worker' ? WORKER_NAV : 
    USER_NAV;

  const accentColor = 
    finalRole === 'owner' ? '#7b00ff' : // Purple Authority
    finalRole === 'org_admin' ? '#00f2ff' : // Cyan Utility
    finalRole === 'worker' ? '#ffdf00' : // Yellow Tactical
    '#ffffff'; // Standard White

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toISOString().split('T')[1].split('.')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLoaded) return null;

  return (
    <header className="vg-enterprise-header" style={{ "--role-accent": accentColor } as any}>
      <style dangerouslySetInnerHTML={{ __html: enterpriseStyles }} />
      
      {/* SECTION 1: SYSTEM TOPBAR */}
      <div className="system-topbar">
        <div className="ticker-wrap">
          <div className="ticker-move">
            <span className="ticker-item"><Radio size={10}/> {orgSlug ? `NODE_${orgSlug.toUpperCase()}` : 'GLOBAL_NODE'}: 440V [STABLE]</span>
            <span className="ticker-item"><Activity size={10}/> NTL_RISK: {isSignedIn ? 'LOW (2.4%)' : 'SIGN_IN_TO_VIEW'}</span>
            <span className="ticker-item"><ShieldCheck size={10}/> FIREWALL: ACTIVE</span>
            <span className="ticker-item"><Database size={10}/> SYNC: 99.9%</span>
          </div>
        </div>
        <div className="topbar-right">
          <span className="sys-clock">UTC_OS: {systemTime}</span>
          <div className="v-divider" />
          <span className="sys-ver">BUILD_v4.0.82 [{finalRole.toUpperCase()}]</span>
        </div>
      </div>

      {/* SECTION 2: THE MAIN HUB */}
      <nav className="main-nav-hub">
        <div className="nav-container">
          
          <Link href="/" className="brand-engine">
            <motion.div whileHover={{ rotate: 180 }} className="brand-icon">
              <Zap size={22} fill="currentColor" />
            </motion.div>
            <div className="brand-titles">
              <h1 className="main-title">VOLTGUARD</h1>
              <p className="sub-title" style={{ color: accentColor }}>{finalRole.toUpperCase()}_INFRASTRUCTURE</p>
            </div>
          </Link>

          <div className="nav-stack">
            <div className="glass-nav-pill">
              {isSignedIn ? (
                <>
                  {currentNav.map((link) => (
                    <Link 
                      key={link.id}
                      href={link.href}
                      className={`nav-pill-item ${activeTab === link.id ? 'active' : ''}`}
                      onMouseEnter={() => setActiveTab(link.id)}
                    >
                      <link.icon size={15} />
                      <span>{link.label}</span>
                      {activeTab === link.id && (
                        <motion.div 
                           layoutId="pill-bg" 
                           className="pill-active-bg" 
                           style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}66` }}
                        />
                      )}
                    </Link>
                  ))}
                </>
              ) : (
                <div className="px-6 py-2 text-[10px] font-bold text-white/40 tracking-[0.2em]">
                  AUTHENTICATION_REQUIRED_FOR_SYSTEM_NAV
                </div>
              )}
            </div>
          </div>

          <div className="control-center">
            <div className="search-trigger">
              <Search size={16} />
              <span>SEARCH_GRID</span>
              <kbd>⌘K</kbd>
            </div>

            <div className="control-icons">
              <div className="c-icon-btn"><Bell size={18} />{isSignedIn && <span className="notif-ping" style={{ background: accentColor }} />}</div>
              <div className="c-icon-btn"><Cpu size={18} /></div>
              <div className="c-icon-btn"><Settings size={18} /></div>
            </div>

            <div className="auth-module">
              {isSignedIn ? (
                <div className="user-card">
                  <div className="u-meta">
                    <span className="u-name">{user.firstName}</span>
                    <span className="u-rank" style={{ color: accentColor }}>
                        {isOwner ? 'SYSTEM_FOUNDER' : `${finalRole.toUpperCase()}_AUTH`}
                    </span>
                  </div>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: `h-9 w-9 border-2 border-[${accentColor}]` } }} />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="primary-access-btn">
                    <Fingerprint size={16} />
                    SYSTEM_ACCESS
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* SECTION 3: MEGA-DROPDOWN ENGINE */}
      <AnimatePresence>
        {activeTab && isSignedIn && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onMouseLeave={() => setActiveTab(null)}
            className="mega-dropdown"
          >
            <div className="mega-container">
              <div className="mega-grid">
                <div className="mega-col main-col">
                  <h4 className="mega-label">PRIMARY_SYSTEMS</h4>
                  <div className="mega-link-large">
                    <Layers size={24} className="text-purple" />
                    <div className="m-link-text">
                      <span className="m-title">{isOwner ? 'Grid Visualizer' : 'My Usage'}</span>
                      <span className="m-desc">{isOwner ? '3D Geospatial node mapping.' : 'Real-time telemetry of your meter.'}</span>
                    </div>
                  </div>
                  <div className="mega-link-large">
                    <Network size={24} className="text-cyan" />
                    <div className="m-link-text">
                      <span className="m-title">{isOwner ? 'Neural Theft Detection' : 'Security Shield'}</span>
                      <span className="m-desc">{isOwner ? 'ML engine running NTL anomaly vectors.' : 'Active protection against power surges.'}</span>
                    </div>
                  </div>
                </div>

                <div className="mega-col">
                  <h4 className="mega-label">RESOURCES</h4>
                  <a href="#" className="m-small-link"><Database size={14}/> P4_Archive</a>
                  <a href="#" className="m-small-link"><BarChart3 size={14}/> Revenue_Recovery</a>
                  <a href="#" className="m-small-link"><Share2 size={14}/> API_Docs</a>
                  <a href="#" className="m-small-link"><HardDrive size={14}/> Edge_Compute</a>
                </div>

                <div className="mega-col featured-col">
                  <div className="featured-card">
                    <span className="f-tag">SYSTEM_UPDATE</span>
                    <h5>{isOwner ? 'Titan Engine v4' : 'Smart Billing Active'}</h5>
                    <p>{isOwner ? 'Accuracy increased to 98.4%.' : 'Save up to 15% on peak hour usage.'}</p>
                    <button className="f-btn">LEARN_MORE</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}



const enterpriseStyles = `
  /* Your existing styles remain exactly the same */
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

  .vg-enterprise-header { 
    position: fixed; top: 0; left: 0; right: 0; z-index: 10000;
    background: #030303; border-bottom: 1px solid rgba(255,255,255,0.06);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .system-topbar { 
    height: 36px; background: #000; display: flex; align-items: center; 
    justify-content: space-between; padding: 0 40px; border-bottom: 1px solid #111;
  }
  .ticker-wrap { overflow: hidden; width: 60%; white-space: nowrap; }
  .ticker-move { display: inline-block; animation: ticker 30s linear infinite; }
  .ticker-item { 
    display: inline-flex; align-items: center; gap: 8px; color: #444; 
    font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 800; margin-right: 50px; 
  }
  .topbar-right { display: flex; align-items: center; gap: 15px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 800; color: #333; }
  .v-divider { width: 1px; height: 12px; background: #222; }

  .main-nav-hub { height: 80px; display: flex; align-items: center; }
  .nav-container { width: 96%; max-width: 1800px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }

  .brand-engine { display: flex; align-items: center; gap: 15px; text-decoration: none; }
  .brand-icon { width: 42px; height: 42px; background: #fff; color: #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .main-title { font-weight: 900; font-size: 20px; letter-spacing: -1px; margin: 0; line-height: 1; color: #fff; }
  .sub-title { font-family: 'JetBrains Mono'; font-size: 8px; font-weight: 800; color: #7b00ff; margin-top: 5px; }

  .glass-nav-pill { 
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); 
    padding: 5px; border-radius: 100px; display: flex; gap: 5px; align-items: center;
  }
  .nav-pill-item { 
    position: relative; background: transparent; border: none; color: #666; 
    padding: 10px 22px; border-radius: 100px; font-size: 11px; font-weight: 800; 
    display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
    text-decoration: none;
  }
  .nav-pill-item span { position: relative; z-index: 2; }
  .nav-pill-item:hover { color: #fff; }
  .nav-pill-item.active { color: #fff; }
  .pill-active-bg { position: absolute; inset: 0; background: #7b00ff; border-radius: 100px; z-index: 1; box-shadow: 0 0 20px rgba(123,0,255,0.4); }

  .control-center { display: flex; align-items: center; gap: 25px; }
  .search-trigger { 
    background: #080808; border: 1px solid #1a1a1a; border-radius: 12px; 
    padding: 10px 15px; display: flex; align-items: center; gap: 15px; color: #444; cursor: pointer;
  }
  .search-trigger span { font-size: 10px; font-family: 'JetBrains Mono'; font-weight: 800; }
  .search-trigger kbd { font-size: 9px; background: #111; padding: 2px 5px; border-radius: 4px; }

  .control-icons { display: flex; gap: 10px; }
  .c-icon-btn { 
    width: 44px; height: 44px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); 
    border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #555; position: relative; cursor: pointer;
  }
  .notif-ping { position: absolute; top: 12px; right: 12px; width: 8px; height: 8px; background: #00f2ff; border-radius: 50%; box-shadow: 0 0 10px #00f2ff; }

  .auth-module { padding-left: 20px; border-left: 1px solid #1a1a1a; }
  .user-card { display: flex; align-items: center; gap: 15px; }
  .u-meta { text-align: right; }
  .u-name { display: block; font-size: 12px; font-weight: 800; color: #fff; }
  .u-rank { display: block; font-size: 8px; font-family: 'JetBrains Mono'; color: #7b00ff; font-weight: 800; }

  .primary-access-btn { 
    background: #fff; color: #000; border: none; padding: 12px 24px; border-radius: 12px; 
    font-size: 11px; font-weight: 900; display: flex; align-items: center; gap: 10px; cursor: pointer;
  }

  .mega-dropdown { 
    background: #050505; border-bottom: 1px solid rgba(255,255,255,0.08); 
    padding: 50px 0; box-shadow: 0 40px 100px rgba(0,0,0,0.8);
  }
  .mega-container { width: 90%; margin: 0 auto; }
  .mega-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 60px; }
  .mega-label { font-family: 'JetBrains Mono'; font-size: 10px; color: #333; letter-spacing: 2px; margin-bottom: 25px; font-weight: 800; }
  .mega-link-large { display: flex; gap: 20px; margin-bottom: 30px; cursor: pointer; }
  .m-title { display: block; font-size: 16px; font-weight: 800; color: #fff; }
  .m-desc { font-size: 12px; color: #555; line-height: 1.5; }

  .m-small-link { display: flex; align-items: center; gap: 12px; color: #666; font-size: 14px; font-weight: 700; text-decoration: none; margin-bottom: 15px; }
  .featured-card { background: #111; padding: 30px; border-radius: 20px; border: 1px solid #222; }
  .f-tag { font-family: 'JetBrains Mono'; font-size: 8px; color: #00f2ff; background: rgba(0,242,255,0.1); padding: 4px 8px; border-radius: 4px; }
  .f-btn { background: #7b00ff; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 10px; font-weight: 800; }

  @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
  .text-purple { color: #7b00ff; }
  .text-cyan { color: #00f2ff; }
  finalRole === 'admin' ? '#7b00ff' : 
  finalRole === 'worker' ? '#00f2ff' : 
  '#ff00ff'
`;