# Toqan Concept System

## Overview

The Concept System allows you to work on parallel, isolated variants of Toqan without affecting the core prototype. Each concept can have its own component configurations, layout arrangements, and styles while sharing core infrastructure.

The system has two layers:
1. **ConceptContext** - Manages which concept is active (core, restaurant, etc.)
2. **Composer Pattern** - Defines what components render in each layout area per concept

## Quick Start

### Access a Concept

**Via URL:**
```
/restaurant           → Restaurant concept home
/restaurant/orders    → Restaurant-specific page
?concept=restaurant   → Set concept via query param
```

**Via FeatureMenu:**
1. Open FeatureMenu (Alt+/)
2. Use the "Concept" dropdown at the top
3. Selecting a concept navigates to its home route

### Create a New Concept

1. **Add to ConceptContext:**

```typescript
// context/ConceptContext.tsx
export const CONCEPTS = {
  core: { ... },
  restaurant: { ... },
  // Add your new concept:
  education: {
    id: 'education',
    name: 'Education',
    description: 'Toqan for educators and students',
    routePrefix: '/education',
  },
} as const;
```

2. **Create concept folder:**

```
concepts/
  education/
    index.ts              # Concept exports
    pages/
      EducationHomePage.tsx
      EducationHomePage.css
    components/           # Concept-specific components
    configs/              # Custom configs
    styles/               # Concept-specific tokens
```

3. **Add routes in App.tsx:**

```typescript
// Add import
import { EducationHomePage } from './concepts/education';

// Add to route detection
const isConceptRoute = location.pathname.startsWith('/restaurant') ||
                       location.pathname.startsWith('/education');

// Add routes
<Route path="/education" element={<EducationHomePage />} />
<Route path="/education/*" element={<EducationHomePage />} />
```

4. **Export from concepts/index.ts:**

```typescript
import * as education from './education';
export { education };
```

## Architecture

### Folder Structure

```
concepts/
├── index.ts                  # Concept registry
├── restaurant/               # Restaurant concept
│   ├── index.ts              # Concept entry point
│   ├── pages/                # Concept-specific pages
│   │   ├── RestaurantHomePage.tsx
│   │   └── RestaurantHomePage.css
│   ├── components/           # Overrides or new components
│   ├── configs/              # Custom configurations
│   └── styles/               # Concept-specific tokens
└── [future-concept]/         # Same structure
```

### Context Hierarchy

```
<FeatureFlagProvider>
  <ConceptProvider>          ← NEW: Concept management
    <WorkspaceProvider>
      <ScenarioProvider>
        <DesignSystemProvider>
          <ThemeCustomizationProvider>
            <App />
```

### Concept Detection Priority

1. **URL query param** (`?concept=restaurant`) - highest priority
2. **URL path prefix** (`/restaurant/...`)
3. **localStorage** - persisted selection
4. **Default** - 'core'

## API

### useConcept Hook

```typescript
import { useConcept } from './context/ConceptContext';

const MyComponent = () => {
  const { 
    conceptId,           // 'core' | 'restaurant' | ...
    activeConcept,       // Full concept object
    setConcept,          // (id: ConceptId) => void
    concepts,            // All available concepts
    isConceptActive,     // (id: ConceptId) => boolean
  } = useConcept();

  return (
    <div>
      {isConceptActive('restaurant') && <RestaurantBadge />}
    </div>
  );
};
```

### CSS Concept Classes

Concept classes are applied to `<html>` element:

```css
/* Style specific to restaurant concept */
.concept-restaurant .my-component {
  --accent-color: hsl(25, 85%, 55%); /* Warm restaurant color */
}

/* Style that applies only to core */
.concept-core .my-component {
  /* Core-specific styles */
}
```

## The Composer Pattern

The Composer Pattern enables concepts to customize **what renders where** without forking pages.

### How It Works

Each concept defines a **composer** that specifies:
- Which components fill each content area (leftPanel, mainStage, rightPanel, etc.)
- Layout mode (standard, dashboard, focus, etc.)
- Feature flag overrides
- Token/style overrides

```typescript
// concepts/composer/composers.ts
export const restaurantComposer: ConceptComposer = {
  id: 'restaurant',
  name: 'Restaurant',
  layoutMode: 'standard',
  components: {
    topBar: 'default',           // Use core TopNavbar
    leftPanel: RestaurantSidebar, // Custom component
    mainStage: 'default',        // Use core MainContent
    rightPanel: null,            // Hide right panel
  },
  featureOverrides: {
    workspaces: true,
  },
  tokenOverrides: {
    '--color-primary-default': 'hsl(25, 85%, 55%)',
  },
};
```

### Component Config Options

| Value | Meaning |
|-------|---------|
| `'default'` | Use the core/default component |
| `ComponentType` | Use a specific component |
| `null` | Hide/disable this area |

### Layout Modes

| Mode | Description |
|------|-------------|
| `standard` | Current Toqan layout (left sidebar, main content, optional right panel) |
| `dashboard` | Main stage is a dashboard/grid, chat moves to panel |
| `focus` | Minimal layout, just main content |
| `split` | Equal split between main areas |

## Three Levels of Customization

| Level | Use When | How |
|-------|----------|-----|
| **Style only** | Different colors, fonts, branding | `tokenOverrides` in composer |
| **Component swap** | Different UI for an area | Set component in `components` |
| **Layout change** | Different arrangement | Change `layoutMode` |

### Example: Custom Sidebar for Restaurant

```typescript
// concepts/restaurant/components/RestaurantSidebar.tsx
import React from 'react';
import { AreaProps } from '../../composer/types';

export const RestaurantSidebar: React.FC<AreaProps> = ({ isOpen, setOpen, isMobile }) => {
  return (
    <aside className="restaurant-sidebar">
      <nav>
        <a href="/restaurant/orders">Orders</a>
        <a href="/restaurant/menu">Menu</a>
        <a href="/restaurant/analytics">Analytics</a>
      </nav>
    </aside>
  );
};
```

Then update the composer:

```typescript
// concepts/composer/composers.ts
import { RestaurantSidebar } from '../restaurant/components/RestaurantSidebar';

export const restaurantComposer: ConceptComposer = {
  // ...
  components: {
    leftPanel: RestaurantSidebar,  // Use custom sidebar
    mainStage: 'default',
    // ...
  },
};
```

## Best Practices

### DO:
- Keep core components generic and reusable
- Use concept-specific folders for divergent features
- Share hooks, utilities, and design tokens
- Document concept-specific behaviors

### DON'T:
- Add concept conditionals to core components (use CSS classes instead)
- Duplicate core functionality unnecessarily
- Break core when working on concepts

### When to Use Git Branches Instead

Use a git branch when:
- Making breaking changes to core infrastructure
- Experimenting with major architectural changes
- The concept has fully diverged and won't merge back

## Concept Metadata

Each concept can define metadata for UI and configuration:

```typescript
// concepts/restaurant/index.ts
export const meta = {
  id: 'restaurant',
  name: 'Restaurant',
  description: 'Toqan for restaurant owners & SMBs',
  icon: '🍽️',
} as const;

export const featureDefaults = {
  // Override default feature flags for this concept
  newBranding: true,
  workspaces: true,
} as const;
```

## File Reference

### Core Files
- `context/ConceptContext.tsx` - Concept state management
- `concepts/composer/types.ts` - Composer type definitions
- `concepts/composer/composers.ts` - Composer definitions (core, restaurant, etc.)
- `concepts/composer/ComposerContext.tsx` - Composer context provider
- `components/ComposedLayout/ComposedLayout.tsx` - Layout that uses composer

### Concept Files
- `concepts/index.ts` - Concept registry
- `concepts/[name]/index.ts` - Concept entry point
- `concepts/[name]/components/` - Concept-specific components

### App Integration
- `App.tsx` - Concept-aware routing
- `pages/HomePage.tsx` - Uses ComposedLayout
- `components/FeatureMenu/FeatureMenu.tsx` - Concept selector UI
