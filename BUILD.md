# Build Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- Git (optional)

## Installation

```bash
# Clone the repository (or download zip)
git clone <repository-url>
cd gridlock

# Install dependencies
npm install

# If you encounter errors, use force flag
npm install --force
```

## Development

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Development Features

- **Hot Reload**: Changes to code automatically reload the browser
- **TypeScript**: Full type checking during development
- **Fast Refresh**: React components hot reload without losing state
- **Error Overlay**: Build errors display in the browser

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Test Production Build Locally

```bash
npm run build
npm start
```

The production build will be available at `http://localhost:3000`

## Project Structure

```
gridlock/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with PWA metadata
│   ├── page.tsx           # Main game page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── GameCanvas.tsx     # Main canvas renderer and input handler
│   ├── BuildingMenu.tsx   # Bottom building selection menu (3-column compact)
│   ├── StatsPanel.tsx     # Bottom stats toolbar (Population, Traffic, Pollution, Happiness)
│   ├── UndoButton.tsx     # Undo action button
│   ├── MenuButton.tsx     # Return to menu button
│   └── SlotSelector.tsx   # Save slot selection screen
├── store/                 # State management
│   └── gameStore.ts       # Zustand store with game logic
├── types/                 # TypeScript types
│   └── game.ts            # Game-specific type definitions
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   ├── icon.svg           # App icon (scalable)
│   ├── icon-192.svg       # 192×192 icon
│   └── icon-512.svg       # 512×512 icon
└── README.md              # Project documentation
```

## Key Dependencies

### Production Dependencies

- **next**: 15.1.6 - React framework
- **react**: 19.0.0 - UI library
- **react-dom**: 19.0.0 - React renderer
- **zustand**: Latest - State management
- **tailwindcss**: Latest - Utility-first CSS

### Development Dependencies

- **typescript**: Latest - Type safety
- **@types/node**: Latest - Node.js types
- **@types/react**: Latest - React types
- **eslint**: Latest - Code linting
- **eslint-config-next**: Latest - Next.js ESLint config

## Environment Setup

No environment variables are required for basic development. For future cloud sync features:

```bash
# Create .env.local for local development
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_account_id
NEXT_PUBLIC_D1_DATABASE_ID=your_database_id
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Import project to [Vercel](https://vercel.com)
3. Deploy automatically

### Cloudflare Pages

```bash
npm run build
# Upload .next folder to Cloudflare Pages
```

### Static Export (if needed later)

Currently uses Next.js server features. For static export:

1. Modify `next.config.js`:
```js
module.exports = {
  output: 'export',
}
```

2. Build:
```bash
npm run build
```

## Troubleshooting

### Installation Issues

**Problem**: `ENOTEMPTY` errors during `npm install`

**Solution**:
```bash
npm install --force
```

**Problem**: TypeScript errors in node_modules

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Issues

**Problem**: Canvas rendering issues

**Solution**: Ensure React 19+ and Next.js 15+ are installed

**Problem**: PWA manifest not loading

**Solution**: Check that `public/manifest.json` exists and is valid JSON

### Runtime Issues

**Problem**: Game doesn't save

**Solution**: Check browser localStorage is enabled and not full

**Problem**: Touch gestures not working

**Solution**: Ensure `touch-action: none` is applied to canvas (via `touch-none` Tailwind class)

## Performance Optimization

### Canvas Rendering

- Grid redraw is optimized with `useCallback`
- Only redraws when necessary state changes
- Zoom and pan use transform matrix for efficiency

### State Management

- Zustand provides minimal re-renders
- Grid changes batch updates
- Undo stack limits memory usage

### Bundle Size

- No heavy dependencies
- Tree-shaking enabled by default
- Minimal JavaScript sent to client

## Testing Locally on Mobile

1. Start dev server: `npm run dev`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Access from mobile: `http://YOUR_IP:3000`
4. Add to home screen for PWA experience

## PWA Installation

When accessing from mobile browser:
1. Open site in Chrome/Safari
2. Tap "Add to Home Screen"
3. Icon appears on home screen
4. Opens in fullscreen mode

## Code Quality

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Future Build Improvements

- [ ] Service Worker for offline functionality
- [ ] Image optimization for building sprites
- [ ] Code splitting for faster initial load
- [ ] CDN deployment for static assets
- [ ] Analytics integration
