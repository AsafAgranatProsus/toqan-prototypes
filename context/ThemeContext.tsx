import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Theme, themes } from '../theme';
import { useFeatureFlags } from './FeatureFlagContext';

const THEME_STORAGE_KEY = 'toqan-theme';

interface ThemeContextType {
  theme: Theme;
  themeName: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (themeName: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (theme: Theme, newBranding: boolean) => {
  const root = document.documentElement;
  const themeColors = theme.colors;
  
  const toKebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

  Object.entries(themeColors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      root.style.setProperty(`--theme-${toKebabCase(key)}`, value);
    }
  });

  // Note: DesignSystemContext handles the .new-branding class on HTML
  // This legacy code remains for backward compatibility but may not be needed
  document.body.classList.toggle('theme-dark', theme.name === 'dark');
  document.body.classList.toggle('theme-light', theme.name === 'light');
};

const getStoredTheme = (): 'light' | 'dark' | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  return null;
};

const saveTheme = (themeName: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { flags } = useFeatureFlags();
  
  // Initialize theme from localStorage or default to light
  const [themeName, setThemeNameState] = useState<'light' | 'dark'>(() => {
    const stored = getStoredTheme();
    return stored || 'light';
  });

  const theme = themes[themeName];
  
  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme, flags.enableNewBranding);
  }, [theme, flags.enableNewBranding]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    saveTheme(themeName);
  }, [themeName]);

  const setTheme = useCallback((newThemeName: 'light' | 'dark') => {
    setThemeNameState(newThemeName);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeNameState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({ 
    theme, 
    themeName, 
    toggleTheme, 
    setTheme 
  }), [theme, themeName, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};