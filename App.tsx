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
import { useConcept, CONCEPTS } from './context/ConceptContext';

// Inner component that has access to useLocation
const AppContent: React.FC = () => {
  const { flags } = useFeatureFlags();
  const { conceptId, setConcept } = useConcept();
  const location = useLocation();
  
  // Sync concept from route prefix (e.g., /restaurant/... sets restaurant concept)
  React.useEffect(() => {
    // Root path "/" always shows core concept
    if (location.pathname === '/') {
      if (conceptId !== 'core') {
        setConcept('core');
      }
      return;
    }
    
    // Check all concepts for matching route prefix
    for (const [id, concept] of Object.entries(CONCEPTS)) {
      if (concept.routePrefix && location.pathname.startsWith(concept.routePrefix)) {
        if (conceptId !== id) {
          setConcept(id as keyof typeof CONCEPTS);
        }
        return;
      }
    }
    // For other paths (e.g., /design-system), keep current concept
  }, [location.pathname, conceptId, setConcept]);
  
  // Check if we're on a standalone page (no FeatureMenu/CustomizationPanel)
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

  // Standard layout with FeatureMenu and CustomizationPanel
  // HomePage uses ComposedLayout which renders based on active concept's composer
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
          {/* Core routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/design-system/*" element={<DesignSystemPage />} />
          
          {/* Concept routes - all use HomePage with ComposedLayout */}
          {/* The composer pattern determines what components render */}
          <Route path="/restaurant" element={<HomePage />} />
          <Route path="/restaurant/*" element={<HomePage />} />
          
          {/* Fallback */}
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
