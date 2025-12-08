# Gradient Playground - Component Selector Update

## Overview

Successfully added a component selector dropdown to the Gradient Playground, allowing users to switch between different gradient rendering techniques.

## Changes Made

### 1. New Component: NoiseGradient (WebGL)
**Location:** `components/NoiseGradient/NoiseGradient.tsx`

- WebGL-based animated gradient using Simplex Noise algorithm
- Real-time animation with shader-based rendering
- Responsive to container size using ResizeObserver
- Three-color gradient mixing with noise-based thresholds
- Optimized for container-based rendering (not full-screen)

**Features:**
- 3D Simplex Noise implementation in GLSL
- Animated time-based noise evolution
- Aspect-ratio-aware rendering
- Smooth color interpolation
- High-performance GPU rendering

### 2. New Component: BokehGradient (WebGL)
**Location:** `components/BokehGradient/BokehGradient.tsx`

- WebGL-based variable blur effect using Golden Angle sampling
- Simulates bokeh (depth-of-field) effect
- Procedural scene generation with animated circles
- Variable blur intensity (sharp top, blurred bottom)
- Optimized for container-based rendering

**Features:**
- Golden Angle spiral sampling (30 iterations)
- Variable blur mask with exponential falloff
- Animated color palette using cosine waves
- Aspect-ratio corrected blur
- GPU-accelerated real-time rendering

### 3. Updated: GradientPlaygroundPage
**Location:** `pages/GradientPlaygroundPage.tsx`

**New Features:**
- Component selector dropdown in header
- Conditional rendering based on selected component
- Conditional controls panel (only shows for Static Gradient)
- Three gradient options:
  1. **Static Gradient Canvas** - Canvas 2D with blend modes, blur, grain
  2. **Noise Gradient (WebGL)** - Animated WebGL shader-based gradient
  3. **Bokeh Gradient (WebGL)** - Variable blur with golden angle sampling

**Component Types:**
```typescript
type GradientComponentType = 'static-gradient' | 'noise-gradient' | 'bokeh-gradient';
```

### 4. Updated: CSS Styling
**Location:** `pages/GradientPlaygroundPage.css`

**New Styles:**
- `.component-selector` - Dropdown container styling
- `.component-select` - Styled select element
- `.noise-gradient-wrapper` - Container for WebGL canvas
- Dynamic grid layout adjustment using `:has()` selector
- Full-width layout when NoiseGradient is active

**Layout Behavior:**
- Static Gradient: Two-column layout (canvas + controls)
- Noise Gradient: Single-column full-width layout (no controls)
- Bokeh Gradient: Single-column full-width layout (no controls)

## User Interface

### Header Section
```
┌─────────────────────────────────────┐
│     Gradient Playground             │
│  Create beautiful gradient...       │
│                                     │
│  [Gradient Component ▼]             │
│  ├─ Static Gradient Canvas          │
│  ├─ Noise Gradient (WebGL)          │
│  └─ Bokeh Gradient (WebGL)          │
└─────────────────────────────────────┘
```

### Layout Variations

**Static Gradient Mode:**
```
┌─────────────────┬───────────┐
│                 │           │
│   Canvas with   │ Controls  │
│   Blobs         │ Panel     │
│                 │           │
└─────────────────┴───────────┘
```

**Noise Gradient Mode:**
```
┌─────────────────────────────┐
│                             │
│   Animated WebGL Gradient   │
│   (No controls)             │
│                             │
└─────────────────────────────┘
```

**Bokeh Gradient Mode:**
```
┌─────────────────────────────┐
│                             │
│   Variable Blur Effect      │
│   (No controls)             │
│                             │
└─────────────────────────────┘
```

## Technical Implementation

### NoiseGradient Component

**WebGL Setup:**
- Vertex shader: Simple pass-through covering screen
- Fragment shader: Simplex noise calculation per pixel
- Uniform variables: `u_resolution`, `u_time`
- Triangle strip covering entire viewport

**Noise Algorithm:**
- 3D Simplex Noise (Ian McEwen implementation)
- Noise scale: 3.0 (configurable)
- Time-based animation: `u_time * 0.1`
- Value remapping: [-1, 1] → [0, 1]

**Color Mixing:**
```glsl
vec3 colorA = vec3(0.1, 0.0, 0.3); // Deep Purple
vec3 colorB = vec3(0.0, 0.8, 0.9); // Cyan
vec3 colorC = vec3(0.9, 0.1, 0.4); // Pinkish Red
```

**Responsive Rendering:**
- Uses `ResizeObserver` instead of window resize events
- Adapts to parent container dimensions
- Proper cleanup on component unmount

### BokehGradient Component

**WebGL Setup:**
- Vertex shader: Simple pass-through covering screen
- Fragment shader: Golden angle blur sampling
- Uniform variables: `u_resolution`, `u_time`
- Triangle covering entire viewport

**Blur Algorithm:**
- Variable blur mask (exponential falloff)
- Golden Angle sampling (2.399 radians)
- 30 iterations per pixel
- Spiral sampling pattern prevents artifacts

**Scene Generation:**
- 10×10 grid of animated circles
- Cosine-based color animation
- Smooth antialiasing
- Time-based evolution

**Blur Behavior:**
```glsl
float blurMask = pow(1.0 - uv.y, 3.0);  // Exponential top-to-bottom
float radius = 0.04 * blurMask;         // Variable blur radius
```

**Color Animation:**
```glsl
vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
```

**Responsive Rendering:**
- Uses `ResizeObserver` for container-based sizing
- Adapts to parent container dimensions
- Aspect-ratio corrected blur
- Proper cleanup on component unmount

### Conditional Rendering Logic

```tsx
{selectedComponent === 'static-gradient' ? (
  <StaticGradientCanvas {...props} />
) : selectedComponent === 'noise-gradient' ? (
  <div className="noise-gradient-wrapper">
    <NoiseGradient />
  </div>
) : (
  <div className="noise-gradient-wrapper">
    <BokehGradient />
  </div>
)}

{selectedComponent === 'static-gradient' && (
  <div className="controls-panel">
    {/* Controls only shown for static gradient */}
  </div>
)}
```

## Files Modified

1. ✅ `components/NoiseGradient/NoiseGradient.tsx` (new)
2. ✅ `components/NoiseGradient/index.ts` (new)
3. ✅ `components/BokehGradient/BokehGradient.tsx` (new)
4. ✅ `components/BokehGradient/index.ts` (new)
5. ✅ `pages/GradientPlaygroundPage.tsx` (updated)
6. ✅ `pages/GradientPlaygroundPage.css` (updated)

## Browser Compatibility

### NoiseGradient Requirements:
- WebGL 1.0 support
- High precision floats in shaders
- ResizeObserver API

### BokehGradient Requirements:
- WebGL 1.0 support
- High precision floats in shaders
- Fragment shader loops (30 iterations)
- ResizeObserver API

**Fallback:**
- Console error if WebGL not supported
- Graceful degradation (blank canvas)

## Future Enhancements

Potential additions for NoiseGradient:
- Color picker controls
- Noise scale slider
- Animation speed control
- Noise type selector (Simplex, Perlin, Worley)
- Pause/play animation
- Multiple layers with different blend modes
- Export as video/GIF

Potential additions for BokehGradient:
- Blur mask selector (linear, radial, custom)
- Iteration count slider (quality control)
- Blur radius control
- Scene selector (circles, image upload, custom patterns)
- Color palette picker
- Animation speed control
- Focus point selector (interactive blur center)
- Export as image/video

## Usage

Navigate to `/gradient-playground` and:

1. **Select component** from dropdown
2. **Static Gradient:** Configure blobs, colors, blur, grain
3. **Noise Gradient:** Watch animated simplex noise gradient
4. **Bokeh Gradient:** Watch variable blur bokeh effect
5. **Switch between modes** to compare techniques

## Notes

- NoiseGradient is animated and auto-plays (simplex noise)
- BokehGradient is animated and auto-plays (variable blur)
- Static Gradient is static (renders once on prop change)
- Controls panel hidden when WebGL gradients are selected
- Layout automatically adjusts based on selected component
- All components are fully responsive
- No linting errors
- Hot module replacement working correctly
