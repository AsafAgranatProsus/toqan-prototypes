import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { baseThemes, getBaseTheme, type BaseTheme } from '../themes/baseThemes';
import { useDesignSystem } from './DesignSystemContext';
import { getDependentThemeTokens, isColorToken } from '../themes/themeTokenMapping';

/**
 * Custom Theme Definition
 * Stores only overrides from a base theme
 */
export interface CustomTheme {
  id: string;
  name: string;
  baseThemeId: string;
  lightOverrides: Record<string, string>;
  darkOverrides: Record<string, string>;
  createdAt: string;
}

interface ThemeCustomizationContextType {
  // Current state
  activeTheme: CustomTheme | null;
  baseTheme: BaseTheme | null;
  isCustomized: boolean;
  
  // Actions
  setTokenValue: (tokenName: string, value: string, mode: 'light' | 'dark') => void;
  resetToBase: () => void;
  switchBaseTheme: (baseThemeId: string) => void;
  saveAsCustomTheme: (name: string) => void;
  loadCustomTheme: (themeId: string) => void;
  deleteCustomTheme: (themeId: string) => void;
  exportTheme: () => string;
  importTheme: (json: string) => boolean;
  
  // Custom themes management
  customThemes: CustomTheme[];
  
  // Current resolved values (base + overrides)
  getCurrentTokenValue: (tokenName: string) => string | undefined;
}

const ThemeCustomizationContext = createContext<ThemeCustomizationContextType | undefined>(undefined);

const STORAGE_KEY_ACTIVE_THEME = 'toqan-active-theme';
const STORAGE_KEY_CUSTOM_THEMES = 'toqan-custom-themes';

/**
 * Load active theme from localStorage
 */
function loadActiveTheme(): CustomTheme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_THEME);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load active theme:', error);
  }
  return null;
}

/**
 * Save active theme to localStorage
 */
function saveActiveTheme(theme: CustomTheme | null) {
  try {
    if (theme) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_THEME, JSON.stringify(theme));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_THEME);
    }
  } catch (error) {
    console.error('Failed to save active theme:', error);
  }
}

/**
 * Load custom themes from localStorage
 */
function loadCustomThemes(): CustomTheme[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_THEMES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load custom themes:', error);
  }
  return [];
}

/**
 * Save custom themes to localStorage
 */
function saveCustomThemes(themes: CustomTheme[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_THEMES, JSON.stringify(themes));
  } catch (error) {
    console.error('Failed to save custom themes:', error);
  }
}

/**
 * Remove ALL inline style properties from documentElement
 * This ensures CSS stylesheets (like imported themes) take precedence
 */
function clearAllInlineStyles() {
  const root = document.documentElement;
  // Get all inline style properties and remove them
  const style = root.style;
  const propsToRemove: string[] = [];
  
  for (let i = 0; i < style.length; i++) {
    const prop = style[i];
    // Only remove CSS custom properties (--*)
    if (prop.startsWith('--')) {
      propsToRemove.push(prop);
    }
  }
  
  propsToRemove.forEach(prop => {
    root.style.removeProperty(prop);
  });
  
  console.log(`[ThemeCustomization] Cleared ${propsToRemove.length} inline CSS properties`);
}

/**
 * Apply CSS variables to the DOM
 * 
 * This function applies both --color-* (primitive) and --theme-* (semantic) tokens
 * to ensure all components update, regardless of which token system they use.
 * 
 * When a --color-* token is set, all --theme-* tokens that reference it are also
 * updated automatically, maintaining consistency across the entire design system.
 * 
 * IMPORTANT: Only apply if there are customizations, otherwise let the theme classes work
 */
function applyCSSVariables(variables: Record<string, string>, hasCustomizations: boolean) {
  if (!hasCustomizations) {
    // No customizations - clear ALL inline CSS custom properties
    // This ensures imported CSS themes take precedence
    clearAllInlineStyles();
    return;
  }
  
  // Has customizations - apply them
  Object.entries(variables).forEach(([name, value]) => {
    if (value) {
      // Always apply the --color-* token
      document.documentElement.style.setProperty(name, value);
      
      // If this is a --color-* token, also update all dependent --theme-* tokens
      if (isColorToken(name)) {
        const dependentTokens = getDependentThemeTokens(name);
        dependentTokens.forEach(themeToken => {
          document.documentElement.style.setProperty(themeToken, value);
        });
      }
    }
  });
}

/**
 * Provider component
 */
export const ThemeCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { themeMode, designSystem } = useDesignSystem();
  
  // State
  const [activeTheme, setActiveTheme] = useState<CustomTheme | null>(() => loadActiveTheme());
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => loadCustomThemes());
  
  // Determine the base theme based on design system
  const defaultBaseThemeId = designSystem === 'new' ? 'default-new' : 'default-old';
  const baseTheme = useMemo(() => {
    const baseId = activeTheme?.baseThemeId || defaultBaseThemeId;
    return getBaseTheme(baseId) || baseThemes['default-new'];
  }, [activeTheme?.baseThemeId, defaultBaseThemeId]);
  
  // Check if theme is customized
  const isCustomized = useMemo(() => {
    if (!activeTheme) return false;
    return Object.keys(activeTheme.lightOverrides).length > 0 || 
           Object.keys(activeTheme.darkOverrides).length > 0;
  }, [activeTheme]);
  
  // Get current resolved token values (base + overrides for current mode)
  const resolvedTokens = useMemo(() => {
    const base = themeMode === 'dark' ? baseTheme.dark : baseTheme.light;
    const overrides = themeMode === 'dark' 
      ? (activeTheme?.darkOverrides || {}) 
      : (activeTheme?.lightOverrides || {});
    
    // If dark mode is empty (like OLD design), fallback to light mode
    const hasBaseDarkTokens = Object.keys(base).length > 0;
    const effectiveBase = (themeMode === 'dark' && !hasBaseDarkTokens) 
      ? baseTheme.light 
      : base;
    
    return { ...effectiveBase, ...overrides };
  }, [baseTheme, activeTheme, themeMode]);
  
  // On mount, clear any stale inline styles if no customizations
  // This ensures imported CSS themes work properly
  useEffect(() => {
    if (!isCustomized) {
      clearAllInlineStyles();
    }
  }, []); // Only run on mount
  
  // Apply CSS variables whenever resolved tokens change
  // But only if there are actual customizations
  useEffect(() => {
    applyCSSVariables(resolvedTokens, isCustomized);
  }, [resolvedTokens, isCustomized]);
  
  // Save active theme to localStorage whenever it changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveActiveTheme(activeTheme);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTheme]);
  
  // Save custom themes to localStorage whenever they change
  useEffect(() => {
    saveCustomThemes(customThemes);
  }, [customThemes]);
  
  // Set token value (updates override for current mode)
  const setTokenValue = useCallback((tokenName: string, value: string, mode: 'light' | 'dark') => {
    setActiveTheme(prev => {
      const current = prev || {
        id: 'temp',
        name: 'Custom',
        baseThemeId: defaultBaseThemeId,
        lightOverrides: {},
        darkOverrides: {},
        createdAt: new Date().toISOString(),
      };
      
      const overridesKey = mode === 'dark' ? 'darkOverrides' : 'lightOverrides';
      const newOverrides = { ...current[overridesKey], [tokenName]: value };
      
      return {
        ...current,
        [overridesKey]: newOverrides,
      };
    });
  }, [defaultBaseThemeId]);
  
  // Reset to base theme (clear all overrides)
  const resetToBase = useCallback(() => {
    setActiveTheme(prev => {
      if (!prev) return null;
      return {
        ...prev,
        lightOverrides: {},
        darkOverrides: {},
      };
    });
  }, []);
  
  // Switch base theme
  const switchBaseTheme = useCallback((baseThemeId: string) => {
    const newBase = getBaseTheme(baseThemeId);
    if (!newBase) {
      console.error('Base theme not found:', baseThemeId);
      return;
    }
    
    setActiveTheme({
      id: 'temp',
      name: 'Custom',
      baseThemeId,
      lightOverrides: {},
      darkOverrides: {},
      createdAt: new Date().toISOString(),
    });
  }, []);
  
  // Save current theme as a custom theme
  const saveAsCustomTheme = useCallback((name: string) => {
    if (!activeTheme) return;
    
    const newTheme: CustomTheme = {
      ...activeTheme,
      id: `custom-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
    };
    
    setCustomThemes(prev => [...prev, newTheme]);
    setActiveTheme(newTheme);
  }, [activeTheme]);
  
  // Load a custom theme
  const loadCustomTheme = useCallback((themeId: string) => {
    const theme = customThemes.find(t => t.id === themeId);
    if (theme) {
      setActiveTheme(theme);
    }
  }, [customThemes]);
  
  // Delete a custom theme
  const deleteCustomTheme = useCallback((themeId: string) => {
    setCustomThemes(prev => prev.filter(t => t.id !== themeId));
    
    // If the deleted theme was active, reset to base
    if (activeTheme?.id === themeId) {
      setActiveTheme(null);
    }
  }, [activeTheme]);
  
  // Export theme as JSON
  const exportTheme = useCallback((): string => {
    if (!activeTheme) {
      return JSON.stringify({
        name: 'Empty Theme',
        baseThemeId: defaultBaseThemeId,
        lightOverrides: {},
        darkOverrides: {},
      }, null, 2);
    }
    
    return JSON.stringify({
      name: activeTheme.name,
      baseThemeId: activeTheme.baseThemeId,
      lightOverrides: activeTheme.lightOverrides,
      darkOverrides: activeTheme.darkOverrides,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }, [activeTheme, defaultBaseThemeId]);
  
  // Import theme from JSON
  const importTheme = useCallback((json: string): boolean => {
    try {
      const imported = JSON.parse(json);
      
      // Validate structure
      if (!imported.name || !imported.baseThemeId) {
        console.error('Invalid theme JSON structure');
        return false;
      }
      
      const newTheme: CustomTheme = {
        id: `custom-${Date.now()}`,
        name: imported.name,
        baseThemeId: imported.baseThemeId,
        lightOverrides: imported.lightOverrides || {},
        darkOverrides: imported.darkOverrides || {},
        createdAt: new Date().toISOString(),
      };
      
      setCustomThemes(prev => [...prev, newTheme]);
      setActiveTheme(newTheme);
      
      return true;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return false;
    }
  }, []);
  
  // Get current token value
  const getCurrentTokenValue = useCallback((tokenName: string): string | undefined => {
    return resolvedTokens[tokenName];
  }, [resolvedTokens]);
  
  const value = useMemo<ThemeCustomizationContextType>(() => ({
    activeTheme,
    baseTheme,
    isCustomized,
    setTokenValue,
    resetToBase,
    switchBaseTheme,
    saveAsCustomTheme,
    loadCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
    customThemes,
    getCurrentTokenValue,
  }), [
    activeTheme,
    baseTheme,
    isCustomized,
    setTokenValue,
    resetToBase,
    switchBaseTheme,
    saveAsCustomTheme,
    loadCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
    customThemes,
    getCurrentTokenValue,
  ]);
  
  return (
    <ThemeCustomizationContext.Provider value={value}>
      {children}
    </ThemeCustomizationContext.Provider>
  );
};

/**
 * Hook to use theme customization context
 */
export const useThemeCustomization = (): ThemeCustomizationContextType => {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error('useThemeCustomization must be used within ThemeCustomizationProvider');
  }
  return context;
};

