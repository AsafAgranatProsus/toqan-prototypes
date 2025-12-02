/**
 * Base Theme Definitions
 * These are the foundation themes that custom themes inherit from
 * Each theme contains light and dark mode variants
 */

export interface BaseTheme {
  id: string;
  name: string;
  description: string;
  light: Record<string, string>;  // CSS variable name -> value
  dark: Record<string, string>;   // CSS variable name -> value (empty if no dark mode)
}

/**
 * Default OLD Design System Theme
 * Based on current mockup - light mode only
 */
export const defaultOldTheme: BaseTheme = {
  id: 'default-old',
  name: 'Default OLD',
  description: 'Original design system (light only)',
  light: {
    // Primary Colors
    '--color-primary-default': '#4426d9',
    '--color-primary-hover': '#361fad',
    '--color-primary-background': 'rgba(68, 38, 217, 0.2)',
    '--color-primary-light': '#E0E7FF',
    
    // Secondary Colors
    '--color-secondary-default': '#6366F1',
    '--color-secondary-hover': '#4F46E5',
    '--color-secondary-background': 'rgba(99, 102, 241, 0.15)',
    '--color-secondary-light': '#E0E7FF',
    
    // Tertiary Colors
    '--color-tertiary-default': '#EC4899',
    '--color-tertiary-hover': '#DB2777',
    '--color-tertiary-background': 'rgba(236, 72, 153, 0.15)',
    '--color-tertiary-light': '#FCE7F3',
    
    // Button Text Colors
    '--color-btn-primary-text': '#FFFFFF',
    '--color-btn-secondary-text': '#FFFFFF',
    '--color-btn-tertiary-text': '#FFFFFF',
    
    // UI Colors
    '--color-ui-background': '#F9FAFB',
    '--color-ui-background-elevated': '#FFFFFF',
    '--color-ui-border': '#c8d8ea',
    '--color-ui-active': '#e9eff7',
    '--color-ui-shadow': 'rgba(112, 144, 176, 0.2)',
    '--color-ui-white': '#FFFFFF',
    '--color-ui-black': '#000000',
    '--color-ui-modal': 'rgba(17, 24, 39, 0.15)',
    
    // Text Colors
    '--color-text-default': '#111827',
    '--color-text-secondary': '#374151',
    '--color-text-tertiary': '#6B7280',
    '--color-text-light': '#FFFFFF',
    '--color-text-placeholder': '#9CA3AF',
    '--color-text-accent': '#4F46E5',
    
    // Status Colors
    '--color-info-default': '#4F46E5',
    '--color-info-background': '#E0E7FF',
    '--color-error-default': '#DC2626',
    '--color-error-background': '#FEE2E2',
    '--color-error-hover': '#B91C1C',
    '--color-warning-default': '#D97706',
    '--color-warning-background': '#FEF3C7',
    '--color-success-default': '#059669',
    '--color-success-background': '#D1FAE5',
    
    // Tag Colors
    '--color-tag-date-bg': 'rgba(68, 38, 217, 0.2)',
    '--color-tag-date-text': 'rgb(68, 38, 217)',
    '--color-tag-beta-bg': '#E0E7FF',
    '--color-tag-beta-text': '#3730A3',
    '--color-tag-recommended-bg': '#EDE9FE',
    '--color-tag-recommended-text': '#5B21B6',

    // Border Radius
    '--radius-sm': '0.25rem',
    '--radius-default': '0.5rem',
    '--radius-md': '0.75rem',
    '--radius-lg': '1rem',
    '--radius-xl': '2rem',
    '--radius-full': '9999px',

    // Shadows
    '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    '--shadow-default': '0 2px 4px rgba(112, 144, 176, 0.2)',
    '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.05)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '--shadow-modal': '0 4px 8px rgba(0, 0, 0, 0.1)',
    '--shadow-input': '0 2px 4px rgba(0, 0, 0, 0.1)',

    // Typography
    '--font-size-body-xs': '0.75rem',
    '--font-size-body-sm': '0.875rem',
    '--font-size-body-md': '1rem',
    '--font-size-body-lg': '1.125rem',
    '--font-size-heading-xs': '1rem',
    '--font-size-heading-sm': '1.333rem',
    '--font-size-heading-md': '1.777rem',
    '--font-size-heading-lg': '2.369rem',
    '--font-size-heading-xl': '3.157rem',
    '--font-size-heading-2xl': '4.209rem',
  },
  dark: {
    // OLD design dark mode - matches tokens.css .theme-dark:not(.design-new)
    
    // Primary Colors
    '--color-primary-default': '#5B8FFF',
    '--color-primary-hover': '#7BA5FF',
    '--color-primary-background': 'rgba(91, 143, 255, 0.15)',
    '--color-primary-light': '#C7D2FE',
    
    // Secondary Colors
    '--color-secondary-default': '#818CF8',
    '--color-secondary-hover': '#A5B4FC',
    '--color-secondary-background': 'rgba(129, 140, 248, 0.15)',
    '--color-secondary-light': '#312E81',
    
    // Tertiary Colors
    '--color-tertiary-default': '#F472B6',
    '--color-tertiary-hover': '#F9A8D4',
    '--color-tertiary-background': 'rgba(244, 114, 182, 0.15)',
    '--color-tertiary-light': '#831843',
    
    // Button Text Colors
    '--color-btn-primary-text': '#FFFFFF',
    '--color-btn-secondary-text': '#FFFFFF',
    '--color-btn-tertiary-text': '#FFFFFF',
    
    // UI Colors
    '--color-ui-background': '#0A0A0B',
    '--color-ui-background-elevated': '#141416',
    '--color-ui-border': '#2A2A2D',
    '--color-ui-active': '#252528',
    '--color-ui-shadow': 'rgba(0, 0, 0, 0.4)',
    '--color-ui-white': '#1E1E20',
    '--color-ui-black': '#FFFFFF',
    '--color-ui-modal': 'rgba(0, 0, 0, 0.5)',
    
    // Text Colors
    '--color-text-default': '#F5F5F7',
    '--color-text-secondary': '#D1D1D6',
    '--color-text-tertiary': '#8E8E93',
    '--color-text-light': '#FFFFFF',
    '--color-text-placeholder': '#6B6B70',
    '--color-text-accent': '#5B8FFF',
    
    // Status Colors
    '--color-info-default': '#5B8FFF',
    '--color-info-background': 'rgba(91, 143, 255, 0.15)',
    '--color-error-default': '#FF5555',
    '--color-error-background': 'rgba(255, 85, 85, 0.15)',
    '--color-error-hover': '#FF7070',
    '--color-warning-default': '#FFB020',
    '--color-warning-background': 'rgba(255, 176, 32, 0.15)',
    '--color-success-default': '#55D98A',
    '--color-success-background': 'rgba(85, 217, 138, 0.15)',
    
    // Tag Colors
    '--color-tag-date-bg': 'rgba(91, 143, 255, 0.15)',
    '--color-tag-date-text': '#5B8FFF',
    '--color-tag-beta-bg': 'rgba(91, 143, 255, 0.15)',
    '--color-tag-beta-text': '#5B8FFF',
    '--color-tag-recommended-bg': 'rgba(175, 82, 222, 0.15)',
    '--color-tag-recommended-text': '#AF52DE',

    // Border Radius (same as light)
    '--radius-sm': '0.25rem',
    '--radius-default': '0.5rem',
    '--radius-md': '0.75rem',
    '--radius-lg': '1rem',
    '--radius-xl': '2rem',
    '--radius-full': '9999px',

    // Shadows (darker for dark mode)
    '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
    '--shadow-default': '0 2px 4px rgba(0, 0, 0, 0.5)',
    '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.4)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    '--shadow-modal': '0 4px 8px rgba(0, 0, 0, 0.6)',
    '--shadow-input': '0 2px 4px rgba(0, 0, 0, 0.4)',

    // Typography (same as light)
    '--font-size-body-xs': '0.75rem',
    '--font-size-body-sm': '0.875rem',
    '--font-size-body-md': '1rem',
    '--font-size-body-lg': '1.125rem',
    '--font-size-heading-xs': '1rem',
    '--font-size-heading-sm': '1.333rem',
    '--font-size-heading-md': '1.777rem',
    '--font-size-heading-lg': '2.369rem',
    '--font-size-heading-xl': '3.157rem',
    '--font-size-heading-2xl': '4.209rem',
  },
};

/**
 * Default NEW Design System Theme
 * Based on live Toqan tokens - includes dark mode
 */
export const defaultNewTheme: BaseTheme = {
  id: 'default-new',
  name: 'Default NEW',
  description: 'New design system (light + dark)',
  light: {
    // Primary Colors
    '--color-primary-default': 'hsl(250 70% 50%)',
    '--color-primary-hover': 'hsl(250 70% 40%)',
    '--color-primary-background': 'hsl(250 70% 50% / 0.2)',
    '--color-primary-light': 'hsl(250 70% 90%)',
    
    // Secondary Colors
    '--color-secondary-default': 'hsl(220 70% 50%)',
    '--color-secondary-hover': 'hsl(220 70% 40%)',
    '--color-secondary-background': 'hsl(220 70% 50% / 0.15)',
    '--color-secondary-light': 'hsl(220 70% 90%)',
    
    // Tertiary Colors
    '--color-tertiary-default': 'hsl(330 70% 50%)',
    '--color-tertiary-hover': 'hsl(330 70% 40%)',
    '--color-tertiary-background': 'hsl(330 70% 50% / 0.15)',
    '--color-tertiary-light': 'hsl(330 70% 90%)',
    
    // Button Text Colors
    '--color-btn-primary-text': 'hsl(0 0% 100%)',
    '--color-btn-secondary-text': 'hsl(0 0% 100%)',
    '--color-btn-tertiary-text': 'hsl(0 0% 100%)',
    
    // UI Colors
    '--color-ui-background': 'hsl(212 45% 98%)',
    '--color-ui-background-elevated': 'hsl(0 0% 100%)',
    '--color-ui-border': 'hsl(212 45% 85%)',
    '--color-ui-active': 'hsl(212 45% 94%)',
    '--color-ui-shadow': 'hsl(212 45% 50% / 0.20)',
    '--color-ui-white': 'hsl(0 0% 100%)',
    '--color-ui-black': 'hsl(0 0% 0%)',
    '--color-ui-modal': 'hsl(212 69% 10% / 0.15)',
    
    // Text Colors
    '--color-text-default': 'hsl(212 45% 20%)',
    '--color-text-secondary': 'hsl(212 20% 40%)',
    '--color-text-tertiary': 'hsl(212 20% 50%)',
    '--color-text-light': 'hsl(0 0% 100%)',
    '--color-text-placeholder': 'hsl(212 20% 70%)',
    '--color-text-accent': 'hsl(250 70% 50%)',
    
    // Status Colors
    '--color-info-default': 'hsl(226 55% 50%)',
    '--color-info-background': 'hsl(224 71% 97%)',
    '--color-error-default': 'hsl(3 77% 54%)',
    '--color-error-background': 'hsl(3 76% 90%)',
    '--color-error-hover': 'hsl(3 77% 44%)',
    '--color-warning-default': 'hsl(46 92% 41%)',
    '--color-warning-background': 'hsl(46 100% 58% / 0.19)',
    '--color-success-default': 'hsl(131 62% 44%)',
    '--color-success-background': 'hsl(131 70% 58% / 0.19)',
    
    // Tag Colors
    '--color-tag-date-bg': 'hsl(250 70% 50% / 0.2)',
    '--color-tag-date-text': 'hsl(250 70% 50%)',
    '--color-tag-beta-bg': 'hsl(224 71% 97%)',
    '--color-tag-beta-text': 'hsl(226 55% 50%)',
    '--color-tag-recommended-bg': 'hsl(260 60% 95%)',
    '--color-tag-recommended-text': 'hsl(260 60% 40%)',

    // Border Radius
    '--radius-sm': '0.25rem',
    '--radius-default': '0.5rem',
    '--radius-md': '0.75rem',
    '--radius-lg': '1rem',
    '--radius-xl': '2rem',
    '--radius-full': '9999px',

    // Shadows
    '--shadow-sm': '0 1px 0.125rem 0 hsl(212 45% 50% / 0.20)',
    '--shadow-default': '0 0.125rem 0.25rem 0 hsl(212 45% 50% / 0.20)',
    '--shadow-md': '0 4px 12px hsl(212 45% 50% / 0.1)',
    '--shadow-lg': '0 10px 15px -3px hsl(212 45% 50% / 0.15)',
    '--shadow-modal': '0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.1)',
    '--shadow-input': '0 0.125rem 0.25rem 0 hsl(212 45% 50% / 0.20)',

    // Typography (same as OLD)
    '--font-size-body-xs': '0.75rem',
    '--font-size-body-sm': '0.875rem',
    '--font-size-body-md': '1rem',
    '--font-size-body-lg': '1.125rem',
    '--font-size-heading-xs': '1rem',
    '--font-size-heading-sm': '1.333rem',
    '--font-size-heading-md': '1.777rem',
    '--font-size-heading-lg': '2.369rem',
    '--font-size-heading-xl': '3.157rem',
    '--font-size-heading-2xl': '4.209rem',
  },
  dark: {
    // Primary Colors
    '--color-primary-default': 'hsl(250 70% 60%)',
    '--color-primary-hover': 'hsl(250 70% 70%)',
    '--color-primary-background': 'hsl(250 70% 60% / 0.2)',
    
    // Secondary Colors
    '--color-secondary-default': 'hsl(220 70% 60%)',
    '--color-secondary-hover': 'hsl(220 70% 70%)',
    '--color-secondary-background': 'hsl(220 70% 60% / 0.15)',
    '--color-secondary-light': 'hsl(220 70% 25%)',
    
    // Tertiary Colors
    '--color-tertiary-default': 'hsl(330 70% 60%)',
    '--color-tertiary-hover': 'hsl(330 70% 70%)',
    '--color-tertiary-background': 'hsl(330 70% 60% / 0.15)',
    '--color-tertiary-light': 'hsl(330 70% 25%)',
    
    // Button Text Colors
    '--color-btn-primary-text': 'hsl(0 0% 100%)',
    '--color-btn-secondary-text': 'hsl(0 0% 100%)',
    '--color-btn-tertiary-text': 'hsl(0 0% 100%)',
    
    // UI Colors
    '--color-ui-background': 'hsl(212 45% 8%)',
    '--color-ui-background-elevated': 'hsl(212 45% 12%)',
    '--color-ui-border': 'hsl(212 45% 20%)',
    '--color-ui-active': 'hsl(212 45% 15%)',
    '--color-ui-shadow': 'hsl(0 0% 0% / 0.4)',
    '--color-ui-white': 'hsl(212 45% 10%)',
    '--color-ui-black': 'hsl(0 0% 100%)',
    '--color-ui-modal': 'hsl(0 0% 0% / 0.5)',
    
    // Text Colors
    '--color-text-default': 'hsl(212 45% 95%)',
    '--color-text-secondary': 'hsl(212 20% 80%)',
    '--color-text-tertiary': 'hsl(212 20% 70%)',
    '--color-text-light': 'hsl(0 0% 100%)',
    '--color-text-placeholder': 'hsl(212 20% 50%)',
    '--color-text-accent': 'hsl(250 70% 60%)',
    
    // Status Colors
    '--color-info-default': 'hsl(226 55% 60%)',
    '--color-info-background': 'hsl(224 71% 20%)',
    '--color-error-default': 'hsl(3 77% 60%)',
    '--color-error-background': 'hsl(3 76% 20%)',
    '--color-error-hover': 'hsl(3 77% 70%)',
    '--color-warning-default': 'hsl(46 92% 55%)',
    '--color-warning-background': 'hsl(46 100% 58% / 0.2)',
    '--color-success-default': 'hsl(131 62% 55%)',
    '--color-success-background': 'hsl(131 70% 58% / 0.2)',
    
    // Tag Colors
    '--color-tag-date-bg': 'hsl(250 70% 60% / 0.2)',
    '--color-tag-date-text': 'hsl(250 70% 60%)',
    '--color-tag-beta-bg': 'hsl(224 71% 20%)',
    '--color-tag-beta-text': 'hsl(226 55% 60%)',
    '--color-tag-recommended-bg': 'hsl(260 60% 20%)',
    '--color-tag-recommended-text': 'hsl(260 60% 70%)',
    
    // Shadows (adjusted for dark mode)
    '--shadow-sm': '0 1px 0.125rem 0 rgba(0, 0, 0, 0.3)',
    '--shadow-default': '0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.4)',
    '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.4)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  },
};

/**
 * All available base themes
 */
export const baseThemes: Record<string, BaseTheme> = {
  'default-old': defaultOldTheme,
  'default-new': defaultNewTheme,
};

/**
 * Get a base theme by ID
 */
export function getBaseTheme(id: string): BaseTheme | undefined {
  return baseThemes[id];
}

/**
 * Get all base theme IDs
 */
export function getBaseThemeIds(): string[] {
  return Object.keys(baseThemes);
}

