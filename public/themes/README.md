# Theme Library

This folder contains custom themes for Toqan. Themes are CSS files that override the default design tokens.

## File Structure

```
public/themes/
├── themes.json      ← Manifest (source of truth)
├── README.md        ← This file
├── forest-green.css ← Example theme
└── [your-theme].css ← Your custom themes
```

## Adding Themes

### During Development (Automatic)

1. Open the **M3 Theme Builder** at `/design-system-alt`
2. Design your theme using the color pickers
3. Enter a **Theme Name** in the export section
4. Click **"Save to Library"**

That's it! The theme is automatically:
- Saved as a CSS file to `public/themes/`
- Added to `themes.json` manifest
- Available in the theme dropdown immediately

### In Production (Manual)

Since deployed apps can't write to the filesystem, you'll need to add themes manually:

#### Step 1: Export the Theme

1. Open the M3 Theme Builder
2. Design your theme
3. Click **"Download Theme"** to get the CSS file

#### Step 2: Add the CSS File

Upload or copy the CSS file to your `public/themes/` folder:
```
public/themes/my-new-theme.css
```

#### Step 3: Update the Manifest

Edit `public/themes/themes.json` and add your theme entry:

```json
{
  "themes": [
    {
      "id": "default",
      "name": "Default",
      "description": "The default Toqan theme",
      "filename": ""
    },
    {
      "id": "my-new-theme",
      "name": "My New Theme",
      "description": "A custom theme",
      "sourceColor": "#6750A4",
      "filename": "my-new-theme.css",
      "displayFont": "Playfair Display",
      "bodyFont": "Inter",
      "contrastLevel": 0.5
    }
  ]
}
```

#### Step 4: Deploy

Redeploy your application. The new theme will appear in the theme selector.

## Manifest Schema

Each theme entry in `themes.json` has these fields:

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier (lowercase, hyphenated) |
| `name` | ✅ | Display name in the UI |
| `filename` | ✅ | CSS filename (empty string for default) |
| `description` | ❌ | Brief description |
| `sourceColor` | ❌ | Hex color used to generate the theme |
| `displayFont` | ❌ | Google Font for headings (e.g., "Playfair Display") |
| `bodyFont` | ❌ | Google Font for body text (e.g., "Inter") |
| `contrastLevel` | ❌ | Contrast level: 0 (standard), 0.5 (medium), 1 (high) |

## Theme CSS Format

Theme files define tokens at three levels:

### 1. Semantic Tokens (`--color-*`)
Light and dark mode color assignments:

```css
/* Light mode */
:root,
[data-theme="light"] {
  --color-primary-default: #6750A4;
  --color-primary-hover: #4F378B;
  /* ... more tokens ... */
}

/* Dark mode */
.design-new.theme-dark {
  --color-primary-default: #D0BCFF;
  --color-primary-hover: #E8DEF8;
  /* ... more tokens ... */
}
```

### 2. Tonal Palettes (`--palette-*`)
Full color scales for advanced usage:

```css
:root {
  /* Primary palette - 15 tones */
  --palette-primary-0: #000000;
  --palette-primary-10: #21005D;
  --palette-primary-20: #381E72;
  --palette-primary-30: #4F378B;
  --palette-primary-40: #6750A4;  /* Default in light mode */
  --palette-primary-50: #7F67BE;
  --palette-primary-60: #9A82DB;
  --palette-primary-70: #B69DF8;
  --palette-primary-80: #D0BCFF;  /* Default in dark mode */
  --palette-primary-90: #EADDFF;
  --palette-primary-95: #F6EDFF;
  --palette-primary-99: #FFFBFE;
  --palette-primary-100: #FFFFFF;

  /* Same structure for: secondary, tertiary, error, neutral, neutral-variant */
  /* Extended colors also get full palettes */
}
```

### Usage Example

```css
/* Use semantic tokens for standard UI */
.button {
  background: var(--color-primary-default);
}

/* Use palette tokens for custom components */
.custom-badge {
  background: var(--palette-primary-90);
  color: var(--palette-primary-10);
}
```

## Tips

- **Theme IDs** should be lowercase with hyphens (e.g., `ocean-blue`, `forest-green`)
- **Filenames** should match the ID (e.g., `ocean-blue.css`)
- The **default theme** has an empty filename and uses `tokens.css` values
- Themes are cached in the browser; users may need to refresh to see new themes

