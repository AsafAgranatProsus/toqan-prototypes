# GradientBackground - Quick Reference

## Import
```tsx
import GradientBackground, { type OrganicGradientConfig } from './components/GradientBackground';
```

## Basic Usage

### Default (Original behavior)
```tsx
<GradientBackground />
```

### Random Organic Gradient
```tsx
<GradientBackground type="organic" />
```

### Custom Organic Gradient
```tsx
<GradientBackground 
  type="organic" 
  config={{
    seed: 42,
    blurIntensity: 1.5,
    noiseScale: 2.0,
    grainIntensity: 0.15,
    iterations: 30,
    noiseAlgorithm: 'simplex',
    colors: [
      { color: '#191a66', alpha: 1.0, threshold: 0.0 },
      { color: '#19ccc1', alpha: 0.9, threshold: 0.5 },
      { color: '#cc1980', alpha: 0.85, threshold: 0.8 },
    ],
  }}
/>
```

### Animated
```tsx
<GradientBackground 
  type="organic" 
  animate={true}
  animationInterval={3000}
/>
```

## Props Quick Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'blob' \| 'organic'` | `'blob'` | Gradient type |
| `config` | `OrganicGradientConfig` | `undefined` | Configuration (randomizes if undefined) |
| `animate` | `boolean` | `true` (blob), `false` (organic) | Enable animation |
| `animationInterval` | `number` | `5000` | Animation interval in ms |

## Configuration Parameters

| Parameter | Range | Description |
|-----------|-------|-------------|
| `seed` | 0-100 | Random seed for pattern |
| `blurIntensity` | 0-3 | Blur strength |
| `noiseScale` | 0.5-5 | Noise pattern size |
| `grainIntensity` | 0-0.5 | Grain texture strength |
| `iterations` | 10-100 | Render quality (↑ = smoother) |
| `noiseAlgorithm` | See below | Noise pattern type |
| `colors` | 2-8 stops | Color palette |

### Noise Algorithms
- `'value'` - Classic, fast
- `'simplex'` - Smooth, organic
- `'perlin'` - Natural variations
- `'fbm'` - Fractal, detailed

## Color Stop Structure
```typescript
{
  color: string;    // Hex color '#RRGGBB'
  alpha: number;    // Opacity 0.0-1.0
  threshold: number; // When appears 0.0-1.0
}
```

## Performance Tips
- Use `iterations: 20-30` for better performance
- Use `iterations: 40-60` for higher quality
- Avoid animation on organic gradients for mobile
- Blob gradients are more performant than organic

## Common Presets

### Pastel Dream
```tsx
config={{
  seed: 12, blurIntensity: 2.0, noiseScale: 3.0,
  grainIntensity: 0.1, iterations: 50, noiseAlgorithm: 'simplex',
  colors: [
    { color: '#ffd6e7', alpha: 0.9, threshold: 0.0 },
    { color: '#c3b1e1', alpha: 0.85, threshold: 0.4 },
    { color: '#a7d3f0', alpha: 0.8, threshold: 0.7 },
  ],
}}
```

### Vibrant Sunset
```tsx
config={{
  seed: 7, blurIntensity: 1.2, noiseScale: 2.0,
  grainIntensity: 0.15, iterations: 35, noiseAlgorithm: 'fbm',
  colors: [
    { color: '#ff006e', alpha: 1.0, threshold: 0.0 },
    { color: '#fb5607', alpha: 0.9, threshold: 0.3 },
    { color: '#ffbe0b', alpha: 0.85, threshold: 0.6 },
    { color: '#8338ec', alpha: 0.9, threshold: 0.85 },
  ],
}}
```

### Ocean Depths
```tsx
config={{
  seed: 23, blurIntensity: 1.8, noiseScale: 2.5,
  grainIntensity: 0.12, iterations: 40, noiseAlgorithm: 'perlin',
  colors: [
    { color: '#001233', alpha: 1.0, threshold: 0.0 },
    { color: '#003566', alpha: 1.0, threshold: 0.3 },
    { color: '#0466c8', alpha: 0.9, threshold: 0.6 },
    { color: '#33a1fd', alpha: 0.85, threshold: 0.85 },
  ],
}}
```

## Utility Functions

```tsx
import { 
  gradientFrameToConfig,     // Convert playground exports
  generateRandomGradientConfig, // Generate random config
  validateGradientConfig,    // Validate config
} from './utils/gradientUtils';

// Use playground export
const config = gradientFrameToConfig(importedFrame);

// Generate random
const randomConfig = generateRandomGradientConfig(isDark);

// Validate
const errors = validateGradientConfig(config);
if (errors) console.error(errors);
```

## Demo & Examples

- **Demo Page:** `pages/GradientBackgroundDemoPage.tsx`
- **Examples:** `examples/GradientBackgroundExamples.tsx`
- **Docs:** `components/GradientBackground/README.md`

## Troubleshooting

**Gradient not showing?**
- Check z-index of content (should be > 0)
- Ensure parent container has height

**Performance issues?**
- Lower `iterations` to 20-30
- Use blob gradient instead
- Disable animation

**WebGL not working?**
- Check browser console for errors
- Verify WebGL is supported
- Try blob gradient as fallback

