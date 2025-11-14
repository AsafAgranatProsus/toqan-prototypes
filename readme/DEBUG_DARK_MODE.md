# 🐛 Dark Mode Still Not Working - Debug Guide

## 🔍 What to Check Now

I've added a **ThemeDebugger** component that will show you exactly what's happening. Look for a black panel in the bottom-left corner of your screen.

### **Step 1: Check the Debug Panel**

When you refresh your browser, you should see:

```
Theme Debugger
━━━━━━━━━━━━━━━━

Context State:
Design: old | Theme: light
isDark: false | isNewDesign: false

Body Classes:
design-old theme-light old-toqan

Computed Tokens:
--color-ui-background: #F9FAFB
--color-text-default: #111827
--color-ui-border: #c8d8ea
--color-primary-default: #4426d9
--theme-bg-app: #F9FAFB (or the actual value)
--theme-text-main: #111827 (or the actual value)
```

### **Step 2: Toggle to Dark Mode**

Press `Alt + /` → Toggle theme to Dark

The debug panel should UPDATE to show:

```
Context State:
Design: old | Theme: dark  ← Should say "dark"
isDark: true | isNewDesign: false

Body Classes:
design-old theme-dark old-toqan  ← Should have "theme-dark"

Computed Tokens:
--color-ui-background: #0A0A0B  ← Should be DARK!
--color-text-default: #F5F5F7  ← Should be LIGHT!
--color-ui-border: #2A2A2D
--color-primary-default: #5B8FFF
--theme-bg-app: #0A0A0B
--theme-text-main: #F5F5F7
```

### **Step 3: What to Report**

Tell me:
1. **Does the debug panel appear?** (black box in bottom-left)
2. **What does "Body Classes" show when in dark mode?**
3. **What are the computed token values when in dark mode?**

---

## 🔧 Possible Issues & Fixes

### **Issue 1: Classes Not Being Applied**

If "Body Classes" doesn't show `theme-dark`:
- **Problem:** Context isn't applying classes
- **Fix:** Check browser console for React errors

### **Issue 2: Classes Applied But Tokens Not Changing**

If body has `theme-dark` but tokens stay light:
- **Problem:** CSS selector specificity issue
- **Fix:**

Check if there's a CSS syntax error in `tokens.css`. Run:
```bash
# In VSCode terminal:
npx stylelint tokens.css
```

Or check browser DevTools → Console for CSS parse errors.

### **Issue 3: Tokens Changing But UI Not Updating**

If tokens show correct values but UI stays light:
- **Problem:** Components using hardcoded colors or wrong tokens
- **Fix:** Need to update component CSS files

---

## 🔎 Manual Debug Steps

### **Option 1: Browser DevTools Inspection**

1. **Open DevTools** (F12)
2. **Go to Elements tab**
3. **Select `<body>` element**
4. **Check classes** - Should see `theme-dark` when dark mode is active
5. **Go to Computed tab**
6. **Search for `--color-ui-background`**
7. **Check value** - Should be `#0A0A0B` in dark mode

### **Option 2: Check Token Cascade**

In DevTools Computed tab, click the arrow next to a token to see where it's defined:

```
--color-ui-background: #0A0A0B
  ↳ .theme-dark:not(.design-new) { ... } tokens.css:166
```

If it shows `:root { ... } tokens.css:64` instead, the `.theme-dark` selector isn't being applied!

---

## 🎯 Expected Behavior

### **Correct Cascade for Dark Mode:**

```css
/* 1. :root defines light values (tokens.css) */
:root {
  --color-ui-background: #F9FAFB; /* Light */
}

/* 2. .theme-dark overrides with dark values (tokens.css) */
.theme-dark:not(.design-new) {
  --color-ui-background: #0A0A0B; /* Dark - WINS! */
}

/* 3. Legacy tokens reference color tokens (tokens.css) */
:root {
  --theme-bg-app: var(--color-ui-background); /* Uses #0A0A0B */
}

/* 4. Components use tokens (styles.css) */
.app-container {
  background-color: var(--theme-bg-app); /* Gets #0A0A0B */
}
```

---

## 💡 Quick Fix Ideas

### **If Nothing Is Working:**

Add this TEMPORARY debug CSS at the TOP of `styles.css` (after imports):

```css
/* TEMPORARY DEBUG - REMOVE AFTER TESTING */
.theme-dark * {
  border: 1px solid red !important;
}
```

If everything gets a red border when you toggle dark, the class IS being applied!

Then add:

```css
.theme-dark {
  background: #000 !important;
  color: #fff !important;
}
```

If the background turns black, the class works but tokens aren't being applied.

---

## 📞 What to Share

**Please share screenshot or copy-paste the debug panel contents:**

1. Light mode debug output
2. Dark mode debug output  
3. Any console errors
4. Browser DevTools → Elements → body classes

This will help me pinpoint the EXACT issue!

---

## 🚨 Emergency Fix

If you need dark mode working NOW while we debug, you can force it with this in `styles.css`:

```css
/* FORCE DARK MODE - TEMPORARY */
body.theme-dark {
  --color-ui-background: #0A0A0B !important;
  --color-ui-background-elevated: #141416 !important;
  --color-ui-border: #2A2A2D !important;
  --color-text-default: #F5F5F7 !important;
  --color-text-secondary: #D1D1D6 !important;
  --color-text-tertiary: #8E8E93 !important;
}
```

This will override everything and make dark mode work, but it's not the proper solution. Once we identify the real issue, we'll remove this.

