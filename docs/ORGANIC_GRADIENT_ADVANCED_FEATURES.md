# OrganicGradient Advanced Features

## Overview

The `OrganicGradient` component has been enhanced with powerful dynamic features:
- **Dynamic Color Management**: Add/remove colors (2-8 colors)
- **Alpha Blending**: Per-color opacity control
- **Multiple Noise Algorithms**: 4 different noise patterns
- **Threshold-based Color Mixing**: Control when colors appear

---

## Features

### 1. Dynamic Color System

#### Add/Remove Colors
- **Minimum**: 2 colors
- **Maximum**: 8 colors
- **Dynamic**: Colors can be added/removed at runtime
- Each color is independent with its own properties

#### Color Properties

```typescript
interface ColorStop {
  color: string;      // Hex color (e.g., '#ff00ff')
  alpha: number;      // Opacity 0.0-1.0
  threshold: number;  // When color appears 0.0-1.0
}
```

**Color**: Hex color value  
**Alpha**: Transparency (0 = transparent, 1 = opaque)  
**Threshold**: Noise value where this color appears (0 = always, 1 = peaks only)

### 2. Noise Algorithms

Four different algorithms produce unique visual patterns:

| Algorithm | Description | Characteristics |
|-----------|-------------|-----------------|
| **Value** | Classic noise | Blocky, grid-like, retro aesthetic |
| **Simplex** | Improved Perlin | Very smooth, organic, no directional artifacts |
| **Perlin** | Natural noise | Smooth, natural terrain-like patterns |
| **FBM** | Fractal Brownian Motion | Layered, detailed, cloud-like |

#### Visual Comparison

- **Value**: Best for retro/pixelated aesthetic
- **Simplex**: Best for smooth gradients and organic shapes
- **Perlin**: Best for natural textures (marble, clouds)
- **FBM**: Best for complex, detailed patterns

### 3. Color Mixing Algorithm

Colors are mixed based on noise values and thresholds:

```glsl
// Start with base color (threshold 0.0)
vec4 finalColor = colors[0];

// Mix in colors based on their thresholds
for (each color) {
  float transition = smoothstep(
    threshold - 0.1,
    threshold + 0.1,
    noiseValue
  );
  finalColor = mix(finalColor, color, transition * color.alpha);
}
```

**How it works:**
1. Noise generates values 0.0-1.0 across the canvas
2. Each color has a threshold (e.g., 0.3, 0.6, 0.85)
3. When noise reaches a threshold, that color blends in
4. Alpha controls how strongly the color blends
5. Smooth transitions between colors (smoothstep)

---

## Usage

### Basic Setup

```tsx
import { OrganicGradient, ColorStop } from '../components/OrganicGradient';

const colors: ColorStop[] = [
  { color: '#000000', alpha: 1.0, threshold: 0.0 },  // Base (always visible)
  { color: '#191a66', alpha: 1.0, threshold: 0.3 },  // Dark blue at 30%
  { color: '#19ccc1', alpha: 0.8, threshold: 0.6 },  // Cyan at 60% (80% opacity)
  { color: '#cc1980', alpha: 0.8, threshold: 0.85 }, // Magenta peaks (80% opacity)
];

<OrganicGradient
  seed={42}
  blurIntensity={1.0}
  noiseScale={2.0}
  grainIntensity={0.15}
  iterations={30}
  colors={colors}
  noiseAlgorithm="simplex"
/>
```

### Adding Colors Dynamically

```tsx
const [colors, setColors] = useState<ColorStop[]>([...]);

// Add a new color
const addColor = () => {
  const newThreshold = colors.length > 0 
    ? Math.min(colors[colors.length - 1].threshold + 0.2, 1.0)
    : 0.0;
    
  setColors([
    ...colors,
    { color: '#ff00ff', alpha: 0.8, threshold: newThreshold }
  ]);
};

// Remove a color
const removeColor = (index: number) => {
  setColors(colors.filter((_, i) => i !== index));
};

// Update a color
const updateColor = (index: number, updates: Partial<ColorStop>) => {
  const newColors = [...colors];
  newColors[index] = { ...newColors[index], ...updates };
  setColors(newColors);
};
```

---

## Props API

```typescript
interface OrganicGradientProps {
  seed?: number;                    // Pattern variation (0-100)
  blurIntensity?: number;           // Bokeh strength (0-3)
  noiseScale?: number;              // Blob size (0.5-5)
  grainIntensity?: number;          // Texture (0-0.5)
  iterations?: number;              // Blur quality (10-100)
  colors?: ColorStop[];             // Color palette (2-8 colors)
  noiseAlgorithm?: NoiseAlgorithm;  // 'value' | 'simplex' | 'perlin' | 'fbm'
}
```

### Default Values

```typescript
{
  seed: 0,
  blurIntensity: 1.0,
  noiseScale: 2.0,
  grainIntensity: 0.15,
  iterations: 30,
  colors: [
    { color: '#000000', alpha: 1.0, threshold: 0.0 },
    { color: '#191a66', alpha: 1.0, threshold: 0.3 },
    { color: '#19ccc1', alpha: 0.8, threshold: 0.6 },
    { color: '#cc1980', alpha: 0.8, threshold: 0.85 },
  ],
  noiseAlgorithm: 'value'
}
```

---

## Technical Implementation

### WebGL Shader Architecture

**Vertex Shader**: Standard fullscreen quad  
**Fragment Shader**: Multiple noise functions + dynamic color mixing

#### Uniforms

```glsl
uniform vec2 u_resolution;       // Canvas size
uniform float u_seed;            // Random seed
uniform float u_blurIntensity;   // Blur strength
uniform float u_noiseScale;      // Noise frequency
uniform float u_grainIntensity;  // Grain amount
uniform float u_iterations;      // Blur samples
uniform int u_noiseType;         // 0-3 (algorithm)
uniform int u_colorCount;        // Number of colors
uniform vec4 u_colors[8];        // Color array (RGBA)
uniform float u_thresholds[8];   // Threshold array
```

#### Noise Functions

**Value Noise**: Grid-based interpolation  
**Simplex Noise**: Improved Perlin with no directional artifacts  
**Perlin Noise**: Classic gradient noise  
**FBM**: Multi-octave value noise (4 layers)

#### Color Mixing

1. Generate multiple noise layers
2. Combine with different weights
3. Map combined noise to 0-1 range
4. Iterate through colors by threshold
5. Smooth blend using smoothstep
6. Apply alpha for transparency

#### Blur Implementation

- **Golden Angle Sampling**: Prevents aliasing
- **Variable Radius**: Noise-driven blur mask
- **Aspect Correction**: Non-squashed blur
- **Alpha Blending**: Respects color opacity

---

## Performance

### Static Rendering
- **Single Frame**: Renders once, no animation loop
- **On-Demand**: Only re-renders when props change
- **GPU Accelerated**: All calculations on GPU
- **Efficient**: No CPU overhead after initial render

### Performance Tips

1. **Iterations**: Higher = slower but smoother
   - 10-30: Fast, good for preview
   - 30-50: Balanced quality
   - 50-100: High quality, slower

2. **Colors**: More colors = slightly more shader work
   - 2-4: Fastest
   - 5-8: Still fast, more complexity

3. **Noise Algorithm**:
   - Value: Fastest
   - Simplex/Perlin: Medium
   - FBM: Slowest (4x more calculations)

---

## UI Controls in Playground

### Noise Algorithm Selector
- Dropdown with 4 options
- Real-time preview on change

### Color Management
- Each color has its own card/section
- Color picker + hex input
- Alpha slider (0-1)
- Threshold slider (0-1)
- Remove button (min 2 colors)
- Add Color button (max 8 colors)

### Layout
- **Canvas**: Left side (responsive)
- **Controls**: Right side (scrollable panel)
- **Side-by-Side**: Full 2-column layout

---

## Examples

### Sunset Palette

```typescript
const sunset: ColorStop[] = [
  { color: '#0a0a0a', alpha: 1.0, threshold: 0.0 },   // Deep black
  { color: '#1a0a3a', alpha: 1.0, threshold: 0.2 },   // Dark purple
  { color: '#ff6b35', alpha: 0.9, threshold: 0.5 },   // Orange
  { color: '#f7b731', alpha: 0.7, threshold: 0.8 },   // Yellow
];
```

### Ocean Depths

```typescript
const ocean: ColorStop[] = [
  { color: '#001a33', alpha: 1.0, threshold: 0.0 },   // Deep blue
  { color: '#003d5c', alpha: 1.0, threshold: 0.3 },   // Ocean blue
  { color: '#1e8fb5', alpha: 0.8, threshold: 0.6 },   // Light blue
  { color: '#6dd5ed', alpha: 0.6, threshold: 0.85 },  // Cyan highlights
];
```

### Neon Cyberpunk

```typescript
const neon: ColorStop[] = [
  { color: '#0a0a0a', alpha: 1.0, threshold: 0.0 },   // Black
  { color: '#ff006e', alpha: 0.9, threshold: 0.4 },   // Hot pink
  { color: '#8338ec', alpha: 0.8, threshold: 0.6 },   // Purple
  { color: '#00f5ff', alpha: 0.7, threshold: 0.8 },   // Cyan
];
```

### Monochrome Smoke

```typescript
const smoke: ColorStop[] = [
  { color: '#000000', alpha: 1.0, threshold: 0.0 },   // Black
  { color: '#333333', alpha: 0.8, threshold: 0.3 },   // Dark gray
  { color: '#999999', alpha: 0.6, threshold: 0.6 },   // Gray
  { color: '#ffffff', alpha: 0.4, threshold: 0.9 },   // White
];
```

---

## Alpha Blending Behavior

### How Alpha Works

1. **Color Generation**: Each color has its alpha value
2. **Bokeh Blur**: Samples blend using alpha (pre-multiplied)
3. **Accumulation**: Colors accumulate weighted by alpha
4. **Normalization**: Final color divided by total alpha
5. **Output**: Result is opaque (alpha = 1.0)

### Transparency Effects

- **Low Alpha (0.2-0.5)**: Subtle color hints
- **Medium Alpha (0.5-0.8)**: Blended colors
- **High Alpha (0.8-1.0)**: Strong, opaque colors

### Layering Strategy

```typescript
// Base layer (always opaque)
{ color: '#000000', alpha: 1.0, threshold: 0.0 }

// Mid layers (semi-transparent for blending)
{ color: '#color1', alpha: 0.8, threshold: 0.3 }
{ color: '#color2', alpha: 0.7, threshold: 0.6 }

// Highlights (lower alpha for subtlety)
{ color: '#color3', alpha: 0.5, threshold: 0.9 }
```

---

## Best Practices

### Color Design

1. **Start with base**: Always have threshold 0.0 at full alpha
2. **Gradual thresholds**: Space them out (0.0, 0.3, 0.6, 0.85)
3. **Alpha hierarchy**: Lower alpha for higher thresholds
4. **Complementary colors**: Use color theory for harmony

### Noise Selection

- **Smooth gradients**: Simplex or Perlin
- **Detailed patterns**: FBM
- **Retro/pixel art**: Value
- **Natural textures**: Perlin with high noise scale

### Performance

- **Static use**: Perfect for backgrounds, hero sections
- **Interactive**: Re-renders are fast (GPU-based)
- **Responsive**: Auto-resizes with container
- **Export**: Can capture as image/texture

---

## Troubleshooting

### Colors not blending smoothly
- Increase iterations (30-50)
- Check threshold spacing (not too close)
- Use Simplex noise for smoothest results

### Pattern too busy
- Decrease noise scale
- Reduce number of colors
- Use higher thresholds for accent colors

### Performance issues
- Reduce iterations
- Use Value noise (fastest)
- Limit colors to 4-5

### WebGL not supported
- Component checks for WebGL support
- Falls back gracefully (shows error in console)
- Ensure modern browser

---

## Files Modified

- `components/OrganicGradient/OrganicGradient.tsx` - Main component
- `components/OrganicGradient/index.ts` - Exports types
- `pages/GradientPlaygroundPage.tsx` - UI controls
- `pages/GradientPlaygroundPage.css` - Styling

---

## Future Enhancements

- [ ] Preset color palettes
- [ ] Color animation/transitions
- [ ] Export configuration as JSON
- [ ] Import color stops from image
- [ ] Gradient preview thumbnails
- [ ] Undo/redo for color changes
- [ ] Color harmony suggestions
- [ ] Real-time collaboration

---

*Last Updated: December 2025*
