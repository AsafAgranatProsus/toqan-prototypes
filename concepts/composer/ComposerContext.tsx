/**
 * Composer Context
 * 
 * Provides access to the active composer based on the current concept.
 * Handles feature flag and token overrides when a concept is active.
 * Wraps concept-specific providers (e.g., RestaurantProvider).
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useConcept } from '../../context/ConceptContext';
import { ConceptComposer, ContentArea, ComponentConfig } from './types';
import { getComposer, isDefaultComponent, isHiddenArea } from './composers';
import { RestaurantProvider } from '../restaurant';

interface ComposerContextType {
  /** The active composer configuration */
  composer: ConceptComposer;
  
  /** Get component config for a content area */
  getAreaConfig: (area: ContentArea) => ComponentConfig;
  
  /** Check if an area should use default component */
  isAreaDefault: (area: ContentArea) => boolean;
  
  /** Check if an area should be hidden */
  isAreaHidden: (area: ContentArea) => boolean;
  
  /** The current layout mode */
  layoutMode: ConceptComposer['layoutMode'];
  
  /** Concept-specific configuration */
  config: Record<string, any>;
}

const ComposerContext = createContext<ComposerContextType | undefined>(undefined);

export const ComposerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { conceptId } = useConcept();
  
  // Get composer for current concept
  const composer = useMemo(() => getComposer(conceptId), [conceptId]);
  
  // Apply token overrides when composer changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Store original values to restore later
    const originalValues: Record<string, string> = {};
    
    if (composer.tokenOverrides) {
      Object.entries(composer.tokenOverrides).forEach(([token, value]) => {
        // Store original
        originalValues[token] = root.style.getPropertyValue(token);
        // Apply override
        root.style.setProperty(token, value as string);
      });
    }
    
    // Cleanup: restore original values when composer changes
    return () => {
      Object.entries(originalValues).forEach(([token, value]) => {
        if (value) {
          root.style.setProperty(token, value);
        } else {
          root.style.removeProperty(token);
        }
      });
    };
  }, [composer]);
  
  // Helper functions
  const getAreaConfig = (area: ContentArea): ComponentConfig => {
    return composer.components[area] ?? 'default';
  };
  
  const isAreaDefault = (area: ContentArea): boolean => {
    return isDefaultComponent(composer.components[area]);
  };
  
  const isAreaHidden = (area: ContentArea): boolean => {
    return isHiddenArea(composer.components[area]);
  };
  
  const value: ComposerContextType = {
    composer,
    getAreaConfig,
    isAreaDefault,
    isAreaHidden,
    layoutMode: composer.layoutMode ?? 'standard',
    config: composer.config ?? {},
  };
  
  // Wrap with concept-specific providers
  const wrappedChildren = useMemo(() => {
    switch (conceptId) {
      case 'restaurant':
        return <RestaurantProvider>{children}</RestaurantProvider>;
      default:
        return children;
    }
  }, [conceptId, children]);

  return (
    <ComposerContext.Provider value={value}>
      {wrappedChildren}
    </ComposerContext.Provider>
  );
};

export const useComposer = (): ComposerContextType => {
  const context = useContext(ComposerContext);
  if (context === undefined) {
    throw new Error('useComposer must be used within a ComposerProvider');
  }
  return context;
};
