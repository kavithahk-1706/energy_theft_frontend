"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, Download, Zap, History, ShieldCheck, 
  Printer, Share2, CreditCard, Search, Activity, Lock,
  ChevronRight, BarChart3, Info, Wifi, Cpu
} from 'lucide-react';

// Dataset Interface
interface BillingRecord {
  invoice_id: string;
  meter_id: string;
  period: string;
  prev_reading: number;
  curr_reading: number;
  usage: number;
  total_cost: number;
  status: "Paid" | "Pending";
  due_date: string;
}

import rawBillingData from '../../../../public/data/user-billing.json';
const billingData = rawBillingData as BillingRecord[];

export default function VirtualCardBillsPage() {
  const ASSIGNED_METER_ID = "MTR-100001"; 
  const USER_NAME = "PRUTHVI VOJJALA"; // Custom name for the card

  const [selectedInvoice, setSelectedInvoice] = useState<BillingRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const userHistory = useMemo(() => {
    return (billingData || [])
      .filter(bill => bill.meter_id === ASSIGNED_METER_ID)
      .sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime());
  }, [ASSIGNED_METER_ID]);

  const analytics = useMemo(() => {
    if (userHistory.length === 0) return { totalUsage: 0, avgUsage: 0, unpaid: 0, count: 0 };
    const totalUsage = userHistory.reduce((acc, b) => acc + (b.usage || 0), 0);
    const unpaid = userHistory.filter(b => b.status === "Pending").reduce((acc, b) => acc + (b.total_cost || 0), 0);
    return { totalUsage, avgUsage: totalUsage / userHistory.length, unpaid, count: userHistory.length };
  }, [userHistory]);

  useEffect(() => {
    if (userHistory.length > 0) setSelectedInvoice(userHistory[0]);
    setTimeout(() => setLoading(false), 800);
  }, [userHistory]);

  const filtered = userHistory.filter(b => 
    (b.period || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.invoice_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loader-container"><style dangerouslySetInnerHTML={{ __html: INTERNAL_CSS }} /><Zap className="loader-icon" /></div>;

  return (
    <div className="portal-root">
      <style dangerouslySetInnerHTML={{ __html: INTERNAL_CSS }} />
      
      <aside className="sidebar-hud">
        <div className="logo-area">
          <Zap size={24} color="#d946ef" fill="#d946ef" />
          <span>VOLT<span className="text-violet">GUARD</span></span>
        </div>
        <nav className="side-nav">
          <div className="nav-item active"><BarChart3 size={18}/> Hub</div>
          <div className="nav-item"><History size={18}/> Ledger</div>
          <div className="nav-item"><CreditCard size={18}/> Cards</div>
        </nav>
        <div className="hardware-lock">
          <Lock size={14} />
          <p>ENCRYPTED_SESSION</p>
        </div>
      </aside>

      <main className="content-area">
        <div className="top-layout">
          {/* VIRTUAL ENERGY CARD SECTION */}
          <section className="card-showcase">
            <div className="energy-card">
              <div className="card-glow" />
              <div className="card-content">
                <div className="card-top">
                  <div className="card-brand">
                    <Zap size={20} fill="white" />
                    <span>VOLTGUARD PREMIUM</span>
                  </div>
                  <Wifi size={20} className="nfc-icon" />
                </div>
                
                <div className="card-middle">
                  <div className="chip-container">
                    <div className="card-chip" />
                  </div>
                  <div className="meter-id-display">
                    {ASSIGNED_METER_ID.match(/.{1,4}/g)?.join(' ')}
                  </div>
                </div>

                <div className="card-bottom">
                  <div className="card-holder">
                    <label>CARD HOLDER</label>
                    <div className="name">{USER_NAME}</div>
                  </div>
                  <div className="card-expiry">
                    <label>VALID THRU</label>
                    <div className="date">12/30</div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK STATS NEXT TO CARD */}
            <div className="card-side-stats">
                <div className="mini-stat">
                    <label>CURRENT DEBT</label>
                    <div className="val">₹{analytics.unpaid.toFixed(2)}</div>
                </div>
                <div className="mini-stat">
                    <label>LIFETIME KWH</label>
                    <div className="val">{analytics.totalUsage.toFixed(0)}</div>
                </div>
            </div>
          </section>
        </div>

        <div className="grid-layout">
          <section className="ledger-box">
            <div className="ledger-header">
              <h2>Transaction Ledger</h2>
              <div className="search-wrap">
                <Search size={16} />
                <input placeholder="Search invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="table-scroll">
              <table className="volt-table">
                <thead>
                  <tr>
                    <th>Cycle</th>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(bill => (
                    <tr key={bill.invoice_id} className={selectedInvoice?.invoice_id === bill.invoice_id ? 'selected' : ''} onClick={() => setSelectedInvoice(bill)}>
                      <td>{bill.period}</td>
                      <td className="mono">{bill.invoice_id}</td>
                      <td className="price">₹{bill.total_cost.toFixed(2)}</td>
                      <td><span className={`pill ${bill.status.toLowerCase()}`}>{bill.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="inspector-box">
            {selectedInvoice && (
              <div className="invoice-detail">
                <div className="detail-header">
                  <div className="chip">SELECTED_NODE</div>
                  <h3>{selectedInvoice.invoice_id}</h3>
                  <p>Period: {selectedInvoice.period}</p>
                </div>
                <div className="detail-list">
                    <div className="d-row"><span>Readings</span> <span>{selectedInvoice.prev_reading} → {selectedInvoice.curr_reading}</span></div>
                    <div className="d-row"><span>Total Energy</span> <span>{selectedInvoice.usage} kWh</span></div>
                    <div className="total-row"><span>Due</span> <span>₹{selectedInvoice.total_cost.toFixed(2)}</span></div>
                </div>
                <div className="actions">
                  <button className="btn-pay"><CreditCard size={18}/> AUTHORIZE PAYMENT</button>
                  <button className="btn-sec"><Download size={16}/> DOWNLOAD INVOICE</button>
                </div>
              </div>
            )}
            <div className="disclaimer"><Info size={16} /><p>This card is non-transferable and linked to your hardware ID.</p></div>
          </aside>
        </div>
      </main>
    </div>
  );
}

const INTERNAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

  :root {
    --bg: #07040a;
    --card: #12091d;
    --border: #221431;
    --primary: #d946ef;
    --text: #f5f3ff;
    --text-dim: #71717a;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; margin-top: 6%; }

  .portal-root { display: flex; height: 100vh; width: 100vw; }
  .sidebar-hud { width: 240px; border-right: 1px solid var(--border); background: #000; padding: 30px; display: flex; flex-direction: column; }
  .logo-area { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.1rem; margin-bottom: 40px; }
  .text-violet { color: var(--primary); }
  .side-nav { flex: 1; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; cursor: pointer; color: var(--text-dim); font-size: 14px; margin-bottom: 8px; }
  .nav-item.active { background: rgba(217, 70, 239, 0.1); color: var(--primary); }
  .hardware-lock { padding: 15px; background: #0f0f0f; border-radius: 10px; text-align: center; }
  .hardware-lock p { font-size: 9px; color: var(--primary); font-weight: bold; }

  .content-area { flex: 1; overflow-y: auto; padding: 40px; background: radial-gradient(circle at top right, #130722, #07040a); }

  /* VIRTUAL CARD STYLES */
  .card-showcase { display: flex; gap: 30px; margin-bottom: 40px; align-items: center; }
  .energy-card {
    width: 400px; height: 240px;
    background: linear-gradient(135deg, #d946ef 0%, #7c3aed 100%);
    border-radius: 24px;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.2);
    transition: 0.4s ease;
  }
  .energy-card:hover { transform: translateY(-5px) rotateX(5deg); }
  .card-glow { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); pointer-events: none; }
  
  .card-content { padding: 30px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; position: relative; z-index: 2; }
  .card-top { display: flex; justify-content: space-between; align-items: center; }
  .card-brand { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 14px; letter-spacing: 1px; }
  .nfc-icon { opacity: 0.6; }

  .card-chip { width: 45px; height: 35px; background: linear-gradient(135deg, #ffd700, #b8860b); border-radius: 6px; position: relative; }
  .card-chip::after { content: ''; position: absolute; inset: 5px; border: 1px solid rgba(0,0,0,0.2); border-radius: 3px; }
  
  .meter-id-display { font-family: 'JetBrains Mono'; font-size: 22px; font-weight: 700; letter-spacing: 3px; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
  
  .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
  .card-bottom label { display: block; font-size: 8px; font-weight: 800; opacity: 0.7; margin-bottom: 4px; }
  .card-bottom .name { font-size: 14px; font-weight: 700; letter-spacing: 1px; }

  .card-side-stats { display: flex; flex-direction: column; gap: 15px; }
  .mini-stat { background: var(--card); border: 1px solid var(--border); padding: 20px; border-radius: 20px; width: 200px; }
  .mini-stat label { display: block; font-size: 9px; color: var(--text-dim); font-weight: 800; margin-bottom: 5px; }
  .mini-stat .val { font-size: 1.2rem; font-weight: 800; color: var(--primary); }

  /* GRID */
  .grid-layout { display: grid; grid-template-columns: 1.8fr 1fr; gap: 30px; }
  .ledger-box { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 25px; }
  .ledger-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .search-wrap { display: flex; align-items: center; gap: 10px; background: #000; padding: 8px 15px; border-radius: 10px; border: 1px solid var(--border); }
  .search-wrap input { background: none; border: none; color: #fff; outline: none; font-size: 12px; }
  
  .table-scroll { height: 450px; overflow-y: auto; }
  .volt-table { width: 100%; border-collapse: collapse; }
  .volt-table th { text-align: left; padding: 12px; font-size: 10px; color: var(--text-dim); text-transform: uppercase; border-bottom: 1px solid var(--border); }
  .volt-table td { padding: 15px 12px; font-size: 13px; border-bottom: 1px solid var(--border); cursor: pointer; }
  .volt-table tr.selected td { background: rgba(217, 70, 239, 0.05); color: var(--primary); font-weight: 600; }
  .pill { padding: 3px 10px; border-radius: 20px; font-size: 9px; font-weight: 800; text-transform: uppercase; }
  .pill.paid { color: #22c55e; background: rgba(34, 197, 94, 0.1); }
  .pill.pending { color: var(--primary); background: rgba(217, 70, 239, 0.1); }

  .invoice-detail { background: var(--card); border: 1px solid var(--border); padding: 30px; border-radius: 24px; }
  .chip { font-size: 8px; background: var(--primary); color: #fff; width: fit-content; padding: 2px 8px; border-radius: 4px; margin-bottom: 10px; font-weight: 800; }
  .detail-list { margin: 20px 0; display: flex; flex-direction: column; gap: 15px; }
  .d-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-dim); }
  .total-row { display: flex; justify-content: space-between; padding-top: 15px; border-top: 1px dashed var(--border); font-size: 1.5rem; font-weight: 800; color: var(--primary); }
  
  .actions { display: flex; flex-direction: column; gap: 10px; margin-top: 25px; }
  .btn-pay { background: var(--primary); color: #fff; border: none; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
  .btn-pay:hover { filter: brightness(1.1); box-shadow: 0 10px 20px rgba(217, 70, 239, 0.2); }
  .btn-sec { background: none; border: 1px solid var(--border); color: #fff; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: 600; cursor: pointer; }

  .disclaimer { display: flex; gap: 10px; padding: 20px; border-radius: 15px; background: #0c0812; border: 1px solid var(--border); font-size: 11px; margin-top: 20px; color: var(--text-dim); }
  .loader-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #07040a; }
  .loader-icon { color: var(--primary); animation: spin 1s infinite linear; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;