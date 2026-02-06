"use client";

import dynamic from 'next/dynamic';
import React from 'react';

/**
 * HYDRATION_ENGINE v9.0
 * Purpose: Defeats "window is not defined" and "container in use" errors 
 * by isolating the entire Leaflet ecosystem from the Next.js Server Runtime.
 */
const HyderabadTacticalMap = dynamic(
  () => import('@/components/TacticalMap'),
  { 
    ssr: false,
    loading: () => <SystemBootloader />
  }
);

/**
 * SYSTEM_BOOTLOADER
 * Refined for the v9.0 "Violate" architecture.
 */
function SystemBootloader() {
  return (
    <div className="boot-wrapper">
      <div className="boot-container">
        <div className="boot-header">
          <div className="boot-glitch" data-text="VOLTGUARD_OS">VOLTGUARD_OS</div>
          <div className="boot-sub">KERNEL_V9.0_STABLE // BUILD_2026_HYD</div>
        </div>

        <div className="boot-loader-track">
          <div className="boot-loader-fill"></div>
        </div>

        <div className="boot-terminal">
          <div className="term-line">INITIALIZING_TURBOPACK_CONTEXT... <span className="text-violet">READY</span></div>
          <div className="term-line">LOADING_GEOSPATIAL_SINGLETONS... <span className="text-violet">OK</span></div>
          <div className="term-line">WIPING_STALE_LEAFLET_INSTANCES... <span className="text-violet">DONE</span></div>
          <div className="term-line animate-pulse">MOUNTING_TACTICAL_INTERFACE... [PENDING]</div>
        </div>

        <div className="boot-footer">
          VIRTUAL_VOLTAGE_MONITOR_ACTIVE
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: BootCSS }} />
    </div>
  );
}

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#05010a]">
      <HyderabadTacticalMap />
    </main>
  );
}

// --- REFINED TACTICAL BOOT CSS ---
const BootCSS = `
  .boot-wrapper {
    height: 100vh;
    width: 100vw;
    background: #05010a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    color: #e0d7ed;
    margin-top:20%;
  }

  .boot-container {
    width: 420px;
    display: flex;
    flex-direction: column;
    gap: 35px;
  }

  .boot-glitch {
    font-size: 26px;
    font-weight: 900;
    letter-spacing: 6px;
    color: #bc13fe;
    position: relative;
    text-shadow: 0.05em 0 0 rgba(255, 0, 85, 0.75),
                -0.025em -0.05em 0 rgba(0, 255, 255, 0.75);
    animation: glitch 500ms infinite;
  }

  .boot-sub {
    font-size: 8px;
    color: #6b7280;
    letter-spacing: 2px;
    margin-top: 5px;
    opacity: 0.6;
  }

  .boot-loader-track {
    height: 1px;
    width: 100%;
    background: rgba(46, 16, 101, 0.5);
    position: relative;
    overflow: hidden;
  }

  .boot-loader-fill {
    position: absolute;
    height: 100%;
    width: 30%;
    background: #bc13fe;
    box-shadow: 0 0 20px #bc13fe;
    animation: slide 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }

  .boot-terminal {
    background: rgba(14, 4, 26, 0.8);
    border: 1px solid #2e1065;
    padding: 25px;
    border-radius: 2px;
    font-size: 10px;
    line-height: 2;
    box-shadow: inset 0 0 20px rgba(188, 19, 254, 0.05);
  }

  .text-violet { color: #bc13fe; font-weight: bold; }

  .boot-footer {
    text-align: center;
    font-size: 7px;
    opacity: 0.3;
    letter-spacing: 5px;
    text-transform: uppercase;
  }

  @keyframes slide {
    from { left: -50%; }
    to { left: 150%; }
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 1px); }
    40% { transform: translate(-2px, -1px); }
    60% { transform: translate(2px, 1px); }
    80% { transform: translate(2px, -1px); }
    100% { transform: translate(0); }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }
`;