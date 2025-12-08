# Bokeh Gradient Component

## Overview

A WebGL-based gradient component that creates a beautiful variable blur effect using the Golden Angle sampling technique to simulate a bokeh (depth-of-field) effect.

## Component Details

**Location:** `components/BokehGradient/BokehGradient.tsx`

### Features

- **Variable Blur Effect**: Blur intensity varies based on position (sharp at top, blurred at bottom)
- **Golden Angle Sampling**: Uses spiral sampling pattern (2.399 radians) to prevent artifacts
- **Procedural Scene**: Generates a grid of animated circles as the base content
- **Real-time Animation**: Colors evolve over time using cosine-based color generation
- **GPU Accelerated**: Full WebGL shader implementation for high performance

## Technical Implementation

### Shader Components

#### Vertex Shader
Simple pass-through shader that covers the entire viewport with a triangle.

#### Fragment Shader
Contains the main bokeh blur algorithm with two key parts:

1. **Scene Generation** (`getSceneColor`)
   - Creates a 10x10 grid of circles
   - Animated color palette using cosine waves
   - Time-based color evolution

2. **Golden Angle Bokeh Blur**
   - Blur mask: exponential falloff from top to bottom
   - 30 iterations of spiral sampling
   - Golden angle prevents regular sampling artifacts
   - Aspect-ratio corrected blur

### Key Parameters

```glsl
#define ITERATIONS 30.0  // Number of blur samples (higher = smoother)
float goldenAngle = 2.39996323;  // Golden angle in radians
float radius = 0.04 * blurMask;  // Maximum blur radius
```

### Blur Mask Function

```glsl
float blurMask = 1.0 - uv.y;      // Linear gradient
blurMask = pow(blurMask, 3.0);    // Exponential for drama
```

**Result:**
- Top of screen (y=1.0): Sharp, no blur
- Bottom of screen (y=0.0): Maximum blur
- Smooth exponential transition between

### Color Generation

```glsl
vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
```

Creates animated colors using:
- Cosine waves for smooth interpolation
- Time offset for animation
- Phase offsets (0, 2, 4) for RGB channels

## Visual Effect

### Blur Pattern
```
┌─────────────────────┐
│ ••••• Sharp •••••   │  ← Top: No blur
│ ••••• Sharp •••••   │
│                     │
│  •••• Medium ••••   │  ← Middle: Medium blur
│                     │
│   ••• Blurry •••    │  ← Bottom: Heavy blur
│    •• Bokeh ••      │
└─────────────────────┘
```

### Scene Content
- 10×10 grid of circles
- Each circle smoothly antialiased
- Color shifts over time
- Bokeh effect varies by vertical position

## Usage in Gradient Playground

Navigate to `/gradient-playground` and select **"Bokeh Gradient (WebGL)"** from the dropdown.

### What You'll See:
1. **Grid of colored circles** arranged in a 10×10 pattern
2. **Animated colors** that evolve smoothly over time
3. **Variable blur** - sharp at the top, increasingly blurred toward the bottom
4. **Bokeh effect** - the blur creates a dreamy, depth-of-field appearance

## Performance

- **30 texture samples per pixel** (configurable via ITERATIONS)
- GPU-accelerated sampling and blending
- Real-time rendering at 60fps on modern hardware
- Responsive to container resize using ResizeObserver

## Customization Potential

The component can be extended with controls for:

### Blur Parameters
- `ITERATIONS` - Quality vs performance (10-100)
- `radius` - Maximum blur size (0.01-0.1)
- Blur mask function - Where blur occurs

### Blur Mask Options
```glsl
// Current: Top-to-bottom gradient
float blurMask = 1.0 - uv.y;

// Alternative: Center focus (radial)
float blurMask = length(uv - 0.5);

// Alternative: Horizontal gradient
float blurMask = 1.0 - uv.x;

// Alternative: Circular vignette
float blurMask = smoothstep(0.3, 0.8, length(uv - 0.5));
```

### Scene Customization
- Grid density (currently 10×10)
- Circle size and smoothness
- Color scheme and animation speed
- Pattern type (circles, squares, custom shapes)

## Mathematical Details

### Golden Angle Spiral Sampling

The Golden Angle (≈137.5°) creates an evenly distributed spiral pattern:

```glsl
float theta = i * goldenAngle;  // Angle
float r = sqrt(i) / sqrt(ITERATIONS);  // Radius (Vogel spiral)
vec2 offset = vec2(cos(theta), sin(theta)) * r * radius;
```

**Why Golden Angle?**
- Prevents regular patterns that cause aliasing
- Creates uniform distribution of samples
- Mimics natural bokeh from camera lenses

### Aspect Ratio Correction

```glsl
offset.x /= aspect.x;
```

Prevents blur from being stretched on non-square displays.

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

1. ✅ `components/BokehGradient/BokehGradient.tsx`
2. ✅ `components/BokehGradient/index.ts`
3. ✅ `pages/GradientPlaygroundPage.tsx` (updated)

## Comparison with Other Gradients

| Feature | Static Gradient | Noise Gradient | Bokeh Gradient |
|---------|----------------|----------------|----------------|
| Rendering | Canvas 2D | WebGL Shader | WebGL Shader |
| Animation | Static | Animated | Animated |
| Technique | Shape blending | Simplex noise | Variable blur |
| Controls | Full UI | None | None |
| Blur | Global uniform | None | Spatial variable |
| Effect | Artistic blobs | Organic flow | Depth-of-field |

## Future Enhancements

Potential additions:
- **Blur mask selector** (linear, radial, custom)
- **Iteration count slider** (quality control)
- **Blur radius control**
- **Scene selector** (circles, image upload, custom patterns)
- **Color palette picker**
- **Animation speed control**
- **Focus point selector** (interactive blur center)
- **Export as image/video**

## Technical Notes

- Uses single-pass blur (all samples in fragment shader)
- No multi-pass rendering or framebuffers
- Accumulates color samples and averages
- Efficient for real-time rendering
- Can be adapted for actual image blur (replace `getSceneColor` with texture sampling)
