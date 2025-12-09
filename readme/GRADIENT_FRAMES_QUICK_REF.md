# Gradient Frame System - Quick Reference

## 🚀 Quick Start

### 1. Create in Playground
```
Navigate to: /gradient-playground
Select: "Organic Gradient (WebGL)"
Adjust: Colors, seed, blur, etc.
Export: Click "📦 Export as Themed Frame"
```

### 2. Use in App
```tsx
import { ThemedGradient } from '../components/ThemedGradient';
import { useGradientFrame } from '../hooks/useGradientFrame';

const { frame } = useGradientFrame('hero-abstract-001');
return frame && <ThemedGradient frame={frame} />;
```

---

## 📦 Built-in Frames

| ID | Name | Tags | Use Case |
|----|------|------|----------|
| `hero-abstract-001` | Abstract Hero | hero, energetic | Landing pages |
| `hero-bold-001` | Bold Hero | hero, bold | Impactful headers |
| `background-calm-001` | Calm Background | background, calm | Content areas |
| `card-accent-001` | Card Accent | card, soft | Feature cards |
| `dynamic-waves-001` | Dynamic Waves | dynamic, waves | Modern hero |

---

## 🎨 Usage Patterns

### Specific Frame
```tsx
const { frame } = useGradientFrame('hero-abstract-001');
```

### Random by Tag
```tsx
const { frame } = useGradientFrame(['hero', 'energetic']);
```

### Random Any
```tsx
const { frame, refresh } = useGradientFrame();
```

---

## 🌈 Available Theme Tokens

**Primary:** `primary-default`, `primary-hover`, `primary-light`, `primary-background`  
**Secondary:** `secondary-default`, `secondary-hover`, `secondary-light`, `secondary-background`  
**Tertiary:** `tertiary-default`, `tertiary-hover`, `tertiary-light`, `tertiary-background`  
**Surface:** `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`  
**On Colors:** `on-primary`, `on-secondary`, `on-tertiary`, `on-surface`, `on-surface-variant`  
**UI:** `ui-background`, `ui-background-elevated`, `ui-border`, `ui-active`  
**Semantic:** `error`, `success`, `warning`, `info`  
**Text:** `text-default`, `text-secondary`, `text-tertiary`

---

## 📁 File Structure

```
src/
├── types/gradientFrame.ts           # Types
├── hooks/
│   ├── useThemeColors.ts            # Color resolution
│   └── useGradientFrame.ts          # Frame loading
├── components/
│   ├── OrganicGradient/             # Base gradient
│   └── ThemedGradient/              # Theme wrapper
└── configs/gradients/
    ├── registry.ts                  # Frame registry
    └── frames/*.json                # Frame files
```

---

## 🔧 API

### `useGradientFrame(idOrTags, options)`
```typescript
{
  frame: GradientFrame | null;
  refresh: () => void;
  isLoaded: boolean;
}
```

### `ThemedGradient` Props
```typescript
{
  frame: GradientFrame;
  className?: string;
  style?: React.CSSProperties;
}
```

---

## 🎯 Common Patterns

### Full-Page Background
```tsx
<ThemedGradient 
  frame={frame}
  style={{ position: 'fixed', inset: 0, zIndex: -1 }}
/>
```

### Card Background
```tsx
<div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
  <ThemedGradient 
    frame={frame}
    style={{ position: 'absolute', inset: 0, opacity: 0.3 }}
  />
  <div style={{ position: 'relative', zIndex: 1 }}>
    {/* Content */}
  </div>
</div>
```

---

## 📍 Routes

- **Playground:** `/gradient-playground` - Create & export frames
- **Demo:** `/gradient-frames-demo` - Browse & test frames
- **Docs:** See `docs/THEMED_GRADIENT_SYSTEM.md`

---

## ✅ Checklist

- [ ] Create gradient in playground
- [ ] Export as JSON
- [ ] Save to `configs/gradients/frames/`
- [ ] Register in `registry.ts`
- [ ] Import and use with `useGradientFrame()`
- [ ] Test in light & dark themes

---

*See full docs: `docs/THEMED_GRADIENT_SYSTEM.md`*
