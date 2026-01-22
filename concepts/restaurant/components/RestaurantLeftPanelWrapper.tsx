/**
 * Restaurant Left Panel Wrapper
 * 
 * Renders LeftSidebarRestaurant, secondary panels, and asset canvas.
 * - Shows SecondaryPanel (Assets) when Assets nav is active and panel is open
 * - Shows PrioritiesPanel when Priorities nav is active and panel is open
 * - Shows AssetCanvas when an asset is selected (between secondary panel and main)
 * 
 * CSS Grid in the parent handles positioning.
 * Uses React Fragment to avoid extra wrapper div.
 */

import React from 'react';
import { LeftSidebarRestaurant } from './LeftSidebarRestaurant';
import { SecondaryPanel } from './SecondaryPanel';
import { PrioritiesPanel } from './PrioritiesPanel';
import { AssetCanvas } from './AssetCanvas';
import { AreaProps } from '../../composer/types';
import { useRestaurant } from '../context/RestaurantContext';

export const RestaurantLeftPanelWrapper: React.FC<AreaProps> = (props) => {
  const { isSecondaryPanelOpen, closeSecondaryPanel, activeNavId, isCanvasOpen } = useRestaurant();

  // Determine which panel to show based on active nav
  const renderSecondaryPanel = () => {
    if (!isSecondaryPanelOpen) return null;
    
    switch (activeNavId) {
      case 'priorities':
        return (
          <PrioritiesPanel
            isOpen={isSecondaryPanelOpen}
            onClose={closeSecondaryPanel}
          />
        );
      case 'Assets':
        return (
          <SecondaryPanel
            isOpen={isSecondaryPanelOpen}
            onClose={closeSecondaryPanel}
            title="Assets"
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
      {isCanvasOpen && activeNavId === 'Assets' && <AssetCanvas />}
    </>
  );
};

export default RestaurantLeftPanelWrapper;
