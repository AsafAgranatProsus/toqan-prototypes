/**
 * Composer Definitions
 * 
 * Each concept has a composer that defines its layout and component configuration.
 * The 'core' composer is the default/baseline configuration.
 */

import { ConceptComposer, ComposerRegistry } from './types';
import { RestaurantLeftPanelWrapper, TopNavbarRestaurant } from '../restaurant';

/**
 * Core Toqan Composer
 * 
 * This is the default configuration that represents the current Toqan layout.
 * All areas use 'default' which means they use the core components.
 */
export const coreComposer: ConceptComposer = {
  id: 'core',
  name: 'Core Toqan',
  layoutMode: 'standard',
  components: {
    topBar: 'default',
    leftPanel: 'default',
    mainStage: 'default',
    rightPanel: 'default',
  },
  // No overrides - uses system defaults
};

/**
 * Restaurant Concept Composer
 * 
 * Configuration for the restaurant owner experience.
 * Uses restaurant-specific sidebar while keeping other areas from core.
 */
export const restaurantComposer: ConceptComposer = {
  id: 'restaurant',
  name: 'Restaurant',
  layoutMode: 'standard',
  components: {
    topBar: TopNavbarRestaurant,          // Restaurant-specific top navbar
    leftPanel: RestaurantLeftPanelWrapper, // Sidebar + secondary panel
    mainStage: 'default',              // Core MainContent (for now)
    rightPanel: 'default',             // Core RightPanel (for now)
  },
  featureOverrides: {
    // Restaurant concept wants the new branding and sidebar enabled
    // newBranding: true,
    // newLeftSidebar: true,
  },
  tokenOverrides: {
    // Restaurant warm accent color (optional)
    // '--color-primary-default': 'hsl(25, 85%, 55%)',
  },
  config: {
    // Restaurant-specific configuration
    // showOrderNotifications: true,
    // defaultView: 'orders',
  },
};

/**
 * Composer Registry
 * 
 * All available composers indexed by concept ID.
 * Add new composers here when creating new concepts.
 */
export const composers: ComposerRegistry = {
  core: coreComposer,
  restaurant: restaurantComposer,
};

/**
 * Get composer for a concept ID.
 * Falls back to core composer if concept not found.
 */
export function getComposer(conceptId: string): ConceptComposer {
  return composers[conceptId] || coreComposer;
}

/**
 * Check if a component config means "use default"
 */
export function isDefaultComponent(config: ConceptComposer['components'][keyof ConceptComposer['components']]): boolean {
  return config === 'default' || config === undefined;
}

/**
 * Check if a component config means "hide this area"
 */
export function isHiddenArea(config: ConceptComposer['components'][keyof ConceptComposer['components']]): boolean {
  return config === null;
}
