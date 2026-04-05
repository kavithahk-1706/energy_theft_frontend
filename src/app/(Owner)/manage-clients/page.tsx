"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Network, Search, Plus, Trash2, 
  ArrowRight, ShieldCheck, ZapOff, Activity,
  Download, ChevronDown, X, Loader2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ManageOrgsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', region: '', status: 'PROVISIONING' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE}/clients`);
      const data = await res.json();
      if (data.success) setClients(data.clients);
    } catch (e) {
      console.error("Failed to fetch clients", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleDelete = async (slug: string, name: string) => {
    if (!window.confirm(`CRITICAL WARNING: Are you sure you want to remove ${name} from the registry? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/clients/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setClients(clients.filter(c => c.slug !== slug));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleCreateClient = async () => {
    setError('');
    if (!formData.name || !formData.slug) {
      setError('Name and slug are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Something went wrong.');
      } else {
        setShowModal(false);
        setFormData({ name: '', slug: '', region: '', status: 'PROVISIONING' });
        fetchClients();
      }
    } catch (e) {
      setError('Could not connect to API.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ORG_ID', 'CLIENT_NAME', 'SLUG', 'REGION', 'STATUS'];
    const csvRows = filteredClients.map(c =>
      [c.id, c.name, c.slug, c.region, c.status].join(',')
    );
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sudarshan_registry_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="manage-root">
      <style dangerouslySetInnerHTML={{ __html: MANAGE_STYLES }} />

      <header className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Network className="text-cyan-400" size={28} />
            CLIENT_REGISTRY
          </h1>
          <p className="page-sub text-gray-400 font-mono text-xs mt-2 tracking-widest">
            GLOBAL_NETWORK_OVERVIEW // {clients.length}_TOTAL_NODES
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> REGISTER_NEW_ORG
        </button>
      </header>

      {/* CONTROLS */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search organizations by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <div className="custom-select-wrapper">
            <select
              className="select-dropdown"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PROVISIONING">PROVISIONING</option>
              <option value="TESTING">TESTING</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
            <ChevronDown size={14} className="select-icon text-gray-400" />
          </div>
          <button className="btn-icon" onClick={handleExportCSV}>
            <Download size={16} /> EXPORT_CSV
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="table-container custom-scroll">
        {loading ? (
          <div className="empty-state">
            <Loader2 size={32} className="text-gray-600 mb-3 animate-spin" />
            <p>FETCHING_CLIENT_REGISTRY...</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ORG_ID</th>
                <th>CLIENT_NAME</th>
                <th>ROUTING_SLUG</th>
                <th>REGION</th>
                <th>STATUS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="table-row">
                  <td className="font-mono text-xs text-gray-500">{client.id}</td>
                  <td className="font-bold text-white">{client.name}</td>
                  <td><span className="slug-tag">/{client.slug}</span></td>
                  <td className="text-gray-400">{client.region || '—'}</td>
                  <td><StatusBadge status={client.status} /></td>
                  <td className="actions-cell">
                    <Link href={`/${client.slug}`} className="btn-access">
                      ACCESS_DASH <ArrowRight size={14} />
                    </Link>
                    <button className="btn-delete" onClick={() => handleDelete(client.slug, client.name)} title="Purge Record">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredClients.length === 0 && (
          <div className="empty-state">
            <ZapOff size={32} className="text-gray-600 mb-3" />
            <p>NO_ORGANIZATIONS_FOUND_MATCHING_QUERY</p>
          </div>
        )}
      </div>

      {/* CREATE ORG MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>REGISTER_NEW_ORG</span>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <div className="modal-body">
              <div className="field-group">
                <label>CLIENT_NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. Tata Power"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>ROUTING_SLUG *</label>
                <input
                  type="text"
                  placeholder="e.g. tata-power (used in dashboard URL)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                />
              </div>
              <div className="field-group">
                <label>REGION</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>INITIAL_STATUS</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="PROVISIONING">PROVISIONING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="TESTING">TESTING</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              {error && <p className="modal-error">{error}</p>}

              <button className="btn-submit" onClick={handleCreateClient} disabled={submitting}>
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {submitting ? 'REGISTERING...' : 'CONFIRM_REGISTER'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colorClass = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  let Icon = Activity;

  if (status === 'ACTIVE') { colorClass = "bg-green-500/10 text-green-400 border-green-500/20"; Icon = ShieldCheck; }
  else if (status === 'TESTING' || status === 'PROVISIONING') { colorClass = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"; Icon = Activity; }
  else if (status === 'SUSPENDED') { colorClass = "bg-red-500/10 text-red-400 border-red-500/20"; Icon = ZapOff; }

  return (
    <span className={`status-badge ${colorClass}`}>
      <Icon size={10} />
      {status}
    </span>
  );
}

const MANAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;600;700&display=swap');

  .manage-root { min-height: 100vh; padding: 120px 5% 50px; background: #030303; font-family: 'Inter', sans-serif; }

  .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
  .page-title { font-size: 28px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.5px; }

  .btn-primary { background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
  .btn-primary:hover { background: #00f2ff; box-shadow: 0 0 15px rgba(0,242,255,0.4); }

  .controls-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 20px; }
  .search-box { flex: 1; max-width: 400px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 15px; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
  .search-box:focus-within { border-color: #00f2ff; background: rgba(0,242,255,0.02); }
  .search-box input { background: transparent; border: none; color: #fff; font-size: 13px; width: 100%; outline: none; font-family: 'JetBrains Mono'; }

  .filter-group { display: flex; gap: 10px; align-items: center; }
  .custom-select-wrapper { position: relative; display: flex; align-items: center; }
  .select-dropdown { appearance: none; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #ccc; padding: 8px 35px 8px 15px; border-radius: 8px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; cursor: pointer; outline: none; transition: 0.2s; }
  .select-dropdown:hover, .select-dropdown:focus { border-color: #7b00ff; color: #fff; background: rgba(123,0,255,0.05); }
  .select-dropdown option { background: #111; color: #fff; }
  .select-icon { position: absolute; right: 12px; pointer-events: none; }

  .btn-icon { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #ccc; padding: 8px 15px; border-radius: 8px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
  .btn-icon:hover { background: rgba(255,255,255,0.08); color: #fff; }

  .table-container { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow-x: auto; }
  .data-table { width: 100%; border-collapse: collapse; text-align: left; }
  .data-table th { background: rgba(0,0,0,0.4); padding: 15px 20px; font-family: 'JetBrains Mono'; font-size: 10px; color: #666; font-weight: 700; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .table-row { border-bottom: 1px solid rgba(255,255,255,0.05); transition: 0.2s; }
  .table-row:hover { background: rgba(255,255,255,0.03); }
  .data-table td { padding: 16px 20px; font-size: 13px; }

  .slug-tag { background: rgba(123,0,255,0.1); color: #b366ff; border: 1px solid rgba(123,0,255,0.2); padding: 4px 8px; border-radius: 6px; font-family: 'JetBrains Mono'; font-size: 11px; }
  .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 50px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; border: 1px solid transparent; }
  .actions-cell { display: flex; justify-content: flex-end; align-items: center; gap: 15px; }
  .btn-access { background: rgba(0,242,255,0.1); color: #00f2ff; border: 1px solid rgba(0,242,255,0.2); padding: 8px 12px; border-radius: 6px; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; text-decoration: none; transition: 0.2s; }
  .btn-access:hover { background: #00f2ff; color: #000; box-shadow: 0 0 10px rgba(0,242,255,0.3); }
  .btn-delete { background: transparent; border: none; color: #ff4444; cursor: pointer; padding: 5px; transition: 0.2s; border-radius: 4px; }
  .btn-delete:hover { background: rgba(255,68,68,0.1); color: #ff6666; transform: scale(1.1); }

  .empty-state { padding: 60px 20px; text-align: center; font-family: 'JetBrains Mono'; font-size: 12px; color: #555; display: flex; flex-direction: column; align-items: center; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  .modal-box { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; width: 100%; max-width: 480px; overflow: hidden; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 25px; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; color: #00f2ff; letter-spacing: 2px; }
  .modal-header button { background: none; border: none; color: #666; cursor: pointer; transition: 0.2s; }
  .modal-header button:hover { color: #fff; }
  .modal-body { padding: 25px; display: flex; flex-direction: column; gap: 18px; }
  .field-group { display: flex; flex-direction: column; gap: 8px; }
  .field-group label { font-family: 'JetBrains Mono'; font-size: 10px; color: #666; font-weight: 700; letter-spacing: 1px; }
  .field-group input, .field-group select { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 14px; border-radius: 8px; font-family: 'JetBrains Mono'; font-size: 12px; outline: none; transition: 0.2s; }
  .field-group input:focus, .field-group select:focus { border-color: #00f2ff; background: rgba(0,242,255,0.02); }
  .field-group select option { background: #111; }
  .modal-error { font-family: 'JetBrains Mono'; font-size: 11px; color: #ff4444; background: rgba(255,68,68,0.08); border: 1px solid rgba(255,68,68,0.2); padding: 10px 14px; border-radius: 6px; }
  .btn-submit { background: #fff; color: #000; border: none; padding: 12px 20px; border-radius: 8px; font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; margin-top: 5px; }
  .btn-submit:hover { background: #00f2ff; box-shadow: 0 0 15px rgba(0,242,255,0.4); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .custom-scroll::-webkit-scrollbar { height: 6px; }
  .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .animate-spin { animation: spin 1s linear infinite; }

  @media (max-width: 768px) {
    .controls-bar { flex-direction: column; align-items: stretch; }
    .search-box { max-width: 100%; }
    .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
    .filter-group { width: 100%; display: flex; justify-content: space-between; }
  }
`;