/**
 * useGradientPreset Hook
 * 
 * Automatically loads gradient presets and converts theme tokens to actual colors.
 * Handles both named presets and random preset selection.
 * Re-converts colors when theme changes (light/dark mode).
 */

import { useMemo } from 'react';
import { useThemeColors } from './useThemeColors';
import { getPreset, getRandomPreset, type GradientPresetName } from '../configs/gradients/presets';
import type { OrganicGradientConfig } from '../components/GradientBackground/GradientBackground';
import type { ColorStop } from '../components/OrganicGradient/OrganicGradient';

/**
 * Load a gradient preset and convert theme tokens to actual colors
 * 
 * @param presetName - Optional preset name. If not provided, a random preset is selected
 * @returns Organic gradient configuration with resolved colors
 * 
 * @example
 * // Load specific preset
 * const config = useGradientPreset('waves');
 * 
 * @example
 * // Load random preset
 * const config = useGradientPreset();
 */
export function useGradientPreset(
  presetName?: GradientPresetName
): OrganicGradientConfig {
  const { getColorToken } = useThemeColors();
  
  // Load preset - either named or random
  // Memoized to prevent unnecessary reloads
  const frame = useMemo(() => {
    return presetName ? getPreset(presetName) : getRandomPreset();
  }, [presetName]);
  
  // Convert theme tokens to actual colors
  // Re-runs when theme changes (getColorToken dependency)
  return useMemo(() => {
    const colors: ColorStop[] = frame.config.colorStops.map(stop => ({
      color: getColorToken(stop.token),
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
  }, [frame, getColorToken]);
}

