/**
 * Token Metadata System
 * Defines all design tokens with their types, ranges, categories, and display information
 */

export type TokenType = 'color' | 'slider-0-1' | 'slider-0-100' | 'string' | 'shadow' | 'dimension';

export interface TokenMetadata {
  name: string; // CSS variable name
  displayName: string;
  type: TokenType;
  category: string;
  subcategory?: string;
  description?: string;
  min?: number; // For sliders
  max?: number; // For sliders
  step?: number; // For sliders
  unit?: string; // For dimensions (rem, px, etc.)
  advanced?: boolean; // Show only in advanced mode
}

export const tokenCategories = {
  colors: 'Colors',
  visualEffects: 'Visual Effects',
  typography: 'Typography',
  spacing: 'Spacing',
  legacy: 'Legacy Tokens',
} as const;

/**
 * Complete token metadata catalog
 */
export const tokenMetadata: TokenMetadata[] = [
  // ===== COLORS - PRIMARY =====
  {
    name: '--color-primary-default',
    displayName: 'Primary',
    type: 'color',
    category: 'colors',
    subcategory: 'Primary',
    description: 'Main brand color',
  },
  {
    name: '--color-primary-hover',
    displayName: 'Primary Hover',
    type: 'color',
    category: 'colors',
    subcategory: 'Primary',
    description: 'Primary color hover state',
  },
  {
    name: '--color-primary-background',
    displayName: 'Primary Background',
    type: 'color',
    category: 'colors',
    subcategory: 'Primary',
    description: 'Subtle primary background',
  },
  {
    name: '--color-primary-light',
    displayName: 'Primary Light',
    type: 'color',
    category: 'colors',
    subcategory: 'Primary',
    description: 'Light tint of primary',
  },

  // ===== COLORS - SECONDARY =====
  {
    name: '--color-secondary-default',
    displayName: 'Secondary',
    type: 'color',
    category: 'colors',
    subcategory: 'Secondary',
    description: 'Supporting brand color',
  },
  {
    name: '--color-secondary-hover',
    displayName: 'Secondary Hover',
    type: 'color',
    category: 'colors',
    subcategory: 'Secondary',
    description: 'Secondary color hover state',
  },
  {
    name: '--color-secondary-background',
    displayName: 'Secondary Background',
    type: 'color',
    category: 'colors',
    subcategory: 'Secondary',
    description: 'Subtle secondary background',
  },
  {
    name: '--color-secondary-light',
    displayName: 'Secondary Light',
    type: 'color',
    category: 'colors',
    subcategory: 'Secondary',
    description: 'Light tint of secondary',
  },

  // ===== COLORS - TERTIARY =====
  {
    name: '--color-tertiary-default',
    displayName: 'Tertiary',
    type: 'color',
    category: 'colors',
    subcategory: 'Tertiary',
    description: 'Accent/contrast color',
  },
  {
    name: '--color-tertiary-hover',
    displayName: 'Tertiary Hover',
    type: 'color',
    category: 'colors',
    subcategory: 'Tertiary',
    description: 'Tertiary color hover state',
  },
  {
    name: '--color-tertiary-background',
    displayName: 'Tertiary Background',
    type: 'color',
    category: 'colors',
    subcategory: 'Tertiary',
    description: 'Subtle tertiary background',
  },
  {
    name: '--color-tertiary-light',
    displayName: 'Tertiary Light',
    type: 'color',
    category: 'colors',
    subcategory: 'Tertiary',
    description: 'Light tint of tertiary',
  },

  // ===== COLORS - BUTTON TEXT =====
  {
    name: '--color-btn-primary-text',
    displayName: 'Primary Button Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Button Text',
    description: 'Text color on primary buttons',
  },
  {
    name: '--color-btn-secondary-text',
    displayName: 'Secondary Button Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Button Text',
    description: 'Text color on secondary buttons',
  },
  {
    name: '--color-btn-tertiary-text',
    displayName: 'Tertiary Button Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Button Text',
    description: 'Text color on tertiary buttons',
  },

  // ===== COLORS - UI =====
  {
    name: '--color-ui-background',
    displayName: 'Background',
    type: 'color',
    category: 'colors',
    subcategory: 'UI',
    description: 'Main app background',
  },
  {
    name: '--color-ui-background-elevated',
    displayName: 'Background Elevated',
    type: 'color',
    category: 'colors',
    subcategory: 'UI',
    description: 'Elevated surface (cards, panels)',
  },
  {
    name: '--color-ui-border',
    displayName: 'Border',
    type: 'color',
    category: 'colors',
    subcategory: 'UI',
    description: 'Border color',
  },
  {
    name: '--color-ui-active',
    displayName: 'Active State',
    type: 'color',
    category: 'colors',
    subcategory: 'UI',
    description: 'Active/selected state',
  },
  {
    name: '--color-ui-shadow',
    displayName: 'Shadow Color',
    type: 'color',
    category: 'colors',
    subcategory: 'UI',
    description: 'Base shadow color',
  },
  {
    name: '--color-ui-white',
    displayName: 'White',
    type: 'color',
    category: 'colors',
    subcategory: 'UI',
    description: 'Pure white (adapts to theme)',
  },
  {
    name: '--color-ui-black',
    displayName: 'Black',
    type: 'color',
    category: 'colors',
    subcategory: 'UI',
    description: 'Pure black (adapts to theme)',
  },
  {
    name: '--color-ui-modal',
    displayName: 'Modal Overlay',
    type: 'color',
    category: 'colors',
    subcategory: 'UI',
    description: 'Modal backdrop overlay',
  },

  // ===== COLORS - TEXT =====
  {
    name: '--color-text-default',
    displayName: 'Default Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Text',
    description: 'Primary text color',
  },
  {
    name: '--color-text-secondary',
    displayName: 'Secondary Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Text',
    description: 'Secondary text color',
  },
  {
    name: '--color-text-tertiary',
    displayName: 'Tertiary Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Text',
    description: 'Tertiary text color',
  },
  {
    name: '--color-text-light',
    displayName: 'Light Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Text',
    description: 'Text on dark backgrounds',
  },
  {
    name: '--color-text-placeholder',
    displayName: 'Placeholder',
    type: 'color',
    category: 'colors',
    subcategory: 'Text',
    description: 'Input placeholder text',
  },
  {
    name: '--color-text-accent',
    displayName: 'Accent Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Text',
    description: 'Accent/link text',
  },

  // ===== COLORS - STATUS =====
  {
    name: '--color-info-default',
    displayName: 'Info',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Info state color',
  },
  {
    name: '--color-info-background',
    displayName: 'Info Background',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Info state background',
  },
  {
    name: '--color-error-default',
    displayName: 'Error',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Error state color',
  },
  {
    name: '--color-error-background',
    displayName: 'Error Background',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Error state background',
  },
  {
    name: '--color-error-hover',
    displayName: 'Error Hover',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Error hover state',
  },
  {
    name: '--color-warning-default',
    displayName: 'Warning',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Warning state color',
  },
  {
    name: '--color-warning-background',
    displayName: 'Warning Background',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Warning state background',
  },
  {
    name: '--color-success-default',
    displayName: 'Success',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Success state color',
  },
  {
    name: '--color-success-background',
    displayName: 'Success Background',
    type: 'color',
    category: 'colors',
    subcategory: 'Status',
    description: 'Success state background',
  },

  // ===== COLORS - TAGS =====
  {
    name: '--color-tag-date-bg',
    displayName: 'Date Tag BG',
    type: 'color',
    category: 'colors',
    subcategory: 'Tags',
    description: 'Date tag background',
  },
  {
    name: '--color-tag-date-text',
    displayName: 'Date Tag Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Tags',
    description: 'Date tag text',
  },
  {
    name: '--color-tag-beta-bg',
    displayName: 'Beta Tag BG',
    type: 'color',
    category: 'colors',
    subcategory: 'Tags',
    description: 'Beta tag background',
  },
  {
    name: '--color-tag-beta-text',
    displayName: 'Beta Tag Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Tags',
    description: 'Beta tag text',
  },
  {
    name: '--color-tag-recommended-bg',
    displayName: 'Recommended Tag BG',
    type: 'color',
    category: 'colors',
    subcategory: 'Tags',
    description: 'Recommended tag background',
  },
  {
    name: '--color-tag-recommended-text',
    displayName: 'Recommended Tag Text',
    type: 'color',
    category: 'colors',
    subcategory: 'Tags',
    description: 'Recommended tag text',
  },

  // ===== VISUAL EFFECTS - SHADOWS =====
  {
    name: '--shadow-sm',
    displayName: 'Shadow Small',
    type: 'shadow',
    category: 'visualEffects',
    subcategory: 'Shadows',
    description: 'Small shadow',
  },
  {
    name: '--shadow-default',
    displayName: 'Shadow Default',
    type: 'shadow',
    category: 'visualEffects',
    subcategory: 'Shadows',
    description: 'Default shadow',
  },
  {
    name: '--shadow-md',
    displayName: 'Shadow Medium',
    type: 'shadow',
    category: 'visualEffects',
    subcategory: 'Shadows',
    description: 'Medium shadow',
  },
  {
    name: '--shadow-lg',
    displayName: 'Shadow Large',
    type: 'shadow',
    category: 'visualEffects',
    subcategory: 'Shadows',
    description: 'Large shadow',
  },
  {
    name: '--shadow-modal',
    displayName: 'Shadow Modal',
    type: 'shadow',
    category: 'visualEffects',
    subcategory: 'Shadows',
    description: 'Modal shadow',
  },
  {
    name: '--shadow-input',
    displayName: 'Shadow Input',
    type: 'shadow',
    category: 'visualEffects',
    subcategory: 'Shadows',
    description: 'Input field shadow',
  },

  // ===== VISUAL EFFECTS - RADIUS =====
  {
    name: '--radius-sm',
    displayName: 'Radius Small',
    type: 'dimension',
    category: 'visualEffects',
    subcategory: 'Border Radius',
    description: 'Small border radius',
    unit: 'rem',
  },
  {
    name: '--radius-default',
    displayName: 'Radius Default',
    type: 'dimension',
    category: 'visualEffects',
    subcategory: 'Border Radius',
    description: 'Default border radius',
    unit: 'rem',
  },
  {
    name: '--radius-md',
    displayName: 'Radius Medium',
    type: 'dimension',
    category: 'visualEffects',
    subcategory: 'Border Radius',
    description: 'Medium border radius',
    unit: 'rem',
  },
  {
    name: '--radius-lg',
    displayName: 'Radius Large',
    type: 'dimension',
    category: 'visualEffects',
    subcategory: 'Border Radius',
    description: 'Large border radius',
    unit: 'rem',
  },
  {
    name: '--radius-xl',
    displayName: 'Radius Extra Large',
    type: 'dimension',
    category: 'visualEffects',
    subcategory: 'Border Radius',
    description: 'Extra large border radius',
    unit: 'rem',
  },
  {
    name: '--radius-full',
    displayName: 'Radius Full',
    type: 'dimension',
    category: 'visualEffects',
    subcategory: 'Border Radius',
    description: 'Full rounded (pill shape)',
    unit: 'px',
  },

  // ===== TYPOGRAPHY - FONT SIZES (BODY) =====
  {
    name: '--font-size-body-xs',
    displayName: 'Body XS',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Body',
    description: 'Extra small body text',
    unit: 'rem',
  },
  {
    name: '--font-size-body-sm',
    displayName: 'Body SM',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Body',
    description: 'Small body text',
    unit: 'rem',
  },
  {
    name: '--font-size-body-md',
    displayName: 'Body MD',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Body',
    description: 'Medium body text',
    unit: 'rem',
  },
  {
    name: '--font-size-body-lg',
    displayName: 'Body LG',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Body',
    description: 'Large body text',
    unit: 'rem',
  },

  // ===== TYPOGRAPHY - FONT SIZES (HEADING) =====
  {
    name: '--font-size-heading-xs',
    displayName: 'Heading XS',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Heading',
    description: 'Extra small heading',
    unit: 'rem',
  },
  {
    name: '--font-size-heading-sm',
    displayName: 'Heading SM',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Heading',
    description: 'Small heading',
    unit: 'rem',
  },
  {
    name: '--font-size-heading-md',
    displayName: 'Heading MD',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Heading',
    description: 'Medium heading',
    unit: 'rem',
  },
  {
    name: '--font-size-heading-lg',
    displayName: 'Heading LG',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Heading',
    description: 'Large heading',
    unit: 'rem',
  },
  {
    name: '--font-size-heading-xl',
    displayName: 'Heading XL',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Heading',
    description: 'Extra large heading',
    unit: 'rem',
  },
  {
    name: '--font-size-heading-2xl',
    displayName: 'Heading 2XL',
    type: 'dimension',
    category: 'typography',
    subcategory: 'Font Sizes - Heading',
    description: 'Double extra large heading',
    unit: 'rem',
  },

  // ===== SPACING =====
  {
    name: '--space-1',
    displayName: 'Space 1',
    type: 'dimension',
    category: 'spacing',
    description: '4px',
    unit: 'rem',
    advanced: true,
  },
  {
    name: '--space-2',
    displayName: 'Space 2',
    type: 'dimension',
    category: 'spacing',
    description: '8px',
    unit: 'rem',
    advanced: true,
  },
  {
    name: '--space-3',
    displayName: 'Space 3',
    type: 'dimension',
    category: 'spacing',
    description: '12px',
    unit: 'rem',
    advanced: true,
  },
  {
    name: '--space-4',
    displayName: 'Space 4',
    type: 'dimension',
    category: 'spacing',
    description: '16px',
    unit: 'rem',
    advanced: true,
  },
  {
    name: '--space-6',
    displayName: 'Space 6',
    type: 'dimension',
    category: 'spacing',
    description: '24px',
    unit: 'rem',
    advanced: true,
  },
  {
    name: '--space-8',
    displayName: 'Space 8',
    type: 'dimension',
    category: 'spacing',
    description: '32px',
    unit: 'rem',
    advanced: true,
  },
  {
    name: '--space-12',
    displayName: 'Space 12',
    type: 'dimension',
    category: 'spacing',
    description: '48px',
    unit: 'rem',
    advanced: true,
  },
  {
    name: '--space-16',
    displayName: 'Space 16',
    type: 'dimension',
    category: 'spacing',
    description: '64px',
    unit: 'rem',
    advanced: true,
  },
];

/**
 * Get tokens by category and subcategory
 */
export function getTokensByCategory(showAdvanced = false) {
  const filtered = showAdvanced 
    ? tokenMetadata 
    : tokenMetadata.filter(t => !t.advanced);

  const grouped: Record<string, Record<string, TokenMetadata[]>> = {};

  filtered.forEach(token => {
    if (!grouped[token.category]) {
      grouped[token.category] = {};
    }
    const subcat = token.subcategory || 'Other';
    if (!grouped[token.category][subcat]) {
      grouped[token.category][subcat] = [];
    }
    grouped[token.category][subcat].push(token);
  });

  return grouped;
}

/**
 * Get token metadata by name
 */
export function getTokenMetadata(name: string): TokenMetadata | undefined {
  return tokenMetadata.find(t => t.name === name);
}

