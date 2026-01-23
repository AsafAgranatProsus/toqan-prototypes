/**
 * Chat Session Context
 * 
 * Central state management for chat sessions.
 * Handles session lifecycle, navigation, and persistence.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type {
  ChatSession,
  ChatFlow,
  ChatFlowNode,
  ChatTrigger,
  ChatHistoryEntry,
  SessionStorage,
  ChatSessionContextValue,
} from './types';
import { FlowRegistry } from './FlowRegistry';
import { matchReplyButton } from './InputMatcher';
import { generateFallbackNode } from './FallbackHandler';

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'toqan-chat-sessions';
const MAX_SESSIONS = 20;

// ============================================
// Helpers
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function loadFromStorage(): SessionStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load chat sessions from storage:', error);
  }
  return { sessions: [], activeSessionId: null };
}

function saveToStorage(storage: SessionStorage): void {
  try {
    // Limit stored sessions
    const limitedSessions = storage.sessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...storage,
      sessions: limitedSessions,
    }));
  } catch (error) {
    console.error('Failed to save chat sessions to storage:', error);
  }
}

// ============================================
// Context
// ============================================

const ChatSessionContext = createContext<ChatSessionContextValue | undefined>(undefined);

// ============================================
// Provider
// ============================================

interface ChatSessionProviderProps {
  children: React.ReactNode;
  /** Current context for fallback generation */
  fallbackContext?: Record<string, unknown>;
}

export const ChatSessionProvider: React.FC<ChatSessionProviderProps> = ({
  children,
  fallbackContext = {},
}) => {
  // Load initial state from storage
  const [storage, setStorage] = useState<SessionStorage>(loadFromStorage);
  
  // Persist to storage on changes
  useEffect(() => {
    saveToStorage(storage);
  }, [storage]);
  
  // Get active session
  const activeSession = useMemo(() => {
    if (!storage.activeSessionId) return null;
    return storage.sessions.find(s => s.id === storage.activeSessionId) ?? null;
  }, [storage.activeSessionId, storage.sessions]);
  
  // Get current flow and node
  const currentFlow = useMemo(() => {
    if (!activeSession?.flowId) return null;
    return FlowRegistry.getFlow(activeSession.flowId);
  }, [activeSession?.flowId]);
  
  const currentNode = useMemo(() => {
    if (!currentFlow || !activeSession?.currentNodeId) return null;
    return currentFlow.nodes[activeSession.currentNodeId] ?? null;
  }, [currentFlow, activeSession?.currentNodeId]);
  
  // ============================================
  // Actions
  // ============================================
  
  /**
   * Update a session and persist.
   */
  const updateSession = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
    setStorage(prev => ({
      ...prev,
      sessions: prev.sessions.map(s =>
        s.id === sessionId
          ? { ...s, ...updates, updatedAt: Date.now() }
          : s
      ),
    }));
  }, []);
  
  /**
   * Start a new session with a trigger.
   */
  const startSession = useCallback((trigger: ChatTrigger) => {
    const now = Date.now();
    
    // Determine which flow to use
    let flow: ChatFlow | null = null;
    let initialNode: ChatFlowNode | null = null;
    
    if (trigger.flowId) {
      // Explicit flow ID provided
      flow = FlowRegistry.getFlow(trigger.flowId);
      if (flow) {
        initialNode = flow.nodes[flow.initialNodeId] ?? null;
      }
    } else if (trigger.userMessage) {
      // Try to match user message to a flow
      flow = FlowRegistry.matchFlow(trigger.userMessage);
      if (flow) {
        initialNode = flow.nodes[flow.initialNodeId] ?? null;
      }
    }
    
    // If no flow matched, use fallback
    if (!initialNode) {
      initialNode = generateFallbackNode(
        trigger.userMessage ?? '',
        { ...fallbackContext, ...trigger.context }
      );
    }
    
    // Build initial history
    const history: ChatHistoryEntry[] = [];
    
    // Add user message if provided
    if (trigger.userMessage) {
      history.push({
        id: generateId(),
        type: 'user',
        content: trigger.userMessage,
        timestamp: now,
      });
    }
    
    // Add initial assistant response
    history.push({
      id: generateId(),
      type: 'assistant',
      content: initialNode.content,
      nodeId: initialNode.id,
      timestamp: now + 1,
    });
    
    // Create the session
    const session: ChatSession = {
      id: generateId(),
      flowId: flow?.id ?? null,
      currentNodeId: initialNode.id,
      history,
      triggerType: trigger.type,
      triggerContext: trigger.context,
      createdAt: now,
      updatedAt: now,
    };
    
    // Add to storage and set as active
    setStorage(prev => ({
      sessions: [session, ...prev.sessions].slice(0, MAX_SESSIONS),
      activeSessionId: session.id,
    }));
  }, [fallbackContext]);
  
  /**
   * Navigate to a specific node in the current flow.
   */
  const navigateToNode = useCallback((nodeId: string, userMessage?: string) => {
    if (!activeSession || !currentFlow) return;
    
    const targetNode = currentFlow.nodes[nodeId];
    if (!targetNode) {
      console.warn(`Node ${nodeId} not found in flow ${currentFlow.id}`);
      return;
    }
    
    const now = Date.now();
    const newHistory = [...activeSession.history];
    
    // Add user message if provided
    if (userMessage) {
      newHistory.push({
        id: generateId(),
        type: 'user',
        content: userMessage,
        selectedButton: userMessage,
        timestamp: now,
      });
    }
    
    // Add assistant response
    newHistory.push({
      id: generateId(),
      type: 'assistant',
      content: targetNode.content,
      nodeId: targetNode.id,
      timestamp: now + 1,
    });
    
    updateSession(activeSession.id, {
      currentNodeId: nodeId,
      history: newHistory,
    });
  }, [activeSession, currentFlow, updateSession]);
  
  /**
   * Handle user input - check buttons first, then trigger resolution.
   */
  const handleUserInput = useCallback((input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    // If there's an active session with reply buttons, try to match
    if (activeSession && currentNode?.replyButtons?.length) {
      const matchResult = matchReplyButton(trimmedInput, currentNode.replyButtons);
      
      if (matchResult.matched && matchResult.button) {
        // User typed something that matches a button
        if (matchResult.button.nextNodeId) {
          navigateToNode(matchResult.button.nextNodeId, trimmedInput);
        } else {
          // End of flow - could show summary or end session
          endSession();
        }
        return;
      }
    }
    
    // No match in current context - treat as new trigger
    startSession({
      type: 'freeText',
      userMessage: trimmedInput,
    });
  }, [activeSession, currentNode, navigateToNode, startSession]);
  
  /**
   * Resume a previous session.
   */
  const resumeSession = useCallback((sessionId: string) => {
    const session = storage.sessions.find(s => s.id === sessionId);
    if (!session) {
      console.warn(`Session ${sessionId} not found`);
      return;
    }
    
    setStorage(prev => ({
      ...prev,
      activeSessionId: sessionId,
    }));
  }, [storage.sessions]);
  
  /**
   * End the current session.
   */
  const endSession = useCallback(() => {
    setStorage(prev => ({
      ...prev,
      activeSessionId: null,
    }));
  }, []);
  
  /**
   * Clear all sessions.
   */
  const clearAllSessions = useCallback(() => {
    setStorage({ sessions: [], activeSessionId: null });
  }, []);
  
  // ============================================
  // Context Value
  // ============================================
  
  const value: ChatSessionContextValue = useMemo(() => ({
    // State
    activeSession,
    sessions: storage.sessions,
    currentFlow,
    currentNode,
    isSessionActive: activeSession !== null,
    
    // Actions
    startSession,
    navigateToNode,
    handleUserInput,
    resumeSession,
    endSession,
    clearAllSessions,
  }), [
    activeSession,
    storage.sessions,
    currentFlow,
    currentNode,
    startSession,
    navigateToNode,
    handleUserInput,
    resumeSession,
    endSession,
    clearAllSessions,
  ]);
  
  return (
    <ChatSessionContext.Provider value={value}>
      {children}
    </ChatSessionContext.Provider>
  );
};

// ============================================
// Hook
// ============================================

export function useChatSession(): ChatSessionContextValue {
  const context = useContext(ChatSessionContext);
  if (!context) {
    throw new Error('useChatSession must be used within a ChatSessionProvider');
  }
  return context;
}

// Optional: hook that doesn't throw if used outside provider
export function useChatSessionOptional(): ChatSessionContextValue | null {
  return useContext(ChatSessionContext) ?? null;
}
