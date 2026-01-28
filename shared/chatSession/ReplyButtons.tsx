/**
 * Reply Buttons Component
 * 
 * Renders reply buttons for navigating chat flows.
 * Supports primary/secondary variants and optional icons.
 */

import React from 'react';
import type { ReplyButton as ReplyButtonType } from './types';
import { Icons } from '../../components/Icons/Icons';
import Button from '../../components/Button/Button';
import './ReplyButtons.css';

interface ReplyButtonsProps {
  /** Available reply buttons */
  buttons: ReplyButtonType[];
  
  /** Called when a button is clicked */
  onButtonClick: (button: ReplyButtonType) => void;
  
  /** Whether buttons are disabled (e.g., during loading) */
  disabled?: boolean;
}

export const ReplyButtons: React.FC<ReplyButtonsProps> = ({
  buttons,
  onButtonClick,
  disabled = false,
}) => {
  if (!buttons || buttons.length === 0) {
    return null;
  }
  
  return (
    <div className="reply-buttons">
      {buttons.map((button) => (
        <Button
          key={button.id}
          variant={button.variant === 'primary' ? 'outlined' : 'outlined'}
          size="md"
          shape="circle"
          onClick={() => onButtonClick(button)}
          disabled={disabled}
          icon={button.icon}
          className="reply-buttons__button"
        >
          <span className="reply-buttons__button-label">{button.label}</span>
        </Button>
      ))}
    </div>
  );
};

/**
 * Inline reply buttons that appear within the chat message.
 */
export const InlineReplyButtons: React.FC<ReplyButtonsProps> = ({
  buttons,
  onButtonClick,
  disabled = false,
}) => {
  if (!buttons || buttons.length === 0) {
    return null;
  }
  
  return (
    <div className="reply-buttons reply-buttons--inline">
      {buttons.map((button) => (
        <button
          key={button.id}
          className={`reply-buttons__chip ${
            button.variant === 'primary' ? 'reply-buttons__chip--primary' : ''
          }`}
          onClick={() => onButtonClick(button)}
          disabled={disabled}
        >
          {button.icon && <Icons name={button.icon} />}
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ReplyButtons;
