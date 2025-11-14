import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { featureFlags as initialFlags } from '../featureFlags';

type FeatureFlags = typeof initialFlags;

interface FeatureFlagContextType {
  flags: FeatureFlags;
  setFlag: (flagName: keyof FeatureFlags, value: boolean) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

const STORAGE_KEY = 'toqan-feature-flags';

// Load flags from localStorage, merging with initial flags
const loadFlagsFromStorage = (): FeatureFlags => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedFlags = JSON.parse(stored);
      // Merge with initial flags to ensure new flags are included
      return { ...initialFlags, ...parsedFlags };
    }
  } catch (error) {
    console.error('Failed to load feature flags from localStorage:', error);
  }
  return initialFlags;
};

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlags>(loadFlagsFromStorage);

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