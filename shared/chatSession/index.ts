/**
 * Chat Session Module
 * 
 * Public exports for the chat session system.
 */

// Types
export type {
  ChatSession,
  ChatHistoryEntry,
  ChatFlow,
  ChatFlowNode,
  ReplyButton,
  TriggerType,
  ChatTrigger,
  SessionStorage,
  InputMatchResult,
  FallbackContext,
  ChatSessionActions,
  ChatSessionContextValue,
} from './types';

// Context & Provider
export {
  ChatSessionProvider,
  useChatSession,
  useChatSessionOptional,
} from './ChatSessionContext';

// Registry
export { FlowRegistry } from './FlowRegistry';

// Matchers & Handlers
export {
  matchReplyButton,
  isAskingForMore,
  isGoingBack,
} from './InputMatcher';

export {
  generateFallbackNode,
  createMinimalFallback,
} from './FallbackHandler';

// Components
export { ReplyButtons, InlineReplyButtons } from './ReplyButtons';
export { ChatSessionRenderer, CompactChatRenderer } from './ChatSessionRenderer';
export { StreamingMessage, useStreamingState } from './StreamingMessage';
export { ThinkingIndicator, CompletedThinkingIndicator } from './ThinkingIndicator';
export { MessageActions } from './MessageActions';
export type { MessageAction } from './MessageActions';
