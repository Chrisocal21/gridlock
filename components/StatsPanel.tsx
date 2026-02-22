'use client';

import { useGameStore } from '@/store/gameStore';

export default function StatsPanel() {
  const population = useGameStore((state) => state.population);
  const traffic = useGameStore((state) => state.traffic);
  const pollution = useGameStore((state) => state.pollution);
  const happiness = useGameStore((state) => state.happiness);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="bg-slate-800/95 backdrop-blur-sm shadow-2xl rounded-t-3xl border-t-2 border-slate-700">
          <div className="grid grid-cols-4 gap-4 px-6 py-4">
            {/* Population */}
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 mb-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="text-[10px] text-slate-400 mb-0.5">Population</div>
              <div className="text-base font-bold text-blue-300">
                {population.toLocaleString()}
              </div>
            </div>

            {/* Traffic */}
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 mb-1 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-[10px] text-slate-400 mb-0.5">Traffic</div>
              <div className="text-base font-bold text-orange-300">{traffic}%</div>
              <div className="w-full bg-slate-700 rounded-full h-1 mt-1 overflow-hidden">
                <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${traffic}%` }} />
              </div>
            </div>

            {/* Pollution */}
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 mb-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <div className="text-[10px] text-slate-400 mb-0.5">Pollution</div>
              <div className="text-base font-bold text-green-300">{pollution}%</div>
              <div className="w-full bg-slate-700 rounded-full h-1 mt-1 overflow-hidden">
                <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${pollution}%` }} />
              </div>
            </div>

            {/* Happiness */}
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 mb-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-[10px] text-slate-400 mb-0.5">Happiness</div>
              <div className="text-base font-bold text-purple-300">{happiness}%</div>
              <div className="w-full bg-slate-700 rounded-full h-1 mt-1 overflow-hidden">
                <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${happiness}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
