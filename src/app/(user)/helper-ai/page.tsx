"use client";

import { Bot, User, Command, Zap, ShieldCheck, Globe } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

export default function HelperAIPage() {
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;

    const userMsg = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: localInput 
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setLocalInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) throw new Error("Neural link failed.");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      const aiId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: aiId, role: 'assistant', content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const cleaned = text
          .replace(/^\d+:"/g, '')
          .replace(/"$/g, '')
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"');

        aiContent += cleaned;

        setMessages((prev) => 
          prev.map((msg) => msg.id === aiId ? { ...msg, content: aiContent } : msg)
        );
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev, 
        { id: 'err', role: 'assistant', content: "⚠️ CONNECTION ERROR: Link lost." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neural-container">
      <style dangerouslySetInnerHTML={{ __html: NEURAL_TERMINAL_CSS }} />
      <main className="chat-engine">
        
        <header className="terminal-header">
          <div className="status-indicator">
            <span className="pulse-dot" />
            <span className="status-text">VOLTGUARD NEURAL LINK ACTIVE // 2026.01.31</span>
          </div>
        </header>

        <section className="conversation-stream" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="sdg-badge">⚡ SUSTAINABLE DEVELOPMENT GOALS TARGETED</div>
              <h3>Empowering Clean & Secure Energy</h3>
              
              <div className="sdg-grid">
                <div className="sdg-card">
                  <Zap size={20} color="#eab308" />
                  <span><strong>SDG 7</strong><br/>Affordable Energy</span>
                </div>
                <div className="sdg-card">
                  <ShieldCheck size={20} color="#22c55e" />
                  <span><strong>SDG 9</strong><br/>Innovation</span>
                </div>
                <div className="sdg-card">
                  <Globe size={20} color="#3b82f6" />
                  <span><strong>SDG 12</strong><br/>Responsibility</span>
                </div>
              </div>

              <p className="instruction">Report energy theft or unusual consumption to begin.</p>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`neural-msg ${m.role === 'user' ? 'user' : 'ai'}`}>
              <div className="msg-icon">
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="msg-content">
                <div className="msg-bubble">
                  {m.content}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="neural-msg ai">
              <div className="thinking-loader">
                <span /><span /><span />
              </div>
            </div>
          )}
        </section>

        <footer className="input-enclave">
          <form onSubmit={handleCustomSubmit} className="input-wrapper">
            <input 
              value={localInput} 
              onChange={(e) => setLocalInput(e.target.value)} 
              placeholder="Query the VoltGuard Neural Link..." 
              autoFocus
              disabled={isLoading}
            />
            <button type="submit" className="execute-btn" disabled={isLoading || !localInput.trim()}>
              {isLoading ? 'SYNCING...' : 'EXECUTE'} 
              <Command size={14} />
            </button>
          </form>
          <div className="disclaimer">Detection protocol updates within 3-12 hours.</div>
        </footer>
      </main>
    </div>
  );
}

const NEURAL_TERMINAL_CSS = `
  .neural-container { background: #09090b; min-height: 100vh; color: #fafafa; font-family: 'Inter', ui-sans-serif, system-ui; }
  .chat-engine { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; height: 100vh; border-left: 1px solid #18181b; border-right: 1px solid #18181b; }
  
  .terminal-header { padding: 1rem 2rem; border-bottom: 1px solid #18181b; background: rgba(9, 9, 11, 0.8); backdrop-filter: blur(10px); }
  .status-indicator { display: flex; align-items: center; gap: 0.75rem; }
  .pulse-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 12px #22c55e; animation: pulse 2s infinite; }
  .status-text { font-size: 0.65rem; letter-spacing: 0.2em; color: #a1a1aa; font-weight: 800; }

  .conversation-stream { flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; scroll-behavior: smooth; }
  
  .empty-state { text-align: center; margin: auto; padding: 2rem; border-radius: 20px; background: rgba(24, 24, 27, 0.5); border: 1px solid #27272a; max-width: 500px; }
  .sdg-badge { font-size: 0.65rem; background: #18181b; padding: 4px 12px; border-radius: 99px; border: 1px solid #3f3f46; color: #71717a; margin-bottom: 1rem; display: inline-block; }
  .sdg-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 1.5rem 0; }
  .sdg-card { background: #09090b; border: 1px solid #27272a; padding: 12px 8px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 0.75rem; color: #71717a; }
  .sdg-card strong { color: #e4e4e7; display: block; }
  .instruction { font-size: 0.85rem; color: #71717a; }

  .neural-msg { display: flex; gap: 1rem; animation: fadeIn 0.4s ease-out; }
  .neural-msg.user { flex-direction: row-reverse; }
  
  .msg-bubble { 
    padding: 0.85rem 1.1rem; 
    border-radius: 14px; 
    max-width: 85%; 
    font-size: 0.95rem; 
    line-height: 1.6; 
    white-space: pre-wrap; 
  }
  .ai .msg-bubble { background: #18181b; border: 1px solid #27272a; color: #e4e4e7; border-bottom-left-radius: 2px; }
  .user .msg-bubble { background: #3f3f46; color: #ffffff; border: 1px solid #52525b; border-bottom-right-radius: 2px; }

  .input-enclave { padding: 1.5rem 2rem 2rem; border-top: 1px solid #18181b; background: #09090b; }
  .input-wrapper { display: flex; gap: 0.75rem; background: #18181b; padding: 0.7rem; border-radius: 12px; border: 1px solid #27272a; }
  
  input { flex: 1; background: transparent; border: none; color: white; outline: none; padding: 0.5rem; font-size: 0.95rem; }
  .execute-btn { background: #fafafa; color: #09090b; border: none; padding: 0.5rem 1.2rem; border-radius: 8px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: all 0.2s; }
  .execute-btn:hover:not(:disabled) { background: #ffffff; transform: scale(1.02); }
  .execute-btn:disabled { opacity: 0.4; filter: grayscale(1); }

  .disclaimer { font-size: 0.65rem; color: #3f3f46; margin-top: 1rem; text-align: center; letter-spacing: 0.05em; }

  .thinking-loader { display: flex; gap: 5px; padding: 0.5rem; }
  .thinking-loader span { width: 6px; height: 6px; background: #3f3f46; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out; }
  .thinking-loader span:nth-child(2) { animation-delay: 0.2s; }
  .thinking-loader span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; } }
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); } 40% { transform: scale(1.2); background: #71717a; } }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
`;