"use client";

import React, { useState, useRef, use } from 'react';
import { UploadCloud, FileText, Play, Target, Activity, ShieldAlert, CheckCircle, AlertTriangle, X, Database } from 'lucide-react';


export default function ClientOverviewDashboard({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug: slug } = use(params) || "demo-utility";
  
  const [mode, setMode] = useState<'BATCH' | 'SINGLE'>('BATCH');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  // For the 9 numerical features + 1 categorical
  const numericalFeatures = ['Voltage_Drop', 'Current_Spike', 'Harmonic_Distortion', 'Phase_Imbalance', 'Off_Peak_Load', 'Peak_Load_Variance', 'Temp_Correlation', 'Reactive_Power', 'Power_Factor'];
  const [singleData, setSingleData] = useState<Record<string, string>>({});

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const simulateScan = () => {
    if (mode === 'BATCH' && !file) return;
    setIsScanning(true);
    setResults(null);

    // FAKE API DELAY - Replace this with actual fetch to http://localhost:8000/predict
    setTimeout(() => {
      setIsScanning(false);
      setResults({
        totalScanned: mode === 'BATCH' ? 4250 : 1,
        flagsFound: mode === 'BATCH' ? 14 : Math.random() > 0.5 ? 1 : 0,
        accuracyScore: "99.61%",
        executionTime: "1.42s"
      });
    }, 3000);
  };

  return (
    <div className="min-h-full bg-[#030105] text-white p-8 font-sans selection:bg-cyan-500/30">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="text-cyan-400 text-xs font-bold tracking-[0.2em] mb-2 uppercase">
          {slug} // Operations // Analytics
        </div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Target className="text-purple-500" size={32} />
          PREDICTION <span className="text-white/40">WORKBENCH</span>
        </h1>
        <p className="text-white/50 text-sm mt-2 max-w-2xl">
          Upload raw grid telemetry or input single meter readings. The Sudarshan Random Forest engine will isolate structural anomalies and flag high-probability theft cases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - INPUT CONTROLS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* TOGGLE */}
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setMode('BATCH')}
              className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-md transition-all ${mode === 'BATCH' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,255,0.2)]' : 'text-white/40 hover:text-white/80'}`}
            >
              BATCH UPLOAD
            </button>
            <button 
              onClick={() => setMode('SINGLE')}
              className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-md transition-all ${mode === 'SINGLE' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(123,0,255,0.2)]' : 'text-white/40 hover:text-white/80'}`}
            >
              SINGLE METER
            </button>
          </div>

          {/* INPUT AREA */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 relative overflow-hidden">
            
            {mode === 'BATCH' ? (
              // DRAG AND DROP ZONE
              <div 
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/20 hover:border-white/40'}`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                      <FileText className="text-emerald-400" size={24} />
                    </div>
                    <div className="text-sm font-bold text-emerald-400">{file.name}</div>
                    <div className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    <button onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-300 mt-2 flex items-center gap-1">
                      <X size={12}/> Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <UploadCloud className="text-cyan-400" size={32} />
                    </div>
                    <div>
                      <div className="text-sm font-bold tracking-wide">DROP DATASET HERE</div>
                      <div className="text-xs text-white/40 mt-1">Supports .CSV files only</div>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 text-xs font-bold px-4 py-2 rounded transition-colors">
                      BROWSE FILES
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // SINGLE PREDICTION FORM
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-purple-400 tracking-wider">BUILDING_CLASS (CATEGORICAL)</label>
                  <select className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors">
                    <option>RESIDENTIAL</option>
                    <option>COMMERCIAL</option>
                    <option>INDUSTRIAL</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {numericalFeatures.map(feat => (
                    <div key={feat} className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 tracking-wider uppercase">{feat.replace('_', ' ')}</label>
                      <input 
                        type="number" step="0.01" placeholder="0.00"
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-mono transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button 
              onClick={simulateScan}
              disabled={isScanning || (mode === 'BATCH' && !file)}
              className={`w-full mt-6 py-4 rounded-md font-black tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                isScanning ? 'bg-white/10 text-white/40 cursor-not-allowed' : 
                (mode === 'BATCH' && !file) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 
                'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]'
              }`}
            >
              {isScanning ? (
                <>
                  <Activity className="animate-pulse" size={18} />
                  ANALYZING GRID...
                </>
              ) : (
                <>
                  <Play size={18} />
                  INITIALIZE SCAN
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - VISUALIZATION & RESULTS */}
        <div className="lg:col-span-2">
          {isScanning ? (
            // SCANNING ANIMATION STATE
            <div className="h-full min-h-[400px] bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
              
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-dashed border-cyan-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
                <div className="absolute inset-4 border-2 border-purple-500/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                <Target size={40} className="text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]" />
              </div>
              
              <div className="mt-8 text-center space-y-2">
                <div className="text-cyan-400 font-bold tracking-[0.3em] animate-pulse">EXECUTING RANDOM FOREST</div>
                <div className="text-xs text-white/40 font-mono">Passing vectors through decision nodes...</div>
              </div>
            </div>
          ) : results ? (
            // RESULTS STATE
            <div className="bg-white/5 border border-emerald-500/30 rounded-lg p-6 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <CheckCircle className="text-emerald-400" size={28} />
                <div>
                  <h2 className="text-xl font-black text-emerald-400 tracking-wide">SCAN COMPLETE</h2>
                  <p className="text-xs text-white/50 font-mono">Execution time: {results.executionTime} | RF Confidence: {results.accuracyScore}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/50 border border-white/5 p-4 rounded text-center">
                  <div className="text-[10px] text-white/40 font-bold tracking-widest mb-1">METERS ANALYZED</div>
                  <div className="text-3xl font-mono text-white">{results.totalScanned.toLocaleString()}</div>
                </div>
                <div className={`bg-black/50 border p-4 rounded text-center ${results.flagsFound > 0 ? 'border-red-500/30' : 'border-emerald-500/30'}`}>
                  <div className="text-[10px] text-white/40 font-bold tracking-widest mb-1">THEFT FLAGS DETECTED</div>
                  <div className={`text-3xl font-mono ${results.flagsFound > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {results.flagsFound.toLocaleString()}
                  </div>
                </div>
              </div>

              {results.flagsFound > 0 ? (
                <div className="border border-red-500/20 rounded bg-red-500/5">
                  <div className="p-3 border-b border-red-500/20 flex items-center gap-2 text-red-400 text-xs font-bold tracking-wider">
                    <AlertTriangle size={14} />
                    HIGH PROBABILITY ANOMALIES
                  </div>
                  <div className="p-4 text-sm text-white/70 font-mono space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-red-300">MTR-99284-RES</span>
                      <span className="text-white/40">Prob: 0.94</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-red-300">MTR-11029-COM</span>
                      <span className="text-white/40">Prob: 0.88</span>
                    </div>
                    <div className="text-xs text-cyan-400 text-center pt-2 cursor-pointer hover:underline">
                      EXPORT FULL AUDIT REPORT (.CSV)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border border-emerald-500/20 rounded bg-emerald-500/5 text-emerald-400/80 text-sm font-bold tracking-wider">
                  NO STRUCTURAL ANOMALIES DETECTED. GRID INTEGRITY VERIFIED.
                </div>
              )}
            </div>
          ) : (
            // EMPTY STATE
            <div className="h-full min-h-[400px] bg-black/20 border border-white/5 rounded-lg flex flex-col items-center justify-center text-center p-8">
              <Database className="text-white/10 mb-4" size={48} />
              <h3 className="text-white/30 font-bold tracking-widest mb-2">AWAITING TELEMETRY DATA</h3>
              <p className="text-white/20 text-xs max-w-sm leading-relaxed">
                Connect your dataset or input manual features on the left to initialize the Random Forest classification engine.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}