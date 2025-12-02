/**
 * CSS Token Generation from M3 Schemes
 * Converts M3 color schemes to CSS custom properties
 */

import { Scheme, argbToHex, M3Theme, getTonalPaletteColors } from './hct';

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
    const value = (scheme as Record<string, number>)[role];
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
 * Export theme as CSS string
 */
export function exportThemeAsCSS(theme: M3Theme): string {
  const css = themeToCSS(theme);
  
  let output = `/* M3 Theme - Generated from source color */\n\n`;
  
  // Light scheme
  output += `/* Light Scheme */\n:root, [data-theme="light"] {\n`;
  Object.entries(css.light).forEach(([name, value]) => {
    output += `  ${name}: ${value};\n`;
  });
  output += `}\n\n`;
  
  // Dark scheme
  output += `/* Dark Scheme */\n[data-theme="dark"] {\n`;
  Object.entries(css.dark).forEach(([name, value]) => {
    output += `  ${name}: ${value};\n`;
  });
  output += `}\n\n`;
  
  // Tonal palettes
  output += `/* Tonal Palettes */\n:root {\n`;
  Object.entries(css.palettes).forEach(([, paletteVars]) => {
    Object.entries(paletteVars).forEach(([name, value]) => {
      output += `  ${name}: ${value};\n`;
    });
  });
  output += `}\n`;
  
  return output;
}

/**
 * Export theme as JSON
 */
export function exportThemeAsJSON(theme: M3Theme): string {
  const css = themeToCSS(theme);
  
  return JSON.stringify({
    source: argbToHex(theme.source),
    light: css.light,
    dark: css.dark,
    palettes: css.palettes,
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

