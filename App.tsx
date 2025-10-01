import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import { useViewport } from './hooks/useViewport';
import FeatureMenu from './components/FeatureMenu/FeatureMenu';
import { ScenarioProvider } from './context/ScenarioContext';
import { ScenarioView } from './types';

const App: React.FC = () => {
  const { width } = useViewport();
  const isMobile = width < 768;
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [scenarioView, setScenarioView] = useState<ScenarioView>('before');

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
    </div>
  );
};

export default App;