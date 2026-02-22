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
}

// Simple SVG icons for building types
const BuildingIcon = ({ type, color }: { type: BuildingType; color: string }) => {
  const iconProps = {
    width: "48",
    height: "48",
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  // Residential buildings - house shapes
  if (type.startsWith('residential_shack')) {
    return (
      <svg {...iconProps}>
        <rect x="12" y="20" width="24" height="20" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <path d="M8 20L24 8L40 20" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="20" y="28" width="8" height="12" fill="rgba(0,0,0,0.3)"/>
      </svg>
    );
  }
  if (type.startsWith('residential_house')) {
    return (
      <svg {...iconProps}>
        <rect x="10" y="18" width="28" height="22" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <path d="M6 18L24 6L42 18" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="18" y="26" width="6" height="8" fill="rgba(0,0,0,0.3)"/>
        <rect x="26" y="26" width="6" height="6" fill="rgba(255,255,255,0.4)"/>
        <rect x="16" y="21" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
      </svg>
    );
  }
  if (type.startsWith('residential_apartment')) {
    return (
      <svg {...iconProps}>
        <rect x="12" y="12" width="24" height="30" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="16" y="16" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="22" y="16" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="28" y="16" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="16" y="22" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="22" y="22" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="28" y="22" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="16" y="28" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="28" y="28" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="20" y="34" width="8" height="8" fill="rgba(0,0,0,0.3)"/>
      </svg>
    );
  }
  if (type.startsWith('residential_highrise')) {
    return (
      <svg {...iconProps}>
        <rect x="14" y="6" width="20" height="36" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="18" y="10" width="3" height="3" fill="rgba(255,255,255,0.5)"/>
        <rect x="24" y="10" width="3" height="3" fill="rgba(255,255,255,0.5)"/>
        <rect x="18" y="16" width="3" height="3" fill="rgba(255,255,255,0.5)"/>
        <rect x="24" y="16" width="3" height="3" fill="rgba(255,255,255,0.5)"/>
        <rect x="18" y="22" width="3" height="3" fill="rgba(255,255,255,0.5)"/>
        <rect x="24" y="22" width="3" height="3" fill="rgba(255,255,255,0.5)"/>
        <rect x="18" y="28" width="3" height="3" fill="rgba(255,255,255,0.5)"/>
        <rect x="24" y="28" width="3" height="3" fill="rgba(255,255,255,0.5)"/>
        <rect x="20" y="34" width="8" height="8" fill="rgba(0,0,0,0.3)"/>
      </svg>
    );
  }
  if (type.startsWith('residential_luxury')) {
    return (
      <svg {...iconProps}>
        <rect x="8" y="14" width="32" height="26" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <path d="M4 14L24 4L44 14" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="18" y="24" width="6" height="10" fill="rgba(0,0,0,0.3)"/>
        <rect x="12" y="20" width="5" height="5" fill="rgba(255,255,255,0.4)"/>
        <rect x="26" y="20" width="5" height="5" fill="rgba(255,255,255,0.4)"/>
        <circle cx="24" cy="10" r="2" fill="rgba(255,215,0,0.6)"/>
      </svg>
    );
  }

  // Commercial buildings - storefronts
  if (type.startsWith('commercial_store')) {
    return (
      <svg {...iconProps}>
        <rect x="12" y="16" width="24" height="24" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="12" y="12" width="24" height="4" fill="rgba(0,0,0,0.2)"/>
        <rect x="18" y="26" width="12" height="14" fill="rgba(0,0,0,0.3)"/>
        <rect x="20" y="28" width="8" height="10" fill="rgba(135,206,235,0.5)"/>
      </svg>
    );
  }
  if (type.startsWith('commercial')) {
    return (
      <svg {...iconProps}>
        <rect x="8" y="14" width="32" height="26" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="8" y="10" width="32" height="4" fill="rgba(0,0,0,0.2)"/>
        <rect x="12" y="18" width="10" height="10" fill="rgba(135,206,235,0.5)"/>
        <rect x="26" y="18" width="10" height="10" fill="rgba(135,206,235,0.5)"/>
        <rect x="16" y="30" width="6" height="10" fill="rgba(0,0,0,0.3)"/>
        <rect x="26" y="30" width="6" height="10" fill="rgba(0,0,0,0.3)"/>
      </svg>
    );
  }

  // Industrial buildings - factory shapes
  if (type.startsWith('industrial')) {
    return (
      <svg {...iconProps}>
        <rect x="10" y="20" width="28" height="20" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="18" y="10" width="6" height="10" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="20" y="6" width="2" height="4" fill="rgba(100,100,100,0.6)"/>
        <rect x="14" y="26" width="6" height="8" fill="rgba(0,0,0,0.3)"/>
        <rect x="28" y="26" width="6" height="8" fill="rgba(0,0,0,0.3)"/>
        <circle cx="22" cy="8" r="1.5" fill="rgba(200,200,200,0.5)"/>
      </svg>
    );
  }

  // Green spaces - trees and parks
  if (type === 'green_tree') {
    return (
      <svg {...iconProps}>
        <rect x="22" y="28" width="4" height="12" fill="#8B4513"/>
        <circle cx="24" cy="20" r="10" fill={color}/>
        <circle cx="18" cy="16" r="6" fill={color}/>
        <circle cx="30" cy="16" r="6" fill={color}/>
      </svg>
    );
  }
  if (type.startsWith('green')) {
    return (
      <svg {...iconProps}>
        <rect x="6" y="6" width="36" height="36" fill={color} opacity="0.3" rx="2"/>
        <circle cx="16" cy="16" r="6" fill={color}/>
        <circle cx="32" cy="16" r="5" fill={color}/>
        <circle cx="20" cy="28" r="5" fill={color}/>
        <circle cx="32" cy="32" r="6" fill={color}/>
        <rect x="14" y="26" width="2" height="6" fill="#8B4513"/>
        <rect x="30" y="28" width="2" height="6" fill="#8B4513"/>
      </svg>
    );
  }

  // Civic buildings - official buildings
  if (type.startsWith('civic_school')) {
    return (
      <svg {...iconProps}>
        <rect x="10" y="16" width="28" height="24" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="20" y="8" width="8" height="8" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="14" y="22" width="6" height="6" fill="rgba(135,206,235,0.5)"/>
        <rect x="22" y="22" width="6" height="6" fill="rgba(135,206,235,0.5)"/>
        <rect x="30" y="22" width="6" height="6" fill="rgba(135,206,235,0.5)"/>
        <rect x="20" y="32" width="8" height="8" fill="rgba(0,0,0,0.3)"/>
        <circle cx="24" cy="12" r="1.5" fill="#FFD700"/>
      </svg>
    );
  }
  if (type.startsWith('civic_hospital')) {
    return (
      <svg {...iconProps}>
        <rect x="10" y="12" width="28" height="28" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="20" y="20" width="3" height="10" fill="#FF0000"/>
        <rect x="17" y="23" width="9" height="3" fill="#FF0000"/>
        <rect x="14" y="16" width="5" height="5" fill="rgba(255,255,255,0.4)"/>
        <rect x="29" y="16" width="5" height="5" fill="rgba(255,255,255,0.4)"/>
      </svg>
    );
  }
  if (type.startsWith('civic_police')) {
    return (
      <svg {...iconProps}>
        <rect x="12" y="16" width="24" height="24" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <circle cx="24" cy="24" r="6" fill="#0000FF" opacity="0.3"/>
        <rect x="20" y="32" width="8" height="8" fill="rgba(0,0,0,0.3)"/>
        <rect x="16" y="20" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="28" y="20" width="4" height="4" fill="rgba(255,255,255,0.4)"/>
      </svg>
    );
  }
  if (type.startsWith('civic_fire')) {
    return (
      <svg {...iconProps}>
        <rect x="12" y="16" width="24" height="24" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <path d="M24 12 L26 16 L30 18 L26 20 L24 24 L22 20 L18 18 L22 16 Z" fill="#FF4500"/>
        <rect x="20" y="32" width="8" height="8" fill="rgba(0,0,0,0.3)"/>
      </svg>
    );
  }
  if (type.startsWith('civic')) {
    return (
      <svg {...iconProps}>
        <rect x="8" y="14" width="32" height="26" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <path d="M24 6 L6 14 L42 14 Z" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        <rect x="20" y="24" width="8" height="16" fill="rgba(0,0,0,0.3)"/>
        <rect x="12" y="18" width="3" height="12" fill="rgba(255,255,255,0.3)"/>
        <rect x="16" y="18" width="3" height="12" fill="rgba(255,255,255,0.3)"/>
        <rect x="29" y="18" width="3" height="12" fill="rgba(255,255,255,0.3)"/>
        <rect x="33" y="18" width="3" height="12" fill="rgba(255,255,255,0.3)"/>
      </svg>
    );
  }

  // Infrastructure - roads
  if (type === 'dirt_path') {
    return (
      <svg {...iconProps}>
        <rect x="8" y="18" width="32" height="12" fill={color} opacity="0.5"/>
        <circle cx="14" cy="24" r="1" fill="rgba(139,69,19,0.4)"/>
        <circle cx="24" cy="22" r="1" fill="rgba(139,69,19,0.4)"/>
        <circle cx="34" cy="26" r="1" fill="rgba(139,69,19,0.4)"/>
      </svg>
    );
  }
  if (type === 'paved_road') {
    return (
      <svg {...iconProps}>
        <rect x="8" y="18" width="32" height="12" fill={color}/>
        <rect x="12" y="23" width="6" height="2" fill="rgba(255,255,255,0.8)"/>
        <rect x="22" y="23" width="6" height="2" fill="rgba(255,255,255,0.8)"/>
        <rect x="32" y="23" width="6" height="2" fill="rgba(255,255,255,0.8)"/>
      </svg>
    );
  }
  if (type === 'four_lane_road') {
    return (
      <svg {...iconProps}>
        <rect x="6" y="16" width="36" height="16" fill={color}/>
        <rect x="10" y="22" width="6" height="1.5" fill="rgba(255,255,255,0.8)"/>
        <rect x="20" y="22" width="6" height="1.5" fill="rgba(255,255,255,0.8)"/>
        <rect x="30" y="22" width="6" height="1.5" fill="rgba(255,255,255,0.8)"/>
        <rect x="6" y="24" width="36" height="1" fill="rgba(255,255,0,0.7)"/>
      </svg>
    );
  }
  if (type === 'highway') {
    return (
      <svg {...iconProps}>
        <rect x="4" y="14" width="40" height="20" fill={color}/>
        <rect x="8" y="21" width="8" height="2" fill="rgba(255,255,255,0.8)"/>
        <rect x="20" y="21" width="8" height="2" fill="rgba(255,255,255,0.8)"/>
        <rect x="32" y="21" width="8" height="2" fill="rgba(255,255,255,0.8)"/>
        <rect x="4" y="24" width="40" height="1" fill="rgba(255,255,0,0.8)"/>
        <rect x="4" y="23" width="40" height="1" fill="rgba(255,255,0,0.8)"/>
      </svg>
    );
  }

  // Default fallback - simple square
  return (
    <svg {...iconProps}>
      <rect x="12" y="12" width="24" height="24" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
    </svg>
  );
};

const BUILDINGS: Building[] = [
  // Residential
  { type: 'residential_shack', name: 'Shack', category: 'residential', unlocked: true },
  { type: 'residential_house', name: 'House', category: 'residential', unlocked: true },
  { type: 'residential_apartment', name: 'Apartment', category: 'residential', unlocked: true },
  { type: 'residential_highrise', name: 'High-rise', category: 'residential', unlocked: true },
  { type: 'residential_luxury', name: 'Luxury', category: 'residential', unlocked: true },
  
  // Commercial
  { type: 'commercial_store', name: 'Store', category: 'commercial', unlocked: true },
  { type: 'commercial_strip', name: 'Strip Mall', category: 'commercial', unlocked: true },
  { type: 'commercial_shopping', name: 'Shopping', category: 'commercial', unlocked: true },
  { type: 'commercial_plaza', name: 'Plaza', category: 'commercial', unlocked: true },
  
  // Industrial
  { type: 'industrial_warehouse', name: 'Warehouse', category: 'industrial', unlocked: true },
  { type: 'industrial_factory', name: 'Factory', category: 'industrial', unlocked: true },
  { type: 'industrial_distribution', name: 'Distribution', category: 'industrial', unlocked: true },
  
  // Green
  { type: 'green_tree', name: 'Tree', category: 'green', unlocked: true },
  { type: 'green_park', name: 'Park', category: 'green', unlocked: true },
  { type: 'green_reserve', name: 'Reserve', category: 'green', unlocked: true },
  { type: 'green_promenade', name: 'Promenade', category: 'green', unlocked: true },
  
  // Civic
  { type: 'civic_school', name: 'School', category: 'civic', unlocked: true },
  { type: 'civic_hospital', name: 'Hospital', category: 'civic', unlocked: true },
  { type: 'civic_police', name: 'Police', category: 'civic', unlocked: true },
  { type: 'civic_fire', name: 'Fire Station', category: 'civic', unlocked: true },
  { type: 'civic_hall', name: 'City Hall', category: 'civic', unlocked: true },
  { type: 'civic_transit', name: 'Transit Hub', category: 'civic', unlocked: true },
  
  // Infrastructure
  { type: 'dirt_path', name: 'Dirt Path', category: 'infrastructure', unlocked: true },
  { type: 'paved_road', name: 'Road', category: 'infrastructure', unlocked: true },
  { type: 'four_lane_road', name: '4-Lane', category: 'infrastructure', unlocked: true },
  { type: 'highway', name: 'Highway', category: 'infrastructure', unlocked: true },
];

const CATEGORIES: Array<{ id: BuildingCategory; name: string; color: string }> = [
  { id: 'residential', name: 'Residential', color: '#d4847c' },
  { id: 'commercial', name: 'Commercial', color: '#e8b86d' },
  { id: 'industrial', name: 'Industrial', color: '#6e7c8c' },
  { id: 'green', name: 'Green', color: '#8fa688' },
  { id: 'civic', name: 'Civic', color: '#6d8fe8' },
  { id: 'infrastructure', name: 'Roads', color: '#64748b' },
];

export default function MenuButton({ onOpenMenu }: { onOpenMenu: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'build' | 'options'>('build');
  const [selectedCategory, setSelectedCategory] = useState<BuildingCategory>('residential');
  
  const saveToSlot = useGameStore((state) => state.saveToSlot);
  const currentSlot = useGameStore((state) => state.currentSlot);
  const selectedBuilding = useGameStore((state) => state.selectedBuilding);
  const setSelectedBuilding = useGameStore((state) => state.setSelectedBuilding);

  const handleMenuClick = () => {
    // Save before returning to menu
    saveToSlot(currentSlot);
    onOpenMenu();
  };

  const handleSave = () => {
    saveToSlot(currentSlot);
    // Brief visual feedback
    const button = document.getElementById('save-button');
    if (button) {
      button.textContent = 'Saved!';
      setTimeout(() => {
        button.textContent = 'Save Game';
      }, 1000);
    }
  };

  const handleBuildingSelect = (buildingType: BuildingType) => {
    setSelectedBuilding(buildingType);
    setIsOpen(false); // Auto-close menu after selecting a building
  };

  const filteredBuildings = BUILDINGS.filter(
    (b) => b.category === selectedCategory && b.unlocked
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 backdrop-blur-sm p-2.5 rounded-lg shadow-xl z-50 transition-all active:scale-95 border-2 ${
          isOpen
            ? 'bg-slate-600 border-slate-400'
            : 'bg-slate-700 border-slate-500 hover:bg-slate-600'
        }`}
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-slate-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-slate-800/98 backdrop-blur-md shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with Tabs */}
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-white font-bold text-lg mb-3">Menu</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('build')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'build'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Build
              </button>
              <button
                onClick={() => setActiveTab('options')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'options'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Options
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'build' ? (
              <div className="space-y-4">
                {/* Category Selector */}
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'text-white shadow-md'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                      style={{
                        backgroundColor:
                          selectedCategory === category.id ? category.color : undefined,
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Buildings Grid */}
                <div>
                  <h3 className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.name} Buildings
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredBuildings.map((building) => {
                      const config = BUILDING_CONFIG[building.type];
                      const isSelected = selectedBuilding === building.type;
                      return (
                        <button
                          key={building.type}
                          onClick={() => handleBuildingSelect(building.type)}
                          className={`relative rounded-lg p-2 transition-all ${
                            isSelected
                              ? 'bg-blue-500 shadow-lg scale-[1.02]'
                              : 'bg-slate-700/50 hover:bg-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-1.5">
                            <BuildingIcon type={building.type} color={config.color} />
                          </div>
                          <div className="text-center">
                            <div className={`font-bold text-[10px] mb-0.5 ${isSelected ? 'text-white' : 'text-white/90'}`}>
                              {building.name}
                            </div>
                            <div className={`text-[9px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                              {config.width}×{config.height} • {config.population > 0 ? `${config.population} pop` : 'No pop'}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                    
                    {/* Demolish/Clear Tool */}
                    <button
                      onClick={() => handleBuildingSelect('empty')}
                      className={`relative rounded-lg p-2 transition-all ${
                        selectedBuilding === 'empty'
                          ? 'bg-red-500 shadow-lg scale-[1.02]'
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1.5">
                        <div className="w-12 h-12 rounded border-2 bg-slate-600 border-slate-500 flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold text-[10px] ${selectedBuilding === 'empty' ? 'text-white' : 'text-white/90'}`}>
                          Clear
                        </div>
                        <div className={`text-[9px] ${selectedBuilding === 'empty' ? 'text-red-100' : 'text-slate-400'}`}>
                          Demolish
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Options Tab */
              <div className="space-y-3">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <h3 className="text-white font-medium text-sm mb-2">Game Settings</h3>
                  <p className="text-slate-400 text-xs mb-3">Current save slot: {currentSlot}</p>
                  <button
                    id="save-button"
                    onClick={handleSave}
                    className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 px-4 rounded-md text-sm font-medium transition-all active:scale-95 mb-2"
                  >
                    Save Game
                  </button>
                  <button
                    onClick={handleMenuClick}
                    className="w-full bg-slate-600 hover:bg-slate-500 text-white py-2.5 px-4 rounded-md text-sm font-medium transition-all active:scale-95"
                  >
                    Back to Main Menu
                  </button>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3">
                  <h3 className="text-white font-medium text-sm mb-2">Instructions</h3>
                  <ul className="text-slate-300 text-xs space-y-1.5">
                    <li>• Select a building from the Build tab</li>
                    <li>• Hover over the map to preview placement</li>
                    <li>• Click to place (green = valid, red = invalid)</li>
                    <li>• Hold & drag for 0.3s to draw roads</li>
                    <li>• Use Undo button to reverse actions</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
