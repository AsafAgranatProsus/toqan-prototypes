import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { featureFlags as initialFlags } from '../featureFlags';

type FeatureFlags = typeof initialFlags;

interface FeatureFlagContextType {
  flags: FeatureFlags;
  setFlag: (flagName: keyof FeatureFlags, value: boolean) => void;
  isFeatureActive: (flagName: keyof FeatureFlags) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

const STORAGE_KEY = 'toqan-feature-flags';

// Load flags from localStorage and URL query parameters, merging with initial flags
const loadFlagsFromStorage = (): FeatureFlags => {
  // 1. Parse URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlFlags: Partial<FeatureFlags> = {};
  
  // 2. Extract flags from URL
  Object.keys(initialFlags).forEach((key) => {
    const paramValue = urlParams.get(key);
    if (paramValue !== null) {
      urlFlags[key as keyof FeatureFlags] = paramValue === 'true';
    }
  });
  
  // 3. Load from localStorage
  let storedFlags = initialFlags;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedFlags = JSON.parse(stored);
      // Merge with initial flags to ensure new flags are included
      storedFlags = { ...initialFlags, ...parsedFlags };
    }
  } catch (error) {
    console.error('Failed to load feature flags from localStorage:', error);
  }
  
  // 4. URL params override everything
  return { ...storedFlags, ...urlFlags };
};

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlags>(loadFlagsFromStorage);

  // Clean URL after loading feature flags from query parameters (optional)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if cleanUrl parameter is explicitly set to 'true'
    const shouldCleanUrl = urlParams.get('cleanUrl') === 'true';
    
    if (shouldCleanUrl) {
      const hasFeatureFlags = Object.keys(initialFlags).some(key => 
        urlParams.has(key)
      );
      
      if (hasFeatureFlags || urlParams.has('theme')) {
        // Remove all query params from URL without page reload
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []); // Run once on mount

  // Save flags to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    } catch (error) {
      console.error('Failed to save feature flags to localStorage:', error);
    }
  }, [flags]);

  const setFlag = useCallback((flagName: keyof FeatureFlags, value: boolean) => {
    setFlags(prevFlags => ({
      ...prevFlags,
      [flagName]: value,
    }));
  }, []);

  // Helper to check if a feature is active (requires BOTH newBranding AND the specific flag)
  // This mirrors the CSS pattern: .new-branding.new-feature { }
  // Only applies to flags with "new" prefix - other flags work independently
  const isFeatureActive = useCallback((flagName: keyof FeatureFlags): boolean => {
    // Special case: newBranding flag itself doesn't require coupling
    if (flagName === 'newBranding') {
      return flags.newBranding;
    }
    
    // Prototype features (with "new" prefix) require BOTH newBranding AND their specific flag
    // This matches CSS pattern: .new-branding.new-typography { }
    if (flagName.startsWith('new')) {
      return flags.newBranding && flags[flagName];
    }
    
    // Other features work independently (no coupling with newBranding)
    return flags[flagName];
  }, [flags]);

  return (
    <FeatureFlagContext.Provider value={{ flags, setFlag, isFeatureActive }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};