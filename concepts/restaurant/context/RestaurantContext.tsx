/**
 * Restaurant Context
 * 
 * Provides shared state for restaurant concept components.
 * Includes secondary panel state, active view, asset selection, etc.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Asset } from '../data/assets';

// Saved message asset (simplified version for chat messages)
export interface SavedMessageAsset {
  id: string;
  title: string;
  content: string;
  savedAt: string;
  sourceSessionId?: string;
}

interface RestaurantContextType {
  // Secondary panel state
  isSecondaryPanelOpen: boolean;
  toggleSecondaryPanel: () => void;
  openSecondaryPanel: () => void;
  closeSecondaryPanel: () => void;
  
  // Active navigation
  activeNavId: string;
  setActiveNavId: (id: string) => void;
  /** Navigate to a nav item, clearing any active selections */
  navigateToNav: (navId: string) => void;
  
  // Selected asset (for canvas display)
  selectedAssetId: string | null;
  selectAsset: (id: string | null) => void;
  isCanvasOpen: boolean;
  
  // Saved message assets
  savedMessages: SavedMessageAsset[];
  saveMessage: (content: string, title?: string, sessionId?: string) => void;
  removeSavedMessage: (id: string) => void;
  
  // Locations view state
  selectedLocationId: string | null;
  selectLocation: (id: string | null) => void;
  
  // Priority selection (for At a Glance → Priorities navigation)
  selectedPriorityId: string | null;
  selectPriority: (id: string | null) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const SAVED_MESSAGES_STORAGE_KEY = 'toqan-saved-messages';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecondaryPanelOpen, setIsSecondaryPanelOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState('home');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(null);
  
  // Load saved messages from localStorage
  const [savedMessages, setSavedMessages] = useState<SavedMessageAsset[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_MESSAGES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

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

  const selectLocation = useCallback((id: string | null) => {
    setSelectedLocationId(id);
  }, []);

  const selectPriority = useCallback((id: string | null) => {
    setSelectedPriorityId(id);
  }, []);

  // Navigate to a nav item - clears any active selections to reset conversation state
  const navigateToNav = useCallback((navId: string) => {
    // Clear selections when switching nav items to reset to contextual-start
    setSelectedAssetId(null);
    setSelectedLocationId(null);
    setSelectedPriorityId(null);
    setActiveNavId(navId);
  }, []);

  // Save a message to assets
  const saveMessage = useCallback((content: string, title?: string, sessionId?: string) => {
    const newAsset: SavedMessageAsset = {
      id: `saved-${Date.now()}`,
      title: title || `Saved Response - ${new Date().toLocaleDateString()}`,
      content,
      savedAt: new Date().toISOString(),
      sourceSessionId: sessionId,
    };
    
    setSavedMessages(prev => {
      const updated = [newAsset, ...prev];
      try {
        localStorage.setItem(SAVED_MESSAGES_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save message to localStorage:', error);
      }
      return updated;
    });
  }, []);

  // Remove a saved message
  const removeSavedMessage = useCallback((id: string) => {
    setSavedMessages(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem(SAVED_MESSAGES_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update localStorage:', error);
      }
      return updated;
    });
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
      navigateToNav,
      selectedAssetId,
      selectAsset,
      isCanvasOpen,
      savedMessages,
      saveMessage,
      removeSavedMessage,
      selectedLocationId,
      selectLocation,
      selectedPriorityId,
      selectPriority,
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
      activeNavId: 'home',
      setActiveNavId: () => {},
      navigateToNav: () => {},
      selectedAssetId: null,
      selectAsset: () => {},
      isCanvasOpen: false,
      savedMessages: [],
      saveMessage: () => {},
      removeSavedMessage: () => {},
      selectedLocationId: null,
      selectLocation: () => {},
      selectedPriorityId: null,
      selectPriority: () => {},
    };
  }
  return context;
};
