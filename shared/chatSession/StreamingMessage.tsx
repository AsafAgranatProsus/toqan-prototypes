/**
 * Streaming Message Component
 * 
 * Simulates AI response streaming by revealing content word-by-word.
 * Includes thinking phase before content starts streaming.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThinkingIndicator } from './ThinkingIndicator';
import HtmlRenderer from '../../components/HtmlRenderer/HtmlRenderer';
import './StreamingMessage.css';

interface StreamingMessageProps {
  /** HTML content to stream */
  content: string;
  
  /** Flow ID for context-specific thinking messages */
  flowId?: string;
  
  /** Whether to simulate streaming (false = show immediately) */
  enableStreaming?: boolean;
  
  /** Callback when streaming completes */
  onComplete?: () => void;
  
  /** Words per second for streaming speed */
  wordsPerSecond?: number;
  
  /** Thinking duration in ms */
  thinkingDuration?: number;
}

type StreamState = 'thinking' | 'streaming' | 'complete';

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  flowId,
  enableStreaming = true,
  onComplete,
  wordsPerSecond = 25,
  thinkingDuration = 3500,
}) => {
  const [state, setState] = useState<StreamState>(enableStreaming ? 'thinking' : 'complete');
  const [visibleContent, setVisibleContent] = useState(enableStreaming ? '' : content);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Track if this component has ever been through streaming (for preserving thinking indicator)
  const hasBeenStreamedRef = useRef(enableStreaming);
  
  // Parse HTML content into streamable chunks
  const parseContentToChunks = useCallback((html: string): string[] => {
    // We'll stream by inserting content progressively
    // This is a simplified approach that works with most HTML
    const chunks: string[] = [];
    let currentChunk = '';
    let inTag = false;
    let wordBuffer = '';
    
    for (let i = 0; i < html.length; i++) {
      const char = html[i];
      
      if (char === '<') {
        // Starting a tag - flush word buffer and add to current chunk
        if (wordBuffer.trim()) {
          currentChunk += wordBuffer;
          chunks.push(currentChunk);
          currentChunk = '';
          wordBuffer = '';
        }
        inTag = true;
        currentChunk += char;
      } else if (char === '>') {
        inTag = false;
        currentChunk += char;
        // After closing tag, add chunk
        chunks.push(currentChunk);
        currentChunk = '';
      } else if (inTag) {
        currentChunk += char;
      } else {
        // Regular text
        wordBuffer += char;
        // Check for word boundaries
        if (char === ' ' || char === '\n') {
          if (wordBuffer.trim()) {
            currentChunk += wordBuffer;
            // Every 1-2 words, create a new chunk
            if (Math.random() > 0.5) {
              chunks.push(currentChunk);
              currentChunk = '';
            }
          }
          wordBuffer = '';
        }
      }
    }
    
    // Flush remaining
    if (wordBuffer) currentChunk += wordBuffer;
    if (currentChunk) chunks.push(currentChunk);
    
    return chunks;
  }, []);
  
  // Handle thinking phase completion
  const handleThinkingComplete = useCallback(() => {
    setState('streaming');
  }, []);
  
  // Stream content word by word
  useEffect(() => {
    if (state !== 'streaming') return;
    
    const chunks = parseContentToChunks(content);
    let currentIndex = 0;
    let accumulated = '';
    
    const intervalMs = 1000 / wordsPerSecond;
    
    streamIntervalRef.current = setInterval(() => {
      if (currentIndex < chunks.length) {
        accumulated += chunks[currentIndex];
        setVisibleContent(accumulated);
        currentIndex++;
        
        // Auto-scroll to bottom
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      } else {
        // Streaming complete
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }
        setState('complete');
        onComplete?.();
      }
    }, intervalMs);
    
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [state, content, wordsPerSecond, parseContentToChunks, onComplete]);
  
  // If streaming was never enabled for this message (loaded from history), just render content
  if (!enableStreaming && !hasBeenStreamedRef.current) {
    return (
      <div className="streaming-message streaming-message--complete">
        <div className="streaming-message__content prose">
          <HtmlRenderer html={content} />
        </div>
      </div>
    );
  }
  
  // Determine if thinking indicator should show (currently thinking or has completed thinking)
  const showThinking = state === 'thinking' || hasBeenStreamedRef.current;
  
  return (
    <div className={`streaming-message streaming-message--${state}`}>
      {/* Thinking indicator - stays visible throughout, transitions to completed state */}
      {showThinking && (
        <ThinkingIndicator
          isThinking={state === 'thinking'}
          contextId={flowId}
          duration={thinkingDuration}
          onComplete={handleThinkingComplete}
        />
      )}
      
      {/* Content - shown during streaming and after complete */}
      {(state === 'streaming' || state === 'complete') && (
        <div className="streaming-message__content prose" ref={contentRef}>
          <HtmlRenderer html={visibleContent || content} />
          {state === 'streaming' && (
            <span className="streaming-message__cursor" />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Hook to manage streaming state for a message
 */
export function useStreamingState(initialContent: string) {
  const [isComplete, setIsComplete] = useState(false);
  
  const handleComplete = useCallback(() => {
    setIsComplete(true);
  }, []);
  
  return {
    isComplete,
    handleComplete,
  };
}

export default StreamingMessage;
