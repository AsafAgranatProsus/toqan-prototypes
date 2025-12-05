import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
// Theme CSS is now loaded dynamically via FeatureMenu theme selector
// import './themes/colors/test-theme.css';
import { DesignSystemProvider } from './context/DesignSystemContext';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { ScenarioProvider } from './context/ScenarioContext';
import { ThemeCustomizationProvider } from './context/ThemeCustomizationContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { initializeTheme } from './themes/colors/loadTheme';

// Initialize saved theme from localStorage
initializeTheme();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FeatureFlagProvider>
      <WorkspaceProvider>
        <ScenarioProvider>
          <DesignSystemProvider>
            <ThemeCustomizationProvider>
              <App />
            </ThemeCustomizationProvider>
          </DesignSystemProvider>
        </ScenarioProvider>
      </WorkspaceProvider>
    </FeatureFlagProvider>
  </React.StrictMode>
);