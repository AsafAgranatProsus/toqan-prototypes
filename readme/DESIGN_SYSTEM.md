# Toqan Design System Architecture

## Overview

The Toqan design system uses a **two-layer architecture** that separates:
1. **Design System** (old/current mockup vs. new/live Toqan) - controlled by feature flag
2. **Theme Mode** (light vs. dark) - user preference

This allows us to:
- ✅ Systematize the existing mockup design with proper tokens
- ✅ Prepare for migrating to the new live Toqan design
- ✅ Keep both designs intact and switchable via feature flag
- ✅ Maintain light/dark theme switching across both designs

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FEATURE FLAG                             │
│                  (newBranding: bool)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
   ┌────▼─────┐             ┌──────▼──────┐
   │ OLD      │             │ NEW         │
   │ DESIGN   │             │ DESIGN      │
   └────┬─────┘             └──────┬──────┘
        │                          │
   ┌────┴─────┐             ┌──────┴──────┐
   │  Light   │             │   Light     │
   │  Dark    │             │   Dark      │
   └──────────┘             └─────────────┘
```

## File Structure

```
/toqan-ui-prototypes
├── tokens.css                        # All design tokens (OLD + NEW)
├── context/
│   ├── DesignSystemContext.tsx      # Manages both layers
│   ├── FeatureFlagContext.tsx       # Controls design system switch
│   └── ThemeContext.tsx             # ⚠️ DEPRECATED - use DesignSystemContext
├── components/                       # Components use tokens via CSS vars
└── DESIGN_SYSTEM.md                 # This file
```

## Token Organization

### tokens.css Structure

```css
/* 1. Design-Agnostic Tokens (never change) */
:root {
  --space-*        /* Spacing scale */
  --font-family-*  /* Font families */
  --z-*           /* Z-index scale */
  /* ... */
}

/* 2. OLD Design System - Light Mode (default) */
:root {
  --color-primary-default: #4426d9;
  --color-ui-background: #F9FAFB;
  /* ... */
}

/* 3. OLD Design System - Dark Mode */
.theme-dark:not(.design-new) {
  --color-primary-default: #5B8FFF;
  --color-ui-background: #0A0A0B;
  /* ... */
}

/* 4. NEW Design System - Light Mode */
.design-new {
  --color-primary-default: hsl(250 70% 50%);
  --color-ui-background: hsl(212 45% 98%);
  /* ... */
}

/* 5. NEW Design System - Dark Mode */
.design-new.theme-dark {
  --color-primary-default: hsl(250 70% 60%);
  --color-ui-background: hsl(212 45% 8%);
  /* ... */
}

/* 6. Legacy Support (backward compatibility) */
:root {
  --theme-bg-app: var(--color-ui-background);
  --border-radius-md: var(--radius-default);
  /* ... mappings for gradual migration */
}
```

## Usage

### Feature Flag Control

```typescript
// featureFlags.ts
export const featureFlags = {
  newBranding: false,  // false = OLD design, true = NEW design
  // ...
};
```

### Using Design System in Components

```typescript
import { useDesignSystem } from '../context/DesignSystemContext';

function MyComponent() {
  const { designSystem, themeMode, toggleTheme, isDark, isNewDesign } = useDesignSystem();
  
  return (
    <div>
      <p>Current Design: {designSystem}</p>
      <p>Theme Mode: {themeMode}</p>
      <button onClick={toggleTheme}>
        Toggle {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

### Using Tokens in CSS

```css
/* Component CSS files */
.my-component {
  /* Use semantic tokens - they adapt automatically */
  background-color: var(--color-ui-background);
  color: var(--color-text-default);
  padding: var(--space-4);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-default);
}

/* ✅ This works for BOTH old and new designs, light and dark modes */
```

## Token Categories

### Colors

| Token Pattern | Purpose | Example |
|--------------|---------|---------|
| `--color-primary-*` | Primary brand colors | `--color-primary-default` |
| `--color-ui-*` | UI element colors | `--color-ui-background` |
| `--color-text-*` | Text colors | `--color-text-default` |
| `--color-error-*` | Error states | `--color-error-default` |
| `--color-warning-*` | Warning states | `--color-warning-default` |
| `--color-success-*` | Success states | `--color-success-default` |
| `--color-info-*` | Info states | `--color-info-default` |

### Spacing

**Base scale: 8px (0.5rem) with consistent multipliers**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem (4px) | Minimal gaps |
| `--space-2` | 0.5rem (8px) | Small gaps |
| `--space-3` | 0.75rem (12px) | Default gaps |
| `--space-4` | 1rem (16px) | Standard spacing |
| `--space-6` | 1.5rem (24px) | Medium spacing |
| `--space-8` | 2rem (32px) | Large spacing |
| `--space-10` | 2.5rem (40px) | Extra large spacing |
| `--space-12` | 3rem (48px) | Section spacing |
| `--space-16` | 4rem (64px) | Major sections |
| `--space-20` | 5rem (80px) | Hero spacing |
| `--space-24` | 6rem (96px) | Large hero spacing |
| `--space-32` | 8rem (128px) | Extra large layout |
| `--space-40` | 10rem (160px) | Massive spacing |
| `--space-48` | 12rem (192px) | Maximum spacing |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem | Small elements |
| `--radius-default` | 0.5rem | Default |
| `--radius-md` | 0.75rem | Medium elements |
| `--radius-lg` | 1rem | Large elements |
| `--radius-xl` | 2rem | Extra large |
| `--radius-full` | 9999px | Pills, circles |

### Typography

**Modular scale: 1.333 ratio (perfect fourth) for dramatic hierarchy**

| Token | Value | Usage |
|-------|-------|-------|
| `--font-size-body-xs` | 0.75rem (12px) | Very small text |
| `--font-size-body-sm` | 0.875rem (14px) | Small text |
| `--font-size-body-md` | 1rem (16px) | Body text |
| `--font-size-body-lg` | 1.125rem (18px) | Large body text |
| `--font-size-heading-xs` | 1rem (16px) | Smallest headings |
| `--font-size-heading-sm` | 1.333rem (21px) | Small headings |
| `--font-size-heading-md` | 1.777rem (28px) | Medium headings |
| `--font-size-heading-lg` | 2.369rem (38px) | Large headings |
| `--font-size-heading-xl` | 3.157rem (51px) | Extra large headings |
| `--font-size-heading-2xl` | 4.209rem (67px) | Hero headings |
| `--font-weight-regular` | 400 | Normal text |
| `--font-weight-medium` | 500 | Medium weight |
| `--font-weight-semibold` | 600 | Semi-bold |
| `--font-weight-bold` | 700 | Bold text |

### Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle shadows |
| `--shadow-default` | Standard shadow |
| `--shadow-md` | Medium elevation |
| `--shadow-lg` | High elevation |
| `--shadow-modal` | Modal overlays |

## Migration Path

### Phase 1: Token Foundation ✅ DONE
- [x] Create `tokens.css` with both OLD and NEW designs
- [x] Create `DesignSystemContext` for two-layer management
- [x] Update import in `styles.css`
- [x] Add legacy token mappings for backward compatibility

### Phase 2: Component Refactoring (NEXT)
- [ ] Update components to use new tokens (starting with most-used)
- [ ] Replace hardcoded values with token references
- [ ] Test both designs (old/new) in both themes (light/dark)

### Phase 3: Remove Legacy Support
- [ ] Remove `--theme-*` token mappings
- [ ] Remove `ThemeContext.tsx` (use `DesignSystemContext` only)
- [ ] Clean up hardcoded values

### Phase 4: Showcase/Storybook
- [ ] Create `/showcase` route
- [ ] Build component gallery
- [ ] Build token documentation page
- [ ] Add interactive examples

## Testing Checklist

When making changes, ensure all 4 combinations work:

- [ ] OLD Design + Light Mode
- [ ] OLD Design + Dark Mode  
- [ ] NEW Design + Light Mode (requires `newBranding: true`)
- [ ] NEW Design + Dark Mode (requires `newBranding: true`)

## Best Practices

### DO ✅
- Use semantic token names (`--color-ui-background` not `--bg-gray`)
- Use tokens consistently across all components
- Test both designs and both themes
- Document any new tokens

### DON'T ❌
- Hardcode color values (`#4426d9`) - use tokens
- Hardcode spacing values (`12px`) - use tokens
- Mix old and new token naming
- Skip testing in all 4 combinations

## Frequently Asked Questions

**Q: How do I switch between old and new designs?**  
A: Toggle `newBranding` flag in `featureFlags.ts`

**Q: How do users switch between light and dark themes?**  
A: They use the theme toggle button - it persists to localStorage

**Q: Can I use both old `--theme-*` and new `--color-*` tokens?**  
A: Yes, temporarily. The old tokens map to new ones for backward compatibility.

**Q: Which tokens should I use in new components?**  
A: Always use the new `--color-*`, `--radius-*`, `--space-*` pattern.

**Q: What happens if I forget to test in all 4 combinations?**  
A: Components may break when switching designs or themes. Always test all combos!

## Resources

- [Live Toqan Design System](https://toqan.ai) - Reference for new design values
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Design Tokens (W3C)](https://design-tokens.github.io/community-group/format/)

