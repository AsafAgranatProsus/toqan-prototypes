# Theme-Aware Gradient Frame System

Complete guide to using the gradient frame system in Toqan UI.

## Overview

The **Theme-Aware Gradient Frame System** allows you to:
1. **Create** gradient compositions in the playground
2. **Export** them as JSON frames with theme token references
3. **Import** frames anywhere in your app
4. **Automatically adapt** to the current theme (light/dark/custom)

---

## Quick Start

### 1. Create a Gradient in the Playground

1. Navigate to `/gradient-playground`
2. Select **"Organic Gradient (WebGL)"**
3. Adjust settings (seed, blur, colors, etc.)
4. Click **"📦 Export as Themed Frame"**
5. Enter name, description, and tags
6. Save the JSON file to `configs/gradients/frames/`

### 2. Register the Frame

Add your frame to the registry:

```typescript
// configs/gradients/registry.ts
import myFrame from './frames/my-gradient.json';

export const GRADIENT_FRAMES: Record<string, GradientFrame> = {
  // ... existing frames
  'my-gradient-001': myFrame as GradientFrame,
};
```

### 3. Use the Frame

```tsx
import { ThemedGradient } from '../components/ThemedGradient';
import { useGradientFrame } from '../hooks/useGradientFrame';

export const MyComponent = () => {
  const { frame } = useGradientFrame('my-gradient-001');
  
  if (!frame) return null;
  
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ThemedGradient 
        frame={frame} 
        style={{ position: 'absolute', inset: 0 }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Your content */}
      </div>
    </div>
  );
};
```

---

## Core Concepts

### Theme Tokens

Instead of hardcoded colors (`#4426d9`), frames reference **theme tokens** (`primary-default`).

**Benefits:**
- ✅ Automatically adapts to light/dark themes
- ✅ Consistent with design system
- ✅ Single frame works across all themes
- ✅ Easy theme switching

**Available Tokens:**
```typescript
// Primary
'primary-default', 'primary-hover', 'primary-light', 'primary-background'

// Secondary
'secondary-default', 'secondary-hover', 'secondary-light', 'secondary-background'

// Tertiary  
'tertiary-default', 'tertiary-hover', 'tertiary-light', 'tertiary-background'

// Surface Containers
'surface-container-lowest', 'surface-container-low', 'surface-container',
'surface-container-high', 'surface-container-highest'

// On Colors
'on-primary', 'on-secondary', 'on-tertiary', 'on-surface', 'on-surface-variant'

// UI
'ui-background', 'ui-background-elevated', 'ui-border', 'ui-active'

// Semantic
'error', 'success', 'warning', 'info'

// Text
'text-default', 'text-secondary', 'text-tertiary'
```

### Gradient Frame Structure

```typescript
interface GradientFrame {
  id: string;              // Unique identifier
  name: string;            // Human-readable name
  description?: string;    // Purpose/description
  config: {
    seed: number;          // Pattern variation
    blurIntensity: number; // Blur strength
    noiseScale: number;    // Blob size
    grainIntensity: number;// Texture intensity
    iterations: number;    // Blur quality
    noiseAlgorithm: 'value' | 'simplex' | 'perlin' | 'fbm';
    colorStops: Array<{
      token: string;       // Theme token name
      alpha: number;       // Opacity 0-1
      threshold: number;   // When appears 0-1
    }>;
  };
  tags?: string[];         // For filtering
  createdAt?: string;      // Creation date
  author?: string;         // Creator
}
```

---

## Usage Patterns

### Pattern 1: Specific Frame (Deterministic)

Use a specific frame by ID:

```tsx
import { ThemedGradient } from '../components/ThemedGradient';
import { useGradientFrame } from '../hooks/useGradientFrame';

export const HomePage = () => {
  const { frame } = useGradientFrame('hero-abstract-001');
  
  return (
    <ThemedGradient frame={frame!} />
  );
};
```

### Pattern 2: Random Frame by Tags

Load a random frame filtered by tags:

```tsx
export const BlogPost = () => {
  const { frame } = useGradientFrame(['background', 'calm']);
  
  return frame && <ThemedGradient frame={frame} />;
};
```

### Pattern 3: Random Any Frame

Load any random frame with refresh capability:

```tsx
export const Card = () => {
  const { frame, refresh } = useGradientFrame(undefined, { 
    refreshOnMount: true 
  });
  
  return (
    <div style={{ position: 'relative' }}>
      {frame && <ThemedGradient frame={frame} />}
      <button onClick={refresh}>New Gradient</button>
    </div>
  );
};
```

### Pattern 4: Full-Page Background

```tsx
export const LandingPage = () => {
  const { frame } = useGradientFrame('hero-bold-001');
  
  return (
    <div className="page-container">
      {frame && (
        <ThemedGradient 
          frame={frame}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
          }}
        />
      )}
      
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Content */}
      </main>
    </div>
  );
};
```

### Pattern 5: Card/Panel Background

```tsx
export const FeatureCard = () => {
  const { frame } = useGradientFrame('card-accent-001');
  
  return (
    <div style={{ 
      position: 'relative', 
      borderRadius: 12, 
      overflow: 'hidden',
      padding: '2rem'
    }}>
      {frame && (
        <ThemedGradient 
          frame={frame}
          style={{ 
            position: 'absolute', 
            inset: 0,
            opacity: 0.3  // Subtle background
          }}
        />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2>Feature Title</h2>
        <p>Feature description...</p>
      </div>
    </div>
  );
};
```

---

## Available Frames

### Hero Gradients

**`hero-abstract-001`**
- **Tags**: hero, energetic, multi-color
- **Description**: Bold, multi-color gradient for hero sections
- **Best for**: Landing pages, headers

**`hero-bold-001`**
- **Tags**: hero, bold, high-contrast
- **Description**: High contrast with sharp focus
- **Best for**: Impactful headers, CTAs

**`dynamic-waves-001`**
- **Tags**: dynamic, waves, flowing, hero
- **Description**: Wave-like flowing patterns
- **Best for**: Modern hero sections

### Background Gradients

**`background-calm-001`**
- **Tags**: background, calm, subtle
- **Description**: Subtle, low-contrast background
- **Best for**: Content areas, reading sections

**`card-accent-001`**
- **Tags**: card, panel, accent, soft
- **Description**: Soft accent for cards and panels
- **Best for**: Feature cards, pricing tables

---

## API Reference

### `useGradientFrame(idOrTags, options)`

Hook to load gradient frames.

**Parameters:**
- `idOrTags` - Frame ID (string), tags (string[]), or undefined
- `options` - Configuration object
  - `refreshOnMount?: boolean` - Refresh on mount
  - `fallback?: GradientFrame` - Fallback frame

**Returns:**
```typescript
{
  frame: GradientFrame | null;  // Current frame
  refresh: () => void;           // Refresh function
  isLoaded: boolean;             // Loading state
}
```

### `ThemedGradient` Component

Props:
```typescript
interface ThemedGradientProps {
  frame: GradientFrame;      // Frame to render
  className?: string;        // CSS class
  style?: React.CSSProperties;  // Inline styles
}
```

### Registry Functions

```typescript
// Get frame by ID
getFrameById(id: string): GradientFrame | undefined;

// Get random frame
getRandomFrame(tags?: string[]): GradientFrame | null;

// Get frames by tag
getFramesByTag(tag: string): GradientFrame[];

// Get all frames
getAllFrames(): GradientFrame[];

// Get all tags
getAllTags(): string[];

// Register frame at runtime
registerFrame(frame: GradientFrame): void;
```

---

## Best Practices

### Color Token Selection

✅ **DO:**
- Use semantic tokens (`primary-default`, `surface-container`)
- Match gradient purpose with tokens
- Test in both light and dark themes

❌ **DON'T:**
- Mix unrelated tokens (e.g., `error` with `success`)
- Use only text colors
- Ignore alpha values

### Performance

✅ **DO:**
- Use iterations 20-40 for production
- Limit to 2-4 color stops for subtle gradients
- Reuse frames across pages

❌ **DON'T:**
- Set iterations > 100 (slow)
- Create unique frame per component
- Animate static gradients

### Organization

✅ **DO:**
- Name frames descriptively (`hero-abstract`, `card-subtle`)
- Add meaningful tags
- Document purpose in description
- Group by usage (hero/, background/, card/)

❌ **DON'T:**
- Use generic names (`gradient1`, `test`)
- Leave tags empty
- Skip descriptions

---

## Troubleshooting

### Frame returns null

**Cause:** Frame ID not found or no frames match tags

**Fix:**
```typescript
const { frame } = useGradientFrame('my-frame', {
  fallback: GRADIENT_FRAMES['hero-abstract-001']
});
```

### Colors don't change with theme

**Cause:** Using hardcoded colors instead of theme tokens

**Fix:** Re-export frame from playground (automatically maps to tokens)

### Gradient looks different than playground

**Cause:** Current theme colors differ from playground theme

**Solution:** This is expected! Frames adapt to current theme.

---

## Advanced Usage

### Custom Frame at Runtime

```typescript
import { registerFrame } from '../configs/gradients/registry';

const customFrame: GradientFrame = {
  id: 'custom-runtime',
  name: 'Custom Gradient',
  config: {
    seed: 99,
    blurIntensity: 1.0,
    noiseScale: 2.0,
    grainIntensity: 0.1,
    iterations: 30,
    noiseAlgorithm: 'simplex',
    colorStops: [
      { token: 'primary-default', alpha: 1.0, threshold: 0.0 },
      { token: 'secondary-default', alpha: 0.8, threshold: 0.5 },
    ],
  },
};

registerFrame(customFrame);
```

### Theme-Specific Overrides

```tsx
import { useTheme } from '../hooks/useTheme';

export const ThemedHero = () => {
  const theme = useTheme();
  const frameId = theme === 'dark' ? 'hero-dark-001' : 'hero-light-001';
  const { frame } = useGradientFrame(frameId);
  
  return frame && <ThemedGradient frame={frame} />;
};
```

---

## Migration Guide

### From Static Colors

**Before:**
```tsx
<OrganicGradient 
  colors={[
    { color: '#4426d9', alpha: 1.0, threshold: 0.0 },
    { color: '#19ccc1', alpha: 0.8, threshold: 0.5 },
  ]}
/>
```

**After:**
```tsx
const { frame } = useGradientFrame('my-gradient-001');
return frame && <ThemedGradient frame={frame} />;
```

---

## Files Structure

```
src/
├── types/
│   └── gradientFrame.ts          # Type definitions
├── hooks/
│   ├── useThemeColors.ts         # Theme color resolution
│   └── useGradientFrame.ts       # Frame loading hook
├── components/
│   ├── OrganicGradient/          # Base gradient
│   └── ThemedGradient/           # Theme-aware wrapper
└── configs/
    └── gradients/
        ├── registry.ts           # Frame registry
        └── frames/               # Frame JSON files
            ├── hero-abstract.json
            ├── background-calm.json
            └── ...
```

---

## Next Steps

1. **Create your first frame** in the playground
2. **Export and register** it
3. **Use it** in a component
4. **Test** in different themes
5. **Build a library** of reusable frames

---

*Last updated: December 2025*
