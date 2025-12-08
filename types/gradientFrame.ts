/**
 * Gradient Frame Types
 * 
 * Types for the theme-aware gradient frame system.
 * Frames can be exported from the playground and imported anywhere in the app.
 */

import { NoiseAlgorithm } from '../components/OrganicGradient';

/**
 * A color stop that references a theme token instead of a hardcoded color.
 * This allows gradients to adapt to the current theme (light/dark/custom).
 */
export interface ThemeColorStop {
  /** Theme token name (e.g., 'primary-default', 'surface-container') */
  token: string;
  /** Opacity/alpha value (0.0 - 1.0) */
  alpha: number;
  /** When this color appears in the noise field (0.0 - 1.0) */
  threshold: number;
}

/**
 * Configuration for an OrganicGradient that can be exported and reused.
 * All visual parameters are explicitly defined for deterministic output.
 */
export interface GradientFrameConfig {
  /** Random seed for noise generation (determines pattern) */
  seed: number;
  /** Strength of the blur effect (0-3) */
  blurIntensity: number;
  /** Scale of the noise pattern (0.5-5, larger = bigger blobs) */
  noiseScale: number;
  /** Intensity of the grain texture (0-0.5) */
  grainIntensity: number;
  /** Number of blur samples (10-100, higher = smoother but slower) */
  iterations: number;
  /** Noise algorithm to use */
  noiseAlgorithm: NoiseAlgorithm;
  /** Array of color stops (2-8 colors) */
  colorStops: ThemeColorStop[];
}

/**
 * A complete gradient frame with metadata.
 * This is what gets exported from the playground and imported in the app.
 */
export interface GradientFrame {
  /** Unique identifier for this frame */
  id: string;
  /** Human-readable name */
  name: string;
  /** Optional description of the gradient's purpose or appearance */
  description?: string;
  /** The actual gradient configuration */
  config: GradientFrameConfig;
  /** Optional tags for filtering/categorization */
  tags?: string[];
  /** When this frame was created */
  createdAt?: string;
  /** Author/creator (optional) */
  author?: string;
}

/**
 * Options for loading gradient frames
 */
export interface GradientFrameOptions {
  /** Whether to refresh/randomize on component mount */
  refreshOnMount?: boolean;
  /** Fallback frame to use if requested frame is not found */
  fallback?: GradientFrame;
}
