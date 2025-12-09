/**
 * Gradient Presets Registry
 * 
 * Centralized registry of all available gradient presets.
 * Presets use theme tokens that automatically adapt to light/dark mode.
 */

import type { GradientFrame } from '../../types/gradientFrame';
import waves from './frames/waves.json';
import heroBold from './frames/hero-bold.json';
import heroAbstract from './frames/hero-abstract.json';
import cardAccent from './frames/card-accent.json';
import backgroundCalm from './frames/background-calm.json';

/**
 * Registry of all available gradient presets
 */
export const GRADIENT_PRESETS = {
  'waves': waves as GradientFrame,
  'hero-bold': heroBold as GradientFrame,
  'hero-abstract': heroAbstract as GradientFrame,
  'card-accent': cardAccent as GradientFrame,
  'background-calm': backgroundCalm as GradientFrame,
} as const;

/**
 * Type-safe preset names for autocomplete
 */
export type GradientPresetName = keyof typeof GRADIENT_PRESETS;

/**
 * Get a specific preset by name
 * @param name - The preset name
 * @returns The gradient frame
 */
export function getPreset(name: GradientPresetName): GradientFrame {
  return GRADIENT_PRESETS[name];
}

/**
 * Get a random preset from the registry
 * @returns A random gradient frame
 */
export function getRandomPreset(): GradientFrame {
  const names = Object.keys(GRADIENT_PRESETS) as GradientPresetName[];
  const randomIndex = Math.floor(Math.random() * names.length);
  return GRADIENT_PRESETS[names[randomIndex]];
}

/**
 * Get all preset names
 * @returns Array of all preset names
 */
export function getPresetNames(): GradientPresetName[] {
  return Object.keys(GRADIENT_PRESETS) as GradientPresetName[];
}

/**
 * Get all presets
 * @returns Array of all gradient frames
 */
export function getAllPresets(): GradientFrame[] {
  return Object.values(GRADIENT_PRESETS);
}

