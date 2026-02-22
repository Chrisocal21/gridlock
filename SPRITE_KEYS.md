# Artwork Sprite Key System

## Overview

All buildings have a `sprite` property in `BUILDING_CONFIG` that contains a unique key (e.g., `SPRITE_RES_HOUSE`). These are placeholder keys designed for **mass find/replace** when you're ready to add real artwork.

## How It Works

### Current State
Each building currently uses a simple text key:
```typescript
residential_house: { 
  sprite: 'SPRITE_RES_HOUSE',
  // ... other properties
}
```

### When You Add Artwork

You can do a **global find/replace** to swap all sprite keys with actual artwork references in one operation:

#### Option 1: Image Paths
Replace: `'SPRITE_RES_HOUSE'`  
With: `'/assets/sprites/res_house.png'`

#### Option 2: SVG Data
Replace: `'SPRITE_RES_HOUSE'`  
With: `` `<svg>...</svg>` ``

#### Option 3: Emoji/Unicode (Temporary)
Replace: `'SPRITE_RES_HOUSE'`  
With: `'🏠'`

## Complete Sprite Key Reference

### Infrastructure
- `SPRITE_EMPTY` - Empty/cleared land
- `SPRITE_OCEAN` - Ocean water
- `SPRITE_BEACH` - Sandy beach
- `SPRITE_ROAD` - Basic road
- `SPRITE_DIRT_PATH` - Dirt path
- `SPRITE_PAVED_ROAD` - Paved road
- `SPRITE_4LANE_ROAD` - 4-lane road (2 tiles wide)
- `SPRITE_HIGHWAY` - Highway (3 tiles wide)
- `SPRITE_RIVER` - River
- `SPRITE_BRIDGE` - Bridge over water

### Residential
- `SPRITE_RES_SHACK` - 1×1 shack (3 pop)
- `SPRITE_RES_HOUSE` - 2×2 house (8 pop)
- `SPRITE_RES_APARTMENT` - 2×2 apartment (25 pop)
- `SPRITE_RES_HIGHRISE` - 3×3 high-rise (120 pop)
- `SPRITE_RES_LUXURY` - 3×3 luxury building (60 pop)

### Commercial
- `SPRITE_COM_STORE` - 1×1 store (5 pop)
- `SPRITE_COM_STRIP` - 3×1 strip mall (15 pop)
- `SPRITE_COM_SHOPPING` - 3×3 shopping center (40 pop)
- `SPRITE_COM_PLAZA` - 4×4 plaza (80 pop)

### Industrial
- `SPRITE_IND_WAREHOUSE` - 2×3 warehouse (10 pop)
- `SPRITE_IND_FACTORY` - 3×3 factory (30 pop)
- `SPRITE_IND_DISTRIBUTION` - 4×3 distribution center (50 pop)

### Green Spaces
- `SPRITE_GREEN_TREE` - 1×1 tree
- `SPRITE_GREEN_PARK` - 2×2 park
- `SPRITE_GREEN_RESERVE` - 3×3 nature reserve
- `SPRITE_GREEN_PROMENADE` - 4×2 promenade

### Civic Buildings
- `SPRITE_CIVIC_SCHOOL` - 2×2 school (20 pop)
- `SPRITE_CIVIC_HOSPITAL` - 3×3 hospital (50 pop)
- `SPRITE_CIVIC_POLICE` - 2×2 police station (15 pop)
- `SPRITE_CIVIC_FIRE` - 2×2 fire station (15 pop)
- `SPRITE_CIVIC_HALL` - 3×3 city hall (30 pop)
- `SPRITE_CIVIC_TRANSIT` - 2×2 transit hub (25 pop)

## Mass Replace Workflow

### Step 1: Prepare Your Artwork
Create 30 building sprites/icons according to the sizes listed above.

### Step 2: Choose Your Format

**For Image Files:**
1. Save files as: `res_house.png`, `com_store.png`, etc.
2. Place in `/public/sprites/` folder
3. Do global find/replace:
   - Find: `'SPRITE_RES_HOUSE'`
   - Replace: `'/sprites/res_house.png'`
   - Repeat for all 30 buildings

**For Inline SVG:**
1. Create SVG code for each building
2. Store in a separate file (e.g., `sprite-data.ts`)
3. Import and reference in `BUILDING_CONFIG`

**For Emoji Placeholders (Quick Test):**
1. Global find/replace each sprite key with an emoji
2. Example: `SPRITE_RES_HOUSE` → `'🏠'`

### Step 3: Update Rendering Code
Currently the app uses solid colors. When you add sprites, update `GameCanvas.tsx` to render the sprite instead of just the background color.

## Example: Adding Image Sprites

### Before (Current):
```typescript
residential_house: { 
  width: 2, 
  height: 2, 
  population: 8, 
  color: '#d47c6a', 
  category: 'residential',
  sprite: 'SPRITE_RES_HOUSE'
}
```

### After (With Images):
```typescript
residential_house: { 
  width: 2, 
  height: 2, 
  population: 8, 
  color: '#d47c6a', 
  category: 'residential',
  sprite: '/sprites/res_house.png'
}
```

### Render Logic Update:
```typescript
// In GameCanvas.tsx, add:
const config = BUILDING_CONFIG[tile.building];

// Draw background
ctx.fillStyle = config.color;
ctx.fillRect(posX, posY, buildingWidth, buildingHeight);

// Draw sprite if it's an image path
if (config.sprite.startsWith('/')) {
  const img = new Image();
  img.src = config.sprite;
  ctx.drawImage(img, posX, posY, buildingWidth, buildingHeight);
}
```

## Benefits of This System

✅ **Easy Mass Updates** - Change all 30 sprites in minutes with find/replace  
✅ **Consistent Naming** - All keys follow `SPRITE_[CATEGORY]_[NAME]` pattern  
✅ **Future-Proof** - Can switch between emojis, images, or SVG easily  
✅ **Type-Safe** - TypeScript will catch any typos or missing sprites  
✅ **No Breaking Changes** - Game works with placeholders until you're ready

## Next Steps

1. Design artwork following the sizes in the reference above
2. Export as PNG/SVG (48×48px base, scaled by building size)
3. Run mass find/replace to swap sprite keys
4. Update rendering logic to draw sprites
5. Test and iterate!

---

**Current Status:** All buildings have sprite keys. Currently rendering as solid colors only. Ready for artwork integration whenever you are!
