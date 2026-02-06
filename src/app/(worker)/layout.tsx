"use client";
import React from 'react';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="worker-pink-interface">
      <style dangerouslySetInnerHTML={{ __html: BENTO_THEME_CSS }} />
      <div className="magenta-glow" />
      <div className="bento-container">
        {children}
      </div>
    </div>
  );
}

const BENTO_THEME_CSS = `
  :root {
    --accent-pink: #ff00ff;
    --deep-violet: #2d004d;
    --bento-bg: rgba(20, 0, 30, 0.6);
    --bento-border: rgba(255, 0, 255, 0.15);
  }

  .worker-pink-interface {
    min-height: 100vh;
    background: #050008;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    padding-top: 100px;
  }

  .magenta-glow {
    position: fixed;
    top: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 0, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .bento-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
    position: relative;
    z-index: 10;
  }

  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 180px;
    gap: 20px;
  }

  .bento-box {
    background: var(--bento-bg);
    border: 1px solid var(--bento-border);
    border-radius: 24px;
    padding: 24px;
    backdrop-filter: blur(10px);
    transition: 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .bento-box:hover {
    border-color: var(--accent-pink);
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.1);
  }

  .box-label {
    font-size: 10px;
    color: var(--accent-pink);
    letter-spacing: 2px;
    font-weight: 800;
  }
`;