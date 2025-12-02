# Theme Customization System - Complete Architecture Documentation

## Overview

The Toqan UI design system uses a **two-layer token architecture** for maximum flexibility and maintainability:

1. **Primitive Layer** (`--color-*` tokens): Actual color values
2. **Semantic Layer** (`--theme-*` tokens): Named references with intent

The customization panel operates on the primitive layer, with automatic propagation to the semantic layer.

---

## Architecture

### Token Layers

#### Primitive Tokens (`--color-*`)
**Definition**: The foundational layer containing actual color values.

**Location**: Defined in [`tokens.css`](../tokens.css) lines 60-214

**Examples**:
```css
--color-primary-default: #4426d9;
--color-ui-background: #F9FAFB;
--color-text-default: #111827;
```

**Purpose**:
- Single source of truth for all color values
- Easy to theme (light/dark modes defined here)
- Customizable via the customization panel

#### Semantic Tokens (`--theme-*`)
**Definition**: Named references that express **intent** and **usage**.

**Location**: Defined in [`tokens.css`](../tokens.css) lines 348-385

**Examples**:
```css
--theme-bg-sidebar: var(--color-ui-background-elevated);
--theme-text-main: var(--color-text-default);
--theme-btn-primary-bg: var(--color-primary-default);
```

**Purpose**:
- Self-documenting code (intent is clear)
- Easier component authoring
- Can remap without changing components

---

## How Customization Works

### The Challenge

CSS variables are evaluated at **parse time**, not dynamically:

```css
:root {
  --color-ui-background: #F9FAFB;
  --theme-bg-sidebar: var(--color-ui-background);  /* Evaluates to #F9FAFB NOW */
}
```

When customization panel does:
```typescript
document.documentElement.style.setProperty('--color-ui-background', '#newcolor');
```

**Result**: 
- ✅ `--color-ui-background` updates to `#newcolor`
- ❌ `--theme-bg-sidebar` stays as `#F9FAFB` (already evaluated)

### The Solution

**File**: [`themes/themeTokenMapping.ts`](../themes/themeTokenMapping.ts)

We maintain a mapping of which `--theme-*` tokens depend on each `--color-*` token:

```typescript
export const colorToThemeMapping: Record<string, string[]> = {
  '--color-ui-background-elevated': [
    '--theme-bg-sidebar',
    '--theme-bg-input',
    '--theme-bg-menu',
  ],
  // ... complete mapping
};
```

**File**: [`context/ThemeCustomizationContext.tsx`](../context/ThemeCustomizationContext.tsx)

When applying customizations, we set **both** layers:

```typescript
function applyCSSVariables(variables: Record<string, string>, hasCustomizations: boolean) {
  Object.entries(variables).forEach(([name, value]) => {
    if (value) {
      // Set the --color-* token
      document.documentElement.style.setProperty(name, value);
      
      // Also set all dependent --theme-* tokens
      if (isColorToken(name)) {
        const dependentTokens = getDependentThemeTokens(name);
        dependentTokens.forEach(themeToken => {
          document.documentElement.style.setProperty(themeToken, value);
        });
      }
    }
  });
}
```

**Result**: 
- ✅ `--color-ui-background` updates
- ✅ `--theme-bg-sidebar` updates (explicitly set)
- ✅ All components update, regardless of which token they use

---

## Component Authoring Guidelines

### Which Token System to Use?

**Use `--theme-*` tokens (Semantic Layer)** - PREFERRED
```css
.sidebar {
  background: var(--theme-bg-sidebar);
  color: var(--theme-text-main);
  border: 1px solid var(--theme-border);
}
```

**Why?**
- ✅ Self-documenting (intent is clear)
- ✅ Semantic meaning preserved
- ✅ Easier to remap for special cases
- ✅ Works perfectly with customization panel

**Use `--color-*` tokens (Primitive Layer)** - When needed
```css
.special-component {
  background: var(--color-ui-background-elevated);
  color: var(--color-text-default);
}
```

**When?**
- No appropriate semantic token exists
- Need fine-grained control
- Building a new token abstraction

### DON'T: Hardcode Values

❌ **Bad**:
```css
.component {
  background: #F9FAFB;
  color: #111827;
  padding: 1rem;
  border-radius: 8px;
}
```

✅ **Good**:
```css
.component {
  background: var(--theme-bg-main);
  color: var(--theme-text-main);
  padding: var(--space-4);
  border-radius: var(--radius-default);
}
```

**Exceptions**: Intentional design elements (grain effects, specific decorations)

---

## Theme Modes (Light/Dark)

### How It Works

**Classes Applied**: `.theme-light` or `.theme-dark` on `<html>`

**Managed By**: [`context/DesignSystemContext.tsx`](../context/DesignSystemContext.tsx)

**Token Definitions**:
```css
/* Light Mode - Default */
:root {
  --color-ui-background: #F9FAFB;
  --color-text-default: #111827;
}

/* Dark Mode - Override */
.theme-dark {
  --color-ui-background: #0A0A0B;
  --color-text-default: #F5F5F7;
}
```

### Customization Panel Integration

When customizing in **dark mode**:
1. User changes `--color-ui-background` to `#123456`
2. Context stores: `darkOverrides: { '--color-ui-background': '#123456' }`
3. Light mode remains: `lightOverrides: {}` (inherits from base theme)
4. System applies: `document.documentElement.style.setProperty('--color-ui-background', '#123456')`
5. Dependent tokens updated: `--theme-bg-app`, `--theme-bg-main`

**Result**: Only dark mode changes, light mode untouched! ✅

---

## Customization Panel

### Token Metadata

**File**: [`themes/tokenMetadata.ts`](../themes/tokenMetadata.ts)

Defines which tokens are exposed in the customization panel:

```typescript
export const tokenMetadata: TokenMetadata[] = [
  {
    name: '--color-primary-default',
    displayName: 'Primary',
    type: 'color',
    category: 'colors',
    subcategory: 'Primary',
    description: 'Main brand color',
  },
  // ... 100+ tokens
];
```

**Note**: Panel exposes **only `--color-*` tokens**, but changes propagate to `--theme-*` automatically.

### Base Themes

**File**: [`themes/baseThemes.ts`](../themes/baseThemes.ts)

Predefined themes users can select:

```typescript
export const defaultOldTheme: BaseTheme = {
  id: 'default-old',
  name: 'Default OLD',
  light: { /* --color-* values */ },
  dark: { /* --color-* values */ },
};
```

### Custom Themes

**Storage**: `localStorage` keys:
- `toqan-active-theme`: Currently active theme + overrides
- `toqan-custom-themes`: Saved custom themes

**Structure**:
```typescript
interface CustomTheme {
  id: string;
  name: string;
  baseThemeId: string;           // Which base theme to inherit from
  lightOverrides: Record<string, string>;  // Only changed tokens
  darkOverrides: Record<string, string>;   // Only changed tokens
  createdAt: string;
}
```

**DRY Principle**: Only overrides are stored, reducing data size and maintaining inheritance.

---

## Testing Checklist

When adding/modifying tokens or components:

### For New Components
- [ ] Use `--theme-*` tokens where available
- [ ] Use `--color-*` tokens when no semantic token exists
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test with customization panel (change related tokens)
- [ ] Verify no hardcoded colors/spacing/radius

### For New Tokens
- [ ] Add to [`tokens.css`](../tokens.css) with light & dark variants
- [ ] Add to [`themes/tokenMetadata.ts`](../themes/tokenMetadata.ts)
- [ ] Add to [`themes/baseThemes.ts`](../themes/baseThemes.ts) for all base themes
- [ ] If semantic (`--theme-*`), add mapping to [`themes/themeTokenMapping.ts`](../themes/themeTokenMapping.ts)
- [ ] Test in customization panel
- [ ] Document in this file

### For Customization Changes
- [ ] Test with Default OLD base theme
- [ ] Test with Default NEW base theme
- [ ] Test light mode customization
- [ ] Test dark mode customization
- [ ] Test reset functionality
- [ ] Test export/import
- [ ] Verify both `--color-*` and `--theme-*` update

---

## Developer Experience

### Quick Reference

**I want to style a sidebar background:**
```css
background: var(--theme-bg-sidebar);
```

**I want to style primary text:**
```css
color: var(--theme-text-main);
```

**I want to add padding:**
```css
padding: var(--space-4);  /* 1rem / 16px */
```

**I want to add border radius:**
```css
border-radius: var(--radius-default);  /* 0.5rem / 8px */
```

**I want to add a button:**
```css
.button {
  background: var(--theme-btn-primary-bg);
  color: var(--theme-btn-primary-text);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-default);
}

.button:hover {
  background: var(--theme-btn-primary-bg-hover);
}
```

### When to Create New Tokens

**Create a new `--color-*` token when:**
- Adding a genuinely new color to the palette
- Color needs light/dark variants
- Color should be customizable

**Create a new `--theme-*` token when:**
- Expressing a new semantic use case
- Multiple components will use the same value
- Want to preserve intent (e.g., "error border" vs "red")

**Update [`themes/themeTokenMapping.ts`](../themes/themeTokenMapping.ts) when:**
- Creating a new `--theme-*` token that references a `--color-*` token

---

## Troubleshooting

### "My component doesn't update when I change tokens"

**Check**:
1. Are you using `--theme-*` or `--color-*` tokens? (not hardcoded)
2. Is the token defined in [`themes/tokenMetadata.ts`](../themes/tokenMetadata.ts)?
3. If using `--theme-*`, is it mapped in [`themes/themeTokenMapping.ts`](../themes/themeTokenMapping.ts)?

### "Dark mode isn't working"

**Check**:
1. Is `.theme-dark` class applied to `<html>`?
2. Are tokens defined in both `:root` and `.theme-dark` selectors?
3. Are you using `document.body` instead of `document.documentElement`?

### "Customization panel shows #000000 for all colors in dark mode"

**Fixed**: This was due to dark mode tokens not being populated in base themes for OLD design.

**Solution**: Context now falls back to light mode tokens when dark tokens are empty.

---

## Migration Guide

### From Hardcoded Values

**Before**:
```css
.component {
  background: #FFFFFF;
  color: #111827;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #c8d8ea;
}
```

**After**:
```css
.component {
  background: var(--theme-bg-input);
  color: var(--theme-text-main);
  padding: var(--space-4);
  border-radius: var(--radius-default);
  border: 1px solid var(--theme-border);
}
```

### From `--color-*` to `--theme-*`

**Before** (works, but not semantic):
```css
.sidebar {
  background: var(--color-ui-background-elevated);
  color: var(--color-text-default);
}
```

**After** (semantic, intent clear):
```css
.sidebar {
  background: var(--theme-bg-sidebar);
  color: var(--theme-text-main);
}
```

---

## File Reference

### Core System Files
- [`tokens.css`](../tokens.css) - All token definitions
- [`context/DesignSystemContext.tsx`](../context/DesignSystemContext.tsx) - Theme mode switching
- [`context/ThemeCustomizationContext.tsx`](../context/ThemeCustomizationContext.tsx) - Customization logic

### Customization Panel
- [`components/CustomizationPanel/CustomizationPanel.tsx`](../components/CustomizationPanel/CustomizationPanel.tsx) - Main panel UI
- [`components/CustomizationPanel/TokenControl.tsx`](../components/CustomizationPanel/TokenControl.tsx) - Smart token input
- [`components/CustomizationPanel/ColorPicker.tsx`](../components/CustomizationPanel/ColorPicker.tsx) - Color picker component

### Token Management
- [`themes/baseThemes.ts`](../themes/baseThemes.ts) - Predefined base themes
- [`themes/tokenMetadata.ts`](../themes/tokenMetadata.ts) - Token configuration
- [`themes/themeTokenMapping.ts`](../themes/themeTokenMapping.ts) - Color-to-theme mapping

---

## Summary

✅ **Two-layer token system** (primitive + semantic) for flexibility
✅ **Automatic propagation** from `--color-*` to `--theme-*`
✅ **DRY theme storage** (only overrides saved)
✅ **Light/dark mode** support with independent customization
✅ **localStorage persistence** for custom themes
✅ **Export/import** functionality for sharing themes
✅ **Comprehensive testing** checklist for quality assurance

**Developer Experience**: Write semantic CSS, get automatic theme support! 🎉

