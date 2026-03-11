"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function SudarshanFooter() {
  const {isLoaded, isSignedIn, user}=useUser();
  const currentYear = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);
  
  const metadata = user?.publicMetadata as { role?: string; orgSlug?: string; orgName?: string };
  const role = metadata?.role || 'client';
  const isOwner = user?.primaryEmailAddress?.emailAddress === "pradhyumnavojjala@gmail.com" || user?.primaryEmailAddress?.emailAddress === "kavithahaimakidambi0613@gmail.com";
  const finalRole = isOwner ? 'owner' : role;
  const orgSlug = metadata?.orgSlug || 'demo-utility';


  const getFooterConfig = () => {
      if (finalRole === 'owner') {
        return [
          { 
            id: 'home', name: 'HOME', href: '/',
            
          },
          { 
            id: 'manage', name: 'MANAGE_CLIENTS', href: '/manage-clients',
            
          },
          { 
            id: 'logs', name: 'CLIENT_LOGS', href: '/client-logs',
            
          },
          { id: 'profile', name: 'ADMIN_CONSOLE', href: '/profile' }, 
        ];
      } else {
        return [
          {
            id: 'home', name: 'HOME', href: '/',
          },
          { 
            id: 'dashboard', name: 'OVERVIEW', href: `/${orgSlug}`,
      
          },
          { 
            id: 'predict', name: 'THEFT_DETECTION', href: `/${orgSlug}/predict`,
      
          },
          { 
            id: 'metrics', name: 'MODEL_METRICS', href: `/${orgSlug}/model-metrics`,
    
          },
          { 
            id: 'logs', name: 'CONSUMPTION_LOGS',  href: `/${orgSlug}/logs`,      
          },
          { 
            id: 'settings', name: 'SETTINGS', href: `/${orgSlug}/settings`
          },
        ];
      }
    };

    const currentFooterLinks=getFooterConfig();
  // Prevent hydration mismatch on time display
  useEffect(() => { setMounted(true); }, []);

  return (
    <footer className="vg-footer-root">
      <style dangerouslySetInnerHTML={{ __html: footerStyles }} />
      
      <div className="footer-container">
        
        {/* LEFT: BRAND & STATUS */}
        <div className="footer-left">
          <div className="brand-lockup">
            <Zap size={18} className="text-cyan" />
            <span className="brand-text">SUDARSHAN_CORE_ENTERPRISE</span>
          </div>
          
          <div className="status-row">
            <div className="status-indicator">
              <div className="dot pulse-green" />
              <span>SYSTEM_ONLINE</span>
            </div>
            <div className="status-indicator">
              <Activity size={12} className="text-purple" />
              <span className="mono">
                {mounted ? new Date().toLocaleTimeString() : "--:--:--"}
              </span>
            </div>
          </div>
          
          <p className="copyright">
            © {currentYear} Sudarshan Core Industries. All rights reserved.
            <br />
            <span>Smart Grid Energy Theft Detection Analytics Platform v1.2</span>
          </p>
        </div>

        

        {/* RIGHT: REAL NAVIGATION ONLY */}
        <div className="footer-right">
          <h4 className="nav-header">SYSTEM_NAVIGATION</h4>
          <nav className="nav-links">
            {currentFooterLinks.map((link)=>(
              <Link id={link.id} href={link.href} key={link.id} className="f-link">{link.name}</Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;600&display=swap');

  .vg-footer-root {
    background: #050505;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 60px 0;
    font-family: 'Inter', sans-serif;
    color: #fff;
  }

  .footer-container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 40px;
  }

  /* LEFT SIDE */
  .footer-left {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .brand-lockup {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'JetBrains Mono';
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1px;
  }

  .status-row {
    display: flex;
    gap: 20px;
    font-family: 'JetBrains Mono';
    font-size: 11px;
    color: #888;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot { width: 6px; height: 6px; border-radius: 50%; }
  .pulse-green { background: #00ff88; box-shadow: 0 0 8px #00ff88; animation: pulse 2s infinite; }

  .copyright {
    font-size: 12px;
    color: #555;
    line-height: 1.6;
    margin-top: 10px;
  }
  .faded { color: #333; font-size: 10px; font-family: 'JetBrains Mono'; }

  /* RIGHT SIDE */
  .footer-right {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .nav-header {
    margin: 0;
    font-family: 'JetBrains Mono';
    font-size: 10px;
    color: #555;
    letter-spacing: 2px;
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .f-link {
    text-decoration: none;
    color: #888;
    font-size: 13px;
    font-weight: 600;
    transition: 0.2s;
    display: flex;
    align-items: center;
  }

  .f-link:hover {
    color: #00f2ff;
    padding-left: 5px;
  }

  /* UTILS */
  .text-cyan { color: #00f2ff; }
  .text-purple { color: #7b00ff; }
  .mono { font-family: 'JetBrains Mono'; }

  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

  @media (max-width: 600px) {
    .footer-container { flex-direction: column; }
  }
`;