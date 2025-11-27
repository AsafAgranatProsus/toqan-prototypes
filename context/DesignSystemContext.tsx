import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useFeatureFlags } from './FeatureFlagContext';

const THEME_STORAGE_KEY = 'toqan-theme-mode';

type DesignSystem = 'old' | 'new';
type ThemeMode = 'light' | 'dark';

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
 * Apply both design system and theme mode to DOM
 */
const applyDesignAndTheme = (designSystem: DesignSystem, themeMode: ThemeMode) => {
  // Apply classes to documentElement (html) instead of body
  // This is crucial because CSS custom properties are defined on :root (html element)
  const root = document.documentElement;
  
  // Apply design system class
  root.classList.toggle('design-new', designSystem === 'new');
  root.classList.toggle('design-old', designSystem === 'old');
  
  // Apply theme mode class
  root.classList.toggle('theme-dark', themeMode === 'dark');
  root.classList.toggle('theme-light', themeMode === 'light');
  
  // Legacy support - keep these for backwards compatibility
  root.classList.toggle('new-branding', designSystem === 'new');
  root.classList.toggle('old-toqan', designSystem === 'old');
  
  // ALSO apply to body for any body-specific selectors
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
  
  // Apply design system and theme whenever they change
  useEffect(() => {
    applyDesignAndTheme(designSystem, themeMode);
  }, [designSystem, themeMode]);
  
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

