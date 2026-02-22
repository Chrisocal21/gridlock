'use client';

import { useGameStore } from '@/store/gameStore';

interface TopBarProps {
  onOpenMenu: () => void;
}

export default function TopBar({ onOpenMenu }: TopBarProps) {
  const population = useGameStore((state) => state.population);
  const traffic = useGameStore((state) => state.traffic);
  const pollution = useGameStore((state) => state.pollution);
  const happiness = useGameStore((state) => state.happiness);
  const undo = useGameStore((state) => state.undo);
  const canUndo = useGameStore((state) => state.moveStack.length > 0);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="flex items-center justify-between gap-2 px-3 py-2 min-h-[52px]">
        {/* Left: Menu */}
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={onOpenMenu}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-2 flex-1 justify-center overflow-x-auto">
          {/* Population */}
          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg min-w-[70px] flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-semibold text-blue-300 whitespace-nowrap">{population.toLocaleString()}</span>
          </div>

          {/* Traffic */}
          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg min-w-[60px] flex-shrink-0">
            <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-semibold text-orange-300 whitespace-nowrap">{traffic}%</span>
          </div>

          {/* Pollution */}
          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg min-w-[60px] flex-shrink-0">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span className="text-xs font-semibold text-green-300 whitespace-nowrap">{pollution}%</span>
          </div>

          {/* Happiness */}
          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg min-w-[60px] flex-shrink-0">
            <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold text-purple-300 whitespace-nowrap">{happiness}%</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-all ${
              canUndo
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
            }`}
            aria-label="Undo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
