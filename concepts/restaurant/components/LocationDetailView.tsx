/**
 * Location Detail View Component
 * 
 * Full detail view for a single location.
 * Shows comprehensive information including metrics, staff, and activity.
 */

import React from 'react';
import { Icons } from '../../../components/Icons/Icons';
import Button from '../../../components/Button/Button';
import { LOCATIONS, CENTRAL_KITCHEN } from './LocationsGrid';
import type { LocationData } from './LocationCard';
import './LocationDetailView.css';

interface LocationDetailViewProps {
  locationId: string;
  onBack: () => void;
}

export const LocationDetailView: React.FC<LocationDetailViewProps> = ({
  locationId,
  onBack,
}) => {
  // Find the location
  const location: LocationData | undefined = 
    locationId === 'central-kitchen' 
      ? CENTRAL_KITCHEN 
      : LOCATIONS.find(loc => loc.id === locationId);

  if (!location) {
    return (
      <div className="location-detail location-detail--not-found">
        <Button
          variant="text"
          icon="ArrowLeft"
          onClick={onBack}
        >
          All Locations
        </Button>
        <p>Location not found</p>
      </div>
    );
  }

  const statusLabels = {
    active: 'Operational',
    warning: 'Needs Attention',
    critical: 'Critical Issues',
  };

  return (
    <div className="location-detail">
      {/* Back button */}
      <div className="location-detail__header">
        <Button
          variant="text"
          icon="ArrowLeft"
          onClick={onBack}
          className="location-detail__back-button"
        >
          All Locations
        </Button>
      </div>

      {/* Location header */}
      <div className="location-detail__hero">
        <div className="location-detail__icon">
          <Icons name={location.type === 'central-kitchen' ? 'ChefHat' : 'Store'} />
        </div>
        <div className="location-detail__info">
          <h1 className="location-detail__name">{location.name}</h1>
          <p className="location-detail__address">
            <Icons name="MapPin" />
            {location.address}, {location.city}
          </p>
        </div>
        <div className={`location-detail__status location-detail__status--${location.status}`}>
          <span className="location-detail__status-dot" />
          <span className="location-detail__status-label">{statusLabels[location.status]}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="location-detail__actions">
        <Button variant="outlined" icon="Phone" size="sm">Call</Button>
        <Button variant="outlined" icon="MessageSquare" size="sm">Message</Button>
        <Button variant="outlined" icon="Navigation" size="sm">Directions</Button>
      </div>

      {/* Metrics section */}
      <div className="location-detail__section">
        <h2 className="location-detail__section-title">Key Metrics</h2>
        <div className="location-detail__metrics">
          {location.metrics.map((metric) => (
            <div
              key={metric.id}
              className={`location-detail__metric location-detail__metric--${metric.type}`}
            >
              <div className="location-detail__metric-icon">
                {metric.icon && <Icons name={metric.icon} />}
              </div>
              <div className="location-detail__metric-content">
                <span className="location-detail__metric-value">{metric.value}</span>
                <span className="location-detail__metric-label">{metric.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff section */}
      <div className="location-detail__section">
        <h2 className="location-detail__section-title">Staff Today</h2>
        <div className="location-detail__staff">
          <div className="location-detail__staff-item">
            <Icons name="User" />
            <span>Manager: Sarah K.</span>
          </div>
          <div className="location-detail__staff-item">
            <Icons name="Users" />
            <span>Team: 6 on shift</span>
          </div>
          <div className="location-detail__staff-item">
            <Icons name="Clock" />
            <span>Next shift: 2:00 PM</span>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="location-detail__section">
        <h2 className="location-detail__section-title">Recent Activity</h2>
        <div className="location-detail__activity">
          <div className="location-detail__activity-item">
            <div className="location-detail__activity-icon">
              <Icons name="CheckCircle" />
            </div>
            <div className="location-detail__activity-content">
              <span className="location-detail__activity-title">Inventory check completed</span>
              <span className="location-detail__activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="location-detail__activity-item">
            <div className="location-detail__activity-icon">
              <Icons name="Truck" />
            </div>
            <div className="location-detail__activity-content">
              <span className="location-detail__activity-title">Delivery received from Sysco</span>
              <span className="location-detail__activity-time">4 hours ago</span>
            </div>
          </div>
          <div className="location-detail__activity-item">
            <div className="location-detail__activity-icon">
              <Icons name="Star" />
            </div>
            <div className="location-detail__activity-content">
              <span className="location-detail__activity-title">New 5-star review</span>
              <span className="location-detail__activity-time">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailView;
