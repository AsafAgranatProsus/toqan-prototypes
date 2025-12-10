# GradientBackground - Migration Guide

## Overview

This guide helps you migrate from the old `GradientBackground` to the enhanced version, or start using the new organic gradient features.

## No Migration Required! 🎉

The enhanced `GradientBackground` is **100% backward compatible**. All existing code will continue to work exactly as before.

```tsx
// This still works exactly the same!
<GradientBackground />
```

## Opt-In to New Features

The new features are opt-in via props. Here's how to start using them:

---

## Scenario 1: Keep Current Behavior (Do Nothing)

If you're happy with the current blob gradient animation, **no changes needed**.

```tsx
// Before (still works)
<GradientBackground />

// After (same thing)
<GradientBackground />
```

**Result:** Same animated blob gradient as before. ✅

---

## Scenario 2: Try Random Organic Gradient

Want to try the new WebGL gradient with random parameters?

```tsx
// Before
<GradientBackground />

// After (add type="organic")
<GradientBackground type="organic" />
```

**Result:** Random organic gradient with noise patterns. Each reload will show a different gradient. ✨

---

## Scenario 3: Use Custom Organic Gradient

Want a specific gradient that looks the same every time?

### Step 1: Use the Gradient Playground
1. Open the Gradient Playground page
2. Select "Organic Gradient"
3. Adjust parameters until you like it
4. Note the configuration or export it

### Step 2: Apply the Configuration

```tsx
// Before
<GradientBackground />

// After
const myGradient: OrganicGradientConfig = {
  seed: 42,
  blurIntensity: 1.5,
  noiseScale: 2.5,
  grainIntensity: 0.2,
  iterations: 40,
  noiseAlgorithm: 'simplex',
  colors: [
    { color: '#191a66', alpha: 1.0, threshold: 0.0 },
    { color: '#19ccc1', alpha: 0.9, threshold: 0.5 },
    { color: '#cc1980', alpha: 0.85, threshold: 0.8 },
  ],
};

<GradientBackground type="organic" config={myGradient} />
```

**Result:** The exact gradient you designed in the playground. 🎨

---

## Scenario 4: Remove Animation

Don't want the gradient to animate?

```tsx
// Before (animated)
<GradientBackground />

// After (static)
<GradientBackground animate={false} />
```

**Result:** Static gradient that doesn't change over time. ⏸️

---

## Scenario 5: Customize Animation Speed

Want to change how fast the gradient animates?

```tsx
// Before (5 second intervals)
<GradientBackground />

// After (3 second intervals)
<GradientBackground animationInterval={3000} />
```

**Result:** Gradient changes every 3 seconds instead of 5. ⏩

---

## Scenario 6: Use Exported Gradient from Playground

### Step 1: Export from Playground
1. Open Gradient Playground
2. Select "Organic Gradient"
3. Design your gradient
4. Click "Export as Themed Frame"
5. Save the JSON file to your project (e.g., `gradients/my-gradient.json`)

### Step 2: Import and Use

```tsx
import myGradient from './gradients/my-gradient.json';
import { gradientFrameToConfig } from './utils/gradientUtils';

// Convert theme tokens to actual colors
const config = gradientFrameToConfig(myGradient);

function MyPage() {
  return (
    <GradientBackground type="organic" config={config} />
  );
}
```

**Result:** Theme-aware gradient that adapts to light/dark mode. 🌓

---

## Common Patterns

### Pattern 1: Different Gradients for Different Pages

```tsx
// Homepage - Vibrant
<GradientBackground 
  type="organic" 
  config={vibrantConfig}
/>

// Settings Page - Calm
<GradientBackground 
  type="organic" 
  config={calmConfig}
/>

// Error Page - Default
<GradientBackground />
```

### Pattern 2: Conditional Gradient Type

```tsx
function PageWithGradient({ useOrganic = false }) {
  return (
    <GradientBackground 
      type={useOrganic ? 'organic' : 'blob'}
    />
  );
}
```

### Pattern 3: Feature Flag Controlled

```tsx
function PageWithGradient() {
  const { flags } = useFeatureFlags();
  
  return (
    <GradientBackground 
      type={flags.useOrganicGradient ? 'organic' : 'blob'}
    />
  );
}
```

### Pattern 4: User Preference

```tsx
function PageWithGradient() {
  const { userPreferences } = useUser();
  
  return (
    <GradientBackground 
      type={userPreferences.gradientType}
      animate={userPreferences.animateGradient}
    />
  );
}
```

---

## Performance Considerations

### When to Use Blob Gradient
✅ Mobile devices  
✅ Low-end hardware  
✅ Pages with heavy animations  
✅ Need better battery life  

### When to Use Organic Gradient
✅ Desktop/high-end devices  
✅ Hero sections / landing pages  
✅ Marketing pages  
✅ Static backgrounds (animate={false})  

### Performance Tuning for Organic Gradient

**Low-end devices:**
```tsx
<GradientBackground 
  type="organic"
  config={{ 
    iterations: 20,  // Lower = faster
    ...otherSettings 
  }}
  animate={false}    // Disable animation
/>
```

**High-end devices:**
```tsx
<GradientBackground 
  type="organic"
  config={{ 
    iterations: 60,  // Higher = smoother
    ...otherSettings 
  }}
/>
```

---

## Troubleshooting

### Problem: Gradient Not Showing

**Solution 1:** Check z-index
```tsx
<div style={{ position: 'relative', zIndex: 1 }}>
  Your content (should be above gradient)
</div>
```

**Solution 2:** Ensure parent has height
```tsx
<div style={{ height: '100vh' }}>
  <GradientBackground />
</div>
```

### Problem: WebGL Not Working

**Solution:** Fallback to blob gradient
```tsx
function SafeGradient() {
  const [hasWebGL, setHasWebGL] = useState(true);
  
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const hasGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    setHasWebGL(hasGL);
  }, []);
  
  return (
    <GradientBackground 
      type={hasWebGL ? 'organic' : 'blob'}
    />
  );
}
```

### Problem: Performance Issues

**Solution 1:** Lower iterations
```tsx
config={{ iterations: 20 }}
```

**Solution 2:** Disable animation
```tsx
animate={false}
```

**Solution 3:** Use blob gradient
```tsx
type="blob"
```

---

## Step-by-Step Migration Example

Let's say you have this existing code:

```tsx
// old-page.tsx
import GradientBackground from './components/GradientBackground/GradientBackground';

function OldPage() {
  return (
    <div className="page">
      <GradientBackground />
      <div className="content">
        <h1>My Page</h1>
      </div>
    </div>
  );
}
```

### Step 1: Try Organic Gradient (5 minutes)
```tsx
// Just change one prop to test
<GradientBackground type="organic" />
```

### Step 2: Find Your Perfect Settings (15 minutes)
1. Open Gradient Playground
2. Experiment with settings
3. Export configuration

### Step 3: Apply Custom Config (5 minutes)
```tsx
const myConfig: OrganicGradientConfig = {
  // Paste exported config here
};

<GradientBackground type="organic" config={myConfig} />
```

### Step 4: Optimize (5 minutes)
```tsx
<GradientBackground 
  type="organic" 
  config={myConfig}
  animate={false}  // If animation not needed
/>
```

**Total time: ~30 minutes** ⏱️

---

## Checklist for Migration

- [ ] Identify pages using `<GradientBackground />`
- [ ] Decide which should get organic gradients
- [ ] Design gradients in playground
- [ ] Export and save configurations
- [ ] Apply configurations to pages
- [ ] Test on different devices
- [ ] Optimize performance if needed
- [ ] Update documentation for your team

---

## Need Help?

**Documentation:**
- Full Docs: `components/GradientBackground/README.md`
- Quick Reference: `components/GradientBackground/QUICK_REFERENCE.md`
- Examples: `examples/GradientBackgroundExamples.tsx`

**Tools:**
- Demo Page: `pages/GradientBackgroundDemoPage.tsx`
- Gradient Playground: Your existing playground
- Utility Functions: `utils/gradientUtils.ts`

**Testing:**
- Testing Checklist: `TESTING_CHECKLIST.md`

---

## Summary

✅ **Backward Compatible** - No migration required  
✅ **Opt-In Features** - Use new features when ready  
✅ **Easy to Try** - Just add `type="organic"`  
✅ **Fully Documented** - Comprehensive docs included  
✅ **Production Ready** - Tested and validated  

Start simple, experiment in the playground, and enhance gradually! 🚀

