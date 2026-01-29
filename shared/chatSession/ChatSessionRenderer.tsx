/**
 * Chat Session Renderer
 * 
 * Renders the active chat session including:
 * - Conversation history with streaming simulation
 * - Thinking indicators before AI responses
 * - Message action buttons (thumbs, save, copy)
 * - Reply buttons (revealed after streaming completes)
 * 
 * Note: Input is handled externally via the shared ChatInput component.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useChatSession } from './ChatSessionContext';
import { ReplyButtons } from './ReplyButtons';
import { StreamingMessage } from './StreamingMessage';
import { MessageActions } from './MessageActions';
import type { ReplyButton, ChatHistoryEntry } from './types';
import HtmlRenderer from '../../components/HtmlRenderer/HtmlRenderer';
import './ChatSessionRenderer.css';

interface ChatSessionRendererProps {
  /** Optional header content */
  header?: React.ReactNode;

  /** Optional class name */
  className?: string;

  /** Enable streaming simulation (default: true) */
  enableStreaming?: boolean;
  
  /** Callback when a message is saved */
  onSaveMessage?: (content: string) => void;
}

export const ChatSessionRenderer: React.FC<ChatSessionRendererProps> = ({
  header,
  className = '',
  enableStreaming = true,
  onSaveMessage,
}) => {
  const {
    activeSession,
    currentFlow,
    currentNode,
    navigateToNode,
    endSession,
    handleUserInput,
  } = useChatSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track which messages have completed streaming
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set());

  // Track the ID of the latest message for streaming
  const [latestMessageId, setLatestMessageId] = useState<string | null>(null);

  // Update latest message ID when history changes
  useEffect(() => {
    if (activeSession?.history.length) {
      const lastEntry = activeSession.history[activeSession.history.length - 1];
      if (lastEntry.type === 'assistant' && lastEntry.id !== latestMessageId) {
        setLatestMessageId(lastEntry.id);
      }
    }
  }, [activeSession?.history, latestMessageId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.history.length, completedMessages]);

  // Handle streaming completion for a message
  const handleStreamingComplete = useCallback((messageId: string) => {
    setCompletedMessages(prev => new Set([...prev, messageId]));
  }, []);

  // Handle reply button click
  const handleButtonClick = (button: ReplyButton) => {
    if (button.nextNodeId) {
      navigateToNode(button.nextNodeId, button.label);
    } else if (button.matchKeywords?.length) {
      // Button has keywords but no specific node - start a new flow with the label
      // This allows fallback buttons to trigger actual flows
      handleUserInput(button.label);
    } else {
      // End of flow (no next node, no keywords)
      endSession();
    }
  };

  // Check if a message should stream (only the latest assistant message)
  const shouldStream = (entry: ChatHistoryEntry, index: number): boolean => {
    if (!enableStreaming) return false;
    if (entry.type !== 'assistant') return false;
    if (completedMessages.has(entry.id)) return false;
    // Only stream the latest message
    return entry.id === latestMessageId;
  };

  // Check if buttons should be shown for a message
  const shouldShowButtons = (entry: ChatHistoryEntry, index: number): boolean => {
    const isLast = index === (activeSession?.history.length ?? 0) - 1;
    if (!isLast) return false;
    if (entry.type !== 'assistant') return false;
    if (!currentNode?.replyButtons?.length) return false;
    // Only show buttons after streaming is complete
    if (enableStreaming && !completedMessages.has(entry.id)) return false;
    return true;
  };

  if (!activeSession) {
    return null;
  }

  return (
    <div className={`chat-session-renderer ${className}`}>
      {header && (
        <div className="chat-session-renderer__header">
          {header}
        </div>
      )}
      <div className="chat-session-renderer__content">
        <div className="chat-session-renderer__messages">
          {activeSession.history.map((entry, index) => {
            const isStreaming = shouldStream(entry, index);
            const showButtons = shouldShowButtons(entry, index);

            return (
              <div
                key={entry.id}
                className={`chat-session-renderer__message chat-session-renderer__message--${entry.type}`}
              >
                {entry.type === 'user' ? (
                  <div className="chat-session-renderer__user-message">
                    {entry.content}
                  </div>
                ) : (
                  <div className="chat-session-renderer__assistant-message">
                    {/* Keep StreamingMessage mounted for messages that were streamed this session */}
                    {isStreaming || completedMessages.has(entry.id) ? (
                      <StreamingMessage
                        content={entry.content}
                        flowId={currentFlow?.id}
                        enableStreaming={isStreaming}
                        onComplete={() => handleStreamingComplete(entry.id)}
                        wordsPerSecond={30}
                        thinkingDuration={3500}
                      />
                    ) : (
                      /* Messages loaded from history (never streamed) */
                      <div className="chat-session-renderer__content prose">
                        <HtmlRenderer html={entry.content} />
                      </div>
                    )}

                    {/* Message actions - show when not actively streaming */}
                    {!isStreaming && (
                      <MessageActions
                        content={entry.content}
                        sessionId={activeSession?.id}
                        onSave={onSaveMessage}
                      />
                    )}

                    {showButtons && currentNode?.replyButtons && (
                      <ReplyButtons
                        buttons={currentNode.replyButtons}
                        onButtonClick={handleButtonClick}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

/**
 * Compact version for embedding in panels.
 */
export const CompactChatRenderer: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <ChatSessionRenderer
      showInput={false}
      className={`chat-session-renderer--compact ${className}`}
    />
  );
};

export default ChatSessionRenderer;
