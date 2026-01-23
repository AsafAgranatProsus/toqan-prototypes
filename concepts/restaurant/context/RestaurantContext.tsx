/**
 * Restaurant Context
 * 
 * Provides shared state for restaurant concept components.
 * Includes secondary panel state, active view, asset selection, etc.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface RestaurantContextType {
  // Secondary panel state
  isSecondaryPanelOpen: boolean;
  toggleSecondaryPanel: () => void;
  openSecondaryPanel: () => void;
  closeSecondaryPanel: () => void;
  
  // Active navigation
  activeNavId: string;
  setActiveNavId: (id: string) => void;
  
  // Selected asset (for canvas display)
  selectedAssetId: string | null;
  selectAsset: (id: string | null) => void;
  isCanvasOpen: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecondaryPanelOpen, setIsSecondaryPanelOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState('priorities');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const toggleSecondaryPanel = useCallback(() => {
    setIsSecondaryPanelOpen(prev => !prev);
  }, []);

  const openSecondaryPanel = useCallback(() => {
    setIsSecondaryPanelOpen(true);
  }, []);

  const closeSecondaryPanel = useCallback(() => {
    setIsSecondaryPanelOpen(false);
    setSelectedAssetId(null); // Close canvas when panel closes
  }, []);

  const selectAsset = useCallback((id: string | null) => {
    setSelectedAssetId(id);
  }, []);

  // Canvas is open when an asset is selected
  const isCanvasOpen = selectedAssetId !== null;

  return (
    <RestaurantContext.Provider value={{
      isSecondaryPanelOpen,
      toggleSecondaryPanel,
      openSecondaryPanel,
      closeSecondaryPanel,
      activeNavId,
      setActiveNavId,
      selectedAssetId,
      selectAsset,
      isCanvasOpen,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (!context) {
    // Return defaults if used outside provider (graceful degradation)
    return {
      isSecondaryPanelOpen: false,
      toggleSecondaryPanel: () => {},
      openSecondaryPanel: () => {},
      closeSecondaryPanel: () => {},
      activeNavId: 'priorities',
      setActiveNavId: () => {},
      selectedAssetId: null,
      selectAsset: () => {},
      isCanvasOpen: false,
    };
  }
  return context;
};
