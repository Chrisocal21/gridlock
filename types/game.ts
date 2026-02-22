export type BuildingType = 
  | 'empty'
  | 'ocean'
  | 'beach'
  | 'road'
  | 'dirt_path'
  | 'paved_road'
  | 'four_lane_road'
  | 'highway'
  | 'river'
  | 'bridge'
  | 'residential_shack'
  | 'residential_house'
  | 'residential_apartment'
  | 'residential_highrise'
  | 'residential_luxury'
  | 'commercial_store'
  | 'commercial_strip'
  | 'commercial_shopping'
  | 'commercial_plaza'
  | 'industrial_warehouse'
  | 'industrial_factory'
  | 'industrial_distribution'
  | 'green_tree'
  | 'green_park'
  | 'green_reserve'
  | 'green_promenade'
  | 'civic_school'
  | 'civic_hospital'
  | 'civic_police'
  | 'civic_fire'
  | 'civic_hall'
  | 'civic_transit';

export interface Tile {
  x: number;
  y: number;
  building: BuildingType;
  isLocked: boolean;
  occupiedBy?: { x: number; y: number }; // For multi-tile buildings, points to anchor tile
}

export interface BuildingConfig {
  width: number;  // Tiles wide
  height: number; // Tiles tall
  population: number;
  color: string;
  category: 'residential' | 'commercial' | 'industrial' | 'green' | 'civic' | 'infrastructure';
  sprite: string; // Placeholder key for artwork - use mass find/replace later to swap with actual art
}

// Building size and property definitions
export const BUILDING_CONFIG: Record<BuildingType, BuildingConfig> = {
  // Infrastructure (1x1)
  empty: { width: 1, height: 1, population: 0, color: '#1e293b', category: 'infrastructure', sprite: 'SPRITE_EMPTY' },
  ocean: { width: 1, height: 1, population: 0, color: '#0891b2', category: 'infrastructure', sprite: 'SPRITE_OCEAN' },
  beach: { width: 1, height: 1, population: 0, color: '#f5deb3', category: 'infrastructure', sprite: 'SPRITE_BEACH' },
  road: { width: 1, height: 1, population: 0, color: '#475569', category: 'infrastructure', sprite: 'SPRITE_ROAD' },
  dirt_path: { width: 1, height: 1, population: 0, color: '#78716c', category: 'infrastructure', sprite: 'SPRITE_DIRT_PATH' },
  paved_road: { width: 1, height: 1, population: 0, color: '#475569', category: 'infrastructure', sprite: 'SPRITE_PAVED_ROAD' },
  four_lane_road: { width: 2, height: 1, population: 0, color: '#334155', category: 'infrastructure', sprite: 'SPRITE_4LANE_ROAD' },
  highway: { width: 3, height: 1, population: 0, color: '#1e293b', category: 'infrastructure', sprite: 'SPRITE_HIGHWAY' },
  river: { width: 1, height: 1, population: 0, color: '#0e7490', category: 'infrastructure', sprite: 'SPRITE_RIVER' },
  bridge: { width: 1, height: 1, population: 0, color: '#64748b', category: 'infrastructure', sprite: 'SPRITE_BRIDGE' },
  
  // Residential (varied sizes)
  residential_shack: { width: 1, height: 1, population: 3, color: '#b86454', category: 'residential', sprite: 'SPRITE_RES_SHACK' },
  residential_house: { width: 2, height: 2, population: 8, color: '#d47c6a', category: 'residential', sprite: 'SPRITE_RES_HOUSE' },
  residential_apartment: { width: 2, height: 2, population: 25, color: '#e89580', category: 'residential', sprite: 'SPRITE_RES_APARTMENT' },
  residential_highrise: { width: 3, height: 3, population: 120, color: '#f4b5a3', category: 'residential', sprite: 'SPRITE_RES_HIGHRISE' },
  residential_luxury: { width: 3, height: 3, population: 60, color: '#c9836f', category: 'residential', sprite: 'SPRITE_RES_LUXURY' },
  
  // Commercial (varied sizes)
  commercial_store: { width: 1, height: 1, population: 5, color: '#d97706', category: 'commercial', sprite: 'SPRITE_COM_STORE' },
  commercial_strip: { width: 3, height: 1, population: 15, color: '#f59e0b', category: 'commercial', sprite: 'SPRITE_COM_STRIP' },
  commercial_shopping: { width: 3, height: 3, population: 40, color: '#fbbf24', category: 'commercial', sprite: 'SPRITE_COM_SHOPPING' },
  commercial_plaza: { width: 4, height: 4, population: 80, color: '#fcd34d', category: 'commercial', sprite: 'SPRITE_COM_PLAZA' },
  
  // Industrial (larger sizes)
  industrial_warehouse: { width: 2, height: 3, population: 10, color: '#475569', category: 'industrial', sprite: 'SPRITE_IND_WAREHOUSE' },
  industrial_factory: { width: 3, height: 3, population: 30, color: '#64748b', category: 'industrial', sprite: 'SPRITE_IND_FACTORY' },
  industrial_distribution: { width: 4, height: 3, population: 50, color: '#94a3b8', category: 'industrial', sprite: 'SPRITE_IND_DISTRIBUTION' },
  
  // Green Spaces (1x1 and larger)
  green_tree: { width: 1, height: 1, population: 0, color: '#84cc16', category: 'green', sprite: 'SPRITE_GREEN_TREE' },
  green_park: { width: 2, height: 2, population: 0, color: '#a3e635', category: 'green', sprite: 'SPRITE_GREEN_PARK' },
  green_reserve: { width: 3, height: 3, population: 0, color: '#65a30d', category: 'green', sprite: 'SPRITE_GREEN_RESERVE' },
  green_promenade: { width: 4, height: 2, population: 0, color: '#4d7c0f', category: 'green', sprite: 'SPRITE_GREEN_PROMENADE' },
  
  // Civic (varied sizes)
  civic_school: { width: 2, height: 2, population: 20, color: '#14b8a6', category: 'civic', sprite: 'SPRITE_CIVIC_SCHOOL' },
  civic_hospital: { width: 3, height: 3, population: 50, color: '#2dd4bf', category: 'civic', sprite: 'SPRITE_CIVIC_HOSPITAL' },
  civic_police: { width: 2, height: 2, population: 15, color: '#5eead4', category: 'civic', sprite: 'SPRITE_CIVIC_POLICE' },
  civic_fire: { width: 2, height: 2, population: 15, color: '#99f6e4', category: 'civic', sprite: 'SPRITE_CIVIC_FIRE' },
  civic_hall: { width: 3, height: 3, population: 30, color: '#0d9488', category: 'civic', sprite: 'SPRITE_CIVIC_HALL' },
  civic_transit: { width: 2, height: 2, population: 25, color: '#0f766e', category: 'civic', sprite: 'SPRITE_CIVIC_TRANSIT' },
};

export interface GameAction {
  type: 'place' | 'draw';
  tiles: Array<{ x: number; y: number; previous: BuildingType; new: BuildingType }>;
}

export interface GameState {
  grid: Tile[][];
  gridSize: number;
  population: number;
  traffic: number;      // 0-100 percentage
  pollution: number;    // 0-100 percentage
  happiness: number;    // 0-100 percentage
  selectedTile: { x: number; y: number } | null;
  selectedBuilding: BuildingType | null;
  moveStack: GameAction[];
  currentSlot: 1 | 2 | 3;
  
  // Actions
  initializeGrid: () => void;
  setTileBuilding: (x: number, y: number, building: BuildingType) => void;
  selectTile: (x: number, y: number) => void;
  setSelectedBuilding: (building: BuildingType | null) => void;
  undo: () => void;
  calculatePopulation: () => void;
  calculateTraffic: () => void;
  calculatePollution: () => void;
  calculateHappiness: () => void;
  calculateMetrics: () => void;  // Calls all calculation functions
  saveToSlot: (slot: 1 | 2 | 3) => void;
  loadFromSlot: (slot: 1 | 2 | 3) => void;
  addAction: (action: GameAction) => void;
}
