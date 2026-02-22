'use client';

import { useState, useEffect } from 'react';
import GameCanvas from '@/components/GameCanvas';
import SlotSelector from '@/components/SlotSelector';
import TopBar from '@/components/TopBar';
import BuildingSidebar from '@/components/BuildingSidebar';
import BuildingToolbar from '@/components/BuildingToolbar';
import { RoadShape } from '@/components/RoadShapePicker';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [roadShape, setRoadShape] = useState<RoadShape>('intersection');
  const currentSlot = useGameStore((state) => state.currentSlot);
  const saveToSlot = useGameStore((state) => state.saveToSlot);
  const setSelectedBuilding = useGameStore((state) => state.setSelectedBuilding);

  // ESC key to cancel building selection
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBuilding(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, setSelectedBuilding]);

  // Auto-save every 60 seconds
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      saveToSlot(currentSlot);
      console.log('Auto-saved to slot', currentSlot);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [gameStarted, currentSlot, saveToSlot]);

  if (!gameStarted) {
    return <SlotSelector onSlotSelected={() => setGameStarted(true)} />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900">
      <TopBar onOpenMenu={() => setGameStarted(false)} />
      <BuildingSidebar roadShape={roadShape} onRoadShapeChange={setRoadShape} />
      <BuildingToolbar />
      <GameCanvas roadShape={roadShape} />
    </div>
  );
}
