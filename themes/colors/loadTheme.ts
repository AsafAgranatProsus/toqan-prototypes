/**
 * Dynamic Theme Loader
 * 
 * Loads theme CSS files via <link> elements (not inline style injection).
 * This approach uses static CSS files that are loaded/unloaded cleanly.
 */

const THEME_LINK_ID = 'toqan-custom-theme';
const THEME_STORAGE_KEY = 'toqan-selected-theme';

/**
 * Load a theme CSS file dynamically via <link> element
 * 
 * @param themeFilename - Filename of the theme (e.g., 'test-theme.css')
 * @returns Promise that resolves when theme is loaded
 */
export async function loadThemeCSS(themeFilename: string): Promise<void> {
  // Remove existing theme if any
  unloadThemeCSS();
  
  // Empty filename means use default (no custom theme)
  if (!themeFilename) {
    localStorage.removeItem(THEME_STORAGE_KEY);
    console.log('[ThemeLoader] Using default theme');
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.id = THEME_LINK_ID;
    link.rel = 'stylesheet';
    // Theme files are served from /themes/ path (mapped to themes/colors/ in dev)
    link.href = `/themes/${themeFilename}`;
    
    link.onload = () => {
      localStorage.setItem(THEME_STORAGE_KEY, themeFilename);
      console.log(`[ThemeLoader] Theme loaded: ${themeFilename}`);
      resolve();
    };
    
    link.onerror = () => {
      console.error(`[ThemeLoader] Failed to load theme: ${themeFilename}`);
      reject(new Error(`Failed to load theme: ${themeFilename}`));
    };
    
    // Insert AFTER all other stylesheets to ensure highest specificity
    document.head.appendChild(link);
  });
}

/**
 * Unload the currently loaded custom theme (reverts to default)
 */
export function unloadThemeCSS(): void {
  const existingLink = document.getElementById(THEME_LINK_ID);
  if (existingLink) {
    existingLink.remove();
    console.log('[ThemeLoader] Custom theme unloaded');
  }
}

/**
 * Check if a custom theme is currently loaded
 */
export function isThemeLoaded(): boolean {
  return document.getElementById(THEME_LINK_ID) !== null;
}

/**
 * Get the currently loaded theme filename
 */
export function getCurrentThemeFilename(): string | null {
  return localStorage.getItem(THEME_STORAGE_KEY);
}

/**
 * Initialize theme from localStorage on app start
 */
export function initializeTheme(): void {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    loadThemeCSS(savedTheme).catch(err => {
      console.warn('[ThemeLoader] Failed to restore saved theme:', err);
      localStorage.removeItem(THEME_STORAGE_KEY);
    });
  }
}

