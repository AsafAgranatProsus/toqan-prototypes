import React, { useState, useEffect } from 'react';
import { useDesignSystem } from '../../context/DesignSystemContext';
import OrganicGradient, { type ColorStop, type NoiseAlgorithm } from '../OrganicGradient/OrganicGradient';
import { useGradientPreset } from '../../hooks/useGradientPreset';
import type { GradientPresetName } from '../../configs/gradients/presets';
import './GradientBackground.css';

// Blob gradient configuration
interface Blob {
  id: number;
  top: string;
  left: string;
  size: number;
  color: string;
}

// Organic gradient configuration (matches OrganicGradient props)
export interface OrganicGradientConfig {
  seed?: number;
  blurIntensity?: number;
  noiseScale?: number;
  grainIntensity?: number;
  iterations?: number;
  colors?: ColorStop[];
  noiseAlgorithm?: NoiseAlgorithm;
}

// Supported gradient types
export type GradientType = 'blob' | 'organic';

export interface GradientBackgroundProps {
  /** Type of gradient to render. Default: 'blob' */
  type?: GradientType;
  /** Configuration for the gradient. If not provided, will use preset or randomized defaults */
  config?: OrganicGradientConfig;
  /** Preset name to load. Auto-converts theme tokens to colors. Ignored if config is provided. */
  preset?: GradientPresetName;
  /** Whether to animate the gradient over time. Default: true for blob, false for organic */
  animate?: boolean;
  /** Animation interval in milliseconds. Default: 5000 */
  animationInterval?: number;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  type = 'blob',
  config,
  preset,
  animate,
  animationInterval = 5000,
}) => {
  const { isDark } = useDesignSystem();
  
  // Determine if animation should be enabled
  const shouldAnimate = animate !== undefined ? animate : type === 'blob';
  
  // Automatically load preset if type is organic and no explicit config
  const shouldUsePreset = type === 'organic' && !config;
  const presetConfig = useGradientPreset(shouldUsePreset ? preset : undefined);
  
  // --- BLOB GRADIENT STATE ---
  const blobColors = isDark
    ? [
        'rgba(91, 143, 255, 0.4)',   // Blue
        'rgba(175, 82, 222, 0.4)',   // Purple
        'rgba(255, 85, 85, 0.3)',    // Coral red
        'rgba(85, 217, 158, 0.3)',   // Mint green
      ]
    : [
        'rgba(196, 181, 253, 0.5)',
        'rgba(165, 243, 252, 0.4)',
      ];

  const generateBlob = (id: number): Blob => ({
    id,
    top: `${Math.random() * 80}%`,
    left: `${Math.random() * 80}%`,
    size: Math.random() * 300 + 200,
    color: blobColors[Math.floor(Math.random() * blobColors.length)],
  });

  const generateInitialBlobs = (count: number): Blob[] => {
    return Array.from({ length: count }, (_, i) => generateBlob(i));
  };
  
  const [blobs, setBlobs] = useState<Blob[]>(() => generateInitialBlobs(4));

  // --- ORGANIC GRADIENT STATE ---
  // Generate randomized organic gradient config if not provided
  const generateRandomOrganicConfig = (): OrganicGradientConfig => {
    const randomSeed = Math.floor(Math.random() * 100);
    const algorithms: NoiseAlgorithm[] = ['value', 'simplex', 'perlin', 'fbm'];
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
      seed: randomSeed,
      blurIntensity: 0.8 + Math.random() * 1.2, // 0.8-2.0
      noiseScale: 1.5 + Math.random() * 2, // 1.5-3.5
      grainIntensity: 0.1 + Math.random() * 0.15, // 0.1-0.25
      iterations: 25 + Math.floor(Math.random() * 20), // 25-45
      colors: randomColors,
      noiseAlgorithm: randomAlgorithm,
    };
  };

  const [organicConfig, setOrganicConfig] = useState<OrganicGradientConfig>(() => 
    config || (type === 'organic' ? presetConfig : generateRandomOrganicConfig())
  );

  // Update organic config when config prop or preset changes
  useEffect(() => {
    if (config) {
      // Explicit config takes priority
      setOrganicConfig(config);
    } else if (type === 'organic' && shouldUsePreset) {
      // Use preset config (automatically updated when theme changes)
      setOrganicConfig(presetConfig);
    } else if (type === 'organic') {
      // Fallback to random generation (shouldn't normally hit this)
      setOrganicConfig(generateRandomOrganicConfig());
    }
  }, [config, type, shouldUsePreset, presetConfig]);

  // --- ANIMATION EFFECT ---
  useEffect(() => {
    if (!shouldAnimate) return;

    if (type === 'blob') {
      // Animate blobs
      setBlobs(generateInitialBlobs(4));
      
      const interval = setInterval(() => {
        setBlobs(currentBlobs => 
          currentBlobs.map(blob => generateBlob(blob.id))
        );
      }, animationInterval);

      return () => clearInterval(interval);
    } else if (type === 'organic') {
      // Animate organic gradient by changing seed
      const interval = setInterval(() => {
        setOrganicConfig(prev => ({
          ...prev,
          seed: (prev.seed || 0) + 1,
        }));
      }, animationInterval);

      return () => clearInterval(interval);
    }
  }, [shouldAnimate, type, animationInterval, blobColors]);

  // --- RENDER ---
  if (type === 'organic') {
    return (
      <div className="gradient-background gradient-background--organic">
        <OrganicGradient {...organicConfig} />
      </div>
    );
  }

  // Default: blob gradient
  return (
    <div className="gradient-background gradient-background--blob">
      <div className="gradient-blobs">
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className="gradient-blob"
            style={{
              top: blob.top,
              left: blob.left,
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              backgroundColor: blob.color,
            }}
          />
        ))}
      </div>
      <div className="gradient-grain"></div>
    </div>
  );
};

export default GradientBackground;