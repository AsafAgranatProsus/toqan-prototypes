/**
 * Chat Panel Module
 * 
 * Exports for the chat panel system including context,
 * components, and animation hooks.
 */

export { ChatPanelProvider, useChatPanel } from './ChatPanelContext';
export { useHomeEntranceAnimation } from './useHomeEntranceAnimation';
export { useHomeExitAnimation } from './useHomeExitAnimation';
export { ContextualChatPanel } from './ContextualChatPanel';
export type { 
  QuickAction, 
  ContextType, 
  ChatPanelMode, 
  ChatPanelState,
  ConversationState,
} from './types';
