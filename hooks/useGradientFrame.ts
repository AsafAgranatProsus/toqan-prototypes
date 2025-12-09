/**
 * useGradientFrame Hook
 * 
 * Hook for loading gradient frames in components.
 * Supports loading by ID, random selection, or filtered by tags.
 */

import { useState, useEffect, useCallback } from 'react';
import { getRandomFrame, getFrameById } from '../configs/gradients/registry';
import { GradientFrame, GradientFrameOptions } from '../types/gradientFrame';

/**
 * Hook to load and manage gradient frames
 * 
 * @param idOrTags - Frame ID (string), array of tags (string[]), or undefined for random
 * @param options - Configuration options
 * @returns Object with current frame and refresh function
 * 
 * @example
 * ```tsx
 * // Load specific frame
 * const { frame } = useGradientFrame('hero-abstract-001');
 * 
 * // Load random frame with tags
 * const { frame } = useGradientFrame(['hero', 'energetic']);
 * 
 * // Load any random frame
 * const { frame, refresh } = useGradientFrame();
 * ```
 */
export function useGradientFrame(
  idOrTags?: string | string[],
  options?: GradientFrameOptions
) {
  const [frame, setFrame] = useState<GradientFrame | null>(() => {
    // Initial frame loading
    if (typeof idOrTags === 'string') {
      // Load by ID
      const foundFrame = getFrameById(idOrTags);
      if (foundFrame) return foundFrame;
      
      console.warn(`Frame '${idOrTags}' not found`);
      return options?.fallback || getRandomFrame() || null;
    }
    
    // Load random with optional tags
    const randomFrame = getRandomFrame(idOrTags);
    return randomFrame || options?.fallback || null;
  });

  /**
   * Refresh/reload the current frame
   * - For ID-based: reloads the same frame (in case it was updated)
   * - For tag/random: loads a new random frame
   */
  const refresh = useCallback(() => {
    if (typeof idOrTags === 'string') {
      // Reload specific frame by ID
      const foundFrame = getFrameById(idOrTags);
      if (foundFrame) {
        setFrame(foundFrame);
      } else {
        console.warn(`Frame '${idOrTags}' not found during refresh`);
      }
    } else {
      // Get new random frame
      const newFrame = getRandomFrame(idOrTags);
      if (newFrame) {
        setFrame(newFrame);
      }
    }
  }, [idOrTags]);

  // Refresh on mount if requested
  useEffect(() => {
    if (options?.refreshOnMount) {
      refresh();
    }
  }, [options?.refreshOnMount, refresh]);

  return { 
    frame, 
    refresh,
    isLoaded: frame !== null,
  };
}
