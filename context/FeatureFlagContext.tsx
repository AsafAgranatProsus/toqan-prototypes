import React, { createContext, useContext, useState, useCallback } from 'react';
import { featureFlags as initialFlags } from '../featureFlags';

type FeatureFlags = typeof initialFlags;

interface FeatureFlagContextType {
  flags: FeatureFlags;
  setFlag: (flagName: keyof FeatureFlags, value: boolean) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState(initialFlags);

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