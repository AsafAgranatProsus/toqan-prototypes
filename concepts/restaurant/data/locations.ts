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
 * AI-derived "vibe" status for the location.
 * Represents the current operational tempo/mood.
 */
export interface LocationVibe {
  label: string;          // "High Tempo", "Steady", "Slow Day", "Output Normal"
  type: 'high' | 'normal' | 'low' | 'warning';
}

/**
 * Extended metric with comparison and insight for detail view.
 * Each metric shows value + why it matters.
 */
export interface DetailMetric {
  id: string;
  label: string;           // "LIVE REVENUE", "KITCHEN LOAD"
  value: string;           // "$4,250", "85%"
  comparison?: string;     // "▲$800 vs Forecast"
  comparisonType?: 'positive' | 'negative' | 'neutral';
  insight?: string;        // "Why: Unexpected Lunch Rush (+20% covers)"
  insightType?: 'info' | 'warning' | 'success';
  icon?: IconName;
}

/**
 * Staff/Operations section data.
 * Shows efficiency and AI-derived insights.
 */
export interface StaffingInfo {
  efficiency: string;      // "6/7 Active (Lean)"
  efficiencyPercent: number;
  manager: { name: string; nextShift?: string };
  insight?: string;        // "Prep Station lagging. Suggest deploying 1 runner."
  insightType?: 'warning' | 'info';
}

/**
 * Activity log entry with AI context.
 * Timestamped events with insights.
 */
export interface ActivityLogEntry {
  id: string;
  time: string;            // "11:15 AM"
  title: string;           // "Inventory Check Complete"
  detail?: string;         // "Variance Detected: Avocados (-20%). Auto-ticket created."
  detailType?: 'warning' | 'success' | 'info';
  icon?: IconName;
}

/**
 * Central Kitchen specific details.
 * Manufacturing/logistics focused data.
 */
export interface CentralKitchenDetails {
  outputStatus: string;    // "Output Normal" or "Output at 98%"
  hubId: string;           // "#HQ-01"
  shiftResources: { line: string; logistics: string };
  kitchenManager: { name: string; nextShift: string };
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
  /** AI-derived vibe/tempo status */
  vibe?: LocationVibe;
  /** Extended metrics with comparisons and insights for detail view */
  detailMetrics?: DetailMetric[];
  /** Staffing and efficiency information */
  staffing?: StaffingInfo;
  /** Intelligent activity log with AI context */
  activityLog?: ActivityLogEntry[];
  /** Central Kitchen specific details (only for central-kitchen type) */
  centralKitchenDetails?: CentralKitchenDetails;
  /** Operating hours display */
  openHours?: string;      // "Open until 23:00"
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
  // New: AI-driven detail view data
  vibe: { label: 'Output Normal', type: 'normal' },
  centralKitchenDetails: {
    outputStatus: 'Output Normal',
    hubId: '#HQ-01',
    shiftResources: { 
      line: 'Full Staff (12/12)', 
      logistics: '3 Drivers Active (All GPS Online)' 
    },
    kitchenManager: { name: 'David M.', nextShift: 'Night Crew (22:00)' },
  },
  detailMetrics: [
    {
      id: 'ck-dm-1',
      label: 'LOGISTICS & DELIVERY',
      value: '14/14',
      comparison: 'Departed On Time',
      comparisonType: 'positive',
      insight: 'Insight: Truck 3 (Uptown Route) is 10 mins ahead of schedule.',
      insightType: 'info',
      icon: 'Truck',
    },
    {
      id: 'ck-dm-2',
      label: 'RAW MATERIAL HEALTH',
      value: 'Low Risk',
      comparisonType: 'positive',
      insight: 'Watch Item: Tomatoes (<24h stock). Next delivery: Tomorrow 08:00.',
      insightType: 'warning',
      icon: 'Package',
    },
    {
      id: 'ck-dm-3',
      label: 'PRODUCTION QUEUE',
      value: '850 Units',
      comparison: 'Target: 1000 Units',
      comparisonType: 'neutral',
      insight: 'Status: Batch #4 (Sauces) delayed by 15m (Mixer Check).',
      insightType: 'info',
      icon: 'Activity',
    },
  ],
  activityLog: [
    {
      id: 'ck-log-1',
      time: '11:45 AM',
      title: 'Batch #42 (Marinara) Cleared',
      detail: 'Quality Check Passed. pH levels nominal. Moved to Cold Storage.',
      detailType: 'success',
      icon: 'CheckCircle',
    },
    {
      id: 'ck-log-2',
      time: '10:45 AM',
      title: 'Truck A Departed',
      detail: 'Route: Uptown Loop (4 Locations). ETA First Stop: 11:15 AM.',
      detailType: 'info',
      icon: 'Truck',
    },
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
    // New: AI-driven detail view data
    vibe: { label: 'High Tempo', type: 'high' },
    openHours: 'Open until 23:00',
    detailMetrics: [
      {
        id: 'am-dm-1',
        label: 'LIVE REVENUE',
        value: '$4,250',
        comparison: '▲$800 vs Forecast',
        comparisonType: 'positive',
        insight: 'Why: Unexpected Lunch Rush (+20% covers)',
        insightType: 'info',
        icon: 'DollarSign',
      },
      {
        id: 'am-dm-2',
        label: 'KITCHEN LOAD',
        value: '85%',
        comparison: 'Capacity Strained',
        comparisonType: 'negative',
        insight: 'Risk: Ticket times nearing 25min threshold',
        insightType: 'warning',
        icon: 'Activity',
      },
      {
        id: 'am-dm-3',
        label: 'LIVE SENTIMENT',
        value: '4.8',
        comparisonType: 'positive',
        insight: 'Trend: "Fast Service" mentioned 4x today',
        insightType: 'success',
        icon: 'Star',
      },
    ],
    staffing: {
      efficiency: '6/7 Active (Lean)',
      efficiencyPercent: 85,
      manager: { name: 'Sarah K.', nextShift: 'Mike T. (14:00)' },
      insight: 'Insight: Prep Station lagging. Suggest deploying 1 runner to assist.',
      insightType: 'warning',
    },
    activityLog: [
      {
        id: 'am-log-1',
        time: '11:15 AM',
        title: 'Inventory Check Complete',
        detail: 'Variance Detected: Avocados (-20%). Auto-ticket created for recount.',
        detailType: 'warning',
        icon: 'Package',
      },
      {
        id: 'am-log-2',
        time: '10:30 AM',
        title: 'Sysco Delivery Arrived',
        detail: 'Late arrival (Scheduled 09:00). Impact on Prep: Minimal.',
        detailType: 'warning',
        icon: 'Truck',
      },
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
    vibe: { label: 'Peak Hours', type: 'high' },
    openHours: 'Open until 22:00',
    detailMetrics: [
      { id: 'u-dm-1', label: 'LIVE REVENUE', value: '$3,180', comparison: '▲$420 vs Forecast', comparisonType: 'positive', insight: 'Lunch rush performing well', icon: 'DollarSign' },
      { id: 'u-dm-2', label: 'KITCHEN LOAD', value: '92%', comparison: 'Peak Capacity', comparisonType: 'negative', insight: 'Queue time: 18 mins average', insightType: 'warning', icon: 'Activity' },
      { id: 'u-dm-3', label: 'LIVE SENTIMENT', value: '4.6', comparisonType: 'positive', insight: '"Great atmosphere" mentioned 3x', insightType: 'success', icon: 'Star' },
    ],
    staffing: { efficiency: '5/5 Active (Full)', efficiencyPercent: 100, manager: { name: 'Tom B.', nextShift: 'Anna L. (16:00)' } },
    activityLog: [
      { id: 'u-log-1', time: '12:30 PM', title: 'Peak Hour Alert', detail: 'Kitchen capacity at 92%. Consider limiting new orders.', detailType: 'warning', icon: 'AlertCircle' },
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
    vibe: { label: 'Attention Required', type: 'warning' },
    openHours: 'Open until 21:00',
    detailMetrics: [
      { id: 'z-dm-1', label: 'CASH POSITION', value: '$12,400', comparison: '▼ Below threshold', comparisonType: 'negative', insight: 'Rent €8,500 due in 5 days', insightType: 'warning', icon: 'DollarSign' },
      { id: 'z-dm-2', label: 'DAILY REVENUE', value: '$1,890', comparison: '▼ 15% vs target', comparisonType: 'negative', insight: 'Corporate lunch traffic down', insightType: 'warning', icon: 'TrendingUp' },
      { id: 'z-dm-3', label: 'LIVE SENTIMENT', value: '4.2', comparisonType: 'neutral', insight: 'Steady, no major complaints', icon: 'Star' },
    ],
    staffing: { efficiency: '4/4 Active', efficiencyPercent: 100, manager: { name: 'Jan V.', nextShift: 'Eva M. (17:00)' }, insight: 'Consider reducing shifts to cut costs', insightType: 'info' },
    activityLog: [
      { id: 'z-log-1', time: '09:00 AM', title: 'Cash Flow Alert Generated', detail: 'System flagged potential shortfall for rent payment.', detailType: 'warning', icon: 'AlertCircle' },
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
    vibe: { label: 'Steady', type: 'normal' },
    openHours: 'Open until 22:30',
    detailMetrics: [
      { id: 'c-dm-1', label: 'LIVE REVENUE', value: '$2,650', comparison: '▲$130 vs Forecast', comparisonType: 'positive', icon: 'DollarSign' },
      { id: 'c-dm-2', label: 'KITCHEN LOAD', value: '65%', comparison: 'Optimal', comparisonType: 'positive', icon: 'Activity' },
      { id: 'c-dm-3', label: 'LIVE SENTIMENT', value: '4.5', comparisonType: 'positive', insight: 'Consistent positive feedback', icon: 'Star' },
    ],
    staffing: { efficiency: '4/5 Active', efficiencyPercent: 80, manager: { name: 'Lisa R.', nextShift: 'Mark D. (18:00)' } },
    activityLog: [
      { id: 'c-log-1', time: '10:00 AM', title: 'Morning Prep Complete', detail: 'All stations ready. Stock levels nominal.', detailType: 'success', icon: 'CheckCircle' },
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
    vibe: { label: 'Launch Week', type: 'high' },
    openHours: 'Open until 23:00',
    detailMetrics: [
      { id: 'h-dm-1', label: 'NEW MENU SALES', value: '+22%', comparison: 'vs Last Week', comparisonType: 'positive', insight: 'Top seller: Truffle Pasta', insightType: 'success', icon: 'Sparkles' },
      { id: 'h-dm-2', label: 'KITCHEN LOAD', value: '78%', comparison: 'Training buffer applied', comparisonType: 'neutral', icon: 'Activity' },
      { id: 'h-dm-3', label: 'LIVE SENTIMENT', value: '4.7', comparisonType: 'positive', insight: '"New menu is amazing" - 6 mentions', insightType: 'success', icon: 'Star' },
    ],
    staffing: { efficiency: '6/6 Active (Full)', efficiencyPercent: 100, manager: { name: 'Nina K.', nextShift: 'Sam P. (15:00)' }, insight: 'Extra staff for menu launch support', insightType: 'info' },
    activityLog: [
      { id: 'h-log-1', time: '11:00 AM', title: 'Menu Launch Day 3', detail: 'Customer response exceeding expectations. Consider extending promo.', detailType: 'success', icon: 'Sparkles' },
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
    vibe: { label: 'Understaffed', type: 'warning' },
    openHours: 'Open until 21:00',
    detailMetrics: [
      { id: 'av-dm-1', label: 'STAFF COVERAGE', value: '60%', comparison: '2 no-shows today', comparisonType: 'negative', insight: 'Critical: Need 2 more for evening shift', insightType: 'warning', icon: 'Users' },
      { id: 'av-dm-2', label: 'KITCHEN LOAD', value: '45%', comparison: 'Reduced capacity', comparisonType: 'negative', insight: 'Limited menu items available', insightType: 'warning', icon: 'Activity' },
      { id: 'av-dm-3', label: 'WAIT TIMES', value: '35 min', comparison: '▲ 20min vs normal', comparisonType: 'negative', insightType: 'warning', icon: 'Clock' },
    ],
    staffing: { efficiency: '3/5 Active', efficiencyPercent: 60, manager: { name: 'Chris L.', nextShift: 'TBD' }, insight: 'URGENT: Contact temp agency immediately', insightType: 'warning' },
    activityLog: [
      { id: 'av-log-1', time: '08:30 AM', title: 'Staff No-Show Alert', detail: '2 morning staff called in sick. Coverage gap for lunch.', detailType: 'warning', icon: 'AlertCircle' },
      { id: 'av-log-2', time: '09:00 AM', title: 'Temp Agency Contacted', detail: 'Request sent to StaffNow. ETA response: 1 hour.', detailType: 'info', icon: 'Phone' },
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
    vibe: { label: 'Steady', type: 'normal' },
    openHours: 'Open until 22:00',
    detailMetrics: [
      { id: 'w-dm-1', label: 'LIVE REVENUE', value: '$2,180', comparison: '▲$65 vs Forecast', comparisonType: 'positive', icon: 'DollarSign' },
      { id: 'w-dm-2', label: 'KITCHEN LOAD', value: '55%', comparison: 'Comfortable', comparisonType: 'positive', icon: 'Activity' },
      { id: 'w-dm-3', label: 'LIVE SENTIMENT', value: '4.4', comparisonType: 'positive', icon: 'Star' },
    ],
    staffing: { efficiency: '4/4 Active', efficiencyPercent: 100, manager: { name: 'Petra W.', nextShift: 'Johan K. (17:00)' } },
    activityLog: [
      { id: 'w-log-1', time: '10:30 AM', title: 'Event Alert', detail: 'Local market nearby this Saturday. Consider extra prep.', detailType: 'info', icon: 'Activity' },
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
    vibe: { label: 'Steady', type: 'normal' },
    openHours: 'Open until 21:30',
    detailMetrics: [
      { id: 'mid-dm-1', label: 'LIVE REVENUE', value: '$1,950', comparison: 'On target', comparisonType: 'neutral', icon: 'DollarSign' },
      { id: 'mid-dm-2', label: 'KITCHEN LOAD', value: '50%', comparison: 'Relaxed', comparisonType: 'positive', icon: 'Activity' },
      { id: 'mid-dm-3', label: 'LIVE SENTIMENT', value: '4.6', comparisonType: 'positive', insight: '"Cozy atmosphere" trending', insightType: 'success', icon: 'Star' },
    ],
    staffing: { efficiency: '3/4 Active', efficiencyPercent: 75, manager: { name: 'Henk V.', nextShift: 'Mia B. (16:00)' } },
    activityLog: [
      { id: 'mid-log-1', time: '09:45 AM', title: 'New 5-Star Review', detail: '"Best pasta in the neighborhood!" - Google Review', detailType: 'success', icon: 'Star' },
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
    vibe: { label: 'Top Performer', type: 'high' },
    openHours: 'Open until 23:00',
    detailMetrics: [
      { id: 'v-dm-1', label: 'LIVE REVENUE', value: '$5,280', comparison: '▲$690 vs Forecast', comparisonType: 'positive', insight: '#1 in network today', insightType: 'success', icon: 'Award' },
      { id: 'v-dm-2', label: 'KITCHEN LOAD', value: '88%', comparison: 'High efficiency', comparisonType: 'positive', insight: 'Ticket time avg: 12 min', insightType: 'success', icon: 'Activity' },
      { id: 'v-dm-3', label: 'LIVE SENTIMENT', value: '4.9', comparisonType: 'positive', insight: '"Worth the trip" - 8 mentions', insightType: 'success', icon: 'Star' },
    ],
    staffing: { efficiency: '7/7 Active (Full)', efficiencyPercent: 100, manager: { name: 'Sophie T.', nextShift: 'Max R. (16:00)' }, insight: 'Consider this location for manager training', insightType: 'info' },
    activityLog: [
      { id: 'v-log-1', time: '11:30 AM', title: 'Daily Record Pace', detail: 'On track to break daily revenue record. Current: $5,280.', detailType: 'success', icon: 'Award' },
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
    vibe: { label: 'Delivery Hub', type: 'normal' },
    openHours: 'Open until 22:00',
    detailMetrics: [
      { id: 'n-dm-1', label: 'DELIVERY ORDERS', value: '48', comparison: '▲20% vs last week', comparisonType: 'positive', insight: 'Delivery revenue: $1,440', insightType: 'success', icon: 'Truck' },
      { id: 'n-dm-2', label: 'DINE-IN LOAD', value: '40%', comparison: 'Light', comparisonType: 'neutral', icon: 'Activity' },
      { id: 'n-dm-3', label: 'DELIVERY RATING', value: '4.7', comparisonType: 'positive', insight: 'Avg delivery time: 28 min', insightType: 'success', icon: 'Star' },
    ],
    staffing: { efficiency: '4/5 Active', efficiencyPercent: 80, manager: { name: 'Floor H.', nextShift: 'Tim J. (17:00)' } },
    activityLog: [
      { id: 'n-log-1', time: '12:00 PM', title: 'Delivery Partner Update', detail: 'Uber Eats driver shortage resolved. All orders covered.', detailType: 'success', icon: 'Truck' },
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
    vibe: { label: 'Steady', type: 'normal' },
    openHours: 'Open until 21:30',
    detailMetrics: [
      { id: 'hr-dm-1', label: 'LIVE REVENUE', value: '$2,340', comparison: '▲$160 vs Forecast', comparisonType: 'positive', icon: 'DollarSign' },
      { id: 'hr-dm-2', label: 'KITCHEN LOAD', value: '58%', comparison: 'Comfortable', comparisonType: 'positive', icon: 'Activity' },
      { id: 'hr-dm-3', label: 'LIVE SENTIMENT', value: '4.5', comparisonType: 'positive', icon: 'Star' },
    ],
    staffing: { efficiency: '4/4 Active', efficiencyPercent: 100, manager: { name: 'Ruud K.', nextShift: 'Lotte M. (17:00)' } },
    activityLog: [
      { id: 'hr-log-1', time: '10:00 AM', title: 'Local Event Opportunity', detail: 'Haarlem Jazz Festival next weekend. Consider promo.', detailType: 'info', icon: 'Activity' },
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
    vibe: { label: 'Stock Alert', type: 'warning' },
    openHours: 'Open until 22:00',
    detailMetrics: [
      { id: 'dh-dm-1', label: 'STOCK LEVEL', value: 'Critical', comparison: '4 items low', comparisonType: 'negative', insight: 'Emergency order placed 09:30', insightType: 'warning', icon: 'Package' },
      { id: 'dh-dm-2', label: 'MENU AVAILABILITY', value: '75%', comparison: '5 items 86\'d', comparisonType: 'negative', insightType: 'warning', icon: 'Utensils' },
      { id: 'dh-dm-3', label: 'LIVE REVENUE', value: '$1,680', comparison: '▼ 12% impact', comparisonType: 'negative', icon: 'DollarSign' },
    ],
    staffing: { efficiency: '4/4 Active', efficiencyPercent: 100, manager: { name: 'Kees B.', nextShift: 'Anouk D. (16:00)' }, insight: 'Update guests on limited menu', insightType: 'info' },
    activityLog: [
      { id: 'dh-log-1', time: '09:30 AM', title: 'Emergency Order Placed', detail: 'Sysco rush delivery. ETA: 14:00 today.', detailType: 'info', icon: 'Truck' },
      { id: 'dh-log-2', time: '08:45 AM', title: 'Stock Alert Triggered', detail: 'Chicken, Salmon, Avocado, Lemon below threshold.', detailType: 'warning', icon: 'AlertCircle' },
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
    vibe: { label: 'Steady', type: 'normal' },
    openHours: 'Open until 21:00',
    detailMetrics: [
      { id: 'af-dm-1', label: 'LIVE REVENUE', value: '$1,890', comparison: '▲$75 vs Forecast', comparisonType: 'positive', icon: 'DollarSign' },
      { id: 'af-dm-2', label: 'KITCHEN LOAD', value: '52%', comparison: 'Light', comparisonType: 'positive', icon: 'Activity' },
      { id: 'af-dm-3', label: 'LIVE SENTIMENT', value: '4.4', comparisonType: 'positive', icon: 'Star' },
    ],
    staffing: { efficiency: '3/4 Active', efficiencyPercent: 75, manager: { name: 'Bert S.', nextShift: 'Carla V. (17:00)' } },
    activityLog: [
      { id: 'af-log-1', time: '09:00 AM', title: 'Morning Opening', detail: 'All systems normal. Good prep for lunch rush.', detailType: 'success', icon: 'CheckCircle' },
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
    vibe: { label: 'Grand Opening', type: 'high' },
    openHours: 'Open until 23:00',
    detailMetrics: [
      { id: 'rt-dm-1', label: 'OPENING WEEK', value: 'Day 5', comparison: '▲ Ahead of projections', comparisonType: 'positive', insight: 'Social media buzz: +340% mentions', insightType: 'success', icon: 'Sparkles' },
      { id: 'rt-dm-2', label: 'COVERS TODAY', value: '142', comparison: '▲ 28% vs target', comparisonType: 'positive', icon: 'Users' },
      { id: 'rt-dm-3', label: 'LIVE SENTIMENT', value: '4.8', comparisonType: 'positive', insight: '"Amazing new spot!" - trending', insightType: 'success', icon: 'Star' },
    ],
    staffing: { efficiency: '8/8 Active (Full)', efficiencyPercent: 100, manager: { name: 'Dennis R.', nextShift: 'Team B (15:00)' }, insight: 'Extra support team on standby', insightType: 'info' },
    activityLog: [
      { id: 'rt-log-1', time: '11:00 AM', title: 'Influencer Visit Confirmed', detail: 'Food blogger @AmsterdamEats arriving 19:00. VIP table ready.', detailType: 'info', icon: 'Star' },
      { id: 'rt-log-2', time: '10:30 AM', title: 'Opening Week Promo Active', detail: '20% off until Sunday. Redemption rate: 45%.', detailType: 'success', icon: 'Sparkles' },
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
