'use client';

import { useGameStore } from '@/store/gameStore';

export default function UndoButton() {
  const undo = useGameStore((state) => state.undo);
  const canUndo = useGameStore((state) => state.moveStack.length > 0);

  return (
    <button
      onClick={undo}
      disabled={!canUndo}
      className={`fixed top-4 left-4 bg-slate-700 backdrop-blur-sm p-2 rounded-full shadow-xl z-50 transition-all border-2 border-slate-500 ${
        canUndo
          ? 'opacity-100 hover:bg-slate-600 active:scale-95'
          : 'opacity-50 cursor-not-allowed'
      }`}
      aria-label="Undo last action"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-slate-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
    </button>
  );
}
