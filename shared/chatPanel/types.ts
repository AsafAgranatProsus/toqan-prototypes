/**
 * Chat Panel Types
 * 
 * Shared types for the chat panel system including
 * quick actions and panel mode management.
 */

import type { IconName } from '../../types';

/**
 * Quick action that can be displayed in the chat panel.
 * Used to provide contextual suggestions based on current view.
 */
export interface QuickAction {
  id: string;
  label: string;
  icon?: IconName;
  /** Pre-fill chat input with this text when clicked */
  prompt?: string;
  /** Optional variant for styling */
  variant?: 'primary' | 'secondary';
}

/**
 * Context type for deriving quick actions.
 * Determines what kind of content is currently selected.
 */
export type ContextType = 'asset' | 'location' | 'priority' | 'nav-priorities' | 'nav-locations' | 'nav-library' | null;

/**
 * Conversation state determines what content is displayed in the chat panel.
 * 
 * - 'cold-start': Home view with full content (greeting, quick actions, insights, action lists)
 * - 'contextual-start': Nav selected but no specific item - chat input + quick buttons, centered
 * - 'chatting': Active conversation - chat input only at bottom
 */
export type ConversationState = 'cold-start' | 'contextual-start' | 'chatting';

/**
 * @deprecated Use ConversationState instead
 */
export type ChatPanelMode = 'home' | 'contextual';

/**
 * Chat panel state for managing transitions and content.
 */
export interface ChatPanelState {
  /** Current conversation state */
  conversationState: ConversationState;
  /** @deprecated Use conversationState instead */
  mode: ChatPanelMode;
  /** Type of context currently active */
  contextType: ContextType;
  /** ID of the selected item (asset, location, etc.) */
  contextId: string | null;
  /** Human-readable label for the current context (e.g., asset name) */
  contextLabel: string | null;
  /** Quick actions available for current context */
  quickActions: QuickAction[];
  /** Whether a transition animation is in progress */
  isTransitioning: boolean;
  /** Previous conversation state for animation coordination */
  previousState: ConversationState | null;
  /** @deprecated Use previousState instead */
  previousMode: ChatPanelMode | null;
}
