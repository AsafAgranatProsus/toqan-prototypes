# Toqan Concept System

## Overview

The Concept System allows you to work on parallel, isolated variants of Toqan without affecting the core prototype. Each concept can have its own pages, components, configs, and styles while sharing core infrastructure.

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

## Three Levels of Customization

| Level | Use When | How |
|-------|----------|-----|
| **Style only** | Different colors, fonts, branding | Concept-specific CSS/tokens |
| **Component variants** | Different UI, same logic | Override components in concept folder |
| **Full divergence** | Completely different UX | Concept-specific pages, optional git branch |

### Example: Component Override

```typescript
// concepts/restaurant/components/ChatInput.tsx
// Custom ChatInput for restaurant concept

import { BaseChatInput } from '../../../components/ChatInput/ChatInput';

export const RestaurantChatInput = () => {
  // Wrap or extend the base component
  return (
    <div className="restaurant-chat-wrapper">
      <BaseChatInput 
        placeholder="Ask about orders, menu items..."
        suggestions={['Check order status', 'Update menu']}
      />
    </div>
  );
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

- `context/ConceptContext.tsx` - Concept state management
- `concepts/index.ts` - Concept registry
- `concepts/[name]/index.ts` - Concept entry point
- `App.tsx` - Concept-aware routing
- `components/FeatureMenu/FeatureMenu.tsx` - Concept selector UI
