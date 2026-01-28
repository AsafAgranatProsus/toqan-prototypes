/**
 * Chat Session Types
 * 
 * Core type definitions for the chat session system.
 * This module is concept-agnostic - specific flows are defined in concepts.
 */

import type { IconName } from '../../types';

// ============================================
// Session Types
// ============================================

/**
 * A chat session represents a single conversation instance.
 * Sessions can be started, navigated, paused, and resumed.
 */
export interface ChatSession {
  /** Unique session identifier */
  id: string;
  
  /** Active flow ID (null = free-text mode / fallback) */
  flowId: string | null;
  
  /** Current position in the flow's node graph */
  currentNodeId: string | null;
  
  /** Full conversation history */
  history: ChatHistoryEntry[];
  
  /** How this session was started */
  triggerType: TriggerType;
  
  /** Context data from the trigger (e.g., priority ticket data) */
  triggerContext?: Record<string, unknown>;
  
  /** Session creation timestamp */
  createdAt: number;
  
  /** Last update timestamp */
  updatedAt: number;
  
  /** 
   * Whether this session has been persisted to history.
   * Sessions are only persisted when user contributes input.
   */
  isPersisted: boolean;
  
  /**
   * Optional title for display in recent chats.
   * Auto-generated from first user message or flow name.
   */
  title?: string;
  
  /**
   * Whether this session is pinned to the top of history.
   */
  pinned?: boolean;
}

/**
 * A single entry in the conversation history.
 */
export interface ChatHistoryEntry {
  /** Unique entry identifier */
  id: string;
  
  /** Whether this is a user message or assistant response */
  type: 'user' | 'assistant';
  
  /** Content: plain text for user, HTML for assistant */
  content: string;
  
  /** The flow node ID that generated this entry (for assistant messages) */
  nodeId?: string;
  
  /** The button label that was clicked/typed (for user messages) */
  selectedButton?: string;
  
  /** Entry timestamp */
  timestamp: number;
}

// ============================================
// Flow Types
// ============================================

/**
 * A chat flow defines a conversation tree with predefined responses.
 * Flows are registered by concepts and resolved by the engine.
 */
export interface ChatFlow {
  /** Unique flow identifier (e.g., 'priority-low-cash-flow') */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Optional description for debugging/documentation */
  description?: string;
  
  /** Category for organization and lazy loading */
  category?: string;
  
  /** The node to start at when this flow begins */
  initialNodeId: string;
  
  /** All nodes in this flow, keyed by node ID */
  nodes: Record<string, ChatFlowNode>;
  
  /** Keywords/patterns for matching free text to this flow */
  matchPatterns?: string[];
}

/**
 * A single node in a chat flow.
 * Each node represents one assistant response with optional reply buttons.
 */
export interface ChatFlowNode {
  /** Unique node identifier within the flow */
  id: string;
  
  /** HTML content for the assistant response */
  content: string;
  
  /** Reply buttons for user to navigate (0-4 recommended) */
  replyButtons?: ReplyButton[];
  
  /** Optional metadata for debugging or special handling */
  metadata?: Record<string, unknown>;
}

/**
 * A reply button that navigates to another node.
 */
export interface ReplyButton {
  /** Unique button identifier */
  id: string;
  
  /** Display label for the button */
  label: string;
  
  /** Node to navigate to when clicked (null = end flow) */
  nextNodeId: string | null;
  
  /** Visual variant */
  variant?: 'primary' | 'secondary';
  
  /** Optional icon */
  icon?: IconName;
  
  /** Keywords for fuzzy matching typed input */
  matchKeywords?: string[];
}

// ============================================
// Trigger Types
// ============================================

/**
 * How a chat session can be started.
 */
export type TriggerType =
  | 'freeText'        // User typed in chat input
  | 'quickAction'     // Clicked a starter chip/button
  | 'contextItem'     // Clicked item in a context list (priority, asset, etc.)
  | 'selection'       // Selected content and clicked "tell me more"
  | 'resume'          // Resumed from history
  | 'notification';   // Push notification

/**
 * A trigger represents the intent to start or continue a chat session.
 */
export interface ChatTrigger {
  /** How the trigger was initiated */
  type: TriggerType;
  
  /** Explicit flow to start (optional - triggers resolution if not provided) */
  flowId?: string;
  
  /** User's input text (for freeText triggers) */
  userMessage?: string;
  
  /** Session ID to resume (for resume triggers) */
  sessionId?: string;
  
  /** Additional context data passed to the session */
  context?: Record<string, unknown>;
}

// ============================================
// Registry & Storage Types
// ============================================

/**
 * Storage structure for persisting sessions to localStorage.
 */
export interface SessionStorage {
  /** All stored sessions */
  sessions: ChatSession[];
  
  /** Currently active session ID */
  activeSessionId: string | null;
}

/**
 * Result from the InputMatcher when matching typed text to buttons.
 */
export interface InputMatchResult {
  /** Whether a match was found */
  matched: boolean;
  
  /** The matched button (if any) */
  button?: ReplyButton;
  
  /** Match confidence level */
  confidence: 'exact' | 'fuzzy' | 'none';
}

/**
 * Context information for generating fallback responses.
 */
export interface FallbackContext {
  /** Active concept ID (e.g., 'restaurant') */
  conceptId?: string;
  
  /** What the user is currently viewing */
  activeView?: string;
  
  /** Selected asset ID (if viewing an asset) */
  selectedAssetId?: string;
  
  /** Any other relevant context */
  [key: string]: unknown;
}

// ============================================
// Action Types (for context)
// ============================================

/**
 * Actions available on the ChatSessionContext.
 */
export interface ChatSessionActions {
  /** Start a new session with a trigger */
  startSession: (trigger: ChatTrigger) => void;
  
  /** Navigate to a specific node in the current flow */
  navigateToNode: (nodeId: string, userMessage?: string) => void;
  
  /** Handle user input (checks buttons first, then triggers resolution) */
  handleUserInput: (input: string) => void;
  
  /** Resume a previous session */
  resumeSession: (sessionId: string) => void;
  
  /** End the current session */
  endSession: () => void;
  
  /** Start a new chat (clears active session, shows cold-start) */
  startNewChat: () => void;
  
  /** Clear all sessions */
  clearAllSessions: () => void;
  
  /** Delete a specific session */
  deleteSession: (sessionId: string) => void;
  
  /** Pin a session to the top of history */
  pinSession: (sessionId: string) => void;
  
  /** Unpin a session */
  unpinSession: (sessionId: string) => void;
  
  /** Rename a session */
  renameSession: (sessionId: string, newTitle: string) => void;
}

/**
 * Full ChatSession context value.
 */
export interface ChatSessionContextValue extends ChatSessionActions {
  /** Current active session (null if no session) */
  activeSession: ChatSession | null;
  
  /** All stored sessions for history */
  sessions: ChatSession[];
  
  /** Only sessions that have been persisted (user contributed) */
  persistedSessions: ChatSession[];
  
  /** Pinned sessions (sorted by pinned time) */
  pinnedSessions: ChatSession[];
  
  /** Current flow (if activeSession has a flowId) */
  currentFlow: ChatFlow | null;
  
  /** Current node in the flow */
  currentNode: ChatFlowNode | null;
  
  /** Whether a session is active */
  isSessionActive: boolean;
}
