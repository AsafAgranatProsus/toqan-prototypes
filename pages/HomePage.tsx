import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { LeftSidebar } from '../components/LeftSidebar/LeftSidebar';
import { RightPanel } from '../components/RightPanel/RightPanel';
import MainContent from '../components/MainContent/MainContent';
import { TopNavbar } from '../components/TopNavbar/TopNavbar';
import { useViewport } from '../hooks/useViewport';
import { useScenarios } from '../context/ScenarioContext';

export const HomePage: React.FC = () => {
  const { width } = useViewport();
  const isMobile = width < 768;
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isRightPanelOpen, setRightPanelOpen] = useState(true);
  const { scenarioView } = useScenarios();

  return (
    <div className="app-container">
      <div className="app-layout">
        <TopNavbar
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          isMobile={isMobile}
        />

        {/* Old Sidebar - will be hidden when new sidebar feature is active */}
        <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
        
        {/* New Left Sidebar - only renders when both newBranding AND newLeftSidebar flags are active */}
        <LeftSidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
        
        <MainContent
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          isMobile={isMobile}
          scenarioView={scenarioView}
        />

        {/* New Right Panel - only renders when both newBranding AND newRightPanel flags are active */}
        <RightPanel isOpen={isRightPanelOpen} setOpen={setRightPanelOpen} isMobile={isMobile} />
      </div>
    </div>
  );
};

