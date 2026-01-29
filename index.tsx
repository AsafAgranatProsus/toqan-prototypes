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
import { ConceptProvider } from './context/ConceptContext';
import { ComposerProvider } from './concepts/composer';
import { ChatSessionProvider } from './shared/chatSession';
import { initializeTheme } from './themes/colors/loadTheme';
import { registerRestaurantFlows } from './concepts/restaurant';
import { seedConversationsIfNeeded } from './concepts/restaurant/homeViewData';

// Initialize saved theme from localStorage
initializeTheme();

// Register concept-specific chat flows
registerRestaurantFlows();

// Seed pre-baked conversations for Jump Back In (must happen BEFORE ChatSessionProvider loads)
seedConversationsIfNeeded();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FeatureFlagProvider>
      <ConceptProvider>
        <ComposerProvider>
          <WorkspaceProvider>
            <ScenarioProvider>
              <DesignSystemProvider>
                <ThemeCustomizationProvider>
                  <ChatSessionProvider fallbackContext={{ conceptId: 'restaurant' }}>
                    <App />
                  </ChatSessionProvider>
                </ThemeCustomizationProvider>
              </DesignSystemProvider>
            </ScenarioProvider>
          </WorkspaceProvider>
        </ComposerProvider>
      </ConceptProvider>
    </FeatureFlagProvider>
  </React.StrictMode>
);