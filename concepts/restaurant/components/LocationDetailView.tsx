/**
 * Location Detail View Component
 * 
 * AI-driven dashboard view for a single location.
 * Two layouts: Restaurant (hospitality) and Central Kitchen (manufacturing/logistics).
 * Shows contextual metrics with comparisons, insights, and activity logs.
 */

import React from 'react';
import { Icons } from '../../../components/Icons/Icons';
import Button from '../../../components/Button/Button';
import { getLocationById } from '../data/locations';
import type { LocationData, DetailMetric, ActivityLogEntry } from '../data/locations';
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
  const location: LocationData | undefined = getLocationById(locationId);

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

  const isCentralKitchen = location.type === 'central-kitchen';

  return (
    <div className="location-detail">
      {/* Back button */}
      <div className="location-detail__nav">
        <Button
          variant="text"
          icon="ArrowLeft"
          onClick={onBack}
          className="location-detail__back-button"
        >
          All Locations
        </Button>
      </div>

      {/* Header: Name + Vibe + Quick Actions */}
      <header className="location-detail__header">
        <div className="location-detail__header-main">
          <h1 className="location-detail__title">
            {location.name}
            {location.vibe && (
              <span className={`location-detail__vibe location-detail__vibe--${location.vibe.type}`}>
                {location.vibe.label}
              </span>
            )}
          </h1>
          <div className="location-detail__quick-links">
            {isCentralKitchen ? (
              <>
                <button className="location-detail__quick-link">Call</button>
                <span className="location-detail__quick-link-sep">|</span>
                <button className="location-detail__quick-link">Message</button>
                <span className="location-detail__quick-link-sep">|</span>
                <button className="location-detail__quick-link">Logistics</button>
              </>
            ) : (
              <>
                <button className="location-detail__quick-link">Call</button>
                <span className="location-detail__quick-link-sep">|</span>
                <button className="location-detail__quick-link">Message</button>
                <span className="location-detail__quick-link-sep">|</span>
                <button className="location-detail__quick-link">Map</button>
              </>
            )}
          </div>
        </div>
        <p className="location-detail__subtitle">
          {location.address}
          {isCentralKitchen && location.centralKitchenDetails && (
            <> &bull; Hub ID: {location.centralKitchenDetails.hubId}</>
          )}
          {!isCentralKitchen && location.openHours && (
            <> &bull; {location.openHours}</>
          )}
        </p>
      </header>

      {/* Key Metrics Grid */}
      {location.detailMetrics && location.detailMetrics.length > 0 && (
        <section className="location-detail__metrics-grid">
          {location.detailMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </section>
      )}

      {/* Staffing & Efficiency Section */}
      {isCentralKitchen && location.centralKitchenDetails ? (
        <section className="location-detail__operations">
          <div className="location-detail__ops-row">
            <div className="location-detail__ops-col">
              <h3 className="location-detail__ops-label">SHIFT & RESOURCES</h3>
              <div className="location-detail__ops-items">
                <div className="location-detail__ops-item">
                  <span className="location-detail__ops-item-label">Production Line:</span>
                  <span className="location-detail__ops-item-value location-detail__ops-item-value--positive">
                    {location.centralKitchenDetails.shiftResources.line}
                  </span>
                </div>
                <div className="location-detail__ops-item">
                  <span className="location-detail__ops-item-label">Logistics:</span>
                  <span className="location-detail__ops-item-value location-detail__ops-item-value--positive">
                    {location.centralKitchenDetails.shiftResources.logistics}
                  </span>
                </div>
              </div>
            </div>
            <div className="location-detail__ops-col">
              <h3 className="location-detail__ops-label">KITCHEN MANAGER</h3>
              <div className="location-detail__manager">
                <span className="location-detail__manager-name">
                  {location.centralKitchenDetails.kitchenManager.name}
                </span>
                <span className="location-detail__manager-next">
                  Next Shift: {location.centralKitchenDetails.kitchenManager.nextShift}
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : location.staffing ? (
        <section className="location-detail__operations">
          <div className="location-detail__ops-row">
            <div className="location-detail__ops-col">
              <h3 className="location-detail__ops-label">STAFFING & EFFICIENCY</h3>
              <div className="location-detail__efficiency">
                <div className="location-detail__efficiency-bar">
                  <div 
                    className="location-detail__efficiency-fill"
                    style={{ width: `${location.staffing.efficiencyPercent}%` }}
                  />
                </div>
                <span className="location-detail__efficiency-text">
                  {location.staffing.efficiency}
                </span>
              </div>
            </div>
            <div className="location-detail__ops-col">
              <h3 className="location-detail__ops-label">MANAGER ON DUTY</h3>
              <div className="location-detail__manager">
                <span className="location-detail__manager-name">
                  {location.staffing.manager.name}
                </span>
                {location.staffing.manager.nextShift && (
                  <span className="location-detail__manager-next">
                    Next Shift: {location.staffing.manager.nextShift}
                  </span>
                )}
              </div>
            </div>
          </div>
          {location.staffing.insight && (
            <div className={`location-detail__insight location-detail__insight--${location.staffing.insightType || 'info'}`}>
              <Icons name="AlertTriangle" />
              <span>{location.staffing.insight}</span>
            </div>
          )}
        </section>
      ) : null}

      {/* Intelligent Activity Log */}
      {location.activityLog && location.activityLog.length > 0 && (
        <section className="location-detail__log">
          <h3 className="location-detail__log-title">
            {isCentralKitchen ? 'SUPPLY CHAIN LOG' : 'INTELLIGENT LOG'}
          </h3>
          <div className="location-detail__log-entries">
            {location.activityLog.map((entry) => (
              <LogEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

/**
 * Metric Card Component
 * Displays a single metric with value, comparison, and insight.
 */
const MetricCard: React.FC<{ metric: DetailMetric }> = ({ metric }) => {
  return (
    <div className="metric-card">
      <h4 className="metric-card__label">{metric.label}</h4>
      <div className="metric-card__value-row">
        <span className={`metric-card__value metric-card__value--${metric.comparisonType || 'neutral'}`}>
          {metric.value}
        </span>
        {metric.icon && (
          <span className="metric-card__icon">
            <Icons name={metric.icon} />
          </span>
        )}
      </div>
      {metric.comparison && (
        <p className={`metric-card__comparison metric-card__comparison--${metric.comparisonType || 'neutral'}`}>
          {metric.comparison}
        </p>
      )}
      {metric.insight && (
        <p className={`metric-card__insight metric-card__insight--${metric.insightType || 'info'}`}>
          {metric.insight}
        </p>
      )}
    </div>
  );
};

/**
 * Log Entry Component
 * Displays a timestamped activity log entry.
 */
const LogEntry: React.FC<{ entry: ActivityLogEntry }> = ({ entry }) => {
  return (
    <div className="log-entry">
      <span className="log-entry__time">{entry.time}</span>
      <div className="log-entry__content">
        <span className="log-entry__title">{entry.title}</span>
        {entry.detail && (
          <span className={`log-entry__detail log-entry__detail--${entry.detailType || 'info'}`}>
            {entry.detail}
          </span>
        )}
      </div>
    </div>
  );
};

export default LocationDetailView;
