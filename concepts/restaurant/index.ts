/**
 * Restaurant Concept
 * 
 * Toqan adapted for restaurant owners and SMBs.
 * This concept focuses on:
 * - Order management
 * - Menu assistance
 * - Customer inquiries
 * - Business operations
 */

// Pages
export { RestaurantHomePage } from './pages/RestaurantHomePage';

// Context
export { RestaurantProvider, useRestaurant } from './context/RestaurantContext';

// Components
export { LeftSidebarRestaurant } from './components/LeftSidebarRestaurant';
export { SecondaryPanel } from './components/SecondaryPanel';
export { PrioritiesPanel } from './components/PrioritiesPanel';
export { LocationsPanel } from './components/LocationsPanel';
export { TopNavbarRestaurant } from './components/TopNavbarRestaurant';
export { RestaurantLeftPanelWrapper } from './components/RestaurantLeftPanelWrapper';
export { AssetCanvas } from './components/AssetCanvas';

// Data
export { RESTAURANT_ASSETS, ASSET_CATEGORIES, getAssetById } from './data/assets';
export { LOCATIONS, CENTRAL_KITCHEN, getLocationById, getAllLocations, groupLocationsByCity } from './data/locations';

// Flows
export { registerRestaurantFlows, restaurantFlows, getFlowIdForPriority } from './flows';

// Routes configuration
export const routes = {
  home: '/restaurant',
  orders: '/restaurant/orders',
  menu: '/restaurant/menu',
  analytics: '/restaurant/analytics',
} as const;

// Feature flag defaults for this concept
// These can override core defaults when restaurant concept is active
export const featureDefaults = {
  // Restaurant concept might want different defaults
  // newBranding: true,
  // workspaces: true,
} as const;

// Concept metadata
export const meta = {
  id: 'restaurant',
  name: 'Restaurant',
  description: 'Toqan for restaurant owners & SMBs',
  icon: '🍽️', // Used in concept selector
} as const;
