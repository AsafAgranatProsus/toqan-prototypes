/**
 * useThemeColors Hook
 * 
 * Resolves theme color tokens to actual hex color values.
 * Reads from CSS variables and converts to hex format for WebGL.
 */

import { useCallback } from 'react';

/**
 * Hook to resolve theme color tokens to hex values
 */
export function useThemeColors() {
  /**
   * Get a color value from a theme token
   * @param token - Token name (e.g., 'primary-default', 'surface-container')
   * @returns Hex color string (e.g., '#4426d9')
   */
  const getColorToken = useCallback((token: string): string => {
    try {
      // Read CSS variable value
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(`--color-${token}`)
        .trim();
      
      if (!value) {
        console.warn(`Theme token not found: --color-${token}, using fallback`);
        return '#000000';
      }
      
      // If already hex, return as-is
      if (value.startsWith('#')) {
        return value;
      }
      
      // Convert rgb/rgba to hex
      if (value.startsWith('rgb')) {
        return rgbToHex(value);
      }
      
      // Fallback for unknown formats
      console.warn(`Unknown color format for token ${token}: ${value}`);
      return '#000000';
    } catch (error) {
      console.error(`Error resolving color token ${token}:`, error);
      return '#000000';
    }
  }, []);

  /**
   * Get multiple color tokens at once
   * @param tokens - Array of token names
   * @returns Array of hex color strings
   */
  const getColorTokens = useCallback((tokens: string[]): string[] => {
    return tokens.map(token => getColorToken(token));
  }, [getColorToken]);

  /**
   * Check if a theme token exists
   * @param token - Token name to check
   * @returns true if the token exists
   */
  const hasColorToken = useCallback((token: string): boolean => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${token}`)
      .trim();
    return !!value;
  }, []);

  return {
    getColorToken,
    getColorTokens,
    hasColorToken,
  };
}

/**
 * Convert RGB/RGBA color string to hex
 * @param rgb - RGB string like 'rgb(68, 38, 217)' or 'rgba(68, 38, 217, 0.5)'
 * @returns Hex color string like '#4426d9'
 */
function rgbToHex(rgb: string): string {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) {
    return '#000000';
  }
  
  const [r, g, b] = match.map(Number);
  
  // Ensure values are in valid range
  const clamp = (n: number) => Math.max(0, Math.min(255, n));
  
  const toHex = (n: number) => {
    const hex = clamp(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * List of available color tokens in the theme system.
 * Use this for documentation, dropdowns, or validation.
 */
export const AVAILABLE_COLOR_TOKENS = [
  // Primary
  'primary-default',
  'primary-hover',
  'primary-background',
  'primary-light',
  
  // Secondary
  'secondary-default',
  'secondary-hover',
  'secondary-background',
  'secondary-light',
  
  // Tertiary
  'tertiary-default',
  'tertiary-hover',
  'tertiary-background',
  'tertiary-light',
  
  // Surface Container Hierarchy
  'surface-container-lowest',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
  
  // On Colors
  'on-primary',
  'on-secondary',
  'on-tertiary',
  'on-surface',
  'on-surface-variant',
  
  // UI Colors
  'ui-background',
  'ui-background-elevated',
  'ui-border',
  'ui-active',
  
  // Semantic Colors
  'error',
  'success',
  'warning',
  'info',
  
  // Text
  'text-default',
  'text-secondary',
  'text-tertiary',
] as const;

export type ColorToken = typeof AVAILABLE_COLOR_TOKENS[number];
