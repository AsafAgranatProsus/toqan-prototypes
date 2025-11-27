import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { featureFlags as initialFlags } from '../featureFlags';

type FeatureFlags = typeof initialFlags;

interface FeatureFlagContextType {
  flags: FeatureFlags;
  setFlag: (flagName: keyof FeatureFlags, value: boolean) => void;
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

  // Clean URL after loading feature flags from query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasFeatureFlags = Object.keys(initialFlags).some(key => 
      urlParams.has(key)
    );
    
    if (hasFeatureFlags) {
      // Remove query params from URL without page reload
      window.history.replaceState({}, '', window.location.pathname);
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

  return (
    <FeatureFlagContext.Provider value={{ flags, setFlag }}>
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