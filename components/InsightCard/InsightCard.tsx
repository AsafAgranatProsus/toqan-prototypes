import React from 'react';
import { Icons } from '../Icons/Icons';
import type { IconName } from '../../types';
import './InsightCard.css';

export interface InsightCardProps {
  /** The main value/metric to display */
  value: string;
  
  /** Label describing what the value represents */
  label: string;
  
  /** Icon representing the agent/source of the data */
  sourceIcon: IconName;
  
  /** Optional secondary text (trend, delta, etc.) */
  secondary?: string;
  
  /** Optional trend direction for styling */
  trend?: 'up' | 'down' | 'neutral';
  
  /** Click handler */
  onClick?: () => void;
  
  /** Additional class name */
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  value,
  label,
  sourceIcon,
  secondary,
  trend,
  onClick,
  className,
}) => {
  const isClickable = !!onClick;
  
  const cardClasses = [
    'insight-card',
    isClickable ? 'insight-card--clickable' : '',
    trend ? `insight-card--trend-${trend}` : '',
    className,
  ].filter(Boolean).join(' ');

  const Component = isClickable ? 'button' : 'div';
  
  return (
    <Component
      className={cardClasses}
      onClick={isClickable ? onClick : undefined}
      type={isClickable ? 'button' : undefined}
    >
      <div className="insight-card__source">
        <Icons name={sourceIcon} className="insight-card__source-icon" />
      </div>
      <div className="insight-card__content">
        <span className="insight-card__value">{value}</span>
        <span className="insight-card__label">{label}</span>
        {secondary && (
          <span className="insight-card__secondary">{secondary}</span>
        )}
      </div>
    </Component>
  );
};

export default InsightCard;
