# Testing Guide - Design System Implementation

## 🧪 How to Test the Design System

### **Step 1: Access the Feature Menu**

Press **`Alt + /`** (on Windows/Linux) or **`Option + /`** (on Mac) to open the Feature Menu overlay.

The Feature Menu now shows:
- **Design System** section with current design and theme
- **Light/Dark toggle** for theme switching
- **Feature Flags** including "Show Design System Demo"
- **New Branding** flag to switch between OLD and NEW designs

### **Step 2: Test the Design System Demo**

1. Open Feature Menu (`Alt + /`)
2. Toggle **"Show Design System Demo"** to ON
3. You'll see a comprehensive demo showing:
   - All color tokens
   - All spacing tokens
   - All border radius tokens
   - All typography tokens
   - All shadow tokens
   - Button component examples

### **Step 3: Test All 4 Combinations**

You MUST test each component in all 4 combinations:

#### **Combination 1: OLD Design + Light Mode** ✅
```
Feature Menu Settings:
□ New Branding: OFF
□ Theme Mode: Light (default)

What to check:
- Colors match OLD design (#4426d9 purple)
- Light background (#F9FAFB)
- Text is dark and readable
- Buttons have correct OLD design colors
```

#### **Combination 2: OLD Design + Dark Mode** ✅
```
Feature Menu Settings:
□ New Branding: OFF
☑ Theme Mode: Dark (toggle to dark)

What to check:
- Colors adapt to dark theme (#5B8FFF lighter purple)
- Dark background (#0A0A0B)
- Text is light and readable
- Buttons have correct OLD dark colors
- Contrast is sufficient (WCAG AA minimum)
```

#### **Combination 3: NEW Design + Light Mode** ✅
```
Feature Menu Settings:
☑ New Branding: ON
□ Theme Mode: Light (toggle back to light)

What to check:
- Colors match NEW design (HSL-based)
- Light background (hsl(212 45% 98%))
- Text is dark and readable
- Buttons have correct NEW design colors
- Visual difference from OLD design is clear
```

#### **Combination 4: NEW Design + Dark Mode** ✅
```
Feature Menu Settings:
☑ New Branding: ON
☑ Theme Mode: Dark (toggle to dark again)

What to check:
- Colors adapt to NEW dark theme
- Dark background (hsl(212 45% 8%))
- Text is light and readable
- Buttons have correct NEW dark colors
- Contrast is sufficient
```

---

## 📋 Component Testing Checklist

Use this checklist for EVERY component you refactor:

```markdown
## Component: _______________

### Visual Testing

**Combination 1: OLD Design + Light Mode**
- [ ] Component renders correctly
- [ ] All colors are appropriate
- [ ] Spacing looks correct
- [ ] Typography is readable
- [ ] Shadows are visible
- [ ] Borders are visible
- [ ] No hardcoded values visible

**Combination 2: OLD Design + Dark Mode**
- [ ] Component renders correctly
- [ ] Colors adapt to dark theme
- [ ] Text contrast is sufficient
- [ ] Interactive states work (hover, focus, active)
- [ ] No color artifacts

**Combination 3: NEW Design + Light Mode**
- [ ] Component renders correctly
- [ ] Visual difference from OLD design
- [ ] All tokens work correctly
- [ ] No visual regressions

**Combination 4: NEW Design + Dark Mode**
- [ ] Component renders correctly
- [ ] Colors adapt correctly
- [ ] Consistent with NEW design language
- [ ] No visual regressions

### Interactive Testing

- [ ] Hover states work in all 4 combinations
- [ ] Focus states work (keyboard navigation)
- [ ] Active/pressed states work
- [ ] Disabled states work
- [ ] Loading states work (if applicable)
- [ ] Animations/transitions are smooth

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader accessible (if applicable)
- [ ] Touch targets are adequate (mobile)

### Code Quality

- [ ] No hardcoded colors
- [ ] No hardcoded spacing values
- [ ] No hardcoded font sizes
- [ ] All tokens use `var(--token-name)` syntax
- [ ] CSS is organized and commented
- [ ] No unused styles
```

---

## 🔍 What to Look For

### **Good Signs** ✅

- Smooth transitions between themes
- Consistent spacing across all modes
- Readable text in all combinations
- Shadows are subtle but visible
- Colors have good contrast
- Interactive states are clear
- No flash of unstyled content

### **Warning Signs** ⚠️

- Colors don't change when toggling
- Text is hard to read in dark mode
- Spacing looks inconsistent
- Shadows disappear in dark mode
- Interactive states look the same
- Component breaks in one mode

### **Problems to Fix** ❌

- Hardcoded colors (`#4426d9` instead of tokens)
- Hardcoded spacing (`12px` instead of `var(--space-3)`)
- Inline styles overriding tokens
- Missing dark mode styles
- Poor contrast ratios
- Broken layouts in specific combinations

---

## 🛠️ Debugging Tips

### **Problem: Colors Not Changing**

1. Check if component uses tokens:
   ```css
   /* ❌ Bad */
   .my-component {
     background-color: #4426d9;
   }
   
   /* ✅ Good */
   .my-component {
     background-color: var(--color-primary-default);
   }
   ```

2. Verify tokens.css is imported in styles.css
3. Check browser DevTools → Computed styles
4. Look for inline styles overriding tokens

### **Problem: Dark Mode Broken**

1. Check if `.theme-dark` class is on `<body>`
2. Verify dark mode tokens are defined in tokens.css
3. Check for hardcoded light colors
4. Test in both OLD and NEW designs

### **Problem: Design Not Switching**

1. Verify `newBranding` flag is toggled
2. Check if `.design-new` class is on `<body>`
3. Hard refresh the page (Ctrl+Shift+R)
4. Clear browser cache if needed

### **Problem: Tokens Undefined**

1. Check import order in styles.css (tokens.css should be first)
2. Verify token name spelling
3. Check browser console for errors
4. Restart dev server

---

## 📸 Visual Regression Testing

### **Taking Screenshots**

For each component, take screenshots in all 4 combinations:

```
/screenshots
  /Button
    - old-light.png
    - old-dark.png
    - new-light.png
    - new-dark.png
  /Card
    - old-light.png
    - old-dark.png
    - new-light.png
    - new-dark.png
```

### **Comparison Workflow**

1. **Before refactoring:** Take screenshots in all 4 modes
2. **After refactoring:** Take screenshots in all 4 modes
3. **Compare side by side:** Look for differences
4. **Verify intentional changes only**

---

## 🎯 Testing Workflow

### **For Each Component You Refactor:**

```
1. ✅ Read current CSS
   └─ Identify hardcoded values
   
2. ✅ Refactor to use tokens
   └─ Replace all hardcoded values
   
3. ✅ Save and hot reload
   
4. ✅ Open Feature Menu (Alt+/)
   
5. ✅ Test Combination 1 (OLD + Light)
   └─ Visual check
   └─ Interactive check
   
6. ✅ Toggle to Dark
   └─ Test Combination 2 (OLD + Dark)
   
7. ✅ Toggle New Branding ON
   └─ Test Combination 3 (NEW + Light)
   
8. ✅ Toggle to Dark
   └─ Test Combination 4 (NEW + Dark)
   
9. ✅ Test edge cases
   └─ Disabled states
   └─ Loading states
   └─ Error states
   └─ Empty states
   
10. ✅ Fix any issues found
    └─ Repeat testing
```

---

## 🚀 Quick Test Command

Run through this quick checklist between changes:

```
□ Alt+/ (open menu)
□ Check current design/theme
□ Toggle theme (test 1 → 2)
□ Toggle design (test 2 → 4)
□ Toggle theme (test 4 → 3)
□ Toggle design back (test 3 → 1)
□ All looks good? ✅
```

---

## 📊 Example: Testing Button Component

### **Test 1: OLD + Light**
```css
Background: #4426d9 (purple)
Text: #FFFFFF (white)
Border radius: 0.5rem
Padding: 0.75rem 1rem
```

### **Test 2: OLD + Dark**
```css
Background: #5B8FFF (lighter purple)
Text: #FFFFFF (white)
Border radius: 0.5rem (same)
Padding: 0.75rem 1rem (same)
```

### **Test 3: NEW + Light**
```css
Background: hsl(250 70% 50%) (purple)
Text: hsl(0 0% 100%) (white)
Border radius: 0.5rem (same)
Padding: 0.75rem 1rem (same)
```

### **Test 4: NEW + Dark**
```css
Background: hsl(250 70% 60%) (lighter purple)
Text: hsl(0 0% 100%) (white)
Border radius: 0.5rem (same)
Padding: 0.75rem 1rem (same)
```

**Result:** ✅ All combinations work!

---

## 🎉 Success Criteria

Your testing is complete when:

- ✅ Component works in all 4 combinations
- ✅ No visual regressions
- ✅ No hardcoded values remain
- ✅ Interactive states work
- ✅ Accessibility is maintained
- ✅ Code is clean and documented
- ✅ Screenshots taken for comparison
- ✅ Other developers can understand the changes

---

## 📝 Reporting Issues

If you find issues during testing:

1. **Document the issue:**
   - Which combination (1-4)?
   - What's wrong?
   - Expected vs actual behavior
   - Screenshot if visual

2. **Check the token:**
   - Is it defined in tokens.css?
   - Is it in the right selector?
   - Is the value correct?

3. **Fix and retest:**
   - Make the fix
   - Test all 4 combinations again
   - Verify fix doesn't break other modes

---

## 🔄 Continuous Testing

After completing refactoring:

- [ ] Test weekly as you add features
- [ ] Test before major releases
- [ ] Test after updating design tokens
- [ ] Test on different browsers
- [ ] Test on different screen sizes
- [ ] Test with real user scenarios

---

**Happy Testing!** 🎨✨

