# Theme Customization System

## Overview

The Theme Customization Panel is a powerful, reactive design token editor that allows real-time customization of your application's visual design. Access it from anywhere in your application with a floating button.

## Features

✅ **Real-time Updates**: Changes apply instantly to the entire application
✅ **Multi-format Color Support**: Supports HEX, RGB, and HSL color formats
✅ **Smart Controls**: Auto-switching inputs based on token type (colors, sliders, text)
✅ **Theme Management**: Save, load, export, and import custom themes
✅ **localStorage Persistence**: Your customizations persist across sessions
✅ **Base Theme Inheritance**: Only store overrides, keeping data lean (DRY principle)
✅ **Light & Dark Modes**: Each theme includes both light and dark variants
✅ **Advanced Mode**: Toggle to show all tokens including legacy ones

## Getting Started

### Opening the Panel

Click the floating **paintbrush icon** in the bottom-left corner of your screen. The panel will slide in from the left, pushing content to the right.

### Selecting a Base Theme

1. Use the **Base Theme** dropdown at the top of the panel
2. Choose between:
   - **Default OLD**: Original design system (light mode only)
   - **Default NEW**: New design system (light + dark modes)

### Customizing Tokens

The panel organizes tokens by category:

#### **Colors**
- **Primary**: Brand colors, hover states
- **UI**: Backgrounds, borders, shadows, overlays
- **Text**: Default, secondary, tertiary, placeholders, accents
- **Status**: Info, error, warning, success states
- **Tags**: Date, beta, recommended tag colors

#### **Visual Effects**
- **Shadows**: Small, default, medium, large, modal, input
- **Border Radius**: Small, default, medium, large, extra-large, full

#### **Typography** (Advanced Mode)
- **Font Sizes**: Body and heading scales
- **Font Weights**: Regular, medium, semibold, bold

#### **Spacing** (Advanced Mode)
- **Space Scale**: 1-16 (4px to 64px)

### Control Types

The panel automatically renders the appropriate control based on token type:

- **Color Tokens**: Multi-format color picker with live preview
- **Shadows & Dimensions**: Text input for CSS values
- **0-1 Values**: Slider with manual input (for opacity, etc.)
- **0-100 Values**: Slider with manual input (for percentages)

### Saving Your Work

#### Save as Custom Theme
1. Customize tokens to your liking
2. Click the **Save As** button
3. Enter a name for your theme
4. Your theme appears in the "Saved Themes" list

#### Export Theme
1. Click the **Export** button
2. A JSON file downloads with your theme data
3. Share this file with your team or save it as a backup

#### Import Theme
1. Click the **Import** button
2. Select a theme JSON file
3. The theme loads and applies immediately

### Resetting

Click the **Reset** button to clear all customizations and return to the selected base theme.

## Technical Architecture

### DRY Theme Model

Themes use an inheritance model to minimize data storage:

```typescript
{
  id: "custom-theme-1",
  name: "Ocean Blue",
  baseThemeId: "default-new",
  lightOverrides: {
    "--color-primary-default": "hsl(200 70% 50%)"
  },
  darkOverrides: {
    "--color-primary-default": "hsl(200 70% 60%)"
  }
}
```

Only changed tokens are stored. Everything else inherits from the base theme.

### Mode-Specific Editing

When you tweak a token, it only affects the **current mode** (light or dark). Switch modes using the theme toggle in your app to customize the other variant.

### Reactive Updates

Changes apply immediately via CSS custom properties:
- Token change → Update CSS variable on `:root` → All components update instantly
- Debounced localStorage save (300ms) for performance
- No page refresh needed

### localStorage Keys

- `toqan-active-theme`: Current theme with overrides
- `toqan-custom-themes`: Array of saved custom themes

## File Structure

```
/themes
  ├── baseThemes.ts          # Base theme definitions (OLD, NEW)
  └── tokenMetadata.ts       # Token configuration and categories

/components/CustomizationPanel
  ├── CustomizationPanel.tsx # Main panel component
  ├── CustomizationPanel.css # Panel styles
  ├── TokenControl.tsx       # Smart control component
  ├── TokenControl.css       # Control styles
  ├── ColorPicker.tsx        # Multi-format color picker
  └── ColorPicker.css        # Color picker styles

/context
  └── ThemeCustomizationContext.tsx  # State management, localStorage, export/import
```

## API Reference

### useThemeCustomization Hook

```typescript
const {
  // Current state
  activeTheme,          // Current theme object
  baseTheme,            // Selected base theme
  isCustomized,         // Has user made changes?
  
  // Actions
  setTokenValue,        // Update a token value
  resetToBase,          // Clear all customizations
  switchBaseTheme,      // Change base theme
  saveAsCustomTheme,    // Save current as new theme
  loadCustomTheme,      // Load a saved theme
  deleteCustomTheme,    // Delete a saved theme
  exportTheme,          // Get JSON string
  importTheme,          // Load from JSON string
  
  // Data
  customThemes,         // Array of saved themes
  getCurrentTokenValue, // Get current value of a token
} = useThemeCustomization();
```

### Creating Custom Base Themes

Edit `themes/baseThemes.ts`:

```typescript
export const myCustomTheme: BaseTheme = {
  id: 'my-theme',
  name: 'My Custom Theme',
  description: 'A beautiful custom theme',
  light: {
    '--color-primary-default': '#FF6B6B',
    // ... all other tokens
  },
  dark: {
    '--color-primary-default': '#FF8787',
    // ... dark mode tokens
  },
};

// Add to baseThemes object
export const baseThemes = {
  'default-old': defaultOldTheme,
  'default-new': defaultNewTheme,
  'my-theme': myCustomTheme,
};
```

### Adding New Tokens

Edit `themes/tokenMetadata.ts`:

```typescript
{
  name: '--my-custom-token',
  displayName: 'My Custom Token',
  type: 'color', // or 'slider-0-1', 'slider-0-100', 'string', 'shadow', 'dimension'
  category: 'colors',
  subcategory: 'Custom',
  description: 'Description of what this token does',
  advanced: false, // Show in default view or advanced mode only
}
```

## Best Practices

### Naming Conventions
- Use semantic names: `--color-primary-default`, not `--blue-500`
- Follow existing patterns for consistency
- Group related tokens with prefixes

### Customization Workflow
1. Start with a base theme that's close to your target
2. Switch to the mode you want to customize (light/dark)
3. Adjust tokens by category (colors first, then effects)
4. Switch modes and repeat for the other variant
5. Export and save once satisfied

### Performance
- The system uses debounced writes to localStorage
- CSS variables provide instant visual feedback
- Minimal re-renders due to context optimization

### Team Collaboration
1. One person creates a custom theme
2. Export the JSON file
3. Share via Slack, email, or version control
4. Team members import and use the theme

## Keyboard Shortcuts

- **Enter**: Apply changes and close text input
- **Escape**: Cancel changes in dialogs
- Click outside dialog to close

## Troubleshooting

### Changes not applying?
- Make sure you're editing the correct mode (light/dark)
- Check browser console for errors
- Try resetting to base theme

### Theme won't import?
- Verify JSON file is valid
- Check that baseThemeId exists in your system
- Ensure the file wasn't corrupted

### Panel not visible?
- Check z-index conflicts with other UI elements
- Verify the panel toggle button is not obscured
- Try refreshing the page

## Future Enhancements

Potential improvements for future versions:
- Theme preview thumbnails
- Color palette suggestions
- Token search/filter
- Undo/redo functionality
- Theme versioning
- Cloud sync for teams
- AI-powered color harmonization

## Contributing

To extend the customization system:

1. Add token metadata in `tokenMetadata.ts`
2. Update base themes in `baseThemes.ts`
3. Add corresponding CSS variables in `tokens.css`
4. Test in both light and dark modes
5. Verify export/import works correctly

---

**Happy Customizing! 🎨**

