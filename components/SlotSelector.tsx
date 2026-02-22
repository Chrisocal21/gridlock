'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

interface SaveSlotData {
  population: number;
  lastSaved?: string;
}

export default function SlotSelector({ onSlotSelected }: { onSlotSelected: () => void }) {
  const [slots, setSlots] = useState<Array<SaveSlotData | null>>([null, null, null]);
  const loadFromSlot = useGameStore((state) => state.loadFromSlot);

  useEffect(() => {
    // Check what's in each slot
    const slotData: Array<SaveSlotData | null> = [];
    for (let i = 1; i <= 3; i++) {
      const saved = localStorage.getItem(`gridlock_city_${i}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          slotData.push({
            population: data.population || 0,
            lastSaved: new Date(data.lastSaved || Date.now()).toLocaleDateString(),
          });
        } catch {
          slotData.push(null);
        }
      } else {
        slotData.push(null);
      }
    }
    setSlots(slotData);
  }, []);

  const handleSlotSelect = (slot: 1 | 2 | 3) => {
    loadFromSlot(slot);
    onSlotSelected();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/logo.svg" 
            alt="Gridlock" 
            className="w-full max-w-xl mx-auto mb-6"
          />
          <p className="text-slate-400 text-lg">Select your city</p>
        </div>

        {/* City Slots */}
        <div className="space-y-4">
          {[1, 2, 3].map((slotNum) => {
            const slot = slotNum as 1 | 2 | 3;
            const data = slots[slotNum - 1];
            const slotColors = [
              { bg: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-400' },
              { bg: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'text-purple-400' },
              { bg: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/30', text: 'text-orange-400', icon: 'text-orange-400' }
            ][slotNum - 1];

            return (
              <button
                key={slot}
                onClick={() => handleSlotSelect(slot)}
                className={`w-full bg-gradient-to-br ${slotColors.bg} backdrop-blur-sm border ${slotColors.border} hover:border-opacity-60 p-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-left group relative overflow-hidden`}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="h-full w-full" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px),
                                     repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)`
                  }} />
                </div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* City Icon */}
                    <div className={`w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center ${slotColors.icon} border border-slate-700/50`}>
                      {data ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </div>

                    {/* City Info */}
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold ${slotColors.text} mb-1 group-hover:translate-x-1 transition-transform`}>
                        City {slot}
                      </h3>
                      {data ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-300">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-semibold">{data.population.toLocaleString()}</span>
                            <span className="text-slate-500">citizens</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{data.lastSaved}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-500">
                          <p className="text-sm">Start a new city</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className={`${slotColors.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500 bg-slate-800/30 px-4 py-2 rounded-lg border border-slate-700/50">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Auto-save enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
