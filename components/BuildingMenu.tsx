'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BuildingType, BUILDING_CONFIG } from '@/types/game';

type BuildingCategory = 'residential' | 'commercial' | 'industrial' | 'green' | 'civic' | 'infrastructure';

interface Building {
  type: BuildingType;
  name: string;
  category: BuildingCategory;
  unlocked: boolean;
  description?: string;
}

const BUILDINGS: Building[] = [
  // Residential
  { type: 'residential_shack', name: 'Shack', category: 'residential', unlocked: true, description: 'Basic housing' },
  { type: 'residential_house', name: 'House', category: 'residential', unlocked: true, description: 'Family home' },
  { type: 'residential_apartment', name: 'Apartment', category: 'residential', unlocked: true, description: 'Multi-unit' },
  { type: 'residential_highrise', name: 'High-rise', category: 'residential', unlocked: true, description: 'Dense housing' },
  { type: 'residential_luxury', name: 'Luxury', category: 'residential', unlocked: true, description: 'Premium living' },
  
  // Commercial
  { type: 'commercial_store', name: 'Store', category: 'commercial', unlocked: true, description: 'Small shop' },
  { type: 'commercial_strip', name: 'Strip Mall', category: 'commercial', unlocked: true, description: 'Retail strip' },
  { type: 'commercial_shopping', name: 'Shopping', category: 'commercial', unlocked: true, description: 'Big shopping' },
  { type: 'commercial_plaza', name: 'Plaza', category: 'commercial', unlocked: true, description: 'Mega mall' },
  
  // Industrial
  { type: 'industrial_warehouse', name: 'Warehouse', category: 'industrial', unlocked: true, description: 'Storage' },
  { type: 'industrial_factory', name: 'Factory', category: 'industrial', unlocked: true, description: 'Production' },
  { type: 'industrial_distribution', name: 'Distribution', category: 'industrial', unlocked: true, description: 'Logistics hub' },
  
  // Green
  { type: 'green_tree', name: 'Tree', category: 'green', unlocked: true, description: 'Single tree' },
  { type: 'green_park', name: 'Park', category: 'green', unlocked: true, description: 'Small park' },
  { type: 'green_reserve', name: 'Reserve', category: 'green', unlocked: true, description: 'Nature area' },
  { type: 'green_promenade', name: 'Promenade', category: 'green', unlocked: true, description: 'Walking path' },
  
  // Civic
  { type: 'civic_school', name: 'School', category: 'civic', unlocked: true, description: 'Education' },
  { type: 'civic_hospital', name: 'Hospital', category: 'civic', unlocked: true, description: 'Healthcare' },
  { type: 'civic_police', name: 'Police', category: 'civic', unlocked: true, description: 'Law & order' },
  { type: 'civic_fire', name: 'Fire Station', category: 'civic', unlocked: true, description: 'Fire safety' },
  { type: 'civic_hall', name: 'City Hall', category: 'civic', unlocked: true, description: 'Government' },
  { type: 'civic_transit', name: 'Transit Hub', category: 'civic', unlocked: true, description: 'Public transit' },
  
  // Infrastructure
  { type: 'dirt_path', name: 'Dirt Path', category: 'infrastructure', unlocked: true, description: 'Basic path' },
  { type: 'paved_road', name: 'Road', category: 'infrastructure', unlocked: true, description: 'Paved road' },
  { type: 'four_lane_road', name: '4-Lane', category: 'infrastructure', unlocked: true, description: 'Major road' },
  { type: 'highway', name: 'Highway', category: 'infrastructure', unlocked: true, description: 'Fast route' },
];

const CATEGORIES: Array<{ id: BuildingCategory; name: string; color: string; icon: string }> = [
  { id: 'residential', name: 'Residential', color: '#d4847c', icon: '🏠' },
  { id: 'commercial', name: 'Commercial', color: '#e8b86d', icon: '🏢' },
  { id: 'industrial', name: 'Industrial', color: '#6e7c8c', icon: '🏭' },
  { id: 'green', name: 'Green', color: '#8fa688', icon: '🌳' },
  { id: 'civic', name: 'Civic', color: '#6d8fe8', icon: '🏛️' },
  { id: 'infrastructure', name: 'Roads', color: '#64748b', icon: '🛣️' },
];

export default function BuildingMenu() {
  const [selectedCategory, setSelectedCategory] = useState<BuildingCategory>('residential');
  const [isExpanded, setIsExpanded] = useState(true);
  const selectedBuilding = useGameStore((state) => state.selectedBuilding);
  const setSelectedBuilding = useGameStore((state) => state.setSelectedBuilding);

  const handleBuildingSelect = (buildingType: BuildingType) => {
    setSelectedBuilding(buildingType);
  };

  const filteredBuildings = BUILDINGS.filter(
    (b) => b.category === selectedCategory && b.unlocked
  );

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-2">
      {/* Category selector - vertical tabs */}
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-2 space-y-1">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setIsExpanded(true);
              }}
              className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
                isActive
                  ? 'bg-white/20 shadow-lg scale-105'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              title={category.name}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-[9px] text-white/70 font-medium">{category.name.slice(0,4)}</span>
            </button>
          );
        })}
        
        {/* Clear/Demolish tool */}
        <button
          onClick={() => handleBuildingSelect('empty')}
          className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all border-t border-white/10 mt-2 pt-2 ${
            selectedBuilding === 'empty'
              ? 'bg-red-500/30 shadow-lg scale-105'
              : 'bg-white/5 hover:bg-white/10'
          }`}
          title="Demolish"
        >
          <span className="text-2xl">💥</span>
          <span className="text-[9px] text-white/70 font-medium">Clear</span>
        </button>
      </div>

      {/* Building panel */}
      {isExpanded && (
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{currentCategory?.icon}</span>
              <div>
                <h3 className="text-white font-bold text-sm">{currentCategory?.name}</h3>
                <p className="text-slate-400 text-xs">{filteredBuildings.length} available</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Buildings grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {filteredBuildings.map((building) => {
              const config = BUILDING_CONFIG[building.type];
              const isSelected = selectedBuilding === building.type;
              return (
                <button
                  key={building.type}
                  onClick={() => handleBuildingSelect(building.type)}
                  className={`group relative rounded-lg p-3 transition-all ${
                    isSelected
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-[1.02]'
                      : 'bg-slate-700/50 hover:bg-slate-700 hover:scale-[1.02]'
                  }`}
                >
                  {/* Building preview */}
                  <div className="flex items-center justify-center mb-2">
                    <div
                      className="w-16 h-16 rounded-md shadow-md border-2 transition-all"
                      style={{
                        backgroundColor: config.color,
                        borderColor: isSelected ? '#fff' : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  </div>
                  
                  {/* Building info */}
                  <div className="text-center">
                    <div className={`font-bold text-xs mb-1 ${isSelected ? 'text-white' : 'text-white/90'}`}>
                      {building.name}
                    </div>
                    <div className={`text-[10px] mb-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {building.description}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px]">
                      <span className={`flex items-center gap-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-300'}`}>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        {config.width}×{config.height}
                      </span>
                      {config.population > 0 && (
                        <span className={`flex items-center gap-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-300'}`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          {config.population}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
