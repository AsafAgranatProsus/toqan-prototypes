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
