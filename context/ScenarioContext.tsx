import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { scenarios, Scenario } from './scenarios';

type ScenarioView = 'before' | 'after';

interface ScenarioContextType {
  scenarios: Scenario[];
  activeScenario: Scenario | null;
  setActiveScenario: (prompt: string) => void;
  scenarioView: ScenarioView;
  setScenarioView: (view: ScenarioView) => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

const SCENARIO_VIEW_STORAGE_KEY = 'toqan-scenario-view';

// Load scenario view from localStorage
const loadScenarioView = (): ScenarioView => {
  try {
    const stored = localStorage.getItem(SCENARIO_VIEW_STORAGE_KEY);
    if (stored === 'before' || stored === 'after') {
      return stored;
    }
  } catch (error) {
    console.error('Failed to load scenario view from localStorage:', error);
  }
  return 'before'; // default
};

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScenario, setActiveScenarioState] = useState<Scenario | null>(null);
  const [scenarioView, setScenarioViewState] = useState<ScenarioView>(loadScenarioView);

  // Save scenario view to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SCENARIO_VIEW_STORAGE_KEY, scenarioView);
    } catch (error) {
      console.error('Failed to save scenario view to localStorage:', error);
    }
  }, [scenarioView]);

  const setActiveScenario = useCallback((prompt: string) => {
    const scenario = scenarios.find(s => s.prompt === prompt);
    setActiveScenarioState(scenario || null);
  }, []);

  const setScenarioView = useCallback((view: ScenarioView) => {
    setScenarioViewState(view);
  }, []);

  return (
    <ScenarioContext.Provider value={{ scenarios, activeScenario, setActiveScenario, scenarioView, setScenarioView }}>
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenarios = (): ScenarioContextType => {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenarios must be used within a ScenarioProvider');
  }
  return context;
};