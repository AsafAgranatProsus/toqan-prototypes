# Example: Implementing Top Navbar Feature

This document shows the **correct** implementation of a new prototype feature using the updated architecture.

## Architecture Overview

**Key Point:** Both `.new-branding` and `.new-feature` classes are applied to the **HTML element**.

```
HTML (<html>):
  .new-branding (master switch)
  .new-top-navbar (feature-specific)

CSS Pattern:
  .new-branding.new-top-navbar { /* requires BOTH on HTML */ }
```

## Step 1: Add Feature Flag

**File: `featureFlags.ts`**

```typescript
export const featureFlags = {
  newBranding: false,      // Master prototype switch
  newTypography: false,
  newTables: false,
  newBubble: false,
  newTopNavbar: false,     // ← Add this (note: camelCase with "new" prefix)
  plays: true,
  // ... other flags
};
```

**Naming Convention:**
- Prototype features: `newFeatureName` (camelCase with "new" prefix)
- Converts to CSS class: `.new-feature-name` (kebab-case)

## Step 2: Add Toggle to Feature Menu (Optional)

**File: `components/FeatureMenu/FeatureMenu.tsx`**

```tsx
<Collapsible closeOnOutsideClick={false}>
  <Collapsible.Trigger className="feature-menu-collapsible-trigger">
    <span>New branding</span>
    <Icons name="ChevronDown" className="chevron-icon" />
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div className="feature-menu-collapsible-content">
      <Toggle
        label="New Branding"
        checked={flags.newBranding}
        onChange={(checked) => setFlag('newBranding', checked)}
      />
      <Toggle
        label="New Typography"
        checked={flags.newTypography}
        onChange={(checked) => setFlag('newTypography', checked)}
      />
      <Toggle
        label="New Bubble"
        checked={flags.newBubble}
        onChange={(checked) => setFlag('newBubble', checked)}
      />
      <Toggle
        label="New Tables"
        checked={flags.newTables}
        onChange={(checked) => setFlag('newTables', checked)}
      />
      {/* Add this: */}
      <Toggle
        label="Top Navbar"
        checked={flags.newTopNavbar}
        onChange={(checked) => setFlag('newTopNavbar', checked)}
      />
    </div>
  </Collapsible.Content>
</Collapsible>
```

## Step 3: Create CSS with Correct Coupling Pattern

**File: `components/TopNavbar/TopNavbar.css`**

```css
/* Top Navbar Prototype
   Requires BOTH .new-branding AND .new-top-navbar on HTML element
   
   How it works:
   - HTML has both classes → styles apply ✅
   - HTML missing .new-branding → styles don't apply (master switch off)
   - HTML missing .new-top-navbar → styles don't apply (feature off)
*/

.new-branding.new-top-navbar {
  /* Navbar container */
  .top-navbar-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: var(--color-ui-background-elevated);
    border-bottom: 1px solid var(--color-ui-border);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-6);
    box-shadow: var(--shadow-sm);
  }

  /* Push main content down when navbar is active */
  .main-content {
    margin-top: 64px;
  }

  /* Hide old header when new navbar is active */
  .main-content__header {
    display: none;
  }
  
  /* Adjust sidebar positioning if needed */
  .sidebar {
    top: 64px;
    height: calc(100vh - 64px);
  }
}

/* ===== PRODUCTION GRADUATION =====
   When ready, change to just .new-top-navbar:

.new-top-navbar {
  .top-navbar-container { ... }
  .main-content { margin-top: 64px; }
  .main-content__header { display: none; }
  .sidebar { top: 64px; height: calc(100vh - 64px); }
}
*/
```

## Step 4: Create TopNavbar Component

**File: `components/TopNavbar/TopNavbar.tsx`**

```tsx
import React from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { Logo } from '../Logo/Logo';
import Button from '../Button/Button';
import { Icons } from '../Icons/Icons';
import './TopNavbar.css';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const { isFeatureActive } = useFeatureFlags();

  // Only render if feature is active
  // isFeatureActive('newTopNavbar') returns: flags.newBranding && flags.newTopNavbar
  if (!isFeatureActive('newTopNavbar')) {
    return null;
  }

  return (
    <nav className="top-navbar-container">
      <div className="top-navbar__left">
        <Logo />
      </div>
      
      <div className="top-navbar__actions">
        <Button variant="tertiary" icon="Search" aria-label="Search" />
        <Button variant="tertiary" icon="Bell" aria-label="Notifications" />
        <Button variant="tertiary" icon="User" aria-label="Account" />
      </div>
    </nav>
  );
};
```

## Step 5: Integrate into App

**File: `App.tsx`**

```tsx
import { TopNavbar } from './components/TopNavbar/TopNavbar';

const AppContent: React.FC = () => {
  const { flags } = useFeatureFlags();
  // ... existing code ...

  return (
    <>
      {/* Add TopNavbar - it will only render when both flags are active */}
      <TopNavbar />
      
      {/* Rest of app */}
      <CustomizationPanel 
        isOpen={isCustomizationOpen} 
        onToggle={handleToggleCustomization} 
      />
      <div className="app-content">
        <FeatureMenu />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* ... */}
        </Routes>
      </div>
    </>
  );
};
```

## How It Works

### Scenario 1: Both Flags Off (Default)
```
HTML classes: (none)
Result: 
  - TopNavbar component returns null
  - CSS .new-branding.new-top-navbar doesn't match
  - Original header shows
```

### Scenario 2: Only newTopNavbar On
```
HTML classes: .new-top-navbar
Result:
  - TopNavbar component returns null (isFeatureActive returns false)
  - CSS .new-branding.new-top-navbar doesn't match
  - Original header shows
```

### Scenario 3: Only newBranding On
```
HTML classes: .new-branding
Result:
  - TopNavbar component returns null (isFeatureActive returns false)
  - CSS .new-branding.new-top-navbar doesn't match
  - Original header shows
```

### Scenario 4: Both Flags On ✅
```
HTML classes: .new-branding .new-top-navbar
Result:
  - TopNavbar component renders!
  - CSS .new-branding.new-top-navbar matches!
  - New navbar shows, old header hidden
```

## Class Application Flow

1. User toggles `newBranding` flag → `DesignSystemContext` adds `.new-branding` to HTML
2. User toggles `newTopNavbar` flag → `DesignSystemContext` adds `.new-top-navbar` to HTML
3. CSS selector `.new-branding.new-top-navbar` now matches!
4. Component checks `isFeatureActive('newTopNavbar')` which returns `true`

## Production Graduation

When the feature is ready for production:

### 1. Update CSS
```css
/* Remove .new-branding requirement */
.new-top-navbar {
  .top-navbar-container { /* ... */ }
  /* ... rest of styles ... */
}
```

### 2. Update Component (optional)
```tsx
// Change from:
if (!isFeatureActive('newTopNavbar')) return null;

// To:
if (!flags.newTopNavbar) return null;

// Or just rely on CSS and always render
```

### 3. Update Default Flag
```typescript
export const featureFlags = {
  // ...
  newTopNavbar: true,  // Now on by default
};
```

### 4. (Later) Remove Flag Entirely
Once fully adopted, remove the flag and make it permanent code.

## Key Takeaways

1. ✅ **Both classes on HTML element** (not HTML + body)
2. ✅ **CSS pattern:** `.new-branding.new-feature { }`
3. ✅ **JS pattern:** `isFeatureActive('newFeature')` for "new" prefixed flags
4. ✅ **Naming:** `newFeatureName` → `.new-feature-name`
5. ✅ **Automatic class application** via `DesignSystemContext`
6. ✅ **Easy graduation** by removing `.new-branding` requirement

