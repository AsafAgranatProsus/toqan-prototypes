/**
 * HCT Color Space Utilities
 * Wrapper around @material/material-color-utilities for M3 theme generation
 */

import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  TonalPalette,
  Hct,
  CorePalette,
  Scheme,
  Blend,
  SchemeTonalSpot,
  DynamicScheme,
} from '@material/material-color-utilities';

// Variant enum values (not exported from main package)
// See: node_modules/@material/material-color-utilities/dynamiccolor/variant.d.ts
const Variant = {
  MONOCHROME: 0,
  NEUTRAL: 1,
  TONAL_SPOT: 2,
  VIBRANT: 3,
  EXPRESSIVE: 4,
  FIDELITY: 5,
  CONTENT: 6,
  RAINBOW: 7,
  FRUIT_SALAD: 8,
} as const;

export type { Scheme };

// Contrast level constants
export const CONTRAST_STANDARD = 0;
export const CONTRAST_MEDIUM = 0.5;
export const CONTRAST_HIGH = 1.0;

export type ContrastLevel = typeof CONTRAST_STANDARD | typeof CONTRAST_MEDIUM | typeof CONTRAST_HIGH;

/**
 * Theme generated from a source color
 */
export interface M3Theme {
  source: number; // ARGB
  schemes: {
    light: Scheme;
    dark: Scheme;
  };
  palettes: {
    primary: TonalPalette;
    secondary: TonalPalette;
    tertiary: TonalPalette;
    neutral: TonalPalette;
    neutralVariant: TonalPalette;
    error: TonalPalette;
  };
  customColors: CustomColorGroup[];
}

export interface CustomColorGroup {
  color: {
    name: string;
    value: number;
    blend: boolean;
  };
  value: number;
  light: {
    color: number;
    onColor: number;
    colorContainer: number;
    onColorContainer: number;
  };
  dark: {
    color: number;
    onColor: number;
    colorContainer: number;
    onColorContainer: number;
  };
}

/**
 * Convert hex color to ARGB
 */
export function hexToArgb(hex: string): number {
  return argbFromHex(hex);
}

/**
 * Convert ARGB to hex color
 */
export function argbToHex(argb: number): string {
  return hexFromArgb(argb);
}

/**
 * Generate a complete M3 theme from a source color
 * 
 * @param sourceHex - The source color in hex format
 * @param contrastLevel - Contrast level (-1 to 1). 0 = standard, 0.5 = medium, 1 = high
 */
export function generateThemeFromColor(sourceHex: string, contrastLevel: number = CONTRAST_STANDARD): M3Theme {
  const sourceArgb = argbFromHex(sourceHex);
  const theme = themeFromSourceColor(sourceArgb) as M3Theme;
  
  // Generate schemes with contrast level using SchemeTonalSpot
  const sourceHct = Hct.fromInt(sourceArgb);
  const lightScheme = new SchemeTonalSpot(sourceHct, false, contrastLevel);
  const darkScheme = new SchemeTonalSpot(sourceHct, true, contrastLevel);
  
  // Convert DynamicScheme to our Scheme format
  theme.schemes.light = dynamicSchemeToScheme(lightScheme);
  theme.schemes.dark = dynamicSchemeToScheme(darkScheme);
  
  return theme;
}

/**
 * Convert a DynamicScheme to our Scheme interface
 */
function dynamicSchemeToScheme(dynamicScheme: SchemeTonalSpot): Scheme {
  return {
    primary: dynamicScheme.primary,
    onPrimary: dynamicScheme.onPrimary,
    primaryContainer: dynamicScheme.primaryContainer,
    onPrimaryContainer: dynamicScheme.onPrimaryContainer,
    secondary: dynamicScheme.secondary,
    onSecondary: dynamicScheme.onSecondary,
    secondaryContainer: dynamicScheme.secondaryContainer,
    onSecondaryContainer: dynamicScheme.onSecondaryContainer,
    tertiary: dynamicScheme.tertiary,
    onTertiary: dynamicScheme.onTertiary,
    tertiaryContainer: dynamicScheme.tertiaryContainer,
    onTertiaryContainer: dynamicScheme.onTertiaryContainer,
    error: dynamicScheme.error,
    onError: dynamicScheme.onError,
    errorContainer: dynamicScheme.errorContainer,
    onErrorContainer: dynamicScheme.onErrorContainer,
    background: dynamicScheme.background,
    onBackground: dynamicScheme.onBackground,
    surface: dynamicScheme.surface,
    onSurface: dynamicScheme.onSurface,
    surfaceVariant: dynamicScheme.surfaceVariant,
    onSurfaceVariant: dynamicScheme.onSurfaceVariant,
    outline: dynamicScheme.outline,
    outlineVariant: dynamicScheme.outlineVariant,
    shadow: dynamicScheme.shadow,
    scrim: dynamicScheme.scrim,
    inverseSurface: dynamicScheme.inverseSurface,
    inverseOnSurface: dynamicScheme.inverseOnSurface,
    inversePrimary: dynamicScheme.inversePrimary,
  } as Scheme;
}

/**
 * Generate theme with custom key colors (overrides)
 * 
 * @param sourceHex - The source color in hex format
 * @param overrides - Custom colors to override the generated palette
 * @param colorMatch - If true, use exact colors; if false, harmonize colors with source
 * @param contrastLevel - Contrast level (-1 to 1). 0 = standard, 0.5 = medium, 1 = high
 */
export function generateThemeWithOverrides(
  sourceHex: string,
  overrides?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    error?: string;
    neutral?: string;
    neutralVariant?: string;
  },
  colorMatch: boolean = true,
  contrastLevel: number = CONTRAST_STANDARD
): M3Theme {
  const sourceArgb = argbFromHex(sourceHex);
  const theme = generateThemeFromColor(sourceHex, contrastLevel);
  
  // If overrides provided, regenerate palettes
  if (overrides) {
    if (overrides.primary) {
      let primaryArgb = argbFromHex(overrides.primary);
      // If colorMatch is OFF, harmonize the color with the source
      if (!colorMatch) {
        primaryArgb = Blend.harmonize(primaryArgb, sourceArgb);
      }
      theme.palettes.primary = TonalPalette.fromInt(primaryArgb);
    }
    if (overrides.secondary) {
      let secondaryArgb = argbFromHex(overrides.secondary);
      if (!colorMatch) {
        secondaryArgb = Blend.harmonize(secondaryArgb, sourceArgb);
      }
      theme.palettes.secondary = TonalPalette.fromInt(secondaryArgb);
    }
    if (overrides.tertiary) {
      let tertiaryArgb = argbFromHex(overrides.tertiary);
      if (!colorMatch) {
        tertiaryArgb = Blend.harmonize(tertiaryArgb, sourceArgb);
      }
      theme.palettes.tertiary = TonalPalette.fromInt(tertiaryArgb);
    }
    if (overrides.error) {
      let errorArgb = argbFromHex(overrides.error);
      if (!colorMatch) {
        errorArgb = Blend.harmonize(errorArgb, sourceArgb);
      }
      theme.palettes.error = TonalPalette.fromInt(errorArgb);
    }
    if (overrides.neutral) {
      let neutralArgb = argbFromHex(overrides.neutral);
      if (!colorMatch) {
        neutralArgb = Blend.harmonize(neutralArgb, sourceArgb);
      }
      theme.palettes.neutral = TonalPalette.fromInt(neutralArgb);
    }
    if (overrides.neutralVariant) {
      let neutralVariantArgb = argbFromHex(overrides.neutralVariant);
      if (!colorMatch) {
        neutralVariantArgb = Blend.harmonize(neutralVariantArgb, sourceArgb);
      }
      theme.palettes.neutralVariant = TonalPalette.fromInt(neutralVariantArgb);
    }
    
    // Regenerate schemes with new palettes and proper M3 contrast handling
    theme.schemes.light = generateLightScheme(theme.palettes, contrastLevel, sourceArgb);
    theme.schemes.dark = generateDarkScheme(theme.palettes, contrastLevel, sourceArgb);
  }
  
  return theme;
}

/**
 * Harmonize a color with a source color
 * This shifts the hue of the design color towards the source color
 */
export function harmonizeColor(designHex: string, sourceHex: string): string {
  const designArgb = argbFromHex(designHex);
  const sourceArgb = argbFromHex(sourceHex);
  const harmonizedArgb = Blend.harmonize(designArgb, sourceArgb);
  return hexFromArgb(harmonizedArgb);
}

/**
 * Generate scheme from palettes using M3's DynamicScheme for proper contrast handling
 * 
 * This uses the M3 library's built-in contrast curve calculations, which:
 * - Define target contrast RATIOS (not fixed tones) for each contrast level
 * - Automatically flip foreground colors when backgrounds cross certain thresholds
 * - Avoid the "awkward zone" (tones 50-59) where contrast is poor
 * 
 * @param palettes - The tonal palettes to use
 * @param sourceArgb - The source color in ARGB format
 * @param isDark - Whether to generate dark mode scheme
 * @param contrastLevel - Contrast level (-1 to 1)
 */
function generateSchemeFromPalettes(
  palettes: M3Theme['palettes'],
  sourceArgb: number,
  isDark: boolean,
  contrastLevel: number = 0
): Scheme {
  // Create a DynamicScheme with our custom palettes
  // This gives us proper M3 contrast handling
  const sourceHct = Hct.fromInt(sourceArgb);
  
  const dynamicScheme = new DynamicScheme({
    sourceColorArgb: sourceArgb,
    variant: Variant.TONAL_SPOT,
    contrastLevel,
    isDark,
    primaryPalette: palettes.primary,
    secondaryPalette: palettes.secondary,
    tertiaryPalette: palettes.tertiary,
    neutralPalette: palettes.neutral,
    neutralVariantPalette: palettes.neutralVariant,
  });
  
  // Convert DynamicScheme to our Scheme format using its contrast-aware getters
  return {
    primary: dynamicScheme.primary,
    onPrimary: dynamicScheme.onPrimary,
    primaryContainer: dynamicScheme.primaryContainer,
    onPrimaryContainer: dynamicScheme.onPrimaryContainer,
    secondary: dynamicScheme.secondary,
    onSecondary: dynamicScheme.onSecondary,
    secondaryContainer: dynamicScheme.secondaryContainer,
    onSecondaryContainer: dynamicScheme.onSecondaryContainer,
    tertiary: dynamicScheme.tertiary,
    onTertiary: dynamicScheme.onTertiary,
    tertiaryContainer: dynamicScheme.tertiaryContainer,
    onTertiaryContainer: dynamicScheme.onTertiaryContainer,
    error: dynamicScheme.error,
    onError: dynamicScheme.onError,
    errorContainer: dynamicScheme.errorContainer,
    onErrorContainer: dynamicScheme.onErrorContainer,
    background: dynamicScheme.background,
    onBackground: dynamicScheme.onBackground,
    surface: dynamicScheme.surface,
    onSurface: dynamicScheme.onSurface,
    surfaceVariant: dynamicScheme.surfaceVariant,
    onSurfaceVariant: dynamicScheme.onSurfaceVariant,
    outline: dynamicScheme.outline,
    outlineVariant: dynamicScheme.outlineVariant,
    shadow: dynamicScheme.shadow,
    scrim: dynamicScheme.scrim,
    inverseSurface: dynamicScheme.inverseSurface,
    inverseOnSurface: dynamicScheme.inverseOnSurface,
    inversePrimary: dynamicScheme.inversePrimary,
  } as Scheme;
}

/**
 * Generate light scheme from palettes with proper M3 contrast handling
 */
function generateLightScheme(palettes: M3Theme['palettes'], contrastLevel: number = 0, sourceArgb?: number): Scheme {
  // Use the primary palette's key color as source if not provided
  const source = sourceArgb ?? palettes.primary.tone(40);
  return generateSchemeFromPalettes(palettes, source, false, contrastLevel);
}

/**
 * Generate dark scheme from palettes with proper M3 contrast handling
 */
function generateDarkScheme(palettes: M3Theme['palettes'], contrastLevel: number = 0, sourceArgb?: number): Scheme {
  // Use the primary palette's key color as source if not provided
  const source = sourceArgb ?? palettes.primary.tone(40);
  return generateSchemeFromPalettes(palettes, source, true, contrastLevel);
}

/**
 * Get tonal palette as array of hex colors
 */
export function getTonalPaletteColors(palette: TonalPalette): { tone: number; hex: string }[] {
  const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
  return tones.map(tone => ({
    tone,
    hex: hexFromArgb(palette.tone(tone)),
  }));
}

/**
 * Extended color definition (input)
 */
export interface ExtendedColorInput {
  id: string;
  name: string;
  description?: string;
  color: string;
  blend: boolean;
}

/**
 * Extended color with generated palette and roles
 */
export interface ExtendedColorOutput {
  id: string;
  name: string;
  description?: string;
  sourceColor: string;
  palette: TonalPalette;
  light: {
    color: number;
    onColor: number;
    colorContainer: number;
    onColorContainer: number;
  };
  dark: {
    color: number;
    onColor: number;
    colorContainer: number;
    onColorContainer: number;
  };
}

/**
 * Generate palette and color roles for an extended color
 */
export function generateExtendedColorPalette(
  extendedColor: ExtendedColorInput,
  sourceHex: string
): ExtendedColorOutput {
  const sourceArgb = argbFromHex(sourceHex);
  let colorArgb = argbFromHex(extendedColor.color);
  
  // If blend is enabled, harmonize with source color
  if (extendedColor.blend) {
    colorArgb = Blend.harmonize(colorArgb, sourceArgb);
  }
  
  // Generate tonal palette
  const palette = TonalPalette.fromInt(colorArgb);
  
  // Generate light and dark color roles (matching M3 spec)
  return {
    id: extendedColor.id,
    name: extendedColor.name,
    description: extendedColor.description,
    sourceColor: extendedColor.color,
    palette,
    light: {
      color: palette.tone(40),
      onColor: palette.tone(100),
      colorContainer: palette.tone(90),
      onColorContainer: palette.tone(10),
    },
    dark: {
      color: palette.tone(80),
      onColor: palette.tone(20),
      colorContainer: palette.tone(30),
      onColorContainer: palette.tone(90),
    },
  };
}

/**
 * Generate palettes for multiple extended colors
 */
export function generateExtendedColorPalettes(
  extendedColors: ExtendedColorInput[],
  sourceHex: string
): ExtendedColorOutput[] {
  return extendedColors.map(color => generateExtendedColorPalette(color, sourceHex));
}

/**
 * Get HCT values from a hex color
 */
export function getHctFromHex(hex: string): { hue: number; chroma: number; tone: number } {
  const argb = argbFromHex(hex);
  const hct = Hct.fromInt(argb);
  return {
    hue: hct.hue,
    chroma: hct.chroma,
    tone: hct.tone,
  };
}

/**
 * Create hex color from HCT values
 */
export function hexFromHct(hue: number, chroma: number, tone: number): string {
  const hct = Hct.from(hue, chroma, tone);
  return hexFromArgb(hct.toInt());
}

/**
 * Generate a random vibrant color
 */
export function generateRandomColor(): string {
  const hue = Math.random() * 360;
  const chroma = 40 + Math.random() * 40; // 40-80 for vibrant colors
  const tone = 40 + Math.random() * 20; // 40-60 for good visibility
  return hexFromHct(hue, chroma, tone);
}

/**
 * Extract dominant color from an image
 */
export async function extractColorFromImage(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Scale down for performance
      const scale = Math.min(1, 100 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple dominant color extraction (average with saturation weighting)
      let totalR = 0, totalG = 0, totalB = 0, count = 0;
      
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        
        // Weight by saturation (skip grays)
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        
        if (saturation > 0.2) {
          const weight = saturation;
          totalR += r * weight;
          totalG += g * weight;
          totalB += b * weight;
          count += weight;
        }
      }
      
      if (count === 0) {
        // Fallback to simple average if no saturated colors
        for (let i = 0; i < imageData.data.length; i += 4) {
          totalR += imageData.data[i];
          totalG += imageData.data[i + 1];
          totalB += imageData.data[i + 2];
          count++;
        }
      }
      
      const avgR = Math.round(totalR / count);
      const avgG = Math.round(totalG / count);
      const avgB = Math.round(totalB / count);
      
      const hex = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
      resolve(hex);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

