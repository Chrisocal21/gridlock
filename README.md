# Gridlock - City Builder PWA

A mobile-first, tap-to-build city builder where strategic placement drives population growth.

## Phase 1 - Complete ✓

All Phase 1 features have been implemented:

1. **Canvas tile grid** - 65×200 grid with pan and zoom support, responsive sizing for desktop/mobile
2. **Multi-tile buildings** - Buildings range from 1×1 to 4×4 tiles with smart placement
3. **Organic coastline** - Curved, natural coastline (5-8 tiles wide) rendered with Bezier curves
4. **Hold-and-drag road drawing** - Draw roads by holding and dragging across tiles
5. **Single tap tile selection** - Tap to select a tile and open the building menu
6. **Zustand state management** - Complete game state with undo stack
7. **Stats panel** - Bottom toolbar with Population, Traffic, Pollution, Happiness metrics
8. **localStorage save/load** - Three save slots (City 1, 2, 3) with auto-save
9. **Basic adjacency rules** - Population bonuses/penalties based on neighboring buildings
10. **Sprite key system** - 30 buildings with placeholder keys for easy artwork integration
11. **Dark slate theme** - Game-like UI with dark buttons and toolbar for better immersion

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Controls

### Mobile
- **Single tap** - Select a tile
- **Hold and drag** - Draw roads across tiles
- **Pinch** - Zoom in/out (coastline stays locked to left side)
- **Two-finger drag** - Pan horizontally to explore inland (coastline stays visible)

### Desktop (for testing)
- **Click** - Select a tile
- **Hold and drag** - Draw roads
- **Mouse wheel** - Zoom in/out (coastline stays centered)
- **Click and drag** - Not available (use zoom and tiles)

## Game Mechanics

### Map Layout
Your city starts on the **coast** with an organic ocean (5-8 tiles wide, varies by height) to the west. The grid is 65 rows tall and 200 columns wide, providing massive expansion space. Desktop players see more columns at once, while mobile players scroll horizontally. The coastline curves naturally using Bezier curve rendering for a more organic feel.

### Building Types (30 Total)
- **Residential** (5) - Shack (1×1), House (2×2), Apartment (2×2), High-rise (3×3), Luxury (3×3)
- **Commercial** (4) - Store (1×1), Strip Mall (3×1), Shopping Center (3×3), Plaza (4×4)
- **Industrial** (3) - Warehouse (2×3), Factory (3×3), Distribution Center (4×3)
- **Green Spaces** (4) - Tree (1×1), Park (2×2), Nature Reserve (3×3), Promenade (4×2)
- **Civic** (6) - School (2×2), Hospital (3×3), Police (2×2), Fire (2×2), City Hall (3×3), Transit (2×2)
- **Infrastructure** (8) - Empty, Ocean, Road, Dirt Path, Paved Road, 4-Lane Road, Highway, River, Bridge

### Adjacency Rules
- Park next to residential = **+20% population bonus**
- Road next to residential = **+10% population bonus**
- Factory next to residential = **-30% population penalty**

### Zone Unlocking (Planned)
Zones will unlock automatically as your population grows, expanding eastward:
- **Starting**: Full 65×200 grid available (zone locking system in development)
- **Future**: Population milestones will progressively unlock columns

## Features

### Auto-Save
Your city automatically saves every 60 seconds to localStorage.

### Undo
Every action can be undone with the undo button (top left). Chain undo is supported with no penalty.

### Three Save Slots
Maintain three separate cities - City 1, City 2, and City 3. Each slot stores independently.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (State Management)
- **HTML5 Canvas**
- **localStorage** (Offline Storage)

## Project Structure

```
gridlock/
├── app/
│   ├── layout.tsx         # App layout with PWA metadata
│   ├── page.tsx           # Main game page with slot selector
│   └── globals.css        # Global styles
├── components/
│   ├── GameCanvas.tsx     # Main canvas for tile rendering and interaction
│   ├── StatsPanel.tsx     # Bottom stats toolbar (Population, Traffic, Pollution, Happiness)
│   ├── UndoButton.tsx     # Undo last action
│   ├── MenuButton.tsx     # Return to slot selector menu
│   ├── BuildingMenu.tsx   # Building selection UI (3-column compact layout)
│   └── SlotSelector.tsx   # Save slot selection screen
├── store/
│   └── gameStore.ts       # Zustand store with all game state
├── types/
│   └── game.ts            # TypeScript interfaces
└── public/
    └── manifest.json      # PWA manifest
```

## Next Steps (Phase 2+)

- Implement traffic calculation system (road connectivity, congestion)
- Implement pollution calculation system (industrial generation, park mitigation)
- Implement happiness calculation system (pollution, parks, traffic impact)
- Add artwork using sprite key mass find/replace system
- Population milestone zone unlocking
- Cloud sync to Cloudflare D1
- Service worker for offline-first PWA
- Animation effects (construction, traffic flow)
- Sound effects and background music

---

Built following the Gridlock Master Project Brief v1.0

