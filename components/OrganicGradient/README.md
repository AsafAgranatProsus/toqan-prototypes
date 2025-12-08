# Organic Gradient Component

## Overview

A WebGL-based static gradient component that creates organic, noise-driven bokeh effects with a single render. This component combines noise-based color generation with variable blur to create natural, artistic backgrounds.

## Component Details

**Location:** `components/OrganicGradient/OrganicGradient.tsx`

### Features

- **Static Rendering**: Renders once when mounted or when seed changes (no animation loop)
- **Noise-Based Colors**: Uses layered noise functions to create organic color patterns
- **Variable Blur with Noise Mask**: Blur intensity determined by noise, creating organic focus areas
- **Golden Angle Sampling**: 30 iterations of spiral bokeh sampling
- **Grain Effect**: Static noise grain overlay for texture
- **Seed-Based**: Deterministic output based on seed prop
- **GPU Accelerated**: Full WebGL shader implementation

## Technical Implementation

### Shader Components

#### Vertex Shader
Simple pass-through shader covering the viewport.

#### Fragment Shader
Contains noise generation, color mixing, and bokeh blur:

1. **Noise Functions**
   - `random()` - Pseudo-random number generator
   - `noise()` - 2D value noise with bilinear interpolation

2. **Scene Generation** (`getSceneColor`)
   - Layered noise (n1, n2) for complexity
   - Four-color palette mixing
   - Seed-based variation (not time-based)

3. **Focus Mask (Noise-Based Blur)**
   - Uses noise to determine blur intensity per pixel
   - Creates organic, irregular focus areas
   - Stronger blur in unfocused regions

4. **Golden Angle Bokeh**
   - Same spiral sampling as BokehGradient
   - 30 iterations per pixel
   - Applied with noise-driven variable radius

5. **Static Grain**
   - Frozen noise overlay
   - Seed-based (doesn't animate)
   - Adds texture and depth

### Key Parameters

```glsl
#define ITERATIONS 30.0         // Bokeh sampling iterations
float goldenAngle = 2.39996323; // Spiral angle
float blurRadius = (1.0 - focusVal) * 0.05; // Max blur
float grain = (random(uv + u_seed) - 0.5) * 0.15; // Grain strength
```

### Color Palette

```glsl
vec3 colorA = vec3(0.0, 0.0, 0.0);  // Black
vec3 colorB = vec3(0.1, 0.8, 0.7);  // Cyan
vec3 colorC = vec3(0.8, 0.1, 0.5);  // Magenta
vec3 colorD = vec3(0.1, 0.1, 0.4);  // Deep Blue
```

Colors are mixed based on two noise layers (n1, n2) creating complex, organic patterns.

### Noise-Based Blur Mask

```glsl
float focusNoise = noise(uv * 1.5 + u_seed * 0.1);
float focusVal = smoothstep(0.4, 0.6, focusNoise);
float blurRadius = (1.0 - focusVal) * 0.05;
```

**Result:**
- High noise values → Sharp focus
- Low noise values → Heavy blur
- Smooth transitions create organic patterns
- Irregular, natural-looking bokeh

## Visual Effect

### Focus Pattern
```
┌─────────────────────────────┐
│  ••     Sharp    ••         │  High noise
│    •••        •••           │
│       Blur                  │  Low noise
│  ••              Blur   ••  │
│    •••  Sharp  •••          │  High noise
│          ••                 │
└─────────────────────────────┘
Organic, noise-driven focus areas
```

### Color Distribution
- **Dark base** from colorA and colorD
- **Cyan highlights** (colorB) in mid-noise regions
- **Magenta accents** (colorC) where noise layers overlap
- **Smooth blending** via smoothstep functions

## Props Interface

```typescript
interface OrganicGradientProps {
  seed?: number; // Controls variation (default: 0)
}
```

### Seed Behavior
- **Same seed** = Same output (deterministic)
- **Different seeds** = Different patterns
- **Static** = No animation, renders once
- **Re-renders** only when seed changes

## Usage in Gradient Playground

Navigate to `/gradient-playground` and select **"Organic Gradient (WebGL)"**.

### What You'll See:
1. **Organic color blobs** with cyan and magenta tones
2. **Variable blur** creating depth-of-field effect
3. **Irregular focus areas** driven by noise
4. **Static grain** texture overlay
5. **No animation** - single render

## Performance

- **One-time render**: No animation loop (very efficient!)
- **30 samples per pixel**: Only computed once
- **Static grain**: Doesn't regenerate
- **Container-based sizing**: Uses ResizeObserver
- **Redraws only on**: Seed change or container resize

## Comparison with Other Gradients

| Feature | Static | Noise | Bokeh | Organic |
|---------|--------|-------|-------|---------|
| **Rendering** | Canvas 2D | WebGL | WebGL | WebGL |
| **Animation** | Static | Animated | Animated | Static |
| **Blur Type** | Global uniform | None | Linear mask | Noise mask |
| **Color Gen** | Manual | Simplex noise | Cosine waves | Value noise |
| **Focus** | N/A | N/A | Top→Bottom | Noise-driven |
| **Grain** | Optional | None | None | Built-in |
| **Updates** | On prop change | Every frame | Every frame | On seed/resize |

## Use Cases

Perfect for:
- **Hero backgrounds** that don't animate
- **Static header/footer backgrounds**
- **Print-style designs**
- **Performance-critical pages** (renders once!)
- **Artistic backgrounds** with organic feel
- **Depth-of-field effects** without animation cost

## Customization Potential

The component can be extended with controls for:

### Blur Parameters
- `ITERATIONS` - Quality (10-100)
- `blurRadius` multiplier (0.01-0.1)
- Noise scale for focus mask (currently 1.5)
- Smoothstep thresholds (0.4, 0.6)

### Color Palette
- Four-color picker
- Color mixing thresholds
- Saturation/brightness controls
- Preset color schemes

### Noise Parameters
- Noise scale (affects blob size)
- Noise seed offset
- Number of noise layers
- Noise mixing functions

### Grain Effect
- Grain intensity (currently 0.15)
- Grain scale/frequency
- Optional grain animation
- Color vs monochrome grain

## Mathematical Details

### Value Noise (Bilinear)

```glsl
vec2 i = floor(st);  // Integer coordinates
vec2 f = fract(st);  // Fractional coordinates
vec2 u = f * f * (3.0 - 2.0 * f);  // Smooth interpolation

// Bilinear interpolation of four corners
return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
```

### Layered Noise

```glsl
float n1 = noise(pos + vec2(t, t * 0.5));          // Layer 1
float n2 = noise(pos + vec2(n1, n1) + offset);     // Layer 2 (domain warping)
```

**Domain Warping**: Second noise layer samples at positions influenced by the first, creating complex patterns.

### Color Mixing Strategy

```glsl
color = mix(colorA, colorD, smoothstep(0.0, 0.6, n1));         // Base
color = mix(color, colorB, smoothstep(0.3, 0.7, n2) * 0.6);    // Cyan layer
color = mix(color, colorC, smoothstep(0.4, 0.8, n1*n2) * 0.8); // Magenta highlights
```

Multiple smoothstep operations create soft transitions and prevent harsh edges.

## Browser Compatibility

**Requirements:**
- WebGL 1.0 support
- High precision floats (`highp`)
- Fragment shader loops (30 iterations)
- ResizeObserver API

**Fallback:**
- Console error if WebGL unavailable
- Graceful degradation (blank canvas)

## Files

1. ✅ `components/OrganicGradient/OrganicGradient.tsx`
2. ✅ `components/OrganicGradient/index.ts`
3. ✅ `pages/GradientPlaygroundPage.tsx` (updated)

## Advanced Techniques

### Domain Warping
The second noise layer uses the first noise as an offset:
```glsl
float n2 = noise(pos + vec2(n1, n1) + ...);
```
This creates more complex, organic patterns than simple noise layering.

### Noise-Driven Blur
Instead of a fixed gradient, blur is determined by noise:
```glsl
float focusNoise = noise(uv * 1.5 + u_seed * 0.1);
```
Creates irregular, natural-looking focus areas.

### Static Grain
Grain doesn't animate, saving GPU cycles:
```glsl
float grain = (random(uv + u_seed) - 0.5) * 0.15;
```
Seed ensures grain pattern changes with each variation.

## Future Enhancements

Potential additions:
- **Seed picker/randomizer** UI control
- **Color palette selector**
- **Blur intensity slider**
- **Noise scale control**
- **Download as image** (since it's static)
- **Multiple presets** with different seeds
- **Interactive focus points** (click to set seed)
- **Animation toggle** (optional time-based variation)

## Technical Notes

- **Single-pass rendering**: All effects in one shader
- **No framebuffers**: Direct to canvas
- **Deterministic**: Same seed = same result
- **Efficient**: Renders once, not every frame
- **Scalable**: Can increase ITERATIONS for quality since it's static
- **Portable**: Self-contained, can be adapted for image backgrounds
