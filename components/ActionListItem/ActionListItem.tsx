import React from 'react';
import { Icons } from '../Icons/Icons';
import type { IconName } from '../../types';
import './ActionListItem.css';

export interface ActionListItemProps {
  /** Primary text/title */
  title: string;
  
  /** Optional secondary text/description */
  description?: string;
  
  /** Icon to display */
  icon: IconName;
  
  /** Optional metadata (time, status, etc.) */
  meta?: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Additional class name */
  className?: string;
}

export const ActionListItem: React.FC<ActionListItemProps> = ({
  title,
  description,
  icon,
  meta,
  onClick,
  className,
}) => {
  const isClickable = !!onClick;
  
  const itemClasses = [
    'action-list-item',
    isClickable ? 'action-list-item--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  const Component = isClickable ? 'button' : 'div';
  
  return (
    <Component
      className={itemClasses}
      onClick={isClickable ? onClick : undefined}
      type={isClickable ? 'button' : undefined}
    >
      <div className="action-list-item__icon">
        <Icons name={icon} />
      </div>
      <div className="action-list-item__content">
        <span className="action-list-item__title">{title}</span>
        {description && (
          <span className="action-list-item__description">{description}</span>
        )}
      </div>
      {meta && (
        <span className="action-list-item__meta">{meta}</span>
      )}
      {isClickable && (
        <Icons name="ChevronRight" className="action-list-item__chevron" />
      )}
    </Component>
  );
};

export default ActionListItem;
