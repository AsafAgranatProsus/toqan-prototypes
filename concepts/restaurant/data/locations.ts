/**
 * Restaurant Locations Data
 * 
 * Centralized location definitions for the restaurant concept prototype.
 * Each location includes metadata, metrics, and context-specific quick actions.
 */

import type { IconName } from '../../../types';
import type { QuickAction } from '../../../shared/chatPanel/types';

/**
 * Location metric for displaying KPIs on location cards.
 */
export interface LocationMetric {
  id: string;
  label: string;
  value: string;
  type: 'win' | 'fire' | 'neutral';
  icon?: IconName;
}

/**
 * Location data with quick actions for contextual chat panel.
 */
export interface LocationData {
  id: string;
  name: string;
  address: string;
  city: string;
  type: 'restaurant' | 'central-kitchen';
  status: 'active' | 'warning' | 'critical';
  metrics: LocationMetric[];
  /** Context-specific quick actions for this location */
  quickActions?: QuickAction[];
}

/**
 * Central Kitchen location
 */
export const CENTRAL_KITCHEN: LocationData = {
  id: 'central-kitchen',
  name: 'Central Kitchen',
  address: 'Industrieweg 45, Amsterdam',
  city: 'Amsterdam',
  type: 'central-kitchen',
  status: 'active',
  metrics: [
    { id: 'ck-1', label: 'Orders Today', value: '142', type: 'neutral', icon: 'Activity' },
    { id: 'ck-2', label: 'On Time', value: '98%', type: 'win', icon: 'CheckCircle' },
  ],
  quickActions: [
    { id: 'production-status', label: 'Production status', icon: 'Activity', prompt: 'Show me the current production status for Central Kitchen' },
    { id: 'delivery-schedule', label: 'Delivery schedule', icon: 'Truck', prompt: 'What deliveries are scheduled from Central Kitchen today?' },
    { id: 'inventory-levels', label: 'Check inventory', icon: 'Package', prompt: 'Check inventory levels at Central Kitchen' },
  ],
};

/**
 * All restaurant locations with quick actions
 */
export const LOCATIONS: LocationData[] = [
  // Amsterdam (8)
  {
    id: 'loc-1',
    name: 'Amstelstraat',
    address: 'Amstelstraat 24',
    city: 'Amsterdam',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm1-1', label: 'Revenue', value: '+12%', type: 'win', icon: 'TrendingUp' },
      { id: 'm1-2', label: 'Rating', value: '4.8', type: 'win', icon: 'Star' },
    ],
    quickActions: [
      { id: 'view-performance', label: 'View performance', icon: 'TrendingUp', prompt: 'Show me detailed performance metrics for Amstelstraat' },
      { id: 'staff-schedule', label: 'Staff schedule', icon: 'Users', prompt: 'Show me the current staff schedule for Amstelstraat' },
      { id: 'recent-reviews', label: 'Recent reviews', icon: 'Star', prompt: 'What are the recent customer reviews for Amstelstraat?' },
    ],
  },
  {
    id: 'loc-2',
    name: 'Utrechtsestraat',
    address: 'Utrechtsestraat 112',
    city: 'Amsterdam',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm2-1', label: 'Revenue', value: '+8%', type: 'win', icon: 'TrendingUp' },
      { id: 'm2-2', label: 'Busy', value: 'Peak', type: 'neutral', icon: 'Activity' },
    ],
    quickActions: [
      { id: 'manage-peak', label: 'Manage peak hours', icon: 'Activity', prompt: 'How can we better manage peak hours at Utrechtsestraat?' },
      { id: 'view-performance', label: 'View performance', icon: 'TrendingUp', prompt: 'Show performance metrics for Utrechtsestraat' },
      { id: 'call-location', label: 'Contact location', icon: 'Phone', prompt: 'Get contact details for Utrechtsestraat' },
    ],
  },
  {
    id: 'loc-3',
    name: 'Zuidas',
    address: 'Claude Debussylaan 35',
    city: 'Amsterdam',
    type: 'restaurant',
    status: 'warning',
    metrics: [
      { id: 'm3-1', label: 'Cash Flow', value: 'Risk', type: 'fire', icon: 'AlertCircle' },
      { id: 'm3-2', label: 'Rent Due', value: '5 days', type: 'fire', icon: 'Clock' },
    ],
    quickActions: [
      { id: 'cash-flow-analysis', label: 'Analyze cash flow', icon: 'DollarSign', prompt: 'Analyze the cash flow situation at Zuidas location' },
      { id: 'payment-options', label: 'Payment options', icon: 'AlertCircle', prompt: 'What are our options for the rent payment at Zuidas?' },
      { id: 'revenue-boost', label: 'Boost revenue', icon: 'TrendingUp', prompt: 'Suggest ways to boost revenue at Zuidas quickly' },
    ],
  },
  {
    id: 'loc-4',
    name: 'Ceintuurbaan',
    address: 'Ceintuurbaan 256',
    city: 'Amsterdam',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm4-1', label: 'Revenue', value: '+5%', type: 'win', icon: 'TrendingUp' },
    ],
    quickActions: [
      { id: 'view-performance', label: 'View performance', icon: 'TrendingUp', prompt: 'Show performance metrics for Ceintuurbaan' },
      { id: 'staff-schedule', label: 'Staff schedule', icon: 'Users', prompt: 'Show the staff schedule for Ceintuurbaan' },
      { id: 'inventory-status', label: 'Inventory status', icon: 'Package', prompt: 'Check inventory levels at Ceintuurbaan' },
    ],
  },
  {
    id: 'loc-5',
    name: 'Haarlemmerdijk',
    address: 'Haarlemmerdijk 78',
    city: 'Amsterdam',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm5-1', label: 'New Menu', value: 'Live', type: 'win', icon: 'Sparkles' },
    ],
    quickActions: [
      { id: 'menu-feedback', label: 'Menu feedback', icon: 'Utensils', prompt: 'What is the customer feedback on the new menu at Haarlemmerdijk?' },
      { id: 'sales-comparison', label: 'Compare sales', icon: 'TrendingUp', prompt: 'Compare sales before and after the new menu launch' },
      { id: 'staff-training', label: 'Staff training', icon: 'Users', prompt: 'Check staff training status for the new menu items' },
    ],
  },
  {
    id: 'loc-6',
    name: 'Amstelveenseweg',
    address: 'Amstelveenseweg 134',
    city: 'Amsterdam',
    type: 'restaurant',
    status: 'critical',
    metrics: [
      { id: 'm6-1', label: 'Staff', value: '-2', type: 'fire', icon: 'User' },
      { id: 'm6-2', label: 'Coverage', value: '60%', type: 'fire', icon: 'AlertCircle' },
    ],
    quickActions: [
      { id: 'find-staff', label: 'Find staff coverage', icon: 'Users', prompt: 'Help me find staff coverage for Amstelveenseweg' },
      { id: 'shift-swap', label: 'Arrange shift swap', icon: 'Clock', prompt: 'Find available staff for shift swaps at Amstelveenseweg' },
      { id: 'temp-staffing', label: 'Temp staffing', icon: 'Phone', prompt: 'Contact temp staffing agencies for Amstelveenseweg' },
    ],
  },
  {
    id: 'loc-7',
    name: 'Westerstraat',
    address: 'Westerstraat 45',
    city: 'Amsterdam',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm7-1', label: 'Revenue', value: '+3%', type: 'win', icon: 'TrendingUp' },
    ],
    quickActions: [
      { id: 'view-performance', label: 'View performance', icon: 'TrendingUp', prompt: 'Show performance metrics for Westerstraat' },
      { id: 'upcoming-events', label: 'Upcoming events', icon: 'Activity', prompt: 'Are there any upcoming events near Westerstraat?' },
      { id: 'inventory-status', label: 'Inventory status', icon: 'Package', prompt: 'Check inventory at Westerstraat' },
    ],
  },
  {
    id: 'loc-8',
    name: 'Middenweg',
    address: 'Middenweg 89',
    city: 'Amsterdam',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm8-1', label: 'Rating', value: '4.6', type: 'win', icon: 'Star' },
    ],
    quickActions: [
      { id: 'view-reviews', label: 'View reviews', icon: 'Star', prompt: 'Show recent customer reviews for Middenweg' },
      { id: 'improve-rating', label: 'Improve rating', icon: 'TrendingUp', prompt: 'How can we improve the rating at Middenweg?' },
      { id: 'staff-schedule', label: 'Staff schedule', icon: 'Users', prompt: 'Show the staff schedule for Middenweg' },
    ],
  },
  // Utrecht (2)
  {
    id: 'loc-9',
    name: 'Voorstraat',
    address: 'Voorstraat 67',
    city: 'Utrecht',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm9-1', label: 'Revenue', value: '+15%', type: 'win', icon: 'TrendingUp' },
      { id: 'm9-2', label: 'Top Seller', value: '#1', type: 'win', icon: 'Award' },
    ],
    quickActions: [
      { id: 'success-factors', label: 'Success factors', icon: 'Award', prompt: 'What makes Voorstraat our top performing location?' },
      { id: 'replicate-success', label: 'Share best practices', icon: 'TrendingUp', prompt: 'How can we replicate Voorstraat success at other locations?' },
      { id: 'view-performance', label: 'Full performance', icon: 'Activity', prompt: 'Show complete performance breakdown for Voorstraat' },
    ],
  },
  {
    id: 'loc-10',
    name: 'Nachtegaalstraat',
    address: 'Nachtegaalstraat 23',
    city: 'Utrecht',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm10-1', label: 'Delivery', value: '+20%', type: 'win', icon: 'Truck' },
    ],
    quickActions: [
      { id: 'delivery-analysis', label: 'Delivery analysis', icon: 'Truck', prompt: 'Analyze the delivery performance at Nachtegaalstraat' },
      { id: 'expand-delivery', label: 'Expand delivery zone', icon: 'MapPin', prompt: 'Should we expand the delivery zone at Nachtegaalstraat?' },
      { id: 'delivery-partners', label: 'Delivery partners', icon: 'Activity', prompt: 'Review delivery partner performance at Nachtegaalstraat' },
    ],
  },
  // Other Cities (4)
  {
    id: 'loc-11',
    name: 'Haarlem',
    address: 'Kruisweg 12',
    city: 'Haarlem',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm11-1', label: 'Revenue', value: '+7%', type: 'win', icon: 'TrendingUp' },
    ],
    quickActions: [
      { id: 'view-performance', label: 'View performance', icon: 'TrendingUp', prompt: 'Show performance metrics for Haarlem location' },
      { id: 'local-marketing', label: 'Local marketing', icon: 'Activity', prompt: 'Suggest local marketing ideas for Haarlem' },
      { id: 'staff-schedule', label: 'Staff schedule', icon: 'Users', prompt: 'Show the staff schedule for Haarlem' },
    ],
  },
  {
    id: 'loc-12',
    name: 'Den Haag',
    address: 'Kerkplein 4a',
    city: 'Den Haag',
    type: 'restaurant',
    status: 'warning',
    metrics: [
      { id: 'm12-1', label: 'Stock', value: 'Low', type: 'fire', icon: 'Package' },
    ],
    quickActions: [
      { id: 'stock-alert', label: 'Resolve stock issue', icon: 'Package', prompt: 'Help me resolve the low stock issue at Den Haag' },
      { id: 'emergency-order', label: 'Emergency order', icon: 'Truck', prompt: 'Place an emergency order for Den Haag location' },
      { id: 'adjust-menu', label: 'Adjust menu', icon: 'Utensils', prompt: 'Which menu items should we 86 at Den Haag?' },
    ],
  },
  {
    id: 'loc-13',
    name: 'Amersfoort',
    address: 'Langestraat 56',
    city: 'Amersfoort',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm13-1', label: 'Revenue', value: '+4%', type: 'win', icon: 'TrendingUp' },
    ],
    quickActions: [
      { id: 'view-performance', label: 'View performance', icon: 'TrendingUp', prompt: 'Show performance metrics for Amersfoort' },
      { id: 'growth-opportunities', label: 'Growth opportunities', icon: 'Activity', prompt: 'What are the growth opportunities at Amersfoort?' },
      { id: 'staff-schedule', label: 'Staff schedule', icon: 'Users', prompt: 'Show the staff schedule for Amersfoort' },
    ],
  },
  {
    id: 'loc-14',
    name: 'Rotterdam',
    address: 'Witte de Withstraat 89',
    city: 'Rotterdam',
    type: 'restaurant',
    status: 'active',
    metrics: [
      { id: 'm14-1', label: 'Grand Opening', value: 'New', type: 'win', icon: 'Sparkles' },
    ],
    quickActions: [
      { id: 'opening-checklist', label: 'Opening checklist', icon: 'CheckCircle', prompt: 'Show me the opening checklist for Rotterdam' },
      { id: 'first-week-metrics', label: 'First week metrics', icon: 'TrendingUp', prompt: 'How is Rotterdam performing in its first week?' },
      { id: 'marketing-plan', label: 'Marketing plan', icon: 'Activity', prompt: 'Review the marketing plan for Rotterdam grand opening' },
    ],
  },
];

/**
 * Group locations by city
 */
export const groupLocationsByCity = (locations: LocationData[]): Record<string, LocationData[]> => {
  const groups: Record<string, LocationData[]> = {};
  locations.forEach((loc) => {
    if (!groups[loc.city]) groups[loc.city] = [];
    groups[loc.city].push(loc);
  });
  return groups;
};

/**
 * Get location by ID (includes central kitchen)
 */
export const getLocationById = (id: string): LocationData | undefined => {
  if (id === 'central-kitchen') return CENTRAL_KITCHEN;
  return LOCATIONS.find(loc => loc.id === id);
};

/**
 * Get all locations including central kitchen
 */
export const getAllLocations = (): LocationData[] => [CENTRAL_KITCHEN, ...LOCATIONS];
