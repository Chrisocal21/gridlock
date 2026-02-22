'use client';

import { BuildingType, BUILDING_CONFIG } from '@/types/game';

interface BuildingTooltipProps {
  building: BuildingType;
  x: number;
  y: number;
  mouseX: number;
  mouseY: number;
}

// Convert building type to readable name
const getBuildingName = (building: BuildingType): string => {
  const names: Record<string, string> = {
    // Infrastructure
    road: 'Road',
    dirt_path: 'Dirt Path',
    paved_road: 'Paved Road',
    four_lane_road: 'Four Lane Road',
    highway: 'Highway',
    river: 'River',
    bridge: 'Bridge',
    
    // Residential
    residential_shack: 'Shack',
    residential_house: 'House',
    residential_apartment: 'Apartment Building',
    residential_highrise: 'High-Rise',
    residential_luxury: 'Luxury Home',
    
    // Commercial
    commercial_store: 'Store',
    commercial_strip: 'Strip Mall',
    commercial_shopping: 'Shopping Center',
    commercial_plaza: 'Shopping Plaza',
    
    // Industrial
    industrial_warehouse: 'Warehouse',
    industrial_factory: 'Factory',
    industrial_distribution: 'Distribution Center',
    
    // Green spaces
    green_tree: 'Tree',
    green_park: 'Park',
    green_reserve: 'Nature Reserve',
    green_promenade: 'Promenade',
    
    // Civic
    civic_school: 'School',
    civic_hospital: 'Hospital',
    civic_police: 'Police Station',
    civic_fire: 'Fire Station',
    civic_hall: 'City Hall',
    civic_transit: 'Transit Hub',
  };
  
  return names[building] || building.replace(/_/g, ' ');
};

// Get category color
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    residential: 'bg-orange-500',
    commercial: 'bg-amber-500',
    industrial: 'bg-slate-500',
    green: 'bg-green-500',
    civic: 'bg-blue-500',
    infrastructure: 'bg-gray-500',
  };
  return colors[category] || 'bg-gray-500';
};

export default function BuildingTooltip({ building, x, y, mouseX, mouseY }: BuildingTooltipProps) {
  const config = BUILDING_CONFIG[building];
  if (!config) return null;

  const name = getBuildingName(building);
  const categoryColor = getCategoryColor(config.category);
  
  // Position tooltip near cursor but offset so it doesn't obscure the building
  const tooltipStyle = {
    position: 'fixed' as const,
    left: `${mouseX + 20}px`,
    top: `${mouseY - 10}px`,
    pointerEvents: 'none' as const,
    zIndex: 1000,
  };

  return (
    <div style={tooltipStyle} className="animate-in fade-in duration-150">
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-lg shadow-xl px-4 py-3 min-w-[200px] backdrop-blur-sm">
        {/* Building name with category badge */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${categoryColor}`}></div>
          <h3 className="text-white font-bold text-sm">{name}</h3>
        </div>
        
        {/* Stats */}
        <div className="space-y-1 text-xs">
          {/* Category */}
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Type:</span>
            <span className="capitalize">{config.category}</span>
          </div>
          
          {/* Population */}
          {config.population > 0 && (
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Population:</span>
              <span className="font-semibold text-white">{config.population}</span>
            </div>
          )}
          
          {/* Size */}
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Size:</span>
            <span>{config.width}×{config.height} tiles</span>
          </div>
          
          {/* Grid position */}
          <div className="flex justify-between text-slate-400 text-[10px] mt-2 pt-2 border-t border-slate-700">
            <span>Position:</span>
            <span>({x}, {y})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
