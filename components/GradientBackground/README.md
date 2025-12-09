# GradientBackground Component

A versatile background gradient component that supports multiple gradient types with customizable configurations and animations.

## Features

- **Multiple Gradient Types**: Support for blob gradients and organic WebGL gradients
- **Preset System**: Pre-configured gradients with theme-aware colors (zero boilerplate)
- **Configurable**: Accept configuration objects for deterministic rendering
- **Randomization**: Automatic randomization when no config is provided
- **Animation**: Optional animation with customizable intervals
- **Theme-Aware**: Automatically adapts colors based on light/dark theme

## Quick Start

### Using Presets (Recommended)

The easiest way to use beautiful gradients - just pass a preset name:

```tsx
import GradientBackground from './components/GradientBackground';

// Use a named preset
<GradientBackground preset="waves" />
```

**Available Presets:**
- `waves` - Dynamic flowing waves with organic movement
- `hero-bold` - High contrast bold gradient for impactful headers
- `hero-abstract` - Abstract hero pattern
- `card-accent` - Subtle card accent
- `background-calm` - Calm background gradient

All presets automatically adapt to your theme (light/dark mode) with zero configuration!

### Random Preset

No preset specified? A random one is automatically selected:

```tsx
<GradientBackground type="organic" />
```

## Usage

### Basic Usage (Default Blob Gradient)

```tsx
import GradientBackground from './components/GradientBackground/GradientBackground';

function App() {
  return (
    <>
      <GradientBackground />
      {/* Your content here */}
    </>
  );
}
```

### Using Named Presets

```tsx
// Waves preset
<GradientBackground preset="waves" />

// Bold hero preset
<GradientBackground preset="hero-bold" />

// Card accent preset
<GradientBackground preset="card-accent" />
```

### Animated Preset

```tsx
<GradientBackground 
  preset="hero-bold" 
  animate={true}
  animationInterval={3000}
/>
```

### Organic Gradient with Random Configuration

```tsx
<GradientBackground type="organic" />
```

### Organic Gradient with Custom Configuration

```tsx
import GradientBackground, { OrganicGradientConfig } from './components/GradientBackground/GradientBackground';

const myGradientConfig: OrganicGradientConfig = {
  seed: 42,
  blurIntensity: 1.5,
  noiseScale: 2.5,
  grainIntensity: 0.2,
  iterations: 40,
  noiseAlgorithm: 'simplex',
  colors: [
    { color: '#000000', alpha: 1.0, threshold: 0.0 },
    { color: '#191a66', alpha: 1.0, threshold: 0.3 },
    { color: '#19ccc1', alpha: 0.8, threshold: 0.6 },
    { color: '#cc1980', alpha: 0.8, threshold: 0.85 },
  ],
};

function App() {
  return (
    <>
      <GradientBackground type="organic" config={myGradientConfig} />
      {/* Your content here */}
    </>
  );
}
```

### Using Gradient Playground Export

You can export configurations from the Gradient Playground and use them directly:

```tsx
import myGradient from './gradients/my-gradient.json';

function App() {
  return (
    <>
      <GradientBackground 
        type="organic" 
        config={myGradient.config} 
      />
      {/* Your content here */}
    </>
  );
}
```

### Animated Organic Gradient

```tsx
<GradientBackground 
  type="organic" 
  animate={true}
  animationInterval={3000}
/>
```

### Static Blob Gradient (No Animation)

```tsx
<GradientBackground 
  type="blob" 
  animate={false}
/>
```

## Props

### `type`
- **Type**: `'blob' | 'organic'`
- **Default**: `'blob'`
- **Description**: The type of gradient to render.

### `preset`
- **Type**: `GradientPresetName | undefined`
- **Default**: `undefined` (uses random preset if type is organic)
- **Description**: Preset name to load. Automatically converts theme tokens to colors. Available presets: `'waves'`, `'hero-bold'`, `'hero-abstract'`, `'card-accent'`, `'background-calm'`. Ignored if `config` is provided.

### `config`
- **Type**: `OrganicGradientConfig | undefined`
- **Default**: `undefined` (uses preset or randomized config)
- **Description**: Manual configuration object for the gradient. Only applicable for organic gradients. Takes priority over `preset`.

### `animate`
- **Type**: `boolean | undefined`
- **Default**: `true` for blob, `false` for organic
- **Description**: Whether to animate the gradient over time.

### `animationInterval`
- **Type**: `number`
- **Default**: `5000` (5 seconds)
- **Description**: Animation interval in milliseconds.

## OrganicGradientConfig

```typescript
interface OrganicGradientConfig {
  seed?: number;                    // Random seed (0-100)
  blurIntensity?: number;          // Blur strength (0-3)
  noiseScale?: number;             // Noise pattern scale (0.5-5)
  grainIntensity?: number;         // Grain texture intensity (0-0.5)
  iterations?: number;             // Render quality (10-100)
  colors?: ColorStop[];            // Array of color stops (2-8 colors)
  noiseAlgorithm?: NoiseAlgorithm; // 'value' | 'simplex' | 'perlin' | 'fbm'
}

interface ColorStop {
  color: string;    // Hex color (#RRGGBB)
  alpha: number;    // Opacity (0.0-1.0)
  threshold: number; // When this color appears (0.0-1.0)
}
```

## Examples

### Smooth Pastel Gradient

```tsx
<GradientBackground 
  type="organic"
  config={{
    seed: 12,
    blurIntensity: 2.0,
    noiseScale: 3.0,
    grainIntensity: 0.1,
    iterations: 50,
    noiseAlgorithm: 'simplex',
    colors: [
      { color: '#ffd6e7', alpha: 0.9, threshold: 0.0 },
      { color: '#c3b1e1', alpha: 0.85, threshold: 0.4 },
      { color: '#a7d3f0', alpha: 0.8, threshold: 0.7 },
    ],
  }}
/>
```

### Vibrant Animated Gradient

```tsx
<GradientBackground 
  type="organic"
  animate={true}
  animationInterval={4000}
  config={{
    seed: 0, // Will be animated
    blurIntensity: 1.2,
    noiseScale: 2.0,
    grainIntensity: 0.15,
    iterations: 35,
    noiseAlgorithm: 'fbm',
    colors: [
      { color: '#ff006e', alpha: 1.0, threshold: 0.0 },
      { color: '#fb5607', alpha: 0.9, threshold: 0.3 },
      { color: '#ffbe0b', alpha: 0.85, threshold: 0.6 },
      { color: '#8338ec', alpha: 0.9, threshold: 0.85 },
    ],
  }}
/>
```

### Performance-Optimized Static Gradient

```tsx
<GradientBackground 
  type="organic"
  animate={false}
  config={{
    seed: 42,
    blurIntensity: 1.0,
    noiseScale: 2.0,
    grainIntensity: 0.12,
    iterations: 20, // Lower for better performance
    noiseAlgorithm: 'value',
    colors: [
      { color: '#1a1a2e', alpha: 1.0, threshold: 0.0 },
      { color: '#16213e', alpha: 1.0, threshold: 0.5 },
      { color: '#0f3460', alpha: 0.9, threshold: 0.8 },
    ],
  }}
/>
```

## Preset System

### Why Use Presets?

Presets provide theme-aware gradients with **zero boilerplate**:
- ✅ No JSON imports needed
- ✅ No manual color configuration
- ✅ Automatic theme adaptation (light/dark)
- ✅ Type-safe preset names with autocomplete

### How Presets Work

1. Preset files use **theme tokens** instead of hardcoded colors
2. The component automatically resolves tokens to actual colors from your theme
3. Colors update automatically when theme changes
4. All configuration happens inside the component

### Priority Order

When you use the component, configuration is resolved in this order:

1. **Explicit `config`** prop → Uses your manual config (bypasses presets)
2. **Named `preset`** prop → Loads that preset and converts theme tokens
3. **No preset specified** → Loads a random preset automatically
4. **`type="blob"`** → Original blob gradient behavior

### Adding New Presets

1. Create a JSON file in `configs/gradients/frames/`:

```json
{
  "id": "my-gradient-001",
  "name": "My Gradient",
  "description": "A beautiful custom gradient",
  "config": {
    "seed": 42,
    "blurIntensity": 1.5,
    "noiseScale": 2.0,
    "grainIntensity": 0.15,
    "iterations": 30,
    "noiseAlgorithm": "simplex",
    "colorStops": [
      { "token": "primary-default", "alpha": 1.0, "threshold": 0.0 },
      { "token": "secondary-default", "alpha": 0.9, "threshold": 0.5 },
      { "token": "tertiary-default", "alpha": 0.85, "threshold": 0.8 }
    ]
  },
  "tags": ["custom", "branded"],
  "createdAt": "2025-12-08",
  "author": "Your Name"
}
```

2. Add to `configs/gradients/presets.ts`:

```typescript
import myGradient from './frames/my-gradient.json';

export const GRADIENT_PRESETS = {
  // ... existing presets
  'my-gradient': myGradient as GradientFrame,
} as const;
```

3. Use it:

```tsx
<GradientBackground preset="my-gradient" />
```

### Testing Presets

A demo page is available to visually test all presets:

```tsx
import GradientPresetsDemo from './pages/GradientPresetsDemo';

// Renders all available presets in a grid
<GradientPresetsDemo />
```

## Tips

1. **Performance**: Lower `iterations` (20-30) for better performance, especially on mobile devices.
2. **Smoothness**: Higher `iterations` (40-60) for smoother, more refined gradients.
3. **Noise Algorithms**:
   - `value`: Classic, fast, good for general use
   - `simplex`: Smooth, organic patterns
   - `perlin`: Natural-looking variations
   - `fbm`: Fractal detail, more complex patterns
4. **Color Thresholds**: Distribute thresholds evenly (0.0, 0.33, 0.66, 1.0) for balanced color mixing.
5. **Animation**: Use `animate={true}` with caution on organic gradients as WebGL animations can be resource-intensive.

## Browser Compatibility

- **Blob Gradient**: Works in all modern browsers
- **Organic Gradient**: Requires WebGL support (all modern browsers, IE11 with limitations)

