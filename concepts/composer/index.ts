/**
 * Composer System Exports
 * 
 * The composer pattern enables concept-specific layout and component configuration.
 */

// Types
export type {
  LayoutMode,
  ContentArea,
  ComponentConfig,
  AreaProps,
  FeatureFlagOverrides,
  TokenOverrides,
  ConceptComposer,
  ComposerRegistry,
} from './types';

// Composers
export {
  coreComposer,
  restaurantComposer,
  composers,
  getComposer,
  isDefaultComponent,
  isHiddenArea,
} from './composers';

// Context (will be added)
export { ComposerProvider, useComposer } from './ComposerContext';
