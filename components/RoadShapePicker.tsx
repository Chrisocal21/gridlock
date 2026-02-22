'use client';

import { useGameStore } from '@/store/gameStore';

export type RoadShape = 
  | 'straight-h' 
  | 'straight-v' 
  | 'turn-ne' 
  | 'turn-nw' 
  | 'turn-se' 
  | 'turn-sw'
  | 't-north'
  | 't-south'
  | 't-east'
  | 't-west'
  | 'intersection';

interface RoadShapePickerProps {
  shape: RoadShape;
  onShapeChange: (shape: RoadShape) => void;
}

export default function RoadShapePicker({ shape, onShapeChange }: RoadShapePickerProps) {
  const selectedBuilding = useGameStore((state) => state.selectedBuilding);

  // Only show for road types
  const isRoadType = selectedBuilding && (
    selectedBuilding.includes('road') || 
    selectedBuilding === 'highway' || 
    selectedBuilding === 'dirt_path'
  );

  if (!isRoadType) return null;

  const shapes: { id: RoadShape; label: string; svg: string }[] = [
    { 
      id: 'straight-h', 
      label: 'Straight', 
      svg: '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/>'
    },
    { 
      id: 'straight-v', 
      label: 'Straight', 
      svg: '<line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="3"/>'
    },
    { 
      id: 'turn-ne', 
      label: 'Turn', 
      svg: '<path d="M 12 22 Q 12 12 22 12" stroke="currentColor" stroke-width="3" fill="none"/>'
    },
    { 
      id: 'turn-se', 
      label: 'Turn', 
      svg: '<path d="M 12 2 Q 12 12 22 12" stroke="currentColor" stroke-width="3" fill="none"/>'
    },
    { 
      id: 'turn-sw', 
      label: 'Turn', 
      svg: '<path d="M 12 2 Q 12 12 2 12" stroke="currentColor" stroke-width="3" fill="none"/>'
    },
    { 
      id: 'turn-nw', 
      label: 'Turn', 
      svg: '<path d="M 12 22 Q 12 12 2 12" stroke="currentColor" stroke-width="3" fill="none"/>'
    },
    { 
      id: 't-north', 
      label: 'T-Junction', 
      svg: '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/><line x1="12" y1="12" x2="12" y2="2" stroke="currentColor" stroke-width="3"/>'
    },
    { 
      id: 't-south', 
      label: 'T-Junction', 
      svg: '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/><line x1="12" y1="12" x2="12" y2="22" stroke="currentColor" stroke-width="3"/>'
    },
    { 
      id: 't-east', 
      label: 'T-Junction', 
      svg: '<line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="3"/><line x1="12" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/>'
    },
    { 
      id: 't-west', 
      label: 'T-Junction', 
      svg: '<line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="3"/><line x1="12" y1="12" x2="2" y2="12" stroke="currentColor" stroke-width="3"/>'
    },
    { 
      id: 'intersection', 
      label: '4-Way', 
      svg: '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="3"/>'
    },
  ];

  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-30 
                    bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-600
                    px-3 py-2">
      <div className="text-slate-400 text-xs mb-1.5 text-center font-medium">Road Shape</div>
      <div className="grid grid-cols-6 gap-1.5">{shapes.map((s) => (
          <button
            key={s.id}
            onClick={() => onShapeChange(s.id)}
            className={`
              relative w-10 h-10 rounded transition-all flex items-center justify-center
              ${shape === s.id 
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }
            `}
            title={s.label}
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-7 h-7"
              dangerouslySetInnerHTML={{ __html: s.svg }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
