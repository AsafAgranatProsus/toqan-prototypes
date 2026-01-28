/**
 * Contextual Chat Panel Component
 * 
 * A minimal chat panel for contextual views. Layout varies by conversation state:
 * - contextual-start: Chat input + quick buttons, centered vertically
 * - chatting: Chat input only at bottom (no quick buttons shown here)
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ChatInput from '../../components/ChatInput/ChatInput';
import { Chip } from '../../components/Chip';
import { useChatPanel } from './ChatPanelContext';
import { useChatSessionOptional } from '../chatSession';
import type { ConversationState } from './types';
import './ContextualChatPanel.css';

interface ContextualChatPanelProps {
  /** Called when a message is sent */
  onSend?: (message: string) => void;
  /** Additional class name */
  className?: string;
  /** Whether to show quick action buttons (default: true for contextual-start) */
  showQuickActions?: boolean;
}

/**
 * Minimal chat panel for contextual views.
 * Shows chat input and optionally quick action buttons.
 * Centers content for contextual-start, bottom-aligns for chatting.
 */
export const ContextualChatPanel: React.FC<ContextualChatPanelProps> = ({
  onSend,
  className = '',
  showQuickActions = true,
}) => {
  const { quickActions, contextType, contextId, contextLabel, conversationState } = useChatPanel();
  const chatSession = useChatSessionOptional();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const prevContextRef = useRef({ contextType, contextId });
  const isFirstRenderRef = useRef(true);

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Determine if we should show quick actions
  const shouldShowQuickActions = showQuickActions && 
    conversationState === 'contextual-start' && 
    quickActions.length > 0;

  // Animate entrance/transition when context changes
  useEffect(() => {
    if (conversationState !== 'contextual-start' || prefersReducedMotion) {
      isFirstRenderRef.current = false;
      prevContextRef.current = { contextType, contextId };
      return;
    }

    const prevContext = prevContextRef.current;
    const isFirstRender = isFirstRenderRef.current;
    const contextChanged = prevContext.contextType !== contextType || prevContext.contextId !== contextId;
    
    // Update refs
    prevContextRef.current = { contextType, contextId };
    isFirstRenderRef.current = false;

    // Skip if nothing changed (except first render)
    if (!isFirstRender && !contextChanged) {
      return;
    }

    const actionsContainer = actionsRef.current;
    const inputWrapper = inputWrapperRef.current;

    // Determine what changed
    const sameContextType = prevContext.contextType === contextType;
    const onlyItemChanged = sameContextType && prevContext.contextId !== contextId && prevContext.contextId !== null;

    if (onlyItemChanged && actionsContainer) {
      // Switching between items of same type - animate out old, then in new
      const buttons = actionsContainer.querySelectorAll('.contextual-chat-panel__action');
      
      if (buttons.length > 0) {
        // Quick fade out, then animate in new buttons
        gsap.to(buttons, {
          opacity: 0,
          y: -8,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: () => {
            // After fade out, the React re-render will have new buttons
            // We need to re-query and animate them in
            requestAnimationFrame(() => {
              const newButtons = actionsContainer.querySelectorAll('.contextual-chat-panel__action');
              if (newButtons.length > 0) {
                gsap.fromTo(newButtons, 
                  { opacity: 0, y: 8 },
                  { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'expo.out' }
                );
              }
            });
          }
        });
      }
    } else {
      // Full entrance animation (first render or context type changed)
      const elementsToAnimate: Element[] = [];
      
      // Add input wrapper (only on full entrance, not item switch)
      if (inputWrapper && !onlyItemChanged) {
        elementsToAnimate.push(inputWrapper);
      }
      
      // Add quick action buttons
      if (actionsContainer && shouldShowQuickActions) {
        const buttons = actionsContainer.querySelectorAll('.contextual-chat-panel__action');
        buttons.forEach(btn => elementsToAnimate.push(btn));
      }

      if (elementsToAnimate.length === 0) return;

      // Set initial hidden state
      gsap.set(elementsToAnimate, { opacity: 0, y: 12 });

      // Staggered entrance with exponential ease
      gsap.to(elementsToAnimate, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'expo.out',
      });
    }
  }, [conversationState, shouldShowQuickActions, quickActions, contextType, contextId, prefersReducedMotion]);

  const handleQuickAction = (action: { id: string; label: string; prompt?: string }) => {
    const message = action.prompt || action.label;
    
    if (onSend) {
      onSend(message);
    } else if (chatSession?.handleUserInput) {
      chatSession.handleUserInput(message);
    }
  };

  const handleSend = (message: string) => {
    if (onSend) {
      onSend(message);
    } else if (chatSession?.handleUserInput) {
      chatSession.handleUserInput(message);
    }
  };

  // Get context label for placeholder
  const getPlaceholder = () => {
    // Use specific item name when available
    if (contextLabel) {
      switch (contextType) {
        case 'asset':
          return `Ask about ${contextLabel}...`;
        case 'location':
          return `Ask about ${contextLabel}...`;
        default:
          return `Ask about ${contextLabel}...`;
      }
    }
    
    // Fallback to generic placeholders
    switch (contextType) {
      case 'asset':
        return 'Ask about this asset...';
      case 'location':
        return 'Ask about this location...';
      case 'nav-priorities':
        return 'Ask about priorities...';
      case 'nav-locations':
        return 'Ask about your locations...';
      case 'nav-library':
        return 'Search or ask about your library...';
      default:
        return 'Type a message...';
    }
  };

  // Build class names based on conversation state
  const containerClasses = [
    'contextual-chat-panel',
    conversationState === 'contextual-start' ? 'contextual-chat-panel--centered' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
    >
      <div className="contextual-chat-panel__content">
        <div 
          ref={inputWrapperRef}
          className="contextual-chat-panel__input-wrapper"
        >
          <ChatInput
            onSend={handleSend}
            placeholder={getPlaceholder()}
          />
        </div>

        {shouldShowQuickActions && (
          <div 
            ref={actionsRef}
            className="contextual-chat-panel__actions"
          >
            {quickActions.map((action) => (
              <Chip
                key={action.id}
                weight="regular"
                color="secondary"
                variant="filled"
                hoverBg="subtle"
                icon={action.icon}
                onClick={() => handleQuickAction(action)}
                className="contextual-chat-panel__action"
              >
                {action.label}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextualChatPanel;
