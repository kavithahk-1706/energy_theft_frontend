"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { 
  Fingerprint, ShieldCheck, Zap, Award, 
  Map, HardDrive, Cpu, Terminal, 
  Settings, Key, Play, CheckCircle
} from 'lucide-react';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function WorkerProfile() {
  const { user } = useUser();
  const [activeMissions, setActiveMissions] = useState<any[]>([]);

  // 1. Fetch "IN_PROGRESS" missions for this specific worker
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "missions"),
      where("workerId", "==", user.id),
      where("status", "==", "IN_PROGRESS")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const missions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActiveMissions(missions);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Completion Logic
  const handleCompleteMission = async (missionId: string, basePrice: number) => {
    try {
      const missionRef = doc(db, "missions", missionId);
      const xpGained = Math.floor(basePrice / 10);
      
      await updateDoc(missionRef, {
        status: "COMPLETED",
        completedAt: new Date().toISOString(),
        xpEarned: xpGained,
        finalReward: basePrice
      });

      alert(`SYSTEM_UPDATE: Mission Verified. +${xpGained} XP received.`);
    } catch (error) {
      console.error("COMPLETION_FAILURE:", error);
    }
  };

  return (
    <div className="bento-grid">
      
      {/* 1. IDENTITY BLOCK */}
      <div className="bento-box col-span-2 row-span-2">
        <div className="flex justify-between items-start">
          <div className="box-label">OPERATIVE_ID_VERIFIED</div>
          <Fingerprint className="text-pink-500" size={20} />
        </div>
        
        <div className="flex items-center gap-6 mt-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl border-2 border-pink-500 p-1">
               <img 
                 src={user?.imageUrl} 
                 alt="Operative" 
                 className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all"
               />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-pink-500 text-black p-1 rounded-md">
              <ShieldCheck size={16} />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">{user?.firstName || 'Operative'}</h1>
            <p className="text-pink-500 font-bold text-xs tracking-[0.2em] mt-1">RANK: FIELD_SENTRY</p>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE MISSIONS (THIS IS THE NEW SECTION) */}
      <div className="bento-box col-span-2 row-span-2 border-pink-500/40 bg-pink-500/5">
        <div className="box-label flex items-center gap-2">
          <Play size={12} className="text-pink-500 animate-pulse" /> ACTIVE_CONTRACTS
        </div>
        
        <div className="mt-4 space-y-4">
          {activeMissions.length === 0 ? (
            <p className="text-gray-600 italic text-xs py-10 text-center">NO_ACTIVE_UPLINKS_FOUND</p>
          ) : (
            activeMissions.map((m) => (
              <div key={m.id} className="p-4 bg-black/40 border border-white/10 rounded-xl">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm uppercase">{m.serviceTitle}</h4>
                  <span className="text-pink-500 font-black text-xs">₹{m.price}</span>
                </div>
                <p className="text-[10px] text-gray-500 mb-4">{m.location}</p>
                <button 
                  onClick={() => handleCompleteMission(m.id, m.price)}
                  className="w-full py-2 bg-white text-black text-[10px] font-black rounded-lg hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14} /> MARK_AS_RESOLVED
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. PERFORMANCE METRICS */}
      <div className="bento-box col-span-1 row-span-1">
        <div className="box-label">LIFETIME_XP</div>
        <div className="mt-4">
          <span className="text-2xl font-black text-white">14,850</span>
          <p className="text-[10px] text-pink-500 font-bold mt-1">LVL_4</p>
        </div>
      </div>

      {/* 4. EQUIPMENT STATUS */}
      <div className="bento-box col-span-3 row-span-1">
        <div className="box-label">HARDWARE_INTEGRITY</div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <Cpu size={18} className="text-pink-500" />
            <div>
              <div className="text-[10px] text-gray-500 uppercase">Neural</div>
              <div className="text-xs font-bold">94%</div>
            </div>
          </div>
          <div className="flex items-center gap-3 border-x border-white/5 px-4">
            <Zap size={18} className="text-pink-500" />
            <div>
              <div className="text-[10px] text-gray-500 uppercase">Core</div>
              <div className="text-xs font-bold">88%</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Map size={18} className="text-pink-500" />
            <div>
              <div className="text-[10px] text-gray-500 uppercase">GPS</div>
              <div className="text-xs font-bold">ONLINE</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SYSTEM SETTINGS */}
      <div className="bento-box col-span-4 row-span-1 border-white/5">
        <div className="flex justify-between items-center h-full text-xs text-gray-500 font-bold">
          <div className="flex gap-6">
            <span className="hover:text-pink-500 cursor-pointer">CONSOLE</span>
            <span className="hover:text-pink-500 cursor-pointer">ENCRYPTION</span>
            <span className="hover:text-pink-500 cursor-pointer">CONFIG</span>
          </div>
          <span className="font-mono text-[10px]">OS_VER: 1.0.4-STABLE</span>
        </div>
      </div>

    </div>
  );
}