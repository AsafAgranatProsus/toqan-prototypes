# Design System Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
│                                                                      │
│  Toggle Feature Flag          Toggle Theme Mode                     │
│  (newBranding)                (light/dark)                          │
│       │                             │                                │
│       ├─────────────────────────────┤                               │
│       │                             │                                │
│       ▼                             ▼                                │
│  ┌────────────────────────────────────────────────┐                │
│  │      DesignSystemContext                       │                │
│  │  • Reads feature flag                          │                │
│  │  • Manages theme mode                          │                │
│  │  • Applies classes to <body>                   │                │
│  └────────────────┬───────────────────────────────┘                │
│                   │                                                  │
└───────────────────┼──────────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   CSS Classes on     │
         │   document.body:     │
         │                      │
         │  .design-old         │ ◄── OR ──► .design-new
         │  .theme-light        │ ◄── OR ──► .theme-dark
         │  .old-toqan          │           .new-branding
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │    tokens.css        │
         │  CSS Custom Props    │
         │  Change Based On     │
         │  Body Classes        │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   All Components     │
         │   Use Tokens Via     │
         │   var(--token-name)  │
         └──────────────────────┘
```

## Token Cascade Flow

```
:root {                                    ← Base tokens (all designs)
  --space-4: 1rem;
  --font-family-default: 'Soehne';
}

:root {                                    ← OLD Design - Light (default)
  --color-primary-default: #4426d9;
  --color-ui-background: #F9FAFB;
}

.theme-dark:not(.design-new) {            ← OLD Design - Dark
  --color-primary-default: #5B8FFF;       ← Overrides root
  --color-ui-background: #0A0A0B;
}

.design-new {                              ← NEW Design - Light
  --color-primary-default: hsl(250 70% 50%);  ← Overrides root
  --color-ui-background: hsl(212 45% 98%);
}

.design-new.theme-dark {                   ← NEW Design - Dark
  --color-primary-default: hsl(250 70% 60%);  ← Overrides .design-new
  --color-ui-background: hsl(212 45% 8%);
}

/* Component uses token */
.button {
  background: var(--color-primary-default);  ← Gets value from cascade
}
```

## State Combinations

```
┌─────────────────────┬──────────────────┬──────────────────────────────┐
│  newBranding Flag   │   User Theme     │   Active CSS Classes         │
├─────────────────────┼──────────────────┼──────────────────────────────┤
│  false              │   light          │   .design-old .theme-light   │
│  false              │   dark           │   .design-old .theme-dark    │
│  true               │   light          │   .design-new .theme-light   │
│  true               │   dark           │   .design-new .theme-dark    │
└─────────────────────┴──────────────────┴──────────────────────────────┘

Each combination loads different token values from tokens.css
```

## Component Usage Pattern

```typescript
// ❌ OLD WAY (Hardcoded)
const Button = () => (
  <button style={{ 
    backgroundColor: '#4426d9',
    padding: '12px 16px',
    borderRadius: '8px'
  }}>
    Click Me
  </button>
);

// ✅ NEW WAY (Token-based)
const Button = () => (
  <button className="btn-primary">  {/* Uses CSS class */}
    Click Me
  </button>
);

/* button.css */
.btn-primary {
  background-color: var(--color-primary-default);  /* Adapts automatically */
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-default);
}
```

## Migration Journey

```
START: Mockup with hardcoded values
   │
   ├─ STEP 1: Create tokens.css
   │  • Extract current values as OLD design tokens
   │  • Add NEW design tokens from live Toqan
   │  • Add legacy mappings
   │
   ├─ STEP 2: Create DesignSystemContext
   │  • Two-layer management (design + theme)
   │  • Feature flag integration
   │  • Body class application
   │
   ├─ STEP 3: Refactor components
   │  • Replace hardcoded values with tokens
   │  • One component at a time
   │  • Test in all 4 combinations
   │
   ├─ STEP 4: Remove legacy
   │  • Delete old token mappings
   │  • Delete ThemeContext.tsx
   │  • Clean up unused code
   │
   └─ STEP 5: Build showcase
      • Component gallery
      • Token documentation
      • Design guidelines

END: Professional design system ✨
```

## File Dependency Graph

```
index.tsx
  │
  ├─ imports DesignSystemProvider
  │   │
  │   ├─ reads featureFlags.ts (newBranding)
  │   ├─ manages localStorage (theme mode)
  │   └─ applies classes to document.body
  │
  ├─ imports App.tsx
  │   │
  │   └─ renders components
  │       │
  │       └─ use tokens via CSS
  │
  └─ imports styles.css
      │
      └─ imports tokens.css
          │
          └─ defines CSS custom properties
              based on body classes
```

## Testing Matrix

```
                    OLD Design              NEW Design
              ┌─────────────────────┬─────────────────────┐
              │                     │                     │
  Light Mode  │  Test Combination 1 │  Test Combination 3 │
              │  newBranding: false │  newBranding: true  │
              │  theme: light       │  theme: light       │
              │                     │                     │
              ├─────────────────────┼─────────────────────┤
              │                     │                     │
  Dark Mode   │  Test Combination 2 │  Test Combination 4 │
              │  newBranding: false │  newBranding: true  │
              │  theme: dark        │  theme: dark        │
              │                     │                     │
              └─────────────────────┴─────────────────────┘

Each component must work correctly in ALL FOUR combinations
```

## Context Hook Usage

```typescript
// In any component
import { useDesignSystem } from '../context/DesignSystemContext';

function MyComponent() {
  const {
    designSystem,    // 'old' | 'new'
    themeMode,       // 'light' | 'dark'
    isDark,          // boolean
    isNewDesign,     // boolean
    toggleTheme,     // () => void
    setThemeMode,    // (mode) => void
  } = useDesignSystem();

  // Use these for conditional logic (rare)
  // Most styling should be handled by tokens
  
  return (
    <div>
      <p>Design: {designSystem}</p>
      <p>Theme: {themeMode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## Token Naming Convention

```
Category Prefix    Token Name Pattern              Example
─────────────────  ─────────────────────────────── ──────────────────────────
color-primary-     --color-primary-{variant}       --color-primary-default
color-ui-          --color-ui-{element}            --color-ui-background
color-text-        --color-text-{hierarchy}        --color-text-secondary
color-{status}-    --color-{status}-{variant}      --color-error-default

space-             --space-{size}                  --space-4
radius-            --radius-{size}                 --radius-default
shadow-            --shadow-{size}                 --shadow-md

font-size-body-    --font-size-body-{size}         --font-size-body-sm
font-size-heading- --font-size-heading-{size}      --font-size-heading-lg
font-weight-       --font-weight-{variant}         --font-weight-semibold

icon-size-         --icon-size-{size}              --icon-size-md
size-              --size-{element}-{property}     --size-button-height

z-                 --z-{layer}                     --z-modal

transition-        --transition-{speed}            --transition-fast
easing-            --easing-{curve}                --easing-in-out
```

## Success Indicators

```
✓ Feature flag toggles design instantly
✓ Theme toggle works in both designs
✓ No visual regressions
✓ All 4 combinations tested
✓ Components use tokens (no hardcoded values)
✓ Design system is self-documenting
✓ Easy for team to understand and use
✓ Showcase route demonstrates all tokens
✓ Migration path is clear
✓ Future design changes are easy
```

---

**Visual Reference:** Use the DesignSystemDemo component to see tokens in action!

