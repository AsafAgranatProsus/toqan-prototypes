import React, { createContext, useContext, useState, useCallback } from 'react';
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

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScenario, setActiveScenarioState] = useState<Scenario | null>(null);
  const [scenarioView, setScenarioViewState] = useState<ScenarioView>('after');

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