/**
 * Message Actions Component
 * 
 * Renders a row of action buttons after assistant messages.
 * Default actions: thumbs up, thumbs down, save, copy
 * Actions are customizable based on message content.
 */

import React, { useState, useCallback } from 'react';
import Button from '../../components/Button/Button';
import { CopyButton } from '../../components/CopyButton';
import type { IconName } from '../../types';
import './MessageActions.css';

export interface MessageAction {
  id: string;
  icon: IconName;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface MessageActionsProps {
  /** The message content (for copy/save operations) */
  content: string;
  
  /** Session ID for saved message tracking */
  sessionId?: string;
  
  /** Custom actions to override defaults */
  customActions?: MessageAction[];
  
  /** Callback when save is triggered */
  onSave?: (content: string) => void;
  
  /** Callback when thumb up is clicked */
  onThumbUp?: () => void;
  
  /** Callback when thumb down is clicked */
  onThumbDown?: () => void;
  
  /** Additional class name */
  className?: string;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  sessionId,
  customActions,
  onSave,
  onThumbUp,
  onThumbDown,
  className = '',
}) => {
  const [saved, setSaved] = useState(false);
  const [thumbState, setThumbState] = useState<'up' | 'down' | null>(null);

  // Save message to assets
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(content);
      setSaved(true);
    }
  }, [content, onSave]);

  // Handle thumb up
  const handleThumbUp = useCallback(() => {
    setThumbState(prev => prev === 'up' ? null : 'up');
    onThumbUp?.();
  }, [onThumbUp]);

  // Handle thumb down
  const handleThumbDown = useCallback(() => {
    setThumbState(prev => prev === 'down' ? null : 'down');
    onThumbDown?.();
  }, [onThumbDown]);

  // Default actions (excluding copy, which is handled separately)
  const defaultActions: MessageAction[] = [
    {
      id: 'thumbUp',
      icon: 'ThumbsUp',
      label: 'Helpful',
      onClick: handleThumbUp,
      isActive: thumbState === 'up',
    },
    {
      id: 'thumbDown',
      icon: 'ThumbsDown',
      label: 'Not helpful',
      onClick: handleThumbDown,
      isActive: thumbState === 'down',
    },
    {
      id: 'save',
      icon: 'Bookmark',
      label: saved ? 'Saved' : 'Save',
      onClick: handleSave,
      isActive: saved,
    },
  ];

  const actions = customActions || defaultActions;

  return (
    <div className={`message-actions ${className}`}>
      {actions.map((action) => (
        <Button
          key={action.id}
          noBorder
          transparent
          variant="icon"
          size="sm"
          shape="circle"
          icon={action.icon}
          onClick={action.onClick}
          title={action.label}
          aria-label={action.label}
          className={action.isActive ? 'message-actions__button--active' : ''}
        />
      ))}
      {/* CopyButton with animated feedback */}
      {!customActions && (
        <CopyButton 
          content={content} 
          size="sm"
        />
      )}
    </div>
  );
};

export default MessageActions;
