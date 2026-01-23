/**
 * Restaurant Assets Data
 * 
 * Centralized asset definitions for the restaurant concept prototype.
 * Each asset includes metadata and content for display in the canvas.
 */

import type { IconName } from '../../../types';

// Asset categories with metadata
export type AssetCategory = 'labor' | 'inventory' | 'finance' | 'menu' | 'ops';

export const ASSET_CATEGORIES: Record<AssetCategory, { label: string; icon: IconName; emoji: string }> = {
  labor: { label: 'Labor & Staffing', icon: 'Users', emoji: '👥' },
  inventory: { label: 'Inventory', icon: 'Package', emoji: '📦' },
  finance: { label: 'Finance', icon: 'DollarSign', emoji: '💰' },
  menu: { label: 'Menu & Ops', icon: 'Utensils', emoji: '🍝' },
  ops: { label: 'Operations', icon: 'Settings', emoji: '⚙️' },
};

// Table column definition
export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

// Table row is a record of column key to cell value
export type TableRow = Record<string, string | number>;

// Chart data point
export interface ChartDataPoint {
  name: string;
  category: string;
  x: number;
  y: number;
  classification?: string;
  [key: string]: string | number | undefined;
}

// Waterfall chart data point
export interface WaterfallDataPoint {
  name: string;
  value: number;
  type: 'total' | 'addition' | 'deduction' | 'end';
}

// Grouped bar chart data point (e.g., Actual vs Budget)
export interface GroupedBarDataPoint {
  category: string;
  values: { label: string; value: number; color?: string }[];
}

// Combo chart data point (bars + line)
export interface ComboChartDataPoint {
  label: string;
  barValue: number;
  lineValue: number;
}

// Chart configuration
export interface ChartConfig {
  chartType: 'scatter' | 'bar' | 'line' | 'pie' | 'waterfall' | 'groupedBar' | 'combo';
  xKey?: string;
  yKey?: string;
  xLabel?: string;
  yLabel?: string;
  yLabelSecondary?: string;  // For combo chart right axis
  barLabel?: string;         // For combo chart legend
  lineLabel?: string;        // For combo chart legend
  colorKey?: string;
  data: ChartDataPoint[] | WaterfallDataPoint[] | GroupedBarDataPoint[] | ComboChartDataPoint[];
}

// Content block types for canvas rendering
export type ContentBlock = 
  | { type: 'table'; columns: TableColumn[]; rows: TableRow[] }
  | { type: 'alert'; level: 'warning' | 'info' | 'success' | 'error'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'section'; title: string; items: { label: string; value: string; action?: string }[] }
  | { type: 'quadrant'; title: string; items: { name: string; emoji: string; stats: string; action: string }[] }
  | { type: 'chart'; title?: string; config: ChartConfig };

// Asset definition
export interface Asset {
  id: string;
  title: string;
  category: AssetCategory;
  status: string;
  statusDetail?: string;
  updatedAt: string;
  content: ContentBlock[];
}

// All restaurant assets
export const RESTAURANT_ASSETS: Asset[] = [
  {
    id: 'labor-roster-w42',
    title: 'Labor Roster: Week 42 (Feb 9–15)',
    category: 'labor',
    status: 'Active',
    statusDetail: 'Updated 2h ago',
    updatedAt: '2h ago',
    content: [
      {
        type: 'chart',
        title: 'Staff Hours vs. Projected Sales',
        config: {
          chartType: 'combo',
          yLabel: 'Staff Hours',
          yLabelSecondary: 'Sales ($)',
          barLabel: 'Staff Hours',
          lineLabel: 'Projected Sales',
          data: [
            { label: 'Mon', barValue: 38, lineValue: 2800 },
            { label: 'Tue', barValue: 42, lineValue: 3200 },
            { label: 'Wed', barValue: 40, lineValue: 3100 },
            { label: 'Thu', barValue: 48, lineValue: 4500 },
            { label: 'Fri', barValue: 65, lineValue: 8200 },
            { label: 'Sat', barValue: 68, lineValue: 8800 },
            { label: 'Sun', barValue: 52, lineValue: 5500 },
          ],
        },
      },
      {
        type: 'table',
        columns: [
          { key: 'staff', label: 'Staff', align: 'left' },
          { key: 'mon', label: 'Mon (9)', align: 'center' },
          { key: 'tue', label: 'Tue (10)', align: 'center' },
          { key: 'wed', label: 'Wed (11)', align: 'center' },
          { key: 'thu', label: 'Thu (12)', align: 'center' },
          { key: 'fri', label: 'Fri (13)', align: 'center' },
          { key: 'sat', label: 'Sat (14)', align: 'center' },
          { key: 'sun', label: 'Sun (15)', align: 'center' },
          { key: 'total', label: 'Total Hrs', align: 'right' },
        ],
        rows: [
          { staff: 'Sarah J. (Mgr)', mon: 'OFF', tue: '09:00 - 17:00', wed: '09:00 - 17:00', thu: '09:00 - 17:00', fri: '16:00 - Close', sat: '16:00 - Close', sun: 'OFF', total: '42h' },
          { staff: 'Mike T. (Line)', mon: '16:00 - Close', tue: '16:00 - Close', wed: 'OFF', thu: '09:00 - 17:00', fri: '16:00 - Close', sat: '16:00 - Close', sun: '12:00 - 20:00', total: '46h (OT!)' },
          { staff: 'John D. (Prep)', mon: '07:00 - 15:00', tue: '07:00 - 15:00', wed: '07:00 - 15:00', thu: 'OFF', fri: 'OFF', sat: '10:00 - 18:00', sun: '10:00 - 18:00', total: '40h' },
          { staff: 'Emma W. (Server)', mon: '17:00 - 23:00', tue: 'OFF', wed: '17:00 - 23:00', thu: '17:00 - 23:00', fri: '17:00 - Close', sat: '11:00 - 16:00', sun: '11:00 - 16:00', total: '32h' },
        ],
      },
      {
        type: 'alert',
        level: 'warning',
        items: [
          'Overtime Risk: Mike T. is scheduled for 46 hours.',
          'Understaffed: Friday Night (Valentine\'s Eve) needs 1 more server.',
        ],
      },
    ],
  },
  {
    id: 'supplier-order-442',
    title: 'Supplier Order: Sysco #442',
    category: 'inventory',
    status: 'Draft',
    statusDetail: 'Value: $1,240.50',
    updatedAt: '1d ago',
    content: [
      {
        type: 'table',
        columns: [
          { key: 'code', label: 'Item Code', align: 'left' },
          { key: 'description', label: 'Description', align: 'left' },
          { key: 'par', label: 'Par', align: 'right' },
          { key: 'onHand', label: 'On Hand', align: 'right' },
          { key: 'orderQty', label: 'Order Qty', align: 'right' },
          { key: 'unitPrice', label: 'Unit Price', align: 'right' },
          { key: 'lineTotal', label: 'Line Total', align: 'right' },
        ],
        rows: [
          { code: 'F-102', description: 'Atlantic Salmon (Whole)', par: '10 kg', onHand: '2 kg', orderQty: '8 kg', unitPrice: '$18.50/kg', lineTotal: '$148.00' },
          { code: 'P-204', description: 'Lemons (Case)', par: '3 cs', onHand: '0.5 cs', orderQty: '3 cs', unitPrice: '$45.00/cs', lineTotal: '$135.00' },
          { code: 'D-550', description: 'Heavy Cream (Quart)', par: '12 qt', onHand: '4 qt', orderQty: '8 qt', unitPrice: '$6.20/qt', lineTotal: '$49.60' },
          { code: 'M-991', description: 'Ribeye Steak (12oz cut)', par: '40 units', onHand: '5 units', orderQty: '35 units', unitPrice: '$14.50/ea', lineTotal: '$507.50' },
          { code: 'V-302', description: 'Asparagus (Bunch)', par: '20 bn', onHand: '2 bn', orderQty: '18 bn', unitPrice: '$4.50/bn', lineTotal: '$81.00' },
        ],
      },
      {
        type: 'note',
        text: 'Total Estimated Cost: $1,240.50 — Note: Salmon price is +18% vs last week.',
      },
    ],
  },
  {
    id: 'financial-jan-pl',
    title: 'Financial Report: January Flash P&L',
    category: 'finance',
    status: 'Finalized',
    statusDetail: 'Net Profit: 8.2%',
    updatedAt: '3d ago',
    content: [
      {
        type: 'chart',
        title: 'Actual vs. Budget',
        config: {
          chartType: 'groupedBar',
          yLabel: 'Amount ($)',
          data: [
            { category: 'Sales', values: [{ label: 'Actual', value: 48500 }, { label: 'Budget', value: 45000 }] },
            { category: 'COGS', values: [{ label: 'Actual', value: 19620 }, { label: 'Budget', value: 18000 }] },
            { category: 'Labor', values: [{ label: 'Actual', value: 16975 }, { label: 'Budget', value: 15750 }] },
            { category: 'Rent', values: [{ label: 'Actual', value: 5500 }, { label: 'Budget', value: 5500 }] },
            { category: 'Net Profit', values: [{ label: 'Actual', value: 3977 }, { label: 'Budget', value: 4000 }] },
          ],
        },
      },
      // Waterfall chart - hidden for now
      // {
      //   type: 'chart',
      //   title: 'P&L Waterfall',
      //   config: {
      //     chartType: 'waterfall',
      //     yLabel: 'Amount ($)',
      //     data: [
      //       { name: 'Total Sales', value: 48500, type: 'total' },
      //       { name: 'COGS (Food)', value: -15520, type: 'deduction' },
      //       { name: 'COGS (Bev)', value: -4100, type: 'deduction' },
      //       { name: 'Labor', value: -16975, type: 'deduction' },
      //       { name: 'Rent & Utilities', value: -5500, type: 'deduction' },
      //       { name: 'Misc & Ops', value: -2428, type: 'deduction' },
      //       { name: 'Net Profit', value: 3977, type: 'end' },
      //     ],
      //   },
      // },
      {
        type: 'table',
        columns: [
          { key: 'category', label: 'Category', align: 'left' },
          { key: 'actual', label: 'Actual ($)', align: 'right' },
          { key: 'budget', label: 'Budget ($)', align: 'right' },
          { key: 'variance', label: 'Variance', align: 'right' },
          { key: 'pctSales', label: '% of Sales', align: 'right' },
        ],
        rows: [
          { category: 'Total Sales', actual: '$48,500', budget: '$45,000', variance: '+$3,500 🟢', pctSales: '100%' },
          { category: 'Cost of Goods (Food)', actual: '$15,520', budget: '$13,500', variance: '-$2,020 🔴', pctSales: '32.0%' },
          { category: 'Cost of Goods (Bev)', actual: '$4,100', budget: '$4,500', variance: '+$400 🟢', pctSales: '8.4%' },
          { category: 'Gross Profit', actual: '$28,880', budget: '$27,000', variance: '+$1,880 🟢', pctSales: '59.5%' },
          { category: 'Labor (FOH + BOH)', actual: '$16,975', budget: '$15,750', variance: '-$1,225 🔴', pctSales: '35.0%' },
          { category: 'Rent & Utilities', actual: '$5,500', budget: '$5,500', variance: '$0', pctSales: '11.3%' },
          { category: 'Net Profit', actual: '$3,977', budget: '$4,000', variance: '-$23 ⚪', pctSales: '8.2%' },
        ],
      },
    ],
  },
  {
    id: 'menu-analysis-q1',
    title: 'Menu Analysis: Q1 Performance',
    category: 'menu',
    status: 'Report',
    statusDetail: 'Recommendations Available',
    updatedAt: '1w ago',
    content: [
      {
        type: 'chart',
        title: 'Profit vs. Popularity',
        config: {
          chartType: 'scatter',
          xKey: 'qtySold',
          yKey: 'margin',
          xLabel: 'Quantity Sold',
          yLabel: 'Margin ($)',
          colorKey: 'classification',
          data: [
            { name: 'Classic Burger', category: 'Main', qtySold: 450, x: 450, y: 12.00, margin: 12.00, classification: 'Star' },
            { name: 'Caesar Salad', category: 'Starter', qtySold: 320, x: 320, y: 9.50, margin: 9.50, classification: 'Star' },
            { name: 'Fish & Chips', category: 'Main', qtySold: 380, x: 380, y: 6.00, margin: 6.00, classification: 'Plowhorse' },
            { name: 'Soda/Tea', category: 'Bev', qtySold: 600, x: 600, y: 2.50, margin: 2.50, classification: 'Plowhorse' },
            { name: 'Lamb Shank', category: 'Main', qtySold: 45, x: 45, y: 18.00, margin: 18.00, classification: 'Puzzle' },
            { name: 'Truffle Pasta', category: 'Main', qtySold: 60, x: 60, y: 14.00, margin: 14.00, classification: 'Puzzle' },
            { name: 'Vegan Stew', category: 'Main', qtySold: 12, x: 12, y: 5.00, margin: 5.00, classification: 'Dog' },
            { name: 'House Wine', category: 'Bev', qtySold: 150, x: 150, y: 7.00, margin: 7.00, classification: 'Dog' },
          ],
        },
      },
      {
        type: 'quadrant',
        title: 'Stars (High Profit, High Popularity)',
        items: [
          { name: 'Classic Burger', emoji: '🍔', stats: 'Sold 450 | Margin $12.00', action: 'Keep as is.' },
          { name: 'Caesar Salad', emoji: '🥗', stats: 'Sold 320 | Margin $9.50', action: 'Promote as side.' },
        ],
      },
      {
        type: 'quadrant',
        title: 'Puzzles (High Profit, Low Popularity)',
        items: [
          { name: 'Lamb Shank', emoji: '🥩', stats: 'Sold 45 | Margin $18.00', action: 'Run special or rename.' },
          { name: 'Truffle Pasta', emoji: '🍝', stats: 'Sold 60 | Margin $14.00', action: 'Staff tasting training.' },
        ],
      },
      {
        type: 'quadrant',
        title: 'Plowhorses (Low Profit, High Popularity)',
        items: [
          { name: 'Fish & Chips', emoji: '🐟', stats: 'Sold 380 | Margin $6.00', action: 'Raise price by $2 or reduce portion.' },
        ],
      },
      {
        type: 'quadrant',
        title: 'Dogs (Low Profit, Low Popularity)',
        items: [
          { name: 'Vegan Stew', emoji: '🍲', stats: 'Sold 12 | Margin $5.00', action: 'Remove from menu.' },
        ],
      },
    ],
  },
  {
    id: 'staff-availability',
    title: 'Staff Availability Sheet',
    category: 'labor',
    status: 'Reference',
    statusDetail: 'Updated Jan 15',
    updatedAt: 'Jan 15',
    content: [
      {
        type: 'table',
        columns: [
          { key: 'employee', label: 'Employee', align: 'left' },
          { key: 'role', label: 'Role', align: 'left' },
          { key: 'maxHours', label: 'Max Hours', align: 'right' },
          { key: 'preferred', label: 'Preferred Days', align: 'left' },
          { key: 'unavailable', label: 'Unavailable', align: 'left' },
          { key: 'notes', label: 'Notes', align: 'left' },
        ],
        rows: [
          { employee: 'Sarah J.', role: 'Manager', maxHours: '45h', preferred: 'Tue-Sat', unavailable: 'Sundays', notes: 'Key holder' },
          { employee: 'Mike T.', role: 'Line Cook', maxHours: '40h', preferred: 'Wed-Sun', unavailable: 'Mondays', notes: 'Can work grill' },
          { employee: 'Emma W.', role: 'Server', maxHours: '30h', preferred: 'Thu-Sun', unavailable: 'Tue/Wed', notes: 'Student (exams in May)' },
          { employee: 'John D.', role: 'Prep', maxHours: '40h', preferred: 'Mon-Fri', unavailable: 'Sat/Sun', notes: 'Morning shifts only' },
          { employee: 'Alex R.', role: 'Dish', maxHours: '20h', preferred: 'Fri-Sun', unavailable: 'Mon-Thu', notes: 'Second job' },
        ],
      },
    ],
  },
];

// Helper to get asset by ID
export const getAssetById = (id: string): Asset | undefined => 
  RESTAURANT_ASSETS.find(asset => asset.id === id);

// Helper to get assets by category
export const getAssetsByCategory = (category: AssetCategory): Asset[] =>
  RESTAURANT_ASSETS.filter(asset => asset.category === category);
