    # Artwork Guide

## Overview

This guide explains how to create artwork for buildings and tiles in Gridlock. The game uses a tile-based system with simple, clean aesthetics inspired by GTA's minimalist style.

---

## Tile Specifications

### Base Tile Dimensions
- **Size**: 48×48 pixels (at 1:1 zoom)
- **Format**: SVG (preferred) or PNG
- **Color Depth**: 24-bit RGB or 32-bit RGBA
- **Transparency**: Alpha channel supported

### Zoom Considerations
- **Minimum Zoom**: 0.3× (tiles appear ~14px)
- **Maximum Zoom**: 2.0× (tiles appear ~96px)
- **Design for**: 1:1 zoom (48px) as primary viewing size
- **Test at**: All zoom levels for clarity

### Grid System
- **Grid Width**: 200 columns
- **Grid Height**: 65 rows
- **Total Tiles**: 13,000 tiles
- **Ocean**: 5-8 columns (left side, varies organically by row)
- **Buildable**: ~192 columns × 65 rows = ~12,480 tiles

---

## Color Palette

### Primary Colors

```css
/* Residential - Warm Terracotta */
--residential: #d4847c;

/* Commercial - Soft Amber */
--commercial: #e8b86d;

/* Industrial - Cool Slate Gray */
--industrial: #6e7c8c;

/* Green Spaces - Desaturated Sage */
--green: #8fa688;

/* Water - Muted Teal Blue */
--water: #5d9da8;
--ocean: #4a7c8a; /* Deeper variant */
--beach: #f5deb3; /* Sandy wheat */

/* Infrastructure - Light Concrete Gray */
--road: #c4c4c4;

/* Civic - Soft Blue */
--civic: #6d8fe8;

/* Empty/Default */
--empty: #f5f5f5;
--border: #dddddd;
```

### Color Guidelines

1. **Saturation**: Keep colors desaturated (30-50% saturation)
2. **Brightness**: Mid-range brightness (50-70%)
3. **Contrast**: Ensure readability at small sizes
4. **Consistency**: Stay within the palette for visual harmony

---

## Building Types & Visual Design

### Residential Buildings

#### Shack (Tier 1)
- **Base Color**: `#d4847c` (terracotta)
- **Style**: Small square, minimal detail
- **Size**: Occupies ~60% of tile
- **Details**: Single door, small window
- **Population**: 5 base

```
Visual Concept:
┌───────┐
│ ┌─┐   │ Small simple structure
│ │▓│   │ Centered or offset
│ └─┘   │ Single accent (door/window)
└───────┘
```

#### Apartment (Tier 2)
- **Base Color**: `#d4847c` darker shade `#c97164`
- **Style**: Taller rectangle, multiple floors
- **Size**: Occupies ~80% of tile
- **Details**: Multiple windows in grid
- **Population**: 15 base

```
Visual Concept:
┌───────┐
│ ┌───┐ │ Vertical structure
│ │▪▪▪│ │ Window grid pattern
│ │▪▪▪│ │ 2-3 floors indicated
│ └───┘ │
└───────┘
```

#### Townhouse (Tier 3)
- **Base Color**: `#d4847c` + accent `#b86454`
- **Style**: Wide, multi-unit appearance
- **Size**: Fills tile edge-to-edge
- **Details**: Segmented sections, varied roofline
- **Population**: 30 base

#### High-rise (Tier 4)
- **Base Color**: `#d4847c` with `#9f5347` shadow
- **Style**: Tall tower, minimal footprint
- **Size**: Small footprint (~40%), implied height
- **Details**: Many small windows, top accent
- **Population**: 100 base

---

### Commercial Buildings

#### Kiosk (Tier 1)
- **Base Color**: `#e8b86d` (amber)
- **Style**: Small booth/stand
- **Size**: ~50% of tile
- **Details**: Awning or roof overhang
- **Population**: 3 base

#### Strip Mall (Tier 2)
- **Base Color**: `#e8b86d` with `#d4a04f` accents
- **Style**: Horizontal structure
- **Size**: Full width, shallow depth
- **Details**: Multiple storefronts
- **Population**: 10 base

#### Shopping Plaza (Tier 3)
- **Base Color**: `#e8b86d` + `#c08d38`
- **Style**: Large square or L-shape
- **Size**: Nearly full tile
- **Details**: Parking indication, multiple sections
- **Population**: 25 base

---

### Industrial Buildings

#### Warehouse (Tier 1)
- **Base Color**: `#6e7c8c` (slate gray)
- **Style**: Simple rectangle, flat roof
- **Size**: Full tile, boxy
- **Details**: Large door, minimal windows
- **Population**: 8 base (creates pollution)

#### Factory (Tier 2)
- **Base Color**: `#6e7c8c` with `#5a6573` shadow
- **Style**: Multi-section, chimney/vent
- **Size**: Full tile, industrial look
- **Details**: Smokestacks, pipes, vents
- **Population**: 20 base (more pollution)

#### Distribution Center (Tier 3)
- **Base Color**: `#6e7c8c` + `#4d5560`
- **Style**: Large warehouse with loading
- **Size**: Maximum tile usage
- **Details**: Loading docks, truck bays
- **Population**: 40 base (high pollution)

---

### Green Spaces

#### Park
- **Base Color**: `#8fa688` (sage green)
- **Style**: Organic, natural shapes
- **Size**: Fills tile with soft edges
- **Details**: Tree symbols, path lines, bench
- **Population**: 0 (provides +20% bonus to adjacent residential)

```
Visual Concept:
┌───────┐
│  ○ ○  │ Tree symbols (circles)
│ ╱   ╲ │ Curved paths
│○  ┬  ○│ Bench marker
└───────┘
```

#### Plaza
- **Base Color**: `#8fa688` with `#7a8b75`
- **Style**: Geometric, paved area
- **Size**: Full tile, structured
- **Details**: Fountain center, geometric patterns
- **Population**: 0 (provides +20% bonus to adjacent residential)

---

### Civic Buildings

All civic use **Base Color**: `#6d8fe8` (soft blue)

#### School
- **Details**: Building with flag or playground symbol
- **Population**: 5 base (provides education bonus - future)

#### Hospital
- **Details**: Cross/plus symbol, entrance
- **Population**: 10 base (provides health bonus - future)

#### Police Station
- **Details**: Star/badge symbol
- **Population**: 5 base (provides safety - future)

#### Fire Station
- **Details**: Garage doors, tower
- **Population**: 5 base (provides safety - future)

#### City Hall
- **Details**: Columns, dome or flag
- **Population**: 15 base (admin center - future)

#### Transit Hub
- **Details**: Platform, tracks, bus symbol
- **Population**: 20 base (provides transit - future)

---

### Infrastructure

#### Dirt Path
- **Base Color**: `#a89070` (tan/brown)
- **Style**: Textured line
- **Size**: 30% width of tile (centered)
- **Details**: Organic edges, slight variation

#### Paved Road
- **Base Color**: `#c4c4c4` (concrete gray)
- **Style**: Clean line with dashed center
- **Size**: 60% width of tile (centered)
- **Details**: White dashed centerline, solid edges

```
Visual Concept:
┌───────┐
│       │
│ ─ ─ ─ │ Dashed white line
│       │
└───────┘
```

#### Highway
- **Base Color**: `#aaaaaa` (darker gray)
- **Style**: Wide road, multiple lanes
- **Size**: 80% width of tile
- **Details**: Multiple lane markings, solid edges

---

### Special Tiles

#### Ocean
- **Base Color**: `#4a7c8a` (deep teal)
- **Style**: Solid fill with wave accents
- **Size**: Full tile
- **Details**: Horizontal wave lines at 30% and 70% height
- **Animation**: Optional subtle wave movement

```
Current Implementation:
ctx.fillStyle = '#4a7c8a';
ctx.fillRect(x, y, 48, 48);
// Wave highlights
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
ctx.fillRect(x, y + 14, 48, 7);  // 30% height
ctx.fillRect(x, y + 33, 48, 5);  // 70% height
```

#### Beach
- **Base Color**: `#f5deb3` (wheat/sand)
- **Style**: Sandy transition strip
- **Size**: 2 tiles wide between ocean and land
- **Details**: Subtle horizontal sand texture lines
- **Purpose**: Natural transition from ocean to buildable land
- **Animation**: Optional subtle shimmer or wave wash

```
Current Implementation:
ctx.fillStyle = '#f5deb3'; // Sandy wheat color
// Rendered as smooth polygon following coastline curve
// Subtle white overlay for sand texture:
ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
// Applied in horizontal lines for sandy appearance
```

#### Empty
- **Base Color**: `#f5f5f5` (off-white)
- **Style**: Plain with border
- **Size**: Full tile
- **Details**: Subtle grid border `#dddddd`

#### Locked (Future)
- **Overlay**: `rgba(0, 0, 0, 0.6)` (60% black)
- **Style**: Applied over whatever is underneath
- **Icon**: Lock symbol or gradient indicating distance

---

## Asset Creation Workflow

### 1. Design Phase

**Tools**: 
- Vector: Figma, Adobe Illustrator, Inkscape
- Raster: Photoshop, GIMP, Aseprite

**Steps**:
1. Create 48×48px artboard/canvas
2. Use palette colors from spec
3. Design at 1:1 scale
4. Keep details minimal (readable at 0.3× zoom)
5. Test at 14px, 48px, and 96px sizes

### 2. Export Settings

**SVG (Recommended)**:
- Clean up paths
- Optimize nodes
- Remove unnecessary metadata
- Ensure viewBox="0 0 48 48"
- Keep file size <5KB per tile

**PNG Fallback**:
- Resolution: 48×48px @1x, 96×96px @2x, 144×144px @3x
- Format: PNG-24 or PNG-32 (with alpha)
- Compression: Optimize with tools like TinyPNG
- File size: Aim for <10KB per tile

### 3. Implementation

**File Naming Convention**:
```
residential_shack.svg
residential_apartment.svg
commercial_kiosk.svg
green_park.svg
road_paved.svg
```

**File Structure**:
```
public/
  assets/
    buildings/
      residential/
        shack.svg
        apartment.svg
        townhouse.svg
        highrise.svg
      commercial/
        kiosk.svg
        stripmall.svg
        plaza.svg
      industrial/
        warehouse.svg
        factory.svg
        distribution.svg
      green/
        park.svg
        plaza.svg
      civic/
        school.svg
        hospital.svg
        police.svg
        fire.svg
        cityhall.svg
        transit.svg
    infrastructure/
      road_dirt.svg
      road_paved.svg
      road_highway.svg
    special/
      ocean.svg
      empty.svg
```

### 4. Code Integration

**Current System** (color-based):
```typescript
const getBuildingColor = (building: BuildingType): string => {
  if (building === 'ocean') return '#4a7c8a';
  if (building.startsWith('residential_')) return '#d4847c';
  // etc...
}
```

**Future System** (sprite-based):
```typescript
const getBuildingSprite = (building: BuildingType): string => {
  return `/assets/buildings/${category}/${building}.svg`;
}

// Render SVG or image on canvas
const img = new Image();
img.src = getBuildingSprite(building);
ctx.drawImage(img, x, y, size, size);
```

---

## Design Principles

### 1. Readability First
- Must be identifiable at 14×14px (0.3× zoom)
- Clear silhouette
- Distinct from other types

### 2. Consistent Style
- Match existing color palette
- Similar level of detail across all buildings
- Unified visual language

### 3. Performance
- Keep file sizes small (<5KB SVG, <10KB PNG)
- Use simple shapes (fewer nodes/vertices)
- Avoid complex gradients or effects

### 4. Scalability
- Design works at all zoom levels
- No loss of clarity when scaled
- Details remain visible

### 5. Accessibility
- Sufficient color contrast
- Don't rely only on color (use shapes/symbols too)
- Consider colorblind-friendly design

---

## Testing Checklist

- [ ] Looks good at 0.3× zoom (14px)
- [ ] Looks good at 1.0× zoom (48px)
- [ ] Looks good at 2.0× zoom (96px)
- [ ] Matches color palette
- [ ] Distinct from similar building types
- [ ] File size under limits
- [ ] No artifacts or pixelation
- [ ] Loads quickly in browser
- [ ] Works on retina displays
- [ ] Accessible/readable

---

## Advanced Techniques

### Multi-Tile Buildings (Future)

Some buildings may occupy multiple tiles (2×2, 2×3, etc.):

```
Example: Stadium (3×3)
┌──┬──┬──┐
│  │  │  │ Top row
├──┼──┼──┤
│  │●│  │ Center marker
├──┼──┼──┤
│  │  │  │ Bottom row
└──┴──┴──┘
```

**Approach**:
- Design at 144×144px (3× tile size)
- Center important details
- Ensure each tile section looks intentional
- Mark tiles as "occupied" in game logic

### Animated Buildings (Future)

Optional subtle animations:

- **Traffic**: Moving dots on roads
- **Smoke**: Rising from industrial chimneys
- **Lights**: Twinkling windows at "night"
- **Water**: Flowing wave patterns

**Implementation**: CSS animations or Canvas requestAnimationFrame

### Seasonal Variations (Future)

Same building, different seasons:

- **Spring**: Lighter greens, flowers
- **Summer**: Vibrant colors, full foliage
- **Fall**: Warm oranges, browns
- **Winter**: Snow on roofs, bare trees

**File Structure**: `park_spring.svg`, `park_summer.svg`, etc.

---

## Resources

### Inspiration
- GTA (original) tile graphics
- SimCity minimalist style
- Flat design UI patterns
- Geometric art

### Tools
- **Vector**: Figma (free), Inkscape (free), Adobe Illustrator
- **Raster**: Aseprite (pixel art), GIMP (free), Photoshop
- **Optimization**: SVGO, TinyPNG, ImageOptim
- **Color**: Coolors.co, Adobe Color

### Learning
- Pixel art tutorials for small-scale design
- Icon design principles
- Flat design best practices
- UI/UX readability studies

---

## Contribution

If creating artwork for Gridlock:

1. Follow this guide's specifications
2. Use the exact color palette
3. Test at all zoom levels
4. Optimize file sizes
5. Submit for review via pull request

Questions? Open an issue or discussion on the repository.
