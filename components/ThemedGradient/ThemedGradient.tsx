/**
 * ThemedGradient Component
 * 
 * A theme-aware wrapper for OrganicGradient that resolves color tokens
 * from the current theme. This allows gradient frames to adapt to different
 * themes (light/dark/custom) automatically.
 */

import React from 'react';
import { OrganicGradient, ColorStop } from '../OrganicGradient';
import { useThemeColors } from '../../hooks/useThemeColors';
import { GradientFrame } from '../../types/gradientFrame';

export interface ThemedGradientProps {
  /** The gradient frame configuration */
  frame: GradientFrame;
  /** Optional CSS class name */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * ThemedGradient - Renders an OrganicGradient with theme-aware colors
 * 
 * @example
 * ```tsx
 * import { ThemedGradient } from './components/ThemedGradient';
 * import heroFrame from './configs/gradients/hero-abstract.json';
 * 
 * <ThemedGradient frame={heroFrame} />
 * ```
 */
export const ThemedGradient: React.FC<ThemedGradientProps> = ({ 
  frame, 
  className,
  style 
}) => {
  const { getColorToken } = useThemeColors();
  
  // Map theme tokens to actual hex colors
  const colors: ColorStop[] = React.useMemo(() => {
    return frame.config.colorStops.map(stop => ({
      color: getColorToken(stop.token),
      alpha: stop.alpha,
      threshold: stop.threshold,
    }));
  }, [frame.config.colorStops, getColorToken]);
  
  return (
    <div 
      className={className} 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      <OrganicGradient
        seed={frame.config.seed}
        blurIntensity={frame.config.blurIntensity}
        noiseScale={frame.config.noiseScale}
        grainIntensity={frame.config.grainIntensity}
        iterations={frame.config.iterations}
        noiseAlgorithm={frame.config.noiseAlgorithm}
        colors={colors}
      />
    </div>
  );
};

export default ThemedGradient;
