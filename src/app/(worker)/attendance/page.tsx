"use client";
import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShieldCheck, MapPin, Loader2 } from 'lucide-react';

interface MissionData {
  id: string;
  location: string;
  serviceTitle: string;
  status: string;
}

export default function AttendanceGate({ mission }: { mission: MissionData | null | undefined }) {
  const [isVerified, setIsVerified] = useState(false);

  // 1. DATA GUARD: Prevents the "Cannot read properties of undefined" error
  if (!mission) {
    return (
      <div className="bento-box col-span-4 min-h-100 flex flex-col items-center justify-center border-white/5">
        <Loader2 className="text-pink-500 animate-spin mb-4" size={32} />
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
          Syncing_with_Orbital_Grid...
        </p>
      </div>
    );
  }

  // 2. Logic to verify QR content matches Mission ID
  const handleScan = async (result: string) => {
    if (result === mission.id) {
      try {
        const missionRef = doc(db, "missions", mission.id);
        await updateDoc(missionRef, {
          attendanceMarked: true,
          checkInTime: serverTimestamp(),
          status: "IN_PROGRESS_ACTIVE" 
        });
        setIsVerified(true);
      } catch (error) {
        console.error("VERIFICATION_DATABASE_ERROR:", error);
      }
    } else {
      console.warn("INVALID_TOKEN_DETECTED");
    }
  };

  if (isVerified) {
    return (
      <div className="bento-box border-green-500 bg-green-500/10 flex flex-col items-center justify-center py-20 transition-all duration-500">
        <div className="p-4 rounded-full bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
          <ShieldCheck size={48} className="text-black" />
        </div>
        <h2 className="text-2xl font-black mt-6 uppercase tracking-tighter">Identity_Verified</h2>
        <p className="text-[10px] text-green-500 font-mono mt-2 tracking-widest uppercase">
          Shift_Logged_at_{new Date().toLocaleTimeString()}
        </p>
      </div>
    );
  }

    const newLocal = "w-72 p-6 bg-white/[0.03] rounded-3xl border border-white/5 backdrop-blur-sm";
  return (
    <div className="bento-box col-span-4 min-h-100 border-white/10">
      <div className="box-label flex items-center gap-2">
        <div className="w-1 h-1 bg-pink-500 animate-ping rounded-full" />
        NODE_ARRIVAL_VERIFICATION
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mt-12 items-center justify-center">
        {/* GPS Sensor Mockup */}
        <div className={newLocal}>
          <MapPin size={24} className="text-pink-500 mb-4" />
          <h4 className="font-bold text-sm uppercase text-white">GPS_Proximity</h4>
          {/* Safe to access because of the guard clause above */}
          <p className="text-[10px] text-gray-500 mt-1 font-mono">{mission.location}</p>
          
          <div className="mt-6 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-green-500 uppercase font-mono tracking-tighter">
              Signal_Lock_Acquired
            </span>
          </div>
        </div>

        {/* QR Scanner */}
        <div className="w-72 aspect-square bg-black rounded-3xl overflow-hidden border-2 border-pink-500/30 relative">
          <Scanner 
            onScan={(res) => {
              if (res[0]?.rawValue) handleScan(res[0].rawValue);
            }} 
            styles={{ container: { width: '100%', height: '100%' } }}
          />
          {/* Visual Framing Overlay */}
          <div className="absolute inset-0 border-40 border-black/60 pointer-events-none flex items-center justify-center">
             <div className="w-full h-full border border-pink-500/50 opacity-50" />
          </div>
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-pink-500 shadow-[0_0_15px_#ff00ff] animate-[scan_2s_linear_infinite]" />
        </div>
      </div>
      
      <p className="text-center mt-10 text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] animate-pulse">
        Present_Token_to_Sensor_for_Handshake
      </p>
    </div>
  );
}