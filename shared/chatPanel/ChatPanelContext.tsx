/**
 * Chat Panel Context
 * 
 * Manages chat panel conversation state and derives contextual quick actions
 * based on current view state (selected asset, location, nav item, etc.).
 * 
 * Three conversation states:
 * - cold-start: Home view with full content
 * - contextual-start: Nav selected, no item - centered chat input + quick buttons
 * - chatting: Active conversation - chat input only at bottom
 */

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import type { QuickAction, ChatPanelMode, ContextType, ChatPanelState, ConversationState } from './types';
import { useRestaurant } from '../../concepts/restaurant/context/RestaurantContext';
import { getAssetById } from '../../concepts/restaurant/data/assets';
import { getLocationById } from '../../concepts/restaurant/data/locations';

interface ChatPanelContextType extends ChatPanelState {
  /** Set transitioning state for animations */
  setIsTransitioning: (value: boolean) => void;
  /** Get quick action by ID */
  getQuickAction: (id: string) => QuickAction | undefined;
  /** Execute a quick action (returns the prompt to fill) */
  executeQuickAction: (id: string) => string | undefined;
}

const ChatPanelContext = createContext<ChatPanelContextType | undefined>(undefined);

// Default quick actions for home view (cold-start)
const HOME_QUICK_ACTIONS: QuickAction[] = [
  { id: 'email-sysco', label: 'Draft Email to Sysco', icon: 'Mail' },
  { id: 'check-overtime', label: 'Check Overtime', icon: 'Clock' },
  { id: 'update-menu', label: 'Update Menu Price', icon: 'Utensils' },
  { id: 'review-schedule', label: 'Review Schedule', icon: 'Users' },
  { id: 'inventory-check', label: 'Inventory Check', icon: 'Package' },
];

// Quick actions for priorities nav (contextual-start)
const PRIORITIES_QUICK_ACTIONS: QuickAction[] = [
  { id: 'resolve-priority', label: 'Resolve top priority', icon: 'CheckCircle', prompt: 'Help me resolve the top priority' },
  { id: 'delegate-task', label: 'Delegate task', icon: 'Users', prompt: 'Help me delegate a task' },
  { id: 'schedule-followup', label: 'Schedule follow-up', icon: 'Clock', prompt: 'Schedule a follow-up for a priority' },
];

// Quick actions for locations nav (contextual-start)
const LOCATIONS_QUICK_ACTIONS: QuickAction[] = [
  { id: 'compare-locations', label: 'Compare locations', icon: 'TrendingUp', prompt: 'Compare performance across all locations' },
  { id: 'find-issues', label: 'Find issues', icon: 'AlertTriangle', prompt: 'Show me locations with issues' },
  { id: 'staffing-overview', label: 'Staffing overview', icon: 'Users', prompt: 'Give me a staffing overview across locations' },
];

// Quick actions for library nav (contextual-start)
const LIBRARY_QUICK_ACTIONS: QuickAction[] = [
  { id: 'find-report', label: 'Find a report', icon: 'FileText', prompt: 'Help me find a specific report' },
  { id: 'recent-changes', label: 'Recent changes', icon: 'Clock', prompt: 'What has changed recently in the library?' },
  { id: 'create-asset', label: 'Create new asset', icon: 'Plus', prompt: 'Help me create a new asset' },
];

export const ChatPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    selectedAssetId, 
    selectedLocationId, 
    activeNavId,
    isSecondaryPanelOpen,
    isCanvasOpen,
  } = useRestaurant();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousStateRef = useRef<ConversationState | null>(null);
  const previousModeRef = useRef<ChatPanelMode | null>(null);

  // Derive conversation state based on current selections
  const derivedState = useMemo((): Omit<ChatPanelState, 'isTransitioning' | 'previousState' | 'previousMode'> => {
    // CONTEXTUAL-START: An asset is selected and canvas is open
    if (selectedAssetId && isCanvasOpen) {
      const asset = getAssetById(selectedAssetId);
      return {
        conversationState: 'contextual-start',
        mode: 'contextual', // deprecated
        contextType: 'asset',
        contextId: selectedAssetId,
        contextLabel: asset?.name || null,
        quickActions: asset?.quickActions || [],
      };
    }

    // CONTEXTUAL-START: A location is selected
    if (selectedLocationId) {
      const location = getLocationById(selectedLocationId);
      return {
        conversationState: 'contextual-start',
        mode: 'contextual', // deprecated
        contextType: 'location',
        contextId: selectedLocationId,
        contextLabel: location?.name || null,
        quickActions: location?.quickActions || [],
      };
    }

    // CONTEXTUAL-START: Priorities nav selected (panel may or may not be open)
    if (activeNavId === 'priorities') {
      return {
        conversationState: 'contextual-start',
        mode: 'contextual', // deprecated
        contextType: 'nav-priorities',
        contextId: null,
        contextLabel: 'Priorities',
        quickActions: PRIORITIES_QUICK_ACTIONS,
      };
    }

    // CONTEXTUAL-START: Locations nav selected (no specific location)
    if (activeNavId === 'locations') {
      return {
        conversationState: 'contextual-start',
        mode: 'contextual', // deprecated
        contextType: 'nav-locations',
        contextId: null,
        contextLabel: 'Locations',
        quickActions: LOCATIONS_QUICK_ACTIONS,
      };
    }

    // CONTEXTUAL-START: Library nav selected (no specific asset)
    if (activeNavId === 'Library') {
      return {
        conversationState: 'contextual-start',
        mode: 'contextual', // deprecated
        contextType: 'nav-library',
        contextId: null,
        contextLabel: 'Library',
        quickActions: LIBRARY_QUICK_ACTIONS,
      };
    }

    // COLD-START: Home view (default)
    return {
      conversationState: 'cold-start',
      mode: 'home', // deprecated
      contextType: null,
      contextId: null,
      contextLabel: null,
      quickActions: HOME_QUICK_ACTIONS,
    };
  }, [selectedAssetId, selectedLocationId, activeNavId, isSecondaryPanelOpen, isCanvasOpen]);

  // Track state changes for animation coordination
  useEffect(() => {
    previousStateRef.current = derivedState.conversationState;
    previousModeRef.current = derivedState.mode;
  }, [derivedState.conversationState, derivedState.mode]);

  const getQuickAction = useCallback((id: string): QuickAction | undefined => {
    return derivedState.quickActions.find(action => action.id === id);
  }, [derivedState.quickActions]);

  const executeQuickAction = useCallback((id: string): string | undefined => {
    const action = getQuickAction(id);
    return action?.prompt || action?.label;
  }, [getQuickAction]);

  const contextValue: ChatPanelContextType = {
    ...derivedState,
    isTransitioning,
    previousState: previousStateRef.current,
    previousMode: previousModeRef.current,
    setIsTransitioning,
    getQuickAction,
    executeQuickAction,
  };

  return (
    <ChatPanelContext.Provider value={contextValue}>
      {children}
    </ChatPanelContext.Provider>
  );
};

export const useChatPanel = (): ChatPanelContextType => {
  const context = useContext(ChatPanelContext);
  if (!context) {
    // Return defaults if used outside provider (graceful degradation)
    return {
      conversationState: 'cold-start',
      mode: 'home',
      contextType: null,
      contextId: null,
      contextLabel: null,
      quickActions: HOME_QUICK_ACTIONS,
      isTransitioning: false,
      previousState: null,
      previousMode: null,
      setIsTransitioning: () => {},
      getQuickAction: () => undefined,
      executeQuickAction: () => undefined,
    };
  }
  return context;
};

export default ChatPanelContext;
