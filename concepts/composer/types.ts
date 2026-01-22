/**
 * Concept Composer Types
 * 
 * The composer pattern allows concepts to define:
 * 1. Which components render in which layout areas
 * 2. How layout areas are arranged (layout mode)
 * 3. Feature flag and token overrides per concept
 * 
 * This enables variations like:
 * - Core Toqan: Chat as main stage, panels on sides
 * - Restaurant: Dashboard as main stage, chat in right panel
 */

import { ComponentType } from 'react';

/**
 * Layout modes define the overall arrangement of content areas.
 * Each mode can position the same areas differently.
 * 
 * - 'standard': Current Toqan layout (left sidebar, main content, optional right panel)
 * - 'dashboard': Main stage is a dashboard/grid, chat moves to panel
 * - 'focus': Minimal layout, just main content
 * - 'split': Equal split between two main areas
 */
export type LayoutMode = 'standard' | 'dashboard' | 'focus' | 'split';

/**
 * Content areas that can be composed.
 * These are logical areas, not tied to physical positions.
 */
export type ContentArea = 
  | 'topBar'
  | 'leftPanel'
  | 'mainStage'
  | 'rightPanel'
  | 'bottomBar';

/**
 * Component configuration for a content area.
 * 
 * - 'default': Use the core/default component for this area
 * - ComponentType: Use a specific component
 * - null: Hide/disable this area entirely
 */
export type ComponentConfig = 'default' | ComponentType<any> | null;

/**
 * Props that layout areas receive.
 * Components assigned to areas should accept these props.
 */
export interface AreaProps {
  isOpen?: boolean;
  setOpen?: (open: boolean) => void;
  isMobile?: boolean;
  [key: string]: any;
}

/**
 * Feature flag overrides for a concept.
 * Allows concepts to set their own default flag values.
 */
export type FeatureFlagOverrides = Record<string, boolean>;

/**
 * Token/CSS variable overrides for a concept.
 * Allows concepts to customize design tokens.
 */
export type TokenOverrides = Record<string, string>;

/**
 * The main Composer interface.
 * Each concept defines a composer that controls its layout and components.
 */
export interface ConceptComposer {
  /** Unique identifier matching the concept ID */
  id: string;
  
  /** Display name for the composer */
  name: string;
  
  /** 
   * Layout mode determines overall arrangement.
   * Defaults to 'standard' if not specified.
   */
  layoutMode?: LayoutMode;
  
  /**
   * Component assignments for each content area.
   * Use 'default' to inherit core component, null to hide area.
   */
  components: Partial<Record<ContentArea, ComponentConfig>>;
  
  /**
   * Feature flag overrides for this concept.
   * These are applied when the concept is active.
   */
  featureOverrides?: FeatureFlagOverrides;
  
  /**
   * CSS token overrides for this concept.
   * Applied as CSS custom properties.
   */
  tokenOverrides?: TokenOverrides;
  
  /**
   * Additional concept-specific configuration.
   * Can be used for custom props passed to components.
   */
  config?: Record<string, any>;
}

/**
 * Registry of all available composers.
 */
export type ComposerRegistry = Record<string, ConceptComposer>;
