# Architecture Guide

## Overview

Gridlock uses a modern React-based architecture with Next.js 14, TypeScript, and Zustand for state management. The game renders on HTML5 Canvas for performance.

---

## Technology Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **React 19**: UI library with hooks
- **TypeScript**: Type-safe JavaScript

### State Management
- **Zustand**: Lightweight state management
- **No Redux**: Zustand chosen for simplicity and performance

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **No CSS Modules**: Tailwind handles all styling

### Rendering
- **HTML5 Canvas**: For grid rendering and game visuals
- **No WebGL**: Canvas 2D sufficient for current needs

### Storage
- **localStorage**: Client-side persistence (current)
- **Cloudflare D1**: Cloud sync (planned Phase 4)

### PWA
- **Web App Manifest**: For installability
- **Service Worker**: Planned for offline support

---

## Project Structure

```
gridlock/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout, metadata, PWA config
│   ├── page.tsx             # Main game page
│   └── globals.css          # Global styles + Tailwind
│
├── components/              # React Components
│   ├── GameCanvas.tsx       # ⭐ Main canvas renderer
│   ├── BuildingMenu.tsx     # Bottom building selector (3-column)
│   ├── StatsPanel.tsx       # Bottom stats toolbar (Population, Traffic, Pollution, Happiness)
│   ├── UndoButton.tsx       # Undo action button
│   ├── SlotSelector.tsx     # Save slot chooser
│   └── MenuButton.tsx       # Return to menu
│
├── store/                   # State Management
│   └── gameStore.ts         # ⭐ Zustand store
│
├── types/                   # TypeScript Types
│   └── game.ts              # Game-specific types
│
├── public/                  # Static Assets
│   ├── manifest.json        # PWA manifest
│   └── icon*.svg            # App icons
│
└── Documentation
    ├── PROJECT.md           # What the project is
    ├── BUILD.md             # Build instructions
    ├── PHASE.md             # Development phases
    ├── ARTWORK.md           # Asset creation guide
    └── ARCHITECTURE.md      # This file
```

---

## Core Components

### GameCanvas.tsx

**Purpose**: Main game renderer and input handler

**Responsibilities**:
- Render tile grid on HTML5 Canvas
- Handle touch and mouse input
- Manage zoom and pan
- Draw roads with Bresenham algorithm
- Highlight selected tiles
- Show road preview during drag

**Key State**:
```typescript
const [zoom, setZoom] = useState(1);              // 0.3 to 2.0
const [offset, setOffset] = useState({x: 0, y: 0}); // Pan position
const [isDrawingRoad, setIsDrawingRoad] = useState(false);
const [roadDrawStart, setRoadDrawStart] = useState<{x, y} | null>(null);
const [selectedTile, setSelectedTile] = useState<{x, y} | null>(null);
```

**Canvas Rendering Flow**:
```
1. useEffect triggers drawGrid() when dependencies change
2. Clear canvas
3. Apply transformations (translate + scale)
4. Draw ocean as smooth Bezier curve polygon (using COASTLINE array)
5. Loop through grid (65 rows × 200 columns = 13,000 tiles)
6. Draw each tile:
   - Skip ocean tiles (handled in step 4)
   - Skip occupiedBy tiles (part of multi-tile building)
   - Fill with building color
   - Draw multi-tile buildings at anchor with full width/height
   - Draw border
   - Highlight if selected
7. Draw road preview if dragging
8. Restore canvas state
```

**Input Handling**:
- **Single Tap**: Select tile, show building menu
- **Hold & Drag** (300ms): Draw roads
- **Two-Finger Pinch**: Zoom in/out
- **Two-Finger Drag**: Pan horizontally
- **Mouse Wheel**: Zoom (desktop)

**Performance**:
- Uses `useCallback` for `drawGrid` to prevent recreations
- Only redraws when necessary dependencies change
- Transform matrix for efficient zoom/pan

---

### BuildingMenu.tsx

**Purpose**: Bottom UI for building selection

**Responsibilities**:
- Display selected tile info
- Show building categories (tabs)
- List available buildings in compact 3-column grid
- Display building sizes (width×height) for each option
- Handle building placement
- Prevent placement on locked/ocean tiles
- Validate multi-tile placement (bounds, overlaps)

**Structure**:
```tsx
<div className="fixed bottom-28 left-0 right-0"> {/* above stats panel */}
  {selectedTile ? (
    <>
      <TileInfo />
      <CategoryTabs />
      <BuildingList /> {/* 3-column grid, compact sizes */}
    </>
  ) : (
    <Placeholder message="Tap a tile to build" />
  )}
</div>
```

**Building Info Displayed**:
- Building name
- Size (e.g., "2×2")
- Color preview (6×6px square)
- Lock status for unavailable buildings

**Building Categories**:
- Residential: Shack (1×1), House (2×2), Apartment (2×2), High-rise (3×3), Luxury (3×3)
- Commercial: Store (1×1), Kiosk (1×1), Strip Mall (3×1), Shopping Center (3×3), Plaza (4×4)
- Industrial: Warehouse (2×3), Factory (3×3), Distribution (4×3)
- Green Spaces: Tree (1×1), Park (2×2), Nature Reserve (3×3), Promenade (4×2)
- Civic: School (2×2), Hospital (3×3), Police (2×2), Fire (2×2), City Hall (3×3), Transit (2×2)
- Infrastructure: Dirt Path (1), Paved Road (1), 4-Lane Road (2), Highway (3)

---

### StatsPanel.tsx

**Purpose**: Display key city metrics in bottom toolbar

**Features**:
- Fixed bottom position with rounded top corners
- Dark slate theme (bg-slate-800/95)
- 4 stats with SVG icons:
  - Population (users group icon, blue-400)
  - Traffic (lightning icon, orange-400)
  - Pollution (scale icon, green-400)
  - Happiness (smiley icon, purple-400)
- Progress bars for percentage-based metrics
- Real-time population from gameStore
- Placeholder values for traffic (0%), pollution (0%), happiness (100%)

**Layout**:
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 rounded-t-3xl">
  <div className="grid grid-cols-4 gap-4 p-4">
    {stats.map(stat => (
      <div key={stat.label}>
        <svg className="w-6 h-6">{stat.icon}</svg>
        <div className="text-xs">{stat.label}</div>
        <div className="text-lg font-bold">{stat.value}</div>
        {stat.showBar && <div className="h-1 bg-slate-700 rounded-full">
          <div className="h-1 bg-current rounded-full" style={{width: stat.percentage}}/>
        </div>}
      </div>
    ))}
  </div>
</div>
```

---

### SlotSelector.tsx

**Purpose**: Choose save slot on game start

**Features**:
- Shows 3 save slots
- Displays population and last saved time
- Differentiates empty vs. used slots
- "New game" creates fresh grid
- "Continue" loads existing save

**Storage Structure**:
```typescript
localStorage.getItem('gridlock_save_slot_1')
// Returns:
{
  grid: Tile[][],
  population: number,
  moveStack: GameAction[]
}
```

---

## State Management (Zustand)

### gameStore.ts

**Purpose**: Central game state and logic

**State Shape**:
```typescript
interface GameState {
  grid: Tile[][];           // 65×200 tile grid (13,000 tiles)
  gridSize: number;         // 65 (height)
  gridWidth: number;        // 200 (width)
  population: number;       // Current population
  selectedTile: {x, y} | null;
  moveStack: GameAction[];  // Undo history
  currentSlot: 1 | 2 | 3;   // Active save slot
  
  // Actions
  initializeGrid: () => void;
  setTileBuilding: (x, y, building) => void;
  selectTile: (x, y) => void;
  undo: () => void;
  addAction: (action) => void;
  calculatePopulation: () => void;
  saveGame: () => void;
  loadGame: (slot) => GameState | null;
}
```

**Key Functions**:

#### createEmptyGrid()
```typescript
// Creates 65 rows × 200 columns = 13,000 tiles
// Ocean: columns 0 to COASTLINE[y]-1 (varies 5-8 tiles per row)
// COASTLINE array: smooth organic values exported for rendering
// Buildable: remaining ~192 columns × 65 rows
// All tiles start as 'empty', ocean tiles set to 'ocean'
```

#### calculatePopulation()
```typescript
// For each tile:
//   base = building population value
//   
//   Check 4 adjacent tiles (N, S, E, W):
//     if adjacent is park: +20%
//     if adjacent is road: +10%
//     if adjacent is industrial: -30%
//   
//   total += base * (1 + bonuses)
```

#### Bresenham Line Algorithm (in GameCanvas)
```typescript
// Used for road drawing
// Draws straight line between two points
// Handles all angles efficiently
const drawLine = (x0, y0, x1, y1) => {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  
  while (true) {
    setTile(x, y, 'road');
    if (x === x1 && y === y1) break;
    
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
  }
}
```

---

## Data Flow

### Component → Store
```
User taps tile
  ↓
GameCanvas.handleTouchEnd()
  ↓
useGameStore.selectTile(x, y)
  ↓
Store updates selectedTile
  ↓
BuildingMenu re-renders (subscribed to selectedTile)
```

### Store → Component
```
User selects building from menu
  ↓
BuildingMenu onClick
  ↓
useGameStore.setTileBuilding(x, y, 'residential_shack')
  ↓
Store updates grid
  ↓
Store calls calculatePopulation()
  ↓
GameCanvas re-renders (subscribed to grid)
StatsPanel re-renders (subscribed to population)
```

### Auto-Save Flow
```
Every 60 seconds (interval in page.tsx)
  ↓
useGameStore.saveGame()
  ↓
Get current state: { grid, population, moveStack }
  ↓
JSON.stringify(state)
  ↓
localStorage.setItem(`gridlock_save_slot_${currentSlot}`, json)
```

---

## Rendering Pipeline

### Initial Load
```
1. Next.js renders page.tsx
2. SlotSelector component shows
3. User selects slot
4. Load game from localStorage (or create new)
5. Set gameStarted = true
6. Mount GameCanvas, BuildingMenu, etc.
7. GameCanvas resizes to fit screen
8. Calculate optimal zoom for full height
9. Draw initial grid
```

### Per-Frame Rendering
```
State change triggers useEffect dependency
  ↓
drawGrid() called
  ↓
Canvas cleared
  ↓
Draw ocean as smooth Bezier curve polygon:
  - Use COASTLINE array for organic shape
  - Create polygon points with quadratic curves
  - Fill with ocean color
  ↓
For each tile (65 × 200 = 13,000):
  - Get tile data from grid
  - Skip if ocean (handled above)
  - Skip if occupiedBy (part of multi-tile building)
  - Calculate screen position (x * 48 * zoom + offset.x)
  - Draw tile background color
  - If multi-tile building at anchor:
      - Draw with full width × height
      - Draw grid lines for multi-tile structure
  - Draw border
  - Check if selected, draw highlight
  ↓
If road dragging:
  - Draw preview line from start to current
  ↓
Canvas update complete
```

**Optimization**: Only redraws when these change:
- `grid` (building placement, multi-tile structures)
- `zoom` (user zooms)
- `offset` (user pans)
- `selectedTile` (user selects)
- `roadDrawStart/Current` (road preview)
- Ocean rendered once per frame as polygon (not 325-520 individual tiles)

---

## Input System

### Touch Events

**TouchStart** (1 finger):
```
- Record touch position
- Record timestamp
- Store as potential tap or drag start
```

**TouchStart** (2 fingers):
```
- Calculate distance between fingers
- Store as initial pinch distance
- Store center point for pan reference
```

**TouchMove** (1 finger):
```
- Calculate touch duration
- If > 300ms and hasn't started road:
    - Set isDrawingRoad = true
    - Record start position
- If isDrawingRoad:
    - Update roadDrawCurrent position
    - Triggers redraw showing preview
```

**TouchMove** (2 fingers):
```
- Calculate new distance (compare to initial)
- Scale = newDistance / initialDistance
- newZoom = initialZoom * scale
- Clamp to MIN_ZOOM (0.3) and MAX_ZOOM (2.0)

- Calculate horizontal pan:
    - Get new center point
    - dx = newCenter.x - oldCenter.x
    - offset.x = Math.min(prev.x + dx, 0)
      (prevents scrolling coastline off-screen)
```

**TouchEnd**:
```
- If isDrawingRoad:
    - Execute Bresenham line algorithm
    - Place roads on all tiles in line
    - Clear road draw state
- Else if duration < 300ms:
    - Treat as tap
    - Select tile
    - Show building menu
```

### Mouse Events (Desktop Testing)

- **MouseDown**: Select tile
- **MouseMove + Button1**: Road drawing (same as touch)
- **MouseUp**: Complete road or do nothing
- **Wheel**: Zoom in/out

---

## Type System

### Core Types (types/game.ts)

```typescript
// 30+ building types
type BuildingType = 
  | 'empty' 
  | 'ocean'
  | 'residential_shack'
  | 'residential_apartment'
  // ... etc

// Single tile
interface Tile {
  x: number;
  y: number;
  building: BuildingType;
  isLocked: boolean;
  occupiedBy?: { x: number; y: number }; // Points to anchor tile for multi-tile buildings
}

// Building configuration
interface BuildingConfig {
  width: number;        // 1-4 tiles wide
  height: number;       // 1-4 tiles tall
  population: number;   // Base population value
  color: string;        // Hex color for rendering
  category: string;     // residential, commercial, etc.
  sprite: string;       // SPRITE_* key for artwork
}

// Undo action
interface GameAction {
  type: 'place' | 'draw' | 'unlock';
  tiles: Array<{
    x: number;
    y: number;
    previous: BuildingType;
    new: BuildingType;
  }>;
}

// Full game state
interface GameState {
  grid: Tile[][];
  gridSize: number;
  population: number;
  selectedTile: { x: number; y: number } | null;
  moveStack: GameAction[];
  currentSlot: 1 | 2 | 3;
  
  // Actions (functions)
  initializeGrid: () => void;
  setTileBuilding: (x: number, y: number, building: BuildingType) => void;
  selectTile: (x: number, y: number) => void;
  undo: () => void;
  addAction: (action: GameAction) => void;
  calculatePopulation: () => void;
  saveGame: () => void;
  loadGame: (slot: 1 | 2 | 3) => GameState | null;
}
```

---

## Performance Considerations

### Current Optimizations

1. **Canvas vs. DOM**: Canvas chosen over 3,120+ DOM elements for better performance

2. **useCallback for drawGrid**: Prevents function recreation on every render
   ```typescript
   const drawGrid = useCallback(() => {
     // ...render logic
   }, [grid, zoom, offset, selectedTile, ...]);
   ```

3. **Selective Rendering**: Only redraws when specific dependencies change

4. **Transform Matrix**: Uses Canvas transform for zoom/pan instead of recalculating every tile position

5. **Zustand Selectors**: Components only subscribe to needed state slices
   ```typescript
   const grid = useGameStore(state => state.grid);
   // Only re-renders when grid changes, not other state
   ```

### Future Optimizations

1. **Viewport Culling**: Only draw tiles visible on screen
2. **Dirty Rectangle**: Only redraw changed regions
3. **OffscreenCanvas**: Render in web worker
4. **Memoized Sprites**: Pre-render building sprites
5. **RequestAnimationFrame**: For smooth animations

---

## Save System

### localStorage Structure

```
Key: gridlock_save_slot_1
Value: {
  "grid": [[Tile, Tile, ...], [Tile, Tile, ...], ...],
  "population": 1234,
  "moveStack": [GameAction, GameAction, ...]
}
```

**Limitations**:
- ~5-10MB storage limit
- Per-domain, not sync'd across devices
- Can be cleared by user

**Future**: Cloudflare D1 for cloud sync

### Save/Load Flow

**Save**:
```typescript
const saveGame = () => {
  const state = get();
  const saveData = {
    grid: state.grid,
    population: state.population,
    moveStack: state.moveStack,
  };
  localStorage.setItem(
    `gridlock_save_slot_${state.currentSlot}`,
    JSON.stringify(saveData)
  );
};
```

**Load**:
```typescript
const loadGame = (slot: 1 | 2 | 3) => {
  const json = localStorage.getItem(`gridlock_save_slot_${slot}`);
  if (!json) return null;
  
  const data = JSON.parse(json);
  set({
    grid: data.grid,
    population: data.population,
    moveStack: data.moveStack || [],
    currentSlot: slot,
  });
  
  return data;
};
```

---

## PWA Configuration

### manifest.json

```json
{
  "name": "Gridlock - City Builder",
  "short_name": "Gridlock",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    },
    {
      "src": "/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
}
```

### Metadata (app/layout.tsx)

```typescript
export const metadata: Metadata = {
  title: "Gridlock - City Builder",
  description: "A mobile-first tap-to-build city builder PWA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gridlock",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
```

---

## Adding New Features

### Example: Adding a New Building Type

1. **Define Type** (types/game.ts):
   ```typescript
   type BuildingType = 
     | 'residential_mansion' // Add new type
     | ... // existing types
   ```

2. **Add Color** (components/GameCanvas.tsx):
   ```typescript
   const getBuildingColor = (building: BuildingType) => {
     if (building === 'residential_mansion') return '#b86454';
     // ...
   }
   ```

3. **Add to Menu** (components/BuildingMenu.tsx):
   ```typescript
   const residentialBuildings = [
     { id: 'residential_mansion', name: 'Mansion', pop: 50 },
     // ...
   ];
   ```

4. **Add Population Logic** (store/gameStore.ts):
   ```typescript
   const getPopulation = (building: BuildingType) => {
     if (building === 'residential_mansion') return 50;
     // ...
   }
   ```

### Example: Adding a New Input Gesture

1. **Add State** (components/GameCanvas.tsx):
   ```typescript
   const [isTripleTap, setIsTripleTap] = useState(false);
   ```

2. **Add Handler**:
   ```typescript
   const handleTripleTap = (e: React.TouchEvent) => {
     if (e.touches.length === 3) {
       // Do something
     }
   };
   ```

3. **Attach Event**:
   ```typescript
   <canvas
     onTouchStart={handleTripleTap}
   />
   ```

---

## Testing Strategy

### Manual Testing
- Test on actual mobile devices (iOS, Android)
- Test different screen sizes (phone, tablet)
- Test zoom/pan gestures
- Test save/load persistence

### Automated Testing (Future)
- Unit tests for population calculation
- Unit tests for Bresenham algorithm
- Integration tests for state management
- E2E tests for critical flows

---

## Debugging Tips

### Canvas Debugging
```typescript
// Draw grid lines
ctx.strokeStyle = 'red';
for (let i = 0; i < gridSize; i++) {
  ctx.beginPath();
  ctx.moveTo(0, i * TILE_SIZE);
  ctx.lineTo(gridSize * TILE_SIZE, i * TILE_SIZE);
  ctx.stroke();
}
```

### State Debugging
```typescript
// Log state changes
useEffect(() => {
  console.log('Grid updated:', grid);
}, [grid]);

// Or use Zustand devtools
import { devtools } from 'zustand/middleware';
create(devtools((set) => ({ ... })));
```

### Touch Debugging
```typescript
// Log touch events
const handleTouchStart = (e: React.TouchEvent) => {
  console.log('Touches:', e.touches.length);
  console.log('Position:', e.touches[0].clientX, e.touches[0].clientY);
  // ...
};
```

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
