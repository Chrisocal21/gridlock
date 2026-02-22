'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { COASTLINE } from '@/store/gameStore';
import { BuildingType, BUILDING_CONFIG } from '@/types/game';
import { RoadShape } from './RoadShapePicker';
import BuildingTooltip from './BuildingTooltip';

const TILE_SIZE = 48; // Base tile size in pixels (smaller for larger grid)
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2;
const SCROLL_BUFFER = 200; // Extra scrollable space around map edges (px)

const getBuildingColor = (building: BuildingType): string => {
  return BUILDING_CONFIG[building]?.color || '#1e293b';
};

// Draw building icon on canvas
const drawBuildingIcon = (
  ctx: CanvasRenderingContext2D, 
  building: BuildingType, 
  x: number, 
  y: number, 
  width: number, 
  height: number,
  zoom: number,
  neighbors?: { top: boolean; bottom: boolean; left: boolean; right: boolean }
) => {
  const color = getBuildingColor(building);
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const iconScale = Math.min(width, height) / 48; // Scale based on tile size
  
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(iconScale, iconScale);
  
  // RESIDENTIAL BUILDINGS
  if (building === 'residential_shack') {
    // Small shack - simple structure
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-10, -2, 20, 16);
    // Roof
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.moveTo(-14, -2);
    ctx.lineTo(0, -14);
    ctx.lineTo(14, -2);
    ctx.closePath();
    ctx.fill();
    // Door
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-3, 4, 6, 10);
  }
  else if (building === 'residential_house') {
    // Standard house
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-14, -5, 28, 22);
    // Roof
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.moveTo(-18, -5);
    ctx.lineTo(0, -18);
    ctx.lineTo(18, -5);
    ctx.closePath();
    ctx.fill();
    // Windows
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(-10, -2, 6, 6);
    ctx.fillRect(4, -2, 6, 6);
    // Door
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-3, 5, 6, 8);
  }
  else if (building === 'residential_apartment') {
    // Multi-story apartment
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-12, -15, 24, 30);
    // Windows grid
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillRect(-8 + col * 6, -13 + row * 6, 4, 4);
      }
    }
    // Door
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-4, 11, 8, 4);
  }
  else if (building === 'residential_highrise') {
    // Tall tower
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-10, -18, 20, 36);
    // Windows
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let row = 0; row < 6; row++) {
      ctx.fillRect(-6, -15 + row * 5, 3, 3);
      ctx.fillRect(3, -15 + row * 5, 3, 3);
    }
  }
  else if (building === 'residential_luxury') {
    // Large luxury house
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-16, -3, 32, 20);
    // Roof
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.moveTo(-20, -3);
    ctx.lineTo(0, -20);
    ctx.lineTo(20, -3);
    ctx.closePath();
    ctx.fill();
    // Windows
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(-12, 0, 5, 5);
    ctx.fillRect(-3, 0, 5, 5);
    ctx.fillRect(7, 0, 5, 5);
    // Door
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-3, 6, 6, 11);
  }
  // COMMERCIAL BUILDINGS
  else if (building === 'commercial_store') {
    // Small store
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-12, -8, 24, 24);
    // Awning
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-12, -12, 24, 4);
    // Window
    ctx.fillStyle = 'rgba(135,206,235,0.6)';
    ctx.fillRect(-8, -2, 16, 10);
    // Door
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-4, 8, 8, 8);
  }
  else if (building === 'commercial_strip') {
    // Strip mall - horizontal storefronts
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-18, -10, 36, 26);
    // Awning
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-18, -14, 36, 4);
    // Multiple storefronts
    ctx.fillStyle = 'rgba(135,206,235,0.6)';
    ctx.fillRect(-15, -6, 8, 10);
    ctx.fillRect(-3, -6, 8, 10);
    ctx.fillRect(9, -6, 8, 10);
  }
  else if (building === 'commercial_shopping') {
    // Shopping center
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-16, -12, 32, 28);
    // Roof detail
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-16, -16, 32, 4);
    // Large windows
    ctx.fillStyle = 'rgba(135,206,235,0.6)';
    ctx.fillRect(-12, -8, 10, 12);
    ctx.fillRect(2, -8, 10, 12);
    // Entrance
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-4, 5, 8, 11);
  }
  else if (building === 'commercial_plaza') {
    // Large plaza
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-18, -14, 36, 32);
    // Multiple levels
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(-16, -10, 32, 4);
    // Windows
    ctx.fillStyle = 'rgba(135,206,235,0.6)';
    ctx.fillRect(-14, -6, 8, 8);
    ctx.fillRect(-2, -6, 8, 8);
    ctx.fillRect(10, -6, 8, 8);
    ctx.fillRect(-14, 4, 8, 8);
    ctx.fillRect(10, 4, 8, 8);
  }
  // INDUSTRIAL BUILDINGS
  else if (building === 'industrial_warehouse') {
    // Warehouse - boxy structure
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-16, -8, 32, 24);
    // Large door
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(-6, 0, 12, 16);
    // Loading dock lines
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-6, 8);
    ctx.lineTo(6, 8);
    ctx.stroke();
  }
  else if (building === 'industrial_factory') {
    // Factory with smokestack
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-14, -4, 28, 20);
    // Smokestack
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(6, -16, 5, 12);
    // Smoke
    ctx.fillStyle = 'rgba(150,150,150,0.4)';
    ctx.beginPath();
    ctx.arc(8, -18, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -20, 2, 0, Math.PI * 2);
    ctx.fill();
    // Windows
    ctx.fillStyle = 'rgba(255,255,200,0.4)';
    ctx.fillRect(-10, 0, 6, 8);
    ctx.fillRect(-2, 0, 6, 8);
  }
  else if (building === 'industrial_distribution') {
    // Distribution center - large warehouse
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-18, -10, 36, 26);
    // Multiple loading docks
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(-14, 4, 8, 12);
    ctx.fillRect(-2, 4, 8, 12);
    ctx.fillRect(10, 4, 8, 12);
    // Roof vents
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-8, -14, 4, 4);
    ctx.fillRect(4, -14, 4, 4);
  }
  // GREEN SPACES
  else if (building === 'green_tree') {
    // Single tree
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-2, 4, 4, 12);
    // Foliage
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -4, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-6, -8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -8, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  else if (building === 'green_park') {
    // Park with trees and paths - light background
    ctx.fillStyle = 'rgba(163, 230, 53, 0.2)';
    ctx.fillRect(-20, -20, 40, 40);
    
    // Grass patches
    ctx.fillStyle = 'rgba(163, 230, 53, 0.4)';
    ctx.beginPath();
    ctx.arc(-8, -10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-6, 8, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Trees with trunks and foliage
    // Tree 1
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-10, -2, 3, 8);
    ctx.fillStyle = 'rgba(101, 163, 13, 0.9)';
    ctx.beginPath();
    ctx.arc(-8, -6, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Tree 2
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(8, 0, 3, 7);
    ctx.fillStyle = 'rgba(101, 163, 13, 0.9)';
    ctx.beginPath();
    ctx.arc(9, -4, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Tree 3
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-4, 8, 2, 6);
    ctx.fillStyle = 'rgba(101, 163, 13, 0.9)';
    ctx.beginPath();
    ctx.arc(-3, 4, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Winding path
    ctx.strokeStyle = 'rgba(160, 130, 90, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, 12);
    ctx.quadraticCurveTo(-6, 2, 4, -2);
    ctx.quadraticCurveTo(12, -6, 20, -10);
    ctx.stroke();
    
    // Bench
    ctx.fillStyle = 'rgba(139, 90, 43, 0.8)';
    ctx.fillRect(0, 10, 8, 3);
    ctx.fillRect(0, 7, 2, 6);
    ctx.fillRect(6, 7, 2, 6);
  }
  else if (building === 'green_reserve') {
    // Nature reserve - dense forest
    ctx.fillStyle = 'rgba(101, 163, 13, 0.15)';
    ctx.fillRect(-20, -20, 40, 40);
    
    // Dense tree coverage
    const treePositions = [
      {x: -12, y: -12, size: 6},
      {x: -4, y: -14, size: 5},
      {x: 4, y: -12, size: 6},
      {x: 12, y: -10, size: 5},
      {x: -14, y: -2, size: 5},
      {x: -6, y: -4, size: 6},
      {x: 2, y: -2, size: 5},
      {x: 10, y: 0, size: 6},
      {x: -10, y: 6, size: 5},
      {x: -2, y: 8, size: 6},
      {x: 6, y: 10, size: 5},
      {x: 14, y: 8, size: 5}
    ];
    
    treePositions.forEach(tree => {
      // Tree trunk
      ctx.fillStyle = '#7a5c3a';
      ctx.fillRect(tree.x - 1, tree.y + tree.size - 3, 2, 4);
      // Foliage - alternating shades for depth
      ctx.fillStyle = tree.size > 5 ? 'rgba(76, 123, 8, 0.85)' : 'rgba(101, 163, 13, 0.8)';
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, tree.size, 0, Math.PI * 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = 'rgba(163, 230, 53, 0.3)';
      ctx.beginPath();
      ctx.arc(tree.x - 2, tree.y - 2, tree.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Wildlife symbol (bird)
    ctx.strokeStyle = 'rgba(80, 60, 40, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-16, -18);
    ctx.quadraticCurveTo(-14, -20, -12, -18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-16, -18);
    ctx.quadraticCurveTo(-18, -20, -20, -18);
    ctx.stroke();
  }
  else if (building === 'green_promenade') {
    // Paved walkway with trees
    ctx.fillStyle = 'rgba(180, 180, 180, 0.3)';
    ctx.fillRect(-18, -6, 36, 12);
    // Trees along sides
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(-12, -12, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(12, -12, 5, 0, Math.PI * 2);
    ctx.fill();
    // Benches
    ctx.fillStyle = 'rgba(139, 90, 43, 0.6)';
    ctx.fillRect(-10, 2, 4, 2);
    ctx.fillRect(6, 2, 4, 2);
  }
  // CIVIC BUILDINGS
  else if (building === 'civic_school') {
    // School building
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-14, -8, 28, 22);
    // Roof
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-14, -12, 28, 4);
    // Windows
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let col = 0; col < 4; col++) {
      ctx.fillRect(-12 + col * 8, -4, 4, 6);
    }
    // Flag pole
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, -12);
    ctx.lineTo(10, -20);
    ctx.stroke();
    // Flag
    ctx.fillStyle = 'rgba(255,0,0,0.6)';
    ctx.fillRect(10, -20, 6, 4);
  }
  else if (building === 'civic_hospital') {
    // Hospital building
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-14, -10, 28, 26);
    // Windows
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        ctx.fillRect(-12 + col * 8, -6 + row * 8, 4, 4);
      }
    }
    // Red cross
    ctx.fillStyle = 'rgba(220,0,0,0.8)';
    ctx.fillRect(-2, -14, 4, 10);
    ctx.fillRect(-5, -11, 10, 4);
  }
  else if (building === 'civic_police') {
    // Police station
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-14, -8, 28, 22);
    // Roof
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-14, -12, 28, 4);
    // Windows
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(-10, -2, 6, 6);
    ctx.fillRect(4, -2, 6, 6);
    // Police badge (star)
    ctx.fillStyle = 'rgba(150,150,200,0.8)';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = 0 + Math.cos(angle) * 5;
      const y = -14 + Math.sin(angle) * 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
  else if (building === 'civic_fire') {
    // Fire station
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-14, -8, 28, 22);
    // Roof
    ctx.fillStyle = 'rgba(180,0,0,0.4)';
    ctx.fillRect(-14, -12, 28, 4);
    // Garage doors
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(-10, 0, 8, 14);
    ctx.fillRect(2, 0, 8, 14);
    // Tower
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(10, -18, 6, 10);
  }
  else if (building === 'civic_hall') {
    // City hall
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-14, -8, 28, 22);
    // Columns
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(-12, 0, 3, 14);
    ctx.fillRect(-4, 0, 3, 14);
    ctx.fillRect(4, 0, 3, 14);
    ctx.fillRect(9, 0, 3, 14);
    // Pediment roof
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.moveTo(-16, -8);
    ctx.lineTo(0, -16);
    ctx.lineTo(16, -8);
    ctx.closePath();
    ctx.fill();
    // Dome
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.arc(0, -16, 6, Math.PI, 0);
    ctx.fill();
  }
  else if (building === 'civic_transit') {
    // Transit hub
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-16, -10, 32, 26);
    // Platform roof
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-16, -14, 32, 4);
    // Support columns
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-12, -10, 2, 26);
    ctx.fillRect(10, -10, 2, 26);
    // Tracks
    ctx.strokeStyle = 'rgba(100,100,100,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, 10);
    ctx.lineTo(16, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-16, 14);
    ctx.lineTo(16, 14);
    ctx.stroke();
    // Bus symbol
    ctx.fillStyle = 'rgba(0,0,255,0.5)';
    ctx.fillRect(-6, -6, 12, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(-4, -4, 3, 3);
    ctx.fillRect(1, -4, 3, 3);
  }
  // INFRASTRUCTURE
  else if (building === 'bridge') {
    // Bridge structure
    ctx.fillStyle = 'rgba(100,100,100,0.4)';
    ctx.fillRect(-20, -6, 40, 12);
    // Support columns
    ctx.fillStyle = 'rgba(80,80,80,0.6)';
    ctx.fillRect(-15, -6, 3, 20);
    ctx.fillRect(-5, -6, 3, 20);
    ctx.fillRect(5, -6, 3, 20);
    ctx.fillRect(12, -6, 3, 20);
    // Road surface
    ctx.fillStyle = 'rgba(60,60,65,0.7)';
    ctx.fillRect(-20, -4, 40, 8);
    // Lane markings
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  else if (building === 'river') {
    // Water flow
    ctx.fillStyle = 'rgba(93,157,168,0.5)';
    ctx.fillRect(-20, -20, 40, 40);
    // Wave patterns
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-20, -10 + i * 10);
      ctx.quadraticCurveTo(-10, -12 + i * 10, 0, -10 + i * 10);
      ctx.quadraticCurveTo(10, -8 + i * 10, 20, -10 + i * 10);
      ctx.stroke();
    }
  }
  // ROADS - realistic rendering with lane markers
  else if (building.includes('road') || building === 'highway' || building === 'dirt_path') {
    const isHighway = building === 'highway';
    const isFourLane = building === 'four_lane_road';
    const isDirt = building === 'dirt_path';
    
    // Determine road orientation based on neighbors
    const hasTop = neighbors?.top || false;
    const hasBottom = neighbors?.bottom || false;
    const hasLeft = neighbors?.left || false;
    const hasRight = neighbors?.right || false;
    
    // Determine primary flow direction
    const flowsHorizontal = hasLeft || hasRight;
    const flowsVertical = hasTop || hasBottom;
    const isIntersection = flowsHorizontal && flowsVertical;
    
    // For non-intersections, determine if there are parallel roads
    // Horizontal roads: check if roads above/below are also horizontal (parallel lanes)
    // Vertical roads: check if roads left/right are also vertical (parallel lanes)
    const hasParallelAbove = flowsHorizontal && !isIntersection && hasTop;
    const hasParallelBelow = flowsHorizontal && !isIntersection && hasBottom;
    const hasParallelLeft = flowsVertical && !isIntersection && hasLeft && !flowsHorizontal;
    const hasParallelRight = flowsVertical && !isIntersection && hasRight && !flowsHorizontal;
    const hasParallel = hasParallelAbove || hasParallelBelow || hasParallelLeft || hasParallelRight;
    
    ctx.save();
    
    // Rotate for vertical roads
    if (flowsVertical && !flowsHorizontal && !isIntersection) {
      ctx.rotate(Math.PI / 2);
    }
    
    if (isDirt) {
      // Dirt path - simple brown path with texture
      ctx.fillStyle = 'rgba(101, 67, 33, 0.6)';
      ctx.fillRect(-24, -16, 48, 32);
      // Add some texture dots
      ctx.fillStyle = 'rgba(139, 90, 43, 0.5)';
      for (let i = 0; i < 8; i++) {
        const dx = (Math.random() - 0.5) * 40;
        const dy = (Math.random() - 0.5) * 28;
        ctx.fillRect(dx, dy, 2, 2);
      }
    } else if (isIntersection) {
      // Intersection - draw full square road with proper handling for all directions
      const roadSize = isHighway ? 48 : isFourLane ? 44 : 24;
      
      ctx.fillStyle = isHighway ? 'rgba(40, 40, 45, 0.9)' : 'rgba(60, 60, 65, 0.9)';
      ctx.fillRect(-roadSize/2, -roadSize/2, roadSize, roadSize);
      
      // Draw white crosswalk/stop lines if road terminates (cleaner look)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      
      if (!hasTop) {
        // Top edge - draw stop line
        ctx.beginPath();
        ctx.moveTo(-roadSize/2 + 2, -roadSize/2 + 2);
        ctx.lineTo(roadSize/2 - 2, -roadSize/2 + 2);
        ctx.stroke();
      }
      if (!hasBottom) {
        // Bottom edge - draw stop line
        ctx.beginPath();
        ctx.moveTo(-roadSize/2 + 2, roadSize/2 - 2);
        ctx.lineTo(roadSize/2 - 2, roadSize/2 - 2);
        ctx.stroke();
      }
      if (!hasLeft) {
        // Left edge - draw stop line
        ctx.beginPath();
        ctx.moveTo(-roadSize/2 + 2, -roadSize/2 + 2);
        ctx.lineTo(-roadSize/2 + 2, roadSize/2 - 2);
        ctx.stroke();
      }
      if (!hasRight) {
        // Right edge - draw stop line
        ctx.beginPath();
        ctx.moveTo(roadSize/2 - 2, -roadSize/2 + 2);
        ctx.lineTo(roadSize/2 - 2, roadSize/2 - 2);
        ctx.stroke();
      }
      
      // Draw subtle lane guides through intersection for traffic flow
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      
      if (flowsHorizontal) {
        // Horizontal flow lanes
        ctx.beginPath();
        ctx.moveTo(-roadSize/2, -6);
        ctx.lineTo(roadSize/2, -6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-roadSize/2, 6);
        ctx.lineTo(roadSize/2, 6);
        ctx.stroke();
      }
      
      if (flowsVertical) {
        // Vertical flow lanes
        ctx.beginPath();
        ctx.moveTo(-6, -roadSize/2);
        ctx.lineTo(-6, roadSize/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(6, -roadSize/2);
        ctx.lineTo(6, roadSize/2);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    } else if (hasParallel && !isDirt) {
      // Side-by-side roads - render as wider multi-lane road
      // Determine position (top/bottom for horizontal, left/right for vertical)
      const isTopLane = hasParallelBelow;
      const isBottomLane = hasParallelAbove;
      const isLeftLane = hasParallelRight;
      const isRightLane = hasParallelLeft;
      
      // Render based on position
      const laneOffset = 12; // Half-width of single lane
      
      // Road surface (full width on one side, partial on the other to merge)
      ctx.fillStyle = 'rgba(60, 60, 65, 0.9)';
      
      if (isTopLane || isLeftLane) {
        // Top or left lane - draw from center to edge
        ctx.fillRect(-22, -laneOffset, 44, laneOffset * 2);
      } else if (isBottomLane || isRightLane) {
        // Bottom or right lane - draw from edge to center
        ctx.fillRect(-22, -laneOffset, 44, laneOffset * 2);
      } else {
        // Middle lane or both sides - full coverage
        ctx.fillRect(-22, -laneOffset * 2, 44, laneOffset * 4);
      }
      
      // Draw lane markings
      if (isTopLane) {
        // Top lane - white edge on top, dashed yellow at bottom (center)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-22, -laneOffset);
        ctx.lineTo(22, -laneOffset);
        ctx.stroke();
        
        // Yellow dashed center
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-22, laneOffset);
        ctx.lineTo(22, laneOffset);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (isBottomLane) {
        // Bottom lane - dashed yellow at top (center), white edge at bottom
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-22, -laneOffset);
        ctx.lineTo(22, -laneOffset);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-22, laneOffset);
        ctx.lineTo(22, laneOffset);
        ctx.stroke();
      } else {
        // Has parallel roads on both sides - draw as middle lanes with dashed white dividers
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-22, -laneOffset);
        ctx.lineTo(22, -laneOffset);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-22, laneOffset);
        ctx.lineTo(22, laneOffset);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    } else if (isFourLane) {
      // Four lane road - wider with double yellow line
      // Road surface
      ctx.fillStyle = 'rgba(50, 50, 55, 0.9)';
      ctx.fillRect(-24, -20, 48, 40);
      
      // White edge lines (top and bottom)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-24, -18);
      ctx.lineTo(24, -18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-24, 18);
      ctx.lineTo(24, 18);
      ctx.stroke();
      
      // Double yellow center line
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-24, -2);
      ctx.lineTo(24, -2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-24, 2);
      ctx.lineTo(24, 2);
      ctx.stroke();
      
      // Dashed white lane dividers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-24, -10);
      ctx.lineTo(24, -10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-24, 10);
      ctx.lineTo(24, 10);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (isHighway) {
      // Highway - multiple lanes with clear markings
      ctx.fillStyle = 'rgba(40, 40, 45, 0.9)';
      ctx.fillRect(-24, -22, 48, 44);
      
      // White edge lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-24, -20);
      ctx.lineTo(24, -20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-24, 20);
      ctx.lineTo(24, 20);
      ctx.stroke();
      
      // Yellow center divider
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.lineTo(24, 0);
      ctx.stroke();
      
      // Dashed white lane lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.setLineDash([5, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-24, -10);
      ctx.lineTo(24, -10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-24, 10);
      ctx.lineTo(24, 10);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Regular paved road - two lanes
      // Road surface
      ctx.fillStyle = 'rgba(60, 60, 65, 0.9)';
      ctx.fillRect(-22, -12, 44, 24);
      
      // White edge lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-22, -10);
      ctx.lineTo(22, -10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-22, 10);
      ctx.lineTo(22, 10);
      ctx.stroke();
      
      // Yellow dashed center line
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.lineTo(22, 0);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  }
  
  ctx.restore();
};

// Export component with roadShape state management
export function useRoadShape() {
  const [shape, setShape] = useState<RoadShape>('intersection');
  return { shape, setShape };
}

interface GameCanvasProps {
  roadShape: RoadShape;
}

export default function GameCanvas({ roadShape }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState(1);
  const [initialPinchCenter, setInitialPinchCenter] = useState<{ x: number; y: number } | null>(null);
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 });
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number; building: BuildingType } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const grid = useGameStore((state) => state.grid);
  const gridSize = useGameStore((state) => state.gridSize);
  const selectedTile = useGameStore((state) => state.selectedTile);
  const selectedBuilding = useGameStore((state) => state.selectedBuilding);
  const selectTile = useGameStore((state) => state.selectTile);
  const setTileBuilding = useGameStore((state) => state.setTileBuilding);
  const addAction = useGameStore((state) => state.addAction);

  // Get road pattern tiles based on shape
  const getRoadPattern = useCallback((shape: RoadShape): Array<{ dx: number; dy: number }> => {
    switch (shape) {
      case 'straight-h':
        return [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 0 }];
      case 'straight-v':
        return [{ dx: 0, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: 2 }];
      case 'turn-ne':
        return [{ dx: 0, dy: 1 }, { dx: 0, dy: 0 }, { dx: 1, dy: 0 }];
      case 'turn-se':
        return [{ dx: 0, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }];
      case 'turn-sw':
        return [{ dx: 0, dy: 1 }, { dx: 1, dy: 1 }, { dx: 1, dy: 0 }];
      case 'turn-nw':
        return [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 1, dy: 1 }];
      case 't-north':
        return [{ dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }, { dx: 2, dy: 1 }];
      case 't-south':
        return [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 0 }, { dx: 1, dy: 1 }];
      case 't-east':
        return [{ dx: 0, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: 2 }, { dx: 1, dy: 1 }];
      case 't-west':
        return [{ dx: 1, dy: 0 }, { dx: 1, dy: 1 }, { dx: 1, dy: 2 }, { dx: 0, dy: 1 }];
      case 'intersection':
        return [
          { dx: 0, dy: 0 }, { dx: 1, dy: 0 },
          { dx: 0, dy: 1 }, { dx: 1, dy: 1 }
        ];
      default:
        return [{ dx: 0, dy: 0 }];
    }
  }, []);

  // Check if a building can be placed at a position
  const canPlaceBuilding = useCallback((building: BuildingType, x: number, y: number): boolean => {
    const config = BUILDING_CONFIG[building];
    if (!config) return false;

    // Check if all tiles are within bounds and not locked/occupied
    for (let dy = 0; dy < config.height; dy++) {
      for (let dx = 0; dx < config.width; dx++) {
        const checkX = x + dx;
        const checkY = y + dy;
        
        // Out of bounds
        if (checkY >= gridSize || checkX >= (grid[0]?.length || 0)) return false;
        if (checkY < 0 || checkX < 0) return false;
        
        const tile = grid[checkY][checkX];
        
        // Tile is locked (ocean/beach)
        if (tile.isLocked) return false;
        
        // Tile is occupied by another building (check if it's part of a different multi-tile building)
        if (tile.occupiedBy && (tile.occupiedBy.x !== x || tile.occupiedBy.y !== y)) return false;
        
        // Tile already has a building (unless it's empty or the same position)
        if (tile.building !== 'empty' && !(tile.x === x && tile.y === y)) return false;
      }
    }
    
    return true;
  }, [grid, gridSize]);

  // Check if a road pattern can be placed
  const canPlaceRoadPattern = useCallback((x: number, y: number, pattern: Array<{ dx: number; dy: number }>): boolean => {
    for (const { dx, dy } of pattern) {
      const checkX = x + dx;
      const checkY = y + dy;
      
      // Out of bounds
      if (checkY >= gridSize || checkX >= (grid[0]?.length || 0)) return false;
      if (checkY < 0 || checkX < 0) return false;
      
      const tile = grid[checkY][checkX];
      
      // Tile is locked (ocean/beach)
      if (tile.isLocked) return false;
    }
    return true;
  }, [grid, gridSize]);

  // Place a road pattern
  const placeRoadPattern = useCallback((x: number, y: number, roadType: BuildingType, pattern: Array<{ dx: number; dy: number }>) => {
    const tilesChanged: Array<{ x: number; y: number; previous: BuildingType; new: BuildingType }> = [];
    
    pattern.forEach(({ dx, dy }) => {
      const tileX = x + dx;
      const tileY = y + dy;
      if (tileY >= 0 && tileY < gridSize && tileX >= 0 && tileX < (grid[0]?.length || 0)) {
        const previous = grid[tileY][tileX].building;
        tilesChanged.push({ x: tileX, y: tileY, previous, new: roadType });
      }
    });

    if (tilesChanged.length === 0) return;

    // Apply all changes as one action
    const newGrid = grid.map(row => row.map(tile => ({ ...tile })));
    tilesChanged.forEach(({ x, y, new: newType }) => {
      newGrid[y][x].building = newType;
    });
    
    useGameStore.setState({ grid: newGrid });
    
    addAction({
      type: 'draw',
      tiles: tilesChanged,
    });
  }, [grid, gridSize, addAction]);

  // Draw the grid
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    const tileSize = TILE_SIZE;

    // Draw beach area first (underneath ocean) to fill any gaps
    const beachWidth = 2;
    ctx.fillStyle = '#f5deb3'; // Wheat/sand color
    
    // Draw beach as solid rectangles extending into ocean area
    for (let y = 0; y < COASTLINE.length; y++) {
      const oceanX = COASTLINE[y] * tileSize;
      // Start beach well into ocean and extend to land
      const beachStartX = oceanX - tileSize * 2;
      const beachEndX = (COASTLINE[y] + beachWidth) * tileSize;
      const rowY = y * tileSize;
      
      ctx.fillRect(beachStartX, rowY, beachEndX - beachStartX, tileSize);
    }
    
    // Add subtle sand texture/pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let y = 0; y < COASTLINE.length; y += 2) {
      const oceanX = COASTLINE[y] * tileSize;
      const beachX = (COASTLINE[y] + beachWidth) * tileSize;
      ctx.fillRect(oceanX - tileSize, y * tileSize + tileSize * 0.5, beachX - oceanX + tileSize, tileSize * 0.1);
    }

    // Draw smooth ocean on top (covers part of beach, defining clean edge)
    ctx.fillStyle = '#4a7c8a'; // Ocean blue
    ctx.beginPath();
    
    // Start from top-left
    ctx.moveTo(0, 0);
    
    // Create smooth coastline using quadratic curves
    for (let y = 0; y < COASTLINE.length; y++) {
      const x = COASTLINE[y] * tileSize;
      const nextY = (y + 1) * tileSize;
      
      if (y === 0) {
        ctx.lineTo(x, 0);
      } else if (y < COASTLINE.length - 1) {
        // Use quadratic curve for smooth transitions
        const nextX = COASTLINE[y + 1] * tileSize;
        const currentY = y * tileSize;
        const controlX = (x + nextX) / 2;
        const controlY = (currentY + nextY) / 2;
        
        ctx.quadraticCurveTo(x, currentY, controlX, controlY);
      } else {
        // Last point
        ctx.lineTo(x, y * tileSize);
      }
    }
    
    // Complete the ocean area by going to bottom-left and back to top
    const lastY = COASTLINE.length * tileSize;
    const lastX = COASTLINE[COASTLINE.length - 1] * tileSize;
    ctx.lineTo(lastX, lastY);
    ctx.lineTo(0, lastY);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    
    // Add wave pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let y = 0; y < COASTLINE.length; y += 3) {
      const x = COASTLINE[y] * tileSize;
      ctx.fillRect(0, y * tileSize + tileSize * 0.3, x, tileSize * 0.2);
    }

    // Draw tiles
    grid.forEach((row, y) => {
      row.forEach((tile, x) => {
        // Skip ocean and beach tiles - they're drawn as smooth polygons above
        if (tile.building === 'ocean' || tile.building === 'beach') {
          return;
        }
        
        // Skip tiles that are occupied by another building (not the anchor)
        if (tile.occupiedBy) {
          return; // Don't draw, this is part of a multi-tile building
        }
        
        const posX = x * tileSize;
        const posY = y * tileSize;
        
        // Get building size to draw multi-tile buildings
        const config = BUILDING_CONFIG[tile.building];
        const buildingWidth = config.width * tileSize;
        const buildingHeight = config.height * tileSize;

        // Draw tile background (scaled for multi-tile buildings)
        ctx.fillStyle = getBuildingColor(tile.building);
        ctx.fillRect(posX, posY, buildingWidth, buildingHeight);

        // Draw building icon
        if (tile.building !== 'empty') {
          // For roads, detect neighbors to determine orientation
          let neighbors = undefined;
          const isRoad = tile.building.includes('road') || tile.building === 'highway' || tile.building === 'dirt_path';
          
          if (isRoad) {
            const isRoadTile = (building: BuildingType) => 
              building.includes('road') || building === 'highway' || building === 'dirt_path';
            
            neighbors = {
              top: y > 0 && isRoadTile(grid[y - 1][x].building),
              bottom: y < gridSize - 1 && isRoadTile(grid[y + 1][x].building),
              left: x > 0 && isRoadTile(grid[y][x - 1].building),
              right: x < (grid[0]?.length || 0) - 1 && isRoadTile(grid[y][x + 1].building)
            };
          }
          
          drawBuildingIcon(ctx, tile.building, posX, posY, buildingWidth, buildingHeight, zoom, neighbors);
        }

        // Draw tile border for non-ocean tiles (around entire multi-tile building)
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1 / zoom;
        ctx.strokeRect(posX, posY, buildingWidth, buildingHeight);
        
        // For multi-tile buildings, draw grid lines to show tile boundaries
        if (config.width > 1 || config.height > 1) {
          ctx.strokeStyle = 'rgba(221, 221, 221, 0.3)';
          ctx.lineWidth = 0.5 / zoom;
          
          // Vertical lines
            for (let i = 1; i < config.width; i++) {
              ctx.beginPath();
              ctx.moveTo(posX + i * tileSize, posY);
              ctx.lineTo(posX + i * tileSize, posY + buildingHeight);
              ctx.stroke();
            }
            
            // Horizontal lines
            for (let i = 1; i < config.height; i++) {
              ctx.beginPath();
              ctx.moveTo(posX, posY + i * tileSize);
              ctx.lineTo(posX + buildingWidth, posY + i * tileSize);
              ctx.stroke();
            }
          }

        // Highlight selected tile
        if (selectedTile && selectedTile.x === x && selectedTile.y === y) {
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 3 / zoom;
          ctx.strokeRect(posX, posY, buildingWidth, buildingHeight);
        }
      });
    });

    //Draw building/road placement preview
    if (selectedBuilding && hoverPos && selectedBuilding !== 'empty') {
      const isRoadType = selectedBuilding.includes('road') || selectedBuilding === 'highway' || selectedBuilding === 'dirt_path';
      
      if (isRoadType) {
        // Draw road pattern preview
        const pattern = getRoadPattern(roadShape);
        const isValid = canPlaceRoadPattern(hoverPos.x, hoverPos.y, pattern);
        
        pattern.forEach(({ dx, dy }) => {
          const tileX = hoverPos.x + dx;
          const tileY = hoverPos.y + dy;
          const posX = tileX * tileSize;
          const posY = tileY * tileSize;
          
          if (tileY >= 0 && tileY < gridSize && tileX >= 0 && tileX < (grid[0]?.length || 0)) {
            // Draw preview tile with transparency
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = getBuildingColor(selectedBuilding);
            ctx.fillRect(posX, posY, tileSize, tileSize);
            ctx.globalAlpha = 1.0;
            
            // Draw icon in preview
            ctx.globalAlpha = 0.7;
            const isRoadTile = (building: BuildingType) => 
              building.includes('road') || building === 'highway' || building === 'dirt_path';
            
            const previewNeighbors = {
              top: tileY > 0 && (isRoadTile(grid[tileY - 1][tileX].building) || pattern.some(p => p.dx === dx && p.dy === dy - 1)),
              bottom: tileY < gridSize - 1 && (isRoadTile(grid[tileY + 1][tileX].building) || pattern.some(p => p.dx === dx && p.dy === dy + 1)),
              left: tileX > 0 && (isRoadTile(grid[tileY][tileX - 1].building) || pattern.some(p => p.dx === dx - 1 && p.dy === dy)),
              right: tileX < (grid[0]?.length || 0) - 1 && (isRoadTile(grid[tileY][tileX + 1].building) || pattern.some(p => p.dx === dx + 1 && p.dy === dy))
            };
            
            drawBuildingIcon(ctx, selectedBuilding, posX, posY, tileSize, tileSize, zoom, previewNeighbors);
            ctx.globalAlpha = 1.0;
            
            // Draw border (green for valid, red for invalid)
            ctx.strokeStyle = isValid ? '#22c55e' : '#ef4444';
            ctx.lineWidth = 3 / zoom;
            ctx.strokeRect(posX, posY, tileSize, tileSize);
          }
        });
      } else {
        // Regular building preview
        const config = BUILDING_CONFIG[selectedBuilding];
        const buildingWidth = config.width * tileSize;
        const buildingHeight = config.height * tileSize;
        const posX = hoverPos.x * tileSize;
        const posY = hoverPos.y * tileSize;
        
        const isValid = canPlaceBuilding(selectedBuilding, hoverPos.x, hoverPos.y);
        
        // Draw preview with transparency
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = getBuildingColor(selectedBuilding);
        ctx.fillRect(posX, posY, buildingWidth, buildingHeight);
        ctx.globalAlpha = 1.0;
        
        // Draw building icon in preview
        ctx.globalAlpha = 0.7;
        drawBuildingIcon(ctx, selectedBuilding, posX, posY, buildingWidth, buildingHeight, zoom);
        ctx.globalAlpha = 1.0;
        
        // Draw border (green for valid, red for invalid)
        ctx.strokeStyle = isValid ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 3 / zoom;
        ctx.strokeRect(posX, posY, buildingWidth, buildingHeight);
        
        // Draw grid lines for multi-tile preview
        if (config.width > 1 || config.height > 1) {
          ctx.strokeStyle = isValid ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
          ctx.lineWidth = 1 / zoom;
          
          // Vertical lines
          for (let i = 1; i < config.width; i++) {
            ctx.beginPath();
            ctx.moveTo(posX + i * tileSize, posY);
            ctx.lineTo(posX + i * tileSize, posY + buildingHeight);
            ctx.stroke();
          }
          
          // Horizontal lines
          for (let i = 1; i < config.height; i++) {
            ctx.beginPath();
            ctx.moveTo(posX, posY + i * tileSize);
            ctx.lineTo(posX + buildingWidth, posY + i * tileSize);
            ctx.stroke();
          }
        }
      }
    }

    // Draw fog of war effect around map boundaries
    const gridPixelWidth = (grid[0]?.length || 200) * tileSize;
    const gridPixelHeight = gridSize * tileSize;
    const fogSize = SCROLL_BUFFER / zoom; // Scale fog based on zoom level
    
    // Draw subtle background beyond map edges first
    ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
    // Top
    ctx.fillRect(-fogSize * 2, -fogSize * 2, gridPixelWidth + fogSize * 4, fogSize * 2);
    // Bottom
    ctx.fillRect(-fogSize * 2, gridPixelHeight, gridPixelWidth + fogSize * 4, fogSize * 2);
    // Right (left is drawn curved following coastline later)
    ctx.fillRect(gridPixelWidth, -fogSize * 2, fogSize * 2, gridPixelHeight + fogSize * 4);
    
    // Add subtle noise pattern to fog areas
    ctx.fillStyle = 'rgba(30, 41, 59, 0.3)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * (gridPixelWidth + fogSize * 4) - fogSize * 2;
      const y = Math.random() * (gridPixelHeight + fogSize * 4) - fogSize * 2;
      const size = Math.random() * 3 + 1;
      
      // Only draw in fog areas (outside the map bounds)
      if (x < 0 || x > gridPixelWidth || y < 0 || y > gridPixelHeight) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Top fog gradient
    const topGradient = ctx.createLinearGradient(0, -fogSize, 0, 0);
    topGradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
    topGradient.addColorStop(0.3, 'rgba(15, 23, 42, 0.4)');
    topGradient.addColorStop(0.7, 'rgba(15, 23, 42, 0.8)');
    topGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = topGradient;
    ctx.fillRect(-fogSize, -fogSize, gridPixelWidth + fogSize * 2, fogSize);
    
    // Bottom fog gradient
    const bottomGradient = ctx.createLinearGradient(0, gridPixelHeight, 0, gridPixelHeight + fogSize);
    bottomGradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
    bottomGradient.addColorStop(0.3, 'rgba(15, 23, 42, 0.8)');
    bottomGradient.addColorStop(0.7, 'rgba(15, 23, 42, 0.4)');
    bottomGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(-fogSize, gridPixelHeight, gridPixelWidth + fogSize * 2, fogSize);
    
    // Left fog with curved edge following coastline
    // Draw solid background first
    ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
    ctx.beginPath();
    ctx.moveTo(-fogSize * 2, -fogSize * 2);
    ctx.lineTo(0, -fogSize * 2);
    
    // Follow the coastline
    for (let y = 0; y < COASTLINE.length; y++) {
      const x = COASTLINE[y] * tileSize;
      const nextY = (y + 1) * tileSize;
      
      if (y === 0) {
        ctx.lineTo(x, 0);
      } else if (y < COASTLINE.length - 1) {
        const nextX = COASTLINE[y + 1] * tileSize;
        const currentY = y * tileSize;
        const controlX = (x + nextX) / 2;
        const controlY = (currentY + nextY) / 2;
        ctx.quadraticCurveTo(x, currentY, controlX, controlY);
      } else {
        ctx.lineTo(x, y * tileSize);
      }
    }
    
    // Complete the path
    const fogLastY = COASTLINE.length * tileSize;
    ctx.lineTo(0, fogLastY);
    ctx.lineTo(-fogSize * 2, fogLastY);
    ctx.closePath();
    ctx.fill();
    
    // Draw gradient layer over the curved fog
    for (let i = 0; i < 10; i++) {
      const progress = i / 10;
      const alpha = 0.15 * (1 - progress);
      const offset = -fogSize * progress;
      
      ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.lineWidth = fogSize / 10;
      ctx.beginPath();
      
      for (let y = 0; y < COASTLINE.length; y++) {
        const x = COASTLINE[y] * tileSize + offset;
        const nextY = (y + 1) * tileSize;
        
        if (y === 0) {
          ctx.moveTo(x, 0);
        } else if (y < COASTLINE.length - 1) {
          const nextX = COASTLINE[y + 1] * tileSize + offset;
          const currentY = y * tileSize;
          const controlX = (x + nextX) / 2;
          const controlY = (currentY + nextY) / 2;
          ctx.quadraticCurveTo(x, currentY, controlX, controlY);
        } else {
          ctx.lineTo(x, y * tileSize);
        }
      }
      ctx.stroke();
    }
    
    // Right fog gradient
    const rightGradient = ctx.createLinearGradient(gridPixelWidth, 0, gridPixelWidth + fogSize, 0);
    rightGradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
    rightGradient.addColorStop(0.3, 'rgba(15, 23, 42, 0.8)');
    rightGradient.addColorStop(0.7, 'rgba(15, 23, 42, 0.4)');
    rightGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = rightGradient;
    ctx.fillRect(gridPixelWidth, 0, fogSize, gridPixelHeight);
    
    // Corner vignettes for extra depth (only top-right and bottom-right, as left follows coastline)
    // Top-right corner
    const trGradient = ctx.createRadialGradient(gridPixelWidth, 0, 0, gridPixelWidth, 0, fogSize * 1.2);
    trGradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
    trGradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.6)');
    trGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = trGradient;
    ctx.fillRect(gridPixelWidth, -fogSize, fogSize, fogSize);
    
    // Bottom-right corner
    const brGradient = ctx.createRadialGradient(gridPixelWidth, gridPixelHeight, 0, gridPixelWidth, gridPixelHeight, fogSize * 1.2);
    brGradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
    brGradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.6)');
    brGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = brGradient;
    ctx.fillRect(gridPixelWidth, gridPixelHeight, fogSize, fogSize);

    ctx.restore();
  }, [grid, gridSize, zoom, offset, selectedTile, selectedBuilding, hoverPos, roadShape, getRoadPattern, canPlaceBuilding, canPlaceRoadPattern]);

  // Redraw on changes
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  // Maintain coastline position when zoom changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridPixelHeight = gridSize * TILE_SIZE * zoom;
    const gridPixelWidth = (grid[0]?.length || 200) * TILE_SIZE * zoom;
    
    setOffset(prev => ({
      x: Math.min(Math.max(prev.x, canvas.width - gridPixelWidth - SCROLL_BUFFER), SCROLL_BUFFER),
      y: Math.max(Math.min(prev.y, SCROLL_BUFFER), canvas.height - gridPixelHeight - SCROLL_BUFFER),
    }));
  }, [zoom, gridSize, grid]);

  // Mouse wheel zoom and pan - use callback to prevent infinite loops
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Detect touchpad pinch-to-zoom (ctrlKey + wheel event)
    // This is how browsers report trackpad pinch gestures
    if (e.ctrlKey) {
      // Pinch-to-zoom (touchpad or Ctrl+wheel)
      setZoom(prevZoom => {
        // Get world coordinates before zoom using current offset
        setOffset(prevOffset => {
          const worldX = (mouseX - prevOffset.x) / prevZoom;
          const worldY = (mouseY - prevOffset.y) / prevZoom;
          
          // Smoother zoom for touchpad pinch
          const zoomFactor = -e.deltaY * 0.01;
          const zoomDelta = 1 + zoomFactor;
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom * zoomDelta));
          
          // Return new offset to keep world position under cursor
          return {
            x: mouseX - worldX * newZoom,
            y: mouseY - worldY * newZoom,
          };
        });
        
        // Return new zoom
        const zoomFactor = -e.deltaY * 0.01;
        const zoomDelta = 1 + zoomFactor;
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom * zoomDelta));
      });
    } else if (e.shiftKey) {
      // Shift + scroll = horizontal pan
      const panSpeed = 1.5;
      const dx = -e.deltaY * panSpeed;
      
      setOffset(prev => {
        const gridPixelWidth = (grid[0]?.length || 200) * TILE_SIZE * zoom;
        return {
          x: Math.min(Math.max(prev.x + dx, canvas.width - gridPixelWidth - SCROLL_BUFFER), SCROLL_BUFFER),
          y: prev.y,
        };
      });
    } else {
      // Two-finger scroll on touchpad or mouse wheel = pan
      const panSpeed = 1.5;
      const dx = -e.deltaX * panSpeed;
      const dy = -e.deltaY * panSpeed;
      
      setOffset(prev => {
        const gridPixelHeight = gridSize * TILE_SIZE * zoom;
        const gridPixelWidth = (grid[0]?.length || 200) * TILE_SIZE * zoom;
        return {
          x: Math.min(Math.max(prev.x + dx, canvas.width - gridPixelWidth - SCROLL_BUFFER), SCROLL_BUFFER),
          y: Math.max(Math.min(prev.y + dy, SCROLL_BUFFER), canvas.height - gridPixelHeight - SCROLL_BUFFER),
        };
      });
    }
  }, [gridSize, grid, zoom]);

  // Register wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Resize canvas to fill container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        // Calculate zoom to fit full grid height in viewport
        const gridPixelHeight = gridSize * TILE_SIZE;
        const optimalZoom = Math.min(canvas.height / gridPixelHeight, 1);
        setZoom(optimalZoom);
        
        // Position grid with coastline locked to left, top-aligned with some padding
        const scaledHeight = gridPixelHeight * optimalZoom;
        setOffset({
          x: 0, // Lock to left edge for coastline visibility
          y: Math.min((canvas.height - scaledHeight) / 2, 0), // Center if fits, otherwise top-align
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [gridSize]);

  // Convert screen coordinates to grid coordinates
  const screenToGrid = (screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const canvasX = screenX - rect.left;
    const canvasY = screenY - rect.top;

    const gridX = Math.floor((canvasX - offset.x) / (TILE_SIZE * zoom));
    const gridY = Math.floor((canvasY - offset.y) / (TILE_SIZE * zoom));

    const gridWidth = grid[0]?.length || 0;
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridSize) {
      return { x: gridX, y: gridY };
    }

    return null;
  };

  // Get distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - might be tap, road draw, or pan
      const touch = e.touches[0];
      const gridPos = screenToGrid(touch.clientX, touch.clientY);
      
      setTouchStartTime(Date.now());
      setDragStart({ x: touch.clientX, y: touch.clientY });
      
      if (gridPos) {
        selectTile(gridPos.x, gridPos.y);
      }
    } else if (e.touches.length === 2) {
      // Two finger - pinch zoom and pan
      const pinchCenter = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      setInitialPinchDistance(getTouchDistance(e.touches));
      setInitialZoom(zoom);
      setInitialPinchCenter(pinchCenter);
      setInitialOffset(offset);
      setIsPanning(true);
      setDragStart(pinchCenter);
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const holdDuration = Date.now() - touchStartTime;
      
      // Calculate movement distance
      const dx = touch.clientX - dragStart.x;
      const dy = touch.clientY - dragStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If moved more than 10px quickly, it's a pan gesture
      if (distance > 10 && holdDuration < 200) {
        setIsPanning(true);
      }
      
      if (isPanning) {
        // Pan the view
        const gridPixelHeight = gridSize * TILE_SIZE * zoom;
        const gridPixelWidth = (grid[0]?.length || 200) * TILE_SIZE * zoom;
        
        setOffset(prev => ({
          x: Math.min(Math.max(prev.x + dx, canvas.width - gridPixelWidth - SCROLL_BUFFER), SCROLL_BUFFER),
          y: Math.max(Math.min(prev.y + dy, SCROLL_BUFFER), canvas.height - gridPixelHeight - SCROLL_BUFFER),
        }));
        
        setDragStart({ x: touch.clientX, y: touch.clientY });
      }
    } else if (e.touches.length === 2 && initialPinchDistance && initialPinchCenter) {
      // Handle pinch zoom towards pinch center
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / initialPinchDistance;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, initialZoom * scale));
      
      // Calculate world position at pinch center before zoom
      const worldX = (initialPinchCenter.x - initialOffset.x) / initialZoom;
      const worldY = (initialPinchCenter.y - initialOffset.y) / initialZoom;
      
      // Calculate current pinch center
      const currentCenter = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      
      // Adjust offset to keep world position under current pinch center
      const newOffsetX = currentCenter.x - worldX * newZoom;
      const newOffsetY = currentCenter.y - worldY * newZoom;
      
      setZoom(newZoom);
      setOffset({
        x: newOffsetX,
        y: newOffsetY,
      });

      setDragStart(currentCenter);
    }
  };

  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent) => {
    const holdDuration = Date.now() - touchStartTime;

    if (!isPanning && holdDuration < 300 && e.changedTouches.length === 1) {
      // Quick tap without panning - place building or select tile
      const touch = e.changedTouches[0];
      const gridPos = screenToGrid(touch.clientX, touch.clientY);
      
      if (gridPos) {
        if (selectedBuilding) {
          const isRoadType = selectedBuilding.includes('road') || selectedBuilding === 'highway' || selectedBuilding === 'dirt_path';
          
          if (isRoadType) {
            const pattern = getRoadPattern(roadShape);
            if (canPlaceRoadPattern(gridPos.x, gridPos.y, pattern)) {
              placeRoadPattern(gridPos.x, gridPos.y, selectedBuilding, pattern);
            }
          } else if (canPlaceBuilding(selectedBuilding, gridPos.x, gridPos.y)) {
            setTileBuilding(gridPos.x, gridPos.y, selectedBuilding);
          }
        } else if (grid[gridPos.y][gridPos.x].building !== 'ocean') {
          selectTile(gridPos.x, gridPos.y);
        }
      }
    }

    setIsPanning(false);
    setInitialPinchDistance(null);
    setInitialPinchCenter(null);
    setTouchStartTime(0);
  };

  // Mouse support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const gridPos = screenToGrid(e.clientX, e.clientY);
    
    // Right click (2) - cancel building mode or pan
    if (e.button === 2) {
      e.preventDefault();
      
      // If a building is selected, cancel it on right-click
      if (selectedBuilding) {
        const setSelectedBuilding = useGameStore.getState().setSelectedBuilding;
        setSelectedBuilding(null);
        return;
      }
      
      // Otherwise, start panning
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Middle mouse button (1) for panning
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Left click (0) for building/road
    if (e.button === 0 && gridPos && grid[gridPos.y][gridPos.x].building !== 'ocean') {
      selectTile(gridPos.x, gridPos.y);
      setDragStart({ x: e.clientX, y: e.clientY });
      setTouchStartTime(Date.now());
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Track mouse position for tooltip
    setMousePos({ x: e.clientX, y: e.clientY });
    
    const gridPos = screenToGrid(e.clientX, e.clientY);
    
    // Update hover position for building preview
    if (gridPos && selectedBuilding && !isPanning) {
      setHoverPos(gridPos);
    } else {
      setHoverPos(null);
    }
    
    // Update hovered tile for inspection (when not placing a building)
    if (gridPos && !selectedBuilding && !isPanning) {
      const building = grid[gridPos.y]?.[gridPos.x]?.building;
      if (building && building !== 'ocean' && building !== 'empty') {
        setHoveredTile({ x: gridPos.x, y: gridPos.y, building });
      } else {
        setHoveredTile(null);
      }
    } else {
      setHoveredTile(null);
    }
    
    // Handle panning with middle/right mouse button
    if (isPanning) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      const gridPixelHeight = gridSize * TILE_SIZE * zoom;
      const gridPixelWidth = (grid[0]?.length || 200) * TILE_SIZE * zoom;
      
      setOffset(prev => ({
        x: Math.min(Math.max(prev.x + dx, canvas.width - gridPixelWidth - SCROLL_BUFFER), SCROLL_BUFFER),
        y: Math.max(Math.min(prev.y + dy, SCROLL_BUFFER), canvas.height - gridPixelHeight - SCROLL_BUFFER),
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // End panning
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    
    const holdDuration = Date.now() - touchStartTime;
    const gridPos = screenToGrid(e.clientX, e.clientY);

    // Handle building placement if a building is selected
    if (selectedBuilding && gridPos && holdDuration < 300) {
      const isRoadType = selectedBuilding.includes('road') || selectedBuilding === 'highway' || selectedBuilding === 'dirt_path';
      
      if (isRoadType) {
        const pattern = getRoadPattern(roadShape);
        if (canPlaceRoadPattern(gridPos.x, gridPos.y, pattern)) {
          placeRoadPattern(gridPos.x, gridPos.y, selectedBuilding, pattern);
        }
      } else if (canPlaceBuilding(selectedBuilding, gridPos.x, gridPos.y)) {
        setTileBuilding(gridPos.x, gridPos.y, selectedBuilding);
      }
      setTouchStartTime(0);
      return;
    }

    setTouchStartTime(0);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`w-full h-full touch-none ${
          isPanning ? 'cursor-grabbing' : 
          selectedBuilding ? 'cursor-crosshair' : 
          hoveredTile ? 'cursor-pointer' : 
          'cursor-grab'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setHoverPos(null);
          setHoveredTile(null);
          setIsPanning(false);
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Building info tooltip */}
      {hoveredTile && (
        <BuildingTooltip
          building={hoveredTile.building}
          x={hoveredTile.x}
          y={hoveredTile.y}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
        />
      )}
    </>
  );
}
