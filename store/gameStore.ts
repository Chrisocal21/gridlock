import { create } from 'zustand';
import { GameState, Tile, BuildingType, GameAction, BUILDING_CONFIG } from '@/types/game';

const GRID_SIZE = 65; // Grid height
const GRID_WIDTH = 200; // Grid width - massive expansion area for desktop, mobile scrolls horizontally

// Organic coastline - smooth flowing curve
// Each value is the ocean width (columns 0 to value-1) for that row
export const COASTLINE = [
  5, 5, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8, 8, 8,
  8, 7.8, 7.6, 7.4, 7.2, 7, 6.8, 6.6, 6.4, 6.2, 6, 5.8, 5.6, 5.4, 5.2, 5, 4.8, 4.8, 4.8, 5,
  5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.6, 6.8, 7, 7, 7, 7, 7, 7, 6.8, 6.6, 6.4, 6.2, 6,
  6, 6, 6, 6, 6
].map(v => Math.round(v));

const createEmptyGrid = (): Tile[][] => {
  const grid: Tile[][] = [];
  
  const beachWidth = 2; // 2 tiles of beach
  const startingDistrictWidth = 8; // 8 tiles wide from coast (increased for varied coastline)
  
  for (let y = 0; y < GRID_SIZE; y++) {
    grid[y] = [];
    const oceanWidth = COASTLINE[y] || 6; // Default to 6 if coastline array is shorter
    
    for (let x = 0; x < GRID_WIDTH; x++) {
      let building: BuildingType = 'empty';
      let isLocked = false;
      
      // Ocean tiles on the left (west) side - organic coastline
      if (x < oceanWidth) {
        building = 'ocean';
        isLocked = true; // Ocean is always locked
      } 
      // Beach tiles - transition between ocean and land
      else if (x >= oceanWidth && x < oceanWidth + beachWidth) {
        building = 'beach';
        isLocked = true; // Beach is not buildable
      } 
      else {
        // Starting district: follows the coastline + beach, extends 8 tiles inland
        // Creates a natural development zone along the organic coast
        const startX = oceanWidth + beachWidth;
        const endX = oceanWidth + beachWidth + startingDistrictWidth - 1;
        
        const inStartingDistrict = x >= startX && x <= endX;
        
        // Lock everything except the starting district
        isLocked = !inStartingDistrict;
      }
      
      grid[y][x] = {
        x,
        y,
        building,
        isLocked,
      };
    }
  }
  return grid;
};

export const useGameStore = create<GameState>((set, get) => ({
  grid: createEmptyGrid(),
  gridSize: GRID_SIZE,
  population: 0,
  traffic: 0,
  pollution: 0,
  happiness: 100,
  selectedTile: null,
  selectedBuilding: null,
  moveStack: [],
  currentSlot: 1,

  initializeGrid: () => {
    set({ 
      grid: createEmptyGrid(), 
      population: 0, 
      traffic: 0,
      pollution: 0,
      happiness: 100,
      moveStack: [], 
      selectedTile: null 
    });
  },

  setTileBuilding: (x: number, y: number, building: BuildingType) => {
    const state = get();
    const config = BUILDING_CONFIG[building];
    const newGrid = state.grid.map(row => row.map(tile => ({ ...tile })));
    
    // Check if multi-tile building fits
    const affectedTiles: Array<{ x: number; y: number; previous: BuildingType }> = [];
    
    for (let dy = 0; dy < config.height; dy++) {
      for (let dx = 0; dx < config.width; dx++) {
        const tileY = y + dy;
        const tileX = x + dx;
        
        // Check bounds
        if (tileY >= state.gridSize || tileX >= newGrid[0].length) {
          console.log('Building extends beyond grid bounds');
          return; // Can't place - out of bounds
        }
        
        const tile = newGrid[tileY][tileX];
        
        // Can't place on locked tiles (except replacing with same building type)
        if (tile.isLocked && tile.building !== building) {
          console.log('Tile is locked');
          return;
        }
        
        // Can't place on occupied tiles (unless it's empty or being modified)
        if (tile.occupiedBy && (dx !== 0 || dy !== 0)) {
          console.log('Tile is occupied by another building');
          return;
        }
        
        affectedTiles.push({ x: tileX, y: tileY, previous: tile.building });
      }
    }
    
    // Place the building on all affected tiles
    affectedTiles.forEach(({ x: tileX, y: tileY }) => {
      newGrid[tileY][tileX].building = building;
      
      // Mark as occupied by anchor tile (except anchor itself)
      if (tileX !== x || tileY !== y) {
        newGrid[tileY][tileX].occupiedBy = { x, y };
      } else {
        // Anchor tile doesn't point to itself
        delete newGrid[tileY][tileX].occupiedBy;
      }
    });
    
    const action: GameAction = {
      type: 'place',
      tiles: affectedTiles.map(({ x: tileX, y: tileY, previous }) => ({
        x: tileX,
        y: tileY,
        previous,
        new: building,
      })),
    };
    
    set({ 
      grid: newGrid,
      moveStack: [...state.moveStack, action],
    });
    
    get().calculateMetrics();
  },

  selectTile: (x: number, y: number) => {
    set({ selectedTile: { x, y } });
  },

  setSelectedBuilding: (building: BuildingType | null) => {
    set({ selectedBuilding: building });
  },

  undo: () => {
    const state = get();
    if (state.moveStack.length === 0) return;
    
    const lastAction = state.moveStack[state.moveStack.length - 1];
    const newGrid = state.grid.map(row => row.map(tile => ({ ...tile })));
    
    // Revert all tiles in the action
    lastAction.tiles.forEach(({ x, y, previous }) => {
      newGrid[y][x].building = previous;
      // Clear occupiedBy reference when reverting
      delete newGrid[y][x].occupiedBy;
    });
    
    set({
      grid: newGrid,
      moveStack: state.moveStack.slice(0, -1),
    });
    
    get().calculateMetrics();
  },

  calculatePopulation: () => {
    const state = get();
    let pop = 0;
    
    // Simple population calculation based on residential buildings
    state.grid.forEach((row, y) => {
      row.forEach((tile, x) => {
        let basePop = 0;
        
        switch (tile.building) {
          case 'residential_shack':
            basePop = 5;
            break;
          case 'residential_house':
            basePop = 10;
            break;
          case 'residential_apartment':
            basePop = 25;
            break;
          case 'residential_highrise':
            basePop = 50;
            break;
          case 'residential_luxury':
            basePop = 100;
            break;
        }
        
        if (basePop > 0) {
          // Check adjacency bonuses
          let multiplier = 1;
          
          // Check adjacent tiles
          const adjacentTiles = [
            { x: x - 1, y },
            { x: x + 1, y },
            { x, y: y - 1 },
            { x, y: y + 1 },
          ];
          
          adjacentTiles.forEach(({ x: ax, y: ay }) => {
            if (ax >= 0 && ax < state.gridSize && ay >= 0 && ay < state.gridSize) {
              const adjTile = state.grid[ay][ax];
              
              // Park adjacent to residential = bonus
              if (adjTile.building.startsWith('green_')) {
                multiplier += 0.2;
              }
              
              // Factory adjacent to residential = penalty
              if (adjTile.building.startsWith('industrial_')) {
                multiplier -= 0.3;
              }
              
              // Road adjacent = slight bonus
              if (adjTile.building.includes('road') || adjTile.building === 'paved_road') {
                multiplier += 0.1;
              }
            }
          });
          
          pop += Math.floor(basePop * Math.max(0.1, multiplier));
        }
      });
    });
    
    set({ population: pop });
    
    // Unlock zones based on population milestones
    const center = Math.floor(state.gridSize / 2);
    let maxUnlockDistance = 3; // Default 6x6 starting area
    
    if (pop >= 50000) {
      maxUnlockDistance = 6; // Full 12x12 grid unlocked
    } else if (pop >= 15000) {
      maxUnlockDistance = 5;
    } else if (pop >= 5000) {
      maxUnlockDistance = 4;
    } else if (pop >= 1000) {
      maxUnlockDistance = 4;
    }
    
    // Update locked status based on current unlock distance
    const newGrid = state.grid.map(row => row.map(tile => ({ ...tile })));
    let zonesUnlocked = false;
    
    newGrid.forEach((row, y) => {
      row.forEach((tile, x) => {
        const distanceFromCenter = Math.max(Math.abs(x - center), Math.abs(y - center));
        const shouldBeUnlocked = distanceFromCenter <= maxUnlockDistance;
        
        if (tile.isLocked && shouldBeUnlocked) {
          tile.isLocked = false;
          zonesUnlocked = true;
        }
      });
    });
    
    if (zonesUnlocked) {
      set({ grid: newGrid });
    }
  },

  calculateTraffic: () => {
    const state = get();
    let roadTiles = 0;
    let buildingTiles = 0;
    let buildingsWithoutRoads = 0;
    
    // Count roads and buildings
    state.grid.forEach((row) => {
      row.forEach((tile) => {
        if (tile.building.includes('road') || tile.building.includes('path') || tile.building.includes('highway')) {
          roadTiles++;
        } else if (!tile.building.startsWith('green_') && 
                   tile.building !== 'empty' && 
                   tile.building !== 'ocean' && 
                   tile.building !== 'river') {
          buildingTiles++;
          
          // Check if building has a road nearby (within 2 tiles)
          let hasNearbyRoad = false;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const checkX = tile.x + dx;
              const checkY = tile.y + dy;
              if (checkY >= 0 && checkY < state.gridSize && checkX >= 0 && checkX < GRID_WIDTH) {
                const checkTile = state.grid[checkY][checkX];
                if (checkTile.building.includes('road') || 
                    checkTile.building.includes('path') || 
                    checkTile.building.includes('highway')) {
                  hasNearbyRoad = true;
                  break;
                }
              }
            }
            if (hasNearbyRoad) break;
          }
          
          if (!hasNearbyRoad) {
            buildingsWithoutRoads++;
          }
        }
      });
    });
    
    // Calculate traffic percentage
    // More buildings without roads = more traffic
    // Good road coverage keeps traffic low
    let trafficPercent = 0;
    
    if (buildingTiles > 0) {
      const roadCoverageRatio = roadTiles / Math.max(buildingTiles, 1);
      const unconnectedRatio = buildingsWithoutRoads / buildingTiles;
      
      // Base traffic from building density
      trafficPercent = Math.min(buildingTiles / 50, 50); // Up to 50% from density
      
      // Add traffic from poor road coverage
      if (roadCoverageRatio < 0.3) {
        trafficPercent += (0.3 - roadCoverageRatio) * 100;
      }
      
      // Add traffic from unconnected buildings
      trafficPercent += unconnectedRatio * 40;
      
      // Highways reduce traffic
      const highwayBonus = roadTiles * 0.1;
      trafficPercent = Math.max(0, trafficPercent - highwayBonus);
    }
    
    set({ traffic: Math.min(100, Math.round(trafficPercent)) });
  },

  calculatePollution: () => {
    const state = get();
    let pollutionPoints = 0;
    let mitigationPoints = 0;
    
    state.grid.forEach((row) => {
      row.forEach((tile) => {
        // Industrial buildings create pollution
        if (tile.building === 'industrial_warehouse') {
          pollutionPoints += 5;
        } else if (tile.building === 'industrial_factory') {
          pollutionPoints += 10;
        } else if (tile.building === 'industrial_distribution') {
          pollutionPoints += 7;
        }
        
        // Green spaces reduce pollution
        if (tile.building === 'green_tree') {
          mitigationPoints += 1;
        } else if (tile.building === 'green_park') {
          mitigationPoints += 3;
        } else if (tile.building === 'green_reserve') {
          mitigationPoints += 6;
        } else if (tile.building === 'green_promenade') {
          mitigationPoints += 4;
        }
      });
    });
    
    // Calculate net pollution as percentage
    const netPollution = Math.max(0, pollutionPoints - mitigationPoints);
    const pollutionPercent = Math.min(100, (netPollution / 2)); // Scale down for reasonable values
    
    set({ pollution: Math.round(pollutionPercent) });
  },

  calculateHappiness: () => {
    const state = get();
    let happiness = 100; // Start at 100%
    
    // Traffic reduces happiness (up to -30%)
    happiness -= Math.min(30, state.traffic * 0.3);
    
    // Pollution reduces happiness (up to -40%)
    happiness -= Math.min(40, state.pollution * 0.4);
    
    // Count civic buildings and green spaces for bonuses
    let civicBuildings = 0;
    let greenSpaces = 0;
    let totalBuildings = 0;
    
    state.grid.forEach((row) => {
      row.forEach((tile) => {
        if (tile.building.startsWith('civic_')) {
          civicBuildings++;
        }
        if (tile.building.startsWith('green_')) {
          greenSpaces++;
        }
        if (tile.building !== 'empty' && 
            tile.building !== 'ocean' && 
            !tile.building.includes('road') &&
            !tile.building.includes('path') &&
            !tile.building.includes('highway')) {
          totalBuildings++;
        }
      });
    });
    
    // Civic buildings provide small happiness bonus (up to +15%)
    if (totalBuildings > 0) {
      const civicRatio = civicBuildings / totalBuildings;
      happiness += Math.min(15, civicRatio * 60);
    }
    
    // Green spaces provide happiness bonus (up to +20%)
    if (totalBuildings > 0) {
      const greenRatio = greenSpaces / totalBuildings;
      happiness += Math.min(20, greenRatio * 80);
    }
    
    set({ happiness: Math.min(100, Math.max(0, Math.round(happiness))) });
  },

  calculateMetrics: () => {
    get().calculatePopulation();
    get().calculateTraffic();
    get().calculatePollution();
    get().calculateHappiness();
  },

  addAction: (action: GameAction) => {
    const state = get();
    set({ moveStack: [...state.moveStack, action] });
    get().calculateMetrics();
  },

  saveToSlot: (slot: 1 | 2 | 3) => {
    const state = get();
    const saveData = {
      grid: state.grid,
      population: state.population,
      traffic: state.traffic,
      pollution: state.pollution,
      happiness: state.happiness,
      moveStack: state.moveStack,
    };
    localStorage.setItem(`gridlock_city_${slot}`, JSON.stringify(saveData));
  },

  loadFromSlot: (slot: 1 | 2 | 3) => {
    const saved = localStorage.getItem(`gridlock_city_${slot}`);
    if (saved) {
      const saveData = JSON.parse(saved);
      set({
        grid: saveData.grid,
        population: saveData.population || 0,
        traffic: saveData.traffic || 0,
        pollution: saveData.pollution || 0,
        happiness: saveData.happiness || 100,
        moveStack: saveData.moveStack,
        currentSlot: slot,
        selectedTile: null,
      });
      // Recalculate metrics in case save data doesn't have them
      get().calculateMetrics();
    } else {
      get().initializeGrid();
      set({ currentSlot: slot });
    }
  },
}));
