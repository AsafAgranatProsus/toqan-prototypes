/**
 * Gradient Frame Registry
 * 
 * Central registry for all gradient frames in the application.
 * Import and register all gradient frame JSON files here.
 */

import { GradientFrame } from '../../types/gradientFrame';

// Import gradient frames
import heroAbstract from './frames/hero-abstract.json';
import backgroundCalm from './frames/background-calm.json';
import heroBold from './frames/hero-bold.json';
import cardAccent from './frames/card-accent.json';
import waves from './frames/waves.json';

/**
 * Central frame registry
 * Maps frame IDs to frame configurations
 */
export const GRADIENT_FRAMES: Record<string, GradientFrame> = {
  'hero-abstract-001': heroAbstract as GradientFrame,
  'background-calm-001': backgroundCalm as GradientFrame,
  'hero-bold-001': heroBold as GradientFrame,
  'card-accent-001': cardAccent as GradientFrame,
  'dynamic-waves-001': waves as GradientFrame,
};

/**
 * Get a random gradient frame
 * @param tags - Optional array of tags to filter by
 * @returns A random GradientFrame
 */
export function getRandomFrame(tags?: string[]): GradientFrame | null {
  const frames = Object.values(GRADIENT_FRAMES);
  
  if (frames.length === 0) {
    console.warn('No gradient frames available');
    return null;
  }
  
  // Filter by tags if provided
  const filtered = tags && tags.length > 0
    ? frames.filter(f => 
        f.tags && tags.some(tag => f.tags!.includes(tag))
      )
    : frames;
  
  if (filtered.length === 0) {
    console.warn(`No gradient frames found with tags: ${tags?.join(', ')}`);
    return null;
  }
  
  // Return random frame from filtered list
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Get a specific gradient frame by ID
 * @param id - Frame ID to retrieve
 * @returns The GradientFrame or undefined if not found
 */
export function getFrameById(id: string): GradientFrame | undefined {
  return GRADIENT_FRAMES[id];
}

/**
 * Get all gradient frames with a specific tag
 * @param tag - Tag to filter by
 * @returns Array of matching GradientFrames
 */
export function getFramesByTag(tag: string): GradientFrame[] {
  return Object.values(GRADIENT_FRAMES).filter(f => 
    f.tags?.includes(tag)
  );
}

/**
 * Get all available gradient frames
 * @returns Array of all GradientFrames
 */
export function getAllFrames(): GradientFrame[] {
  return Object.values(GRADIENT_FRAMES);
}

/**
 * Get all unique tags used across all frames
 * @returns Array of unique tag strings
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  
  Object.values(GRADIENT_FRAMES).forEach(frame => {
    frame.tags?.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Register a new gradient frame at runtime
 * @param frame - The GradientFrame to register
 */
export function registerFrame(frame: GradientFrame): void {
  if (GRADIENT_FRAMES[frame.id]) {
    console.warn(`Frame with ID '${frame.id}' already exists, overwriting...`);
  }
  GRADIENT_FRAMES[frame.id] = frame;
}

/**
 * Unregister a gradient frame
 * @param id - Frame ID to remove
 * @returns true if frame was removed, false if not found
 */
export function unregisterFrame(id: string): boolean {
  if (GRADIENT_FRAMES[id]) {
    delete GRADIENT_FRAMES[id];
    return true;
  }
  return false;
}
