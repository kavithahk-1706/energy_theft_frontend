"use client";

import React, { useState, useEffect } from 'react';
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation'; // <-- WE NEED THIS TO READ THE URL
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { 
  Zap, LayoutDashboard, Activity, Database, 
  Settings, Bell, Cpu, Network, User,
  Home, ChartLine, Plus, FileText, Download,
  Layers, ShieldCheck, Radio, Menu, X
} from 'lucide-react';

export default function SudarshanNavbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname(); // <-- READ THE URL
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. ROLE & SLUG DETECTION
  const metadata = user?.publicMetadata as { role?: string; orgSlug?: string; orgName?: string };
  const role = metadata?.role || 'client';
  const metaSlug = metadata?.orgSlug || 'demo-utility';

  const isOwner = user?.primaryEmailAddress?.emailAddress === "pradhyumnavojjala@gmail.com" || user?.primaryEmailAddress?.emailAddress === "kavithahaimakidambi0613@gmail.com";
  
  // --- IMPERSONATION LOGIC ---
  const pathSegment = pathname?.split('/')[1] || '';
  const ownerRoutes = ['manage-clients', 'client-logs', 'profile', 'map', '']; 
  const isImpersonating = isOwner && pathSegment && !ownerRoutes.includes(pathSegment);

  const finalRole = isOwner ? 'owner' : role;
  // If we are impersonating, force the navbar to render the client links!
  const displayRole = isImpersonating ? 'client' : finalRole;
  // If we are impersonating, use the URL slug for the links, NOT the owner's metadata slug!
  const activeSlug = isImpersonating ? pathSegment : metaSlug;
  
  const accentColor = isOwner ? '#7b00ff' : '#00f2ff';

  // 2. NAVIGATION CONFIGURATION
  const getNavConfig = () => {
    if (displayRole === 'owner') {
      return [
        { id: 'home', label: 'HOME', icon: Home, href: '/' },
        { id: 'manage', label: 'MANAGE_CLIENTS', icon: Network, href: '/manage-clients' },
        { id: 'logs', label: 'CLIENT_LOGS', icon: Database, href: '/client-logs' },
        { id: 'profile', label: 'ADMIN_CONSOLE', icon: User, href: '/profile' }, 
      ];
    } else {
      return [
        { id: 'home', label: 'HOME', icon: Home, href: '/' },
        { id: 'dashboard', label: 'OVERVIEW', icon: LayoutDashboard, href: `/${activeSlug}` },
        { 
          id: 'predict', label: 'THEFT_DETECTION', icon: Cpu, href: `/${activeSlug}/predict`,
          subLinks: [
            { label: 'Batch Prediction', href: `/${activeSlug}/predict`, icon: Layers },
            { label: 'Single Prediction', href: `/${activeSlug}/predict`, icon: Zap },
          ]
        },
        { 
          // FIXED THIS LINK SO IT GOES TO /metrics AND NOT /model-metrics
          id: 'metrics', label: 'MODEL_METRICS', icon: ChartLine, href: `/${activeSlug}/metrics`,
          subLinks: [
            { label: 'View Metrics', href: `/${activeSlug}/metrics`, icon: Activity },
            { label: 'Download Metric Report', href: `/${activeSlug}/metrics`, icon: Download }
          ]
        },
        { 
          id: 'logs', label: 'CONSUMPTION_LOGS', icon: Database, href: `/${activeSlug}/logs`,
          subLinks: [
            { label: 'Raw Data', href: `/${activeSlug}/logs`, icon: Database },
            { label: 'Export CSV', href: `/${activeSlug}/logs`, icon: Download }
          ]
        },
        { id: 'settings', label: 'SETTINGS', icon: Settings, href: `/${activeSlug}/settings` },
      ];
    }
  };

  const currentNav = getNavConfig();

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toISOString().split('T')[1].split('.')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLoaded) return null;

  return (
    <header className="vg-enterprise-header" onMouseLeave={() => setActiveTab(null)}>
      <style dangerouslySetInnerHTML={{ __html: enterpriseStyles }} />

      {/* MAIN NAV */}
      <nav className="main-nav-hub">
        <div className="nav-container">
          
          {/* LOGO */}
          <Link href="/" className="brand-engine">
            <div className="brand-icon">
              <Zap size={20} fill="currentColor" />
            </div>
            <div className="brand-titles">
              <h1 className="main-title">SUDARSHAN CORE</h1>
              <p className="sub-title" style={{ color: accentColor }}>
                {isImpersonating ? 'ADMIN_OVERRIDE' : `${finalRole.toUpperCase()}_CONSOLE`}
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION PILLS */}
          <div className="nav-stack desktop-only">
            <div className="glass-nav-pill">
              {isSignedIn ? (
                currentNav.map((link) => (
                  <div key={link.id} className="relative-wrapper" onMouseEnter={() => setActiveTab(link.id)}>
                    <Link 
                      href={link.href}
                      className={`nav-pill-item ${activeTab === link.id ? 'active' : ''}`}
                    >
                      <link.icon size={14} />
                      <span>{link.label}</span>
                      {activeTab === link.id && (
                        <motion.div 
                           layoutId="pill-bg" 
                           className="pill-active-bg" 
                           style={{ background: accentColor, boxShadow: `0 0 15px ${accentColor}66` }}
                        />
                      )}
                    </Link>

                    {/* SMART POPOVER */}
                    <AnimatePresence>
                      {activeTab === link.id && link.subLinks && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="smart-popover"
                        >
                          {link.subLinks.map((sub, idx) => (
                            <Link key={idx} href={sub.href} className="popover-item">
                              <sub.icon size={12} className="text-muted" />
                              <span>{sub.label}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="px-6 py-2 text-[10px] font-bold text-white/40 tracking-wider">
                  SYSTEM_LOCKED // SIGN_IN_REQUIRED
                </div>
              )}
            </div>
          </div>

          {/* CONTROLS & AUTH */}
          <div className="control-center">
            <div className="auth-module">
              {isSignedIn ? (
                <div className="user-card">
                  <div className="u-meta desktop-only">
                    <span className="u-name">{user.firstName}</span>
                    <span className="u-rank" style={{ color: accentColor }}>{isOwner ? 'ADMIN' : 'USER'}</span>
                  </div>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: `h-8 w-8 border border-[${accentColor}]` } }} />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="primary-access-btn">SIGN_IN</button>
                </SignInButton>
              )}
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </div>
          </div>

        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-dropdown-menu"
          >
            <div className="mobile-nav-list">
              {isSignedIn ? (
                currentNav.map((link) => (
                  <div key={link.id} className="mobile-nav-group">
                    <Link 
                      href={link.href} 
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ borderLeftColor: accentColor }}
                    >
                      <link.icon size={16} /> {link.label}
                    </Link>
                    {link.subLinks && (
                      <div className="mobile-sublinks">
                        {link.subLinks.map((sub, idx) => (
                           <Link 
                             key={idx} 
                             href={sub.href} 
                             className="mobile-sublink"
                             onClick={() => setMobileMenuOpen(false)}
                           >
                             <sub.icon size={12} className="text-muted" /> {sub.label}
                           </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="mobile-locked-msg">SYSTEM_LOCKED</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const enterpriseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

  .vg-enterprise-header { 
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(3, 3, 3, 0.85); backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* TOPBAR */
  .system-topbar { 
    height: 32px; background: #000; display: flex; align-items: center; 
    justify-content: space-between; padding: 0 40px; border-bottom: 1px solid #1a1a1a;
  }
  .ticker-static { display: flex; gap: 30px; }
  .ticker-item { 
    display: inline-flex; align-items: center; gap: 6px; color: #555; 
    font-family: 'JetBrains Mono'; font-size: 9px; font-weight: 700;
  }
  .sys-clock { font-family: 'JetBrains Mono'; font-size: 9px; font-weight: 700; color: #444; }

  /* MAIN NAV */
  .main-nav-hub { height: 70px; display: flex; align-items: center; }
  .nav-container { width: 95%; max-width: 1600px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }

  .brand-engine { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .brand-icon { width: 36px; height: 36px; background: #fff; color: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .main-title { font-weight: 900; font-size: 18px; letter-spacing: -0.5px; margin: 0; color: #fff; }
  .sub-title { font-family: 'JetBrains Mono'; font-size: 8px; font-weight: 800; margin-top: 2px; text-transform: uppercase; }

  /* NAV PILLS (Desktop) */
  .glass-nav-pill { 
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
    padding: 4px; border-radius: 12px; display: flex; gap: 4px; align-items: center;
  }
  .relative-wrapper { position: relative; }
  
  .nav-pill-item { 
    position: relative; color: #888; text-decoration: none;
    padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; 
    display: flex; align-items: center; gap: 8px; transition: 0.2s; white-space: nowrap;
  }
  .nav-pill-item span { position: relative; z-index: 2; }
  .nav-pill-item svg { position: relative; z-index: 2; }
  .nav-pill-item:hover { color: #fff; }
  .nav-pill-item.active { color: #fff; }
  
  .pill-active-bg { position: absolute; inset: 0; border-radius: 8px; z-index: 1; }

  /* SMART POPOVER (Desktop) */
  .smart-popover {
    position: absolute; top: 100%; left: 0; margin-top: 8px; min-width: 160px;
    background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
    padding: 6px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 2px;
  }
  .popover-item {
    display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px;
    color: #888; text-decoration: none; font-size: 11px; font-weight: 600; transition: 0.2s;
  }
  .popover-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .text-muted { color: #555; }

  /* CONTROLS */
  .control-center { display: flex; align-items: center; gap: 15px; }
  .control-icons { display: flex; gap: 8px; }
  .c-icon-btn { 
    width: 36px; height: 36px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
    border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666; cursor: pointer; transition: 0.2s;
  }
  .c-icon-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

  .auth-module { display: flex; align-items: center; }
  .user-card { display: flex; align-items: center; gap: 12px; }
  .u-meta { text-align: right; }
  .u-name { display: block; font-size: 11px; font-weight: 700; color: #fff; }
  .u-rank { display: block; font-size: 8px; font-family: 'JetBrains Mono'; font-weight: 800; }
  
  .primary-access-btn { 
    background: #fff; color: #000; border: none; padding: 8px 20px; border-radius: 8px; 
    font-size: 11px; font-weight: 800; cursor: pointer;
  }

  /* MOBILE SPECIFICS */
  .mobile-menu-btn { display: none; cursor: pointer; padding: 5px; }
  
  .mobile-dropdown-menu {
    overflow: hidden; background: #050505; border-top: 1px solid rgba(255,255,255,0.05);
    box-shadow: 0 20px 40px rgba(0,0,0,0.8);
  }
  .mobile-nav-list { padding: 20px; display: flex; flex-direction: column; gap: 15px; }
  .mobile-nav-group { display: flex; flex-direction: column; gap: 5px; }
  .mobile-nav-link { 
    display: flex; align-items: center; gap: 12px; color: #fff; font-size: 14px; font-weight: 700; 
    text-decoration: none; padding: 10px 15px; background: rgba(255,255,255,0.03); 
    border-radius: 8px; border-left: 3px solid transparent;
  }
  .mobile-sublinks { display: flex; flex-direction: column; padding-left: 35px; gap: 8px; margin-top: 5px; }
  .mobile-sublink { display: flex; align-items: center; gap: 8px; color: #888; font-size: 12px; text-decoration: none; }
  .mobile-locked-msg { font-family: 'JetBrains Mono'; font-size: 10px; color: #555; padding: 20px; text-align: center; letter-spacing: 1px; }

  /* RESPONSIVE BREAKPOINTS */
  @media (max-width: 900px) {
    .desktop-only { display: none !important; }
    .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
    .system-topbar { display: none; }
    .auth-module { padding-left: 0; border-left: none; }
  }
  @media (max-width: 480px) {
    .brand-titles { display: none; }
  }
`;