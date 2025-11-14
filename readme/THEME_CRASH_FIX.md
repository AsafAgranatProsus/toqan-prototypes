# Theme Toggle Crash Fix

## Issue Summary

When enabling the "themes" toggle in the meta menu, the app crashed with multiple errors:

1. **Import Error**: `AVATAR_COLORS` not found in `Card.tsx` (used by `Plays.tsx`)
2. **Context Error**: `useTheme` hook used outside of `ThemeProvider` (in `ThemeToggle.tsx` and `GradientBackground.tsx`)

## Root Cause

During the migration from the old `ThemeContext` to the new `DesignSystemContext`, several components were not updated:

1. **Card.tsx**: The `AVATAR_COLORS` export was renamed to `AVATAR_COLORS_LIGHT` and `AVATAR_COLORS_DARK` for theme support
2. **ThemeToggle.tsx**: Still importing from the old `ThemeContext`
3. **GradientBackground.tsx**: Still importing from the old `ThemeContext`
4. **Plays.tsx**: Still importing the old `AVATAR_COLORS` constant

## Files Fixed

### 1. components/Plays/Plays.tsx

**Changes:**
- Updated import to use `AVATAR_COLORS_LIGHT` and `AVATAR_COLORS_DARK`
- Added `useDesignSystem` hook import
- Added theme-aware color palette selection:
  ```typescript
  const { isDark } = useDesignSystem();
  const colorPalette = isDark ? AVATAR_COLORS_DARK : AVATAR_COLORS_LIGHT;
  ```
- Replaced all instances of `AVATAR_COLORS` with `colorPalette`

### 2. components/ThemeToggle/ThemeToggle.tsx

**Changes:**
- Replaced import from `ThemeContext` to `DesignSystemContext`
- Updated hook usage:
  ```typescript
  // Old:
  const { themeName, toggleTheme } = useTheme();
  const isDark = themeName === 'dark';
  
  // New:
  const { themeMode, toggleTheme, isDark } = useDesignSystem();
  ```
- The `onClick` handler continues to use `toggleTheme` (which exists in the new context)

### 3. components/GradientBackground/GradientBackground.tsx

**Changes:**
- Replaced import from `ThemeContext` to `DesignSystemContext`
- Replaced theme.colors.gradientMelange with inline color arrays:
  ```typescript
  const { isDark } = useDesignSystem();
  
  const colors = isDark
    ? [
        'rgba(91, 143, 255, 0.4)',   // Blue
        'rgba(175, 82, 222, 0.4)',   // Purple
        'rgba(255, 85, 85, 0.3)',    // Coral red
        'rgba(85, 217, 158, 0.3)',   // Mint green
      ]
    : [
        'rgba(196, 181, 253, 0.5)',
        'rgba(165, 243, 252, 0.4)',
      ];
  ```

## Verification

- ✅ No linting errors in all modified files
- ✅ No remaining references to `ThemeContext` in components
- ✅ No remaining references to old `useTheme` hook
- ✅ No remaining references to old `AVATAR_COLORS` constant

## Testing Checklist

- [ ] Enable "themes" toggle in meta menu
- [ ] Verify app doesn't crash
- [ ] Toggle between light and dark themes
- [ ] Verify Plays component shows correct avatar colors
- [ ] Verify GradientBackground shows correct gradient colors
- [ ] Verify ThemeToggle button works correctly

## Next Steps

All components have been successfully migrated from the old `ThemeContext` to the new `DesignSystemContext`. The theme system is now consistent across the entire application.

