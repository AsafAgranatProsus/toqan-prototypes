# Quick Start: Gradient Playground

## Access the Playground

Navigate to: **`/gradient-playground`**

## File Structure

```
components/
  StaticGradientCanvas/
    ├── StaticGradientCanvas.tsx  # Main component (single file, portable)
    ├── index.ts                  # Clean exports
    └── README.md                 # Full documentation

pages/
  ├── GradientPlaygroundPage.tsx  # Interactive playground UI
  ├── GradientPlaygroundPage.css  # Styling
  └── index.ts                    # Updated with export

App.tsx                           # Updated with new route

docs/
  └── GRADIENT_PLAYGROUND.md      # Complete implementation guide
```

## Using the Component Directly

```tsx
import { StaticGradientCanvas } from './components/StaticGradientCanvas';

<StaticGradientCanvas
  width={1200}
  height={800}
  backgroundColor="#1a1a2e"
  blendMode="screen"
  blur={80}
  grain={0.15}
  blobs={[
    {
      x: 0.3,      // 30% from left
      y: 0.4,      // 40% from top
      size: 300,   // 300px radius
      color: '#ff6b6b',
      shape: 'circle',
      rotation: 0
    }
  ]}
/>
```

## Playground Features

### Canvas Controls
- **Width**: 400-2000px
- **Height**: 300-1500px
- **Background Color**: Color picker + hex input

### Effects
- **Blend Mode**: 16 options (screen, multiply, overlay, difference, etc.)
- **Blur**: 0-200px
- **Grain**: 0-1 (opacity/intensity)

### Blob Controls (per blob)
- **Color**: Visual picker + hex input
- **Shape**: Circle, Rectangle, Triangle
- **Position**: X/Y sliders (0-100%)
- **Size**: 50-800px
- **Rotation**: 0-360°

### Actions
- **Add Blob**: Create new shapes
- **Remove Blob**: Delete shapes (min 1)
- **Export Config**: Download as JSON

## Key Features

✅ Static rendering (no animations)
✅ High DPI support (retina displays)
✅ All standard canvas blend modes
✅ Multiple shape geometries
✅ Grain/noise effects
✅ Full TypeScript support
✅ Portable single-file component
✅ Responsive UI
✅ Export/import configurations

## Notes

- The route is configured as **standalone** (no feature menu, customization panel, or theme debugger)
- Coordinates can be percentages (0-1) or pixels (>1)
- Rotation is in radians (UI shows degrees)
- Grain can be opacity (0-1) or intensity (0-20)
- All changes are reflected in real-time
- Canvas automatically handles device pixel ratio for crisp rendering
