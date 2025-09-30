import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Theme, themes } from '../theme';
import { useFeatureFlags } from './FeatureFlagContext';

interface ThemeContextType {
  theme: Theme;
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

  document.body.classList.toggle('new-branding', newBranding);
  document.body.classList.toggle('old-toqan', !newBranding);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { flags } = useFeatureFlags();
  
  const theme = flags.enableNewBranding ? themes.dark : themes.light;
  
  useEffect(() => {
    applyTheme(theme, flags.enableNewBranding);
  }, [theme, flags.enableNewBranding]);

  const value = useMemo(() => ({ theme }), [theme]);

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