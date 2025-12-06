import React from 'react';
import { Icons } from '../Icons/Icons';
import type { IconName } from '../../types';
import './GroupedButtons.css';

export interface GroupedButton {
  id: string;
  /** Icon name from Icons component */
  icon?: IconName;
  /** Text label */
  label?: string;
  /** Tooltip/title for accessibility */
  title: string;
  /** Custom aria-label (defaults to title if not provided) */
  ariaLabel?: string;
  /** Custom content (overrides icon and label) */
  content?: React.ReactNode;
}

export interface GroupedButtonsProps {
  /** Array of button definitions (2 or more) */
  buttons: GroupedButton[];
  /** ID of the currently active button */
  activeId: string;
  /** Callback when a button is clicked */
  onChange: (id: string) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className for the container */
  className?: string;
  /** ARIA role group label */
  ariaLabel?: string;
}

/**
 * GroupedButtons - Agnostic grouped button selector component
 * 
 * Supports multiple content types:
 * - Icon only: pass `icon` prop
 * - Text only: pass `label` prop
 * - Icon + Text: pass both `icon` and `label`
 * - Custom content: pass `content` prop
 * 
 * Inspired by the m3-contrast-selector pattern, now fully componentized.
 */
export const GroupedButtons: React.FC<GroupedButtonsProps> = ({
  buttons,
  activeId,
  onChange,
  size = 'md',
  className = '',
  ariaLabel,
}) => {
  // Calculate highlight position based on active button index
  const activeIndex = buttons.findIndex(btn => btn.id === activeId);
  const highlightPosition = activeIndex >= 0 ? activeIndex : 0;
  
  return (
    <div
      className={`grouped-buttons grouped-buttons--${size} ${className}`}
      role="group"
      aria-label={ariaLabel}
      style={{
        ['--button-count' as any]: buttons.length,
        ['--active-index' as any]: highlightPosition,
      }}
    >
      {/* Sliding highlight indicator */}
      <div className="grouped-buttons__highlight" />
      
      {/* Buttons */}
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          className={`grouped-buttons__option ${button.id === activeId ? 'active' : ''}`}
          onClick={() => onChange(button.id)}
          title={button.title}
          aria-label={button.ariaLabel || button.title}
          aria-pressed={button.id === activeId}
        >
          {/* Custom content takes precedence */}
          {button.content ? (
            button.content
          ) : (
            <>
              {/* Icon */}
              {button.icon && (
                <Icons 
                  name={button.icon} 
                  className="grouped-buttons__icon" 
                  aria-hidden={!!button.label}
                />
              )}
              
              {/* Label */}
              {button.label && (
                <span className="grouped-buttons__label">{button.label}</span>
              )}
            </>
          )}
        </button>
      ))}
    </div>
  );
};
