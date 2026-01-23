/**
 * Top Navbar (Restaurant Concept)
 * 
 * Restaurant-specific top navigation bar.
 * Positioned to the right of the left sidebar, not above it.
 * Fixed at the top of the main content area.
 * 
 * Feature flags:
 * - restaurantBreadcrumbs: Show/hide breadcrumb navigation
 * - restaurantTopNavButtons: Show/hide right-side action buttons
 * - restaurantTopNavSearchBar: Show/hide center search bar
 */

import React from 'react';
import { Icons } from '../../../components/Icons/Icons';
import Button from '../../../components/Button/Button';
import { AreaProps } from '../../composer/types';
import { useRestaurant } from '../context/RestaurantContext';
import { useFeatureFlags } from '../../../context/FeatureFlagContext';
import './TopNavbarRestaurant.css';

export const TopNavbarRestaurant: React.FC<AreaProps> = ({ 
  onMenuClick,
  isMobile,
}) => {
  const { isSecondaryPanelOpen, toggleSecondaryPanel } = useRestaurant();
  const { flags } = useFeatureFlags();
  
  // Hide navbar if none of its content is visible
  const hasVisibleContent = flags.restaurantBreadcrumbs || 
                            flags.restaurantTopNavSearchBar || 
                            flags.restaurantTopNavButtons;
  
  if (!hasVisibleContent) return null;
  
  return (
    <header className="top-navbar-restaurant">
      <div className="top-navbar-restaurant__left">
        {/* Breadcrumb / Current View - controlled by restaurantBreadcrumbs flag */}
        {flags.restaurantBreadcrumbs && (
          <nav className="top-navbar-restaurant__breadcrumb">
            <span className="top-navbar-restaurant__breadcrumb-item">Restaurant</span>
            <Icons name="ChevronRight" />
            <span className="top-navbar-restaurant__breadcrumb-item top-navbar-restaurant__breadcrumb-item--current">
              Dashboard
            </span>
          </nav>
        )}
      </div>

      <div className="top-navbar-restaurant__center">
        {/* Search or main action area - controlled by restaurantTopNavSearchBar flag */}
        {flags.restaurantTopNavSearchBar && (
          <div className="top-navbar-restaurant__search">
            <Icons name="MessageSquare" />
            <input
              type="text"
              placeholder="Ask Toqan anything..."
              className="top-navbar-restaurant__search-input"
            />
            <span className="top-navbar-restaurant__search-shortcut">⌘K</span>
          </div>
        )}
      </div>

      <div className="top-navbar-restaurant__right">
        {/* Action buttons - controlled by restaurantTopNavButtons flag */}
        {flags.restaurantTopNavButtons && (
          <>
            <Button
              variant="text"
              shape="circle"
              icon="FileStack"
              aria-label="Toggle assets panel"
              onClick={toggleSecondaryPanel}
              className={isSecondaryPanelOpen ? 'top-navbar-restaurant__btn--active' : ''}
            />
            <Button
              variant="text"
              shape="circle"
              icon="Clock"
              aria-label="Activity"
            />
            <Button
              variant="text"
              shape="circle"
              icon="User"
              aria-label="Profile"
            />
          </>
        )}
      </div>
    </header>
  );
};

export default TopNavbarRestaurant;
