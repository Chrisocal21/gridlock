'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BuildingType } from '@/types/game';
import { RoadShape } from './RoadShapePicker';

type BuildingCategory = 'zones' | 'roads' | 'infrastructure' | 'services' | 'decorations' | 'tools';

interface CategoryButton {
  id: BuildingCategory;
  label: string;
  icon: string;
  buildings: BuildingType[];
}

interface BuildingSidebarProps {
  roadShape: RoadShape;
  onRoadShapeChange: (shape: RoadShape) => void;
}

const categories: CategoryButton[] = [
  {
    id: 'zones',
    label: 'Zones',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    buildings: [
      'residential_shack',
      'residential_house',
      'residential_apartment',
      'residential_highrise',
      'residential_luxury',
      'commercial_store',
      'commercial_strip',
      'commercial_shopping',
      'commercial_plaza',
      'industrial_warehouse',
      'industrial_factory',
      'industrial_distribution'
    ]
  },
  {
    id: 'roads',
    label: 'Roads',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    buildings: [
      'dirt_path',
      'paved_road',
      'four_lane_road',
      'highway'
    ]
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    buildings: [
      'bridge',
      'river'
    ]
  },
  {
    id: 'services',
    label: 'Services',
    icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
    buildings: [
      'civic_school',
      'civic_hospital',
      'civic_police',
      'civic_fire',
      'civic_hall',
      'civic_transit'
    ]
  },
  {
    id: 'decorations',
    label: 'Green',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    buildings: [
      'green_tree',
      'green_park',
      'green_reserve',
      'green_promenade'
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    buildings: [
      'empty'
    ]
  }
];

const buildingNames: Record<BuildingType, string> = {
  empty: 'Demolish',
  ocean: 'Ocean',
  beach: 'Beach',
  road: 'Road',
  dirt_path: 'Dirt Path',
  paved_road: 'Road',
  four_lane_road: '4-Lane',
  highway: 'Highway',
  river: 'River',
  bridge: 'Bridge',
  residential_shack: 'Shack',
  residential_house: 'House',
  residential_apartment: 'Apartment',
  residential_highrise: 'Tower',
  residential_luxury: 'Luxury',
  commercial_store: 'Store',
  commercial_strip: 'Strip Mall',
  commercial_shopping: 'Shopping',
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
  civic_fire: 'Fire',
  civic_hall: 'City Hall',
  civic_transit: 'Transit'
};

const roadShapes: { id: RoadShape; label: string; svg: string }[] = [
  { 
    id: 'straight-h', 
    label: 'Horizontal', 
    svg: '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/>'
  },
  { 
    id: 'straight-v', 
    label: 'Vertical', 
    svg: '<line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="3"/>'
  },
  { 
    id: 'turn-ne', 
    label: 'Turn NE', 
    svg: '<path d="M 12 22 Q 12 12 22 12" stroke="currentColor" stroke-width="3" fill="none"/>'
  },
  { 
    id: 'turn-se', 
    label: 'Turn SE', 
    svg: '<path d="M 12 2 Q 12 12 22 12" stroke="currentColor" stroke-width="3" fill="none"/>'
  },
  { 
    id: 'turn-sw', 
    label: 'Turn SW', 
    svg: '<path d="M 12 2 Q 12 12 2 12" stroke="currentColor" stroke-width="3" fill="none"/>'
  },
  { 
    id: 'turn-nw', 
    label: 'Turn NW', 
    svg: '<path d="M 12 22 Q 12 12 2 12" stroke="currentColor" stroke-width="3" fill="none"/>'
  },
  { 
    id: 't-north', 
    label: 'T North', 
    svg: '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/><line x1="12" y1="12" x2="12" y2="2" stroke="currentColor" stroke-width="3"/>'
  },
  { 
    id: 't-south', 
    label: 'T South', 
    svg: '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/><line x1="12" y1="12" x2="12" y2="22" stroke="currentColor" stroke-width="3"/>'
  },
  { 
    id: 't-east', 
    label: 'T East', 
    svg: '<line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="3"/><line x1="12" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/>'
  },
  { 
    id: 't-west', 
    label: 'T West', 
    svg: '<line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="3"/><line x1="12" y1="12" x2="2" y2="12" stroke="currentColor" stroke-width="3"/>'
  },
  { 
    id: 'intersection', 
    label: '4-Way', 
    svg: '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="3"/>'
  },
];

export default function BuildingSidebar({ roadShape, onRoadShapeChange }: BuildingSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<BuildingCategory | null>(null);
  const selectedBuilding = useGameStore((state) => state.selectedBuilding);
  const setSelectedBuilding = useGameStore((state) => state.setSelectedBuilding);

  const handleCategoryClick = (categoryId: BuildingCategory) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };

  const handleBuildingSelect = (building: BuildingType) => {
    setSelectedBuilding(building);
    // Close panel to allow better placement visibility
    setActiveCategory(null);
  };

  return (
    <>
      {/* Main Sidebar */}
      <div className="fixed left-0 top-14 bottom-0 z-40 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 w-16">
        <div className="flex flex-col items-center py-2 gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center transition-all
                ${activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }
              `}
              title={category.label}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Panel */}
      {activeCategory && (
        <div className="fixed left-16 top-14 bottom-0 z-40 w-56 bg-slate-800/98 backdrop-blur-sm border-r border-slate-700 animate-in slide-in-from-left duration-200 overflow-y-auto">
          <div className="p-3">
            <h3 className="text-slate-200 font-semibold mb-3 text-sm">
              {categories.find(c => c.id === activeCategory)?.label}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories
                .find(c => c.id === activeCategory)
                ?.buildings.map((building) => (
                  <button
                    key={building}
                    onClick={() => handleBuildingSelect(building)}
                    className={`
                      p-3 rounded-lg transition-all text-left
                      ${selectedBuilding === building
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }
                    `}
                  >
                    <div className="text-xs font-medium truncate">
                      {buildingNames[building]}
                    </div>
                  </button>
                ))}
            </div>

            {/* Road Shape Picker - shown when roads category is active */}
            {activeCategory === 'roads' && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <h4 className="text-slate-300 font-medium mb-2 text-xs">Road Shape</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {roadShapes.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => onRoadShapeChange(shape.id)}
                      className={`
                        w-full aspect-square rounded transition-all flex items-center justify-center
                        ${roadShape === shape.id 
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }
                      `}
                      title={shape.label}
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        className="w-6 h-6"
                        dangerouslySetInnerHTML={{ __html: shape.svg }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
