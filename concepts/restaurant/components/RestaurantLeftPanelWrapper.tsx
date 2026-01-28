/**
 * Restaurant Left Panel Wrapper
 * 
 * Renders LeftSidebarRestaurant, secondary panels, and asset canvas.
 * - Shows SecondaryPanel (Library) when Library nav is active and panel is open
 * - Shows PrioritiesPanel when Priorities nav is active and panel is open
 * - Shows LocationsPanel when Locations nav is active (independent of isSecondaryPanelOpen)
 * - Shows AssetCanvas when an asset is selected (between secondary panel and main)
 * 
 * CSS Grid in the parent handles positioning.
 * Uses React Fragment to avoid extra wrapper div.
 */

import React from 'react';
import { LeftSidebarRestaurant } from './LeftSidebarRestaurant';
import { SecondaryPanel } from './SecondaryPanel';
import { PrioritiesPanel } from './PrioritiesPanel';
import { LocationsPanel } from './LocationsPanel';
import { AssetCanvas } from './AssetCanvas';
import { AreaProps } from '../../composer/types';
import { useRestaurant } from '../context/RestaurantContext';

export const RestaurantLeftPanelWrapper: React.FC<AreaProps> = (props) => {
  const { isSecondaryPanelOpen, closeSecondaryPanel, activeNavId, isCanvasOpen } = useRestaurant();

  // Determine which panel to show based on active nav
  const renderSecondaryPanel = () => {
    // Locations panel is always shown when locations nav is active (not controlled by isSecondaryPanelOpen)
    if (activeNavId === 'locations') {
      return (
        <LocationsPanel
          isOpen={true}
          onClose={closeSecondaryPanel}
        />
      );
    }
    
    if (!isSecondaryPanelOpen) return null;
    
    switch (activeNavId) {
      case 'priorities':
        return (
          <PrioritiesPanel
            isOpen={isSecondaryPanelOpen}
            onClose={closeSecondaryPanel}
          />
        );
      case 'Library':
        return (
          <SecondaryPanel
            isOpen={isSecondaryPanelOpen}
            onClose={closeSecondaryPanel}
            title="Library"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <LeftSidebarRestaurant {...props} />
      {renderSecondaryPanel()}
      {isCanvasOpen && activeNavId === 'Library' && <AssetCanvas />}
    </>
  );
};

export default RestaurantLeftPanelWrapper;
