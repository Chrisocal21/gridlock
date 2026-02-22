# Gridlock - City Builder PWA

## What is Gridlock?

Gridlock is a mobile-first, tap-to-build city builder Progressive Web App (PWA) designed for casual, satisfying city-building gameplay on any device. The game focuses on simplicity, clean aesthetics, and strategic population growth through smart city planning.

## Core Concept

Players start with a coastal strip of land and build their city from the ocean inland. By placing residential, commercial, industrial, and civic buildings strategically, they manage population growth and unlock new zones as their city expands eastward.

## Key Features

### 🎮 Gameplay
- **Tap to Build**: Single-tap tile selection with bottom menu for building placement
- **Hold-and-Drag Roads**: Press and hold to draw roads across multiple tiles using Bresenham's line algorithm
- **Coastal Start**: Begin with ocean on the left and expand eastward into locked territory
- **Population Milestones**: Unlock new zones as population grows (1k → 5k → 15k → 50k+)
- **Adjacency Bonuses**: Strategic placement matters - parks and roads boost nearby residential areas

### 📱 Mobile-First Design
- **Progressive Web App**: Installable on any device, works offline
- **Touch Optimized**: Pinch-to-zoom, two-finger pan, tap and hold-drag controls
- **Responsive Canvas**: Auto-fits to screen, maintaining coastal visibility
- **Save Slots**: Three independent save slots with auto-save every 60 seconds
- **Undo System**: Full undo stack for reversing building actions

### 🎨 Visual Style
- **GTA-Inspired Palette**: Soft, desaturated colors (terracotta, amber, slate, sage, teal)
- **Minimalist**: Clean tile-based grid with subtle borders and accents
- **Ocean Aesthetics**: Wave patterns on water tiles for visual interest
- **Smooth Animations**: Population counter animates on changes

## Game Structure

### Building Types
- **Residential**: Shack (1×1), House (2×2), Apartment (2×2), Townhouse (2×2), High-rise (3×3), Luxury (3×3)
- **Commercial**: Store (1×1), Kiosk (1×1), Strip Mall (3×1), Shopping Center (3×3), Plaza (4×4)
- **Industrial**: Warehouse (2×3), Factory (3×3), Distribution Center (4×3)
- **Green Spaces**: Tree (1×1), Park (2×2), Nature Reserve (3×3), Promenade (4×2)
- **Civic**: School (2×2), Hospital (3×3), Police (2×2), Fire (2×2), City Hall (3×3), Transit Hub (2×2)
- **Infrastructure**: Roads (1-3 tiles wide), Paths, Highways, Bridges (planned)

### Core Mechanics
- **Population System**: Each building generates population based on type and adjacency
- **Zone Unlocking**: Reach population thresholds to expand territory eastward
- **Traffic Flow**: Internal meter affecting population growth (not visually shown)
- **Pollution**: Industrial buildings create invisible pollution affecting nearby areas

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Rendering**: HTML5 Canvas
- **Storage**: localStorage (with planned Cloudflare D1 cloud sync)
- **PWA**: Web App Manifest, offline-capable

## Current Status

**Phase 1** ✅ Complete:
- Canvas-based tile grid (65 rows × 200 columns)
- Multi-tile building system (1×1 to 4×4)
- Organic coastline with Bezier curve rendering
- Touch and mouse input handling
- Building placement with 30 building types
- Road drawing with Bresenham algorithm
- Population calculation with adjacency rules
- Three-slot save system with auto-save
- Undo functionality
- Stats panel with Population, Traffic, Pollution, Happiness
- Sprite key system for artwork integration
- Dark slate theme UI

**Phase 2** 🚧 In Planning:
- Traffic calculation system (active meters in UI, needs backend logic)
- Pollution calculation system (active meters in UI, needs backend logic)
- Happiness calculation system (active meters in UI, needs backend logic)
- Population milestone unlocking (expand columns as city grows)
- Artwork integration using sprite keys
- River drawing and bridges
- Additional building variations
- Visual enhancements and animations

## Grid Specifications

- **Total Grid**: 65 rows (height) × 200 columns (width) = 13,000 tiles
- **Ocean**: 5-8 columns wide on the left (west) side, varies organically by row
- **Coastline**: Rendered as smooth Bezier curve polygon for organic appearance
- **Buildable Area**: ~192 columns (after ocean) × 65 rows = ~12,480 tiles
- **Tile Size**: 48×48 pixels at base zoom
- **Zoom Range**: 0.3× to 2.0×
- **Multi-tile Buildings**: Buildings can occupy 1×1 up to 4×4 tiles

## Target Audience

Casual mobile gamers who enjoy:
- City-building and simulation games
- Strategic planning with simple mechanics
- Satisfying, incremental progression
- Clean, minimalist aesthetics
- Quick sessions on any device
