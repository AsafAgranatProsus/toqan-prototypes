import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import DesignSystemDemo from './components/DesignSystemDemo/DesignSystemDemo';
import ThemeDebugger from './components/ThemeDebugger/ThemeDebugger';
import { useViewport } from './hooks/useViewport';
import { useFeatureFlags } from './context/FeatureFlagContext';
import FeatureMenu from './components/FeatureMenu/FeatureMenu';
import { ScenarioProvider } from './context/ScenarioContext';
import { ScenarioView } from './types';

const App: React.FC = () => {
  const { width } = useViewport();
  const { flags } = useFeatureFlags();
  const isMobile = width < 768;
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [scenarioView, setScenarioView] = useState<ScenarioView>('before');

  // Show Design System Demo if flag is enabled
  if (flags.showDesignSystemDemo) {
    return (
      <>
        <FeatureMenu scenarioView={scenarioView} setScenarioView={setScenarioView} />
        <DesignSystemDemo />
        {flags.showThemeDebugger && <ThemeDebugger />}
      </>
    );
  }

  // Normal app
  return (
    <div className="app-container">
      <FeatureMenu scenarioView={scenarioView} setScenarioView={setScenarioView} />
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
        <ScenarioProvider>
          <MainContent
            onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
            isMobile={isMobile}
            scenarioView={scenarioView}
          />
        </ScenarioProvider>
      </div>
      {flags.showThemeDebugger && <ThemeDebugger />}
    </div>
  );
};

export default App;