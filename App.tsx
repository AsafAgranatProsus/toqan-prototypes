import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { DesignSystemAltPage } from './pages/DesignSystemAltPage';
import { GradientPlaygroundPage, GradientFramesDemoPage, GradientPresetsDemo } from './pages';
import FeatureMenu from './components/FeatureMenu/FeatureMenu';
import ThemeDebugger from './components/ThemeDebugger/ThemeDebugger';
import { CustomizationPanel } from './components/CustomizationPanel/CustomizationPanel';
import { useFeatureFlags } from './context/FeatureFlagContext';
import { useConcept } from './context/ConceptContext';

// Concept-specific pages
import { RestaurantHomePage } from './concepts/restaurant';

// Inner component that has access to useLocation
const AppContent: React.FC = () => {
  const { flags } = useFeatureFlags();
  const { conceptId, setConcept } = useConcept();
  const location = useLocation();
  
  // Sync concept from route prefix (e.g., /restaurant/... sets restaurant concept)
  React.useEffect(() => {
    if (location.pathname.startsWith('/restaurant')) {
      if (conceptId !== 'restaurant') {
        setConcept('restaurant');
      }
    }
    // Note: We don't auto-switch back to 'core' when leaving concept routes
    // This allows users to navigate freely while staying in their concept
  }, [location.pathname, conceptId, setConcept]);
  
  // Check if we're on a standalone page
  const isStandalonePage = location.pathname === '/theme-builder' || 
                          location.pathname === '/gradient-playground' ||
                          location.pathname === '/gradient-frames-demo' ||
                          location.pathname === '/gradient-presets-demo';
  
  // Load panel state from localStorage
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(() => {
    try {
      const stored = localStorage.getItem('toqan-customization-panel-open');
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Persist panel state to localStorage
  const handleToggleCustomization = () => {
    setIsCustomizationOpen(prev => {
      const newState = !prev;
      try {
        localStorage.setItem('toqan-customization-panel-open', String(newState));
      } catch (error) {
        console.error('Failed to save panel state:', error);
      }
      return newState;
    });
  };

  // For standalone pages, render without the customization panel and feature menu
  if (isStandalonePage) {
    return (
      <Routes>
        <Route path="/theme-builder" element={<DesignSystemAltPage />} />
        <Route path="/gradient-playground" element={<GradientPlaygroundPage />} />
        <Route path="/gradient-frames-demo" element={<GradientFramesDemoPage />} />
        <Route path="/gradient-presets-demo" element={<GradientPresetsDemo />} />
      </Routes>
    );
  }

  // Check if we're on a concept-specific route
  const isConceptRoute = location.pathname.startsWith('/restaurant');
  
  // Render concept-specific routes
  if (isConceptRoute) {
    return (
      <>
        <CustomizationPanel 
          isOpen={isCustomizationOpen} 
          onToggle={handleToggleCustomization} 
        />
        <div 
          className="app-content" 
          style={{ 
            marginLeft: isCustomizationOpen ? '350px' : '0',
            transition: 'margin-left 0.3s cubic-bezier(0.05, 0.84, 0.31, 1)',
          }}
        >
          <FeatureMenu onOpenCustomization={() => {
            setIsCustomizationOpen(true);
            try {
              localStorage.setItem('toqan-customization-panel-open', 'true');
            } catch (error) {
              console.error('Failed to save panel state:', error);
            }
          }} />
          <Routes>
            {/* Restaurant concept routes */}
            <Route path="/restaurant" element={<RestaurantHomePage />} />
            <Route path="/restaurant/*" element={<RestaurantHomePage />} />
          </Routes>
          {flags.showThemeDebugger && <ThemeDebugger />}
        </div>
      </>
    );
  }

  return (
    <>
      <CustomizationPanel 
        isOpen={isCustomizationOpen} 
        onToggle={handleToggleCustomization} 
      />
      <div 
        className="app-content" 
        style={{ 
          marginLeft: isCustomizationOpen ? '350px' : '0',
          transition: 'margin-left 0.3s cubic-bezier(0.05, 0.84, 0.31, 1)',
        }}
      >
        <FeatureMenu onOpenCustomization={() => {
          setIsCustomizationOpen(true);
          try {
            localStorage.setItem('toqan-customization-panel-open', 'true');
          } catch (error) {
            console.error('Failed to save panel state:', error);
          }
        }} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/design-system/*" element={<DesignSystemPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {flags.showThemeDebugger && <ThemeDebugger />}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;