/**
 * Locations Panel (Restaurant Concept)
 * 
 * Displays the locations grid and detail views in a side panel.
 * Similar to PrioritiesPanel but wider by default.
 * Chat panel remains visible on the right.
 * 
 * View transitions:
 * - List → Details: slide left and fade
 * - Details → List: slide right and fade
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Icons } from '../../../components/Icons/Icons';
import Button from '../../../components/Button/Button';
import { ResizeHandle } from '../../../components/ResizeHandle/ResizeHandle';
import { useFeatureFlags } from '../../../context/FeatureFlagContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useChatSession } from '../../../shared/chatSession';
import { LocationsGrid, LOCATIONS } from './LocationsGrid';
import { LocationDetailView } from './LocationDetailView';
import './LocationsPanel.css';

const DEFAULT_WIDTH = 640;  // Wider by default (double the priorities panel)
const MIN_WIDTH = 400;
const MAX_WIDTH = 900;
const STORAGE_KEY = 'toqan-locations-panel-width';

type TransitionDirection = 'forward' | 'backward' | null;

interface LocationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationsPanel: React.FC<LocationsPanelProps> = ({ isOpen, onClose }) => {
  const { isFeatureActive } = useFeatureFlags();
  const { selectedLocationId, selectLocation, navigateToNav } = useRestaurant();
  const { endSession } = useChatSession();
  
  // Track animation state
  const [animationDirection, setAnimationDirection] = useState<TransitionDirection>(null);
  const prevLocationIdRef = useRef<string | null>(null);

  // Use useLayoutEffect to set animation direction synchronously BEFORE browser paint
  // This prevents the flash by ensuring the animation class is applied before content is visible
  useLayoutEffect(() => {
    const prevId = prevLocationIdRef.current;
    const currentId = selectedLocationId;
    
    if (prevId === null && currentId !== null) {
      // Going from list to details - slide left
      setAnimationDirection('forward');
    } else if (prevId !== null && currentId === null) {
      // Going from details to list - slide right
      setAnimationDirection('backward');
    }
    
    // Update ref for next comparison
    prevLocationIdRef.current = currentId;
  }, [selectedLocationId]);

  // Clear animation direction after animation completes
  useEffect(() => {
    if (animationDirection) {
      const timer = setTimeout(() => {
        setAnimationDirection(null);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [animationDirection]);

  const handleClose = () => {
    selectLocation(null);
    navigateToNav('home');
    onClose();
  };

  // Load width from localStorage
  const [width, setWidth] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
    } catch {
      return DEFAULT_WIDTH;
    }
  });

  // Save width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(width));
    } catch (error) {
      console.error('Failed to save locations panel width:', error);
    }
  }, [width]);

  const handleResize = (newWidth: number) => {
    setWidth(newWidth);
  };

  const handleLocationClick = (locationId: string) => {
    // End any active chat session when selecting a location
    endSession();
    selectLocation(locationId);
  };

  const handleBack = () => {
    selectLocation(null);
  };

  if (!isOpen) return null;

  const isResizable = isFeatureActive('newResizeablePanels');
  const panelStyle: React.CSSProperties = isResizable ? {
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
  } : {
    width: `${DEFAULT_WIDTH}px`,
    minWidth: `${DEFAULT_WIDTH}px`,
  };

  // Determine animation class based on animation direction state
  const getViewClass = () => {
    if (animationDirection === 'forward') {
      return 'locations-panel__view--slide-left';
    }
    if (animationDirection === 'backward') {
      return 'locations-panel__view--slide-right';
    }
    return '';
  };

  return (
    <aside className="locations-panel panel-with-shadow" style={panelStyle}>
      {/* Resize handle */}
      {isResizable && (
        <ResizeHandle
          onResize={handleResize}
          currentWidth={width}
          minWidth={MIN_WIDTH}
          maxWidth={MAX_WIDTH}
          defaultWidth={DEFAULT_WIDTH}
          position="right"
          bufferSize={20}
        />
      )}
      
      <div className="locations-panel__header">
        <h2 className="locations-panel__title">
          <Icons name="Store" />
          Locations
          <span className="locations-panel__count">{LOCATIONS.length}</span>
        </h2>
        <Button
          variant="text"
          shape="circle"
          icon="X"
          aria-label="Close panel"
          onClick={handleClose}
        />
      </div>

      <div className="locations-panel__content">
        <div className={`locations-panel__view ${getViewClass()}`}>
          {selectedLocationId ? (
            <LocationDetailView
              locationId={selectedLocationId}
              onBack={handleBack}
            />
          ) : (
            <LocationsGrid
              onLocationClick={handleLocationClick}
              showCentralKitchen={true}
            />
          )}
        </div>
      </div>
    </aside>
  );
};

export default LocationsPanel;
