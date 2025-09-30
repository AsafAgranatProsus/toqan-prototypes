import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { useViewport } from './hooks/useViewport';

const App: React.FC = () => {
  const { width } = useViewport();
  const isMobile = width < 768;
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  return (
    <div className="app-container">
      
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
        <MainContent onMenuClick={() => setSidebarOpen(!isSidebarOpen)} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default App;