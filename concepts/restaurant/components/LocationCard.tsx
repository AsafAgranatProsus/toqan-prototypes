/**
 * Location Card Component
 * 
 * Displays a single restaurant location with key metrics.
 * Used in the LocationsGrid component.
 */

import React from 'react';
import { Icons } from '../../../components/Icons/Icons';
import type { LocationData } from '../data/locations';
import './LocationCard.css';

// Re-export types for backward compatibility
export type { LocationData, LocationMetric } from '../data/locations';

interface LocationCardProps {
  location: LocationData;
  onClick?: (locationId: string) => void;
  isCompact?: boolean;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onClick,
  isCompact = false,
}) => {
  const handleClick = () => {
    onClick?.(location.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const cardClasses = [
    'location-card',
    `location-card--${location.status}`,
    `location-card--${location.type}`,
    isCompact ? 'location-card--compact' : '',
    onClick ? 'location-card--clickable' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="location-card__header">
        <div className="location-card__icon">
          <Icons name={location.type === 'central-kitchen' ? 'ChefHat' : 'Store'} />
        </div>
        <div className="location-card__info">
          <h3 className="location-card__name">{location.name}</h3>
          <p className="location-card__address">{location.address}</p>
        </div>
        <div className={`location-card__status location-card__status--${location.status}`}>
          <span className="location-card__status-dot" />
        </div>
      </div>

      {location.metrics.length > 0 && (
        <div className="location-card__metrics">
          {location.metrics.map((metric) => (
            <div
              key={metric.id}
              className={`location-card__metric location-card__metric--${metric.type}`}
            >
              {metric.icon && <Icons name={metric.icon} />}
              <span className="location-card__metric-value">{metric.value}</span>
              <span className="location-card__metric-label">{metric.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationCard;
