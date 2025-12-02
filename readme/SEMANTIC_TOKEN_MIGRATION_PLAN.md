# Semantic Token Migration Plan

## Overview

This plan outlines the complete migration from primitive `--color-*` tokens to semantic `--theme-*` tokens across all components, while preserving backward compatibility with the OLD Toqan design and laying the foundation for a Material Design 3-style theme builder.

## Goals

1. **Full Systemization**: All components use semantic `--theme-*` tokens
2. **Backward Compatibility**: OLD Toqan state remains accessible
3. **Future-Ready**: Architecture supports M3-style theme builder approach
4. **DRY Principle**: Single source of truth for all design decisions

---

## Current State Analysis

### Token Usage Distribution

| Token Type | Instances | Files | Status |
|------------|-----------|-------|--------|
| `--color-*` (primitive) | 114 | 8 | ❌ Should migrate |
| `--theme-*` (semantic) | 79 | 11 | ✅ Already semantic |
| Hardcoded values | ~50 | 4 | ❌ Should tokenize |

### Files Requiring Migration

1. **Button.css** - 17 instances
2. **FeatureMenu.css** - 9 instances
3. **DesignSystemDemo.css** - 32 instances
4. **DesignSystemDemo.tsx** - 42 instances (inline styles)
5. **Sidebar.css** - 3 instances
6. **Plays.css** - 5 instances
7. **Conversation.css** - 5 instances
8. **UserMessage.css** - 1 instance

---

## New Semantic Tokens Required

### Missing Tokens to Add

Based on current `--color-*` usage, we need these new semantic tokens:

```css
/* ===== COMPONENT-SPECIFIC SEMANTIC TOKENS ===== */

/* Focus States */
--theme-focus-ring: var(--color-primary-default);

/* Links */
--theme-link-default: var(--color-primary-default);
--theme-link-hover: var(--color-primary-hover);

/* Status Colors (semantic names) */
--theme-status-info-bg: var(--color-info-background);
--theme-status-info-text: var(--color-info-default);
--theme-status-info-border: var(--color-info-default);

--theme-status-success-bg: var(--color-success-background);
--theme-status-success-text: var(--color-success-default);
--theme-status-success-border: var(--color-success-default);

--theme-status-warning-bg: var(--color-warning-background);
--theme-status-warning-text: var(--color-warning-default);
--theme-status-warning-border: var(--color-warning-default);

--theme-status-error-bg: var(--color-error-background);
--theme-status-error-text: var(--color-error-default);
--theme-status-error-border: var(--color-error-default);

/* Cards & Surfaces */
--theme-surface-default: var(--color-ui-background);
--theme-surface-elevated: var(--color-ui-background-elevated);
--theme-surface-active: var(--color-ui-active);

/* Scrollbars */
--theme-scrollbar-thumb: var(--color-ui-border);
--theme-scrollbar-thumb-hover: var(--color-ui-active);
--theme-scrollbar-track: transparent;

/* Accent Colors */
--theme-accent-primary: var(--color-primary-default);
--theme-accent-primary-light: var(--color-primary-light);
--theme-accent-primary-bg: var(--color-primary-background);

/* Icon Buttons */
--theme-btn-icon-bg: var(--color-ui-background-elevated);
--theme-btn-icon-text: var(--color-text-secondary);
--theme-btn-icon-border: var(--color-ui-border);
--theme-btn-icon-bg-hover: var(--color-ui-active);
--theme-btn-icon-text-hover: var(--color-text-default);
```

---

## Migration Mapping

### Button Component

| Current | New Semantic |
|---------|--------------|
| `--color-primary-default` | `--theme-btn-primary-bg` |
| `--color-primary-hover` | `--theme-btn-primary-bg-hover` |
| `--color-text-light` | `--theme-btn-primary-text` |
| `--color-ui-active` | `--theme-btn-secondary-bg` |
| `--color-text-default` | `--theme-text-main` |
| `--color-ui-border` | `--theme-border` |
| `--color-text-secondary` | `--theme-text-secondary` |
| `--color-ui-background-elevated` | `--theme-btn-icon-bg` |

### Status Messages

| Current | New Semantic |
|---------|--------------|
| `--color-info-background` | `--theme-status-info-bg` |
| `--color-info-default` | `--theme-status-info-text` |
| `--color-success-background` | `--theme-status-success-bg` |
| `--color-success-default` | `--theme-status-success-text` |
| `--color-warning-background` | `--theme-status-warning-bg` |
| `--color-warning-default` | `--theme-status-warning-text` |
| `--color-error-background` | `--theme-status-error-bg` |
| `--color-error-default` | `--theme-status-error-text` |

### Surfaces & Backgrounds

| Current | New Semantic |
|---------|--------------|
| `--color-ui-background` | `--theme-surface-default` OR `--theme-bg-app` |
| `--color-ui-background-elevated` | `--theme-surface-elevated` OR `--theme-bg-input` |
| `--color-ui-active` | `--theme-surface-active` OR `--theme-bg-item-selected` |

### Links & Focus

| Current | New Semantic |
|---------|--------------|
| `--color-primary-default` (for links) | `--theme-link-default` |
| `--color-primary-default` (for focus) | `--theme-focus-ring` |

---

## Implementation Plan

### Phase 1: Add New Semantic Tokens (tokens.css)

Add all missing semantic tokens to the LEGACY SUPPORT section:

```css
:root {
  /* Existing tokens... */
  
  /* NEW: Focus & Links */
  --theme-focus-ring: var(--color-primary-default);
  --theme-link-default: var(--color-primary-default);
  --theme-link-hover: var(--color-primary-hover);
  
  /* NEW: Status Colors */
  --theme-status-info-bg: var(--color-info-background);
  --theme-status-info-text: var(--color-info-default);
  --theme-status-info-border: var(--color-info-default);
  /* ... etc */
  
  /* NEW: Surfaces */
  --theme-surface-default: var(--color-ui-background);
  --theme-surface-elevated: var(--color-ui-background-elevated);
  --theme-surface-active: var(--color-ui-active);
  
  /* NEW: Scrollbars */
  --theme-scrollbar-thumb: var(--color-ui-border);
  --theme-scrollbar-thumb-hover: var(--color-ui-active);
  
  /* NEW: Icon Buttons */
  --theme-btn-icon-bg: var(--color-ui-background-elevated);
  --theme-btn-icon-text: var(--color-text-secondary);
  --theme-btn-icon-border: var(--color-ui-border);
  --theme-btn-icon-bg-hover: var(--color-ui-active);
  --theme-btn-icon-text-hover: var(--color-text-default);
}
```

### Phase 2: Update themeTokenMapping.ts

Add new mappings for all new semantic tokens.

### Phase 3: Migrate Components (in order)

**Priority 1: Core UI (High Impact)**
1. `Button.css` - 17 changes
2. `Sidebar.css` - 3 changes
3. `Conversation.css` - 5 changes

**Priority 2: Navigation & Menus**
4. `FeatureMenu.css` - 9 changes
5. `Plays.css` - 5 changes

**Priority 3: Demo & Documentation**
6. `DesignSystemDemo.css` - 32 changes
7. `DesignSystemDemo.tsx` - 42 changes

**Priority 4: Other**
8. `UserMessage.css` - 1 change

### Phase 4: Update baseThemes.ts

Ensure all new semantic tokens are included in base themes.

### Phase 5: Update tokenMetadata.ts

Add new tokens to customization panel (if user-facing).

---

## Material Design 3 Alignment

### M3 Color System Concepts

Material Design 3 uses a sophisticated color system with:

1. **Key Colors**: Primary, Secondary, Tertiary, Neutral
2. **Tonal Palettes**: 13 tones per color (0-100)
3. **Color Roles**: Surface, On-Surface, Container, On-Container
4. **Dynamic Color**: Wallpaper-based theming

### How Our System Maps to M3

| M3 Concept | Our Implementation |
|------------|-------------------|
| Primary | `--color-primary-*` → `--theme-btn-primary-*`, `--theme-accent-*` |
| Surface | `--color-ui-background` → `--theme-surface-*` |
| On-Surface | `--color-text-*` → `--theme-text-*` |
| Container | `--color-*-background` → `--theme-status-*-bg` |
| On-Container | `--color-*-default` → `--theme-status-*-text` |

### Future M3-Style Enhancements

For future implementation (inspired by [Material Theme Builder](https://github.com/material-foundation/material-theme-builder)):

1. **Source Color Extraction**: Generate palette from single brand color
2. **Tonal Palette Generation**: Auto-generate 13 tones per color
3. **Dynamic Color**: Support wallpaper-based theming
4. **Color Harmony**: Automatic complementary/analogous colors
5. **Accessibility**: WCAG contrast ratio validation
6. **Export Formats**: CSS, JSON, Android, iOS, Flutter

---

## Backward Compatibility

### Preserving OLD Toqan State

The semantic token system maintains full backward compatibility:

1. **Token References**: `--theme-*` tokens reference `--color-*` tokens
2. **CSS Cascade**: When no customization, CSS classes apply normally
3. **Design System Toggle**: OLD/NEW design systems still work
4. **Theme Mode**: Light/Dark modes still work

### How It Works

```
User selects "OLD Design" + "Light Mode"
    ↓
DesignSystemContext applies: .design-old.theme-light
    ↓
tokens.css :root defines --color-* values
    ↓
tokens.css :root defines --theme-* = var(--color-*)
    ↓
Components use --theme-* tokens
    ↓
Result: OLD Toqan appearance ✅
```

---

## Testing Strategy

### For Each Migrated Component

1. ✅ OLD Design + Light Mode - Visual parity
2. ✅ OLD Design + Dark Mode - Visual parity
3. ✅ NEW Design + Light Mode - Visual parity
4. ✅ NEW Design + Dark Mode - Visual parity
5. ✅ Customization panel changes apply
6. ✅ No visual regressions

### Automated Checks

- Linter: No errors
- Build: Compiles successfully
- Runtime: No console errors

---

## Estimated Effort

| Phase | Task | Time |
|-------|------|------|
| 1 | Add semantic tokens to tokens.css | 30 min |
| 2 | Update themeTokenMapping.ts | 20 min |
| 3a | Migrate Button.css | 15 min |
| 3b | Migrate Sidebar.css | 10 min |
| 3c | Migrate Conversation.css | 10 min |
| 3d | Migrate FeatureMenu.css | 15 min |
| 3e | Migrate Plays.css | 10 min |
| 3f | Migrate DesignSystemDemo.css | 30 min |
| 3g | Migrate DesignSystemDemo.tsx | 45 min |
| 3h | Migrate UserMessage.css | 5 min |
| 4 | Update baseThemes.ts | 20 min |
| 5 | Update tokenMetadata.ts | 15 min |
| 6 | Testing & verification | 30 min |
| **Total** | | **~4 hours** |

---

## Success Criteria

✅ **Zero `--color-*` usage in component files** (except CustomizationPanel)

✅ **All components use semantic `--theme-*` tokens**

✅ **OLD Toqan design preserved and functional**

✅ **NEW design system preserved and functional**

✅ **Customization panel affects ALL UI elements**

✅ **Light/Dark modes work perfectly**

✅ **No visual regressions**

✅ **Foundation ready for M3-style theme builder**

---

## Next Steps After Migration

1. **M3 Color Algorithm**: Implement tonal palette generation
2. **Source Color UI**: Single color input generates full palette
3. **Harmony Suggestions**: Complementary/analogous color recommendations
4. **Accessibility Checker**: WCAG contrast validation in panel
5. **Theme Presets**: Curated themes (Material, iOS, Custom)
6. **Export Formats**: CSS variables, JSON, Tailwind config
7. **Import from Image**: Extract colors from uploaded image (like M3)

---

## References

- [Material Theme Builder](https://github.com/material-foundation/material-theme-builder)
- [Material Design 3 Color System](https://m3.material.io/styles/color/overview)
- [Dynamic Color](https://m3.material.io/styles/color/dynamic-color/overview)


