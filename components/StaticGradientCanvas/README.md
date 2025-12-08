# Static Gradient Canvas

A powerful, standalone React component for creating complex, artistic gradient backgrounds on HTML Canvas.

## Features

- **Static Rendering**: Renders exactly once when props change (no animations)
- **Multiple Shape Types**: Circles, rectangles, and triangles
- **Blend Modes**: Support for all standard canvas blend modes
- **Blur Effects**: Configurable blur filter applied to shapes
- **Grain/Noise**: Add texture with adjustable grain opacity
- **High DPI Support**: Automatically handles retina displays
- **Fully Configurable**: Control every aspect via props

## Usage

```tsx
import { StaticGradientCanvas } from './components/StaticGradientCanvas/StaticGradientCanvas';

function MyComponent() {
  return (
    <StaticGradientCanvas
      width={1200}
      height={800}
      backgroundColor="#1a1a2e"
      blendMode="screen"
      blur={80}
      grain={0.15}
      blobs={[
        {
          x: 0.3,
          y: 0.4,
          size: 300,
          color: '#ff6b6b',
          shape: 'circle',
          rotation: 0,
        },
        {
          x: 0.7,
          y: 0.6,
          size: 250,
          color: '#4ecdc4',
          shape: 'circle',
          rotation: 0,
        },
      ]}
    />
  );
}
```

## Props

### StaticGradientCanvasProps

| Prop | Type | Description |
|------|------|-------------|
| `width` | `number` | Canvas width in pixels |
| `height` | `number` | Canvas height in pixels |
| `backgroundColor` | `string` | Background color (any CSS color) |
| `blendMode` | `BlendMode` | Global blend mode for shapes |
| `blur` | `number` | Blur amount in pixels |
| `grain` | `number` | Grain opacity (0-1) or intensity (0-20) |
| `blobs` | `BlobConfig[]` | Array of shape configurations |

### BlobConfig

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | X position (0-1 for percentage or pixel value) |
| `y` | `number` | Y position (0-1 for percentage or pixel value) |
| `size` | `number` | Radius (circle) or width (rectangle/triangle) |
| `color` | `string` | Fill color (any CSS color) |
| `shape` | `ShapeType` | Shape type: 'circle', 'rectangle', or 'triangle' |
| `rotation` | `number` | Rotation in radians |

### Supported Blend Modes

- `source-over` (default)
- `multiply`
- `screen`
- `overlay`
- `darken`
- `lighten`
- `color-dodge`
- `color-burn`
- `hard-light`
- `soft-light`
- `difference`
- `exclusion`
- `hue`
- `saturation`
- `color`
- `luminosity`

## Gradient Playground

Visit `/gradient-playground` to access an interactive playground where you can:

- Adjust canvas dimensions
- Change background colors
- Add/remove blobs
- Configure shape properties
- Test different blend modes
- Fine-tune blur and grain effects
- Export configurations as JSON

## Technical Details

### Coordinate System

- Values between 0-1 are treated as percentages of canvas dimensions
- Values > 1 are treated as absolute pixel values
- Example: `x: 0.5` = 50% of canvas width, `x: 500` = 500 pixels from left

### High DPI Rendering

The component automatically detects and compensates for `window.devicePixelRatio`, ensuring crisp rendering on retina displays without manual intervention.

### Performance

- Static rendering (no animation loop)
- Re-renders only when props change
- Efficient canvas operations
- Grain generation uses off-screen canvas

## Examples

### Soft Pastel Gradient

```tsx
<StaticGradientCanvas
  width={1920}
  height={1080}
  backgroundColor="#fef5e7"
  blendMode="multiply"
  blur={120}
  grain={0.05}
  blobs={[
    { x: 0.2, y: 0.3, size: 400, color: '#ffd7e4', shape: 'circle', rotation: 0 },
    { x: 0.8, y: 0.7, size: 350, color: '#d4e4ff', shape: 'circle', rotation: 0 },
    { x: 0.5, y: 0.5, size: 300, color: '#fff4d7', shape: 'circle', rotation: 0 },
  ]}
/>
```

### Bold Geometric

```tsx
<StaticGradientCanvas
  width={1200}
  height={800}
  backgroundColor="#000000"
  blendMode="difference"
  blur={40}
  grain={0.2}
  blobs={[
    { x: 0.3, y: 0.5, size: 200, color: '#ff0000', shape: 'rectangle', rotation: Math.PI / 4 },
    { x: 0.7, y: 0.5, size: 180, color: '#00ff00', shape: 'triangle', rotation: 0 },
    { x: 0.5, y: 0.3, size: 160, color: '#0000ff', shape: 'circle', rotation: 0 },
  ]}
/>
```

## Exporting Configurations

The playground allows you to export your gradient configurations as JSON. These can be loaded programmatically:

```tsx
import config from './my-gradient.json';

<StaticGradientCanvas {...config} />
```
