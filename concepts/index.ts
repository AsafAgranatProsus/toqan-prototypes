/**
 * Concept Registry
 * 
 * This file exports all concept-specific configurations and components.
 * Each concept can define:
 * - Pages (routes specific to the concept)
 * - Components (overrides or new components)
 * - Configs (feature flag defaults, scenarios, etc.)
 * - Styles (concept-specific tokens/themes)
 */

// Re-export concept definitions from context
export { CONCEPTS, type ConceptId, type Concept } from '../context/ConceptContext';

// Import concept-specific modules
import * as restaurant from './restaurant';

// Export concept modules
export { restaurant };

// Concept route configurations
export const conceptRoutes = {
  restaurant: restaurant.routes,
} as const;

// Concept-specific feature flag overrides
export const conceptFeatureDefaults = {
  restaurant: restaurant.featureDefaults,
} as const;
