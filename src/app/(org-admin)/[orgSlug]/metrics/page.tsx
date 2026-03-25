"use client";
import React, { useState, use } from 'react';
import { Activity, Target, Crosshair, BarChart, ShieldAlert, Cpu, FileText, PieChart, X, ZoomIn, TrendingUp, Download, ChevronRight,ChartBar, CpuIcon, Shield } from 'lucide-react';
import Link from 'next/link';

interface PerformanceStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  border: string;
}

interface MetricChart {
  id: string;
  title: string;
  src: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  desc: string;
}

export default function ModelMetrics({ params }: { params: Promise<{ orgSlug: string }> }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.orgSlug || 'demo-utility';

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const performanceStats: PerformanceStat[] = [
    { label: "MODEL", value: "Random Forest", icon: CpuIcon, color: "text-amber-400", border: "border-cyan-500/20" },
    { label: "ACCURACY", value: "98.2%", icon: Target, color: "text-emerald-400", border: "border-cyan-500/20" },
    { label: "F1 SCORE", value: "99.5%", icon: ChartBar, color: "text-cyan-400", border: "border-cyan-500/20" },
    { label: "LATENCY", value: "24ms", icon: Activity, color: "text-purple-400", border: "border-purple-500/20" },
    { label: "PRECISION", value: "0.94", icon: Crosshair, color: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "UPTIME", value: "99.9%", icon: ShieldAlert, color: "text-amber-400", border: "border-amber-500/20" },
  ];

  const charts: MetricChart[] = [
    {
      id: "roc-curve",
      title: "ROC / AUC Curve",
      src: "/metrics/roc_curve.png",
      icon: TrendingUp,
      color: "text-cyan-400",
      glow: "rgba(34, 211, 238, 0.2)",
      desc: "Receiver operating characteristic — true positive rate vs false positive rate across thresholds"
    },
    {
      id: "confusion-matrix",
      title: "Confusion Matrix",
      src: "/metrics/confusion_matrix.png",
      icon: PieChart,
      color: "text-purple-400",
      glow: "rgba(168, 85, 247, 0.2)",
      desc: "Predicted vs actual class distribution — TP, FP, TN, FN breakdown"
    },
    {
      id: "feature-importance",
      title: "Feature Importance",
      src: "/metrics/feature_importance.png",
      icon: BarChart,
      color: "text-emerald-400",
      glow: "rgba(52, 211, 153, 0.2)",
      desc: "Relative contribution of each input feature to model decisions"
    },
  ];

  const handleDownload = (src: string, title: string) => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
    a.click();
  };

  return (
    <div className="h-auto min-h-screen bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">

      {/* ZOOM LIGHTBOX */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <div className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10">
            <X size={32} />
          </div>
          <img
            src={selectedImg}
            alt="Enlarged"
            className="w-[80vw] h-[80vh] object-contain rounded-lg border border-white/10"
          />
        </div>
      )}

      {/* HEADER */}
      <div className="mb-10 border-b border-white/10 pb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold font-mono mb-6">
            <Link href={`/${slug}`} className="text-white/60 hover:text-white transition-colors">{slug.toUpperCase()}</Link>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-white/30">MODEL METRICS</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Shield className="text-purple-500" size={32} />
            SUDARSHAN <span className="text-white/40">ENGINE METRICS</span>
          </h1>
        </div>
        <a
          href="/metrics_report.pdf"
          download="metrics_report.pdf"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-md text-cyan-400 text-xs font-bold tracking-widest uppercase transition-colors"
        >
          <Download size={14} />
          Export PDF
        </a>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
        {performanceStats.map((stat, i) => (
          <div key={i} className={`bg-white/5 border ${stat.border} p-6 rounded-lg relative overflow-hidden group hover:bg-white/10 transition-colors`}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-bold text-white/50 tracking-[0.1em]">{stat.label}</span>
            </div>
            <div className="text-3xl font-black tracking-wide">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((chart) => (
          <div key={chart.id} className="bg-white/5 border border-white/10 rounded-lg p-5 flex flex-col group">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <chart.icon size={16} className={chart.color} />
                <h2 className="text-[11px] font-bold tracking-widest text-white/70 uppercase">{chart.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(chart.src, chart.title); }}
                  className="text-white/20 hover:text-white/70 transition-colors"
                  title="Download"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => setSelectedImg(chart.src)}
                  className="text-white/20 group-hover:text-white/60 transition-colors"
                  title="Zoom"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>
            <div
              className="flex-1 bg-black/40 border border-white/5 rounded-md flex items-center justify-center p-4 overflow-hidden relative cursor-zoom-in min-h-[200px]"
              onClick={() => setSelectedImg(chart.src)}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <img
                src={chart.src}
                alt={chart.title}
                className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110"
                style={{ filter: `drop-shadow(0 0 12px ${chart.glow})` }}
              />
            </div>
            <p className="text-[9px] text-white/30 tracking-wider mt-4 leading-relaxed uppercase italic">
              {chart.desc}
            </p>
          </div>
        ))}

        {/* FULL WIDTH TABLE */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-lg p-6 group">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-cyan-400" />
              <h2 className="text-sm font-bold tracking-widest text-white/80 uppercase">Full Model Comparison Matrix</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload("/metrics/model_comparison_table.png", "Model Comparison Table"); }}
                className="text-white/20 hover:text-white/70 transition-colors"
                title="Download"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => setSelectedImg("/metrics/model_comparison_table.png")}
                className="text-white/20 hover:text-white/60 transition-colors"
                title="Zoom"
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>
          <div
            className="cursor-zoom-in bg-black/60 rounded-md p-4 flex justify-center relative overflow-hidden"
            onClick={() => setSelectedImg("/metrics/model_comparison_table.png")}
          >
            <img
              src="/metrics/model_comparison_table.png"
              className="w-full max-h-80 object-contain transition-transform group-hover:scale-[1.02]"
              alt="Model Comparison Table"
            />
          </div>
        </div>
      </div>
    </div>
  );
}