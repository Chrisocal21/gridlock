'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function PopulationCounter() {
  const population = useGameStore((state) => state.population);
  const [displayedPop, setDisplayedPop] = useState(population);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (population === displayedPop) return;

    setIsAnimating(true);
    const difference = population - displayedPop;
    const steps = Math.min(Math.abs(difference), 20);
    const increment = difference / steps;
    const duration = 1000; // 1 second total animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayedPop(population);
        setIsAnimating(false);
        clearInterval(interval);
      } else {
        setDisplayedPop((prev) => Math.round(prev + increment));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [population, displayedPop]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg z-50">
      <div className="text-center">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Population
        </div>
        <div
          className={`text-3xl font-bold text-gray-900 transition-all duration-100 ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
        >
          {displayedPop.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
