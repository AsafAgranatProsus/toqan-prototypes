/**
 * Locations Grid Component
 * 
 * Displays a grid of restaurant locations grouped by city.
 * Includes optional central kitchen at the top.
 */

import React from 'react';
import { LocationCard } from './LocationCard';
import { LOCATIONS, CENTRAL_KITCHEN, groupLocationsByCity } from '../data/locations';
import './LocationsGrid.css';

interface LocationsGridProps {
  onLocationClick?: (locationId: string) => void;
  showCentralKitchen?: boolean;
}

export const LocationsGrid: React.FC<LocationsGridProps> = ({
  onLocationClick,
  showCentralKitchen = true,
}) => {
  const groupedLocations = groupLocationsByCity(LOCATIONS);
  const cities = Object.keys(groupedLocations);

  // Sort cities: Amsterdam first, then alphabetically
  cities.sort((a, b) => {
    if (a === 'Amsterdam') return -1;
    if (b === 'Amsterdam') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="locations-grid">
      <div className="locations-grid__header">
        <div className="locations-grid__title-row">
          <h2 className="locations-grid__title">All Locations</h2>
        </div>
      </div>

      <div className="locations-grid__content">
        {/* Central Kitchen */}
        {showCentralKitchen && (
          <div className="locations-grid__section locations-grid__section--kitchen">
            <h3 className="locations-grid__section-title">Central Kitchen</h3>
            <div className="locations-grid__kitchen">
              <LocationCard
                location={CENTRAL_KITCHEN}
                onClick={onLocationClick}
              />
            </div>
          </div>
        )}

        {/* Locations by city */}
        {cities.map((city) => (
          <div key={city} className="locations-grid__section">
            <h3 className="locations-grid__section-title">
              {city}
              <span className="locations-grid__section-count">
                {groupedLocations[city].length}
              </span>
            </h3>
            <div className="locations-grid__cards">
              {groupedLocations[city].map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onClick={onLocationClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export location data for use in detail view
export { LOCATIONS, CENTRAL_KITCHEN };

export default LocationsGrid;
