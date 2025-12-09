/**
 * Utility functions for working with gradient configurations and frames
 */

import type { ColorStop } from '../components/OrganicGradient/OrganicGradient';
import type { OrganicGradientConfig } from '../components/GradientBackground/GradientBackground';
import type { GradientFrame, ThemeColorStop } from '../types/gradientFrame';

/**
 * Convert a hex color to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Get a CSS color value from a theme token
 * This is a helper that reads from CSS variables
 */
export function getThemeColor(token: string): string {
  if (typeof window === 'undefined') return '#000000';
  
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(`--color-${token}`).trim();
  
  return value || '#000000';
}

/**
 * Convert a GradientFrame (with theme tokens) to OrganicGradientConfig (with hex colors)
 * This is useful for loading exported frames from the playground
 */
export function gradientFrameToConfig(frame: GradientFrame): OrganicGradientConfig {
  const colors: ColorStop[] = frame.config.colorStops.map((stop: ThemeColorStop) => ({
    color: getThemeColor(stop.token),
    alpha: stop.alpha,
    threshold: stop.threshold,
  }));

  return {
    seed: frame.config.seed,
    blurIntensity: frame.config.blurIntensity,
    noiseScale: frame.config.noiseScale,
    grainIntensity: frame.config.grainIntensity,
    iterations: frame.config.iterations,
    noiseAlgorithm: frame.config.noiseAlgorithm,
    colors,
  };
}

/**
 * Generate a random gradient configuration
 * Useful for creating variations or placeholders
 */
export function generateRandomGradientConfig(isDark: boolean = false): OrganicGradientConfig {
  const algorithms = ['value', 'simplex', 'perlin', 'fbm'] as const;
  const randomAlgorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
  
  // Generate random colors based on theme
  const generateRandomColor = () => {
    if (isDark) {
      // Vibrant colors for dark theme
      const hue = Math.floor(Math.random() * 360);
      const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
      const lightness = 40 + Math.floor(Math.random() * 30); // 40-70%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    } else {
      // Softer colors for light theme
      const hue = Math.floor(Math.random() * 360);
      const saturation = 40 + Math.floor(Math.random() * 40); // 40-80%
      const lightness = 60 + Math.floor(Math.random() * 30); // 60-90%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
  };

  const colorCount = 3 + Math.floor(Math.random() * 3); // 3-5 colors
  const randomColors: ColorStop[] = [];
  
  for (let i = 0; i < colorCount; i++) {
    randomColors.push({
      color: generateRandomColor(),
      alpha: 0.7 + Math.random() * 0.3, // 0.7-1.0
      threshold: (i / (colorCount - 1)) * 0.9, // Distribute evenly 0-0.9
    });
  }

  return {
    seed: Math.floor(Math.random() * 100),
    blurIntensity: 0.8 + Math.random() * 1.2, // 0.8-2.0
    noiseScale: 1.5 + Math.random() * 2, // 1.5-3.5
    grainIntensity: 0.1 + Math.random() * 0.15, // 0.1-0.25
    iterations: 25 + Math.floor(Math.random() * 20), // 25-45
    colors: randomColors,
    noiseAlgorithm: randomAlgorithm,
  };
}

/**
 * Interpolate between two gradient configurations
 * Useful for smooth transitions or animations
 */
export function interpolateGradientConfigs(
  configA: OrganicGradientConfig,
  configB: OrganicGradientConfig,
  t: number // 0-1, where 0 is configA and 1 is configB
): OrganicGradientConfig {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Interpolate scalar values
  const seed = Math.round(lerp(configA.seed || 0, configB.seed || 0, t));
  const blurIntensity = lerp(configA.blurIntensity || 1, configB.blurIntensity || 1, t);
  const noiseScale = lerp(configA.noiseScale || 2, configB.noiseScale || 2, t);
  const grainIntensity = lerp(configA.grainIntensity || 0.15, configB.grainIntensity || 0.15, t);
  const iterations = Math.round(lerp(configA.iterations || 30, configB.iterations || 30, t));

  // Use algorithm from config A or B based on t
  const noiseAlgorithm = t < 0.5 ? configA.noiseAlgorithm : configB.noiseAlgorithm;

  // Interpolate colors (if same number of colors, otherwise blend)
  const colorsA = configA.colors || [];
  const colorsB = configB.colors || [];
  const colors: ColorStop[] = [];

  const maxColors = Math.max(colorsA.length, colorsB.length);
  for (let i = 0; i < maxColors; i++) {
    const colorA = colorsA[i] || colorsA[colorsA.length - 1];
    const colorB = colorsB[i] || colorsB[colorsB.length - 1];

    colors.push({
      color: t < 0.5 ? colorA.color : colorB.color, // Simple color switch for now
      alpha: lerp(colorA.alpha, colorB.alpha, t),
      threshold: lerp(colorA.threshold, colorB.threshold, t),
    });
  }

  return {
    seed,
    blurIntensity,
    noiseScale,
    grainIntensity,
    iterations,
    colors,
    noiseAlgorithm,
  };
}

/**
 * Validate a gradient configuration
 * Returns validation errors or null if valid
 */
export function validateGradientConfig(config: OrganicGradientConfig): string[] | null {
  const errors: string[] = [];

  if (config.seed !== undefined && (config.seed < 0 || config.seed > 100)) {
    errors.push('Seed must be between 0 and 100');
  }

  if (config.blurIntensity !== undefined && (config.blurIntensity < 0 || config.blurIntensity > 3)) {
    errors.push('Blur intensity must be between 0 and 3');
  }

  if (config.noiseScale !== undefined && (config.noiseScale < 0.5 || config.noiseScale > 5)) {
    errors.push('Noise scale must be between 0.5 and 5');
  }

  if (config.grainIntensity !== undefined && (config.grainIntensity < 0 || config.grainIntensity > 0.5)) {
    errors.push('Grain intensity must be between 0 and 0.5');
  }

  if (config.iterations !== undefined && (config.iterations < 10 || config.iterations > 100)) {
    errors.push('Iterations must be between 10 and 100');
  }

  if (config.colors) {
    if (config.colors.length < 2) {
      errors.push('At least 2 colors are required');
    }
    if (config.colors.length > 8) {
      errors.push('Maximum 8 colors allowed');
    }

    config.colors.forEach((color, i) => {
      if (color.alpha < 0 || color.alpha > 1) {
        errors.push(`Color ${i + 1}: Alpha must be between 0 and 1`);
      }
      if (color.threshold < 0 || color.threshold > 1) {
        errors.push(`Color ${i + 1}: Threshold must be between 0 and 1`);
      }
    });
  }

  return errors.length > 0 ? errors : null;
}

