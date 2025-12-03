/**
 * CSS Token Generation from M3 Schemes
 * Converts M3 color schemes to CSS custom properties
 */

import { 
  Scheme, 
  argbToHex, 
  M3Theme, 
  getTonalPaletteColors, 
  ExtendedColorOutput,
  hexToArgb,
  hexFromHct,
  harmonizeColor
} from './hct';
import { TonalPalette, Hct, Blend, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

/**
 * All M3 color roles
 */
export const M3_COLOR_ROLES = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
  'inverseSurface',
  'inverseOnSurface',
  'inversePrimary',
] as const;

export type M3ColorRole = typeof M3_COLOR_ROLES[number];

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert M3 scheme to CSS variables
 */
export function schemeToCSS(scheme: Scheme, prefix = '--m3'): Record<string, string> {
  const css: Record<string, string> = {};
  
  M3_COLOR_ROLES.forEach(role => {
    const value = (scheme as unknown as Record<string, number>)[role];
    if (typeof value === 'number') {
      const cssVar = `${prefix}-${toKebabCase(role)}`;
      css[cssVar] = argbToHex(value);
    }
  });
  
  return css;
}

/**
 * Generate complete CSS for both light and dark schemes
 */
export function themeToCSS(theme: M3Theme): {
  light: Record<string, string>;
  dark: Record<string, string>;
  palettes: Record<string, Record<string, string>>;
} {
  return {
    light: schemeToCSS(theme.schemes.light),
    dark: schemeToCSS(theme.schemes.dark),
    palettes: {
      primary: paletteToCSSVars(theme.palettes.primary, '--m3-palette-primary'),
      secondary: paletteToCSSVars(theme.palettes.secondary, '--m3-palette-secondary'),
      tertiary: paletteToCSSVars(theme.palettes.tertiary, '--m3-palette-tertiary'),
      neutral: paletteToCSSVars(theme.palettes.neutral, '--m3-palette-neutral'),
      neutralVariant: paletteToCSSVars(theme.palettes.neutralVariant, '--m3-palette-neutral-variant'),
      error: paletteToCSSVars(theme.palettes.error, '--m3-palette-error'),
    },
  };
}

/**
 * Convert tonal palette to CSS variables
 */
function paletteToCSSVars(palette: any, prefix: string): Record<string, string> {
  const colors = getTonalPaletteColors(palette);
  const css: Record<string, string> = {};
  
  colors.forEach(({ tone, hex }) => {
    css[`${prefix}-${tone}`] = hex;
  });
  
  return css;
}

/**
 * Apply M3 CSS variables to document
 */
export function applyM3Theme(
  theme: M3Theme,
  mode: 'light' | 'dark',
  element: HTMLElement = document.documentElement
): void {
  const css = themeToCSS(theme);
  const scheme = mode === 'light' ? css.light : css.dark;
  
  // Apply scheme colors
  Object.entries(scheme).forEach(([name, value]) => {
    element.style.setProperty(name, value);
  });
  
  // Apply palette colors (useful for advanced usage)
  Object.entries(css.palettes).forEach(([, paletteVars]) => {
    Object.entries(paletteVars).forEach(([name, value]) => {
      element.style.setProperty(name, value);
    });
  });
}

/**
 * Remove M3 CSS variables from document
 */
export function removeM3Theme(element: HTMLElement = document.documentElement): void {
  // Remove scheme variables
  M3_COLOR_ROLES.forEach(role => {
    element.style.removeProperty(`--m3-${toKebabCase(role)}`);
  });
  
  // Remove palette variables
  const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
  const palettes = ['primary', 'secondary', 'tertiary', 'neutral', 'neutral-variant', 'error'];
  
  palettes.forEach(palette => {
    tones.forEach(tone => {
      element.style.removeProperty(`--m3-palette-${palette}-${tone}`);
    });
  });
}

/**
 * Convert extended color name to CSS-safe kebab-case
 */
function toSafeKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Export theme as CSS string
 */
export function exportThemeAsCSS(theme: M3Theme, extendedColors: ExtendedColorOutput[] = []): string {
  const css = themeToCSS(theme);
  
  let output = `/* M3 Theme - Generated from source color */\n\n`;
  
  // Light scheme
  output += `/* Light Scheme */\n:root, [data-theme="light"] {\n`;
  Object.entries(css.light).forEach(([name, value]) => {
    output += `  ${name}: ${value};\n`;
  });
  
  // Extended colors - light scheme
  extendedColors.forEach(ext => {
    const prefix = `--m3-${toSafeKebabCase(ext.name)}`;
    output += `  /* Extended: ${ext.name} */\n`;
    output += `  ${prefix}: ${argbToHex(ext.light.color)};\n`;
    output += `  ${prefix}-on: ${argbToHex(ext.light.onColor)};\n`;
    output += `  ${prefix}-container: ${argbToHex(ext.light.colorContainer)};\n`;
    output += `  ${prefix}-on-container: ${argbToHex(ext.light.onColorContainer)};\n`;
  });
  output += `}\n\n`;
  
  // Dark scheme
  output += `/* Dark Scheme */\n[data-theme="dark"] {\n`;
  Object.entries(css.dark).forEach(([name, value]) => {
    output += `  ${name}: ${value};\n`;
  });
  
  // Extended colors - dark scheme
  extendedColors.forEach(ext => {
    const prefix = `--m3-${toSafeKebabCase(ext.name)}`;
    output += `  /* Extended: ${ext.name} */\n`;
    output += `  ${prefix}: ${argbToHex(ext.dark.color)};\n`;
    output += `  ${prefix}-on: ${argbToHex(ext.dark.onColor)};\n`;
    output += `  ${prefix}-container: ${argbToHex(ext.dark.colorContainer)};\n`;
    output += `  ${prefix}-on-container: ${argbToHex(ext.dark.onColorContainer)};\n`;
  });
  output += `}\n\n`;
  
  // Tonal palettes
  output += `/* Tonal Palettes */\n:root {\n`;
  Object.entries(css.palettes).forEach(([, paletteVars]) => {
    Object.entries(paletteVars).forEach(([name, value]) => {
      output += `  ${name}: ${value};\n`;
    });
  });
  
  // Extended color palettes
  extendedColors.forEach(ext => {
    const prefix = `--m3-palette-${toSafeKebabCase(ext.name)}`;
    const colors = getTonalPaletteColors(ext.palette);
    output += `  /* Extended: ${ext.name} */\n`;
    colors.forEach(({ tone, hex }) => {
      output += `  ${prefix}-${tone}: ${hex};\n`;
    });
  });
  output += `}\n`;
  
  return output;
}

/**
 * Export theme as JSON
 */
export function exportThemeAsJSON(theme: M3Theme, extendedColors: ExtendedColorOutput[] = []): string {
  const css = themeToCSS(theme);
  
  // Build extended colors object
  const extended: Record<string, any> = {};
  extendedColors.forEach(ext => {
    const key = toSafeKebabCase(ext.name);
    extended[key] = {
      name: ext.name,
      description: ext.description,
      sourceColor: ext.sourceColor,
      light: {
        color: argbToHex(ext.light.color),
        onColor: argbToHex(ext.light.onColor),
        colorContainer: argbToHex(ext.light.colorContainer),
        onColorContainer: argbToHex(ext.light.onColorContainer),
      },
      dark: {
        color: argbToHex(ext.dark.color),
        onColor: argbToHex(ext.dark.onColor),
        colorContainer: argbToHex(ext.dark.colorContainer),
        onColorContainer: argbToHex(ext.dark.onColorContainer),
      },
      palette: Object.fromEntries(
        getTonalPaletteColors(ext.palette).map(({ tone, hex }) => [tone, hex])
      ),
    };
  });
  
  return JSON.stringify({
    source: argbToHex(theme.source),
    light: css.light,
    dark: css.dark,
    palettes: css.palettes,
    ...(Object.keys(extended).length > 0 && { extendedColors: extended }),
  }, null, 2);
}

/**
 * Map M3 tokens to our existing token system
 * This allows the M3 theme to work with existing components
 */
export function mapM3ToExistingTokens(scheme: Scheme): Record<string, string> {
  return {
    // Primary colors
    '--color-primary-default': argbToHex(scheme.primary),
    '--color-primary-hover': argbToHex(scheme.primaryContainer),
    '--color-primary-background': argbToHex(scheme.primaryContainer),
    '--color-primary-light': argbToHex(scheme.primaryContainer),
    
    // Secondary colors
    '--color-secondary-default': argbToHex(scheme.secondary),
    '--color-secondary-hover': argbToHex(scheme.secondaryContainer),
    '--color-secondary-background': argbToHex(scheme.secondaryContainer),
    '--color-secondary-light': argbToHex(scheme.secondaryContainer),
    
    // Tertiary colors
    '--color-tertiary-default': argbToHex(scheme.tertiary),
    '--color-tertiary-hover': argbToHex(scheme.tertiaryContainer),
    '--color-tertiary-background': argbToHex(scheme.tertiaryContainer),
    '--color-tertiary-light': argbToHex(scheme.tertiaryContainer),
    
    // UI colors
    '--color-ui-background': argbToHex(scheme.background),
    '--color-ui-background-elevated': argbToHex(scheme.surface),
    '--color-ui-border': argbToHex(scheme.outline),
    '--color-ui-active': argbToHex(scheme.surfaceVariant),
    
    // Text colors
    '--color-text-default': argbToHex(scheme.onBackground),
    '--color-text-secondary': argbToHex(scheme.onSurfaceVariant),
    '--color-text-tertiary': argbToHex(scheme.outline),
    '--color-text-light': argbToHex(scheme.onPrimary),
    
    // Error colors
    '--color-error-default': argbToHex(scheme.error),
    '--color-error-background': argbToHex(scheme.errorContainer),
    
    // Button text
    '--color-btn-primary-text': argbToHex(scheme.onPrimary),
    '--color-btn-secondary-text': argbToHex(scheme.onSecondary),
    '--color-btn-tertiary-text': argbToHex(scheme.onTertiary),
  };
}

/**
 * Generate warning and success colors harmonized with the source
 * M3 doesn't include these, so we derive them algorithmically
 */
function generateStatusColors(
  sourceHex: string,
  mode: 'light' | 'dark'
): { warning: { default: string; background: string }; success: { default: string; background: string } } {
  const sourceArgb = argbFromHex(sourceHex);
  
  // Warning: Yellow/Orange hue (~45°)
  const warningHct = Hct.from(45, 80, mode === 'light' ? 45 : 75);
  let warningArgb = warningHct.toInt();
  warningArgb = Blend.harmonize(warningArgb, sourceArgb);
  const warningPalette = TonalPalette.fromInt(warningArgb);
  
  // Success: Green hue (~130°)
  const successHct = Hct.from(130, 60, mode === 'light' ? 40 : 70);
  let successArgb = successHct.toInt();
  successArgb = Blend.harmonize(successArgb, sourceArgb);
  const successPalette = TonalPalette.fromInt(successArgb);
  
  if (mode === 'light') {
    return {
      warning: {
        default: hexFromArgb(warningPalette.tone(40)),
        background: hexFromArgb(warningPalette.tone(90)),
      },
      success: {
        default: hexFromArgb(successPalette.tone(40)),
        background: hexFromArgb(successPalette.tone(90)),
      },
    };
  } else {
    return {
      warning: {
        default: hexFromArgb(warningPalette.tone(80)),
        background: `${hexFromArgb(warningPalette.tone(40))}26`, // 15% opacity
      },
      success: {
        default: hexFromArgb(successPalette.tone(80)),
        background: `${hexFromArgb(successPalette.tone(40))}26`, // 15% opacity
      },
    };
  }
}

/**
 * Export theme in the app's --color-* token format
 * This generates a complete, drop-in CSS file for Toqan
 */
export function exportThemeAsAppCSS(
  theme: M3Theme,
  themeName: string = 'Custom Theme',
  sourceHex: string,
  extendedColors: ExtendedColorOutput[] = []
): string {
  const palettes = theme.palettes;
  const lightScheme = theme.schemes.light;
  const darkScheme = theme.schemes.dark;
  
  // Generate status colors (warning/success) harmonized with source
  const lightStatus = generateStatusColors(sourceHex, 'light');
  const darkStatus = generateStatusColors(sourceHex, 'dark');
  
  // Check for user-defined warning/success in extended colors
  const userWarning = extendedColors.find(c => c.name.toLowerCase() === 'warning');
  const userSuccess = extendedColors.find(c => c.name.toLowerCase() === 'success');
  
  let output = `/**
 * Theme: ${themeName}
 * Generated by M3 Theme Builder
 * Source Color: ${sourceHex}
 * 
 * This file contains all --color-* primitive tokens for the Toqan design system.
 * Import this file to apply this theme.
 */

/* ===== LIGHT MODE ===== */
:root,
[data-theme="light"] {
  /* Primary */
  --color-primary-default: ${argbToHex(lightScheme.primary)};
  --color-primary-hover: ${argbToHex(palettes.primary.tone(30))};
  --color-primary-background: ${argbToHex(lightScheme.primaryContainer)}33;
  --color-primary-light: ${argbToHex(palettes.primary.tone(90))};

  /* Secondary */
  --color-secondary-default: ${argbToHex(lightScheme.secondary)};
  --color-secondary-hover: ${argbToHex(palettes.secondary.tone(30))};
  --color-secondary-background: ${argbToHex(lightScheme.secondaryContainer)}26;
  --color-secondary-light: ${argbToHex(palettes.secondary.tone(90))};

  /* Tertiary */
  --color-tertiary-default: ${argbToHex(lightScheme.tertiary)};
  --color-tertiary-hover: ${argbToHex(palettes.tertiary.tone(30))};
  --color-tertiary-background: ${argbToHex(lightScheme.tertiaryContainer)}26;
  --color-tertiary-light: ${argbToHex(palettes.tertiary.tone(90))};

  /* Button Text */
  --color-btn-primary-text: ${argbToHex(lightScheme.onPrimary)};
  --color-btn-secondary-text: ${argbToHex(lightScheme.onSecondary)};
  --color-btn-tertiary-text: ${argbToHex(lightScheme.onTertiary)};

  /* UI */
  --color-ui-background: ${argbToHex(palettes.neutral.tone(98))};
  --color-ui-background-elevated: ${argbToHex(lightScheme.surface)};
  --color-ui-border: ${argbToHex(lightScheme.outlineVariant)};
  --color-ui-active: ${argbToHex(palettes.neutralVariant.tone(94))};
  --color-ui-shadow: ${argbToHex(palettes.neutral.tone(0))}33;
  --color-ui-white: #FFFFFF;
  --color-ui-black: #000000;
  --color-ui-modal: ${argbToHex(lightScheme.scrim)}26;

  /* Text */
  --color-text-default: ${argbToHex(lightScheme.onSurface)};
  --color-text-secondary: ${argbToHex(lightScheme.onSurfaceVariant)};
  --color-text-tertiary: ${argbToHex(lightScheme.outline)};
  --color-text-light: #FFFFFF;
  --color-text-placeholder: ${argbToHex(palettes.neutral.tone(60))};
  --color-text-accent: ${argbToHex(lightScheme.primary)};

  /* Info (uses primary) */
  --color-info-default: ${argbToHex(lightScheme.primary)};
  --color-info-background: ${argbToHex(lightScheme.primaryContainer)};

  /* Error */
  --color-error-default: ${argbToHex(lightScheme.error)};
  --color-error-background: ${argbToHex(lightScheme.errorContainer)};
  --color-error-hover: ${argbToHex(palettes.error.tone(30))};

  /* Warning (derived or from extended) */
  --color-warning-default: ${userWarning ? argbToHex(userWarning.light.color) : lightStatus.warning.default};
  --color-warning-background: ${userWarning ? argbToHex(userWarning.light.colorContainer) : lightStatus.warning.background};

  /* Success (derived or from extended) */
  --color-success-default: ${userSuccess ? argbToHex(userSuccess.light.color) : lightStatus.success.default};
  --color-success-background: ${userSuccess ? argbToHex(userSuccess.light.colorContainer) : lightStatus.success.background};

  /* Tags */
  --color-tag-date-bg: ${argbToHex(lightScheme.primaryContainer)};
  --color-tag-date-text: ${argbToHex(lightScheme.onPrimaryContainer)};
  --color-tag-beta-bg: ${argbToHex(lightScheme.secondaryContainer)};
  --color-tag-beta-text: ${argbToHex(lightScheme.onSecondaryContainer)};
  --color-tag-recommended-bg: ${argbToHex(lightScheme.tertiaryContainer)};
  --color-tag-recommended-text: ${argbToHex(lightScheme.onTertiaryContainer)};
}

/* ===== DARK MODE ===== */
/* Using specific selectors to match tokens.css specificity */
.theme-dark:not(.design-new),
.design-new.theme-dark,
[data-theme="dark"] {
  /* Primary */
  --color-primary-default: ${argbToHex(darkScheme.primary)};
  --color-primary-hover: ${argbToHex(palettes.primary.tone(70))};
  --color-primary-background: ${argbToHex(darkScheme.primaryContainer)}26;
  --color-primary-light: ${argbToHex(palettes.primary.tone(30))};

  /* Secondary */
  --color-secondary-default: ${argbToHex(darkScheme.secondary)};
  --color-secondary-hover: ${argbToHex(palettes.secondary.tone(70))};
  --color-secondary-background: ${argbToHex(darkScheme.secondaryContainer)}26;
  --color-secondary-light: ${argbToHex(palettes.secondary.tone(30))};

  /* Tertiary */
  --color-tertiary-default: ${argbToHex(darkScheme.tertiary)};
  --color-tertiary-hover: ${argbToHex(palettes.tertiary.tone(70))};
  --color-tertiary-background: ${argbToHex(darkScheme.tertiaryContainer)}26;
  --color-tertiary-light: ${argbToHex(palettes.tertiary.tone(30))};

  /* Button Text */
  --color-btn-primary-text: ${argbToHex(darkScheme.onPrimary)};
  --color-btn-secondary-text: ${argbToHex(darkScheme.onSecondary)};
  --color-btn-tertiary-text: ${argbToHex(darkScheme.onTertiary)};

  /* UI */
  --color-ui-background: ${argbToHex(palettes.neutral.tone(6))};
  --color-ui-background-elevated: ${argbToHex(palettes.neutral.tone(12))};
  --color-ui-border: ${argbToHex(palettes.neutralVariant.tone(25))};
  --color-ui-active: ${argbToHex(palettes.neutralVariant.tone(17))};
  --color-ui-shadow: ${argbToHex(palettes.neutral.tone(0))}66;
  --color-ui-white: ${argbToHex(palettes.neutral.tone(12))};
  --color-ui-black: #FFFFFF;
  --color-ui-modal: ${argbToHex(darkScheme.scrim)}80;

  /* Text */
  --color-text-default: ${argbToHex(darkScheme.onSurface)};
  --color-text-secondary: ${argbToHex(darkScheme.onSurfaceVariant)};
  --color-text-tertiary: ${argbToHex(darkScheme.outline)};
  --color-text-light: #FFFFFF;
  --color-text-placeholder: ${argbToHex(palettes.neutral.tone(40))};
  --color-text-accent: ${argbToHex(darkScheme.primary)};

  /* Info (uses primary) */
  --color-info-default: ${argbToHex(darkScheme.primary)};
  --color-info-background: ${argbToHex(darkScheme.primaryContainer)}26;

  /* Error */
  --color-error-default: ${argbToHex(darkScheme.error)};
  --color-error-background: ${argbToHex(darkScheme.errorContainer)}26;
  --color-error-hover: ${argbToHex(palettes.error.tone(70))};

  /* Warning (derived or from extended) */
  --color-warning-default: ${userWarning ? argbToHex(userWarning.dark.color) : darkStatus.warning.default};
  --color-warning-background: ${userWarning ? `${argbToHex(userWarning.dark.colorContainer)}26` : darkStatus.warning.background};

  /* Success (derived or from extended) */
  --color-success-default: ${userSuccess ? argbToHex(userSuccess.dark.color) : darkStatus.success.default};
  --color-success-background: ${userSuccess ? `${argbToHex(userSuccess.dark.colorContainer)}26` : darkStatus.success.background};

  /* Tags */
  --color-tag-date-bg: ${argbToHex(darkScheme.primaryContainer)};
  --color-tag-date-text: ${argbToHex(darkScheme.onPrimaryContainer)};
  --color-tag-beta-bg: ${argbToHex(darkScheme.secondaryContainer)};
  --color-tag-beta-text: ${argbToHex(darkScheme.onSecondaryContainer)};
  --color-tag-recommended-bg: ${argbToHex(darkScheme.tertiaryContainer)};
  --color-tag-recommended-text: ${argbToHex(darkScheme.onTertiaryContainer)};
}

/* ===== TONAL PALETTES ===== */
/* Reference tokens - full color palettes for advanced usage */
:root {
  /* Primary Palette */
  --palette-primary-0: ${argbToHex(palettes.primary.tone(0))};
  --palette-primary-10: ${argbToHex(palettes.primary.tone(10))};
  --palette-primary-20: ${argbToHex(palettes.primary.tone(20))};
  --palette-primary-25: ${argbToHex(palettes.primary.tone(25))};
  --palette-primary-30: ${argbToHex(palettes.primary.tone(30))};
  --palette-primary-35: ${argbToHex(palettes.primary.tone(35))};
  --palette-primary-40: ${argbToHex(palettes.primary.tone(40))};
  --palette-primary-50: ${argbToHex(palettes.primary.tone(50))};
  --palette-primary-60: ${argbToHex(palettes.primary.tone(60))};
  --palette-primary-70: ${argbToHex(palettes.primary.tone(70))};
  --palette-primary-80: ${argbToHex(palettes.primary.tone(80))};
  --palette-primary-90: ${argbToHex(palettes.primary.tone(90))};
  --palette-primary-95: ${argbToHex(palettes.primary.tone(95))};
  --palette-primary-99: ${argbToHex(palettes.primary.tone(99))};
  --palette-primary-100: ${argbToHex(palettes.primary.tone(100))};

  /* Secondary Palette */
  --palette-secondary-0: ${argbToHex(palettes.secondary.tone(0))};
  --palette-secondary-10: ${argbToHex(palettes.secondary.tone(10))};
  --palette-secondary-20: ${argbToHex(palettes.secondary.tone(20))};
  --palette-secondary-25: ${argbToHex(palettes.secondary.tone(25))};
  --palette-secondary-30: ${argbToHex(palettes.secondary.tone(30))};
  --palette-secondary-35: ${argbToHex(palettes.secondary.tone(35))};
  --palette-secondary-40: ${argbToHex(palettes.secondary.tone(40))};
  --palette-secondary-50: ${argbToHex(palettes.secondary.tone(50))};
  --palette-secondary-60: ${argbToHex(palettes.secondary.tone(60))};
  --palette-secondary-70: ${argbToHex(palettes.secondary.tone(70))};
  --palette-secondary-80: ${argbToHex(palettes.secondary.tone(80))};
  --palette-secondary-90: ${argbToHex(palettes.secondary.tone(90))};
  --palette-secondary-95: ${argbToHex(palettes.secondary.tone(95))};
  --palette-secondary-99: ${argbToHex(palettes.secondary.tone(99))};
  --palette-secondary-100: ${argbToHex(palettes.secondary.tone(100))};

  /* Tertiary Palette */
  --palette-tertiary-0: ${argbToHex(palettes.tertiary.tone(0))};
  --palette-tertiary-10: ${argbToHex(palettes.tertiary.tone(10))};
  --palette-tertiary-20: ${argbToHex(palettes.tertiary.tone(20))};
  --palette-tertiary-25: ${argbToHex(palettes.tertiary.tone(25))};
  --palette-tertiary-30: ${argbToHex(palettes.tertiary.tone(30))};
  --palette-tertiary-35: ${argbToHex(palettes.tertiary.tone(35))};
  --palette-tertiary-40: ${argbToHex(palettes.tertiary.tone(40))};
  --palette-tertiary-50: ${argbToHex(palettes.tertiary.tone(50))};
  --palette-tertiary-60: ${argbToHex(palettes.tertiary.tone(60))};
  --palette-tertiary-70: ${argbToHex(palettes.tertiary.tone(70))};
  --palette-tertiary-80: ${argbToHex(palettes.tertiary.tone(80))};
  --palette-tertiary-90: ${argbToHex(palettes.tertiary.tone(90))};
  --palette-tertiary-95: ${argbToHex(palettes.tertiary.tone(95))};
  --palette-tertiary-99: ${argbToHex(palettes.tertiary.tone(99))};
  --palette-tertiary-100: ${argbToHex(palettes.tertiary.tone(100))};

  /* Error Palette */
  --palette-error-0: ${argbToHex(palettes.error.tone(0))};
  --palette-error-10: ${argbToHex(palettes.error.tone(10))};
  --palette-error-20: ${argbToHex(palettes.error.tone(20))};
  --palette-error-25: ${argbToHex(palettes.error.tone(25))};
  --palette-error-30: ${argbToHex(palettes.error.tone(30))};
  --palette-error-35: ${argbToHex(palettes.error.tone(35))};
  --palette-error-40: ${argbToHex(palettes.error.tone(40))};
  --palette-error-50: ${argbToHex(palettes.error.tone(50))};
  --palette-error-60: ${argbToHex(palettes.error.tone(60))};
  --palette-error-70: ${argbToHex(palettes.error.tone(70))};
  --palette-error-80: ${argbToHex(palettes.error.tone(80))};
  --palette-error-90: ${argbToHex(palettes.error.tone(90))};
  --palette-error-95: ${argbToHex(palettes.error.tone(95))};
  --palette-error-99: ${argbToHex(palettes.error.tone(99))};
  --palette-error-100: ${argbToHex(palettes.error.tone(100))};

  /* Neutral Palette */
  --palette-neutral-0: ${argbToHex(palettes.neutral.tone(0))};
  --palette-neutral-4: ${argbToHex(palettes.neutral.tone(4))};
  --palette-neutral-6: ${argbToHex(palettes.neutral.tone(6))};
  --palette-neutral-10: ${argbToHex(palettes.neutral.tone(10))};
  --palette-neutral-12: ${argbToHex(palettes.neutral.tone(12))};
  --palette-neutral-17: ${argbToHex(palettes.neutral.tone(17))};
  --palette-neutral-20: ${argbToHex(palettes.neutral.tone(20))};
  --palette-neutral-22: ${argbToHex(palettes.neutral.tone(22))};
  --palette-neutral-24: ${argbToHex(palettes.neutral.tone(24))};
  --palette-neutral-25: ${argbToHex(palettes.neutral.tone(25))};
  --palette-neutral-30: ${argbToHex(palettes.neutral.tone(30))};
  --palette-neutral-35: ${argbToHex(palettes.neutral.tone(35))};
  --palette-neutral-40: ${argbToHex(palettes.neutral.tone(40))};
  --palette-neutral-50: ${argbToHex(palettes.neutral.tone(50))};
  --palette-neutral-60: ${argbToHex(palettes.neutral.tone(60))};
  --palette-neutral-70: ${argbToHex(palettes.neutral.tone(70))};
  --palette-neutral-80: ${argbToHex(palettes.neutral.tone(80))};
  --palette-neutral-87: ${argbToHex(palettes.neutral.tone(87))};
  --palette-neutral-90: ${argbToHex(palettes.neutral.tone(90))};
  --palette-neutral-92: ${argbToHex(palettes.neutral.tone(92))};
  --palette-neutral-94: ${argbToHex(palettes.neutral.tone(94))};
  --palette-neutral-95: ${argbToHex(palettes.neutral.tone(95))};
  --palette-neutral-96: ${argbToHex(palettes.neutral.tone(96))};
  --palette-neutral-98: ${argbToHex(palettes.neutral.tone(98))};
  --palette-neutral-99: ${argbToHex(palettes.neutral.tone(99))};
  --palette-neutral-100: ${argbToHex(palettes.neutral.tone(100))};

  /* Neutral Variant Palette */
  --palette-neutral-variant-0: ${argbToHex(palettes.neutralVariant.tone(0))};
  --palette-neutral-variant-10: ${argbToHex(palettes.neutralVariant.tone(10))};
  --palette-neutral-variant-20: ${argbToHex(palettes.neutralVariant.tone(20))};
  --palette-neutral-variant-25: ${argbToHex(palettes.neutralVariant.tone(25))};
  --palette-neutral-variant-30: ${argbToHex(palettes.neutralVariant.tone(30))};
  --palette-neutral-variant-35: ${argbToHex(palettes.neutralVariant.tone(35))};
  --palette-neutral-variant-40: ${argbToHex(palettes.neutralVariant.tone(40))};
  --palette-neutral-variant-50: ${argbToHex(palettes.neutralVariant.tone(50))};
  --palette-neutral-variant-60: ${argbToHex(palettes.neutralVariant.tone(60))};
  --palette-neutral-variant-70: ${argbToHex(palettes.neutralVariant.tone(70))};
  --palette-neutral-variant-80: ${argbToHex(palettes.neutralVariant.tone(80))};
  --palette-neutral-variant-90: ${argbToHex(palettes.neutralVariant.tone(90))};
  --palette-neutral-variant-95: ${argbToHex(palettes.neutralVariant.tone(95))};
  --palette-neutral-variant-99: ${argbToHex(palettes.neutralVariant.tone(99))};
  --palette-neutral-variant-100: ${argbToHex(palettes.neutralVariant.tone(100))};
}
`;

  // Add extended color palettes if any
  if (extendedColors.length > 0) {
    output += `
/* ===== EXTENDED COLOR PALETTES ===== */
:root {
`;
    extendedColors.forEach(ext => {
      const safeName = ext.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      output += `  /* ${ext.name} Palette */
  --palette-${safeName}-0: ${argbToHex(ext.palette.tone(0))};
  --palette-${safeName}-10: ${argbToHex(ext.palette.tone(10))};
  --palette-${safeName}-20: ${argbToHex(ext.palette.tone(20))};
  --palette-${safeName}-25: ${argbToHex(ext.palette.tone(25))};
  --palette-${safeName}-30: ${argbToHex(ext.palette.tone(30))};
  --palette-${safeName}-35: ${argbToHex(ext.palette.tone(35))};
  --palette-${safeName}-40: ${argbToHex(ext.palette.tone(40))};
  --palette-${safeName}-50: ${argbToHex(ext.palette.tone(50))};
  --palette-${safeName}-60: ${argbToHex(ext.palette.tone(60))};
  --palette-${safeName}-70: ${argbToHex(ext.palette.tone(70))};
  --palette-${safeName}-80: ${argbToHex(ext.palette.tone(80))};
  --palette-${safeName}-90: ${argbToHex(ext.palette.tone(90))};
  --palette-${safeName}-95: ${argbToHex(ext.palette.tone(95))};
  --palette-${safeName}-99: ${argbToHex(ext.palette.tone(99))};
  --palette-${safeName}-100: ${argbToHex(ext.palette.tone(100))};

`;
    });
    output += `}
`;
  }

  return output;
}

