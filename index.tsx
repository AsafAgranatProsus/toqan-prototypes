import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { DesignSystemProvider } from './context/DesignSystemContext';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { ScenarioProvider } from './context/ScenarioContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FeatureFlagProvider>
      <ScenarioProvider>
        <DesignSystemProvider>
          <App />
        </DesignSystemProvider>
      </ScenarioProvider>
    </FeatureFlagProvider>
  </React.StrictMode>
);