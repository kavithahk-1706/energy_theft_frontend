"use client";
import React, { useState, useEffect } from 'react';
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { Radio, MapPin, Loader2 } from 'lucide-react';
import { useUser } from "@clerk/nextjs";

export default function WorkerMissions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null); // Track which button is loading
  const { user } = useUser();

  // 1. THE ACCEPT LOGIC
  const handleAcceptMission = async (missionId: string) => {
    if (!user) {
      alert("ERROR: Unauthorized access. Please log in.");
      return;
    }

    setLoadingId(missionId); // Start loading animation

    try {
      const missionRef = doc(db, "missions", missionId);
      await updateDoc(missionRef, {
        status: "IN_PROGRESS",
        workerId: user.id, 
        workerName: user.fullName || user.username,
        acceptedAt: serverTimestamp() // Better than local JS date
      });
      
      // No need to manually refresh; the listener below will 
      // see the status changed and remove it from the list.
    } catch (error) {
      console.error("ACCEPT_FAILURE:", error);
      alert("TRANSMISSION_ERROR: Contract could not be secured.");
    } finally {
      setLoadingId(null); // Stop loading
    }
  };

  // 2. THE REAL-TIME LISTENER
  useEffect(() => {
    const q = query(
      collection(db, "missions"), 
      where("status", "==", "PENDING"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const missionList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMissions(missionList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bento-grid">
      <div className="bento-box col-span-4 min-h-100">
        <div className="box-label flex items-center gap-2">
          <Radio size={14} className="animate-pulse text-pink-500" /> LIVE_CONTRACT_STREAM
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {missions.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-700 italic border-2 border-dashed border-white/5 rounded-3xl">
              WAITING_FOR_INBOUND_SIGNALS...
            </div>
          ) : (
            missions.map((m) => (
              <div key={m.id} className="bento-box border-pink-500/20 hover:border-pink-500 transition-all bg-white/2">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[8px] font-black px-2 py-1 rounded ${m.urgency === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-pink-500/10 text-pink-500'}`}>
                    {m.urgency}
                  </span>
                  <span className="text-white font-black">₹{m.price}</span>
                </div>
                
                <h3 className="text-lg font-bold uppercase leading-tight">{m.serviceTitle}</h3>
                
                <p className="text-gray-500 text-[10px] mt-2 flex items-center gap-1">
                  <MapPin size={10}/> {m.location}
                </p>

                {/* THE ATTACHED BUTTON */}
                <button 
                  onClick={() => handleAcceptMission(m.id)} 
                  disabled={loadingId === m.id}
                  className="mt-6 w-full py-3 bg-pink-600 hover:bg-pink-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black text-[10px] rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {loadingId === m.id ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> SECURING...
                    </>
                  ) : (
                    "Accept Contract"
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}