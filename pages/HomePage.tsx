import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import MainContent from '../components/MainContent/MainContent';
import { useViewport } from '../hooks/useViewport';
import { useScenarios } from '../context/ScenarioContext';

export const HomePage: React.FC = () => {
  const { width } = useViewport();
  const isMobile = width < 768;
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { scenarioView } = useScenarios();

  return (
    <div className="app-container">
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
        <MainContent
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          isMobile={isMobile}
          scenarioView={scenarioView}
        />
      </div>
    </div>
  );
};

