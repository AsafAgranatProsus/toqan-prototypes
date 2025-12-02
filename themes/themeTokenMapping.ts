/**
 * Theme Token Mapping
 * 
 * This file maps primitive --color-* tokens to semantic --theme-* tokens.
 * When the customization panel modifies a --color-* token, all dependent
 * --theme-* tokens are automatically updated to maintain consistency.
 * 
 * Architecture:
 * - --color-* tokens = Primitive layer (actual color values)
 * - --theme-* tokens = Semantic layer (references to --color-* tokens)
 * 
 * This mapping is extracted from tokens.css lines 348-385 (LEGACY SUPPORT section)
 */

/**
 * Maps each --color-* token to all --theme-* tokens that reference it
 * 
 * This is the COMPLETE mapping for full semantic token coverage.
 * When a --color-* token is modified, all dependent --theme-* tokens update automatically.
 */
export const colorToThemeMapping: Record<string, string[]> = {
  // ===== UI BACKGROUND COLORS =====
  '--color-ui-background': [
    '--theme-bg-app',
    '--theme-bg-main',
    '--theme-surface-default',
  ],
  
  '--color-ui-background-elevated': [
    '--theme-bg-app-lighter',
    '--theme-bg-sidebar',
    '--theme-bg-sidebar-mobile',
    '--theme-bg-input',
    '--theme-bg-menu',
    '--theme-surface-elevated',
    '--theme-btn-icon-bg',
  ],
  
  '--color-ui-active': [
    '--theme-bg-item-selected',
    '--theme-surface-active',
    '--theme-scrollbar-thumb-hover',
    '--theme-btn-icon-bg-hover',
    '--theme-btn-outline-bg-hover',
  ],
  
  '--color-ui-border': [
    '--theme-border',
    '--theme-scrollbar-thumb',
    '--theme-btn-icon-border',
    '--theme-btn-outline-border',
  ],
  
  // ===== TEXT COLORS =====
  '--color-text-default': [
    '--theme-text-main',
    '--theme-btn-icon-text-hover',
  ],
  
  '--color-text-secondary': [
    '--theme-text-secondary',
    '--theme-btn-icon-text',
    '--theme-btn-outline-text',
  ],
  
  '--color-text-tertiary': [
    '--theme-text-tertiary',
  ],
  
  '--color-text-light': [
    '--theme-text-light',
    '--theme-text-selection',
  ],
  
  // ===== BUTTON TEXT COLORS =====
  '--color-btn-primary-text': [
    '--theme-btn-primary-text',
  ],
  
  '--color-btn-secondary-text': [
    '--theme-btn-secondary-text',
  ],
  
  '--color-btn-tertiary-text': [
    '--theme-btn-tertiary-text',
  ],
  
  // ===== PRIMARY COLORS =====
  '--color-primary-default': [
    '--theme-btn-primary-bg',
    '--theme-selection-bg',
    '--theme-focus-ring',
    '--theme-link-default',
    '--theme-accent-primary',
  ],
  
  '--color-primary-hover': [
    '--theme-btn-primary-bg-hover',
    '--theme-link-hover',
  ],
  
  '--color-primary-light': [
    '--theme-accent-primary-light',
  ],
  
  '--color-primary-background': [
    '--theme-accent-primary-bg',
  ],
  
  // ===== SECONDARY COLORS =====
  '--color-secondary-default': [
    '--theme-accent-secondary',
    '--theme-btn-secondary-bg',
  ],
  
  '--color-secondary-hover': [
    '--theme-btn-secondary-bg-hover',
  ],
  
  '--color-secondary-light': [
    '--theme-accent-secondary-light',
  ],
  
  '--color-secondary-background': [
    '--theme-accent-secondary-bg',
  ],
  
  // ===== TERTIARY COLORS =====
  '--color-tertiary-default': [
    '--theme-accent-tertiary',
    '--theme-btn-tertiary-bg',
  ],
  
  '--color-tertiary-hover': [
    '--theme-btn-tertiary-bg-hover',
  ],
  
  '--color-tertiary-light': [
    '--theme-accent-tertiary-light',
  ],
  
  '--color-tertiary-background': [
    '--theme-accent-tertiary-bg',
  ],
  
  // ===== STATUS COLORS - INFO =====
  '--color-info-default': [
    '--theme-status-info-text',
    '--theme-status-info-border',
  ],
  
  '--color-info-background': [
    '--theme-status-info-bg',
  ],
  
  // ===== STATUS COLORS - SUCCESS =====
  '--color-success-default': [
    '--theme-status-success-text',
    '--theme-status-success-border',
  ],
  
  '--color-success-background': [
    '--theme-status-success-bg',
  ],
  
  // ===== STATUS COLORS - WARNING =====
  '--color-warning-default': [
    '--theme-status-warning-text',
    '--theme-status-warning-border',
  ],
  
  '--color-warning-background': [
    '--theme-status-warning-bg',
  ],
  
  // ===== STATUS COLORS - ERROR =====
  '--color-error-default': [
    '--theme-status-error-text',
    '--theme-status-error-border',
  ],
  
  '--color-error-background': [
    '--theme-status-error-bg',
  ],
  
  // ===== TAG COLORS =====
  '--color-tag-date-bg': [
    '--theme-tag-date-bg',
  ],
  
  '--color-tag-date-text': [
    '--theme-tag-date-text',
  ],
  
  '--color-tag-beta-bg': [
    '--theme-tag-beta-bg',
  ],
  
  '--color-tag-beta-text': [
    '--theme-tag-beta-text',
  ],
  
  '--color-tag-recommended-bg': [
    '--theme-tag-recommended-bg',
  ],
  
  '--color-tag-recommended-text': [
    '--theme-tag-recommended-text',
  ],
};

/**
 * Get all --theme-* tokens that depend on a given --color-* token
 */
export function getDependentThemeTokens(colorToken: string): string[] {
  return colorToThemeMapping[colorToken] || [];
}

/**
 * Get all --color-* tokens that have --theme-* dependencies
 */
export function getColorTokensWithDependencies(): string[] {
  return Object.keys(colorToThemeMapping);
}

/**
 * Check if a token is a primitive --color-* token
 */
export function isColorToken(token: string): boolean {
  return token.startsWith('--color-');
}

/**
 * Check if a token is a semantic --theme-* token
 */
export function isThemeToken(token: string): boolean {
  return token.startsWith('--theme-');
}

