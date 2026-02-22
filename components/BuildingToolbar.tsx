'use client';

import { useGameStore } from '@/store/gameStore';
import { BUILDING_CONFIG, BuildingType } from '@/types/game';

// Simplified building display names
const BUILDING_NAMES: Record<BuildingType, string> = {
  empty: 'Demolish',
  ocean: 'Ocean',
  beach: 'Beach',
  road: 'Road',
  dirt_path: 'Dirt Path',
  paved_road: 'Road',
  four_lane_road: '4-Lane Road',
  highway: 'Highway',
  river: 'River',
  bridge: 'Bridge',
  residential_shack: 'Shack',
  residential_house: 'House',
  residential_apartment: 'Apartment',
  residential_highrise: 'High-rise',
  residential_luxury: 'Luxury',
  commercial_store: 'Store',
  commercial_strip: 'Strip Mall',
  commercial_shopping: 'Shopping Center',
  commercial_plaza: 'Plaza',
  industrial_warehouse: 'Warehouse',
  industrial_factory: 'Factory',
  industrial_distribution: 'Distribution',
  green_tree: 'Tree',
  green_park: 'Park',
  green_reserve: 'Reserve',
  green_promenade: 'Promenade',
  civic_school: 'School',
  civic_hospital: 'Hospital',
  civic_police: 'Police',
  civic_fire: 'Fire Station',
  civic_hall: 'City Hall',
  civic_transit: 'Transit Hub',
};

export default function BuildingToolbar() {
  const selectedBuilding = useGameStore((state) => state.selectedBuilding);
  const setSelectedBuilding = useGameStore((state) => state.setSelectedBuilding);

  if (!selectedBuilding) return null;

  const config = BUILDING_CONFIG[selectedBuilding];
  const isDemo = selectedBuilding === 'empty';

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 
                    bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-600
                    px-4 py-2 flex items-center gap-3">
      {/* Building Info */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded border flex items-center justify-center text-xs font-bold text-white"
          style={{ 
            backgroundColor: isDemo ? '#ef4444' : config?.color || '#1e293b',
            borderColor: isDemo ? '#dc2626' : (config?.color || '#1e293b')
          }}
        >
          {isDemo ? '×' : `${config?.width}×${config?.height}`}
        </div>
        <div className="text-sm font-medium text-white">
          {BUILDING_NAMES[selectedBuilding] || selectedBuilding}
        </div>
      </div>

      {/* Cancel Button */}
      <button
        onClick={() => setSelectedBuilding(null)}
        className="ml-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-medium transition-colors"
      >
        Cancel
      </button>
      
      {/* ESC Hint */}
      <div className="text-xs text-slate-500 ml-1">
        ESC
      </div>
    </div>
  );
}
