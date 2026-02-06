"use client";
import React, { useState, useEffect, useRef } from 'react';
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { 
  Award, Zap, Target, Layers, 
  TrendingUp, ShieldAlert, Cpu, 
  Lock, CheckCircle2, Trophy, Sparkles,
  Wallet, ArrowUpRight, Banknote
} from 'lucide-react';

export default function WorkerEvolution() {
  const { user } = useUser();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevLevel = useRef<number | null>(null);

  const [stats, setStats] = useState({ 
    totalXP: 0, 
    missionCount: 0, 
    level: 1, 
    totalEarnings: 0 // New field for the money
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "missions"),
      where("workerId", "==", user.id),
      where("status", "==", "COMPLETED")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let earnedXP = 0;
      let cash = 0;
      let count = snapshot.docs.length;
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        earnedXP += data.xpEarned || 0;
        cash += data.finalReward || 0; // Summing up the money
      });

      const currentLevel = Math.floor(earnedXP / 1000) + 1;

      if (prevLevel.current !== null && currentLevel > prevLevel.current) {
        setShowLevelUp(true);
      }
      
      prevLevel.current = currentLevel;

      setStats({ 
        totalXP: earnedXP, 
        missionCount: count, 
        level: currentLevel,
        totalEarnings: cash
      });
    });

    return () => unsubscribe();
  }, [user]);

  const skills = [
    { name: 'Grid_Stealth', level: Math.min(stats.totalXP / 50, 100), status: stats.totalXP > 5000 ? 'MASTERED' : 'IN_PROGRESS', icon: ShieldAlert },
    { name: 'Neural_Efficiency', level: Math.min(stats.totalXP / 80, 100), status: 'IN_PROGRESS', icon: Cpu },
    { name: 'Theft_Detection', level: stats.missionCount > 10 ? 100 : (stats.missionCount * 10), status: stats.missionCount > 10 ? 'MAXED' : 'TRAINING', icon: Target },
  ];

  const currentLevelProgress = (stats.totalXP % 1000) / 10;

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      
      {/* 1. FULL-SCREEN ASCENSION OVERLAY */}
      {showLevelUp && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-500">
          <div className="absolute w-150 h-150 bg-pink-500/30 rounded-full blur-[150px] animate-pulse" />
          
          <div className="relative z-10 text-center px-6">
            <div className="flex justify-center mb-8">
              <div className="relative p-8 rounded-full bg-pink-500 shadow-[0_0_60px_#ff00ff]">
                <Trophy size={80} className="text-black" />
              </div>
            </div>
            <h1 className="text-8xl font-black italic tracking-tighter text-white uppercase">Ascended</h1>
            <p className="text-pink-500 tracking-[0.6em] font-black text-2xl mt-4 uppercase">Rank_0{stats.level}_Unlocked</p>
            <button 
              onClick={() => setShowLevelUp(false)}
              className="mt-12 px-12 py-5 border-2 border-pink-500 text-pink-500 font-black uppercase tracking-[0.3em] hover:bg-pink-500 hover:text-black transition-all"
            >
              Continue_Evolution
            </button>
          </div>
        </div>
      )}

      {/* 2. EVOLUTION GRID */}
      <div className="bento-grid">
        
        {/* FINANCIAL HUB (New Section) */}
        <div className="bento-box col-span-2 row-span-1 bg-linear-to-br from-pink-500/10 to-transparent border-pink-500/40">
          <div className="flex justify-between items-start">
            <div className="box-label text-pink-500 flex items-center gap-2">
              <Wallet size={12} /> FINANCIAL_RESERVES
            </div>
            <Banknote size={18} className="text-pink-500/50" />
          </div>
          
          <div className="mt-8">
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Available_Credits</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-6xl font-black text-white tracking-tighter italic">₹{stats.totalEarnings.toLocaleString()}</h3>
              <ArrowUpRight className="text-green-500 mb-2" size={24} />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">Verified_at_Node_4</span>
            <button className="text-[10px] font-black text-pink-500 border border-pink-500/30 px-3 py-1 rounded hover:bg-pink-500 hover:text-black transition-all">
              WITHDRAW_FUNDS
            </button>
          </div>
        </div>

        {/* DYNAMIC RANK OVERVIEW */}
        <div className="bento-box col-span-2 row-span-2 overflow-hidden relative">
          <div className="box-label">OPERATIVE_ASCENSION</div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 rounded-full border-4 border-pink-500/20 flex items-center justify-center relative mb-6">
              <Award size={60} className="text-pink-500 shadow-pink-500/50" />
              <div className="absolute inset-0 border-t-4 border-pink-500 rounded-full animate-spin [animation-duration:3s]" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter italic uppercase text-white">RANK_0{stats.level}</h2>
            
            <div className="w-full max-w-xs mt-8 px-4">
              <div className="flex justify-between text-[10px] mb-2 font-bold">
                <span className="text-gray-500 uppercase">XP_Protocol</span>
                <span className="text-white">{stats.totalXP % 1000} / 1000</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-pink-500 shadow-[0_0_15px_#ff00ff] transition-all duration-1000" 
                  style={{ width: `${currentLevelProgress}%` }} 
                />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-2.5 text-[100px] font-black text-white/5 select-none pointer-events-none">EVO</div>
        </div>

        {/* MULTIPLIER & XP BOXES */}
        <div className="bento-box col-span-1 row-span-1">
          <div className="box-label">YIELD_RATE</div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="text-pink-500" size={24} />
            <span className="text-3xl font-black">1.2x</span>
          </div>
        </div>

        <div className="bento-box col-span-1 row-span-1">
          <div className="box-label">LIFETIME_XP</div>
          <div className="mt-4 flex items-center gap-2 text-white">
            <Layers className="text-pink-500" size={24} />
            <span className="text-3xl font-black">{(stats.totalXP / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* NEURAL SKILL TREE */}
        <div className="bento-box col-span-4 row-span-2 border-white/5">
          <div className="box-label mb-6">NEURAL_SKILL_TREE_PROTOCOL</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skill, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <skill.icon size={24} className="text-pink-500" />
                  <span className={`text-[9px] font-black px-2 py-1 rounded ${skill.status === 'MASTERED' || skill.status === 'MAXED' ? 'bg-pink-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                    {skill.status}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-white">{skill.name}</h3>
                <div className="h-1 w-full bg-white/10 rounded-full">
                  <div className="h-full bg-pink-500 transition-all duration-700" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementBadge({ label, active, icon: Icon }: any) {
  return (
    <div className={`shrink-0 w-24 h-24 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
      active ? 'bg-pink-500/10 border-pink-500 text-white shadow-[0_0_10px_rgba(255,0,255,0.2)]' : 'bg-white/5 border-white/10 text-gray-600'
    }`}>
      <Icon size={20} className={active ? 'text-pink-500' : 'text-gray-600'} />
      <span className="text-[8px] font-bold uppercase tracking-tighter">{label}</span>
    </div>
  );
}