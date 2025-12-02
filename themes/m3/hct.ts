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
} from '@material/material-color-utilities';

export type { Scheme };

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
 */
export function generateThemeFromColor(sourceHex: string): M3Theme {
  const sourceArgb = argbFromHex(sourceHex);
  const theme = themeFromSourceColor(sourceArgb);
  return theme as M3Theme;
}

/**
 * Generate theme with custom key colors (overrides)
 * 
 * @param sourceHex - The source color in hex format
 * @param overrides - Custom colors to override the generated palette
 * @param colorMatch - If true, use exact colors; if false, harmonize colors with source
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
  colorMatch: boolean = true
): M3Theme {
  const sourceArgb = argbFromHex(sourceHex);
  const theme = themeFromSourceColor(sourceArgb) as M3Theme;
  
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
    
    // Regenerate schemes with new palettes
    theme.schemes.light = generateLightScheme(theme.palettes);
    theme.schemes.dark = generateDarkScheme(theme.palettes);
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
 * Generate light scheme from palettes
 */
function generateLightScheme(palettes: M3Theme['palettes']): Scheme {
  return {
    primary: palettes.primary.tone(40),
    onPrimary: palettes.primary.tone(100),
    primaryContainer: palettes.primary.tone(90),
    onPrimaryContainer: palettes.primary.tone(10),
    secondary: palettes.secondary.tone(40),
    onSecondary: palettes.secondary.tone(100),
    secondaryContainer: palettes.secondary.tone(90),
    onSecondaryContainer: palettes.secondary.tone(10),
    tertiary: palettes.tertiary.tone(40),
    onTertiary: palettes.tertiary.tone(100),
    tertiaryContainer: palettes.tertiary.tone(90),
    onTertiaryContainer: palettes.tertiary.tone(10),
    error: palettes.error.tone(40),
    onError: palettes.error.tone(100),
    errorContainer: palettes.error.tone(90),
    onErrorContainer: palettes.error.tone(10),
    background: palettes.neutral.tone(99),
    onBackground: palettes.neutral.tone(10),
    surface: palettes.neutral.tone(99),
    onSurface: palettes.neutral.tone(10),
    surfaceVariant: palettes.neutralVariant.tone(90),
    onSurfaceVariant: palettes.neutralVariant.tone(30),
    outline: palettes.neutralVariant.tone(50),
    outlineVariant: palettes.neutralVariant.tone(80),
    shadow: palettes.neutral.tone(0),
    scrim: palettes.neutral.tone(0),
    inverseSurface: palettes.neutral.tone(20),
    inverseOnSurface: palettes.neutral.tone(95),
    inversePrimary: palettes.primary.tone(80),
  } as Scheme;
}

/**
 * Generate dark scheme from palettes
 */
function generateDarkScheme(palettes: M3Theme['palettes']): Scheme {
  return {
    primary: palettes.primary.tone(80),
    onPrimary: palettes.primary.tone(20),
    primaryContainer: palettes.primary.tone(30),
    onPrimaryContainer: palettes.primary.tone(90),
    secondary: palettes.secondary.tone(80),
    onSecondary: palettes.secondary.tone(20),
    secondaryContainer: palettes.secondary.tone(30),
    onSecondaryContainer: palettes.secondary.tone(90),
    tertiary: palettes.tertiary.tone(80),
    onTertiary: palettes.tertiary.tone(20),
    tertiaryContainer: palettes.tertiary.tone(30),
    onTertiaryContainer: palettes.tertiary.tone(90),
    error: palettes.error.tone(80),
    onError: palettes.error.tone(20),
    errorContainer: palettes.error.tone(30),
    onErrorContainer: palettes.error.tone(90),
    background: palettes.neutral.tone(10),
    onBackground: palettes.neutral.tone(90),
    surface: palettes.neutral.tone(10),
    onSurface: palettes.neutral.tone(90),
    surfaceVariant: palettes.neutralVariant.tone(30),
    onSurfaceVariant: palettes.neutralVariant.tone(80),
    outline: palettes.neutralVariant.tone(60),
    outlineVariant: palettes.neutralVariant.tone(30),
    shadow: palettes.neutral.tone(0),
    scrim: palettes.neutral.tone(0),
    inverseSurface: palettes.neutral.tone(90),
    inverseOnSurface: palettes.neutral.tone(20),
    inversePrimary: palettes.primary.tone(40),
  } as Scheme;
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

