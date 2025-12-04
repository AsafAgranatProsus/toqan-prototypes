# Toqan Prototype Architecture

## Overview

This document describes the granular prototype architecture that allows for safe experimentation with new features while maintaining the current Toqan design as baseline.

## Architecture Principles

### 1. Baseline = Current Design (No Special Classes)

The current Toqan design is the **baseline** and requires no special CSS classes. All default styles apply without any conditions.

```css
/* Default styles work without any classes */
.button {
  background: var(--color-primary-default);
  /* ... */
}
```

### 2. `.new-branding` = Master Prototype Switch

The `.new-branding` class acts as a **master safety switch** for all experimental features:

- Applied to the `<html>` element when `newBranding` flag is `true`
- Controlled by `DesignSystemContext` based on feature flag
- Required for ANY prototype feature to activate

**Purpose:** Turn off ALL prototypes instantly by disabling one flag.

### 3. Feature-Specific Classes

Each prototype feature gets its own class applied to the `<body>` element:

- `newBubble` flag → `.new-bubble` class
- `newTables` flag → `.new-tables` class
- `newTypography` flag → `.new-typography` class
- Future: `rightPanel` flag → `.new-right-panel` class

These classes are applied automatically by `FeatureMenu` component.

### 4. CSS Coupling Pattern: `.new-branding.new-feature`

Prototype styles require **BOTH** classes on the **HTML element**:

```css
/* Prototype: requires .new-branding AND .new-bubble on HTML */
.new-branding.new-bubble {
  .message-bubble {
    border-radius: 24px;
    /* ... new bubble styles ... */
  }
}
```

If `.new-branding` is removed from HTML, ALL prototype styles turn off instantly.
If `.new-bubble` is removed from HTML, only the bubble prototype turns off.

### 5. Production Graduation Path

When a feature is ready for production, simply remove the `.new-branding` requirement:

```css
/* BEFORE (Prototype): Requires prototype mode AND feature flag */
.new-branding.new-bubble {
  .message-bubble {
    border-radius: 24px;
  }
}

/* AFTER (Production): Works with just feature flag */
.new-bubble {
  .message-bubble {
    border-radius: 24px;
  }
}
```

No component refactoring needed!

## Implementation Details

### CSS Class Application

```
HTML element (<html>)
  ├─ .new-branding (when newBranding flag is true)
  ├─ .new-bubble (when newBubble flag is true)
  ├─ .new-tables (when newTables flag is true)
  ├─ .new-typography (when newTypography flag is true)
  ├─ .plays (when plays flag is true)
  ├─ .conversation-pin (when conversationPin flag is true)
  └─ .[feature-name] (for any feature - kebab-case)

Body element (<body>)
  ├─ .theme-dark (when dark mode is active)
  └─ .theme-light (when light mode is active)
```

**All feature flags are applied to HTML element** to enable the coupling pattern `.new-branding.new-feature`.

### Programmatic Coupling (JavaScript/TypeScript)

Use the `isFeatureActive` helper to mirror CSS coupling in component logic:

```typescript
import { useFeatureFlags } from './context/FeatureFlagContext';

const MyComponent = () => {
  const { flags, isFeatureActive } = useFeatureFlags();

  // PROTOTYPE MODE: Requires BOTH newBranding AND newBubble
  if (isFeatureActive('newBubble')) {
    return <NewBubbleComponent />;
  }

  // Or manually:
  if (flags.newBranding && flags.newBubble) {
    return <NewBubbleComponent />;
  }

  // BASELINE: Default component
  return <CurrentBubbleComponent />;
};
```

### Consistency Principle

**CSS and JavaScript must mirror each other:**

| Context | Pattern | Example |
|---------|---------|---------|
| **CSS** | `.new-branding.new-feature { }` | `.new-branding.new-bubble { }` |
| **JS (Manual)** | `flags.newBranding && flags.newFeature` | `flags.newBranding && flags.newBubble` |
| **JS (Helper)** | `isFeatureActive('newFeature')` | `isFeatureActive('newBubble')` |

**Note:** Only flags with "new" prefix require coupling with `newBranding`. Other flags (like `plays`, `conversationPin`) work independently.

### Feature Flag Configuration

Feature flags are defined in `featureFlags.ts`:

```typescript
export const featureFlags = {
  newBranding: false,      // Master prototype switch
  newTypography: false,    // Prototype feature
  newTables: false,        // Prototype feature
  newBubble: false,        // Prototype feature
  // ... other features
};
```

**Default: `false`** = Baseline (current design) is always the default.

## Usage Examples

### Adding a New Prototype Feature

1. **Add feature flag** in `featureFlags.ts`:
   ```typescript
   export const featureFlags = {
     // ...
     rightPanel: false,  // New feature
   };
   ```

2. **Add toggle** in Feature Menu (optional - classes apply automatically)

3. **Write CSS** with coupling pattern (both classes on HTML):
   ```css
   /* Requires .new-branding AND .right-panel on HTML */
   .new-branding.new-right-panel {
     .right-panel-container {
       width: 300px;
       background: var(--color-ui-background-elevated);
       /* ... styles ... */
     }
   }
   ```

4. **Use in components** (if conditional rendering needed):
   ```typescript
   if (isFeatureActive('rightPanel')) {
     return <RightPanelPrototype />;
   }
   return null; // Or baseline component
   ```

### Graduating a Feature to Production

1. **Remove coupling** in CSS:
   ```css
   /* BEFORE: Requires both classes on HTML */
   .new-branding.new-right-panel { /* ... */ }
   
   /* AFTER: Just feature class */
   .new-right-panel { /* ... */ }
   ```

2. **Remove coupling** in JS (if used):
   ```typescript
   // BEFORE
   if (isFeatureActive('rightPanel')) { /* ... */ }
   
   // AFTER
   if (flags.rightPanel) { /* ... */ }
   ```

3. **Keep the flag** - it now controls the feature independently

4. **Update default** when ready:
   ```typescript
   export const featureFlags = {
     // ...
     rightPanel: true,  // Now on by default
   };
   ```

## Benefits

1. **Master Safety Switch**: Disable ALL prototypes instantly with one flag
2. **Clear Baseline**: No classes needed for current design
3. **Graceful Graduation**: Move features to production without refactoring
4. **No Dependencies**: Features don't depend on each other
5. **Consistent Pattern**: CSS and JS use the same coupling logic
6. **Future-Proof**: New features follow the same proven pattern

## Files Modified

- `context/DesignSystemContext.tsx` - Applies `.new-branding` to HTML
- `context/FeatureFlagContext.tsx` - Adds `isFeatureActive` helper
- `components/FeatureMenu/FeatureMenu.tsx` - Applies feature classes to body
- `components/MainContent/MainContent.tsx` - Simplified to baseline only
- `tokens.css` - Updated selectors and added documentation
- Theme CSS files - Updated to use new class names

## Migration Notes

### Removed

- `.design-old` class (no longer needed - baseline is default)
- `.old-toqan` class (legacy support)
- Conditional logic for "old" vs "new" in components (baseline is default)

### Renamed

- `.design-new` → `.new-branding` (more semantic)

### Kept

- `newBranding` flag (master prototype switch)
- Feature-specific flags (granular control)
- All theme tokens and design system structure

