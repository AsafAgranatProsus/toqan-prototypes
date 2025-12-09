# Component Token Layer Pattern

## Overview

This guide documents the standard pattern for adding a **component token layer** to CSS files. This creates a semantic abstraction over global color tokens, making components easier to theme and maintain.

## What is a Component Token Layer?

A component token layer is a set of CSS custom properties defined at the component level that map to global design tokens. This creates a three-layer token architecture:

```
Theme Files (flamingo.css, etc.)
    ↓ defines
Primitive Tokens (--color-*, defined in tokens.css or theme files)
    ↓ referenced by
Component Tokens (--component-name-*, defined in component CSS)
    ↓ used in
Component Selectors (actual CSS rules)
```

## Benefits

1. **Centralized Color Palette**: All color decisions visible in one place at the top of the file
2. **Easy Theming**: Override any color by redefining component tokens
3. **Semantic Clarity**: Token names describe intent, not just raw values
4. **Component Isolation**: Each component's colors are self-contained
5. **Maintainability**: Change once at the top, affects all uses throughout the file

## Token Naming Convention

### Format
```css
--component-name-element-property
```

### Rules
1. **Use flat naming**: Separate with single hyphens (no BEM-style `__` or `--`)
2. **Start with component name**: `--workspace-menu-`, `--sidebar-`, `--button-`
3. **Describe semantic purpose**: What it does, not what it is
4. **Be specific**: Include element/state when needed

### Examples

**Good:**
```css
--workspace-menu-title-color
--workspace-menu-item-hover-bg
--workspace-menu-item-active-bg
--sidebar-border
--button-primary-bg
```

**Bad:**
```css
--workspace-menu__title-color  /* Don't use BEM in tokens */
--wm-title-color               /* Don't abbreviate excessively */
--workspace-menu-secondary     /* Too vague */
--workspace-menu-color-1       /* Not semantic */
```

## Implementation Steps

### Step 1: Audit Current Color Usage

Search the component CSS file for all color-related tokens:
- `--color-*`
- `--theme-*`
- Hard-coded colors (rare, but check)

List them all and their usage context.

### Step 2: Design Component Token Names

For each color usage, create a semantic component token name:

**Mapping Example:**
```
var(--color-text-secondary)         → --component-title-color
var(--color-ui-active)               → --component-item-hover-bg
var(--theme-ui-hover)                → --component-item-hover-bg
var(--color-ui-active)               → --component-item-active-bg
var(--color-text-default)            → --component-item-text
var(--color-primary-default)         → --component-accent-color
var(--color-ui-border)               → --component-border
```

### Step 3: Add Token Definitions

At the **top of the main component selector**, add a comment section and define all component tokens:

```css
.component-name {
  /* Component Token Layer - Color Palette */
  --component-title-color: var(--color-text-secondary);
  --component-item-hover-bg: var(--color-ui-hover);
  --component-item-active-bg: var(--color-ui-active);
  --component-item-text: var(--color-text-default);
  --component-accent-color: var(--color-primary-default);
  --component-border: var(--color-ui-border);
  
  /* Existing layout/styling properties */
  display: flex;
  ...
}
```

**Special Case - Portaled Components:**

If your component renders elements in a **Portal** (e.g., dropdown menus, modals, tooltips rendered at document root), define tokens in `:root` instead:

```css
/* Component Token Layer - Color Palette (Root scope for portaled elements) */
:root {
  --component-menu-bg: var(--color-ui-background-elevated);
  --component-menu-border: var(--color-ui-border);
  --component-menu-item-text: var(--color-text-default);
  --component-menu-item-hover-bg: var(--color-ui-hover);
}

.component-name {
  /* CSS Variables for size control */
  --component-padding: var(--space-2);
  
  /* Layout properties */
  display: flex;
  ...
}
```

Portaled elements are injected outside the normal DOM hierarchy, so they cannot access CSS variables scoped to parent selectors.

### Step 4: Replace All Color Usages

Search and replace each color token usage throughout the file:

**Before:**
```css
.component__title {
  color: var(--color-text-secondary);
}

.component__item:hover {
  background-color: var(--theme-ui-hover);
}
```

**After:**
```css
.component__title {
  color: var(--component-title-color);
}

.component__item:hover {
  background-color: var(--component-item-hover-bg);
}
```

### Step 5: Migrate Legacy Tokens

Convert any `--theme-*` tokens to modern `--color-*` tokens:

**Migration Map:**
```
--theme-ui-hover              → --color-ui-active
--theme-menu-item-active-bg   → --color-ui-active
--theme-text-main             → --color-text-default
--theme-text-secondary        → --color-text-secondary
--theme-border                → --color-ui-border
--theme-bg-menu               → --color-ui-background-elevated
```

**Important Note:** There is **no `--color-ui-hover` token**. Use `--color-ui-active` for hover states.

## Complete Example

### Before:
```css
.workspace-menu {
  min-width: 280px;
  background: linear-gradient(
    135deg,
    var(--color-secondary-light) 0%,
    var(--color-tertiary-light) 100%
  );
}

.workspace-menu__title {
  color: var(--color-text-secondary);
}

.workspace-menu__item:hover {
  background-color: var(--theme-ui-hover);
}

.workspace-menu__item--active {
  background-color: var(--color-ui-active);
}
```

### After:
```css
.workspace-menu {
  /* Component Token Layer - Color Palette */
  --workspace-menu-bg-gradient-start: var(--color-secondary-light);
  --workspace-menu-bg-gradient-end: var(--color-tertiary-light);
  --workspace-menu-title-color: var(--color-text-secondary);
  --workspace-menu-item-hover-bg: var(--color-ui-active);
  --workspace-menu-item-active-bg: var(--color-ui-active);
  
  /* Layout */
  min-width: 280px;
  background: linear-gradient(
    135deg,
    var(--workspace-menu-bg-gradient-start) 0%,
    var(--workspace-menu-bg-gradient-end) 100%
  );
}

.workspace-menu__title {
  color: var(--workspace-menu-title-color);
}

.workspace-menu__item:hover {
  background-color: var(--workspace-menu-item-hover-bg);
}

.workspace-menu__item--active {
  background-color: var(--workspace-menu-item-active-bg);
}
```

## Common Patterns

### Background Colors
```css
--component-bg: var(--color-ui-background);
--component-bg-elevated: var(--color-ui-background-elevated);
--component-bg-hover: var(--color-ui-active);
--component-bg-active: var(--color-ui-active);
```

### Text Colors
```css
--component-text: var(--color-text-default);
--component-text-secondary: var(--color-text-secondary);
--component-text-muted: var(--color-text-tertiary);
--component-text-accent: var(--color-primary-default);
```

### Interactive States
```css
--component-item-bg: transparent;
--component-item-hover-bg: var(--color-ui-active);
--component-item-active-bg: var(--color-ui-active);
--component-item-focus-ring: var(--color-primary-default);
```

### Borders
```css
--component-border: var(--color-ui-border);
--component-border-hover: var(--color-primary-default);
--component-divider: var(--color-ui-border);
```

### Icons
```css
--component-icon-color: var(--color-text-secondary);
--component-icon-hover-color: var(--color-text-default);
--component-icon-active-color: var(--color-primary-default);
```

### Gradients
```css
--component-gradient-start: var(--color-secondary-light);
--component-gradient-end: var(--color-tertiary-light);
```

## Best Practices

### DO:
- ✅ Define all color tokens at the top of the main component selector
- ✅ Use `:root` for tokens accessed by **portaled elements** (menus, modals, tooltips)
- ✅ Use modern `--color-*` tokens as the source (not `--theme-*`)
- ✅ Use flat, readable naming (`--component-element-property`)
- ✅ Be semantic and descriptive
- ✅ Group related tokens together (bg, text, borders, etc.)
- ✅ Add a comment header: `/* Component Token Layer - Color Palette */`

### DON'T:
- ❌ Don't mix `--theme-*` and `--color-*` sources (always use `--color-*`)
- ❌ Don't use BEM notation in token names (`__` or `--`)
- ❌ Don't abbreviate excessively
- ❌ Don't use vague names like `--component-color-1`
- ❌ Don't scatter token definitions throughout the file
- ❌ Don't scope color tokens to component selectors if they're used in portals
- ❌ Don't refactor CSS selectors (keep BEM as-is for now)

## Checklist

When implementing this pattern:

- [ ] Audit all color usage in the file
- [ ] Design semantic token names
- [ ] Add token definitions at top of main selector
- [ ] Replace all direct color token usages
- [ ] Migrate `--theme-*` to `--color-*` where found
- [ ] Verify no hard-coded colors remain
- [ ] Test component in light and dark modes
- [ ] Document any component-specific theming notes

## Reference Files

- **Example Implementation (Standard)**: `components/WorkspaceMenu/WorkspaceMenu.css`
- **Example Implementation (Portaled)**: `components/Dropdown/Dropdown.css`
- **Global Tokens**: `tokens.css`
- **Theme Files**: `public/themes/*.css`
- **Token Documentation**: `themes/tokenMetadata.ts`

## Future Considerations

This pattern sets the foundation for:
1. Component variants (different color schemes)
2. Theme-specific overrides
3. Dynamic theming
4. Design system documentation
5. Automated token generation

---

**Last Updated**: December 2024  
**Pattern Version**: 1.0  
**Reference Implementation**: WorkspaceMenu.css
