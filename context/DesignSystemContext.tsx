import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useFeatureFlags } from './FeatureFlagContext';

const THEME_STORAGE_KEY = 'toqan-theme-mode';

type DesignSystem = 'old' | 'new';
type ThemeMode = 'light' | 'dark';

// Helper to convert camelCase to kebab-case
const toKebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

interface DesignSystemContextType {
  // Design System Selection
  designSystem: DesignSystem;
  
  // Theme Mode (light/dark)
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  
  // Combined state helpers
  isDark: boolean;
  isNewDesign: boolean;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

/**
 * Apply design system, theme mode, and all feature flags to DOM
 * All classes are applied to HTML element for consistent CSS coupling
 */
const applyDesignAndTheme = (designSystem: DesignSystem, themeMode: ThemeMode, flags: any) => {
  // Apply classes to documentElement (html) for CSS custom properties and feature coupling
  const root = document.documentElement;
  
  // Apply prototype mode class (master safety switch)
  // Pattern: .new-branding.new-feature { } requires BOTH classes on HTML
  root.classList.toggle('new-branding', designSystem === 'new');
  
  // Apply ALL feature flags as classes to HTML element
  // This enables the coupling pattern: .new-branding.new-feature { }
  for (const flag in flags) {
    const className = toKebabCase(flag);
    root.classList.toggle(className, flags[flag as keyof typeof flags]);
  }
  
  // Apply theme mode class
  root.classList.toggle('theme-dark', themeMode === 'dark');
  root.classList.toggle('theme-light', themeMode === 'light');
  
  // ALSO apply theme to body for any body-specific selectors
  document.body.classList.toggle('theme-dark', themeMode === 'dark');
  document.body.classList.toggle('theme-light', themeMode === 'light');
};

/**
 * Get stored theme mode from localStorage and URL query parameters
 */
const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  
  // 1. Check URL query parameter first (highest priority)
  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');
  if (themeParam === 'dark' || themeParam === 'light') {
    return themeParam;
  }
  
  // 2. Check localStorage
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme mode from localStorage:', error);
  }
  
  // 3. Check system preference as fallback
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

/**
 * Save theme mode to localStorage
 */
const saveThemeMode = (mode: ThemeMode): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    console.warn('Failed to save theme mode to localStorage:', error);
  }
};

/**
 * Provider component that manages both design system and theme mode
 */
export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { flags } = useFeatureFlags();
  
  // Theme mode is user preference (stored in localStorage)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getStoredThemeMode());
  
  // Design system is controlled by feature flag
  const designSystem: DesignSystem = flags.newBranding ? 'new' : 'old';
  
  // Clean URL after loading theme from query parameter (optional, handled by FeatureFlagContext)
  // Note: URL cleaning is centrally managed in FeatureFlagContext to avoid conflicts
  
  // Apply design system, theme, and all feature flags whenever they change
  useEffect(() => {
    applyDesignAndTheme(designSystem, themeMode, flags);
  }, [designSystem, themeMode, flags]);
  
  // Save theme mode to localStorage when it changes
  useEffect(() => {
    saveThemeMode(themeMode);
  }, [themeMode]);
  
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);
  
  const toggleTheme = useCallback(() => {
    setThemeModeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const value = useMemo<DesignSystemContextType>(() => ({
    designSystem,
    themeMode,
    toggleTheme,
    setThemeMode,
    isDark: themeMode === 'dark',
    isNewDesign: designSystem === 'new',
  }), [designSystem, themeMode, toggleTheme, setThemeMode]);
  
  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
};

/**
 * Hook to access design system and theme context
 */
export const useDesignSystem = (): DesignSystemContextType => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useTheme = useDesignSystem;

